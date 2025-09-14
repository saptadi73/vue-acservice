import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../layouts/LayoutDashboard.vue'),
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
      ],
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../pages/DashboardServiceAC.vue'),
        },
      ],
    },
    {
      path: '/pelanggan',
      name: 'pelanggan',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
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
          path: 'jual/baru/:id',
          name: 'wo jual baru',
          component: () => import('../pages/WoPenjualanAC.vue'),
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
      ],
    },
    {
      path: '/karyawan',
      name: 'karyawan',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      children: [
        {
          path: 'list',
          name: 'daftar karyawan',
          component: () => import('../pages/KaryawanListCard.vue'),
        },
        {
          path: 'absen',
          name: 'absen',
          component: () => import('../pages/TableAbsenKaryawan.vue'),
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
      ],
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('../layouts/LayoutDefaultBengkel.vue'),
      children: [
        {
          path: 'list',
          name: 'list',
          component: () => import('../pages/ListInventory.vue'),
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
      children: [
        {
          path: 'cashflow',
          name: 'cashflow',
          component: () => import('../pages/CashFlowReport.vue'),
        },
        {
          path: 'biaya',
          name: 'biaya',
          component: () => import('../pages/ReportPembiayaan.vue'),
        },
        {
          path: 'labarugi',
          name: 'labarugi',
          component: () => import('../pages/LaporanLabaRugi.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') || ''
  const isAuth = !!token // pastikan falsy jika kosong/undefined/null

  // daftar route publik (tidak perlu login)
  const publicPaths = ['/login', '/register']

  if (!isAuth && !publicPaths.includes(to.path)) {
    // belum login dan mau masuk route privat
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // if (isAuth && publicPaths.includes(to.path)) {
  //   // sudah login tapi ke /login atau /register -> lempar ke dashboard (atau yang kamu mau)
  //   return next({ path: '/main/dashboard' })
  // }

  return next()
})

export default router
