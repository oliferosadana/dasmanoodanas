document.addEventListener('DOMContentLoaded', function() {
  const packageContainer = document.getElementById('packageContainer');
  const loadingIndicator = document.getElementById('loadingIndicator');

  async function loadPaketData() {
    try {
      loadingIndicator.classList.remove('d-none');
      const response = await fetch('/api/paket');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      loadingIndicator.classList.add('d-none');
      renderTable(data);
    } catch (error) {
      console.error('Error loading data:', error);
      loadingIndicator.classList.add('d-none');
      packageContainer.innerHTML = `
        <div class="alert alert-danger">
          Gagal memuat data: ${error.message}
        </div>
      `;
    }
  }

  function renderTable(data) {
    packageContainer.innerHTML = '';
    if (data.length === 0) {
      packageContainer.innerHTML = `
        <div class="alert alert-secondary">
          Tidak ada data paket kuota ditemukan
        </div>
      `;
      return;
    }
    const tableHtml = `
      <div class="table-responsive">
        <table class="table table-bordered table-striped align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Paket</th>
              <th>Area</th>
              <th class="text-end">Stok</th>
              <th class="text-end">Harga</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(paket => `
              <tr>
                <td>${escapeHtml(paket.provider)} - ${escapeHtml(paket.nama_paket)}</td>
                <td class="area-cell">${escapeHtml(paket.area || '-')}</td>
                <td class="text-end">${paket.stok}</td>
                <td class="text-end">${formatRupiah(paket.harga)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    packageContainer.innerHTML = tableHtml;
  }

  function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatRupiah(angka) {
    if (angka == null) return '-';
    return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  loadPaketData();
});