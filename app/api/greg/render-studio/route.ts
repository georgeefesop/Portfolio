/**
 * AI Render Studio - private admin tool for Gregory.
 *
 * POST /api/greg/render-studio  (multipart/form-data)
 *   brief, count, refs[]   ->  { batchId, quota }
 *
 *   Turns a plain-English brief into strong image-generation prompts via the
 *   Anthropic API, generates one render per prompt on Runware, re-hosts each
 *   finished image in Supabase Storage (Runware CDN URLs expire) and records
 *   a greg_render_jobs row per render. Returns a batch id for the page to poll.
 *
 * GET /api/greg/render-studio?batch=<id>  ->  { jobs, quota }
 *   Poll a batch's jobs. quota is also returned so the page stays current.
 *
 * Hard cap: 10 generations per rolling 7 days (status != 'failed').
 */

import { type NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, cookieValid } from '@/lib/greg/admin-auth';
import { getGregSupabase } from '@/lib/greg/supabase';

export const runtime = 'nodejs';
// Generation runs inline (Claude prompt-craft + Runware + re-host). Give the
// function room; Vercel clamps this to the plan's ceiling.
export const maxDuration = 300;

const BUCKET = 'greg-uploads';
const WEEKLY_CAP = 10;
const MAX_COUNT = 4;
const MAX_REFS = 4;

// Nano Banana Pro, 16:9 1K - a supported dimension (see image-generation skill).
const RUNWARE_MODEL = 'google:4@2';
const RENDER_W = 1376;
const RENDER_H = 768;

type JobRow = {
  id: string;
  status: string;
  prompt: string | null;
  image_url: string | null;
  error: string | null;
  cost: number | null;
  created_at: string;
};

type Quota = { used: number; cap: number; remaining: number };

/** Prompt-craft guidance fed to Claude so it writes vivid, specific prompts. */
const SYSTEM_PROMPT = `You are a prompt engineer for an architectural visualisation tool. A Cyprus building contractor describes, in plain words, a renovation or new-build he wants to show a client. Your job is to turn each request into ONE richly detailed image-generation prompt for the Nano Banana Pro model.

Write each prompt as flowing natural prose (not comma-soup keywords), stacking these layers in order:
1. Subject - the building, extension, room or outdoor structure, with concrete architectural detail.
2. Setting - a believable Cyprus / Mediterranean context: terrain, vegetation (olive trees, bougainvillea, cypress), neighbouring scale.
3. Materials & finish - name real surfaces: white render, local limestone, timber, anthracite aluminium frames, terracotta, exposed concrete.
4. Composition - a flattering architectural framing: three-quarter exterior view or a wide interior, eye-level, rule-of-thirds, generous sky or negative space.
5. Lighting - warm late-afternoon Mediterranean sun, soft shadows, clear sky, gentle ambient fill.
6. Camera - shot on a full-frame camera with a 24mm or 35mm architectural lens, crisp, true-to-life colour, natural depth.
7. Mood - aspirational but realistic; a photograph an architect would proudly show a client.

Rules:
- Output a believable PHOTOREALISTIC architectural photograph, never a cartoon, sketch or obvious CGI.
- Be specific and concrete. Invent sensible architectural detail where the brief is vague.
- No people, no text, no watermarks, no logos in the scene.
- If the contractor asked for multiple renders, vary the angle, time of day or framing between them so the set feels like a real shoot.

Return ONLY a JSON array of prompt strings - exactly the number requested, nothing else. No markdown fences, no commentary.`;

function quotaFrom(used: number): Quota {
  return { used, cap: WEEKLY_CAP, remaining: Math.max(0, WEEKLY_CAP - used) };
}

/** Count render jobs in the last rolling 7 days that did not fail. */
async function weeklyUsed(
  supabase: NonNullable<ReturnType<typeof getGregSupabase>>,
): Promise<number> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from('greg_render_jobs')
    .select('id', { count: 'exact', head: true })
    .gt('created_at', since)
    .neq('status', 'failed');
  if (error) {
    console.error('[render-studio] quota count error', error.message);
    // Fail closed: if we cannot count, treat the cap as reached.
    return WEEKLY_CAP;
  }
  return count ?? 0;
}

/** Ask Claude to turn the brief into `count` image-generation prompts. */
async function buildPrompts(brief: string, count: number): Promise<string[]> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('render_unavailable');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-7',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Contractor's brief:\n"""${brief}"""\n\nReturn a JSON array of exactly ${count} image-generation prompt string${count > 1 ? 's' : ''}.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    console.error('[render-studio] anthropic http', res.status);
    throw new Error('prompt_failed');
  }

  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  const text = (data.content ?? [])
    .filter((b) => b.type === 'text' && b.text)
    .map((b) => b.text as string)
    .join('\n')
    .trim();

  const match = text.match(/\[[\s\S]*\]/);
  if (!match) {
    console.error('[render-studio] no JSON array in anthropic reply');
    throw new Error('prompt_failed');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    throw new Error('prompt_failed');
  }
  if (!Array.isArray(parsed)) throw new Error('prompt_failed');

  const prompts = parsed
    .filter((p): p is string => typeof p === 'string' && p.trim().length > 0)
    .map((p) => p.trim())
    .slice(0, count);

  if (!prompts.length) throw new Error('prompt_failed');
  // Pad with the last prompt if Claude under-delivered, so counts line up.
  while (prompts.length < count) prompts.push(prompts[prompts.length - 1]);
  return prompts;
}

type RunwareResult = { imageURL: string; cost: number | null };

/** Generate one image per prompt on Runware. Order matches `prompts`. */
async function runwareGenerate(prompts: string[]): Promise<RunwareResult[]> {
  const key = process.env.RUNWARE_API_KEY;
  if (!key) throw new Error('render_unavailable');

  const tasks = prompts.map((positivePrompt) => ({
    taskType: 'imageInference',
    taskUUID: crypto.randomUUID(),
    model: RUNWARE_MODEL,
    positivePrompt,
    width: RENDER_W,
    height: RENDER_H,
    numberResults: 1,
    includeCost: true,
    outputFormat: 'JPEG',
  }));

  const res = await fetch('https://api.runware.ai/v1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(tasks),
  });

  if (!res.ok) {
    console.error('[render-studio] runware http', res.status);
    throw new Error('render_failed');
  }

  const data = (await res.json()) as {
    data?: { taskUUID: string; imageURL?: string; cost?: number }[];
  };
  const rows = data.data ?? [];

  // Map results back to the prompt order via taskUUID.
  return tasks.map((t) => {
    const hit = rows.find((r) => r.taskUUID === t.taskUUID);
    return {
      imageURL: hit?.imageURL ?? '',
      cost: typeof hit?.cost === 'number' ? hit.cost : null,
    };
  });
}

/** Download a Runware image and re-host it in Supabase Storage; returns a permanent URL. */
async function rehost(
  supabase: NonNullable<ReturnType<typeof getGregSupabase>>,
  jobId: string,
  cdnUrl: string,
): Promise<string> {
  const res = await fetch(cdnUrl);
  if (!res.ok) throw new Error('download_failed');
  const buffer = Buffer.from(await res.arrayBuffer());
  const path = `render-studio/${jobId}.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: 'image/jpeg',
    upsert: true,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error('public_url_failed');
  return data.publicUrl;
}

/** Store reference photos under render-studio/refs/ so the brief keeps its context. */
async function storeRefs(
  supabase: NonNullable<ReturnType<typeof getGregSupabase>>,
  batchId: string,
  refs: File[],
): Promise<void> {
  for (let i = 0; i < refs.length; i++) {
    try {
      const buffer = Buffer.from(await refs[i].arrayBuffer());
      const path = `render-studio/refs/${batchId}/${i + 1}.jpg`;
      await supabase.storage.from(BUCKET).upload(path, buffer, {
        contentType: refs[i].type || 'image/jpeg',
        upsert: true,
      });
    } catch (err) {
      console.error(
        '[render-studio] ref upload failed',
        err instanceof Error ? err.message : err,
      );
    }
  }
}

export async function POST(request: NextRequest) {
  if (!cookieValid(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const supabase = getGregSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'render_unavailable' }, { status: 503 });
  }
  if (!process.env.ANTHROPIC_API_KEY || !process.env.RUNWARE_API_KEY) {
    return NextResponse.json({ error: 'render_unavailable' }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'invalid_form' }, { status: 400 });
  }

  const brief =
    typeof form.get('brief') === 'string'
      ? (form.get('brief') as string).trim().slice(0, 2000)
      : '';
  const count = Math.min(
    MAX_COUNT,
    Math.max(1, Math.round(Number(form.get('count')) || 1)),
  );

  if (!brief) {
    return NextResponse.json(
      { error: 'Describe the render you want to create.' },
      { status: 400 },
    );
  }

  // Weekly guardrail.
  const used = await weeklyUsed(supabase);
  if (used + count > WEEKLY_CAP) {
    const remaining = Math.max(0, WEEKLY_CAP - used);
    return NextResponse.json(
      {
        error:
          remaining === 0
            ? `You have used all ${WEEKLY_CAP} renders for this week. The limit resets as older renders age past 7 days.`
            : `That would go over the weekly limit of ${WEEKLY_CAP}. You have ${remaining} left this week.`,
        quota: quotaFrom(used),
      },
      { status: 429 },
    );
  }

  const refs = form
    .getAll('refs')
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, MAX_REFS);

  const batchId = crypto.randomUUID();

  // Step 1 - brief -> prompts via Claude.
  let prompts: string[];
  try {
    prompts = await buildPrompts(brief, count);
  } catch (err) {
    const code = err instanceof Error ? err.message : 'prompt_failed';
    return NextResponse.json(
      { error: code === 'render_unavailable' ? code : 'prompt_failed' },
      { status: code === 'render_unavailable' ? 503 : 502 },
    );
  }

  // Reference photos are stored for the record; non-fatal if they fail.
  if (refs.length) await storeRefs(supabase, batchId, refs);

  // Step 2 - insert one job row per prompt, status 'generating'.
  const seedRows = prompts.map((prompt) => ({
    batch_id: batchId,
    status: 'generating',
    brief,
    prompt,
    model: RUNWARE_MODEL,
    width: RENDER_W,
    height: RENDER_H,
  }));
  const { data: inserted, error: insertErr } = await supabase
    .from('greg_render_jobs')
    .insert(seedRows)
    .select('id, prompt');

  if (insertErr || !inserted?.length) {
    console.error('[render-studio] insert error', insertErr?.message);
    return NextResponse.json({ error: 'render_failed' }, { status: 502 });
  }

  // Step 3 - generate on Runware. On a whole-batch failure, mark every row failed.
  let results: RunwareResult[];
  try {
    results = await runwareGenerate(prompts);
  } catch {
    await supabase
      .from('greg_render_jobs')
      .update({
        status: 'failed',
        error: 'Image generation failed. Please try again.',
        completed_at: new Date().toISOString(),
      })
      .eq('batch_id', batchId);
    return NextResponse.json(
      { error: 'render_failed', batchId, quota: quotaFrom(used + count) },
      { status: 502 },
    );
  }

  // Step 4 - re-host each image and finalise its row.
  await Promise.all(
    inserted.map(async (row, i) => {
      const id = row.id as string;
      const result = results[i];
      const completedAt = new Date().toISOString();
      try {
        if (!result?.imageURL) throw new Error('No image returned.');
        const permanentUrl = await rehost(supabase, id, result.imageURL);
        await supabase
          .from('greg_render_jobs')
          .update({
            status: 'done',
            image_url: permanentUrl,
            cost: result.cost,
            completed_at: completedAt,
          })
          .eq('id', id);
      } catch (err) {
        console.error(
          '[render-studio] finalise failed',
          err instanceof Error ? err.message : err,
        );
        await supabase
          .from('greg_render_jobs')
          .update({
            status: 'failed',
            error: 'This render could not be saved. Please try again.',
            cost: result?.cost ?? null,
            completed_at: completedAt,
          })
          .eq('id', id);
      }
    }),
  );

  return NextResponse.json({
    batchId,
    quota: quotaFrom(used + count),
  });
}

export async function GET(request: NextRequest) {
  if (!cookieValid(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const supabase = getGregSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'render_unavailable' }, { status: 503 });
  }

  const used = await weeklyUsed(supabase);
  const quota = quotaFrom(used);

  const batch = request.nextUrl.searchParams.get('batch');
  if (!batch) {
    return NextResponse.json({ jobs: [], quota });
  }

  const { data, error } = await supabase
    .from('greg_render_jobs')
    .select('id, status, prompt, image_url, error, cost, created_at')
    .eq('batch_id', batch)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[render-studio] poll error', error.message);
    return NextResponse.json({ error: 'poll_failed', quota }, { status: 502 });
  }

  return NextResponse.json({ jobs: (data ?? []) as JobRow[], quota });
}
