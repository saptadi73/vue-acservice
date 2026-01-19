import { createRouter, createWebHistory } from 'vue-router'
import { isTokenExpired } from '../user/auth.utils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/main/dashboard',
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../user/loginUser.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      children: [
        {
          path: 'logout',
          name: 'user logout',
          component: () => import('../user/LogoutUser.vue'),
        },
        {
          path: 'register',
          name: 'user register',
          component: () => import('../user/RegisterUser.vue'),
        },
        {
          path: 'edit/:id',
          name: 'user edit',
          component: () => import('../user/EditUser.vue'),
        },
      ],
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../pages/DashboardServiceAC.vue'),
        },
        {
          path: 'role-management',
          name: 'role management',
          component: () => import('../pages/UserRoleManagement.vue'),
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('../pages/TableUsers.vue'),
        },
      ],
    },
    {
      path: '/pelanggan',
      name: 'pelanggan',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'all',
          name: 'all',
          component: () => import('../pages/DaftarPelangganAc.vue'),
        },
        {
          path: 'baru',
          name: 'baru',
          component: () => import('../pages/InputDataPelanggan.vue'),
        },
        {
          path: 'ac',
          name: 'ac',
          component: () => import('../pages/InputDataAc.vue'),
        },
        {
          path: 'baru/noasset',
          name: 'baru no asset',
          component: () => import('../pages/InputPelangganTanpaAsset.vue'),
        },
        {
          path: 'ac/rental',
          name: 'ac rental',
          component: () => import('../pages/InputDataAcRental.vue'),
        },
        {
          path: 'reminder',
          name: 'reminder',
          component: () => import('../pages/TableReminderservice.vue'),
        },
      ],
    },
    {
      path: '/wo',
      name: 'work order',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'all',
          name: 'all work order',
          component: () => import('../pages/TableWorkOrderAll.vue'),
        },
        {
          path: 'new',
          name: 'new work order',
          component: () => import('../pages/CreateWorkOrder.vue'),
        },
        {
          path: 'service/baru/:id',
          name: 'wo service baru',
          component: () => import('../pages/WoService.vue'),
        },
        {
          path: 'service/update/:id',
          name: 'wo service baru tanpa pelanggan',
          component: () => import('../pages/EditWoService.vue'),
        },
        {
          path: 'jual/baru/:id',
          name: 'wo jual baru',
          component: () => import('../pages/WoPenjualanAC.vue'),
        },
        {
          path: 'penjualan/update/:id',
          name: 'wo penjualan update',
          component: () => import('../pages/EditWoPenjualan.vue'),
        },
        {
          path: 'sewa/update/:id',
          name: 'wo sewa update',
          component: () => import('../pages/EditWoPenyewaan.vue'),
        },
        {
          path: 'sewa/baru',
          name: 'wo sewa order',
          component: () => import('../pages/WoPenyewaanAC.vue'),
        },
        {
          path: 'sales/form',
          name: 'sales form',
          component: () => import('../pages/SalesOrderFormSample.vue'),
        },
        {
          path: 'sales/invoice',
          name: 'invoice',
          component: () => import('../pages/InvoiceSample.vue'),
        },
        {
          path: 'sales/list',
          name: 'daftar Sales Order',
          component: () => import('../pages/TableSalesorder.vue'),
        },
        {
          path: 'sales/create-maintenance',
          name: 'create sales order maintenance',
          component: () => import('../pages/CreateSalesOrderPemeliharaan.vue'),
        },
        {
          path: 'sales/edit/:id',
          name: 'edit sales order',
          component: () => import('../pages/CreateSalesOrderPemeliharaan.vue'),
        },
        {
          path: 'new/form',
          name: 'wo baru',
          component: () => import('../pages/WOFormTemplate.vue'),
        },
        {
          path: 'new/spk',
          name: 'spk baru',
          component: () => import('../pages/SpkFormTemplate.vue'),
        },
        {
          path: 'laporan/barang',
          name: 'Laporan Penjualan Barang',
          component: () => import('../pages/LaporanPenjualanSparePart.vue'),
        },
        {
          path: 'laporan/jasa',
          name: 'Laporan Jasa',
          component: () => import('../pages/LaporanJasaBengkel.vue'),
        },
        {
          path: 'service/sign/:id',
          name: 'customer pemeliharaan sign',
          component: () => import('../pages/SignWoService.vue'),
        },
        {
          path: 'penjualan/sign/:id',
          name: 'customer penjualan sign',
          component: () => import('../pages/SignWoPenjualan.vue'),
        },
        {
          path: 'penyewaan/sign/:id',
          name: 'customer penyewaan sign',
          component: () => import('../pages/SignWoPenyewaan.vue'),
        },
      ],
    },
    {
      path: '/karyawan',
      name: 'karyawan',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      meta: { requiresRole: ['admin', 'pegawai'] },
      children: [
        {
          path: 'list',
          name: 'daftar karyawan',
          component: () => import('../pages/TableKaryawan.vue'),
        },
        {
          path: 'cards',
          name: 'daftar karyawan cards',
          component: () => import('../pages/KaryawanListCard.vue'),
        },
        {
          path: 'departments',
          name: 'daftar departemen',
          component: () => import('../pages/TableDepartments.vue'),
        },
        {
          path: 'positions',
          name: 'daftar posisi',
          component: () => import('../pages/TablePositions.vue'),
        },
        {
          path: 'groups',
          name: 'daftar groups',
          component: () => import('../pages/TableGroups.vue'),
        },
        {
          path: 'absen',
          name: 'absen',
          component: () => import('../pages/TableAbsen.vue'),
        },
        {
          path: 'kehadiran',
          name: 'lembur',
          component: () => import('../pages/RekapCutiIjin.vue'),
        },
        {
          path: 'lemburku',
          name: 'lemburku',
          component: () => import('../pages/TableRekapLembur.vue'),
        },
        {
          path: 'timeoff',
          name: 'time off',
          component: () => import('../pages/TableTimeOff.vue'),
        },
      ],
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'list',
          name: 'list',
          component: () => import('../pages/TableProducts.vue'),
        },
        {
          path: 'vendors',
          name: 'vendors',
          component: () => import('../pages/TableVendors.vue'),
        },
        {
          path: 'keluar',
          name: 'pengeluaran',
          component: () => import('../pages/TablePengeluaranBarang.vue'),
        },
        {
          path: 'masuk',
          name: 'pemasukan',
          component: () => import('../pages/TablePemasukanBarang.vue'),
        },
        {
          path: 'gerak',
          name: 'pergerakan',
          component: () => import('../pages/PergerakanBarang.vue'),
        },
        {
          path: 'purchase',
          name: 'purchase',
          component: () => import('../pages/PurchaseOrderSample.vue'),
        },
        {
          path: 'purchase/new',
          name: 'purchase new',
          component: () => import('../pages/PurchaseOrderQuick.vue'),
        },
        {
          path: 'purchase/:id',
          name: 'purchase edit',
          component: () => import('../pages/PurchaseOrderQuick.vue'),
        },
        {
          path: 'pembelian',
          name: 'pembelian',
          component: () => import('../pages/TablePurchasingOrder.vue'),
        },
        {
          path: 'adjust',
          name: 'adjusment',
          component: () => import('../pages/InventoryAdjustemnt.vue'),
        },
        {
          path: 'create/po',
          name: 'create PO',
          component: () => import('../pages/PurchaseOrderSampleForm.vue'),
        },
      ],
    },
    {
      path: '/finansial',
      name: 'finansial',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      meta: { requiresRole: ['admin'] },
      children: [
        {
          path: 'coa',
          name: 'chart of accounts',
          component: () => import('../pages/ChartOfAccounts.vue'),
        },
        {
          path: 'jurnal',
          name: 'jurnal umum',
          component: () => import('../pages/JournalEntries.vue'),
        },
        {
          path: 'balance-sheet',
          name: 'balance sheet',
          component: () => import('../pages/BalanceSheetReport.vue'),
        },
        {
          path: 'profit-loss',
          name: 'profit loss',
          component: () => import('../pages/ProfitLossReport.vue'),
        },
        {
          path: 'cash-book',
          name: 'cash book',
          component: () => import('../pages/CashBookReport.vue'),
        },
        {
          path: 'aged-ledger',
          name: 'aged ledger',
          component: () => import('../pages/AgedLedgerReport.vue'),
        },
        {
          path: 'general-ledger',
          name: 'general ledger',
          component: () => import('../pages/GeneralLedgerReport.vue'),
        },
        {
          path: 'trial-balance',
          name: 'trial balance',
          component: () => import('../pages/TrialBalanceReport.vue'),
        },
        {
          path: 'biaya/list',
          name: 'daftar biaya',
          component: () => import('../pages/TableExpenses.vue'),
        },
        {
          path: 'biaya/edit/:id',
          name: 'edit biaya',
          component: () => import('../pages/InputBiaya.vue'),
        },
        {
          path: 'biaya/new',
          name: 'input biaya',
          component: () => import('../pages/InputBiaya.vue'),
        },
        {
          path: 'internal-expenditure',
          name: 'internal-expenditure',
          component: () => import('../pages/InternalExpenditure.vue'),
        },
      ],
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'list',
          name: 'services list',
          component: () => import('../pages/TableServices.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') || ''
  // Check apakah token benar-benar ada dan valid (bukan string 'null' atau 'undefined')
  const hasValidToken = token && token !== '' && token !== 'null' && token !== 'undefined'
  const isAuth = !!hasValidToken

  // daftar route publik (tidak perlu login)
  const publicPaths = ['/login', '/register']

  console.log('🔐 Route Guard Check')
  console.log('📍 Navigating to:', to.path)
  console.log('🔑 Token exists:', !!token)
  console.log('🔑 Has valid token:', hasValidToken)

  // ✅ CEK TOKEN EXPIRED
  let isTokenValid = true
  if (hasValidToken) {
    isTokenValid = !isTokenExpired(token)
    console.log('⏰ Token expired:', !isTokenValid)
  }

  console.log('✅ Is Authenticated:', isAuth && isTokenValid)

  // ✅ Jika token sudah expired, hapus dan redirect ke login
  if (hasValidToken && !isTokenValid) {
    console.warn('⚠️ Token expired - clearing and redirecting to login')
    localStorage.removeItem('token')
    localStorage.removeItem('user_roles')
    localStorage.removeItem('user_info')
    return next({
      path: '/login',
      query: { redirect: to.fullPath },
      replace: true,
    })
  }

  // ✅ Jika belum login dan mau masuk route privat
  // Cek jika route memerlukan auth (via meta atau bukan public path)
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  if (!isAuth && (requiresAuth || !publicPaths.includes(to.path))) {
    console.warn('⚠️ No token found - redirecting to login')
    console.warn('📍 Redirect destination:', to.fullPath)
    return next({
      path: '/login',
      query: { redirect: to.fullPath },
      replace: true,
    })
  }

  // ✅ Jika sudah login tapi mencoba akses login/register, redirect ke dashboard
  if (isAuth && isTokenValid && publicPaths.includes(to.path)) {
    console.log('✅ Already authenticated - redirecting to dashboard')
    return next({ path: '/main/dashboard', replace: true })
  }

  // ✅ Role-based access control
  if (to.meta && to.meta.requiresRole) {
    const userRolesJson = localStorage.getItem('user_roles') || '[]'
    const userRoles = JSON.parse(userRolesJson)

    console.log('🔒 Route requires roles:', to.meta.requiresRole)
    console.log('👤 User roles from localStorage:', userRoles)

    // Cek apakah user memiliki salah satu role yang dibutuhkan
    const hasRequiredRole = to.meta.requiresRole.some((requiredRole) =>
      userRoles.some((userRole) => {
        const roleName = (userRole.name || '').toLowerCase()
        const roleLabel = (userRole.label || '').toLowerCase()
        const required = (requiredRole || '').toLowerCase()

        return roleName === required || roleLabel === required
      }),
    )

    console.log('✅ Has required role:', hasRequiredRole)

    if (!hasRequiredRole) {
      // User tidak memiliki role yang diperlukan
      console.error('❌ Access Denied - User does not have required role')
      alert('Anda tidak memiliki akses ke halaman ini')
      return next({ path: '/', replace: true })
    }
  }

  console.log('✅ Access granted')
  return next()
})

export default router
