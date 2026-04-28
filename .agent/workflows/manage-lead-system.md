---
description: How to manage, update, and deploy the Lead Command Center & Google Sheets CRM.
---

# Manage Lead Command Center & CRM

This workflow details the architecture, maintenance, and usage of the "Smart CRM" system, which creates a centralized command center for handling incoming leads from the Project Estimator and Contact Form.

## 1. Architecture Overview

The system uses a **Dual-Database Strategy** to ensure both a great developer experience (local speed) and a reliable production record (Google Sheets).

### Components

| Component | Storage Source | Purpose |
| :--- | :--- | :--- |
| **Live Master DB** | **Google Sheets** (via Webhook) | **Permanent Record**. All leads (Contact Form & Estimator) are sent here via a robust Webhook (`doPost`). This acts as the "Hard Database" for the business. |
| **Local Dashboard** | **`data/leads.json`** (Local File) | **Development Workbench**. Allows for testing UI changes, managing leads locally, and debugging without polluting production data. |
| **Email Service** | **Resend** | Transactional emails for "New Inquiry" (Admin) and "Estimate Confirmation" (User). |
| **Admin UI** | `/admin/leads` | A Next.js interface to manage leads. Toggles between **Local** (Read/Write) and **Live** (Read-Only) views. |

### Data Model (`lib/leads-db.ts`)

The system tracks `Lead` objects containing:

- **Core**: `id`, `name`, `email`, `company`, `status`
- **Estimator Intelligence**: `leadScore` (0-10), `gapAnalysis`, `leadScoreReasoning`
- **Project Data**: `initialBrief`, `finalBrief`, `budgetRange`, `timeline`

---

## 2. Data Flow

When a user submits a form (Estimator or Contact):

1. **Frontend**: Submits JSON payload to `/api/estimate` or `/api/contact`.
2. **Server (Next.js API)**:
    - **AI Analysis**: (Estimator only) GPT-4o generates a `leadScore` and `gapAnalysis`.
    - **Local Save**: Writes data to `data/leads.json` via `fs`.
    - **Resend Email**: Sends an admin notification to you and a confirmation to the user.
    - **Sheet Sync**: Asynchronously POSTs the payload to the **Google Apps Script Webhook**.
3. **Google Sheets**:
    - Apps Script (`doPost`) receives the JSON.
    - Validates security/secret (optional).
    - Appends a new row to the `Portfolio Leads DB` Sheet.

---

## 3. Setup & Configuration

### Environment Variables (.env)

Ensure these are set for the system to function:

```env
# AI & Email
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...

# Google Sheets Integration
GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
GOOGLE_SHEETS_WEBHOOK_SECRET="optional_secret_key"
```

### Google Sheets Setup

For the exact Apps Script code and Header row requirements, refer to:
👉 **[GOOGLE_SHEETS_SETUP.md](../../GOOGLE_SHEETS_SETUP.md)**

**Critical Rule:** The order of fields in the `doPost` script **MUST** match the column order in your Google Sheet.

---

## 4. Using the Admin Dashboard (`/admin/leads`)

Access the dashboard at `http://localhost:3000/admin/leads`.

### Features

* **KPI Cards**: High-level view of Avg Score, Conversion Rate, and High-Value Leads.
- **Expandable Rows**: Click any lead to see the "Dossier View"—AI reasoning, full gap analysis, and drafted emails.
- **Live vs. Local**:
  - **LOCAL Mode**: Full Read/Write access to `leads.json`. Use this to test the dashboard features.
  - **LIVE Mode**: Read-Only view of the Google Sheet (via proxy). Useful for checking production data without leaving the app.

---

## 5. Modifying the Schema (Adding Fields)

If you want to track a new piece of data (e.g., "Phone Number"), follow this **strict 4-step process**:

### Step 1: Update Type Definitions

* **File**: `lib/leads-db.ts`
- Add `phoneNumber?: string;` to the `Lead` interface.

### Step 2: Update API Logic

* **Files**: `app/api/contact/route.ts` & `app/api/estimate/route.ts`
- Extract `phoneNumber` from the request body.
- Pass it to `saveLead()` (Local DB).
- Add it to the `webhookUrl` fetch payload (Google Sheets).

### Step 3: Update Google Sheet Headers

* **Action**: Open the Sheet.
- Add a new column header `phoneNumber` in Row 1.

### Step 4: Update Apps Script

* **Action**: Extensions > Apps Script.
- Update `doPost(e)` to extract `raw.phoneNumber`.
- Add it to the `sheet.appendRow([...])` array in the **correct index** matching the Sheet column.
- **CRITICAL**: `Deploy > Manage Deployments > Edit > New Version > Deploy`.

---

## 6. Troubleshooting

### "Live View is Empty or Fails"

* **Cause**: The Apps Script `doGet` function might be missing or broken.
- **Fix**: Ensure `doGet` returns JSON data of the sheet rows. Check `GOOGLE_SHEETS_SETUP.md`.

### "Data doesn't appear in Sheets"

* **Cause**: Webhook URL is wrong or Script wasn't redeployed.
- **Fix**:
    1. Check `GOOGLE_SHEETS_WEBHOOK_URL` in `.env`.
    2. Go to Apps Script -> Deploy -> Manage Deployments -> **Update to a NEW VERSION**.

### "Admin Dashboard is loading forever"

* **Cause**: `fs` read error or JSON corruption.
- **Fix**: Check `data/leads.json`. If it's malformed, delete the file content and reset to `[]`.
