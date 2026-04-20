import { useState } from 'react';
import { Spinner } from '../components/ui/Spinner.jsx';
import { auth } from '../api.js';

export function AuthPage({ mode: initialMode, setPage, onLogin }) {
  const [mode, setMode] = useState(initialMode || 'login');
  const [form, setForm] = useState({ email: '', password: '', password2: '', first_name: '', last_name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    try {
      if (mode === 'login') {
        const res = await auth.login({ email: form.email, password: form.password });
        onLogin(res); setPage('home');
      } else {
        const res = await auth.register({ username: `${form.email.split('@')[0]}_${Date.now()}`, email: form.email, first_name: form.first_name, last_name: form.last_name, password: form.password, password2: form.password2 });
        localStorage.setItem('access_token', res.tokens.access);
        localStorage.setItem('refresh_token', res.tokens.refresh);
        onLogin({ user: res.user }); setPage('home');
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: '#fafafa' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="serif" style={{ fontSize: '1.4rem', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 20 }}>Gauge33</p>
          <h1 style={{ fontSize: '1rem', fontWeight: 400, color: '#767676', letterSpacing: '.04em' }}>{mode === 'login' ? 'Acesse sua conta' : 'Criar conta'}</h1>
        </div>
        <div style={{ background: '#fff', padding: '48px 40px', border: '1px solid #e0e0e0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {mode === 'register' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><label className="label">Nome</label><input className="input input-borderless" placeholder="João" value={form.first_name} onChange={set('first_name')} /></div>
                <div><label className="label">Sobrenome</label><input className="input input-borderless" placeholder="Silva" value={form.last_name} onChange={set('last_name')} /></div>
              </div>
            )}
            <div><label className="label">E-mail</label><input className="input input-borderless" type="email" placeholder="joao@email.com" value={form.email} onChange={set('email')} onKeyDown={e => e.key === 'Enter' && handleSubmit()} /></div>
            <div><label className="label">Senha</label><input className="input input-borderless" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} onKeyDown={e => e.key === 'Enter' && handleSubmit()} /></div>
            {mode === 'register' && <div><label className="label">Confirmar senha</label><input className="input input-borderless" type="password" placeholder="••••••••" value={form.password2} onChange={set('password2')} /></div>}
            {error && <p style={{ fontSize: '.78rem', color: '#c0392b', padding: '10px 0', borderTop: '1px solid #f5c6c2' }}>{error}</p>}
            <button className="btn btn-primary btn-full" style={{ marginTop: 8, letterSpacing: '.12em' }} onClick={handleSubmit} disabled={loading}>
              {loading ? <Spinner /> : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '.78rem', color: '#767676' }}>
          {mode === 'login' ? 'Ainda não tem conta?' : 'Já tem conta?'}{' '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0a0a0a', fontWeight: 500, fontSize: '.78rem', textDecoration: 'underline', textUnderlineOffset: 2 }}>
            {mode === 'login' ? 'Cadastre-se' : 'Entrar'}
          </button>
        </p>
      </div>
    </div>
  );
}
