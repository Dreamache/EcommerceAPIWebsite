import { useState } from 'react';

export function Navbar({ page, setPage, user, cartCount, onCartOpen, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [['home','Início'],['products','Coleção'],['about','Marca']];
  const isActive = (p) => page === p || (p === 'products' && page.startsWith('product'));

  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 500, background: '#fff', borderBottom: '1px solid #e0e0e0', height: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: '100%', padding: '0 clamp(20px,4vw,60px)' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <button onClick={() => setMenuOpen(true)} aria-label="Menu" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: 5, padding: 4 }} className="show-mobile">
              {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 22, height: 1, background: '#0a0a0a' }} />)}
            </button>
            <nav className="hide-mobile" style={{ display: 'flex', gap: 28 }}>
              {navItems.map(([p, label]) => (
                <button key={p} className={`nav-link${isActive(p) ? ' active' : ''}`} onClick={() => setPage(p)}>{label}</button>
              ))}
            </nav>
          </div>

          <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'EB Garamond', Georgia, serif", fontSize: '1.45rem', fontWeight: 400, letterSpacing: '.22em', textTransform: 'uppercase', color: '#0a0a0a' }}>
            Gauge33
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 24 }}>
            <div className="hide-mobile" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              {user ? (
                <><button className="nav-link" onClick={() => setPage('orders')}>Pedidos</button><button className="nav-link" onClick={onLogout}>Sair</button></>
              ) : (
                <button className="nav-link" onClick={() => setPage('login')}>Entrar</button>
              )}
            </div>
            <button onClick={onCartOpen} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }} aria-label="Sacola">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.25">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && <span style={{ position: 'absolute', top: -3, right: -6, background: '#0a0a0a', color: '#fff', width: 16, height: 16, borderRadius: '50%', fontSize: '.55rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount > 9 ? '9+' : cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 590, background: 'rgba(0,0,0,.3)' }} />
          <nav style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 600, width: 280, background: '#fff', display: 'flex', flexDirection: 'column', padding: '60px 32px 32px', gap: 28 }}>
            <button onClick={() => setMenuOpen(false)} style={{ position: 'absolute', top: 18, right: 20, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#767676' }}>×</button>
            {navItems.map(([p, label]) => (
              <button key={p} onClick={() => { setPage(p); setMenuOpen(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'EB Garamond', Georgia, serif", fontSize: '1.6rem', fontWeight: 400, color: '#0a0a0a', textAlign: 'left' }}>{label}</button>
            ))}
            <div style={{ height: 1, background: '#e0e0e0' }} />
            {user ? (
              <><button onClick={() => { setPage('orders'); setMenuOpen(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '.72rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#767676', textAlign: 'left' }}>Meus Pedidos</button>
              <button onClick={() => { onLogout(); setMenuOpen(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '.72rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#767676', textAlign: 'left' }}>Sair</button></>
            ) : (
              <button onClick={() => { setPage('login'); setMenuOpen(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '.72rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#767676', textAlign: 'left' }}>Entrar</button>
            )}
          </nav>
        </>
      )}
    </>
  );
}
