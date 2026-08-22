(() => {
  const form = document.getElementById('adminLoginForm');
  const status = document.getElementById('adminLoginStatus');
  const toggle = document.getElementById('toggleAdminPassword');
  const passwordInput = document.getElementById('adminPassword');

  const cfg = window.MUDAMAS_SUPABASE;
  if (!cfg || !window.supabase) {
    status.textContent = 'Konfigurasi autentikasi belum tersedia.';
    status.className = 'admin-login-status error';
    return;
  }

  const client = window.supabase.createClient(cfg.url, cfg.publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  });

  const normalizeUsername = (value) => value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '');

  const usernameToEmail = (username) => `${normalizeUsername(username)}@${cfg.usernameDomain}`;

  toggle?.addEventListener('click', () => {
    const show = passwordInput.type === 'password';
    passwordInput.type = show ? 'text' : 'password';
    toggle.textContent = show ? '◌' : '◉';
    toggle.setAttribute('aria-label', show ? 'Sembunyikan password' : 'Tampilkan password');
  });

  // If an active session already exists, go straight to the dashboard.
  client.auth.getSession().then(({ data }) => {
    if (data?.session) window.location.replace('admin-dashboard.html');
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = normalizeUsername(form.username.value);
    const password = form.password.value;

    status.textContent = '';
    status.className = 'admin-login-status';

    if (!username || !password) {
      status.textContent = 'Username dan password wajib diisi.';
      status.classList.add('error');
      return;
    }

    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Memverifikasi...';

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: usernameToEmail(username),
        password
      });
      if (error) throw error;

      const { data: profile, error: profileError } = await client
        .from('profiles')
        .select('username, full_name, role, is_active')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile || profile.is_active !== true) {
        await client.auth.signOut();
        throw new Error('Akun admin tidak aktif atau profil belum disiapkan.');
      }

      status.textContent = 'Login berhasil. Membuka dashboard...';
      status.classList.add('success');
      window.location.replace('admin-dashboard.html');
    } catch (err) {
      status.textContent = err?.message === 'Invalid login credentials'
        ? 'Username atau password salah.'
        : (err?.message || 'Login gagal. Silakan coba lagi.');
      status.classList.add('error');
      submit.disabled = false;
      submit.textContent = 'Masuk ke Dashboard →';
    }
  });
})();
