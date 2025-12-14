# TODO: Implement Chart of Accounts Page

## Tasks

- [ ] Create TableChartOfAccounts.vue page with table layout
- [ ] Add route for /chart-of-accounts in router/index.js
- [ ] Implement table columns: code, name, type, category, is_active (toggle button)
- [ ] Add edit and delete buttons to table rows
- [ ] Add "Tambah" button to open modal
- [ ] Create modal component for add/edit with form fields
- [ ] Implement dropdown for type: ('cash','bank','asset', 'liability', 'equity', 'revenue', 'expense')
- [ ] Implement dropdown for normal_balance: ('debit','credit')
- [ ] Implement toggle for is_active
- [ ] Implement GET chart-of-accounts API call to fetch data
- [ ] Implement POST chart-of-accounts API call for adding new CoA
- [ ] Implement GET chart-of-accounts/{id} API call for editing
- [ ] Implement PUT chart-of-accounts/{id} API call for updating
- [ ] Implement DELETE chart-of-accounts/{id} API call for deleting
- [ ] Add loading states and error handling with ToastCard
- [ ] Ensure responsive design for mobile and desktop
- [ ] Test all CRUD operations
