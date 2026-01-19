<template>
  <div class="max-w-8xl mx-auto mt-8 mb-8">
    <!-- Main Card Container -->
    <div class="bg-white rounded-lg shadow-xl border border-slate-700 overflow-hidden">
      <!-- Gradient Header -->
      <div class="gradient-header px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-white/20 p-2 rounded-lg">
              <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-white">Work Order Form</h2>
              <p class="text-slate-300 text-sm">Formulir pemesanan layanan bengkel</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="px-8 py-8">
        <!-- Customer Information Section -->
        <div class="mb-8">
          <div class="flex items-center gap-2 mb-2">
            <div class="bg-blue-100 p-2 rounded-lg">
              <svg
                class="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-800">Informasi Pelanggan & Kendaraan</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="info-card">
              <label class="info-label">Nama Pelanggan</label>
              <div class="info-value">{{ form.nama }}</div>
            </div>
            <div class="info-card">
              <label class="info-label">No. HP</label>
              <div class="info-value">{{ form.hp }}</div>
            </div>
            <div class="info-card">
              <label class="info-label">Email</label>
              <div class="info-value">{{ form.email }}</div>
            </div>
            <div class="info-card">
              <label class="info-label">No. Polisi</label>
              <div class="info-value">{{ form.no_pol }}</div>
            </div>
            <div class="info-card lg:col-span-3">
              <label class="info-label">Alamat</label>
              <div class="info-value">{{ form.alamat }}</div>
            </div>

            <div class="info-card">
              <label class="info-label">Brand</label>
              <div class="info-value">{{ form.brand }}</div>
            </div>
            <div class="info-card">
              <label class="info-label">Type</label>
              <div class="info-value">{{ form.type }}</div>
            </div>
            <div class="info-card">
              <label class="info-label">Model</label>
              <div class="info-value">{{ form.model }}</div>
            </div>
            <div class="info-card">
              <label class="info-label">Kapasitas</label>
              <div class="info-value">{{ form.kapasitas }}</div>
            </div>
            <div class="info-card">
              <label class="info-label">Tahun</label>
              <div class="info-value">{{ form.tahun }}</div>
            </div>
            <div class="info-card">
              <div class="relative">
                <input
                  v-model.number="form.kilometer"
                  type="number"
                  min="0"
                  class="modern-input peer"
                  placeholder=" "
                  :disabled="
                    initialStatus === 'selesai' ||
                    workOrderStatus === 'selesai' ||
                    workOrderStatus === 'dibayar'
                  "
                  @input="updateNextServiceKm"
                />
                <label class="modern-label">Kilometer</label>
              </div>
            </div>
            <div class="info-card">
              <div class="relative">
                <input
                  v-model.number="form.next_service_km"
                  type="number"
                  min="0"
                  class="modern-input peer"
                  placeholder=" "
                  :disabled="
                    initialStatus === 'selesai' ||
                    workOrderStatus === 'selesai' ||
                    workOrderStatus === 'dibayar'
                  "
                  readonly
                />
                <label class="modern-label">Service Berikutnya KM</label>
              </div>
            </div>
            <div class="info-card">
              <div class="relative">
                <input
                  v-model="form.next_service_date"
                  type="date"
                  class="modern-input peer"
                  placeholder=" "
                  :disabled="
                    initialStatus === 'selesai' ||
                    workOrderStatus === 'selesai' ||
                    workOrderStatus === 'dibayar'
                  "
                />
                <label class="modern-label">Service Berikutnya Tanggal</label>
              </div>
            </div>
            <div class="info-card">
              <div class="flex-1 relative">
                <select
                  v-model="form.karyawan_id"
                  class="modern-select peer"
                  required
                  :disabled="
                    initialStatus === 'selesai' ||
                    workOrderStatus === 'selesai' ||
                    workOrderStatus === 'dibayar'
                  "
                >
                  <option value="" disabled selected>-- Pilih Karyawan --</option>
                  <option
                    v-for="karyawanItem in karyawan"
                    :key="karyawanItem.id"
                    :value="karyawanItem.id"
                  >
                    {{ karyawanItem.nama }}
                  </option>
                </select>
                <label class="modern-select-label">Karyawan</label>
              </div>
            </div>
            <div class="info-card">
              <div class="relative">
                <select
                  v-model="form.status_pembayaran"
                  id="status_pembayaran"
                  class="modern-select peer"
                  :disabled="
                    initialStatus === 'selesai' ||
                    workOrderStatus === 'selesai' ||
                    workOrderStatus === 'dibayar'
                  "
                >
                  <option value="" disabled selected>Pilih Status Pembayaran</option>
                  <option value="belum_ada_pembayaran">Belum Ada Pembayaran</option>
                  <option value="tempo">Tempo</option>
                  <option value="lunas">Lunas</option>
                </select>
                <label class="modern-select-label">Status Pembayaran</label>
              </div>
            </div>
            <div class="info-card">
              <div class="flex items-center gap-2">
                <div class="relative flex-1">
                  <input
                    v-model.number="form.dp"
                    type="number"
                    min="0"
                    class="modern-input peer"
                    placeholder=" "
                    :disabled="
                      initialStatus === 'selesai' ||
                      workOrderStatus === 'selesai' ||
                      workOrderStatus === 'dibayar'
                    "
                  />
                  <label class="modern-label">DP Amount</label>
                </div>
                <button
                  v-if="form.dp > 0 && !form.dp_paid"
                  type="button"
                  class="modern-btn-info text-xs px-2 py-1"
                  @click="openDpPaymentModal"
                  :disabled="
                    initialStatus === 'selesai' || isProcessingPayment || paymentStatus === 'lunas'
                  "
                >
                  {{ isProcessingPayment ? 'Memproses...' : 'Bayar DP' }}
                </button>
                <span
                  v-if="form.dp > 0 && form.dp_paid"
                  class="text-xs text-green-600 font-semibold px-2 py-1"
                >
                  DP Sudah Dibayar
                </span>
              </div>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitForm">
          <!-- Input Keluhan dan Saran -->
          <div class="mb-6 grid grid-cols-1 gap-6">
            <div class="relative">
              <textarea
                v-model="form.keluhan"
                class="modern-textarea peer"
                placeholder=" "
                rows="4"
                :disabled="
                  initialStatus === 'selesai' ||
                  workOrderStatus === 'selesai' ||
                  workOrderStatus === 'dibayar'
                "
              ></textarea>
              <label class="modern-textarea-label">Keluhan</label>
            </div>

            <div class="relative">
              <textarea
                v-model="form.saran"
                class="modern-textarea peer"
                placeholder=" "
                rows="4"
                :disabled="
                  initialStatus === 'selesai' ||
                  workOrderStatus === 'selesai' ||
                  workOrderStatus === 'dibayar'
                "
              ></textarea>
              <label class="modern-textarea-label">Saran</label>
            </div>
          </div>

          <!-- Product Order Section -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-2">
                <div class="bg-green-100 p-1 rounded-lg">
                  <svg
                    class="h-5 w-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-800">Product Order (Sparepart)</h3>
              </div>
              <button
                type="button"
                class="modern-btn-primary flex items-center gap-2"
                @click="addProductOrder"
                :disabled="
                  initialStatus === 'selesai' ||
                  workOrderStatus === 'selesai' ||
                  workOrderStatus === 'dibayar'
                "
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Product
              </button>
            </div>

            <div class="grid grid-cols-17 gap-2 mb-1 p-1">
              <div class="col-span-3">Product</div>
              <div>Stock</div>
              <div>Quantity</div>
              <div class="hidden">Satuan</div>
              <div v-if="isAdmin" class="col-span-2">HPP</div>

              <div class="col-span-2">Harga</div>
              <div class="col-span-2">Discount</div>
              <div v-if="isAdmin">Sub HPP</div>
              <div class="col-span-2">Sub Total</div>
              <div class="col-span-2">Aksi</div>
            </div>
            <!-- Product Items -->
            <div class="">
              <div
                v-for="(item, idx) in form.product_ordered"
                :key="'prod-' + idx"
                class="product-item-card"
              >
                <div class="grid grid-cols-17 gap-1 mb-1">
                  <div class="relative col-span-3">
                    <input
                      v-model="item.searchQuery"
                      type="text"
                      class="modern-input peer"
                      placeholder="Ketik untuk mencari produk..."
                      @input="onProductSearchInput(item)"
                      @focus="onProductSearchInput(item)"
                      @blur="hideProductSuggestions(item)"
                      @keydown="handleProductKeydown($event, item)"
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    />
                    <div
                      v-if="
                        item.showSuggestions && getFilteredProducts(item.searchQuery).length > 0
                      "
                      class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1"
                    >
                      <div
                        v-for="(product, index) in getFilteredProducts(item.searchQuery)"
                        :key="product.id"
                        :class="[
                          'px-4 py-2 cursor-pointer hover:bg-blue-50',
                          index === item.activeIndex ? 'bg-blue-100' : '',
                        ]"
                        @click="selectProduct(product, item)"
                      >
                        {{ product.name }}
                      </div>
                    </div>
                    <div
                      v-if="
                        item.showSuggestions &&
                        getFilteredProducts(item.searchQuery).length === 0 &&
                        item.searchQuery
                      "
                      class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 px-4 py-2 text-gray-500"
                    >
                      Tidak ada produk ditemukan
                    </div>
                  </div>
                  <input type="hidden" v-model="item.product_name" />
                  <input type="hidden" v-model="item.id" />
                  <div>
                    <input
                      v-model.number="item.stockku"
                      type="number"
                      min="0"
                      class="modern-input peer text-sm"
                      placeholder=" "
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    />
                  </div>
                  <div class="relative col-span-1">
                    <input
                      v-model.number="item.quantity"
                      type="number"
                      min="1"
                      :max="item.stockku"
                      class="modern-input peer"
                      placeholder=" "
                      @change="markProductModified(item)"
                      @input="validateQuantity(item)"
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    />
                  </div>
                  <div class="hidden relative col-span-1">
                    <select
                      id="satuan_id"
                      v-model="item.satuan_id"
                      class="modern-select peer"
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    >
                      <option value="" disabled selected>Pilih Satuan</option>
                      <option v-for="value in satuans" :key="value.id" :value="value.id">
                        {{ value.name }}
                      </option>
                    </select>
                  </div>
                  <div v-if="isAdmin" class="col-span-2">
                    <input
                      v-model.number="item.cost"
                      type="number"
                      min="0"
                      class="modern-input peer text-sm"
                      placeholder=" "
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    />
                  </div>
                  <div class="relative col-span-2">
                    <input
                      v-model.number="item.price"
                      type="number"
                      min="0"
                      class="modern-input peer"
                      placeholder=" "
                      @change="markProductModified(item)"
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    />
                  </div>
                  <div class="relative col-span-2">
                    <input
                      v-model.number="item.discount"
                      type="number"
                      min="0"
                      class="modern-input peer"
                      placeholder=" "
                      @change="markProductModified(item)"
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    />
                  </div>
                  <div class="hidden col-span-2">
                    <input
                      type="number"
                      id="product-subtotal-hpp"
                      v-model.number="item.productSubtotalHPP"
                      class="modern-input peer text-sm"
                    />
                  </div>
                  <div
                    v-if="isAdmin"
                    class="text-xs font-bold border-1 p-1 text-slate-500 bg-slate-200"
                  >
                    {{ formatCurrency(productSubtotalHPP(item)) }}
                  </div>
                  <div class="relative col-span-2">
                    <input
                      id="subtotal-product"
                      type="hidden"
                      v-model.number="item.subtotal"
                      :size="Math.max(item.subtotal?.length || 0, 1)"
                    />

                    <div class="subtotal-display">
                      {{ formatCurrency(productSubtotal(item)) }}
                    </div>
                  </div>
                  <div class="col-span-2">
                    <button
                      v-if="item.isNew"
                      type="button"
                      class="modern-btn-info"
                      @click="confirmAddProduct(idx)"
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    >
                      Confirm Add
                    </button>
                    <button
                      v-if="item.isModified"
                      type="button"
                      class="modern-btn-info"
                      @click="confirmUpdateProduct(idx)"
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    >
                      Confirm Update
                    </button>
                    <button
                      type="button"
                      class="delete-btn"
                      @click="removeProductOrder(idx)"
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="form.product_ordered.length === 0" class="empty-state">
                <svg
                  class="h-12 w-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <p class="text-gray-500">Belum ada sparepart yang ditambahkan</p>
              </div>
            </div>

            <!-- Product Totals -->
            <div class="mt-6 bg-green-50 rounded-xl p-4">
              <div class="flex flex-wrap gap-6 justify-end text-sm font-semibold">
                <div class="flex items-center gap-2">
                  <span class="text-gray-600">Total Harga:</span>
                  <input
                    type="hidden"
                    id="total-product-harga"
                    :value="totalProductHarga"
                    readonly
                    class="naked-input"
                  />
                  <span class="font-bold text-green-600">{{
                    formatCurrency(totalProductHarga)
                  }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-600">Total Discount:</span>
                  <input
                    type="hidden"
                    id="total-product-discount"
                    :value="totalProductDiscount"
                    readonly
                  />
                  <span class="font-bold text-red-600">{{
                    formatCurrency(totalProductDiscount)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Service Order Section -->
          <div class="mb-2">
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-1">
                <div class="bg-purple-100 p-2 rounded-lg">
                  <svg
                    class="h-5 w-5 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-800">Service Order (Jasa)</h3>
              </div>

              <button
                type="button"
                class="modern-btn-primary flex items-center gap-2"
                @click="openAddServiceModal"
                :disabled="
                  initialStatus === 'selesai' ||
                  workOrderStatus === 'selesai' ||
                  workOrderStatus === 'dibayar'
                "
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Tambah Service Baru
              </button>
              <button
                type="button"
                class="modern-btn-primary flex items-center gap-2"
                @click="addServiceOrder"
                :disabled="
                  initialStatus === 'selesai' ||
                  workOrderStatus === 'selesai' ||
                  workOrderStatus === 'dibayar'
                "
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Service
              </button>
            </div>

            <div class="grid grid-cols-16 gap-1 p-1">
              <div class="col-span-3">Service/Jasa</div>
              <div>Quantity</div>
              <div v-if="isAdmin" class="col-span-2">HPP</div>
              <div class="col-span-2">Harga</div>
              <div class="col-span-2">Discount</div>
              <div v-if="isAdmin" class="">Sub HPP</div>
              <div class="col-span-2">Sub Total</div>
              <div class="col-span-2">Aksi</div>
            </div>
            <!-- Service Items -->
            <div class="">
              <div
                v-for="(item, idx) in form.service_ordered"
                :key="'svc-' + idx"
                class="service-item-card"
              >
                <div class="grid grid-cols-16 gap-1">
                  <div class="relative col-span-3">
                    <input
                      v-model="item.searchQuery"
                      type="text"
                      class="modern-input peer"
                      placeholder="Ketik untuk mencari service..."
                      @input="onServiceSearchInput(item)"
                      @focus="onServiceSearchInput(item)"
                      @blur="hideServiceSuggestions(item)"
                      @keydown="handleServiceKeydown($event, item)"
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    />
                    <div
                      v-if="
                        item.showSuggestions && getFilteredServices(item.searchQuery).length > 0
                      "
                      class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1"
                    >
                      <div
                        v-for="(service, index) in getFilteredServices(item.searchQuery)"
                        :key="service.id"
                        :class="[
                          'px-4 py-2 cursor-pointer hover:bg-blue-50',
                          index === item.activeIndex ? 'bg-blue-100' : '',
                        ]"
                        @click="selectService(service, item)"
                      >
                        {{ service.name }}
                      </div>
                    </div>
                    <div
                      v-if="
                        item.showSuggestions &&
                        getFilteredServices(item.searchQuery).length === 0 &&
                        item.searchQuery
                      "
                      class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 px-4 py-2 text-gray-500"
                    >
                      Tidak ada service ditemukan
                    </div>
                  </div>
                  <input type="hidden" v-model="item.id" />
                  <input type="hidden" v-model="item.service_name" />
                  <div class="relative col-span-1">
                    <input
                      v-model.number="item.quantity"
                      type="number"
                      min="1"
                      class="modern-input peer"
                      placeholder=" "
                      @change="markServiceModified(item)"
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    />
                  </div>

                  <div v-if="isAdmin" class="col-span-2">
                    <input
                      v-model.number="item.cost"
                      type="number"
                      min="0"
                      class="modern-input peer"
                      placeholder=" "
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    />
                  </div>

                  <div class="relative col-span-2">
                    <input
                      v-model.number="item.price"
                      type="number"
                      min="0"
                      class="modern-input peer"
                      placeholder=" "
                      @change="markServiceModified(item)"
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    />
                  </div>
                  <div class="relative col-span-2">
                    <input
                      v-model.number="item.discount"
                      type="number"
                      min="0"
                      class="modern-input peer"
                      placeholder=" "
                      @change="markServiceModified(item)"
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    />
                  </div>
                  <div class="hidden">
                    <input
                      type="hidden"
                      id="service-subtotal-hpp"
                      v-model.number="item.serviceSubtotalHPP"
                      min="0"
                    />
                  </div>
                  <div
                    v-if="isAdmin"
                    class="text-xs font-bold border-1 p-1 text-slate-500 bg-slate-200"
                  >
                    {{ formatCurrency(serviceSubtotalHPP(item)) }}
                  </div>

                  <div class="relative col-span-2">
                    <input
                      type="hidden"
                      id="service-subtotal"
                      v-model.number="item.serviceSubtotal"
                    />
                    <div class="subtotal-display">
                      {{ formatCurrency(serviceSubtotal(item)) }}
                    </div>
                  </div>
                  <div class="col-span-2">
                    <button
                      v-if="item.isNew"
                      type="button"
                      class="modern-btn-info"
                      @click="confirmAddService(idx)"
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    >
                      Confirm Add
                    </button>
                    <button
                      v-if="item.isModified"
                      type="button"
                      class="modern-btn-info"
                      @click="confirmUpdateService(idx)"
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    >
                      Confirm Update
                    </button>
                    <button
                      type="button"
                      class="delete-btn"
                      @click="removeServiceOrder(idx)"
                      :disabled="
                        initialStatus === 'selesai' ||
                        workOrderStatus === 'selesai' ||
                        workOrderStatus === 'dibayar'
                      "
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="form.service_ordered.length === 0" class="empty-state">
                <svg
                  class="h-12 w-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p class="text-gray-500">Belum ada jasa yang ditambahkan</p>
              </div>
            </div>

            <!-- Service Totals -->
            <div class="mt-6 bg-purple-50 rounded-xl p-4">
              <div class="flex flex-wrap gap-6 justify-end text-sm font-semibold">
                <div class="flex items-center gap-2">
                  <span class="text-gray-600">Total Harga:</span>
                  <input
                    type="hidden"
                    id="total-service-harga"
                    v-model.number="form.totalServiceHarga"
                    readonly
                  />
                  <span class="font-bold text-purple-600">{{
                    formatCurrency(totalServiceHarga)
                  }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-600">Total Discount:</span>
                  <input
                    type="hidden"
                    id="total-service-discount"
                    v-model.number="form.totalServiceDiscount"
                    readonly
                  />
                  <span class="font-bold text-red-600">{{
                    formatCurrency(totalServiceDiscount)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg p-2 border border-red-200 w-50 mb-5">
            <div class="text-sm text-gray-600 mb-1">Total Discount</div>
            <input
              type="hidden"
              id="grnad-total-discount"
              v-model.number="form.grandTotalDiscount"
              readonly
            />
            <div class="text-normal font-bold text-red-600">
              {{ formatCurrency(grandTotalDiscount) }}
            </div>
          </div>

          <!-- Pajak Section -->
          <div class="mb-6 flex items-center gap-3">
            <input
              type="checkbox"
              id="useTax"
              v-model="isUseTax"
              class="mr-2"
              :disabled="
                initialStatus === 'selesai' ||
                workOrderStatus === 'selesai' ||
                workOrderStatus === 'dibayar'
              "
            />
            <label for="useTax" class="text-sm font-semibold">Gunakan Pajak 11%</label>
          </div>

          <!-- Grand Total Summary -->
          <div class="gradient-summary rounded-xl p-6 mb-8">
            <div class="flex items-center gap-2 mb-4">
              <div class="bg-blue-100 p-2 rounded-lg">
                <svg
                  class="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-800">Ringkasan Total</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-white rounded-lg p-4 border border-green-200">
                <div class="text-sm text-gray-600 mb-1">Total Harga</div>
                <input
                  type="hidden"
                  id="grand-total-harga"
                  v-model.number="form.grandTotalHarga"
                  readonly
                />
                <div class="text-xl font-bold text-green-600">
                  {{ formatCurrency(grandTotalHarga) }}
                </div>
              </div>

              <div class="bg-white rounded-lg p-4 border border-yellow-200">
                <div class="text-sm text-gray-600 mb-1">Pajak (11%)</div>
                <input type="hidden" id="pajak-amount" v-model.number="form.pajak" readonly />
                <div class="text-xl font-bold text-yellow-600">
                  {{ formatCurrency(pajakAmount) }}
                </div>
              </div>
              <div class="bg-white rounded-lg p-4 border border-purple-200" v-if="form.dp > 0">
                <div class="text-sm text-gray-600 mb-1">DP</div>
                <input type="hidden" id="dp-amount" v-model.number="form.dp" readonly />
                <div class="text-xl font-bold text-purple-600">
                  {{ formatCurrency(form.dp) }}
                </div>
              </div>
              <div
                class="bg-white rounded-lg p-4 border border-blue-200"
                :class="form.status_pembayaran !== 'dp' ? 'md:col-span-2 lg:col-span-1' : ''"
              >
                <div class="text-sm text-gray-600 mb-1">Total Pembayaran</div>
                <input
                  type="hidden"
                  id="total-pembayaran"
                  v-model.number="form.totalPembayaran"
                  readonly
                />
                <div class="text-2xl font-bold text-blue-600">
                  {{ formatCurrency(totalPembayaran) }}
                </div>
              </div>
            </div>
            <div v-if="isAdmin" class="mt-2 text-xs text-gray-500 text-center">
              HPP Product: {{ formatCurrency(totalProductCost) }} | HPP Service:
              {{ formatCurrency(totalServiceCost) }}
            </div>

            <div class="flext gap-3 justify-end">
              <input
                type="hidden"
                id="total-product-cost"
                v-model.number="form.totalProductCost"
                readonly
              />
              <input
                type="hidden"
                id="total-service-cost"
                v-model.number="form.totalServiceCost"
                readonly
              />
            </div>
          </div>
          <!-- Keterangan Section -->
          <div class="mb-6">
            <div class="relative">
              <input
                type="text"
                v-model="form.keterangan"
                class="modern-input peer"
                placeholder=" "
                :disabled="
                  initialStatus === 'selesai' ||
                  workOrderStatus === 'selesai' ||
                  workOrderStatus === 'dibayar'
                "
              />
              <label class="modern-label">Keterangan</label>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end gap-4">
            <button
              type="button"
              class="modern-btn-info flex items-center gap-2"
              @click="openPdfPreview"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Preview PDF
            </button>
            <button
              type="button"
              class="modern-btn-payment flex items-center gap-2"
              @click="openPaymentModal"
              :disabled="
                form.status !== 'selesai' || paymentStatus === 'lunas' || isProcessingPayment
              "
              :class="{
                'opacity-50 cursor-not-allowed':
                  form.status !== 'selesai' || paymentStatus === 'lunas' || isProcessingPayment,
              }"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {{ isProcessingPayment ? 'Memproses...' : 'Proses Pembayaran' }}
            </button>
            <button
              type="button"
              :disabled="
                hasUnconfirmedChanges ||
                initialStatus === 'selesai' ||
                workOrderStatus === 'selesai' ||
                workOrderStatus === 'dibayar'
              "
              :class="[
                'modern-btn-secondary flex items-center gap-2',
                {
                  'opacity-50 cursor-not-allowed':
                    hasUnconfirmedChanges ||
                    initialStatus === 'selesai' ||
                    workOrderStatus === 'selesai' ||
                    workOrderStatus === 'dibayar',
                },
              ]"
              @click="submitFormSelesai"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4"
                />
              </svg>
              Selesai
            </button>
            <button
              type="submit"
              :disabled="
                hasUnconfirmedChanges ||
                initialStatus === 'selesai' ||
                workOrderStatus === 'selesai' ||
                workOrderStatus === 'dibayar'
              "
              :class="[
                'modern-btn-success flex items-center gap-2',
                {
                  'opacity-50 cursor-not-allowed':
                    hasUnconfirmedChanges ||
                    initialStatus === 'selesai' ||
                    workOrderStatus === 'selesai' ||
                    workOrderStatus === 'dibayar',
                },
              ]"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Update (Dikerjakan)
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <loading-overlay />
  <toast-card v-if="show_toast" :message="message_toast" @close="tutupToast" />

  <!-- Payment Modal -->
  <payment-modal
    :is-open="showPaymentModal"
    :initial-amount="totalPembayaran"
    :expense-id="$route.params.id"
    :expense-name="`Work Order - ${form.nama}`"
    :expense-type="`${form.no_pol}`"
    @close="closePaymentModal"
    @submit="handlePaymentSubmit"
  />

  <!-- DP Payment Modal -->
  <payment-modal
    :is-open="showDpPaymentModal"
    :initial-amount="form.dp"
    :expense-id="$route.params.id"
    :expense-name="`DP Work Order - ${form.nama}`"
    :expense-type="`${form.no_pol}`"
    @close="closeDpPaymentModal"
    @submit="handleDpPaymentSubmit"
  />

  <!-- PDF Preview Modal -->
  <div
    v-if="showPdfPreview"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 overflow-hidden">
      <div class="flex items-center justify-between px-4 py-2 border-b">
        <h3 class="text-lg font-semibold text-gray-800">Preview Work Order PDF</h3>
        <button @click="closePdfPreview" class="text-gray-500 hover:text-gray-700">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="h-[70vh] bg-gray-100">
        <iframe
          v-if="pdfPreviewUrl"
          ref="pdfIframe"
          :src="pdfPreviewUrl"
          class="w-full h-full"
          title="PDF Preview"
        ></iframe>
      </div>
      <div class="flex justify-end gap-3 px-4 py-3 border-t bg-gray-50">
        <button
          type="button"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          @click="closePdfPreview"
        >
          Tutup
        </button>
        <button
          type="button"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          @click="downloadPdf"
        >
          Download
        </button>
        <button
          type="button"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          @click="printPdf"
        >
          Print
        </button>
      </div>
    </div>
  </div>

  <!-- Add Service Modal -->
  <div
    v-if="showAddServiceModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Tambah Service Baru</h3>
        <button @click="closeAddServiceModal" class="text-gray-500 hover:text-gray-700">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <form @submit.prevent="submitNewService" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nama Service</label>
          <input
            :value="newService.name"
            @input="onServiceNameInput($event.target.value)"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi (Optional)</label>
          <textarea
            v-model="newService.description"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Harga</label>
          <input
            v-model.number="newService.price"
            type="number"
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Biaya
            <span class="text-xs font-semibold font-lexend text-gray-500"
              >(sebaiknya dibiarkan tetap 0 karena biaya jasa akan dikreditkan menjadi minus di
              laporan biaya. Jarang dibutuhkan kecuali perhitungan Profit Jasa secara
              terpisah)</span
            ></label
          >
          <input
            v-model.number="newService.cost"
            type="number"
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button
            type="button"
            @click="closeAddServiceModal"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tambah Service
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import api from '@/user/axios'
import { useLoadingStore } from '@/stores/loading'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import ToastCard from '@/components/ToastCard.vue'
import PaymentModal from '@/components/PaymentModal.vue'
import axios from 'axios'
import { BASE_URL, BASE_URL2 } from '../base.utils.url'

import jsPDF from 'jspdf'
import logoImage from '@/assets/images/logo_carspeed.png'

export default {
  name: 'WorkOrderForm',
  components: { LoadingOverlay, ToastCard, PaymentModal },
  data() {
    return {
      services: [],
      products: [],
      satuans: [],
      dataVehiclesPelanggan: [],
      stockku: 0,
      no_wo: '',
      isitotalProductHarga: 0,
      isitotalServiceHarga: 0,
      isitotalProductDiscount: 0,
      isitotalServiceDiscount: 0,
      isitotalPembayaran: 0,
      isiPajakAmount: 0,
      karyawan: [],
      initialStatus: '', // Menyimpan status awal dari database
      workOrderUpdated: false, // Flag to track if work order has been updated
      isProcessingPayment: false, // Flag to prevent double payment processing
      form: {
        customer_id: '',
        vehicle_id: '',
        nama: '',
        hp: '',
        alamat: '',
        email: '',
        no_pol: '',
        brand: '',
        type: '',
        model: '',
        kapasitas: '',
        tahun: '',
        kilometer: 0,
        next_service_km: 0,
        next_service_date: '',
        last_service: '',
        status_pembayaran: 'belum_ada_pembayaran',
        dp: 0,
        dp_paid: false,
        product_ordered: [],
        service_ordered: [],
        keluhan: '',
        saran: '',
        keterangan: '',
        status: 'draft',
        pajak: 0,
        karyawan_id: '',
        totalPembayaran: 0,
        totalProductCost: 0,
        totalProductDiscount: 0,
      },
      selectedPaket: '',
      paketList: [],

      isUseTax: false,
      showAddServiceModal: false,
      newService: {
        name: '',
        description: '',
        price: 0,
        cost: 0,
      },
      showPaymentModal: false,
      showDpPaymentModal: false,
      paymentStatus: null,
      workOrderStatus: null,
      showPdfPreview: false,
      pdfPreviewUrl: '',
      pdfFileName: 'workorder.pdf',
    }
  },
  computed: {
    totalProductDiscount() {
      // Discount as percentage
      return this.calculatetotalProductDiscount()
    },
    totalProductHarga() {
      return this.calculatetotalProductHarga()
    },
    totalServiceHarga() {
      return this.calculatetotalServiceHarga()
    },
    totalServiceDiscount() {
      // Discount as percentage, like in totalProductDiscount
      return this.calculatetotalServiceDiscount()
    },
    totalProductCost() {
      return this.calculatetotalProductCost()
    },
    totalServiceCost() {
      return this.calculatetotalServiceCost()
    },
    grandTotalHarga() {
      return this.calculategrandTotalHarga()
    },
    grandTotalDiscount() {
      return this.calculategrandTotalDiscount()
    },
    pajakAmount() {
      return this.calculatepajakAmount()
    },
    totalPembayaran() {
      return this.calculatetotalPembayaran()
    },
    hasUnconfirmedChanges() {
      // Check if any product or service item is new or modified but not confirmed
      const hasUnconfirmedProduct = this.form.product_ordered.some(
        (item) => item.isNew || item.isModified,
      )
      const hasUnconfirmedService = this.form.service_ordered.some(
        (item) => item.isNew || item.isModified,
      )
      return hasUnconfirmedProduct || hasUnconfirmedService
    },
    isCompleted() {
      // Consider completed only if status is selesai/dibayar AND payment is already lunas
      // This allows updating WO while payment status is not lunas
      const statusCompleted = this.initialStatus === 'selesai' || this.initialStatus === 'dibayar'
      const paymentLunas = this.form.status_pembayaran === 'lunas'
      return statusCompleted && paymentLunas
    },
    isAdmin() {
      const rawRole =
        localStorage.getItem('role') ||
        localStorage.getItem('role_name') ||
        localStorage.getItem('user') ||
        localStorage.getItem('userData')
      let roleText = ''

      if (rawRole) {
        try {
          const parsed = typeof rawRole === 'string' ? JSON.parse(rawRole) : rawRole
          roleText = (parsed?.role || parsed?.role_name || rawRole || '').toString()
        } catch (e) {
          roleText = rawRole.toString() + e.message
        }
      }

      roleText = roleText.toLowerCase().trim()
      return roleText.includes('admin')
    },
  },
  watch: {
    totalPembayaran(newVal) {
      this.isitotalPembayaran = newVal
    },
    totalProductHarga(newVal) {
      this.isitotalProductHarga = newVal
    },
    totalServiceHarga(newVal) {
      this.isitotalServiceHarga = newVal
    },
    totalProductDiscount(newVal) {
      this.isitotalProductDiscount = newVal
    },
    totalServiceDiscount(newVal) {
      this.isitotalServiceDiscount = newVal
    },
    pajakAmount(newVal) {
      this.isiPajakAmount = newVal
    },
    totalProductCost(newVal) {
      this.form.totalProductCost = newVal
    },
    totalServiceCost(newVal) {
      this.form.totalServiceCost = newVal
    },
  },
  setup() {
    const loadingStore = useLoadingStore()
    const show_toast = ref(false)
    const message_toast = ref('')
    const username = localStorage.getItem('username')
    return { loadingStore, show_toast, message_toast, BASE_URL, BASE_URL2, username }
  },
  created() {
    this.getProduct()
    this.getService()
    this.getSatuans()
    this.getWorkOrderData()
    this.getKaryawan()
    this.initializeNextServiceDate()
  },
  methods: {
    onServiceNameInput(val) {
      this.newService.name = (val || '').toString().toUpperCase()
    },
    tutupToast() {
      this.show_toast = false
      this.message_toast = ''
      window.location.reload()
    },

    initializeNextServiceDate() {
      // Set next service date to current date + 3 months if not already set
      if (!this.form.next_service_date) {
        const today = new Date()
        today.setMonth(today.getMonth() + 3)
        this.form.next_service_date = today.toISOString().split('T')[0]
      }
    },

    updateNextServiceKm() {
      // Auto-calculate next service km as current km + 5000
      this.form.next_service_km = (this.form.kilometer || 0) + 5000
    },

    calculatetotalProductDiscount() {
      // Discount as direct amount
      return this.form.product_ordered.reduce((sum, item) => {
        const discount = Number(item.discount) || 0
        return sum + discount
      }, 0)
    },

    calculatetotalProductHarga() {
      return this.form.product_ordered.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0)
    },

    calculatetotalServiceHarga() {
      return (this.form.totalServiceHarga = this.form.service_ordered.reduce(
        (sum, item) => sum + this.serviceSubtotal(item),
        0,
      ))
    },

    calculatetotalServiceDiscount() {
      // Discount as direct amount
      return (this.form.totalServiceDiscount = this.form.service_ordered.reduce((sum, item) => {
        const discount = Number(item.discount) || 0
        return sum + discount
      }, 0))
    },

    calculategrandTotalHarga() {
      return (this.form.grandTotalHarga = this.totalProductHarga + this.totalServiceHarga)
    },

    calculategrandTotalDiscount() {
      return (this.form.grandTotalDiscount = this.totalProductDiscount + this.totalServiceDiscount)
    },

    calculatetotalPembayaran() {
      const subtotal = Math.max(0, this.grandTotalHarga)
      let total = subtotal + this.pajakAmount

      // Reduce total by DP amount if DP amount is greater than 0
      if (this.form.dp > 0) {
        total -= this.form.dp || 0
      }

      return (this.form.totalPembayaran = Math.max(0, total))
    },

    calculatepajakAmount() {
      if (!this.isUseTax) return 0
      const subtotal = Math.max(0, this.grandTotalHarga)
      return (this.form.pajak = subtotal * 0.11)
    },
    calculatetotalServiceCost() {
      return (this.form.totalServiceCost = this.form.service_ordered.reduce(
        (sum, item) => sum + this.serviceSubtotalHPP(item),
        0,
      ))
    },

    calculatetotalProductCost() {
      return (this.form.totalProductCost = this.form.product_ordered.reduce(
        (sum, item) => sum + this.productSubtotalHPP(item),
        0,
      ))
    },

    async getKaryawan() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}karyawans/all`)
        // console.log('Karyawan Data: ', response.data.data)
        this.karyawan = response.data.data
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async getWorkOrderData() {
      try {
        this.loadingStore.show()
        const idku = this.$route.params.id
        const response = await axios.get(`${BASE_URL}workorders/${idku}`)
        console.log('Workorder Data: ', response.data.data)
        this.dataWorkorder = response.data.data
        this.form.customer_id = this.dataWorkorder.customer_id
        this.form.vehicle_id = this.dataWorkorder.vehicle_id
        this.form.keluhan = this.dataWorkorder.keluhan
        this.form.saran = this.dataWorkorder.saran
        this.form.keterangan = this.dataWorkorder.keterangan || ''
        this.form.status = this.dataWorkorder.status
        this.initialStatus = this.dataWorkorder.status // Simpan status awal
        this.form.karyawan_id = this.dataWorkorder.karyawan_id
        this.isUseTax = this.dataWorkorder.pajak
        this.form.nama = this.dataWorkorder.customer_name
        this.form.alamat = this.dataWorkorder.customer_alamat
        this.form.hp = this.dataWorkorder.customer_hp
        this.form.email = this.dataWorkorder.customer_email
        this.form.brand = this.dataWorkorder.vehicle_brand
        this.form.kapasitas = this.dataWorkorder.vehicle_kapasitas
        this.form.model = this.dataWorkorder.vehicle_model
        this.form.no_pol = this.dataWorkorder.vehicle_no_pol
        this.form.no_wo = this.dataWorkorder.no_wo
        this.form.type = this.dataWorkorder.vehicle_type
        this.form.tahun = this.dataWorkorder.vehicle_tahun || ''
        this.form.kilometer = this.dataWorkorder.kilometer || 0
        this.form.next_service_km = this.dataWorkorder.next_service_km || this.form.kilometer + 5000
        this.form.next_service_date = this.dataWorkorder.next_service_date || ''
        this.form.last_service = this.dataWorkorder.last_service || ''
        this.form.status_pembayaran = this.dataWorkorder.status_pembayaran || 'belum_ada_pembayaran'
        this.form.dp = this.dataWorkorder.dp || 0
        this.form.dp_paid = this.dataWorkorder.dp_paid || false
        await this.checkPaymentStatus()
        await this.checkWorkOrderStatus()
        this.form.vehicle_id = this.dataWorkorder.vehicle_id
        this.form.tanggal_masuk = this.dataWorkorder.tanggal_masuk
        this.form.product_ordered = (this.dataWorkorder.product_ordered || []).map((item) => ({
          ...item,
          cost: item.cost || 0,
          isNew: false,
          isModified: false,
          searchQuery: item.product_name || '',
          showSuggestions: false,
          activeIndex: -1,
        }))
        this.form.service_ordered = (this.dataWorkorder.service_ordered || []).map((item) => ({
          ...item,
          cost: item.cost || 0,
          isNew: false,
          isModified: false,
          searchQuery: item.service_name || '',
          showSuggestions: false,
          activeIndex: -1,
        }))
        // Update cost from latest product/service data
        await Promise.all(
          this.form.product_ordered.map(async (item) => {
            if (item.product_id) {
              await this.getProductsId(item)
            }
          }),
        )
        await Promise.all(
          this.form.service_ordered.map(async (item) => {
            if (item.service_id) {
              await this.getServicesId(item)
            }
          }),
        )
        if (this.dataWorkorder.pajak > 0) {
          this.isUseTax = true
        } else {
          this.isUseTax = false
        }
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async getSatuans() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/satuans/all`)
        // console.log('Satuan Data: ', response.data.data)
        this.satuans = response.data.data
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async getStock(item) {
      if (!item.product_id) return
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/inventory/${item.product_id}`)
        const data = response.data.data
        // Simpan stok di item
        item.stockku = data.total_stock || 0

        // Validasi: jika quantity melebihi stok, reset dan beri warning
        this.validateQuantity(item)
      } catch (error) {
        console.log('error: ', error)
        item.stockku = 0
      } finally {
        this.loadingStore.hide()
      }
    },
    async getBookingData() {
      const bookingData = localStorage.getItem('bookingDataSaveToWO')
      // console.log('Booking Data from LocalStorage: ', bookingData)
      const parsedData = bookingData ? JSON.parse(bookingData) : null
      // console.log('Parsed Booking Data: ', parsedData)
      // console.log('Vehicle ID from LocalStorage: ', parsedData?.vehicle_id)
      // console.log('Booking ID from LocalStorage: ', parsedData?.booking_id)
      // console.log('Current Vehicle ID from Route: ', this.form.vehicle_id)

      if (parsedData && parsedData.vehicle_id === this.form.vehicle_id) {
        try {
          this.loadingStore.show()
          const response = await api.get(`${BASE_URL}bookings/delete/${parsedData.booking_id}`)
          console.log('Booking Delete Details Data: ', response.data.data)
          this.show_toast = true
          this.message_toast = 'Booking berhasil dihapus setelah membuat Work Order.'
        } catch (error) {
          console.log('error delete Booking: ', error)
        } finally {
          this.loadingStore.hide()
        }
      }
    },

    async getProduct() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/all`)
        // console.log('Data Products: ', response.data.data)
        this.products = response.data.data
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async getService() {
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/service/all`)
        // console.log('Data Services: ', response.data.data)
        this.services = response.data.data
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },

    addProductOrder() {
      this.form.product_ordered.push({
        product_id: '',
        quantity: 0,
        satuan_id: '',
        price: 0,
        discount: 0,
        subtotal: 0,
        cost: 0,
        isNew: true,
        isModified: false,
        searchQuery: '',
        showSuggestions: false,
        activeIndex: -1,
        product_name: '',
      })
    },
    async removeProductOrder(idx) {
      const item = this.form.product_ordered[idx]
      try {
        this.loadingStore.show()
        const response = await api.delete(
          `${BASE_URL}workorders/delete/productorder/${item.id}`,
          item,
        )
        this.show_toast = true
        this.message_toast = response.data.message
      } catch (error) {
        console.log('Error: ', error)
      } finally {
        this.loadingStore.hide()
      }
      this.form.product_ordered.splice(idx, 1)
    },
    addServiceOrder() {
      this.form.service_ordered.push({
        service_id: '',
        quantity: 0,
        price: 0,
        discount: 0,
        subtotal: 0,
        cost: 0,
        isNew: true,
        isModified: false,
        searchQuery: '',
        showSuggestions: false,
        activeIndex: -1,
        service_name: '',
      })
    },
    async removeServiceOrder(idx) {
      const item = this.form.service_ordered[idx]
      try {
        this.loadingStore.show()
        const response = await api.delete(
          `${BASE_URL}workorders/delete/serviceorder/${item.id}`,
          item,
        )
        this.show_toast = true
        this.message_toast = response.data.message
      } catch (error) {
        console.log('Error: ', error)
      } finally {
        this.loadingStore.hide()
      }
      console.log('iteam data: ', item)
      this.form.service_ordered.splice(idx, 1)
    },
    productSubtotal(item) {
      const quantity = Number(item.quantity) || 0
      const price = Number(item.price) || 0
      const discount = Number(item.discount) || 0
      item.subtotal = Math.max(0, quantity * price - discount)
      item.productSubtotalHPP = this.productSubtotalHPP(item)
      // Cek stok setiap kali subtotal dihitung
      this.getStock(item)
      return item.subtotal
    },
    markProductModified(item) {
      if (!item.isNew) {
        item.isModified = true
      }
    },
    markServiceModified(item) {
      if (!item.isNew) {
        item.isModified = true
      }
    },
    async confirmAddProduct(idx) {
      const item = this.form.product_ordered[idx]
      if (!item.product_id || item.quantity <= 0) {
        this.message_toast = 'Please select a product and set quantity.'
        this.show_toast = true
        return
      }
      item.isNew = false
      item.isModified = false
      this.productSubtotal(item)
      const workorder_id = this.$route.params.id
      item.workorder_id = workorder_id
      console.log('Data item', item, 'workorder: ', workorder_id)
      try {
        this.loadingStore.show()
        const response = await api.post(`${BASE_URL}workorders/add/productorder`, item)
        this.show_toast = true
        this.message_toast = response.data.message
      } catch (error) {
        console.log('Error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async confirmUpdateProduct(idx) {
      const item = this.form.product_ordered[idx]
      item.isModified = false
      this.productSubtotal(item)
      const workorder_id = this.$route.params.id

      console.log('data item: ', item, 'workorder_id: ', workorder_id)
      try {
        this.loadingStore.show()
        const response = await api.put(`${BASE_URL}workorders/update/productorder/${item.id}`, item)
        this.show_toast = true
        this.message_toast = response.data.message
      } catch (error) {
        console.log('Error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async confirmAddService(idx) {
      const item = this.form.service_ordered[idx]
      if (!item.service_id || item.quantity <= 0) {
        this.message_toast = 'Please select a service and set quantity.'
        this.show_toast = true
        return
      }
      item.isNew = false
      item.isModified = false
      this.updateServiceSubtotal(item)
      const workorder_id = this.$route.params.id
      console.log('data item: ', item, 'workorder_id: ', workorder_id)
      item.workorder_id = workorder_id
      try {
        this.loadingStore.show()
        const response = await api.post(`${BASE_URL}workorders/add/serviceorder`, item)
        this.show_toast = true
        this.message_toast = response.data.message
      } catch (error) {
        console.log('Error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async confirmUpdateService(idx) {
      const item = this.form.service_ordered[idx]
      item.isModified = false
      this.updateServiceSubtotal(item)
      const workorder_id = this.$route.params.id
      console.log('data item: ', item, 'workorder_id: ', workorder_id)
      try {
        this.loadingStore.show()
        const response = await api.put(`${BASE_URL}workorders/update/serviceorder/${item.id}`, item)
        this.show_toast = true
        this.message_toast = response.data.message
      } catch (error) {
        console.log('Error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    serviceSubtotal(item) {
      const quantity = Number(item.quantity) || 0
      const price = Number(item.price) || 0
      const discount = Number(item.discount) || 0
      // Diskon sebagai amount langsung
      return (item.serviceSubtotal = Math.max(0, quantity * price - discount))
    },
    updateServiceSubtotal(item) {
      // Trigger reactivity for service subtotal when discount changes
      item.serviceSubtotal = this.serviceSubtotal(item)
      item.serviceSubtotalHPP = this.serviceSubtotalHPP(item)
    },
    productSubtotalHPP(item) {
      return (item.quantity || 0) * (item.cost || 0)
    },
    serviceSubtotalHPP(item) {
      return (item.quantity || 0) * (item.cost || 0)
    },
    formatCurrency(val) {
      if (!val || isNaN(val)) return '0'
      return new Intl.NumberFormat('id-ID', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val)
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}-${month}-${year}`
    },
    async submitForm() {
      return this.submitFormWithStatus('dikerjakan')
    },
    async submitFormSelesai() {
      return this.submitFormWithStatus('selesai')
    },
    async submitFormWithStatus(targetStatus) {
      this.form.status = targetStatus
      // Tanggal masuk: set as Date object
      this.form.tanggal_masuk = new Date()
      // Set last_service to current date (YYYY-MM-DD format) if not already set
      if (!this.form.last_service) {
        this.form.last_service = new Date().toISOString().split('T')[0]
      }
      this.form.total_biaya = this.totalPembayaran
      this.form.pajak = this.pajakAmount
      this.form.total_discount = this.totalProductDiscount + this.totalServiceDiscount
      this.form.totalProductCost = this.totalProductCost
      this.form.totalServiceCost = this.totalServiceCost
      this.form.grandTotalHarga = this.grandTotalHarga
      this.form.grandTotalDiscount = this.grandTotalDiscount
      this.form.totalPembayaran = this.totalPembayaran
      this.form.totalProductHarga = this.totalProductHarga
      this.form.totalServiceHarga = this.totalServiceHarga
      this.form.totalProductDiscount = this.totalProductDiscount
      this.form.totalServiceDiscount = this.totalServiceDiscount
      this.form.hpp = this.totalServiceCost + this.totalProductCost
      this.form.dp = this.form.dp || 0
      this.form.workorder_id = this.$route.params.id

      // Ensure numeric fields in product_ordered are numbers
      this.form.product_ordered.forEach((item) => {
        item.quantity = Number(item.quantity) || 0
        item.price = parseFloat(item.price) || 0
        item.discount = parseFloat(item.discount) || 0
        item.cost = parseFloat(item.cost) || 0
        item.subtotal = parseFloat(item.subtotal) || 0
      })

      // Ensure numeric fields in service_ordered are numbers
      this.form.service_ordered.forEach((item) => {
        item.quantity = Number(item.quantity) || 0
        item.price = parseFloat(item.price) || 0
        item.discount = parseFloat(item.discount) || 0
        item.cost = parseFloat(item.cost) || 0
        item.serviceSubtotal = parseFloat(item.serviceSubtotal) || 0
      })

      try {
        this.loadingStore.show()
        const response = await api.post(
          `${this.BASE_URL}workorders/update/workorderlengkap/${this.form.workorder_id}`,
          this.form,
        )
        this.show_toast = true
        this.message_toast = response.data.message
        console.log('Workorder id: ', this.form.workorder_id)
        this.initialStatus = this.form.status // Update initialStatus setelah submit berhasil
        this.workOrderUpdated = true // Set flag bahwa work order telah diupdate
        this.getBookingData()
      } catch (error) {
        console.log('error: ', error)
        this.show_toast = true
        this.message_toast = 'Gagal submit work order!'
      } finally {
        this.loadingStore.hide()
      }

      console.log('Form Data:', this.form)
    },
    buildPdfDocument() {
      const doc = new jsPDF('p', 'mm', 'a4')

      const primaryColor = [0, 0, 0]

      // ===== HEADER =====
      doc.setFillColor(245, 245, 245)
      doc.rect(10, 8, 190, 20, 'F')

      // logo
      doc.setDrawColor(220, 220, 220)
      doc.roundedRect(12, 10, 50, 16, 2, 2)
      if (typeof logoImage !== 'undefined' && logoImage) {
        doc.addImage(logoImage, 'PNG', 12, 10, 50, 16)
      }

      // nama bengkel
      doc.setTextColor(...primaryColor)
      doc.setFontSize(13)
      doc.setFont('Helvetica', 'bold')
      doc.text('Bengkel Car Speed', 66, 15)

      doc.setFontSize(8.5)
      doc.setFont('Helvetica', 'normal')
      doc.text('Jl. Suryopranoto No. 10, Gunung Ketur, Pakualaman, Yogyakarta', 66, 20)
      doc.text('Telp 0274-5021953', 66, 24)

      // ===== badge status (diperkecil) =====
      let badgeText = ''
      if (this.form.status === 'draft') badgeText = 'ESTIMASI WO'
      if (this.form.status_pembayaran === 'lunas') badgeText = 'INVOICE LUNAS'
      if (this.form.status_pembayaran === 'tempo') badgeText = 'WORK ORDER TEMPO'

      if (badgeText) {
        const badgeX = 158
        const badgeY = 11
        const badgeW = 40
        const badgeH = 8
        doc.setFillColor(237, 248, 255)
        doc.setDrawColor(66, 133, 244)
        doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 2, 2, 'FD')
        doc.setFontSize(7.3)
        doc.setTextColor(0, 0, 0)
        doc.text(badgeText, badgeX + badgeW / 2, badgeY + 5, { align: 'center' })
      }

      // garis bawah header
      doc.setDrawColor(220, 220, 220)
      doc.setLineWidth(0.4)
      doc.line(10, 30, 200, 30)

      // ===== INFO UTAMA / BOX PELANGGAN =====
      let y = 36
      doc.setFont('Helvetica', 'bold')
      doc.setFontSize(9)
      doc.text(`No: ${this.form.no_wo || '-'}`, 10, y)
      y += 4

      // box
      doc.setDrawColor(230, 230, 230)
      doc.setLineWidth(0.2)
      doc.roundedRect(10, y, 190, 26, 2, 2)

      const leftX = 14
      const rightX = 110
      let rowY = y + 5

      doc.setFont('Helvetica', 'normal')
      doc.setFontSize(8.5)

      // kolom kiri (pakai titik dua supaya rapi)
      doc.text('Nama', leftX, rowY)
      doc.text(':', leftX + 18, rowY)
      doc.text(this.form.nama || '-', leftX + 20, rowY)

      doc.text('Alamat', leftX, rowY + 4)
      doc.text(':', leftX + 18, rowY + 4)
      doc.text(this.form.alamat || '-', leftX + 20, rowY + 4)

      doc.text('No. Polisi', leftX, rowY + 8)
      doc.text(':', leftX + 18, rowY + 8)
      doc.text(this.form.no_pol || '-', leftX + 20, rowY + 8)

      doc.text('Kilometer', leftX, rowY + 12)
      doc.text(':', leftX + 18, rowY + 12)
      doc.text(String(this.form.kilometer || '-'), leftX + 20, rowY + 12)

      // kolom kanan (label, :, isi) -> supaya Brand / Type & Tanggal sejajar
      const labelX = rightX
      const colonX = rightX + 23
      const valueX = rightX + 25

      doc.text('HP', labelX, rowY)
      doc.text(':', colonX, rowY)
      doc.text(this.form.hp || '-', valueX, rowY)

      doc.text('Email', labelX, rowY + 4)
      doc.text(':', colonX, rowY + 4)
      doc.text(this.form.email || '-', valueX, rowY + 4)

      doc.text('Brand / Type', labelX, rowY + 8)
      doc.text(':', colonX, rowY + 8)
      doc.text(`${this.form.brand || '-'} / ${this.form.type || '-'}`, valueX, rowY + 8)

      doc.text('Tanggal', labelX, rowY + 12)
      doc.text(':', colonX, rowY + 12)
      doc.text(this.formatDate(this.form.tanggal_masuk) || '-', valueX, rowY + 12)

      y = y + 26 + 6

      // ===== PRODUCT ORDER =====
      doc.setFont('Helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.text('Product Order (Sparepart)', 10, y)
      y += 4
      doc.roundedRect(10, y, 190, 6, 1, 1)
      doc.setFillColor(245, 245, 245)
      doc.rect(10, y, 190, 6, 'F')

      doc.setFont('Helvetica', 'bold')
      doc.setFontSize(8)
      doc.text('No', 12, y + 4)
      doc.text('Nama', 20, y + 4)
      doc.text('Qty', 105, y + 4)
      doc.text('Harga', 125, y + 4)
      doc.text('Disc', 150, y + 4)
      doc.text('Subtotal', 175, y + 4)
      y += 7

      doc.setFont('Helvetica', 'normal')
      const products = this.form.product_ordered || []
      let productIndex = 1
      products.forEach((item) => {
        doc.setDrawColor(240, 240, 240)
        doc.line(10, y + 1.5, 200, y + 1.5)

        doc.text(String(productIndex), 12, y + 4)
        doc.text(item.product_name || '-', 20, y + 4)
        doc.text(String(item.quantity || 0), 107, y + 4, { align: 'right' })
        doc.text(String(this.formatCurrency(item.price || 0)), 140, y + 4, { align: 'right' })
        doc.text(String(this.formatCurrency(item.discount || 0)), 162, y + 4, { align: 'right' })
        doc.text(String(this.formatCurrency(item.subtotal || 0)), 198, y + 4, { align: 'right' })
        productIndex++
        y += 6
      })

      y += 4

      // ===== SERVICE ORDER =====
      doc.setFont('Helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.text('Service Order (Jasa)', 10, y)
      y += 4
      doc.roundedRect(10, y, 190, 6, 1, 1)
      doc.setFillColor(245, 245, 245)
      doc.rect(10, y, 190, 6, 'F')

      doc.setFont('Helvetica', 'bold')
      doc.setFontSize(8)
      doc.text('No', 12, y + 4)
      doc.text('Nama Jasa', 20, y + 4)
      doc.text('Qty', 105, y + 4)
      doc.text('Harga', 125, y + 4)
      doc.text('Disc', 150, y + 4)
      doc.text('Subtotal', 175, y + 4)
      y += 7

      doc.setFont('Helvetica', 'normal')
      const services = this.form.service_ordered || []
      let serviceIndex = 1
      services.forEach((item) => {
        doc.setDrawColor(240, 240, 240)
        doc.line(10, y + 1.5, 200, y + 1.5)

        doc.text(String(serviceIndex), 12, y + 4)
        doc.text(item.service_name || '-', 20, y + 4)
        doc.text(String(item.quantity || 0), 107, y + 4, { align: 'right' })
        doc.text(String(this.formatCurrency(item.price || 0)), 140, y + 4, { align: 'right' })
        doc.text(String(this.formatCurrency(item.discount || 0)), 162, y + 4, { align: 'right' })
        doc.text(String(this.formatCurrency(item.serviceSubtotal || 0)), 198, y + 4, {
          align: 'right',
        })
        serviceIndex++
        y += 6
      })

      y += 6

      // ===== KELUHAN =====
      doc.setFont('Helvetica', 'bold')
      doc.text('Keluhan', 10, y)
      y += 2
      const keluhanLines = doc.splitTextToSize(this.form.keluhan || '-', 120)
      const keluhanHeight = keluhanLines.length * 4 + 4
      doc.setDrawColor(230, 230, 230)
      doc.roundedRect(10, y + 1, 120, keluhanHeight, 2, 2)
      doc.setFont('Helvetica', 'normal')
      doc.text(keluhanLines, 13, y + 6)

      const leftY = y + keluhanHeight + 6

      // ===== SARAN ===== (right below Keluhan)
      doc.setFont('Helvetica', 'bold')
      doc.setFontSize(9)
      doc.text('Saran', 10, leftY)
      const saranY = leftY + 2
      const saranLines = doc.splitTextToSize(this.form.saran || '-', 120)
      const saranHeight = saranLines.length * 4 + 4
      doc.setDrawColor(230, 230, 230)
      doc.roundedRect(10, saranY + 1, 120, saranHeight, 2, 2)
      doc.setFont('Helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.text(saranLines, 13, saranY + 6)

      const rightStartY = y // Right column starts at same y as Keluhan

      // ===== BOX TOTAL DI KANAN =====
      const totalBoxTop = rightStartY + 1
      doc.setDrawColor(230, 230, 230)
      doc.roundedRect(135, totalBoxTop, 65, 40, 2, 2)
      let totalY = totalBoxTop + 6
      doc.setFont('Helvetica', 'bold')
      doc.setFontSize(8.5)
      doc.text('Ringkasan Biaya', 168, totalY, { align: 'center' })
      totalY += 4
      doc.setFont('Helvetica', 'normal')

      const putTotalRow = (label, value) => {
        doc.text(label, 138, totalY)
        // Rp agak ke kiri supaya nggak nempel nominal
        doc.text('Rp', 178, totalY, { align: 'right' })
        const amountText = String(this.formatCurrency(value || 0))
        doc.text(amountText, 198, totalY, { align: 'right' })
        totalY += 4
      }

      putTotalRow('Total Sparepart', this.totalProductHarga)
      putTotalRow('Total Jasa', this.form.totalServiceHarga)
      putTotalRow('Pajak (11%)', this.form.pajak)
      if (this.form.dp > 0) {
        putTotalRow('DP', this.form.dp)
      }

      // total bayar
      doc.setFont('Helvetica', 'bold')
      doc.text('TOTAL BAYAR', 138, totalY + 1.5)
      doc.text('Rp', 178, totalY + 1.5, { align: 'right' })
      const grandTotalText = String(this.formatCurrency(this.form.totalPembayaran || 0))
      doc.text(grandTotalText, 198, totalY + 1.5, { align: 'right' })

      // ===== INFO SERVIS BERIKUTNYA ===== (below Ringkasan Biaya)
      const infoY = totalBoxTop + 40 + 5
      doc.setFont('Helvetica', 'bold')
      doc.text('Info Servis Berikutnya', 135, infoY)
      doc.setFont('Helvetica', 'normal')
      doc.setFontSize(8)
      doc.text(
        `Kilometer berikutnya : ${String(this.formatCurrency(this.form.next_service_km || 0))} km`,
        135,
        infoY + 6,
      )
      doc.text(
        `Tanggal berikutnya  : ${this.formatDate(this.form.next_service_date) || '-'}`,
        135,
        infoY + 11,
      )

      // ===== SIGNATURE DI BAWAH =====
      const maxBottom = Math.max(leftY + saranHeight + 6, infoY + 20)
      let sigY = maxBottom + 10

      doc.setFont('Helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.text('Nama Pelanggan', 20, sigY)
      doc.text('Car Speed', 140, sigY)
      doc.line(15, sigY + 18, 60, sigY + 18)
      doc.line(135, sigY + 18, 185, sigY + 18)
      doc.text(this.form.nama || '-', 20, sigY + 23)
      doc.text(this.username || '-', 140, sigY + 23)

      // ===== OUTER BORDER =====
      doc.setDrawColor(10, 10, 145) // Blue color
      doc.setLineWidth(1.5)
      doc.setFillColor(0, 0, 255) // Blue fill for opacity effect
      doc.setGState(new doc.GState({ opacity: 0.2 })) // Set opacity to 20%
      doc.rect(5, 5, 200, 287, 'S') // Outer frame with stroke only
      doc.setGState(new doc.GState({ opacity: 1 })) // Reset opacity

      return doc
    },

    openPdfPreview() {
      const doc = this.buildPdfDocument()
      const blob = doc.output('blob')
      if (this.pdfPreviewUrl) {
        URL.revokeObjectURL(this.pdfPreviewUrl)
      }
      this.pdfFileName = `workorder-${this.form.no_pol || this.form.nama || 'wo'}.pdf`
      this.pdfPreviewUrl = URL.createObjectURL(blob)
      this.showPdfPreview = true
    },
    downloadPdf() {
      const doc = this.buildPdfDocument()
      doc.save(this.pdfFileName || 'workorder.pdf')
    },
    printPdf() {
      const iframeWindow = this.$refs.pdfIframe?.contentWindow
      if (iframeWindow && this.pdfPreviewUrl) {
        iframeWindow.focus()
        iframeWindow.print()
        return
      }

      const doc = this.buildPdfDocument()
      doc.autoPrint?.()
      doc.output('dataurlnewwindow')
    },
    closePdfPreview() {
      if (this.pdfPreviewUrl) {
        URL.revokeObjectURL(this.pdfPreviewUrl)
      }
      this.pdfPreviewUrl = ''
      this.showPdfPreview = false
    },

    openAddServiceModal() {
      this.showAddServiceModal = true
    },
    closeAddServiceModal() {
      this.showAddServiceModal = false
      this.newService = {
        name: '',
        description: '',
        price: 0,
        cost: 0,
      }
    },
    async submitNewService() {
      try {
        this.loadingStore.show()
        const response = await api.post(
          `${this.BASE_URL}products/service/create/new`,
          this.newService,
        )
        console.log('New service created:', response.data.data)
        // Add the new service to the services array
        this.services.push(response.data.data)
        this.show_toast = true
        this.message_toast = response.data.message || 'Service berhasil ditambahkan!'
        this.closeAddServiceModal()
      } catch (error) {
        console.error('Error creating service:', error)
        this.show_toast = true
        this.message_toast = error.response?.data?.message || 'Gagal menambahkan service!'
      } finally {
        this.loadingStore.hide()
      }
    },
    openPaymentModal() {
      if (this.form.status === 'selesai' && this.form.status_pembayaran !== 'lunas') {
        this.showPaymentModal = true
      }
    },
    openDpPaymentModal() {
      if (this.form.dp > 0 && this.paymentStatus !== 'lunas') {
        this.showDpPaymentModal = true
      }
    },
    closePaymentModal() {
      this.showPaymentModal = false
    },
    closeDpPaymentModal() {
      this.showDpPaymentModal = false
    },
    async handlePaymentSubmit(paymentData) {
      // Prevent double submission
      if (this.isProcessingPayment) {
        return
      }

      this.isProcessingPayment = true

      try {
        this.loadingStore.show()

        // Prepare payment data for sales-payment-journal endpoint
        const paymentPayload = {
          date: paymentData.date,
          memo: paymentData.description,
          customer_id: this.form.customer_id,
          workorder_id: this.$route.params.id,
          amount: paymentData.amount,
          kas_bank_code: paymentData.bankCode,
          piutang_code: '2001',
          payment_no: `PAY-SAL-${this.form.no_wo}-${paymentData.date.replace(/-/g, '')}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
        }

        console.log('Payment Data:', paymentPayload)

        // Submit payment to backend
        const response = await api.post(
          `${this.BASE_URL}accounting/sales-payment-journal`,
          paymentPayload,
        )

        // Check if payment amount equals total payment amount
        if (paymentData.amount === this.totalPembayaran) {
          // Update status to 'dibayar' and 'lunas' using update-only-status endpoint
          const statusPayload = { ...paymentPayload } // Same payload
          await api.post(`${this.BASE_URL}workorders/update-only-status`, statusPayload)

          // Update local status
          this.form.status = 'dibayar'
          this.form.status_pembayaran = 'lunas'
          this.initialStatus = 'dibayar'
        }

        this.show_toast = true
        this.message_toast = response.data.message || 'Pembayaran berhasil diproses!'

        // Refresh data
        await this.getWorkOrderData()
        await this.checkPaymentStatus()
      } catch (error) {
        console.error('Error processing payment:', error)
        this.show_toast = true
        this.message_toast = error.response?.data?.message || 'Gagal memproses pembayaran!'
      } finally {
        this.loadingStore.hide()
        this.isProcessingPayment = false
      }
    },
    async handleDpPaymentSubmit(paymentData) {
      // Prevent double submission
      if (this.isProcessingPayment) {
        return
      }

      this.isProcessingPayment = true

      try {
        this.loadingStore.show()

        // Prepare DP payment data for sales-payment-journal endpoint
        const paymentPayload = {
          date: paymentData.date,
          memo: paymentData.description,
          customer_id: this.form.customer_id,
          workorder_id: this.$route.params.id,
          amount: paymentData.amount,
          kas_bank_code: paymentData.bankCode,
          piutang_code: '2001',
          payment_no: `PAY-SAL-${this.form.no_wo}-DP-${paymentData.date.replace(/-/g, '')}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
        }

        console.log('DP Payment Data:', paymentPayload)

        // Submit DP payment to backend
        const response = await api.post(
          `${this.BASE_URL}accounting/sales-payment-journal`,
          paymentPayload,
        )

        // Update DP payment status
        this.form.dp_paid = true

        this.show_toast = true
        this.message_toast = response.data.message || 'Pembayaran DP berhasil diproses!'

        // Refresh data
        await this.getWorkOrderData()
        await this.checkPaymentStatus()
      } catch (error) {
        console.error('Error processing DP payment:', error)
        this.show_toast = true
        this.message_toast = error.response?.data?.message || 'Gagal memproses pembayaran DP!'
      } finally {
        this.loadingStore.hide()
        this.isProcessingPayment = false
      }
    },
    validateQuantity(item) {
      if (item.quantity > item.stockku) {
        item.quantity = item.stockku
        this.show_toast = true
        this.message_toast = `Quantity untuk ${item.product_name} tidak boleh melebihi stok (${item.stockku}).`
      }
    },
    // Product search methods
    onProductSearchInput(item) {
      item.activeIndex = -1
      item.showSuggestions = true
    },
    hideProductSuggestions(item) {
      setTimeout(() => {
        item.showSuggestions = false
        item.activeIndex = -1
      }, 500)
    },
    handleProductKeydown(event, item) {
      if (!item.showSuggestions || this.getFilteredProducts(item.searchQuery).length === 0) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          item.activeIndex = Math.min(
            item.activeIndex + 1,
            this.getFilteredProducts(item.searchQuery).length - 1,
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          item.activeIndex = Math.max(item.activeIndex - 1, -1)
          break
        case 'Enter':
          event.preventDefault()
          if (item.activeIndex >= 0) {
            this.selectProduct(this.getFilteredProducts(item.searchQuery)[item.activeIndex], item)
          }
          break
        case 'Escape':
          item.showSuggestions = false
          item.activeIndex = -1
          break
      }
    },
    selectProduct(product, item) {
      item.product_id = product.id
      item.product_name = product.name
      this.getProductsId(item)
      this.markProductModified(item)
      item.searchQuery = product.name
      item.showSuggestions = false
      item.activeIndex = -1
    },
    // Service search methods
    onServiceSearchInput(item) {
      item.activeIndex = -1
      item.showSuggestions = true
    },
    hideServiceSuggestions(item) {
      setTimeout(() => {
        item.showSuggestions = false
        item.activeIndex = -1
      }, 500)
    },
    handleServiceKeydown(event, item) {
      if (!item.showSuggestions || this.getFilteredServices(item.searchQuery).length === 0) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          item.activeIndex = Math.min(
            item.activeIndex + 1,
            this.getFilteredServices(item.searchQuery).length - 1,
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          item.activeIndex = Math.max(item.activeIndex - 1, -1)
          break
        case 'Enter':
          event.preventDefault()
          if (item.activeIndex >= 0) {
            this.selectService(this.getFilteredServices(item.searchQuery)[item.activeIndex], item)
          }
          break
        case 'Escape':
          item.showSuggestions = false
          item.activeIndex = -1
          break
      }
    },
    selectService(service, item) {
      item.service_id = service.id
      item.service_name = service.name
      this.getServicesId(item)
      this.markServiceModified(item)
      item.searchQuery = service.name
      item.showSuggestions = false
      item.activeIndex = -1
    },
    getFilteredProducts(query) {
      if (!query) return this.products
      const searchQuery = query.toLowerCase()
      return this.products.filter((product) => product.name.toLowerCase().includes(searchQuery))
    },
    getFilteredServices(query) {
      if (!query) return this.services
      const searchQuery = query.toLowerCase()
      return this.services.filter((service) => service.name.toLowerCase().includes(searchQuery))
    },
    async getProductsId(item) {
      if (!item.product_id) return
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/${item.product_id}`)
        const data = response.data.data

        item.satuan_id = data.satuan_id
        item.product_name = data.name
        item.cost = Number(data.cost) || 0
        if (data.price) item.price = data.price
        await this.getStock(item)
        this.productSubtotal(item)
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async getServicesId(item) {
      if (!item.service_id) return
      try {
        this.loadingStore.show()
        const response = await axios.get(`${BASE_URL}products/service/${item.service_id}`)
        const data = response.data.data
        // Update satuan_id dan price pada item yang dipilih
        if (data.price) item.price = data.price
        if (data.service_name) item.service_name = data.service_name
        if (data.cost) item.cost = Number(data.cost) || 0
        this.updateServiceSubtotal(item)
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.loadingStore.hide()
      }
    },
    async checkPaymentStatus() {
      try {
        const response = await axios.get(
          `${BASE_URL}workorders/${this.$route.params.id}/status-pembayaran`,
        )
        this.paymentStatus = response.data.data.status_pembayaran
        console.log('Payment Status:', this.paymentStatus)
      } catch (error) {
        console.error('Error fetching payment status:', error)
        this.paymentStatus = null
      }
    },
    async checkWorkOrderStatus() {
      try {
        const response = await axios.get(`${BASE_URL}workorders/${this.$route.params.id}/status`)
        this.workOrderStatus = response.data.data.status
        console.log('Work Order Status:', this.workOrderStatus)
      } catch (error) {
        console.error('Error fetching work order status:', error)
        this.workOrderStatus = null
      }
    },
  },
}
</script>

<style scoped>
/* Custom Gradient Classes */
.gradient-header {
  background: linear-gradient(to right, #575757, #dcdfe7);
}

.gradient-summary {
  background: linear-gradient(to right, #f9fafb, #eff6ff);
}

.gradient-modal-header {
  background: linear-gradient(to right, #3b82f6, #1d4ed8);
}

/* Modern Input Styles */
.modern-input {
  width: 100%;
  padding: 0.2rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  background-color: white;
  color: #111827;
  font-family: 'Lexend', sans-serif;
  transition: all 0.3s ease-in-out;
}

.modern-input::placeholder {
  color: transparent;
}

.modern-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(147, 197, 253, 0.3);
  background-color: rgba(239, 246, 255, 0.3);
}

.modern-input:hover {
  border-color: #d1d5db;
}

/* Modern Textarea Styles */
.modern-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: white;
  color: #111827;
  font-family: 'Lexend', sans-serif;
  transition: all 0.3s ease-in-out;
  resize: vertical;
  min-height: 6rem;
}

.modern-textarea::placeholder {
  color: transparent;
}

.modern-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(147, 197, 253, 0.3);
  background-color: rgba(239, 246, 255, 0.3);
}

.modern-textarea:hover {
  border-color: #d1d5db;
}

/* Modern Select Styles */
.modern-select {
  width: 100%;
  padding: 0.2rem 1rem;
  padding-right: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.2rem;
  background-color: white;
  color: #111827;
  font-family: 'Lexend', sans-serif;
  transition: all 0.3s ease-in-out;
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  font-size: 10pt;
}

.modern-select:focus {
  outline: none;
  border-color: #222223;
  box-shadow: 0 0 0 2px rgba(147, 197, 253, 0.3);
  background-color: rgba(239, 246, 255, 0.3);
}

.modern-select:hover {
  border-color: #d1d5db;
}

/* Floating Labels */
.modern-label {
  position: absolute;
  left: 1rem;
  top: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-family: 'Lexend', sans-serif;
  transition: all 0.3s ease-in-out;
  pointer-events: none;
  transform-origin: left top;
}

.modern-input:focus ~ .modern-label,
.modern-input:not(:placeholder-shown) ~ .modern-label {
  color: #2563eb;
  font-size: 0.75rem;
  transform: translateY(-1.75rem) scale(0.9);
}

/* Floating Labels for Textarea */
.modern-textarea-label {
  position: absolute;
  left: 1rem;
  top: 0.75rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-family: 'Lexend', sans-serif;
  transition: all 0.3s ease-in-out;
  pointer-events: none;
  transform-origin: left top;
}

.modern-textarea:focus ~ .modern-textarea-label,
.modern-textarea:not(:placeholder-shown) ~ .modern-textarea-label {
  color: #2563eb;
  font-size: 0.75rem;
  transform: translateY(-1.75rem) scale(0.9);
}

.modern-select-label {
  position: absolute;
  left: 1rem;
  top: 0.75rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-family: 'Lexend', sans-serif;
  transition: all 0.3s ease-in-out;
  pointer-events: none;
  transform-origin: left top;
}

.modern-select:focus ~ .modern-select-label,
.modern-select:not([value='']) ~ .modern-select-label {
  color: #2563eb;
  font-size: 0.75rem;
  transform: translateY(-1.75rem) scale(0.9);
}

/* Button Styles */
.modern-btn-primary {
  background: linear-gradient(to right, #2563eb, #1d4ed8);
  color: white;
  font-weight: 600;
  padding: 0.2rem 1.5rem;
  border-radius: 0.2rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  font-family: 'Lexend', sans-serif;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 10pt;
  font-weight: 400;
}

.modern-btn-primary:hover {
  background: linear-gradient(to right, #1a1a1a, #252628);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.modern-btn-secondary {
  background: linear-gradient(to right, #7c3aed, #6d28d9);
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  font-family: 'Lexend', sans-serif;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.modern-btn-secondary:hover {
  background: linear-gradient(to right, #6d28d9, #5b21b6);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.modern-btn-success {
  background: linear-gradient(to right, #059669, #047857);
  color: white;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  font-family: 'Lexend', sans-serif;
  font-size: 1.125rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.modern-btn-success:hover {
  background: linear-gradient(to right, #047857, #065f46);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.modern-btn-info {
  background: linear-gradient(to right, #0891b2, #0e7490);
  color: white;
  font-weight: 300;
  padding: 0.5rem 0.5rem;
  border-radius: 0.2rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  font-family: 'Lexend', sans-serif;
  font-size: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.modern-btn-info:hover {
  background: linear-gradient(to right, #0e7490, #155e75);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.modern-btn-payment {
  background: linear-gradient(to right, #059669, #047857);
  color: white;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  font-family: 'Lexend', sans-serif;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.modern-btn-payment:hover:not(:disabled) {
  background: linear-gradient(to right, #047857, #065f46);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.modern-btn-payment:disabled {
  background: linear-gradient(to right, #9ca3af, #6b7280);
  cursor: not-allowed;
}

.modern-btn-activity {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-family: 'Lexend', sans-serif;
  font-size: 0.875rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.modern-btn-activity:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.modern-btn-cancel {
  background: #f3f4f6;
  color: #374151;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-family: 'Lexend', sans-serif;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.modern-btn-cancel:hover {
  background: #e5e7eb;
}

.delete-btn {
  color: #ef4444;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-family: 'Lexend', sans-serif;
  font-size: 0.875rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.delete-btn:hover {
  color: #dc2626;
  background-color: #fef2f2;
  transform: scale(1.05);
}

/* Info Cards */
.info-card {
  background: linear-gradient(to right, #f8fafc, #f1f5f9);
  border: 1px solid #e2e8f0;
  border-radius: 0.3rem;
  padding: 0.1rem;
  transition: all 0.3s ease-in-out;
}

.info-card:hover {
  border-color: #cbd5e1;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.info-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 0.05rem;
  font-family: 'Lexend', sans-serif;
}

.info-value {
  font-size: 0.775rem;
  font-weight: 500;
  color: #1e293b;
  font-family: 'Lexend', sans-serif;
}

/* Card Styles */
.product-item-card {
  background: linear-gradient(to right, #f7f7f7, #eae7e7);
  border: 1px solid #141414;
  border-radius: 0.2rem;
  padding: 0.1rem;
  transition: all 0.3s ease-in-out;
  animation: fadeInUp 0.5s ease-out;
}

.product-item-card:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: #86efac;
}

.service-item-card {
  background: linear-gradient(to right, #faf5ff, #f3e8ff);
  border: 1px solid #d8b4fe;
  border-radius: 0.2rem;
  padding: 0.1rem;
  transition: all 0.3s ease-in-out;
  animation: fadeInUp 0.5s ease-out;
}

.service-item-card:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: #c084fc;
}

/* Subtotal Display */
.subtotal-display {
  background: linear-gradient(to right, #f1f1f2, #e6e6e6);
  border: 0.2px solid #93c5fd;
  border-radius: 0.1rem;
  padding: 0.21rem 0.21rem;
  color: #080808;
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
  font-family: 'Lexend', sans-serif;
}

.subtotal-label {
  position: absolute;
  left: 1rem;
  top: 0.75rem;
  color: #2563eb;
  font-size: 0.75rem;
  font-family: 'Lexend', sans-serif;
  pointer-events: none;
  transform: translateY(-1.75rem) scale(0.9);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .modern-input,
  .modern-select {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
  }

  .modern-label,
  .modern-select-label {
    font-size: 0.75rem;
  }

  .modern-btn-primary,
  .modern-btn-secondary {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }

  .modern-btn-success {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  .subtotal-display {
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
  }

  .info-card {
    padding: 0.75rem;
  }

  .product-item-card,
  .service-item-card {
    padding: 1rem;
  }
}

/* Typography */
h2,
h3 {
  font-family: 'Lexend', sans-serif;
}

/* Enhanced Shadow Effects */
.product-item-card:hover,
.service-item-card:hover {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Bikin input GǣtelanjangGǥ */
.naked-input {
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  margin: 0;

  /* Warisan tipografi dari parent supaya benar-benar terlihat seperti teks biasa */
  font: inherit;
  color: inherit;
  line-height: inherit;

  /* Lebar mengikuti panjang teks */
  width: auto;
  min-width: 1ch;
  caret-color: currentColor;

  /* Hilangkan styling default browser tertentu */
  -webkit-appearance: none;
  appearance: none;
}

/* Opsional: placeholder lebih samar */
.naked-input::placeholder {
  opacity: 0.4;
}

/* Opsional: garis tipis saat fokus biar aksesibel tapi tetap minimalis */
.naked-input:focus {
  box-shadow: inset 0 -1px 0 currentColor;
}

/* Util kelas untuk aksesibilitas label tersembunyi */
.sr-only {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
  border: 0;
  padding: 0;
  margin: -1px;
}
</style>
