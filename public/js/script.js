document.addEventListener('DOMContentLoaded', async function() {
  // Check authentication first
  const isAuthenticated = await checkAuthOrRedirect();
  if (!isAuthenticated) return;
  
  // DOM elements
  const paketTableBody = document.getElementById('paketTableBody');
  const btnTambah = document.getElementById('btnTambah');
  const paketForm = document.getElementById('paketForm');
  const paketId = document.getElementById('paketId');
  const provider = document.getElementById('provider');
  const namaPaket = document.getElementById('namaPaket');
  const stok = document.getElementById('stok');
  const harga = document.getElementById('harga');
  const btnSimpan = document.getElementById('btnSimpan');
  const btnDelete = document.getElementById('btnDelete');
  const btnLogout = document.getElementById('btnLogout');
  const deleteItemName = document.getElementById('deleteItemName');
  const alertContainer = document.getElementById('alertContainer');
  const area = document.getElementById('area');
  const btnBroadcast = document.getElementById('btnBroadcast');
  const webhookUrlInput = document.getElementById('webhookUrl');
  const btnBroadcastStok = document.getElementById('btnBroadcastStok');
  const webhookUrlStokInput = document.getElementById('webhookUrlStok');
  const btnSaveWebhook = document.getElementById('btnSaveWebhook');

  // Persist webhook URLs in localStorage
  const WEBHOOK_URL_KEY = 'management_webhook_url';
  const WEBHOOK_URL_STOK_KEY = 'management_webhook_url_stok';
  try {
    if (webhookUrlInput) {
      webhookUrlInput.value = localStorage.getItem(WEBHOOK_URL_KEY) || '';
      webhookUrlInput.addEventListener('input', function() {
        localStorage.setItem(WEBHOOK_URL_KEY, (webhookUrlInput.value || '').trim());
      });
    }
    if (webhookUrlStokInput) {
      webhookUrlStokInput.value = localStorage.getItem(WEBHOOK_URL_STOK_KEY) || '';
      webhookUrlStokInput.addEventListener('input', function() {
        localStorage.setItem(WEBHOOK_URL_STOK_KEY, (webhookUrlStokInput.value || '').trim());
      });
    }
  } catch (_) {}
  
  // Bootstrap Modals
  const paketModal = new bootstrap.Modal(document.getElementById('paketModal'));
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  
  // API Base URL
  const API_URL = '/api/paket';
  
  // Load all paket data
  function loadData() {
    fetch(API_URL, {
      headers: getAuthHeaders()
    })
      .then(response => {
        if (response.status === 401 || response.status === 403) {
          // Unauthorized, redirect to login
          logout();
          throw new Error('Authentication required');
        }
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        renderTable(data);
      })
      .catch(error => {
        showAlert('Gagal memuat data: ' + error.message, 'danger');
        paketTableBody.innerHTML = `<tr><td colspan="6" class="text-center">Error loading data</td></tr>`;
      });
  }
  
  // Render table with data
  function renderTable(data) {
    if (data.length === 0) {
      paketTableBody.innerHTML = `<tr><td colspan="8" class="text-center">Tidak ada data</td></tr>`;
      return;
    }
    
    paketTableBody.innerHTML = '';
    
    data.forEach((item, index) => {
      // Determine status class and text
      let statusClass, statusText;
      if (item.stok === 0) {
        statusClass = 'stock-out';
        statusText = 'Habis';
      } else if (item.stok < 5) {
        statusClass = 'stock-low';
        statusText = 'Rendah';
      } else {
        statusClass = 'stock-available';
        statusText = 'Tersedia';
      }
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${escapeHtml(item.provider)}</td>
        <td>${escapeHtml(item.nama_paket)}</td>
        <td>${escapeHtml(item.area || '-')}</td>
        <td>
          <input type="number" class="form-control form-control-sm stock-input" data-id="${item.id}" data-provider="${escapeHtml(item.provider)}" data-nama="${escapeHtml(item.nama_paket)}" data-area="${escapeHtml(item.area || '')}" data-harga="${item.harga || 0}" value="${item.stok}" min="0" style="width: 90px;">
        </td>
        <td>${formatRupiah(item.harga)}</td>
        <td class="status-cell"><span class="${statusClass}">${statusText}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-primary btn-icon edit-btn" data-id="${item.id}">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger btn-icon delete-btn" data-id="${item.id}" data-name="${escapeHtml(item.provider)} - ${escapeHtml(item.nama_paket)}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      paketTableBody.appendChild(row);
    });
    
    // Add event listeners to the newly created buttons
    addButtonEventListeners();
    addStockInputListeners();
  }
  
  // Add event listeners to edit and delete buttons
  function addButtonEventListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        fetchPaketDetails(id);
      });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');
        
        deleteItemName.textContent = name;
        btnDelete.setAttribute('data-id', id);
        
        deleteModal.show();
      });
    });
  }

  function addStockInputListeners() {
    document.querySelectorAll('.stock-input').forEach(input => {
      const handler = async () => {
        const id = input.getAttribute('data-id');
        let newStok = parseInt(input.value, 10);
        if (isNaN(newStok) || newStok < 0) newStok = 0;
        await saveStockInline({
          id,
          provider: input.getAttribute('data-provider'),
          nama_paket: input.getAttribute('data-nama'),
          area: input.getAttribute('data-area') || '',
          harga: parseInt(input.getAttribute('data-harga') || '0', 10),
          stok: newStok,
          inputEl: input
        });
      };
      input.addEventListener('blur', handler);
      input.addEventListener('change', handler);
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          input.blur();
        }
      });
    });
  }

  async function saveStockInline({ id, provider, nama_paket, area, harga, stok, inputEl }) {
    try {
      inputEl.disabled = true;
      const resp = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ provider, nama_paket, area, harga, stok })
      });
      if (!resp.ok) {
        const t = await resp.text().catch(() => '');
        throw new Error(t || `Gagal menyimpan stok (status ${resp.status})`);
      }
      // Update status cell in the same row
      const row = inputEl.closest('tr');
      const statusCell = row.querySelector('.status-cell');
      let statusClass, statusText;
      if (stok === 0) { statusClass = 'stock-out'; statusText = 'Habis'; }
      else if (stok < 5) { statusClass = 'stock-low'; statusText = 'Rendah'; }
      else { statusClass = 'stock-available'; statusText = 'Tersedia'; }
      if (statusCell) statusCell.innerHTML = `<span class="${statusClass}">${statusText}</span>`;
      showAlert('Stok berhasil diperbarui', 'success');
    } catch (err) {
      showAlert('Gagal memperbarui stok: ' + err.message, 'danger');
    } finally {
      inputEl.disabled = false;
    }
  }
  
  // Fetch details of a specific paket for editing
  function fetchPaketDetails(id) {
    fetch(`${API_URL}/${id}`, {
      headers: getAuthHeaders()
    })
      .then(response => {
        if (response.status === 401 || response.status === 403) {
          logout();
          throw new Error('Authentication required');
        }
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        paketId.value = data.id;
        provider.value = data.provider;
        namaPaket.value = data.nama_paket;
        area.value = data.area || '';
        stok.value = data.stok;
        harga.value = data.harga || 0;
        document.getElementById('paketModalLabel').textContent = 'Edit Paket';
        paketModal.show();
      })
      .catch(error => {
        showAlert('Gagal mengambil detail paket: ' + error.message, 'danger');
      });
  }
  
  // Handle form submission
  function savePaket() {
    const id = paketId.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;
    
    const data = {
      provider: provider.value,
      nama_paket: namaPaket.value,
      area: (area.value || ''),
      stok: parseInt(stok.value),
      harga: parseInt(harga.value)
    };
    
    fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error('Authentication required');
      }
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      showAlert(`Paket berhasil ${id ? 'diperbarui' : 'ditambahkan'}`, 'success');
      paketModal.hide();
      loadData();
    })
    .catch(error => {
      showAlert(`Gagal ${id ? 'memperbarui' : 'menambahkan'} paket: ${error.message}`, 'danger');
    });
  }
  
  // Handle delete confirmation
  function deletePaket(id) {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    .then(response => {
      if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error('Authentication required');
      }
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      showAlert('Paket berhasil dihapus', 'success');
      deleteModal.hide();
      loadData();
    })
    .catch(error => {
      showAlert('Gagal menghapus paket: ' + error.message, 'danger');
    });
  }
  
  // Show alert message
  function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      alert.remove();
    }, 5000);
  }
  
  // Utility function to escape HTML
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
  
  // Event Listeners
  btnTambah.addEventListener('click', function() {
    // Reset form
    paketForm.reset();
    paketId.value = '';
    document.getElementById('paketModalLabel').textContent = 'Tambah Paket Baru';
    harga.value = 0;
    area.value = '';
    paketModal.show();
  });
  
  btnSimpan.addEventListener('click', function() {
    // Simple validation
    if (!provider.value || !namaPaket.value || !area.value || stok.value === '' || harga.value === '') {
      showAlert('Semua field harus diisi', 'warning');
      return;
    }
    savePaket();
  });
  
  btnDelete.addEventListener('click', function() {
    const id = this.getAttribute('data-id');
    deletePaket(id);
  });
  
  // Logout button
  btnLogout.addEventListener('click', function() {
    logout();
  });

  // Broadcast handler
  btnBroadcast.addEventListener('click', function() {
    const url = (webhookUrlInput?.value || '').trim();
    if (!url || !/^https?:\/\//i.test(url)) {
      showAlert('URL webhook tidak valid', 'warning');
      return;
    }
    try { localStorage.setItem(WEBHOOK_URL_KEY, url); } catch (_) {}
    fetch('/api/broadcast', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ url })
    })
      .then(async (response) => {
        const bodyText = await response.text().catch(() => '');
        if (!response.ok) {
          throw new Error(`Gagal broadcast (status ${response.status}): ${bodyText?.slice(0, 200)}`);
        }
        showAlert('Broadcast berhasil dikirim', 'success');
      })
      .catch((error) => {
        showAlert('Broadcast gagal: ' + error.message, 'danger');
      });
  });

  // Broadcast Stok handler (payload sama seperti Broadcast)
  btnBroadcastStok.addEventListener('click', function() {
    const url = (webhookUrlStokInput?.value || '').trim();
    if (!url || !/^https?:\/\//i.test(url)) {
      showAlert('URL webhook stok tidak valid', 'warning');
      return;
    }
    try { localStorage.setItem(WEBHOOK_URL_STOK_KEY, url); } catch (_) {}
    fetch('/api/broadcast', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ url })
    })
      .then(async (response) => {
        const bodyText = await response.text().catch(() => '');
        if (!response.ok) {
          throw new Error(`Gagal broadcast stok (status ${response.status}): ${bodyText?.slice(0, 200)}`);
        }
        showAlert('Broadcast stok berhasil dikirim', 'success');
      })
      .catch((error) => {
        showAlert('Broadcast stok gagal: ' + error.message, 'danger');
      });
  });

  // Load saved webhook URLs from server
  (async function loadSavedWebhooks() {
    try {
      const resp = await fetch('/api/settings/webhooks', { headers: getAuthHeaders() });
      if (resp.ok) {
        const data = await resp.json();
        if (webhookUrlInput) webhookUrlInput.value = data.webhook_url || webhookUrlInput.value;
        if (webhookUrlStokInput) webhookUrlStokInput.value = data.webhook_url_stok || webhookUrlStokInput.value;
      }
    } catch (_) {}
  })();

  // Save webhook URLs to server
  btnSaveWebhook.addEventListener('click', async function() {
    const webhook_url = (webhookUrlInput?.value || '').trim();
    const webhook_url_stok = (webhookUrlStokInput?.value || '').trim();
    try {
      const resp = await fetch('/api/settings/webhooks', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ webhook_url, webhook_url_stok })
      });
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(text || 'Gagal menyimpan URL');
      }
      // Store to localStorage as well
      try { localStorage.setItem('management_webhook_url', webhook_url); } catch (_) {}
      try { localStorage.setItem('management_webhook_url_stok', webhook_url_stok); } catch (_) {}
      showAlert('URL webhook berhasil disimpan', 'success');
    } catch (err) {
      showAlert('Gagal menyimpan URL: ' + err.message, 'danger');
    }
  });
  
  // Initialize the app
  loadData();
});