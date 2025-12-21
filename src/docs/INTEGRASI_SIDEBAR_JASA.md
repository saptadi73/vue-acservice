# Integrasi Halaman Jasa ke Menu Sidebar (Optional)

## Lokasi File Sidebar

Cek file sidebar yang digunakan di layout, contohnya:

- `src/components/SideBarJoss.vue` atau
- `src/components/SideMenuBengkel.vue` atau
- Component lain yang handle menu

## Contoh Code untuk Sidebar

### Jika menggunakan struktur menu item biasa:

```vue
<!-- Di template sidebar -->
<li>
  <RouterLink to="/services/list" class="menu-item">
    <i class="fas fa-wrench"></i>
    <span>Daftar Jasa</span>
  </RouterLink>
</li>
```

### Jika menggunakan parent menu dengan sub-items:

```vue
<li class="menu-group">
  <a href="#" class="menu-group-toggle">
    <i class="fas fa-cogs"></i>
    <span>Manajemen</span>
    <i class="fas fa-chevron-down"></i>
  </a>
  <ul class="menu-submenu">
    <li>
      <RouterLink to="/services/list" class="menu-item">
        <span>Daftar Jasa</span>
      </RouterLink>
    </li>
    <!-- menu lain -->
  </ul>
</li>
```

### Dengan Icon Font Awesome:

```vue
<RouterLink
  to="/services/list"
  :class="$route.path.includes('/services') ? 'active' : ''"
  class="menu-item"
>
  <font-awesome-icon icon="fa-solid fa-wrench" class="w-4 h-4" />
  <span class="ml-2">Daftar Jasa</span>
</RouterLink>
```

### Dengan Conditional Active State:

```vue
<template>
  <nav class="sidebar">
    <ul>
      <!-- ... menu items lain -->
      <li>
        <RouterLink
          to="/services/list"
          :class="{
            'text-blue-600 bg-blue-50 border-l-4 border-blue-600': isServiceActive,
          }"
          class="menu-item px-4 py-2 hover:bg-gray-100 transition"
        >
          <i class="fas fa-wrench"></i>
          <span>Daftar Jasa</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isServiceActive = computed(() => route.path.includes('/services'))
</script>
```

## Icon Suggestions

Beberapa icon yang cocok untuk Daftar Jasa:

- `fa-wrench` - Kunci/Tool (Rekomendasi)
- `fa-tools` - Tools
- `fa-cogs` - Cogs/Setting
- `fa-briefcase` - Briefcase/Service
- `fa-hammer` - Hammer
- `fa-screwdriver` - Screwdriver

## Styling untuk Active State

Jika menggunakan Tailwind CSS:

```css
/* Saat menu item active */
.menu-item.active {
  @apply text-blue-600 font-semibold;
  border-left: 4px solid #2563eb;
}

.menu-item:hover {
  @apply bg-gray-100;
}
```

## Role-Based Access (Optional)

Jika ingin membatasi akses berdasarkan role:

```vue
<RouterLink v-if="hasPermission('view-services')" to="/services/list" class="menu-item">
  <i class="fas fa-wrench"></i>
  <span>Daftar Jasa</span>
</RouterLink>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const hasPermission = (permission) => {
  return userStore.permissions.includes(permission)
}
</script>
```

## Testing Menu Integration

### Checklist

- [ ] Menu item tampil di sidebar
- [ ] Klik menu naviga ke halaman jasa
- [ ] Active state berubah saat di halaman jasa
- [ ] Icon tampil dengan benar
- [ ] Responsive di mobile

### Browser Console Test

```javascript
// Test routing
router.push({ name: 'services list' })

// Check current route
console.log(route.currentRoute.value)

// Check router config
console.log(router.getRoutes())
```

## Troubleshooting

### Menu item tidak muncul

1. Cek file sidebar component mana yang digunakan
2. Import component di layout yang benar
3. Cek path ke file sidebar benar

### Link tidak berfungsi

1. Verifikasi route name: `'services list'`
2. Verifikasi route path: `/services/list`
3. Check console untuk router errors

### Icon tidak tampil

1. Pastikan Font Awesome sudah di-install
2. Import icon dengan benar di main.js
3. Cek icon name sesuai dengan Font Awesome spec

---

**Note**: Integrasi menu sidebar ini optional. Halaman jasa sudah bisa diakses langsung via URL atau router navigation meski belum ada di sidebar.
