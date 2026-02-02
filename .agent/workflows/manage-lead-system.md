---
description: How to manage, update, and deploy the Lead Command Center & Google Sheets CRM.
---

# Manage Lead Command Center & CRM

This workflow details the architecture and maintenance steps for the "Smart CRM" system, which includes the Local Admin Dashboard and the Live Google Sheets integration.

## 1. Architecture Overview

 The system uses a **Dual-Database Strategy** to ensure security and developer experience.

| Component | Storage Source | Purpose |
| :--- | :--- | :--- |
| **Live Website** | **Google Sheets** (via Webhook) | **Permanent Master Record**. All submissions (Contact Form & Estimator) are sent here explicitly via `doPost`. |
| **Local Dashboard** | **`data/leads.json`** (Local File) | **Development Workbench**. Used for testing, refining UI, and managing leads during development. |
| **Admin UI** | **Hybrid** | Can toggle between editing Local JSON (rw) and viewing Live Sheets (ro). |

### Data Flow

1. **User Submits Form** (`/api/contact` or `/api/estimate`)
    * --> Saves to `leads.json` (Local Copy)
    * --> POSTs to Google Apps Script Webhook (Live Copy)
    * --> Sends Email (Resend)

## 2. Modifying the Schema (Adding Fields)

If you want to track a new piece of data (e.g., "Phone Number"), you must update it in **4 places**:

### Step 1: Update the Interface

* **File**: `lib/leads-db.ts`
* Add the field to the `Lead` interface.

### Step 2: Update the API Handlers

* **File**: `app/api/contact/route.ts` & `app/api/estimate/route.ts`
* Ensure the new field is extracted from the request/AI result and passed to:
    1. `saveLead()` (Local DB)
    2. The `fetch(webhookUrl)` payload (Google Sheets)

### Step 3: Update Google Sheets Headers

* **Action**: Open your "Portfolio Leads DB" Sheet.
* Add the new specific header name to Row 1 (e.g., Column O -> `phoneNumber`).

### Step 4: Update Google Apps Script

* **Action**: Extensions > Apps Script.
* Update `doPost(e)` to extract the new param: `params.phoneNumber || ''`.
* Add it to the `row` array **in the exact order of your Sheet Headers**.
* **CRITICAL**: `Deploy > Manage Deployments > Edit > New Version > Deploy`.

## 3. Managing the Admin Dashboard (`/admin/leads`)

The dashboard is located at `app/admin/leads/page.tsx`.

* **Live Mode Toggle**:
  * Fetches from `POST /api/admin/leads?source=live`.
  * The API proxies a GET request to the Google Script `doGet` function.
  * **Read-Only**: Edit/Delete buttons are disabled in this mode to prevent desync.

* **Local Edit Mode**:
  * Fetches from `data/leads.json`.
  * Supports full CRUD (Edit fields, Delete rows).
  * Used for testing the dashboard UI itself.

## 4. Troubleshooting

* **"Live View is Empty"**:
  * Did you redeploy the Apps Script as a **New Version**? (Updates don't apply to the 'Exec' URL unless versioned).
  * Is `doGet` function defined in the script?

* **"Columns Missing in Sheet"**:
  * Check `app/api/contact/route.ts`. Is the field being sent in the `body`?
  * Check Apps Script `doPost`. Is it mapping `params.yourField` to the correct array index?

## 5. Google Sheets Setup Reference

See `GOOGLE_SHEETS_SETUP.md` for the exact Script Code and Header definition.
