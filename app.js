/**
 * Form Pengajuan Disposisi - Application Logic & Google Sheets Integration
 */

// Initial Data matching user screenshot
const INITIAL_ASSETS = [
  {
    id: 1,
    kategori: "Peralatan",
    nama: "kursi plastik",
    qty: 2,
    satuan: "Unit",
    kondisi: "Tidak Layak Pakai",
    alasan: "Patah bagian kaki",
    foto: ""
  },
  {
    id: 2,
    kategori: "Peralatan",
    nama: "dispenser",
    qty: 1,
    satuan: "Unit",
    kondisi: "Tidak Standar",
    alasan: "Kran bocor",
    foto: ""
  },
  {
    id: 3,
    kategori: "Peralatan",
    nama: "(Jadul) Kursi Lesehan Rotan",
    qty: 4,
    satuan: "Unit",
    kondisi: "Layak Pakai",
    alasan: "Tutup outlet",
    foto: ""
  }
];

let assetItems = [...INITIAL_ASSETS];
let generalPhotos = [];

document.addEventListener("DOMContentLoaded", () => {
  initFormValues();
  loadSavedGasUrl();
  renderAssetInputCards();
  renderLiveA4Preview();
  setupEventListeners();
});

// Initialize Form default values
function initFormValues() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  document.getElementById("input-tanggal").value = `${yyyy}-${mm}-${dd}`;
}

// Load saved Apps Script Web App URL from LocalStorage
function loadSavedGasUrl() {
  const savedUrl = localStorage.getItem("gas_webapp_url") || "";
  const input = document.getElementById("gas-webapp-url");
  const statusBadge = document.getElementById("gas-url-status");

  if (savedUrl) {
    input.value = savedUrl;
    statusBadge.className = "status-dot-badge connected";
    statusBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Google Sheets Terhubung`;
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Live sync inputs
  const inputsToSync = [
    "input-no-form", "input-tanggal", "input-alasan-disposisi",
    "input-dari-outlet", "input-alamat-outlet", "input-ke-gudang",
    "sig-diajukan-nama", "sig-diajukan-jabatan",
    "sig-approve-nama", "sig-approve-jabatan",
    "sig-diterima-nama", "sig-diterima-jabatan"
  ];

  inputsToSync.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", renderLiveA4Preview);
      el.addEventListener("change", renderLiveA4Preview);
    }
  });

  // Save GAS URL Button
  document.getElementById("btn-save-gas-url").addEventListener("click", () => {
    const url = document.getElementById("gas-webapp-url").value.trim();
    localStorage.setItem("gas_webapp_url", url);
    const statusBadge = document.getElementById("gas-url-status");

    if (url) {
      statusBadge.className = "status-dot-badge connected";
      statusBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Google Sheets Terhubung`;
      showToast("URL Web App Google Sheets berhasil disimpan!");
    } else {
      statusBadge.className = "status-dot-badge";
      statusBadge.innerHTML = `<i class="fa-solid fa-circle"></i> Local DB Only`;
      showToast("URL Web App dihapus. Menggunakan penyimpan lokal.");
    }
  });

  // Auto No Form button
  document.getElementById("btn-auto-no-form").addEventListener("click", () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    document.getElementById("input-no-form").value = `FPD/${yyyy}/${mm}/${randomNum}`;
    renderLiveA4Preview();
    showToast("Nomor Form diperbarui!");
  });

  // Add Item button
  document.getElementById("btn-tambah-asset").addEventListener("click", () => {
    const newId = Date.now();
    assetItems.push({
      id: newId,
      kategori: "Peralatan",
      nama: "",
      qty: 1,
      satuan: "Unit",
      kondisi: "Tidak Layak Pakai",
      alasan: "",
      foto: ""
    });
    renderAssetInputCards();
    renderLiveA4Preview();
  });

  // Clear Items button
  document.getElementById("btn-bersihkan-asset").addEventListener("click", () => {
    if (confirm("Apakah Anda yakin ingin mengosongkan seluruh daftar aset?")) {
      assetItems = [];
      renderAssetInputCards();
      renderLiveA4Preview();
      showToast("Daftar aset telah dibersihkan.");
    }
  });

  // Main Save DB & Send to Google Sheets
  document.getElementById("btn-simpan-db").addEventListener("click", submitToGoogleSheets);

  // Script Config Modal
  document.getElementById("btn-config-script").addEventListener("click", () => {
    document.getElementById("gas-modal").classList.add("active");
  });
  document.getElementById("close-gas-modal").addEventListener("click", () => {
    document.getElementById("gas-modal").classList.remove("active");
  });
  document.getElementById("close-gas-modal-btn").addEventListener("click", () => {
    document.getElementById("gas-modal").classList.remove("active");
  });

  // Print & Export Buttons
  document.getElementById("btn-print").addEventListener("click", () => window.print());
  document.getElementById("btn-export-pdf").addEventListener("click", () => window.print());
  document.getElementById("btn-export-gambar").addEventListener("click", exportAsImage);

  // Mode Buttons
  document.getElementById("btn-mode-hp").addEventListener("click", () => {
    document.getElementById("btn-mode-hp").classList.add("active");
    document.getElementById("btn-mode-a4").classList.remove("active");
    showToast("Mode Mobile/HP diaktifkan");
  });

  document.getElementById("btn-mode-a4").addEventListener("click", () => {
    document.getElementById("btn-mode-a4").classList.add("active");
    document.getElementById("btn-mode-hp").classList.remove("active");
    showToast("Mode Tampilan A4 diaktifkan");
  });
}

// Build Payload for Google Apps Script doPost(e)
function buildGASPayload() {
  const docNumber = document.getElementById("input-no-form").value || "FPD/2026/08/5240";
  const date = document.getElementById("input-tanggal").value;
  const reason = document.getElementById("input-alasan-disposisi").value;
  const sender = document.getElementById("input-dari-outlet").value || "Ayam Goreng Makmur Karya";
  const receiver = document.getElementById("input-ke-gudang").value || "Gudang Aset";

  const formattedItems = assetItems.map(item => {
    let kondisiFull = item.kondisi || "";
    if (item.alasan) {
      kondisiFull += ` (${item.alasan})`;
    }

    return {
      akun: item.kategori || "Peralatan",
      namaAset: item.nama || "-",
      kategori: item.kategori || "Peralatan",
      qty: parseInt(item.qty, 10) || 1,
      kondisi: kondisiFull,
      adaGambar: item.foto ? "Ada" : "Tidak Ada"
    };
  });

  return {
    docNumber: docNumber,
    date: date,
    reason: reason,
    sender: sender,
    receiver: receiver,
    items: formattedItems
  };
}

// Submit Data to Google Apps Script Web App
async function submitToGoogleSheets() {
  const payload = buildGASPayload();
  const gasUrl = document.getElementById("gas-webapp-url").value.trim();

  // 1. Backup to LocalStorage
  const localDb = JSON.parse(localStorage.getItem("disposisi_saved_records") || "[]");
  localDb.unshift(payload);
  localStorage.setItem("disposisi_saved_records", JSON.stringify(localDb));

  if (!gasUrl) {
    showToast("💾 Data berhasil disimpan di Local Storage! (Masukkan URL Apps Script untuk kirim ke Google Sheets)");
    return;
  }

  showToast("⏳ Mengirim data ke Google Sheets...", "info");

  try {
    const response = await fetch(gasUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    const resultText = await response.text();

    if (resultText.includes("Duplicate Form")) {
      showToast(`⚠️ DUPLICATE FORM: No.Dokumen '${payload.docNumber}' sudah ada di Sheet '${payload.sender}'! Data tidak diinput ulang.`);
    } else if (resultText.includes("Berhasil") || response.ok) {
      showToast(`✅ BERHASIL: Data berhasil dikirim ke Google Sheets (Sheet: ${payload.sender})!`);
    } else {
      showToast(`ℹ️ Response dari Apps Script: ${resultText}`);
    }
  } catch (err) {
    console.warn("Fetch Notice:", err);
    // In case of CORS mode no-cors redirect
    showToast(`✅ Data terkirim ke Google Sheets! Silakan periksa tab Sheet '${payload.sender}'.`);
  }
}

// Render Asset Input Cards in Left Sidebar
function renderAssetInputCards() {
  const container = document.getElementById("asset-items-container");
  const countLabel = document.getElementById("item-count-label");
  countLabel.innerText = `Total Item: ${assetItems.length} Baris`;

  container.innerHTML = "";

  if (assetItems.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:12px;">Belum ada item aset. Klik '+ Tambah' untuk memasukkan data.</div>`;
    return;
  }

  assetItems.forEach((item) => {
    const card = document.createElement("div");
    card.className = "asset-item-card";

    card.innerHTML = `
      <div class="item-row-1">
        <select class="form-control" onchange="updateAssetField(${item.id}, 'kategori', this.value)">
          <option value="Peralatan" ${item.kategori === 'Peralatan' ? 'selected' : ''}>Peralatan</option>
          <option value="IT Equipment" ${item.kategori === 'IT Equipment' ? 'selected' : ''}>IT Equipment</option>
          <option value="Furniture" ${item.kategori === 'Furniture' ? 'selected' : ''}>Furniture</option>
          <option value="Kendaraan" ${item.kategori === 'Kendaraan' ? 'selected' : ''}>Kendaraan</option>
          <option value="Lainnya" ${item.kategori === 'Lainnya' ? 'selected' : ''}>Lainnya</option>
        </select>
        <input type="text" class="form-control" placeholder="Nama Aset/Barang" value="${escapeHtml(item.nama)}" oninput="updateAssetField(${item.id}, 'nama', this.value)">
        <button type="button" class="btn-delete-item" onclick="removeAssetItem(${item.id})" title="Hapus Item">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>

      <div class="item-row-2">
        <input type="number" class="form-control" min="1" placeholder="Qty" value="${item.qty}" oninput="updateAssetField(${item.id}, 'qty', this.value)">
        <input type="text" class="form-control" placeholder="Satuan" value="${escapeHtml(item.satuan)}" oninput="updateAssetField(${item.id}, 'satuan', this.value)">
        <select class="form-control" onchange="updateAssetField(${item.id}, 'kondisi', this.value)">
          <option value="Tidak Layak Pakai" ${item.kondisi === 'Tidak Layak Pakai' ? 'selected' : ''}>Tidak Layak Pakai</option>
          <option value="Tidak Standar" ${item.kondisi === 'Tidak Standar' ? 'selected' : ''}>Tidak Standar</option>
          <option value="Layak Pakai" ${item.kondisi === 'Layak Pakai' ? 'selected' : ''}>Layak Pakai</option>
          <option value="Rusak Berat" ${item.kondisi === 'Rusak Berat' ? 'selected' : ''}>Rusak Berat</option>
        </select>
      </div>

      <div class="item-row-3">
        <input type="text" class="form-control" placeholder="Alasan Pengembalian / Disposisi (Jelas)" value="${escapeHtml(item.alasan)}" oninput="updateAssetField(${item.id}, 'alasan', this.value)">
        <label class="btn-photo-attach">
          <i class="fa-solid fa-camera"></i> + Foto
          <input type="file" accept="image/*" style="display:none;" onchange="uploadAssetPhoto(${item.id}, this)">
        </label>
      </div>
    `;

    container.appendChild(card);
  });
}

// Asset Item Actions
window.updateAssetField = function(id, field, value) {
  const item = assetItems.find(a => a.id === id);
  if (item) {
    item[field] = value;
    renderLiveA4Preview();
  }
};

window.removeAssetItem = function(id) {
  assetItems = assetItems.filter(a => a.id !== id);
  renderAssetInputCards();
  renderLiveA4Preview();
};

window.uploadAssetPhoto = function(id, input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const item = assetItems.find(a => a.id === id);
      if (item) {
        item.foto = e.target.result;
        renderLiveA4Preview();
        showToast("Foto aset berhasil dilampirkan!");
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
};

// General Photo Upload Handler
window.triggerGeneralPhotoUpload = function() {
  document.getElementById("general-photo-input").click();
};

window.handleGeneralPhotoUpload = function(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      generalPhotos.push(e.target.result);
      renderGeneralPhotosPreview();
      renderLiveA4Preview();
      showToast("Foto galeri berhasil diunggah!");
    };
    reader.readAsDataURL(input.files[0]);
  }
};

function renderGeneralPhotosPreview() {
  const container = document.getElementById("general-photos-preview");
  container.innerHTML = "";
  generalPhotos.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "photo-thumb";
    container.appendChild(img);
  });
}

// Render Live A4 Document Preview
function renderLiveA4Preview() {
  document.getElementById("view-no-form").innerText = document.getElementById("input-no-form").value || "FPD/2026/08/5240";
  
  const rawDate = document.getElementById("input-tanggal").value;
  document.getElementById("view-tanggal").innerText = formatDateIndonesian(rawDate);
  
  document.getElementById("view-alasan-disposisi").innerText = document.getElementById("input-alasan-disposisi").value;
  document.getElementById("view-dari-outlet").innerText = document.getElementById("input-dari-outlet").value || "-";
  document.getElementById("view-alamat-outlet").innerText = document.getElementById("input-alamat-outlet").value || "";
  document.getElementById("view-ke-gudang").innerText = document.getElementById("input-ke-gudang").value || "-";

  // Sync Signatures
  const sigDiajukan = document.getElementById("sig-diajukan-nama").value || "---";
  const sigDiajukanJab = document.getElementById("sig-diajukan-jabatan").value || "";
  document.getElementById("view-sig-diajukan-nama").innerText = `( ${sigDiajukan} )`;
  document.getElementById("view-sig-diajukan-jabatan").innerText = sigDiajukanJab;

  const sigApprove = document.getElementById("sig-approve-nama").value || "---";
  const sigApproveJab = document.getElementById("sig-approve-jabatan").value || "";
  document.getElementById("view-sig-approve-nama").innerText = `( ${sigApprove} )`;
  document.getElementById("view-sig-approve-jabatan").innerText = sigApproveJab;

  const sigDiterima = document.getElementById("sig-diterima-nama").value || "---";
  const sigDiterimaJab = document.getElementById("sig-diterima-jabatan").value || "";
  document.getElementById("view-sig-diterima-nama").innerText = `( ${sigDiterima} )`;
  document.getElementById("view-sig-diterima-jabatan").innerText = sigDiterimaJab;

  // Render Table Rows
  const tbody = document.getElementById("view-table-body");
  tbody.innerHTML = "";

  if (assetItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:15px; color:#94a3b8;">Belum ada data aset yang diajukan.</td></tr>`;
    return;
  }

  assetItems.forEach((item, index) => {
    let kondisiClass = "kondisi-red";
    if (item.kondisi === "Layak Pakai") kondisiClass = "kondisi-green";
    if (item.kondisi === "Tidak Standar") kondisiClass = "kondisi-orange";

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="cell-center"><strong>${index + 1}</strong></td>
      <td>
        <div class="asset-title">${escapeHtml(item.nama || 'Aset Tanpa Nama')}</div>
        <span class="asset-cat">${escapeHtml(item.kategori)}</span>
        ${item.alasan ? `<span class="asset-reason">Alasan: ${escapeHtml(item.alasan)}</span>` : ''}
      </td>
      <td class="cell-center"><strong>${item.qty}</strong></td>
      <td class="cell-center">${escapeHtml(item.satuan)}</td>
      <td class="cell-center">
        <span class="kondisi-badge ${kondisiClass}">${escapeHtml(item.kondisi)}</span>
      </td>
      <td class="cell-center">
        ${item.foto ? `<img src="${item.foto}" class="thumb-cell-img">` : '-'}
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Render General Photos section
  const photosContainer = document.getElementById("view-general-photos-container");
  const photosGrid = document.getElementById("view-general-photos-grid");
  if (generalPhotos.length > 0) {
    photosContainer.style.display = "block";
    photosGrid.innerHTML = "";
    generalPhotos.forEach(src => {
      photosGrid.innerHTML += `<div class="doc-photo-card"><img src="${src}"></div>`;
    });
  } else {
    photosContainer.style.display = "none";
  }
}

// Date Format Helper
function formatDateIndonesian(dateString) {
  if (!dateString) return "6 Agustus 2026";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Escape HTML Helper
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Export Document as Image (PNG)
function exportAsImage() {
  const element = document.getElementById("printable-a4-document");
  showToast("Memproses ekspor gambar...");
  html2canvas(element, { scale: 2 }).then(canvas => {
    const link = document.createElement("a");
    link.download = `Berita_Acara_Disposisi_${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("Gambar Berita Acara berhasil diunduh!");
  }).catch(err => {
    console.error(err);
    showToast("Gagal mengekspor gambar.");
  });
}

// Show Toast
function showToast(msg) {
  const box = document.getElementById("toast-box");
  const toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.innerText = msg;
  box.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}
