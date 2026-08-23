(async () => {
  const sb = window.mudamasSupabase;
  const loading = document.getElementById('adminLoading');
  const shell = document.getElementById('adminShell');

  function goLogin() { location.replace('admin-login.html'); }
  if (!sb) { loading.textContent = 'Konfigurasi Supabase tidak termuat.'; return; }

  const { data: { session }, error } = await sb.auth.getSession();
  if (error || !session) { goLogin(); return; }

  const { data: profile, error: profileError } = await sb
    .from('profiles')
    .select('username, full_name, role, is_active')
    .eq('id', session.user.id)
    .single();

  if (profileError || !profile || !profile.is_active) {
    await sb.auth.signOut();
    goLogin();
    return;
  }

  const name = profile.full_name || profile.username || 'Administrator';
  document.getElementById('profileName').textContent = name;
  document.getElementById('welcomeName').textContent = name;
  document.getElementById('profileRole').textContent = (profile.role || 'admin').replaceAll('_',' ');
  document.getElementById('profileInitial').textContent = name.charAt(0).toUpperCase();

  loading.hidden = true;
  shell.hidden = false;

  document.getElementById('adminLogout')?.addEventListener('click', async () => {
    await sb.auth.signOut();
    location.replace('admin-login.html');
  });
})();
