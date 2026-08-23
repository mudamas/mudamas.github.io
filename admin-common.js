
const sb=window.mudamasSupabase;
const fmtIDR=(n)=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(n||0));
const fmtDate=(v)=>v?new Intl.DateTimeFormat('id-ID',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(v)):'-';
function toast(msg,type='success'){let el=document.getElementById('toast');if(!el){el=document.createElement('div');el.id='toast';el.className='toast';document.body.appendChild(el)}el.textContent=msg;el.className='toast '+type+' show';clearTimeout(window.__toastT);window.__toastT=setTimeout(()=>el.classList.remove('show'),3300)}
function statusBadge(status){
  const map={planning:['Perencanaan','gray'],active:['Aktif','green'],on_hold:['Ditunda','amber'],completed:['Selesai','blue'],cancelled:['Dibatalkan','red']};
  const x=map[status]||[status||'-','gray']; return `<span class="badge ${x[1]}">${x[0]}</span>`;
}
function txBadge(type){return type==='income'?'<span class="badge green">Pemasukan</span>':type==='expense'?'<span class="badge red">Pengeluaran</span>':'<span class="badge blue">Transfer</span>'}
async function requireAdmin(){
  if(!sb){location.replace('admin-login.html');return null}
  const {data:{session}}=await sb.auth.getSession();
  if(!session){location.replace('admin-login.html');return null}
  const {data:profile,error}=await sb.from('profiles').select('id,username,full_name,role,is_active').eq('id',session.user.id).single();
  if(error||!profile?.is_active){await sb.auth.signOut();location.replace('admin-login.html');return null}
  const name=profile.full_name||profile.username||'Administrator';
  document.querySelectorAll('[data-profile-name]').forEach(x=>x.textContent=name);
  document.querySelectorAll('[data-profile-role]').forEach(x=>x.textContent=profile.role||'admin');
  document.querySelectorAll('[data-profile-initial]').forEach(x=>x.textContent=name.charAt(0).toUpperCase());
  return {session,profile};
}
function bindShell(){
  const side=document.querySelector('.sidebar'),menu=document.getElementById('mobileMenu');
  menu?.addEventListener('click',()=>side?.classList.toggle('open'));
  document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>side?.classList.remove('open')));
  document.getElementById('adminLogout')?.addEventListener('click',async()=>{await sb.auth.signOut();location.replace('admin-login.html')});
}
document.addEventListener('DOMContentLoaded',bindShell);
