import { useState } from 'react';

const CATS = ['Início', 'Homem', 'Infantil', 'Mulher', 'Beauty', 'Travel'];

export function AnnouncementBar({ setPage }) {
  const [visible, setVisible] = useState(true);
  const [active, setActive] = useState('Início');

  if (!visible) return null;

  return (
    <div style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a', position: 'relative', zIndex: 600 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, padding: '0 48px', gap: 40, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {CATS.map(cat => (
          <button key={cat} onClick={() => { setActive(cat); setPage('products'); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '.65rem', fontWeight: active === cat ? 600 : 400, letterSpacing: '.14em', textTransform: 'uppercase', color: active === cat ? '#fff' : '#767676', transition: 'color .15s', whiteSpace: 'nowrap', paddingBottom: active === cat ? 2 : 0, borderBottom: active === cat ? '1px solid #fff' : '1px solid transparent' }}
          >{cat}</button>
        ))}
        <button onClick={() => setVisible(false)} aria-label="Fechar"
          style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '1rem', padding: 4, lineHeight: 1, transition: 'color .15s' }}
          onMouseOver={e => (e.currentTarget.style.color = '#fff')}
          onMouseOut={e => (e.currentTarget.style.color = '#555')}
        >×</button>
      </div>
    </div>
  );
}
