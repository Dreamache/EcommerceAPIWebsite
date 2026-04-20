export function InfoPageLayout({ heroImage, heroTitle, heroSubtitle, children }) {
  return (
    <div>
      {heroImage ? (
        <section style={{ position: 'relative', height: 420, overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: 'clamp(32px,5vw,80px)' }}>
          <img src={heroImage} alt={heroTitle} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.2) 60%, transparent 100%)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            {heroSubtitle && <p style={{ fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: 14 }}>{heroSubtitle}</p>}
            <h1 className="serif" style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1 }}>{heroTitle}</h1>
          </div>
        </section>
      ) : (
        <section style={{ background: '#0a0a0a', padding: 'clamp(60px,8vw,100px) clamp(20px,4vw,60px)' }}>
          {heroSubtitle && <p style={{ fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#767676', marginBottom: 16 }}>{heroSubtitle}</p>}
          <h1 className="serif" style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1 }}>{heroTitle}</h1>
        </section>
      )}
      <div>{children}</div>
    </div>
  );
}

export function InfoSection({ title, children, bg, style }) {
  return (
    <section style={{ background: bg || '#fff', padding: 'clamp(48px,6vw,80px) clamp(20px,4vw,60px)', ...style }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {title && <p style={{ fontSize: '.65rem', letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 32, color: '#767676' }}>{title}</p>}
        {children}
      </div>
    </section>
  );
}

export function InfoText({ children }) {
  return <p style={{ fontSize: '.9rem', color: '#767676', lineHeight: 1.9, marginBottom: 20 }}>{children}</p>;
}

export function InfoGrid({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2 }}>{children}</div>;
}

export function InfoCard({ title, text, bg = '#f2f2f0' }) {
  return (
    <div style={{ background: bg, padding: '36px 32px' }}>
      <p style={{ fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>{title}</p>
      <p style={{ fontSize: '.85rem', color: '#767676', lineHeight: 1.8 }}>{text}</p>
    </div>
  );
}
