# Google Sheets CRM Setup Guide

This guide will turn a Google Sheet into a live database for your portfolio leads.

### 1. Create the Google Sheet

1. Go to [sheets.new](https://sheets.new).
2. Name it `Portfolio Leads DB`.
3. In the first row, add these **exact headers**:
   `id`, `timestamp`, `name`, `email`, `company`, `brief`, `projectType`, `budgetRange`, `source`, `leadScore`, `gapAnalysis`

### 2. Add the Script

1. In the Sheet, go to **Extensions > Apps Script**.
2. Delete any code there and paste the following:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var params = JSON.parse(e.postData.contents);
  
  // Security Check (Optional but recommended)
  // var secret = "MY_SECRET_KEY";
  // if (params._secret !== secret) return ContentService.createTextOutput("Unauthorized");

  var row = [
    params.id || Utilities.getUuid(), // Use provided ID or generate one
    new Date(),
    params.name || '',
    params.email || '',
    params.company || '',
    params.brief || '',
    params.projectType || '',
    params.budgetRange || '',
    params.source || '',
    params.leadScore || '',
    params.gapAnalysis || ''
  ];
  
  sheet.appendRow(row);
  return ContentService.createTextOutput("Success");
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var headers = rows[0];
  var data = rows.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(header, i) {
      obj[header] = row[i];
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 3. Deploy as Web App (Crucial)

1. Click **Deploy > New deployment**.
2. **Select type**: Web app.
3. **Description**: "CRM Webhook".
4. **Execute as**: `Me` (your email).
5. **Who has access**: `Anyone` (Must be "Anyone" so your portfolio can send data).
6. Click **Deploy**.

### 4. Connect to Your Portfolio

1. Copy the **Web App URL** (starts with `https://script.google.com/...`).
2. Open your project's `.env` file.
3. Paste it here:

   ```env
   GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_LONG_ID/exec"
   ```

### 5. Test

1. Restart your development server (`npm run dev`) to load the new `.env`.
2. Submit a contact form on your localhost.
3. **Check the Google Sheet** — the row should appear instantly!
