# Complete Backend Response Debug Guide

## How to Capture Full Response

### Step 1: Open Browser Developer Tools

1. Press `F12` to open DevTools
2. Go to **Console** tab
3. Keep the console visible

### Step 2: Navigate to the Problem URL

- Go to: `wo/sewa/update/bfb7f566-5614-4415-92d9-855776c49991`
- The page will load and immediately make the API request

### Step 3: Read the Console Output

You will see comprehensive debug information in this format:

```
═══════════════════════════════════════════
📡 BACKEND REQUEST DEBUG LOG
═══════════════════════════════════════════
🔹 Endpoint: /wo/penyewaan/bfb7f566-5614-4415-92d9-855776c49991
🔹 Work Order ID: bfb7f566-5614-4415-92d9-855776c49991
🔹 Request Time: 2026-01-10T10:30:45.123Z

(If successful request):
═══════════════════════════════════════════
📥 COMPLETE RESPONSE FROM BACKEND
═══════════════════════════════════════════
🔹 Status Code: 200
🔹 Status Text: OK
🔹 Response Headers: { content-type: 'application/json', ... }
🔹 Complete Response Object: { ... }
🔹 Response.data: { status: true, message: 'Success', data: {...} }
🔹 Response.data.status: true
🔹 Response.data.message: 'Success'
🔹 Response.data.data: { id: 'bfb7f566...', status: 'selesai', ... }
✅ Data successfully extracted from response.data.data
🔹 Object Keys: ['id', 'customer_id', 'rental_asset_id', 'status', ...]
🔹 Status Value: selesai
🔹 Customer ID: uuid-xxx
🔹 Rental Asset ID: uuid-yyy
🔹 All Fields: { ... complete object ... }
═══════════════════════════════════════════✅

(If error):
❌ ERROR FETCHING WORK ORDER
═══════════════════════════════════════════
🔹 Error Message: ...
🔹 Error Code: ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 BACKEND RESPONSE ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔹 Status Code: 404 / 500 / etc
🔹 Status Text: Not Found / Server Error / etc
🔹 Response Data (JSON): { status: false, message: '...', ... }
🔹 Error Message from Backend: ...
🔹 Error Code from Backend: ...
```

---

## What Information to Share with Backend Team

### When Request Succeeds (Status 200) but No Data:

```
✅ Copy & Share with Backend:
- Endpoint: /wo/penyewaan/[ID]
- Status Code: 200
- Response.data.status: [true/false]
- Response.data.message: [message]
- Response.data.data: [null/empty/object]
- Expected: response.data.data should contain work order fields
- Actual: [what was received]
```

### When Request Fails (Status 4xx/5xx):

```
❌ Copy & Share with Backend:
- Endpoint: /wo/penyewaan/[ID]
- Status Code: [error code]
- Status Text: [error text]
- Response Data (JSON): [entire JSON response]
- Error Message: [backend error message]
- Error Code: [backend error code]
```

### When No Response at All:

```
❌ Copy & Share with Backend:
- Error Message: [what console shows]
- Error Stack: [stack trace]
- Network request status
- Check if endpoint URL exists
```

---

## Console Commands to Manually Inspect

In the browser console, you can run these commands:

### Copy Full Response as JSON

```javascript
// After the error/response happens, find the response in console logs
// Then copy it with: Ctrl+C from console or use:
copy(response) // This copies the object to clipboard
```

### Search Console Logs

```
Ctrl+F in console to search for:
- "RESPONSE FROM BACKEND"
- "ERROR FETCHING"
- Status code you're looking for
```

### Export Console Logs

1. Right-click in Console
2. Select "Save as..." to save console output
3. Share the file with backend team

---

## Information to Collect for Backend Team

Use the debug output to collect:

### 1. **Request Information**

- [ ] Endpoint URL: `/wo/penyewaan/{id}`
- [ ] HTTP Method: GET
- [ ] Work Order ID: `bfb7f566-5614-4415-92d9-855776c49991`
- [ ] Authentication: Included (JWT token)

### 2. **Response Information (Success Case)**

- [ ] HTTP Status Code: \_\_\_
- [ ] Status Text: \_\_\_
- [ ] Content-Type: \_\_\_
- [ ] Response Body Structure:
  ```
  {
    "status": ___ (true/false),
    "message": "___",
    "data": {
      "id": "___",
      "customer_id": "___",
      "rental_asset_id": "___",
      "status": "___",
      ... other fields
    }
  }
  ```

### 3. **Error Information (Failure Case)**

- [ ] HTTP Status Code: \_\_\_
- [ ] Error Message: \_\_\_
- [ ] Error Code: \_\_\_
- [ ] Error Details: \_\_\_

### 4. **Data Quality**

- [ ] Is `response.data.data` null? \_\_\_
- [ ] Is `response.data.data` empty? \_\_\_
- [ ] Does it have required fields? \_\_\_
- [ ] Status field value: \_\_\_

---

## Database Query to Check (Share with Backend Dev)

Backend should verify the query like this:

```sql
-- This is what SHOULD work:
SELECT * FROM workorder_penyewaan
WHERE id = 'bfb7f566-5614-4415-92d9-855776c49991'
AND status = 'selesai';

-- Check if this returns data:
-- If yes: Database has data, problem might be in API filtering
-- If no: No data exists in database for this ID+status combination
```

---

## Quick Troubleshooting Checklist

- [ ] Console shows successful response (Status 200)?
  - If YES: Check if `response.data.data` is null/empty
  - If NO: Check error message from backend

- [ ] Response structure correct?
  - Should have: `{ status: true/false, message: string, data: object }`
  - If different: Format mismatch

- [ ] Status is 'selesai'?
  - Check in: `🔹 Status Value: [value]`
  - If showing correct status but data is empty: Backend query problem

- [ ] Can access with different status?
  - Test with status='draft' or 'progress'
  - If works: Status filter is blocking 'selesai'
  - If doesn't work: Different issue

---

## How to Share with Backend Team

Copy the entire console output between the separator lines and send as:

```
Please check why the endpoint `/wo/penyewaan/{id}` returns:

[PASTE CONSOLE OUTPUT HERE]

For the work order ID: bfb7f566-5614-4415-92d9-855776c49991
When status is: selesai
```

---

**Last Updated**: 2026-01-10  
**For**: Debugging WO Penyewaan Selesai Issue
