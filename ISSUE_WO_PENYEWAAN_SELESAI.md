# Issue Report: WO Penyewaan Update Endpoint Not Displaying Data for Completed Status

## Issue Description

The endpoint `wo/sewa/update/{id}` (bfb7f566-5614-4415-92d9-855776c49991) is not displaying work order rental data when the status is "selesai" (completed).

## Root Cause Analysis

The problem appears to be in the data fetching mechanism in `EditWoPenyewaan.vue`:

1. **Endpoint Path**: The component calls `/wo/penyewaan/{id}` to fetch the rental work order data
2. **Potential Backend Filter**: The backend endpoint might be applying a filter that excludes or doesn't return records with status "selesai"
3. **Poor Error Handling**: The previous error handling didn't provide detailed feedback about why data wasn't loading

## File Modified

- **File**: `src/pages/EditWoPenyewaan.vue`
- **Function**: `getWorkOrderPenyewaanByID()`

## Changes Applied

### 1. Enhanced Logging

Added comprehensive console logging to track:

- When the function is called
- The work order ID being requested
- Response data structure
- Any errors or warnings

### 2. Improved Error Handling

- Added validation to check if response contains data
- Display user-friendly error messages when data is not found
- Include the work order ID in error messages for debugging
- Show specific backend error messages if available

### 3. Better User Feedback

- Toast notification now displays when data cannot be loaded
- Error messages include:
  - Specific error reason
  - Work order ID that was attempted
  - Instructions to check the penyewaan status

## Code Changes Summary

```javascript
// Before: Silent failure with no user feedback
async function getWorkOrderPenyewaanByID() {
  try {
    const response = await api.get(`/wo/penyewaan/${workorder_id}`)
    // ... process data ...
  } catch (error) {
    console.error('Error fetching work order by ID:', error)
    // No user feedback!
  }
}

// After: Comprehensive error handling with user feedback
async function getWorkOrderPenyewaanByID() {
  loadingStore.show()
  if (!workorder_id) {
    console.warn('No work order ID provided')
    loadingStore.hide()
    return
  }
  try {
    console.log('Fetching work order penyewaan with ID:', workorder_id)
    const response = await api.get(`/wo/penyewaan/${workorder_id}`)

    // Check if response has data
    if (!response.data || !response.data.data) {
      console.warn('No data returned from endpoint:', response)
      message_toast.value = 'Data work order tidak ditemukan. Silakan periksa status penyewaan.'
      show_toast.value = true
      loadingStore.hide()
      return
    }

    // ... process data with detailed logging ...
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || 'Gagal memuat data work order'
    message_toast.value = `Error: ${errorMessage}. ID yang diakses: ${workorder_id}`
    show_toast.value = true
  }
}
```

## Next Steps - Backend Verification Required

The frontend has been improved, but the root cause is likely on the backend. Please verify:

### 1. Check Backend Endpoint

- **Endpoint**: `/wo/penyewaan/{id}`
- **Issue**: May not return records when status = "selesai"
- **Solution**: Remove any status filters that exclude "selesai" records

### 2. Verify Database Query

The backend query should:

```sql
SELECT * FROM workorder_penyewaan
WHERE id = {id}
-- SHOULD NOT have: AND status != 'selesai'
```

### 3. Test Cases

After backend fix, test these scenarios:

- [ ] Fetch rental WO with status "draft"
- [ ] Fetch rental WO with status "progress"
- [ ] Fetch rental WO with status "waiting signature"
- [ ] Fetch rental WO with status "selesai" ← This is currently failing

## Testing Instructions

1. **In Browser Console**: The improved logging will show:
   - Request ID: `console.log('Fetching work order penyewaan with ID:', workorder_id)`
   - Response: `console.log('Fetched work order data:', dataku)`

2. **User-Facing**:
   - If data loads successfully → displays the rental WO form
   - If data fails to load → shows toast notification with error message including the WO ID

3. **Network Tab**:
   - Check the response from `/wo/penyewaan/{id}` endpoint
   - Verify it returns data structure with `status` field

## Debugging Tips

If the issue persists after these changes:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Reload the page with the problematic WO ID
4. Look for request to `/wo/penyewaan/{id}`
5. Check the response:
   - Is `data.data` present?
   - What is the status value?
   - Are there any error messages?

6. Check Console for the detailed logs added

## Related Files

- `src/pages/EditWoPenyewaan.vue` - Frontend form component
- `src/pages/TableWorkOrderAll.vue` - Navigation to the update page
- Backend: `/wo/penyewaan/{id}` endpoint (not included in this repo)

---

**Last Updated**: 2026-01-10
**Status**: Frontend improved with better error handling. Backend verification pending.
