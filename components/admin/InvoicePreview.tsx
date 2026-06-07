'use client';

import { useRef } from 'react';
import { Printer } from 'lucide-react';

/**
 * Render a full invoice HTML document inside an isolated iframe and offer
 * a "Download PDF" button that triggers the browser's print dialog on the
 * iframe (the template carries `@page { size: A4; margin: 0 }`, so Save
 * as PDF is deterministic). See ADR 4 in the P1 plan.
 */
export default function InvoicePreview({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  function downloadPdf() {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      win.focus();
      win.print();
    } catch {
      // Some browsers throw when the iframe is not focused yet; swallow and
      // let the user trigger again.
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={downloadPdf}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-medium bg-bg-tertiary px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-accent-primary/60"
        >
          <Printer size={15} aria-hidden />
          Download PDF
        </button>
      </div>
      <iframe
        ref={iframeRef}
        className="h-[80vh] w-full rounded-xl border border-border-subtle bg-white"
        srcDoc={html}
        title="Invoice preview"
      />
    </div>
  );
}
