// KONFIGURASI API
// Ganti URL ini dengan URL Web App Google Apps Script Anda (WAJIB DIBUAT DARI DEPLOYMENT BARU!)
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyzHqAx49RV-iKTrwZYJboSnsOynhc4t2sCngZOVst2gVtqih82qfrjQ9APjzgFSDevdw/exec';

let isAdmin = false;
let globalData = [];

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function checkPengurus() {
    const items = document.querySelectorAll('.pesanan-item');
    items.forEach(item => {
        const select = item.querySelector('.jabatan-input');
        const jabatan = select.value;
        const pengurusGroup = item.querySelector('.pengurus-group-local');
        const divisiGroup = item.querySelector('.divisi-group');
        const jenisPdhInput = item.querySelector('.jenisPdh-input');
        const karyaGroup = item.querySelector('.karya-group-local');
        
        pengurusGroup.style.display = 'none';
        divisiGroup.style.display = 'block';
        if (karyaGroup) karyaGroup.style.display = 'block';
        
        if (jabatan === 'Pengurus') {
            pengurusGroup.style.display = 'block';
            jenisPdhInput.value = '-';
            divisiGroup.style.display = 'none';
            if (karyaGroup) karyaGroup.style.display = 'none';
        } else if (jabatan === 'Pembina') {
            jenisPdhInput.value = '-';
            divisiGroup.style.display = 'none';
            if (karyaGroup) karyaGroup.style.display = 'none';
        } else if (jabatan === 'Pembimbing') {
            jenisPdhInput.value = '-';
            if (karyaGroup) karyaGroup.style.display = 'none';
        } else {
            // Restore proper jenisPdh value if changed back to Anggota
            if (item.classList.contains('exclusive')) {
                jenisPdhInput.value = 'Exclusive';
            } else {
                jenisPdhInput.value = 'Standard';
            }
        }
    });
}

document.getElementById('form-pesanan').addEventListener('change', function(e) {
    if (e.target.classList.contains('jabatan-input')) {
        checkPengurus();
    }
});
function updatePesananLabels() {
    const stdItems = document.querySelectorAll('.pesanan-item.standard');
    stdItems.forEach((item, index) => {
        const label = item.querySelector('.pesanan-label');
        if (label) {
            label.textContent = `PDH Standard ${index + 1}`;
        }
    });
    
    const excItems = document.querySelectorAll('.pesanan-item.exclusive');
    excItems.forEach((item, index) => {
        const label = item.querySelector('.pesanan-label');
        if (label) {
            label.textContent = `PDH Exclusive ${index + 1}`;
        }
    });
}

function createPesananItem(type) {
    const templateStandard = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px dashed rgba(59, 130, 246, 0.3); padding-bottom: 10px;">
          <h4 class="pesanan-label" style="margin: 0; color: #3b82f6; font-size: 16px; font-weight: 600;">PDH Standard</h4>
          <button type="button" class="btn-hapus-pesanan" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px dashed rgba(239, 68, 68, 0.5); padding: 4px 10px; border-radius: 6px; font-size: 12px; cursor: pointer;">Hapus</button>
        </div>
        <input type="hidden" class="jenisPdh-input" value="Standard">
        <div class="form-row">
          <div class="form-group">
            <label>Jabatan</label>
            <div class="select-wrapper">
              <select class="jabatan-input" required>
                <option value="" disabled selected>Pilih Jabatan...</option>
                <option value="Pembina">Pembina</option>
                <option value="Pembimbing">Pembimbing</option>
                <option value="Pengurus">Pengurus</option>
                <option value="Anggota">Anggota</option>
              </select>
            </div>
            <div class="pengurus-group-local select-wrapper" style="display: none; margin-top: 10px;">
              <select class="posisi-pengurus-input">
                <option value="" disabled selected>Pilih Posisi Pengurus...</option>
                <option value="KETUA UMUM">KETUA UMUM</option>
                <option value="WAKIL KETUA UMUM">WAKIL KETUA UMUM</option>
                <option value="SEKRETARIS UMUM">SEKRETARIS UMUM</option>
                <option value="BENDAHARA UMUM">BENDAHARA UMUM</option>
                <option value="KADEP. LEARNING & DEVELOPMENT">KADEP. LEARNING & DEVELOPMENT</option>
                <option value="KADEP. RESEARCH & COMPETITION">KADEP. RESEARCH & COMPETITION</option>
                <option value="KADEP. CREATIVE MEDIA">KADEP. CREATIVE MEDIA</option>
                <option value="KADEP. MARKETING">KADEP. MARKETING</option>
                <option value="KOORDIV. WEB">KOORDIV. WEB</option>
                <option value="KOORDIV. MOBILE">KOORDIV. MOBILE</option>
                <option value="KOORDIV. SC">KOORDIV. SC</option>
                <option value="KOORDIV. IOT">KOORDIV. IOT</option>
                <option value="KOORDIV. UI UX">KOORDIV. UI UX</option>
              </select>
            </div>
          </div>
          <div class="form-group divisi-group">
            <label>Divisi</label>
            <div class="select-wrapper">
              <select class="divisi-input" required>
                <option value="" disabled selected>Pilih Divisi...</option>
                <option value="WEB">WEB</option>
                <option value="Mobile">Mobile</option>
                <option value="IoT">IoT</option>
                <option value="SC">SC</option>
                <option value="UI UX">UI UX</option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Ukuran</label>
            <div class="select-wrapper">
              <select class="ukuran-input" required>
                <option value="" disabled selected>Pilih Ukuran...</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Volume (Jumlah)</label>
            <input type="number" class="volume-input" min="1" value="1" required>
          </div>
        </div>
    `;

    const templateExclusive = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px dashed rgba(16, 185, 129, 0.3); padding-bottom: 10px;">
          <h4 class="pesanan-label" style="margin: 0; color: #10b981; font-size: 16px; font-weight: 600;">PDH Exclusive</h4>
          <button type="button" class="btn-hapus-pesanan" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px dashed rgba(239, 68, 68, 0.5); padding: 4px 10px; border-radius: 6px; font-size: 12px; cursor: pointer;">Hapus</button>
        </div>
        <input type="hidden" class="jenisPdh-input" value="Exclusive">
        <div class="form-row">
          <div class="form-group">
            <label>Jabatan</label>
            <div class="select-wrapper">
              <select class="jabatan-input" required>
                <option value="" disabled selected>Pilih Jabatan...</option>
                <option value="Pembina">Pembina</option>
                <option value="Pembimbing">Pembimbing</option>
                <option value="Pengurus">Pengurus</option>
                <option value="Anggota">Anggota</option>
              </select>
            </div>
            <div class="pengurus-group-local select-wrapper" style="display: none; margin-top: 10px;">
              <select class="posisi-pengurus-input">
                <option value="" disabled selected>Pilih Posisi Pengurus...</option>
                <option value="KETUA UMUM">KETUA UMUM</option>
                <option value="WAKIL KETUA UMUM">WAKIL KETUA UMUM</option>
                <option value="SEKRETARIS UMUM">SEKRETARIS UMUM</option>
                <option value="BENDAHARA UMUM">BENDAHARA UMUM</option>
                <option value="KADEP. LEARNING & DEVELOPMENT">KADEP. LEARNING & DEVELOPMENT</option>
                <option value="KADEP. RESEARCH & COMPETITION">KADEP. RESEARCH & COMPETITION</option>
                <option value="KADEP. CREATIVE MEDIA">KADEP. CREATIVE MEDIA</option>
                <option value="KADEP. MARKETING">KADEP. MARKETING</option>
                <option value="KOORDIV. WEB">KOORDIV. WEB</option>
                <option value="KOORDIV. MOBILE">KOORDIV. MOBILE</option>
                <option value="KOORDIV. SC">KOORDIV. SC</option>
                <option value="KOORDIV. IOT">KOORDIV. IOT</option>
                <option value="KOORDIV. UI UX">KOORDIV. UI UX</option>
              </select>
            </div>
          </div>
          <div class="form-group divisi-group">
            <label>Divisi</label>
            <div class="select-wrapper">
              <select class="divisi-input" required>
                <option value="" disabled selected>Pilih Divisi...</option>
                <option value="WEB">WEB</option>
                <option value="Mobile">Mobile</option>
                <option value="IoT">IoT</option>
                <option value="SC">SC</option>
                <option value="UI UX">UI UX</option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Ukuran</label>
            <div class="select-wrapper">
              <select class="ukuran-input" required>
                <option value="" disabled selected>Pilih Ukuran...</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Volume (Jumlah)</label>
            <input type="number" class="volume-input" min="1" value="1" required>
          </div>
        </div>
        <div class="form-group karya-group-local" style="background: rgba(16, 185, 129, 0.1); padding: 15px; border-radius: 12px; border: 1px dashed rgba(16, 185, 129, 0.3); margin-top: 15px; margin-bottom: 0;">
          <label style="color: #10b981;">Unggah Dokumen Pendukung (Khusus Exclusive)</label>
          <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 10px;">Mohon unggah dokumen pendukung (Sertifikat Prestasi, SK Asdos, Karya, dll) sebagai bahan validasi admin.</p>
          <div class="file-upload">
            <input type="file" class="fileKarya-local" accept="image/*,application/pdf" required>
          </div>
        </div>
    `;

    const div = document.createElement('div');
    div.className = `pesanan-item ${type}`;
    div.style.cssText = 'border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px; background: rgba(0,0,0,0.1);';
    div.innerHTML = type === 'standard' ? templateStandard : templateExclusive;

    return div;
}



document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('btn-hapus-pesanan')) {
        const item = e.target.closest('.pesanan-item');
        if (item) {
            item.style.display = 'none';
            
            // Bersihkan input
            const inputs = item.querySelectorAll('input, select');
            inputs.forEach(input => {
                if (input.classList.contains('volume-input')) {
                    input.value = 1;
                } else if (input.classList.contains('jenisPdh-input')) {
                    // skip
                } else {
                    input.value = '';
                }
            });
            
            if (item.classList.contains('standard')) {
                document.getElementById('btn-kembalikan-standard').style.display = 'block';
            } else if (item.classList.contains('exclusive')) {
                document.getElementById('btn-kembalikan-exclusive').style.display = 'block';
            }

            checkPengurus();
            updatePesananLabels();
        }
    }
});

const btnKembaliStandard = document.getElementById('btn-kembalikan-standard');
if (btnKembaliStandard) {
    btnKembaliStandard.addEventListener('click', function() {
        const item = document.querySelector('.pesanan-item.standard');
        if (item) item.style.display = 'block';
        this.style.display = 'none';
        calculateGrandTotal();
    });
}

const btnKembaliExclusive = document.getElementById('btn-kembalikan-exclusive');
if (btnKembaliExclusive) {
    btnKembaliExclusive.addEventListener('click', function() {
        const item = document.querySelector('.pesanan-item.exclusive');
        if (item) item.style.display = 'block';
        this.style.display = 'none';
        calculateGrandTotal();
    });
}

document.getElementById('form-pesanan').addEventListener('submit', async function(event) {
  event.preventDefault();
  
  const btnSubmit = document.getElementById('btn-submit');
  const messageDiv = document.getElementById('message');
  
  btnSubmit.disabled = true;
  document.getElementById('loading-overlay').style.display = 'flex';
  messageDiv.style.display = 'none';
  messageDiv.className = 'message';
  
  try {
    if (!GAS_API_URL || !GAS_API_URL.startsWith('http')) {
        throw new Error("PENTING: Konfigurasi sistem belum selesai! Anda harus mengganti variabel GAS_API_URL di baris ke-2 script.js dengan URL hasil deploy backend Google Apps Script.");
    }

    const fileInput = document.getElementById('buktiTrans');
    const file = fileInput.files[0];
    
    if (!file) throw new Error("File Bukti Transfer wajib diunggah.");
    if(file.size > 5 * 1024 * 1024) throw new Error("Ukuran file terlalu besar. Maksimal 5MB.");

    const base64File = await getBase64(file);
    
    const formData = {
      action: 'order',
      orderId: 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000),
      nama: document.getElementById('nama').value,
      noWa: document.getElementById('noWa').value,
      items: [],
      base64File: base64File,
      fileName: file.name,
      mimeType: file.type
    };

    const allItems = document.querySelectorAll('.pesanan-item');
    
    // --- VALIDASI LINTAS FORM (KONSISTENSI JABATAN) ---
    let jabStd = "";
    let jabExc = "";
    
    for (let item of allItems) {
        let jp = item.querySelector('.jenisPdh-input').value;
        let jabInput = item.querySelector('.jabatan-input').value;
        const uk = item.querySelector('.ukuran-input').value;
        let divInput = item.querySelector('.divisi-input').value;
        
        const isJabEmpty = (!jabInput || jabInput === '' || jabInput.includes('Pilih'));
        const isUkEmpty = (!uk || uk === '' || uk.includes('Pilih'));
        const isDivEmpty = (!divInput || divInput === '' || divInput.includes('Pilih'));
        const isHidden = item.style.display === 'none' || item.offsetParent === null;

        let fileKarya = null;
        let isFileEmpty = true;
        if (jp === 'Exclusive') {
            fileKarya = item.querySelector('.fileKarya-local').files[0];
            if (fileKarya) isFileEmpty = false;
        }

        const isFormUntouched = isJabEmpty && isUkEmpty && isDivEmpty && isFileEmpty;
        
        if (!isHidden && !isFormUntouched && !isJabEmpty) {
            if (item.classList.contains('standard')) jabStd = jabInput;
            if (item.classList.contains('exclusive')) jabExc = jabInput;
        }
    }
    
    if (jabStd !== "" && jabExc !== "") {
        if ((jabStd === 'Anggota' || jabStd === 'Pengurus') && jabExc === 'Pembina') {
            throw new Error("Jabatan Anda bukan Pembina. Silakan sesuaikan pilihan jabatan di kedua form.");
        }
        if ((jabStd === 'Anggota' || jabStd === 'Pengurus') && jabExc === 'Pembimbing') {
            throw new Error("Jabatan Anda bukan Pembimbing. Silakan sesuaikan pilihan jabatan di kedua form.");
        }
        if ((jabStd === 'Pembina' || jabStd === 'Pembimbing') && jabExc === 'Anggota') {
            throw new Error("Jabatan Anda bukan Anggota. Silakan sesuaikan pilihan jabatan di kedua form.");
        }
        if (jabStd === 'Pembina' && jabExc === 'Pembimbing') {
            throw new Error("Jabatan Anda bukan Pembimbing. Silakan sesuaikan pilihan jabatan di kedua form.");
        }
        if (jabStd === 'Pembimbing' && jabExc === 'Pembina') {
            throw new Error("Jabatan Anda bukan Pembina. Silakan sesuaikan pilihan jabatan di kedua form.");
        }
    }
    // ------------------------------------------------
    
    for (let item of allItems) {
       let jp = item.querySelector('.jenisPdh-input').value;
       const uk = item.querySelector('.ukuran-input').value;
       let divInput = item.querySelector('.divisi-input').value;
       let jabInput = item.querySelector('.jabatan-input').value;
       
       const isJabEmpty = (!jabInput || jabInput === '' || jabInput.includes('Pilih'));
       const isUkEmpty = (!uk || uk === '' || uk.includes('Pilih'));
       const isDivEmpty = (!divInput || divInput === '' || divInput.includes('Pilih'));
       const isHidden = item.style.display === 'none' || item.offsetParent === null;

       let fileKarya = null;
       let isFileEmpty = true;
       if (jp === 'Exclusive') {
           fileKarya = item.querySelector('.fileKarya-local').files[0];
           if (fileKarya) isFileEmpty = false;
       }

       // Jika form disembunyikan ATAU benar-benar kosong SEMUANYA, abaikan saja
       if (isHidden || (isJabEmpty && isUkEmpty && isDivEmpty && isFileEmpty)) {
           continue;
       }
       
       // Cek apakah form SAMA SEKALI tidak disentuh (kosong 100%)
       const isFormUntouched = isJabEmpty && isUkEmpty && isDivEmpty && isFileEmpty;

       if (isHidden || isFormUntouched) {
           // Aman untuk diabaikan (form kosong total atau disembunyikan)
           continue;
       }
       
       // JIKA SAMPAI SINI, BERARTI FORM TELAH DIISI SEBAGIAN! Harus divalidasi ketat!
       if (isJabEmpty) throw new Error(`Jabatan wajib dipilih pada form PDH ${jp}.`);
       if (isUkEmpty) throw new Error(`Ukuran wajib dipilih pada form PDH ${jp}.`);
       
       const vol = item.querySelector('.volume-input').value;
       
       if (jabInput === 'Pengurus') {
           const posInput = item.querySelector('.posisi-pengurus-input').value;
           if (!posInput || posInput.includes('Pilih')) {
               throw new Error(`Posisi pengurus wajib dipilih pada form PDH ${jp}.`);
           }
           
           if (posInput.includes('KADEP')) divInput = '-';
           else if (posInput.includes('KOORDIV. WEB')) divInput = 'WEB';
           else if (posInput.includes('KOORDIV. MOBILE')) divInput = 'Mobile';
           else if (posInput.includes('KOORDIV. IOT')) divInput = 'IoT';
           else if (posInput.includes('KOORDIV. SC')) divInput = 'SC';
           else if (posInput.includes('KOORDIV. UI UX')) divInput = 'UI UX';
           else divInput = '-'; 
           
           jabInput = posInput;
       } else if (jabInput === 'Pembina') {
           divInput = '-';
       } else if (jabInput === 'Pembimbing') {
           if (isDivEmpty) throw new Error(`Divisi wajib dipilih untuk Pembimbing pada form PDH ${jp}.`);
       } else {
           if (isDivEmpty) throw new Error(`Divisi wajib dipilih untuk Anggota pada form PDH ${jp}.`);
       }
       
       let itemData = {
           jenisPdh: jp,
           ukuran: uk,
           divisi: divInput,
           jabatan: jabInput,
           volume: vol
       };
       
       if (jp === 'Exclusive') {
            // Jika jabatan Anggota, maka dokumen pendukung WAJIB
            if (jabInput === 'Anggota') {
                if (!fileKarya) throw new Error(`Dokumen Pendukung wajib diunggah untuk Anggota pada PDH ${jp}.`);
                if (fileKarya.size > 5 * 1024 * 1024) throw new Error("Ukuran file dokumen terlalu besar. Maksimal 5MB.");
                
                itemData.karyaBase64 = await getBase64(fileKarya);
                itemData.karyaFileName = fileKarya.name;
                itemData.karyaMimeType = fileKarya.type;
            } else {
                // Untuk Pembina/Pembimbing, tidak ada upload dokumen (kosong)
                itemData.karyaBase64 = "";
                itemData.karyaFileName = "";
                itemData.karyaMimeType = "";
            }
       }
       
       formData.items.push(itemData);
    }
    
    if (formData.items.length === 0) {
        throw new Error("Mohon isi setidaknya satu pesanan (Standard atau Exclusive).");
    }
    
    const response = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(formData)
    });

    const result = await response.json();
    
    document.getElementById('loading-overlay').style.display = 'none';
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
    document.getElementById('loading-overlay').style.display = 'none';
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> KIRIM PESANAN';
    messageDiv.style.display = 'block';
    messageDiv.classList.add('error');
    messageDiv.textContent = err.message;
  }
});

let currentPassword = '';

let countdownInterval;
let serverConfig = { isOpen: 'auto', openTime: '', closeTime: '' };

async function updateAdminConfigUI() {
    if (!isAdmin) return;
    if (serverConfig.openTime) {
        document.getElementById('config-open').value = serverConfig.openTime.substring(0, 16);
    }
    if (serverConfig.closeTime) {
        document.getElementById('config-close').value = serverConfig.closeTime.substring(0, 16);
    }
    const statusText = document.getElementById('current-schedule-status');
    if (serverConfig.isOpen === 'true') {
        statusText.innerHTML = '<span style="color:#10b981;">BUKA PAKSA</span>';
    } else if (serverConfig.isOpen === 'false') {
        statusText.innerHTML = '<span style="color:#ef4444;">TUTUP PAKSA</span>';
    } else {
        statusText.innerHTML = '<span style="color:#3b82f6;">JADWAL OTOMATIS</span>';
    }
}

function startCountdown() {
    clearInterval(countdownInterval);
    const banner = document.getElementById('countdown-banner');
    const formContainer = document.getElementById('form-container-wrapper');
    const headerBadge = document.getElementById('header-status-badge');

    countdownInterval = setInterval(() => {
        let isCurrentlyOpen = false;
        let timeRemaining = 0;
        let countdownType = '';

        if (serverConfig.isOpen === 'true') {
            isCurrentlyOpen = true;
        } else if (serverConfig.isOpen === 'false') {
            isCurrentlyOpen = false;
        } else {
            const now = new Date().getTime();
            const openTimeMs = serverConfig.openTime ? new Date(serverConfig.openTime).getTime() : 0;
            const closeTimeMs = serverConfig.closeTime ? new Date(serverConfig.closeTime).getTime() : Infinity;

            if (now >= openTimeMs && now <= closeTimeMs) {
                isCurrentlyOpen = true;
                if (closeTimeMs !== Infinity) {
                    timeRemaining = closeTimeMs - now;
                    countdownType = 'tutup';
                }
            } else if (now < openTimeMs) {
                timeRemaining = openTimeMs - now;
                countdownType = 'buka';
            }
        }

        if (!isCurrentlyOpen) {
            if (headerBadge) {
                headerBadge.style.background = 'rgba(239, 68, 68, 0.2)';
                headerBadge.style.color = '#ef4444';
                headerBadge.style.border = '1px solid rgba(239, 68, 68, 0.4)';
                headerBadge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> <span>STATUS: DITUTUP</span>`;
            }
            
            banner.style.display = 'block';
            banner.style.background = 'rgba(239, 68, 68, 0.1)';
            banner.style.color = '#ef4444';
            banner.style.border = '1px dashed rgba(239, 68, 68, 0.3)';
            formContainer.style.display = 'none';
            
            if (countdownType === 'buka') {
                banner.innerHTML = `Pemesanan akan dibuka dalam: <strong>${formatDuration(timeRemaining)}</strong>`;
            } else {
                banner.innerHTML = `Pemesanan saat ini sedang <strong>DITUTUP</strong>`;
            }
        } else {
            if (headerBadge) {
                headerBadge.style.background = 'rgba(16, 185, 129, 0.2)';
                headerBadge.style.color = '#10b981';
                headerBadge.style.border = '1px solid rgba(16, 185, 129, 0.4)';
                headerBadge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> <span>STATUS: DIBUKA</span>`;
            }
            
            formContainer.style.display = 'block';
            if (countdownType === 'tutup') {
                banner.style.display = 'block';
                banner.style.background = 'rgba(16, 185, 129, 0.1)';
                banner.style.color = '#10b981';
                banner.style.border = '1px dashed rgba(16, 185, 129, 0.3)';
                banner.innerHTML = `Pemesanan ditutup dalam: <strong>${formatDuration(timeRemaining)}</strong>`;
            } else {
                banner.style.display = 'none';
            }
        }
    }, 1000);
}

function formatDuration(ms) {
    if (ms <= 0) return '00:00:00';
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((ms % (1000 * 60)) / 1000);
    let str = '';
    if (days > 0) str += `${days} Hari `;
    str += `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return str;
}

async function sendConfigUpdate(isOpen) {
    const openLocal = document.getElementById('config-open').value;
    const closeLocal = document.getElementById('config-close').value;
    
    const openISO = openLocal ? openLocal + ':00+08:00' : '';
    const closeISO = closeLocal ? closeLocal + ':00+08:00' : '';

    const btn = document.getElementById('btn-save-schedule');
    const oldBtnText = btn.textContent;
    btn.textContent = 'Menyimpan...';

    try {
        const response = await fetch(GAS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'update_config',
                password: currentPassword,
                config: {
                    isOpen: isOpen,
                    openTime: openISO,
                    closeTime: closeISO
                }
            })
        });
        const res = await response.json();
        if (res.success) {
            alert(res.message);
            loadDataPesanan();
        } else {
            alert('Gagal: ' + res.message);
        }
    } catch (err) {
        alert('Terjadi kesalahan: ' + err.message);
    }
    btn.textContent = oldBtnText;
}

if (document.getElementById('btn-save-schedule')) {
    document.getElementById('btn-save-schedule').addEventListener('click', () => sendConfigUpdate('auto'));
}
if (document.getElementById('btn-force-open')) {
    document.getElementById('btn-force-open').addEventListener('click', () => {
        if(confirm('Yakin ingin membuka pesanan sekarang juga (Buka Paksa)?')) sendConfigUpdate('true');
    });
}
if (document.getElementById('btn-force-close')) {
    document.getElementById('btn-force-close').addEventListener('click', () => {
        if(confirm('Yakin ingin menutup pesanan sekarang juga (Tutup Paksa)?')) sendConfigUpdate('false');
    });
}

async function loadDataPesanan() {
  const tbody = document.getElementById('table-body');
  
  if (!GAS_API_URL || !GAS_API_URL.startsWith('http')) {
      tbody.innerHTML = '<tr><td colspan="15" class="text-center" style="color: var(--warning);">Sistem menunggu konfigurasi URL Backend...</td></tr>';
      return;
  }

  try {
    const response = await fetch(GAS_API_URL);
    const rawData = await response.json();
    
    if (rawData.error) throw new Error(rawData.error);

    let data;
    if (Array.isArray(rawData)) {
        data = rawData;
    } else {
        data = rawData.data;
        serverConfig = rawData.config;
        updateAdminConfigUI();
        startCountdown();
    }

    globalData = data;
    renderTable(globalData);
    if(isAdmin) renderDashboard(globalData);

  } catch (err) {
    document.getElementById('table-body').innerHTML = `<tr><td colspan="15" class="text-center" style="color: var(--danger);">Gagal memuat data dari server. Error: ${err.message}</td></tr>`;
    console.error("Fetch Data Error:", err);
  }
}

function renderTable(data) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';
    
    const colAksi = document.querySelector('.col-aksi');
    if (colAksi) {
        colAksi.style.display = isAdmin ? 'table-cell' : 'none';
    }
    
    const badge = document.getElementById('total-order-badge');
    badge.textContent = `Total Order: ${data.length}`;
    
    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center" style="padding: 20px; color: var(--text-muted);">Belum ada data pesanan.</td></tr>';
      return;
    }
    
    data.forEach((item) => {
      const tr = document.createElement('tr');
      
      let dateStr = item.waktu;
      if(dateStr && dateStr.length > 15) {
         const d = new Date(dateStr);
         if(!isNaN(d)) {
             dateStr = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
         }
      }

      let vols = String(item.volume).split(',').map(s => parseInt(s.trim()) || 1);
      let jenisPdhs = String(item.jenisPdh).split(',').map(s => s.trim().toLowerCase());
      let valids = String(item.validasi || '').split(',').map(s => s.trim().toLowerCase());
      let getVal = (idx) => valids[idx] !== undefined ? valids[idx] : (valids[0] || '');
      
      let calcNominal = 0;
      let pendingNominal = 0;
      let nominalStrs = [];

      for (let i = 0; i < vols.length; i++) {
          let v = vols[i];
          let typePdh = (jenisPdhs[i] || '');
          let val = getVal(i);
          
          if (typePdh.includes('exclusive')) {
              if (val === 'disetujui' || val === 'lulus') {
                  let amt = v * 155000;
                  calcNominal += amt;
                  nominalStrs.push(`Rp ${amt.toLocaleString('id-ID')}`);
              } else if (val === 'tidak disetujui' || val === 'ditolak') {
                  nominalStrs.push(`<span style="color:#ef4444; font-size:11px;">Ditolak</span>`);
              } else {
                  pendingNominal += v * 155000;
                  nominalStrs.push(`<span style="color:#f59e0b; font-size:11px;">Menunggu Validasi</span>`);
              }
          } else {
              let amt = v * 155000;
              calcNominal += amt;
              nominalStrs.push(`Rp ${amt.toLocaleString('id-ID')}`);
          }
      }

      const separator = '<hr style="margin: 8px 0; border: 0; border-top: 1px dashed rgba(255,255,255,0.15);">';
      let nominalStr = nominalStrs.join(separator);
      
      if (vols.length > 1) {
          nominalStr += `<div style="margin-top: 8px; border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 4px; font-size: 11px; color: var(--text-muted);">Grand Total:</div><div style="font-size: 14px;">Rp ${calcNominal.toLocaleString('id-ID')}</div>`;
      }

      let buktiTfCell = item.buktiTf ? `<button type="button" onclick="openImageModal('${item.buktiTf}')" class="btn-sm" style="background: none; border: 1px solid var(--border); color: var(--text); padding: 4px 8px; cursor: pointer; border-radius: 4px;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> TF</button>` : '-';
      
      let karyaCell = '-';
      if (item.karya) {
          let urls = item.karya.split(',').map(s => s.trim()).filter(s => s);
          if (urls.length > 0) {
              karyaCell = urls.map((u, idx) => `<button type="button" onclick="openImageModal('${u}')" class="btn-sm" style="background: none; border: 1px solid var(--border); color: var(--text); padding: 4px 8px; cursor: pointer; border-radius: 4px; margin: 2px;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"></path></svg> Dokumen ${urls.length > 1 ? idx+1 : ''}</button>`).join(' ');
          }
      }

      let bayarCell = '';
      let prosesCell = '';
      let validasiCell = '';
      
      let sp = item.statusProses;
      if (sp === 'Proses') sp = 'Pending'; // fallback for old data

      if(isAdmin) {
          bayarCell = `<select class="admin-select" onchange="updateStatus(${item.rowId}, 'bayar', this.value)">
              <option value="Pending" ${item.statusBayar==='Pending'?'selected':''}>Pending</option>
              <option value="DP" ${item.statusBayar==='DP'?'selected':''}>DP</option>
              <option value="Lunas" ${item.statusBayar==='Lunas'?'selected':''}>Lunas</option>
          </select>`;
          prosesCell = `<select class="admin-select" onchange="updateStatus(${item.rowId}, 'proses', this.value)">
              <option value="Pending" ${sp==='Pending'?'selected':''}>Pending</option>
              <option value="Proses Cetak" ${sp==='Proses Cetak'?'selected':''}>Proses Cetak</option>
              <option value="Selesai" ${sp==='Selesai'?'selected':''}>Selesai</option>
          </select>`;
          if (item.jenisPdh.includes('Exclusive')) {
              let val = item.validasi;
              if (val === 'Lulus') val = 'Disetujui';
              if (val === 'Ditolak') val = 'Tidak Disetujui';
              
              validasiCell = `<select class="admin-select" onchange="updateStatus(${item.rowId}, 'validasi', this.value)">
                  <option value="Menunggu" ${val==='Menunggu'?'selected':''}>Menunggu</option>
                  <option value="Disetujui" ${val==='Disetujui'?'selected':''}>Disetujui</option>
                  <option value="Tidak Disetujui" ${val==='Tidak Disetujui'?'selected':''}>Tidak Disetujui</option>
              </select>`;
          } else {
              validasiCell = '-';
          }
      } else {
          let badgeBayar = item.statusBayar.toLowerCase().includes('lunas') ? 'success' : (item.statusBayar.toLowerCase().includes('dp') ? 'primary' : 'warning');
          let badgeProses = sp.toLowerCase().includes('selesai') ? 'success' : (sp.toLowerCase().includes('cetak') ? 'primary' : 'warning');
          bayarCell = `<span class="badge ${badgeBayar}">${item.statusBayar.toUpperCase()}</span>`;
          prosesCell = `<span class="badge ${badgeProses}">${sp.toUpperCase()}</span>`;
          
          if (item.jenisPdh.includes('Exclusive') && item.validasi) {
              let val = item.validasi;
              if (val === 'Lulus') val = 'Disetujui';
              if (val === 'Ditolak') val = 'Tidak Disetujui';
              
              let badgeVal = val.toLowerCase() === 'disetujui' ? 'success' : (val.toLowerCase() === 'tidak disetujui' ? 'danger' : (val.toLowerCase() === 'menunggu' ? 'warning' : 'primary'));
              validasiCell = `<span class="badge ${badgeVal}">${val.toUpperCase()}</span>`;
          } else {
              validasiCell = '-';
          }
      }

      let aksiCell = '';
      if(isAdmin) {
          const safeNama = item.nama ? item.nama.replace(/'/g, "\\'") : '';
          const safeNowa = item.noWa ? item.noWa.replace(/'/g, "\\'") : '';
          const safeDivisi = item.divisi ? item.divisi.replace(/'/g, "\\'") : '';
          const safeUkuran = item.ukuran ? item.ukuran.replace(/'/g, "\\'") : '';
          const safeJenis = item.jenisPdh ? item.jenisPdh.replace(/'/g, "\\'") : '';
          const safeVolume = item.volume ? String(item.volume).replace(/'/g, "\\'") : '';
          
          const safeJabatan = item.jabatan ? item.jabatan.replace(/'/g, "\\'") : '';
          
          aksiCell = `<td class="col-aksi">
              <div style="display: flex; gap: 5px;">
                 <button type="button" class="btn-sm" style="background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.3); color: #3b82f6;" onclick="openEditModal(${item.rowId}, '${safeNama}', '${safeNowa}', '${safeDivisi}', '${safeUkuran}', '${safeJenis}', '${safeVolume}', '${safeJabatan}')">Edit</button>
                 <button type="button" class="btn-sm" style="background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #ef4444;" onclick="deleteOrder(${item.rowId})">Hapus</button>
              </div>
          </td>`;
      }

      const fmt = (val) => (val || '-').toString().split(',').map(s => s.trim()).join(separator);

      tr.innerHTML = `
        <td>${item.no}</td>
        <td style="font-weight: 600;">${item.nama}</td>
        <td>${fmt(item.jabatan)}</td>
        <td style="color: var(--primary); font-weight: bold;">${fmt(item.ukuran)}</td>
        <td>${fmt(item.divisi)}</td>
        <td>${fmt(item.jenisPdh)}</td>
        <td>${fmt(item.volume)}</td>
        <td style="color: #ef4444; font-weight: bold;">${nominalStr}</td>
        <td>${item.noWa || '-'}</td>
        <td>${buktiTfCell}</td>
        <td>${karyaCell}</td>
        <td>${validasiCell}</td>
        <td>${bayarCell}</td>
        <td>${prosesCell}</td>
        <td style="color: var(--text-muted); font-size: 12px;">${dateStr}</td>
        ${isAdmin ? aksiCell : ''}
      `;
      tbody.appendChild(tr);
    });
}

function deleteOrder(rowId) {
    if (!confirm('Hapus pesanan ini? Aksi ini tidak dapat dikembalikan.')) return;
    performAdminAction('delete_order', { rowId });
}

function openEditModal(rowId, nama, noWa, divisi, ukuran, jenisPdh, volume, jabatan) {
    document.getElementById('edit-rowId').value = rowId;
    document.getElementById('edit-nama').value = nama;
    document.getElementById('edit-noWa').value = noWa;
    document.getElementById('edit-divisi').value = divisi;
    document.getElementById('edit-ukuran').value = ukuran;
    document.getElementById('edit-jenisPdh').value = jenisPdh;
    document.getElementById('edit-volume').value = volume;
    document.getElementById('edit-jabatan').value = jabatan || '';
    document.getElementById('edit-modal').style.display = 'flex';
}

async function saveEditOrder() {
    const editData = {
        nama: document.getElementById('edit-nama').value,
        noWa: document.getElementById('edit-noWa').value,
        divisi: document.getElementById('edit-divisi').value,
        ukuran: document.getElementById('edit-ukuran').value,
        jenisPdh: document.getElementById('edit-jenisPdh').value,
        volume: document.getElementById('edit-volume').value,
        jabatan: document.getElementById('edit-jabatan').value
    };
    const rowId = document.getElementById('edit-rowId').value;
    await performAdminAction('edit_order', { editData: editData, rowId: rowId });
    document.getElementById('edit-modal').style.display = 'none';
}

document.getElementById('close-edit-modal').addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
});
document.getElementById('btn-save-edit').addEventListener('click', saveEditOrder);

async function performAdminAction(action, payload) {
    try {
        const response = await fetch(GAS_API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'text/plain;charset=utf-8'},
            body: JSON.stringify({ action, password: currentPassword, ...payload })
        });
        const result = await response.json();
        if(result.success) {
            alert('Berhasil');
            loadDataPesanan();
        } else {
            alert('Gagal: ' + result.message);
        }
    } catch(e) {
        alert('Error: ' + e.message);
    }
}

function generatePDF() {
    if (!window.jspdf) {
        alert("Library PDF belum termuat, silakan coba lagi atau cek koneksi internet.");
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');
    
    doc.setFontSize(16);
    doc.text("Laporan Pemesanan PDH ISC", 14, 15);
    
    doc.setFontSize(11);
    let totalLunas = 0, totalDP = 0, omset = 0, totalPemesan = globalData.length;
    
    const fmtPdf = (val) => (val || '-').toString().split(',').map(s => s.trim()).join('\n');
    const tableColumn = ["No", "Nama", "Jabatan", "Divisi", "Ukuran", "Jenis PDH", "Volume", "Total (Rp)", "Status Bayar", "Validasi Exclusive"];
    const tableRows = [];

    globalData.forEach((item, index) => {
        let vols = String(item.volume).split(',').map(s => parseInt(s.trim()) || 1);
        let jenis = String(item.jenisPdh).split(',').map(s => s.trim().toLowerCase());
        let valids = String(item.validasi || '').split(',').map(s => s.trim().toLowerCase());
        let getVal = (idx) => valids[idx] !== undefined ? valids[idx] : (valids[0] || '');
        
        let calcNominal = 0;
        let nominalStrs = [];
        
        for (let i = 0; i < vols.length; i++) {
            let v = vols[i];
            let typePdh = (jenis[i] || '');
            let val = getVal(i);
            
            if (typePdh.includes('exclusive')) {
                if (val === 'disetujui' || val === 'lulus') {
                    let amt = v * 155000;
                    calcNominal += amt;
                    nominalStrs.push(`Rp ${amt.toLocaleString('id-ID')}`);
                } else if (val === 'tidak disetujui' || val === 'ditolak') {
                    nominalStrs.push(`Ditolak`);
                } else {
                    nominalStrs.push(`Menunggu`);
                }
            } else {
                let amt = v * 155000;
                calcNominal += amt;
                nominalStrs.push(`Rp ${amt.toLocaleString('id-ID')}`);
            }
        }
        
        omset += calcNominal;
        
        let sb = item.statusBayar.toLowerCase();
        if (sb.includes('lunas')) totalLunas++;
        if (sb.includes('dp')) totalDP++;
        
        let nominalStr = nominalStrs.join('\n');
        if (vols.length > 1) {
            nominalStr += `\nTotal: Rp ${calcNominal.toLocaleString('id-ID')}`;
        }

        tableRows.push([
            index + 1,
            item.nama,
            fmtPdf(item.jabatan),
            fmtPdf(item.divisi),
            fmtPdf(item.ukuran),
            fmtPdf(item.jenisPdh),
            fmtPdf(item.volume),
            nominalStr,
            item.statusBayar,
            fmtPdf(item.validasi)
        ]);
    });
    
    doc.text(`Total Pemesan: ${totalPemesan} orang`, 14, 25);
    doc.text(`Status Pembayaran - Lunas: ${totalLunas} | DP: ${totalDP}`, 14, 31);
    doc.text(`Estimasi Omset: Rp ${omset.toLocaleString('id-ID')}`, 14, 37);
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 43,
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [77, 166, 255] },
        alternateRowStyles: { fillColor: [240, 240, 240] }
    });
    
    const dateStr = new Date().toISOString().slice(0, 10);
    doc.save(`Laporan_PDH_${dateStr}.pdf`);
}

function renderDashboard(data) {
    let lunas = 0, dp = 0, pending = 0, proses = 0, selesai = 0;
    let totalOmset = 0;
    let dist = { S: {std:0, exc:0}, M: {std:0, exc:0}, L: {std:0, exc:0}, XL: {std:0, exc:0}, XXL: {std:0, exc:0} };

    data.forEach(item => {
        let vols = String(item.volume).split(',').map(s => parseInt(s.trim()) || 1);
        let ukurans = String(item.ukuran).split(',').map(s => s.trim().toUpperCase());
        let jenisPdhs = String(item.jenisPdh).split(',').map(s => s.trim().toLowerCase());
        let valids = String(item.validasi || '').split(',').map(s => s.trim().toLowerCase());
        let getVal = (idx) => valids[idx] !== undefined ? valids[idx] : (valids[0] || '');

        let calcNominal = 0;
        let totalVol = vols.reduce((a, b) => a + b, 0);
        
        for (let i = 0; i < vols.length; i++) {
            let v = vols[i];
            let typePdh = (jenisPdhs[i] || '');
            let val = getVal(i);
            
            if (typePdh.includes('exclusive')) {
                if (val === 'disetujui' || val === 'lulus') {
                    calcNominal += v * 155000;
                }
            } else {
                calcNominal += v * 155000;
            }
        }
        
        totalOmset += calcNominal;

        if(item.statusBayar.toLowerCase().includes('lunas')) lunas += 1;
        else if(item.statusBayar.toLowerCase().includes('dp')) dp += 1;
        else pending += 1;

        if(item.statusProses.toLowerCase().includes('selesai')) selesai += 1;
        else if(item.statusProses.toLowerCase().includes('proses')) proses += 1;
        
        for (let i = 0; i < ukurans.length; i++) {
            let uk = ukurans[i];
            if(uk === '2XL') uk = 'XXL';
            let typePdh = (jenisPdhs[i] || '').includes('standard') ? 'std' : 'exc';
            let vol = vols[i] || 1;
            if(dist[uk]) {
                dist[uk][typePdh] += vol;
            }
        }
    });

    document.getElementById('stat-lunas').textContent = lunas;
    document.getElementById('stat-dp').textContent = dp;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-proses').textContent = proses;
    document.getElementById('stat-selesai').textContent = selesai;
    
    const nominalElem = document.getElementById('stat-nominal');
    if (nominalElem) nominalElem.textContent = 'Rp ' + totalOmset.toLocaleString('id-ID');

    const distGrid = document.getElementById('dist-grid');
    distGrid.innerHTML = '';
    const ukurans = ['S','M','L','XL','XXL'];
    ukurans.forEach(uk => {
       const std = dist[uk].std;
       const exc = dist[uk].exc;
       const total = std + exc;
       
       const distItem = document.createElement('div');
       distItem.className = 'dist-item';
       distItem.innerHTML = `
          <div class="dist-size">${uk}</div>
          <div class="dist-bar-container" style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; display: flex; margin: 5px 0;">
             <div style="width: ${total > 0 ? (std/total)*100 : 0}%; background: #3b82f6;"></div>
             <div style="width: ${total > 0 ? (exc/total)*100 : 0}%; background: #a855f7;"></div>
          </div>
          <div class="dist-details" style="font-size: 11px; color: var(--text-muted); display:flex; gap:5px;">
             <span style="color:#3b82f6;">STD: ${std}</span> | 
             <span style="color:#a855f7;">EXC: ${exc}</span>
          </div>
       `;
       distGrid.appendChild(distItem);
    });
}

window.updateStatus = async function(rowId, type, value) {
    if (!confirm(`Yakin ingin mengubah status menjadi ${value}?`)) {
        loadDataPesanan();
        return;
    }
    
    try {
        const response = await fetch(GAS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'update_status',
                password: document.getElementById('admin-password').value,
                rowId: rowId,
                type: type,
                value: value
            })
        });
        const result = await response.json();
        if(result.success) {
            globalData = globalData.map(item => {
                if(item.rowId === rowId) {
                    if(type === 'bayar') item.statusBayar = value;
                    if(type === 'proses') item.statusProses = value;
                    if(type === 'validasi') item.validasi = value;
                }
                return item;
            });
            renderDashboard(globalData);
            alert('Status berhasil diperbarui!');
            loadDataPesanan();
        } else {
            alert('Gagal update: ' + result.message);
            loadDataPesanan(); 
        }
    } catch(e) {
        alert('Terjadi kesalahan saat update.');
    }
}

window.openImageModal = function(url) {
    if(!url) return;
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if(match && match[1]) {
        const fileId = match[1];
        const iframeUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        const modal = document.getElementById('image-modal');
        const modalIframe = document.getElementById('modal-iframe');
        
        modalIframe.src = iframeUrl;
        modal.style.display = 'flex';
    } else {
        window.open(url, '_blank');
    }
}

const loginModal = document.getElementById('login-modal');
const btnShowLogin = document.getElementById('logo-btn');
const closeModal = document.getElementById('close-modal');
const btnLogin = document.getElementById('btn-login');
const btnVerifyOtp = document.getElementById('btn-verify-otp');
const btnLogout = document.getElementById('btn-logout');
const togglePassword = document.getElementById('toggle-password');
const adminPassword = document.getElementById('admin-password');
const eyeIconShow = document.getElementById('eye-icon-show');
const eyeIconHide = document.getElementById('eye-icon-hide');

togglePassword.addEventListener('click', () => {
    if (adminPassword.type === 'password') {
        adminPassword.type = 'text';
        eyeIconShow.style.display = 'none';
        eyeIconHide.style.display = 'block';
    } else {
        adminPassword.type = 'password';
        eyeIconShow.style.display = 'block';
        eyeIconHide.style.display = 'none';
    }
});

btnShowLogin.addEventListener('click', () => loginModal.classList.add('show'));
closeModal.addEventListener('click', () => {
    loginModal.classList.remove('show');
    document.getElementById('login-message').style.display = 'none';
    
    document.getElementById('password-section').style.display = 'block';
    document.getElementById('btn-login').style.display = 'inline-block';
    document.getElementById('otp-section').style.display = 'none';
    document.getElementById('btn-verify-otp').style.display = 'none';
    document.getElementById('admin-otp').value = '';
});

function activateAdminMode() {
    isAdmin = true;
    loginModal.classList.remove('show');
    document.getElementById('login-message').style.display = 'none';
    document.getElementById('admin-badge').style.display = 'inline-block';
    document.getElementById('admin-dashboard').style.display = 'block';
    document.getElementById('btn-logout').style.display = 'inline-block';
    document.getElementById('btn-generate-pdf').style.display = 'inline-flex';
    document.querySelector('.form-card').style.display = 'none'; 
    document.getElementById('admin-section').after(document.querySelector('.grid-container'));
    
    renderTable(globalData);
    renderDashboard(globalData);
    updateAdminConfigUI();
}

btnLogin.addEventListener('click', async () => {
    const pwd = document.getElementById('admin-password').value;
    const msg = document.getElementById('login-message');
    if(!pwd) return;
    
    msg.style.display = 'block';
    msg.className = 'message';
    msg.textContent = 'Memeriksa sandi & Mengirim OTP ke email...';
    btnLogin.disabled = true;
    
    try {
        const response = await fetch(GAS_API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'text/plain;charset=utf-8'},
            body: JSON.stringify({ action: 'login', password: pwd })
        });
        const result = await response.json();
        btnLogin.disabled = false;
        
        if(result.success) {
            currentPassword = pwd;
            msg.className = 'message success';
            msg.textContent = result.message;
            
            document.getElementById('password-section').style.display = 'none';
            document.getElementById('btn-login').style.display = 'none';
            document.getElementById('otp-section').style.display = 'block';
            document.getElementById('btn-verify-otp').style.display = 'inline-block';
        } else {
            msg.classList.add('error');
            msg.textContent = result.message || 'Login gagal';
        }
    } catch(err) {
        btnLogin.disabled = false;
        msg.classList.add('error');
        msg.textContent = 'Gagal menghubungi server.';
    }
});

btnVerifyOtp.addEventListener('click', async () => {
    const otpVal = document.getElementById('admin-otp').value;
    const msg = document.getElementById('login-message');
    if(!otpVal) return;
    
    msg.style.display = 'block';
    msg.className = 'message';
    msg.textContent = 'Memverifikasi OTP...';
    btnVerifyOtp.disabled = true;
    
    try {
        const response = await fetch(GAS_API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'text/plain;charset=utf-8'},
            body: JSON.stringify({ action: 'verify_otp', password: currentPassword, otp: otpVal })
        });
        const result = await response.json();
        btnVerifyOtp.disabled = false;
        
        if(result.success) {
            localStorage.setItem('adminSession', btoa(currentPassword));
            activateAdminMode();
        } else {
            msg.classList.add('error');
            msg.textContent = result.message || 'OTP salah atau kadaluarsa';
        }
    } catch(err) {
        btnVerifyOtp.disabled = false;
        msg.classList.add('error');
        msg.textContent = 'Gagal memverifikasi OTP.';
    }
});

btnLogout.addEventListener('click', () => {
    isAdmin = false;
    currentPassword = '';
    localStorage.removeItem('adminSession');
    
    document.getElementById('admin-badge').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('btn-logout').style.display = 'none';
    document.getElementById('btn-generate-pdf').style.display = 'none';
    document.querySelector('.form-card').style.display = 'block';
    document.querySelector('.form-card').before(document.querySelector('.grid-container'));
    document.getElementById('admin-password').value = '';
    
    document.getElementById('password-section').style.display = 'block';
    document.getElementById('btn-login').style.display = 'inline-block';
    document.getElementById('otp-section').style.display = 'none';
    document.getElementById('btn-verify-otp').style.display = 'none';
    document.getElementById('admin-otp').value = '';
    
    renderTable(globalData);
});

if (document.getElementById('btn-generate-pdf')) {
    document.getElementById('btn-generate-pdf').addEventListener('click', generatePDF);
}

window.addEventListener('DOMContentLoaded', () => {
  const savedSession = localStorage.getItem('adminSession');
  if (savedSession) {
      try {
          currentPassword = atob(savedSession);
          isAdmin = true;
          document.getElementById('admin-badge').style.display = 'inline-block';
          document.getElementById('admin-dashboard').style.display = 'block';
          document.getElementById('btn-logout').style.display = 'inline-block';
          document.getElementById('btn-generate-pdf').style.display = 'inline-flex';
          document.querySelector('.form-card').style.display = 'none';
          document.getElementById('admin-section').after(document.querySelector('.grid-container'));
      } catch (e) {
          localStorage.removeItem('adminSession');
      }
  }
  loadDataPesanan();
});

// Fungsi untuk menyalin rekening
window.salinRekening = function(btn) {
    const rekening = "503501047215535";
    navigator.clipboard.writeText(rekening).then(() => {
        // Ganti icon jadi centang hijau sebentar
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        btn.style.borderColor = "rgba(16, 185, 129, 0.3)";
        btn.style.background = "rgba(16, 185, 129, 0.1)";
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.borderColor = "rgba(77, 166, 255, 0.3)";
            btn.style.background = "rgba(77, 166, 255, 0.1)";
        }, 2000);
    }).catch(err => {
        console.error('Gagal menyalin:', err);
        alert('Gagal menyalin nomor rekening!');
    });
};

// Fungsi perhitungan Grand Total
function calculateGrandTotal() {
    const allItems = document.querySelectorAll('.pesanan-item');
    let total = 0;

    for (let item of allItems) {
        // Cek apakah diabaikan
        const uk = item.querySelector('.ukuran-input').value;
        const divInput = item.querySelector('.divisi-input').value;
        const jabInput = item.querySelector('.jabatan-input').value;
        let jp = item.querySelector('.jenisPdh-input').value;
        let fileKarya = null;
        let isFileEmpty = true;
        if (jp === 'Exclusive') {
           const fileInput = item.querySelector('.fileKarya-local');
           fileKarya = fileInput ? fileInput.files[0] : null;
           if (fileKarya) isFileEmpty = false;
        }

        const isJabEmpty = (!jabInput || jabInput === '' || jabInput.includes('Pilih'));
        const isUkEmpty = (!uk || uk === '' || uk.includes('Pilih'));
        const isDivEmpty = (!divInput || divInput === '' || divInput.includes('Pilih'));
        const isHidden = item.style.display === 'none' || item.offsetParent === null;

        // Jika form disembunyikan ATAU benar-benar kosong SEMUANYA, abaikan dari total
        if (isHidden || (isJabEmpty && isUkEmpty && isDivEmpty && isFileEmpty)) {
            continue;
        }

        let volStr = item.querySelector('.volume-input').value;
        let vol = parseInt(volStr);
        if (isNaN(vol) || vol < 1) vol = 1;
        
        let price = 155000; // default S, M, L atau belum milih
        if (uk === 'XL' || uk === 'XXL') {
            price = 160000;
        }

        total += (price * vol);
    }

    const display = document.getElementById('grand-total-display');
    if (display) {
        display.textContent = total > 0 ? 'Rp ' + total.toLocaleString('id-ID') : 'Rp 0';
    }
}

// Tambahkan event listener agar form otomatis menghitung
document.getElementById('form-pesanan').addEventListener('change', calculateGrandTotal);
document.getElementById('form-pesanan').addEventListener('input', calculateGrandTotal);
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('btn-reset-form')) {
        const item = e.target.closest('.pesanan-item');
        if (item) {
            const jab = item.querySelector('.jabatan-input');
            const pos = item.querySelector('.posisi-pengurus-input');
            const divInput = item.querySelector('.divisi-input');
            const uk = item.querySelector('.ukuran-input');
            const vol = item.querySelector('.volume-input');
            const file = item.querySelector('.fileKarya-local');
            
            if (jab) jab.value = "";
            if (pos) pos.value = "";
            if (divInput) divInput.value = "";
            if (uk) uk.value = "";
            if (vol) vol.value = "1";
            if (file) file.value = "";
            
            // Reset visibility of dynamic groups
            const pengurusGroup = item.querySelector('.pengurus-group-local');
            const divisiGroup = item.querySelector('.divisi-group');
            if (pengurusGroup) pengurusGroup.style.display = 'none';
            if (divisiGroup) divisiGroup.style.display = 'block';
            
            setTimeout(calculateGrandTotal, 100);
        }
    }
});
document.addEventListener('DOMContentLoaded', calculateGrandTotal);

