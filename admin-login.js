const form=document.querySelector('#adminLoginForm');
const password=document.querySelector('#adminPassword');
const toggle=document.querySelector('#toggleAdminPassword');
const statusBox=document.querySelector('#adminLoginStatus');

toggle?.addEventListener('click',()=>{
  const hidden=password.type==='password';
  password.type=hidden?'text':'password';
  toggle.setAttribute('aria-label',hidden?'Sembunyikan password':'Tampilkan password');
});

form?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const data=new FormData(form);
  const email=String(data.get('email')||'').trim();
  const pass=String(data.get('password')||'');
  if(!email || !pass){
    statusBox.textContent='Lengkapi email administrator dan password.';
    statusBox.classList.add('show');
    return;
  }
  statusBox.textContent='Halaman login sudah siap. Autentikasi aman belum diaktifkan karena backend admin belum dibuat. Tahap berikutnya kita hubungkan login ini ke database/authentication sebelum dashboard dapat diakses.';
  statusBox.classList.add('show');
});
