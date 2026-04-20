export function Footer({ setPage }) {
  const nav = (page) => () => setPage(page);

  return (
    <footer style={{ background: '#0a0a0a', color: '#fff', padding: '80px clamp(20px,4vw,60px) 40px' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 48, marginBottom: 80 }}>
          <div>
            <button onClick={nav('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'EB Garamond', Georgia, serif", fontSize: '1.6rem', letterSpacing: '.2em', textTransform: 'uppercase', color: '#fff', marginBottom: 20, display: 'block', textAlign: 'left' }}>Gauge33</button>
            <p style={{ fontSize: '.78rem', color: '#767676', lineHeight: 1.7, maxWidth: 220 }}>Design contemporâneo. Materiais selecionados. Cada peça é uma declaração.</p>
          </div>

          <div>
            <p style={{ fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#767676', marginBottom: 20, fontWeight: 600 }}>Coleções</p>
            {[['Nova temporada','nova-temporada'],['Essenciais','essenciais'],['Alfaiataria','alfaiataria'],['Casual','casual'],['Acessórios','acessorios']].map(([l,p]) => <FooterLink key={l} label={l} onClick={nav(p)} />)}
          </div>

          <div>
            <p style={{ fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#767676', marginBottom: 20, fontWeight: 600 }}>Atendimento</p>
            {[['Como comprar','como-comprar'],['Entregas e prazos','entregas'],['Trocas e devoluções','trocas'],['Tabela de medidas','tabela-medidas'],['Fale conosco','fale-conosco']].map(([l,p]) => <FooterLink key={l} label={l} onClick={nav(p)} />)}
          </div>

          <div>
            <p style={{ fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#767676', marginBottom: 20, fontWeight: 600 }}>Gauge33</p>
            {[['Nossa história','nossa-historia'],['Sustentabilidade','sustentabilidade'],['Trabalhe conosco','trabalhe-conosco'],['Imprensa','imprensa']].map(([l,p]) => <FooterLink key={l} label={l} onClick={nav(p)} />)}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #222', paddingTop: 32, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: '.7rem', color: '#555', letterSpacing: '.06em' }}>© {new Date().getFullYear()} Gauge33. Todos os direitos reservados.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacidade','Termos','Cookies'].map(item => (
              <span key={item} style={{ fontSize: '.7rem', color: '#555', cursor: 'pointer', letterSpacing: '.06em', transition: 'color .15s' }} onMouseOver={e => e.target.style.color='#fff'} onMouseOut={e => e.target.style.color='#555'}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ label, onClick }) {
  return (
    <button onClick={onClick} style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.82rem', color: '#b0b0b0', marginBottom: 10, textAlign: 'left', padding: 0, transition: 'color .15s' }}
      onMouseOver={e => e.currentTarget.style.color='#fff'} onMouseOut={e => e.currentTarget.style.color='#b0b0b0'}
    >{label}</button>
  );
}
