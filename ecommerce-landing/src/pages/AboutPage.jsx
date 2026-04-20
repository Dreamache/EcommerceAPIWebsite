const IMG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=80&fit=crop';

export function AboutPage() {
  return (
    <div>
      <section style={{ position: 'relative', height: 420, overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: 'clamp(32px,5vw,80px)' }}>
        <img src={IMG} alt="Gauge33" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.2) 60%, transparent 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: 14 }}>Gauge33</p>
          <h1 className="serif" style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1 }}>Vestir bem é um ato de respeito próprio.</h1>
        </div>
      </section>

      <section style={{ padding: 'clamp(60px,8vw,100px) clamp(20px,4vw,60px)' }}>
        <div style={{ maxWidth: 660, margin: '0 auto' }}>
          <p className="serif" style={{ fontSize: 'clamp(1.1rem,2vw,1.35rem)', fontWeight: 400, lineHeight: 1.8, marginBottom: 32 }}>
            Gauge33 nasceu da convicção de que roupas bem feitas não precisam de excesso. Cada coleção é projetada com precisão, usando materiais que duram e silhuetas que transcendem tendências.
          </p>
          <p style={{ fontSize: '.88rem', color: '#767676', lineHeight: 1.9 }}>
            Trabalhamos com ateliês selecionados e cadeias de produção transparentes. Do fio à embalagem, cada detalhe é pensado para minimizar o impacto e maximizar a durabilidade.
          </p>
        </div>
      </section>

      <section style={{ background: '#f2f2f0', padding: 'clamp(60px,8vw,100px) clamp(20px,4vw,60px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: '.65rem', letterSpacing: '.16em', textTransform: 'uppercase', color: '#767676', marginBottom: 48, textAlign: 'center' }}>Nossos pilares</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2 }}>
            {[
              ['Qualidade','Tecidos certificados, costuras reforçadas, acabamentos que resistem ao tempo e ao uso diário.'],
              ['Simplicidade','Design sem ornamentos desnecessários. O foco é na forma, no caimento e na função de cada peça.'],
              ['Responsabilidade','Produção local, embalagens biodegradáveis e relações justas em toda a cadeia produtiva.'],
              ['Atemporalidade','Coleções que não envelhecem em uma estação. Investimento em estilo, não em moda.'],
            ].map(([title, desc]) => (
              <div key={title} style={{ background: '#fff', padding: '40px 32px' }}>
                <p style={{ fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>{title}</p>
                <p style={{ fontSize: '.82rem', color: '#767676', lineHeight: 1.8 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
