# Log estimate submissions to Google Sheet (step-by-step)

You’ve opened a blank Google Sheet. Follow these steps in order.

---

## Step 1: Name the sheet

- At the top left, click **“Untitled spreadsheet”**.
- Type a name, e.g. **Estimate submissions**.
- Press Enter.

---

## Step 2: Add a header row (row 1)

- Click cell **A1** and type: `Timestamp`
- Then type these in the next cells in the same row:
  - **B1:** `Name`
  - **C1:** `Email`
  - **D1:** `Company`
  - **E1:** `Brief`
  - **F1:** `Estimate Status`
  - **G1:** `Project Type`
  - **H1:** `Timeline`
  - **I1:** `Cost Low`
  - **J1:** `Cost High`
  - **K1:** `Currency`
  - **L1:** `Whats Included`
  - **M1:** `Considerations`

(Optional: select row 1 and make it bold so it stands out as headers.)

---

## Step 3: Open Apps Script

- In the menu bar: **Extensions** → **Apps Script**.
- A new tab opens with the Apps Script editor and a file like `Code.gs` with a bit of sample code (e.g. a `function myFunction()`).

---

## Step 4: Replace the code

- In the editor, **select all** the existing code (Ctrl+A or Cmd+A).
- **Delete** it.
- **Paste** the code below (Ctrl+V or Cmd+V).

```javascript
// Optional: must match GOOGLE_SHEETS_WEBHOOK_SECRET in .env, or leave '' to allow anyone with the URL
var WEBHOOK_SECRET = '';

function doPost(e) {
  try {
    var raw = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    if (WEBHOOK_SECRET && raw._secret !== WEBHOOK_SECRET) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    delete raw._secret;
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      raw.timestamp || new Date().toISOString(),
      raw.name || '',
      raw.email || '',
      raw.company || '',
      (raw.brief || '').toString().slice(0, 50000),
      raw.estimateStatus || '',
      raw.projectType || '',
      raw.timeline || '',
      raw.costLow !== undefined && raw.costLow !== '' ? raw.costLow : '',
      raw.costHigh !== undefined && raw.costHigh !== '' ? raw.costHigh : '',
      raw.currency || '',
      (raw.whatsIncluded || '').toString().slice(0, 50000),
      (raw.considerations || '').toString().slice(0, 50000)
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

- **Save** (Ctrl+S or Cmd+S, or the disk icon). The project might ask for a name; e.g. **Estimate Webhook** is fine.

---

## Step 5: Deploy as Web app

- In the Apps Script tab, click **Deploy** → **New deployment**.
- Next to **Select type**, click the **gear icon** (⚙️) and choose **Web app**.
- Fill in:
  - **Description:** e.g. `Estimate submissions` (optional).
  - **Execute as:** **Me** (your Google account).
  - **Who has access:** **Anyone**.
- Click **Deploy**.

---

## Step 6: Authorize the script (first time only)

- A popup may ask **“Authorize access”**. Click **Authorize**.
- Choose your Google account if asked.
- You may see **“Google hasn’t verified this app”**. Click **Advanced** → **Go to [your project name] (unsafe)**. (It’s your own script; this is normal for personal Apps Script web apps.)
- Click **Allow** so the script can access your spreadsheet.

---

## Step 7: Copy the Web app URL

- After authorization, you’ll see **“Web app”** with a URL like:
  `https://script.google.com/macros/s/AKfycbz...long-id.../exec`
- Click **Copy** (or select the URL and copy it).
- Keep this URL; you’ll paste it into your project in the next step.

---

## Step 8: Add the URL to your project

- Open your project’s **`.env`** file (in the repo root, same folder as `package.json`).
- Add this line (paste your real URL in place of `YOUR_COPIED_URL`):

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_COPIED_URL/exec
```

Use the **full** URL you copied (it already ends with `/exec`). So it should look like:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbz.../exec
```

- **Optional:** To restrict who can send data, set a secret:
  - In `.env`:  
    `GOOGLE_SHEETS_WEBHOOK_SECRET=some-random-secret-phrase`
  - In the Apps Script, change the first line to:  
    `var WEBHOOK_SECRET = 'some-random-secret-phrase';`  
    (same phrase), then **Save** and **Deploy** → **Manage deployments** → **Edit** (pencil) → **Version** → **New version** → **Deploy**.

- Save `.env` and restart your dev server if it’s running.

---

## Step 9: Test it

- In your app, go through the estimator, get an estimate, fill in name/email, and click **Send brief & get in touch**.
- Open your Google Sheet again. You should see a **new row** (row 2) with the submission: timestamp, name, email, company, brief, estimate fields, etc.

If no row appears, check the browser Network tab for the `/api/estimate/send` request and your server logs for any “Sheets webhook” message. Double-check that `GOOGLE_SHEETS_WEBHOOK_URL` in `.env` is exactly the URL from Step 7 (no extra spaces or quotes).

---

That’s it. Every time someone sends a brief from the estimator, a new row will be appended to this sheet. No Google API key or Cloud project required.
