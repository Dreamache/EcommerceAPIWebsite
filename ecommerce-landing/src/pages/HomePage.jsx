import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard.jsx';
import { catalog } from '../api.js';

const HERO   = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&q=80&fit=crop';
const PANEL1 = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80&fit=crop';
const PANEL2 = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80&fit=crop';
const BANNER = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=80&fit=crop';

export function HomePage({ setPage }) {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    catalog.featured()
      .then(d => setFeatured(d.results || d))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── Hero com imagem de fundo ── */}
      <section style={{
        height: 'calc(100vh - 100px)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'flex-end',
        padding: 'clamp(32px,5vw,80px)',
      }}>
        <img src={HERO} alt="Gauge33 — Nova Coleção" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.15) 60%, transparent 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680 }}>
          <p style={{ fontSize: '.68rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.65)', marginBottom: 24, fontWeight: 500 }}>
            Nova temporada — 2025
          </p>
          <h1 className="serif" style={{ fontSize: 'clamp(3rem,8vw,7rem)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-.02em', color: '#fff', marginBottom: 40 }}>
            Cada peça,<br /><em>uma história.</em>
          </h1>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button className="btn btn-outline-white" onClick={() => setPage('products')}>Ver coleção</button>
            <button className="btn" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.3)' }} onClick={() => setPage('nova-temporada')}>Nova temporada</button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 40, right: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '.6rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', writingMode: 'vertical-rl' }}>Descer</span>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(255,255,255,.4), transparent)' }} />
        </div>
      </section>

      {/* ── Strip de benefícios ── */}
      <section style={{ background: '#f2f2f0', padding: '18px clamp(20px,4vw,60px)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 48, flexWrap: 'wrap', borderBottom: '1px solid #e0e0e0' }}>
        {['Entrega gratuita acima de R$ 299','Troca em 30 dias','Embalagem sustentável'].map(item => (
          <span key={item} style={{ fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#767676', fontWeight: 500 }}>{item}</span>
        ))}
      </section>

      {/* ── Destaques ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 40 }}>
            <h2 className="serif" style={{ fontSize: '2rem', fontWeight: 400, letterSpacing: '-.01em' }}>Destaques</h2>
            <button onClick={() => setPage('products')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#767676', textDecoration: 'underline', textUnderlineOffset: 3 }}>Ver tudo</button>
          </div>
          {loading ? <SkeletonGrid /> : featured.length === 0 ? <EmptyState setPage={setPage} /> : (
            <div className="grid-products-4">
              {featured.slice(0, 4).map(p => <ProductCard key={p.id} product={p} setPage={setPage} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Painéis editoriais com imagem ── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <EditorialPanel image={PANEL1} subtitle="Construção precisa" title="Alfaiataria" cta="Explorar" onClick={() => setPage('alfaiataria')} />
        <EditorialPanel image={PANEL2} subtitle="O guarda-roupa perfeito" title="Essenciais" cta="Descobrir" onClick={() => setPage('essenciais')} />
      </section>

      {/* ── Segunda grade ── */}
      {featured.length > 4 && (
        <section className="section">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 40 }}>
              <h2 className="serif" style={{ fontSize: '2rem', fontWeight: 400 }}>Nova temporada</h2>
              <button onClick={() => setPage('nova-temporada')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#767676', textDecoration: 'underline', textUnderlineOffset: 3 }}>Ver coleção</button>
            </div>
            <div className="grid-products-3">
              {featured.slice(4, 7).map(p => <ProductCard key={p.id} product={p} setPage={setPage} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Banner final com imagem ── */}
      <section style={{ position: 'relative', overflow: 'hidden', height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={BANNER} alt="Gauge33" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.52)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <p className="serif" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 400, color: '#fff', marginBottom: 32, letterSpacing: '-.01em' }}>Design que dura.</p>
          <button className="btn btn-outline-white btn-lg" onClick={() => setPage('products')}>Ver a coleção completa</button>
        </div>
      </section>
    </div>
  );
}

function EditorialPanel({ image, title, subtitle, cta, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', overflow: 'hidden', minHeight: 420, cursor: 'pointer', display: 'flex', alignItems: 'flex-end', padding: 'clamp(28px,4vw,56px)' }}>
      <img src={image} alt={title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s ease', transform: hovered ? 'scale(1.04)' : 'scale(1)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 60%)' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: '.65rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: 10 }}>{subtitle}</p>
        <h3 className="serif" style={{ fontSize: 'clamp(1.6rem,3vw,2.6rem)', fontWeight: 400, color: '#fff', marginBottom: 20 }}>{title}</h3>
        <span style={{ fontSize: '.7rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#fff', textDecoration: 'underline', textUnderlineOffset: 4 }}>{cta}</span>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid-products-4">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <div className="skeleton" style={{ aspectRatio: '3/4', marginBottom: 2 }} />
          <div className="skeleton" style={{ height: 13, width: '60%', marginBottom: 6 }} />
          <div className="skeleton" style={{ height: 13, width: '40%' }} />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ setPage }) {
  return (
    <div style={{ padding: '80px 0', textAlign: 'center' }}>
      <p className="serif" style={{ fontSize: '1.4rem', fontWeight: 400, color: '#767676', marginBottom: 24 }}>A coleção está sendo preparada.</p>
      <button className="btn btn-outline btn-sm" onClick={() => setPage('products')}>Ver todos os produtos</button>
    </div>
  );
}
