// composables/useSalesOrderPdf.js

export function useSalesOrderPdf() {
  /**
   * Generate PDF HTML for Sales Order
   */
  function generateSalesOrderPdfHtml({
    orderNumber,
    orderDate,
    status,
    customer,
    keterangan,
    productLines,
    serviceLines,
    totals,
    companyLogo,
    formatCurrency,
  }) {
    const now = new Date().toLocaleString('id-ID')

    // Filter only product lines that have description or qty > 0
    const filteredProducts = productLines.filter((line) => line.description || line.qty > 0)

    const productRows = filteredProducts
      .map(
        (line, idx) => `
        <tr>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;">${idx + 1}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${line.description || '-'}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${line.qty || 0}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${formatCurrency(line.unit_price)}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${formatCurrency(line.discount)}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${formatCurrency(line.line_total)}</td>
        </tr>`,
      )
      .join('')

    // Filter only service lines that have description or qty > 0
    const filteredServices = serviceLines.filter((line) => line.description || line.qty > 0)

    const serviceRows = filteredServices
      .map(
        (line, idx) => `
        <tr>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;">${idx + 1}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${line.description || '-'}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${line.qty || 0}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${formatCurrency(line.unit_price)}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${formatCurrency(line.discount)}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${formatCurrency(line.line_total)}</td>
        </tr>`,
      )
      .join('')

    const html = `
      <html>
      <head>
        <title>Invoice ${orderNumber}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f8fafc; color: #0f172a; padding: 24px; }
          .card { max-width: 900px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08); overflow: hidden; }
          .header { padding: 24px; background: linear-gradient(135deg, #0f172a, #1e293b); color: #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
          .badge { display: inline-block; padding: 6px 12px; border-radius: 9999px; background: #22c55e; color: #0f172a; font-weight: 700; font-size: 12px; letter-spacing: 0.5px; text-transform: uppercase; }
          .section { padding: 20px 24px; }
          .section h3 { margin: 0 0 8px 0; font-size: 16px; color: #0f172a; }
          .muted { color: #475569; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th { padding: 10px 8px; text-align: left; border: 1px solid #e5e7eb; background: #f8fafc; font-size: 13px; color: #0f172a; }
          td { font-size: 13px; }
          .totals { width: 320px; margin-left: auto; }
          .totals td { padding: 8px 6px; }
          .totals .label { color: #475569; }
          .totals .value { text-align: right; font-weight: 600; color: #0f172a; }
          .totals .grand { font-size: 16px; color: #0f172a; }
          .footer { padding: 12px 24px 20px; color: #475569; font-size: 12px; text-align: right; }
          @media print { body { padding: 0; background: #fff; } .card { box-shadow: none; border: none; } }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div style="display:flex;align-items:center;gap:12px;">
              <img src="${companyLogo}" alt="Logo" style="height:44px;object-fit:contain;" />
              <div>
                <div style="font-size:22px;font-weight:700;">Invoice</div>
                <div style="margin-top:4px;color:#cbd5e1;">${orderNumber || '-'}</div>
              </div>
            </div>
            <div style="text-align:right;">
              <div class="badge">${status || 'draft'}</div>
              <div style="margin-top:8px;font-size:12px;color:#cbd5e1;">Dicetak: ${now}</div>
            </div>
          </div>

          <div class="section" style="display:flex;gap:32px;flex-wrap:wrap;">
            <div style="flex:1; min-width:240px;">
              <h3>Ditagihkan Kepada</h3>
              <div class="muted">${customer.nama || '-'}</div>
              <div class="muted">${customer.alamat || '-'}</div>
              <div class="muted">HP: ${customer.no_hp || '-'}</div>
            </div>
            <div style="width:260px;">
              <h3>Detail</h3>
              <div class="muted">Tanggal: ${orderDate || '-'}</div>
              <div class="muted">Status: ${status || '-'}</div>
              <div class="muted">Keterangan: ${keterangan || '-'}</div>
            </div>
          </div>

          ${
            filteredProducts.length > 0
              ? `
          <div class="section">
            <h3>Produk</h3>
            <table>
              <thead>
                <tr>
                  <th style="width:40px;">No</th>
                  <th>Deskripsi</th>
                  <th style="width:80px;text-align:right;">Qty</th>
                  <th style="width:100px;text-align:right;">Harga</th>
                  <th style="width:100px;text-align:right;">Diskon</th>
                  <th style="width:120px;text-align:right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${productRows}
              </tbody>
            </table>
          </div>
          `
              : ''
          }

          ${
            filteredServices.length > 0
              ? `
          <div class="section">
            <h3>Jasa</h3>
            <table>
              <thead>
                <tr>
                  <th style="width:40px;">No</th>
                  <th>Deskripsi</th>
                  <th style="width:80px;text-align:right;">Qty</th>
                  <th style="width:100px;text-align:right;">Harga</th>
                  <th style="width:100px;text-align:right;">Diskon</th>
                  <th style="width:120px;text-align:right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${serviceRows}
              </tbody>
            </table>
          </div>
          `
              : ''
          }

          <div class="section" style="display:flex; justify-content:flex-end;">
            <table class="totals">
              <tr>
                <td class="label">Subtotal</td>
                <td class="value">${formatCurrency(totals.subtotal)}</td>
              </tr>
              <tr>
                <td class="label">Pajak (11%)</td>
                <td class="value">${formatCurrency(totals.tax)}</td>
              </tr>
              <tr>
                <td class="label grand" style="font-weight:700;">Total</td>
                <td class="value grand" style="color:#0ea5e9;">${formatCurrency(totals.total)}</td>
              </tr>
            </table>
          </div>

          <div class="footer">Terima kasih atas kepercayaan Anda.</div>
        </div>
      </body>
      </html>
    `

    return html
  }

  /**
   * Generate PDF filename with customer name
   */
  function generatePdfFilename(orderNumber, customerName) {
    const sanitizedName = (customerName || 'customer')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '_')

      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 30)
    return `Invoice_${orderNumber}_${sanitizedName}.pdf`
  }

  return {
    generateSalesOrderPdfHtml,
    generatePdfFilename,
  }
}
