(() => {
  const form = document.getElementById('adminLoginForm');
  const status = document.getElementById('adminLoginStatus');
  const passwordInput = document.getElementById('adminPassword');
  const toggle = document.getElementById('toggleAdminPassword');
  const submit = form?.querySelector('button[type="submit"]');
  const sb = window.mudamasSupabase;

  function show(message, type = '') {
    if (!status) return;
    status.textContent = message;
    status.className = 'admin-login-status' + (type ? ' ' + type : '');
  }

  toggle?.addEventListener('click', () => {
    const hidden = passwordInput.type === 'password';
    passwordInput.type = hidden ? 'text' : 'password';
    toggle.setAttribute('aria-label', hidden ? 'Sembunyikan password' : 'Tampilkan password');
  });

  async function redirectIfLoggedIn() {
    if (!sb) return;
    const { data } = await sb.auth.getSession();
    if (data?.session) location.href = 'admin-dashboard.html';
  }
  redirectIfLoggedIn();

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!sb) { show('Konfigurasi Supabase tidak termuat.', 'error'); return; }

    const fd = new FormData(form);
    const username = String(fd.get('username') || '').trim().toLowerCase();
    const password = String(fd.get('password') || '');

    if (!username || !password) { show('Masukkan username dan password.', 'error'); return; }
    if (!/^[a-z0-9._-]+$/.test(username)) { show('Format username tidak valid.', 'error'); return; }

    const email = `${username}@admin.mudamas.local`;
    submit.disabled = true;
    submit.textContent = 'Memverifikasi...';
    show('Memeriksa akun administrator...');

    try {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const user = data.user;
      const { data: profile, error: profileError } = await sb
        .from('profiles')
        .select('id, username, full_name, role, is_active')
        .eq('id', user.id)
        .single();

      if (profileError) {
        await sb.auth.signOut();
        throw new Error('Akun Auth ditemukan, tetapi profil admin belum tersedia. Pastikan tabel profiles dan trigger sudah dibuat.');
      }
      if (!profile.is_active) {
        await sb.auth.signOut();
        throw new Error('Akun administrator sedang dinonaktifkan.');
      }
      if (profile.username !== username) {
        await sb.auth.signOut();
        throw new Error('Username tidak cocok dengan profil administrator.');
      }

      show('Login berhasil. Membuka dashboard...', 'success');
      location.href = 'admin-dashboard.html';
    } catch (err) {
      let msg = err?.message || 'Login gagal.';
      if (/invalid login credentials/i.test(msg)) msg = 'Username atau password salah. Pastikan user admin@admin.mudamas.local sudah dibuat di Supabase Authentication.';
      if (/email not confirmed/i.test(msg)) msg = 'Akun belum dikonfirmasi. Buka Supabase → Authentication → Users lalu pastikan email admin sudah Confirmed.';
      show(msg, 'error');
      submit.disabled = false;
      submit.textContent = 'Masuk ke Dashboard →';
    }
  });
})();
