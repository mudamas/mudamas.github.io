(async () => {
  const cfg = window.MUDAMAS_SUPABASE;
  const loading = document.getElementById('adminLoading');
  const shell = document.getElementById('adminShell');

  if (!cfg || !window.supabase) {
    loading.textContent = 'Konfigurasi Supabase tidak tersedia.';
    return;
  }

  const client = window.supabase.createClient(cfg.url, cfg.publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });

  const { data: sessionData } = await client.auth.getSession();
  const session = sessionData?.session;
  if (!session) {
    window.location.replace('admin-login.html');
    return;
  }

  const { data: profile, error } = await client
    .from('profiles')
    .select('username, full_name, role, is_active')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error || !profile || profile.is_active !== true) {
    await client.auth.signOut();
    window.location.replace('admin-login.html');
    return;
  }

  const name = profile.full_name || profile.username || 'Administrator';
  document.getElementById('profileName').textContent = name;
  document.getElementById('welcomeName').textContent = name;
  document.getElementById('profileRole').textContent = (profile.role || 'admin').replace(/_/g, ' ');
  document.getElementById('profileInitial').textContent = name.charAt(0).toUpperCase();

  loading.hidden = true;
  shell.hidden = false;

  document.getElementById('adminLogout').addEventListener('click', async () => {
    await client.auth.signOut();
    window.location.replace('admin-login.html');
  });
})();
