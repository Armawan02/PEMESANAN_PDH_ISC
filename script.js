// PENTING: Ganti string ini dengan URL Web App (Deployment) dari Google Apps Script Anda!
const GAS_API_URL = 'GANTI_DENGAN_URL_WEB_APP_APPS_SCRIPT_ANDA';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

document.getElementById('form-pesanan').addEventListener('submit', async function(event) {
  event.preventDefault();
  
  const btnSubmit = document.getElementById('btn-submit');
  const messageDiv = document.getElementById('message');
  
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<svg class="spinner" viewBox="0 0 50 50" style="width:20px;height:20px;animation:spin 1s linear infinite;margin-right:8px"><circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="80" stroke-dashoffset="60" stroke-linecap="round"></circle></svg> MEMPROSES...';
  messageDiv.style.display = 'none';
  messageDiv.className = 'message';
  
  try {
    if (GAS_API_URL === 'GANTI_DENGAN_URL_WEB_APP_APPS_SCRIPT_ANDA' || !GAS_API_URL.startsWith('http')) {
        throw new Error("PENTING: Konfigurasi sistem belum selesai! Anda harus mengganti variabel GAS_API_URL di script.js dengan URL hasil deploy backend Google Apps Script.");
    }

    const fileInput = document.getElementById('buktiTrans');
    const file = fileInput.files[0];
    
    if (!file) throw new Error("File Bukti Transfer wajib diunggah.");
    if(file.size > 5 * 1024 * 1024) throw new Error("Ukuran file terlalu besar. Maksimal 5MB.");

    const base64File = await getBase64(file);
    
    const formData = {
      nama: document.getElementById('nama').value,
      noWa: document.getElementById('noWa').value,
      divisi: document.getElementById('divisi').value,
      jenisPdh: document.getElementById('jenisPdh').value,
      ukuran: document.getElementById('ukuran').value,
      volume: document.getElementById('volume').value,
      base64File: base64File,
      fileName: file.name,
      mimeType: file.type
    };
    
    // Kirim menggunakan fetch API (text/plain untuk menghindari preflight CORS)
    const response = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(formData)
    });

    const result = await response.json();
    
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> KIRIM PESANAN';
    
    messageDiv.style.display = 'block';
    if (result.success) {
      messageDiv.classList.add('success');
      messageDiv.textContent = result.message;
      document.getElementById('form-pesanan').reset();
      loadDataPesanan();
    } else {
      messageDiv.classList.add('error');
      messageDiv.textContent = result.message;
    }
  } catch (err) {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> KIRIM PESANAN';
    messageDiv.style.display = 'block';
    messageDiv.classList.add('error');
    messageDiv.textContent = err.message;
  }
});

async function loadDataPesanan() {
  const tbody = document.getElementById('table-body');
  const badge = document.getElementById('total-order-badge');
  
  if (GAS_API_URL === 'GANTI_DENGAN_URL_WEB_APP_APPS_SCRIPT_ANDA' || !GAS_API_URL.startsWith('http')) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center" style="color: var(--warning);">Sistem menunggu konfigurasi URL Backend...</td></tr>';
      return;
  }

  try {
    const response = await fetch(GAS_API_URL);
    const data = await response.json();
    
    tbody.innerHTML = ''; 
    
    if (data.error) throw new Error(data.error);

    badge.textContent = `Total Order: ${data.length}`;
    
    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center" style="padding: 20px; color: var(--text-muted);">Belum ada data pesanan.</td></tr>';
      return;
    }
    
    data.forEach(item => {
      const tr = document.createElement('tr');
      let badgeBayar = item.statusBayar.toLowerCase().includes('lunas') ? 'success' : 'warning';
      let badgeProses = item.statusProses.toLowerCase().includes('selesai') ? 'success' : 
                        (item.statusProses.toLowerCase().includes('proses') ? 'primary' : 'warning');
      
      let dateStr = item.waktu;
      if(dateStr.length > 15) {
         const d = new Date(dateStr);
         if(!isNaN(d)) {
             dateStr = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
         }
      }

      tr.innerHTML = `
        <td>${item.no}</td>
        <td style="font-weight: 600;">${item.nama}</td>
        <td style="color: var(--primary); font-weight: bold;">${item.ukuran}</td>
        <td>${item.jenisPdh}</td>
        <td>${item.volume} Pcs</td>
        <td><span class="badge ${badgeBayar}">${item.statusBayar.toUpperCase()}</span></td>
        <td><span class="badge ${badgeProses}">${item.statusProses.toUpperCase()}</span></td>
        <td style="color: var(--text-muted); font-size: 12px;">${dateStr}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    document.getElementById('table-body').innerHTML = '<tr><td colspan="8" class="text-center" style="color: var(--danger);">Gagal memuat data dari server.</td></tr>';
    console.error(err);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadDataPesanan();
});
