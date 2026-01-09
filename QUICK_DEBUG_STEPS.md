# Quick Debug Steps - WO Penyewaan Selesai Issue

## Step 1: Open the Problem URL

```
Navigate to: /wo/sewa/update/bfb7f566-5614-4415-92d9-855776c49991
```

## Step 2: Open Browser Console

- Press: **F12**
- Click: **Console** tab
- Keep it visible

## Step 3: Take Screenshot of Console Output

Scroll through the console and look for sections marked with:

```
═══════════════════════════════════════════
📡 BACKEND REQUEST DEBUG LOG
═══════════════════════════════════════════
```

or

```
❌ ERROR FETCHING WORK ORDER
═══════════════════════════════════════════
```

## Step 4: Key Information to Extract

### For SUCCESS (Status 200):

- [ ] `🔹 Status Code:` = \_\_\_
- [ ] `🔹 Response.data.data:` = exists? null? empty? \_\_\_
- [ ] `🔹 Status Value:` = \_\_\_
- [ ] All fields showing? \_\_\_

### For ERROR (Status 4xx/5xx):

- [ ] `🔹 Status Code:` = \_\_\_
- [ ] `🔹 Status Text:` = \_\_\_
- [ ] `🔹 Response Data (JSON):` = \_\_\_
- [ ] `🔹 Error Message from Backend:` = \_\_\_

## Step 5: Share Complete Output

Copy the ENTIRE console output section and send to backend team:

**Example Message to Backend:**

```
Hi, encountered issue with WO Penyewaan selesai status.

Trying to fetch: /wo/penyewaan/bfb7f566-5614-4415-92d9-855776c49991

Here's the complete debug output from console:

[PASTE ENTIRE CONSOLE OUTPUT HERE]

Can you check why the endpoint returns [no data / error / etc]?
```

## Quick Checks

- ✅ Is endpoint being called?
  - Look for: `🔹 Endpoint: /wo/penyewaan/...`

- ✅ Is request going through?
  - Look for: `📥 COMPLETE RESPONSE FROM BACKEND` or `❌ ERROR FETCHING`

- ✅ Is data null?
  - Look for: `🔹 Response.data.data:` = `null` or `undefined`

- ✅ Is status selesai?
  - Look for: `🔹 Status Value: selesai` (should show this)

---

**TIP:** If you see this:

```
⚠️ NO DATA RETURNED FROM ENDPOINT
```

That means backend returned Status 200 but with empty/null data. This is the main issue.
