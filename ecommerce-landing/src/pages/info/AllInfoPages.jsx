import { useState } from 'react';
import { InfoPageLayout, InfoSection, InfoText, InfoGrid, InfoCard } from '../../components/InfoPageLayout.jsx';

// ── Nova Temporada ──────────────────────────────────────────────────────────
export function NovaTemporadaPage({ setPage }) {
  return (
    <InfoPageLayout heroImage="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&q=80&fit=crop" heroSubtitle="Gauge33 — 2025" heroTitle="Nova Temporada">
      <InfoSection>
        <InfoText>A nova coleção da Gauge33 nasce de uma pesquisa cuidadosa sobre silhuetas contemporâneas e a relação entre o corpo e o tecido. Cada peça foi desenvolvida para durar além de uma estação — tanto em qualidade quanto em estilo.</InfoText>
        <InfoText>Exploramos volumes suaves, paletas neutras com toques de contraste e materiais que melhoram com o uso. O resultado é uma coleção íntima, pensada para quem prefere menos barulho e mais presença.</InfoText>
      </InfoSection>
      <InfoSection bg="#f2f2f0" title="Destaques da estação">
        <InfoGrid>{[['Alfaiataria revisitada','Blazers e calças com construção precisa, agora em modelagens levemente sobredimensionadas.'],['Malhas naturais','Lã merino, algodão egípcio e linho estruturado em formas que equilibram conforto e rigor.'],['Acessórios essenciais','Cintos, lenços e bolsas desenhados para completar sem disputar atenção com a roupa.']].map(([t,d]) => <InfoCard key={t} title={t} text={d} />)}</InfoGrid>
      </InfoSection>
      <InfoSection><div style={{ textAlign: 'center' }}><p className="serif" style={{ fontSize: 'clamp(1.4rem,3vw,2.2rem)', fontWeight: 400, marginBottom: 32 }}>Conheça a coleção completa.</p><button className="btn btn-primary btn-lg" onClick={() => setPage('products')}>Ver produtos</button></div></InfoSection>
    </InfoPageLayout>
  );
}

// ── Essenciais ──────────────────────────────────────────────────────────────
export function EssenciaisPage({ setPage }) {
  return (
    <InfoPageLayout heroImage="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800&q=80&fit=crop" heroSubtitle="Gauge33 — Sempre em coleção" heroTitle="Essenciais">
      <InfoSection>
        <InfoText>Os Essenciais da Gauge33 são peças que existem fora do calendário de moda. T-shirts de algodão compacto, calças de corte reto, moletons pesados e básicos de malha que você vai usar por anos.</InfoText>
        <InfoText>Construídos com materiais de alto desempenho e tingimentos que resistem à lavagem, são a base de qualquer combinação. Simples de propósito, precisos na execução.</InfoText>
      </InfoSection>
      <InfoSection bg="#f2f2f0" title="Por que Essenciais?">
        <InfoGrid>{[['Permanência','Não seguem tendências de estação. São peças de guarda-roupa que você compra uma vez e mantém.'],['Qualidade consistente','Mesmos fornecedores, mesmos processos. Cada reposição é fiel ao original.'],['Versatilidade real','Funcionam sozinhos ou como base para qualquer coleção da Gauge33.'],['Custo por uso','Preço maior no momento da compra, mas o menor custo por uso ao longo do tempo.']].map(([t,d]) => <InfoCard key={t} title={t} text={d} />)}</InfoGrid>
      </InfoSection>
      <InfoSection><div style={{ textAlign: 'center' }}><p className="serif" style={{ fontSize: 'clamp(1.4rem,3vw,2.2rem)', fontWeight: 400, marginBottom: 32 }}>O guarda-roupa começa aqui.</p><button className="btn btn-primary btn-lg" onClick={() => setPage('products')}>Comprar Essenciais</button></div></InfoSection>
    </InfoPageLayout>
  );
}

// ── Alfaiataria ─────────────────────────────────────────────────────────────
export function AlfaiatariaPage({ setPage }) {
  return (
    <InfoPageLayout heroImage="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1800&q=80&fit=crop" heroSubtitle="Gauge33 — Construção e forma" heroTitle="Alfaiataria">
      <InfoSection>
        <InfoText>A linha de alfaiataria da Gauge33 é produzida em ateliês selecionados com décadas de experiência em construção estruturada. Cada peça passa por mais de 40 etapas manuais antes de chegar ao cliente.</InfoText>
      </InfoSection>
      <InfoSection bg="#f2f2f0" title="Processo">
        <InfoGrid>{[['Tecidos selecionados','Lã Super 120s, tweed irlandês, flanela inglesa e gabardine italiano.'],['Construção full canvas','Entretela em crina de cavalo costurada à mão garante que o blazer se molde ao corpo ao longo do tempo.'],['Acabamento manual','Casas de botão, bainhas e bordas finalizadas à mão por artesãos com mais de 20 anos de experiência.'],['Durabilidade garantida','Com cuidados básicos, nossas peças de alfaiataria duram décadas sem perder forma.']].map(([t,d]) => <InfoCard key={t} title={t} text={d} />)}</InfoGrid>
      </InfoSection>
      <InfoSection><div style={{ textAlign: 'center' }}><p className="serif" style={{ fontSize: 'clamp(1.4rem,3vw,2.2rem)', fontWeight: 400, marginBottom: 32 }}>A roupa que fica.</p><button className="btn btn-primary btn-lg" onClick={() => setPage('products')}>Ver alfaiataria</button></div></InfoSection>
    </InfoPageLayout>
  );
}

// ── Casual ──────────────────────────────────────────────────────────────────
export function CasualPage({ setPage }) {
  return (
    <InfoPageLayout heroImage="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=80&fit=crop" heroSubtitle="Gauge33 — Para o dia a dia" heroTitle="Casual">
      <InfoSection>
        <InfoText>A linha Casual da Gauge33 parte de uma premissa simples: roupas do dia a dia não precisam abrir mão de qualidade ou design. Peças que funcionam do café da manhã à reunião.</InfoText>
      </InfoSection>
      <InfoSection bg="#f2f2f0" title="O que você encontra">
        <InfoGrid>{[['Denim premium','Jeans japonês selvagem e denim europeu tratado em cortes que respeitam a anatomia.'],['Camisas e camisetas','Algodão compacto de fio 30/1 e Oxford duplo, peças que mantêm forma após dezenas de lavagens.'],['Calças estruturadas','Sarja, twill e algodão com percentual de elastano no ponto certo.']].map(([t,d]) => <InfoCard key={t} title={t} text={d} />)}</InfoGrid>
      </InfoSection>
      <InfoSection><div style={{ textAlign: 'center' }}><p className="serif" style={{ fontSize: 'clamp(1.4rem,3vw,2.2rem)', fontWeight: 400, marginBottom: 32 }}>Casual não é sinônimo de descuido.</p><button className="btn btn-primary btn-lg" onClick={() => setPage('products')}>Ver linha Casual</button></div></InfoSection>
    </InfoPageLayout>
  );
}

// ── Acessórios ──────────────────────────────────────────────────────────────
export function AcessoriosPage({ setPage }) {
  return (
    <InfoPageLayout heroImage="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1800&q=80&fit=crop" heroSubtitle="Gauge33 — Os detalhes que definem" heroTitle="Acessórios">
      <InfoSection>
        <InfoText>Os acessórios da Gauge33 não são adereços — são peças funcionais com design próprio. Bolsas em couro curtido a vegetal, cintos, lenços em seda natural e carteiras de couro pleno.</InfoText>
      </InfoSection>
      <InfoSection bg="#f2f2f0" title="Categorias">
        <InfoGrid>{[['Bolsas','Couro curtido a vegetal em formatos práticos com hardware fundido em latão.'],['Cintos','Couro pleno 4mm de espessura, fivelas em aço inox ou latão, costura dupla visível.'],['Lenços','Seda natural 100% em estampas desenhadas exclusivamente para a Gauge33.'],['Carteiras','Couro natural sem revestimento — quanto mais você usa, melhor fica a pátina.']].map(([t,d]) => <InfoCard key={t} title={t} text={d} />)}</InfoGrid>
      </InfoSection>
      <InfoSection><div style={{ textAlign: 'center' }}><p className="serif" style={{ fontSize: 'clamp(1.4rem,3vw,2.2rem)', fontWeight: 400, marginBottom: 32 }}>Os detalhes que completam.</p><button className="btn btn-primary btn-lg" onClick={() => setPage('products')}>Ver acessórios</button></div></InfoSection>
    </InfoPageLayout>
  );
}

// ── Como comprar ────────────────────────────────────────────────────────────
export function ComoComprarPage({ setPage }) {
  const steps = [['1. Escolha suas peças','Navegue pela coleção, filtre por categoria. Cada produto tem descrição detalhada de materiais e tabela de medidas.'],['2. Adicione à sacola','Selecione tamanho e quantidade e clique em "Adicionar à sacola". Você pode continuar comprando antes de finalizar.'],['3. Cadastro ou login','Crie uma conta com e-mail e senha. Seus dados de entrega ficam salvos para as próximas compras.'],['4. Informe o endereço','No checkout, confirme ou atualize seu endereço de entrega.'],['5. Forma de pagamento','Aceitamos PIX (com 5% de desconto), boleto bancário e cartão de crédito em até 12 vezes sem juros.'],['6. Confirme o pedido','Revise o resumo e confirme. Você receberá um e-mail de confirmação com o número do pedido.']];
  return (
    <InfoPageLayout heroSubtitle="Gauge33 — Atendimento" heroTitle="Como comprar">
      <InfoSection><InfoText>Comprar na Gauge33 é direto e seguro. Veja o passo a passo completo abaixo.</InfoText></InfoSection>
      <InfoSection bg="#f2f2f0" title="Passo a passo">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {steps.map(([title, desc]) => (
            <div key={title} style={{ background: '#fff', padding: '24px 28px', display: 'flex', gap: 24 }}>
              <p style={{ fontSize: '.65rem', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{title.split('.')[0]}.</p>
              <div><p style={{ fontSize: '.82rem', fontWeight: 500, marginBottom: 6 }}>{title.split('. ')[1]}</p><p style={{ fontSize: '.8rem', color: '#767676', lineHeight: 1.8 }}>{desc}</p></div>
            </div>
          ))}
        </div>
      </InfoSection>
      <InfoSection><div style={{ textAlign: 'center' }}><button className="btn btn-primary btn-lg" onClick={() => setPage('products')}>Ir para a loja</button></div></InfoSection>
    </InfoPageLayout>
  );
}

// ── Entregas ────────────────────────────────────────────────────────────────
export function EntregasPage() {
  return (
    <InfoPageLayout heroSubtitle="Gauge33 — Atendimento" heroTitle="Entregas e prazos">
      <InfoSection><InfoText>Trabalhamos com transportadoras selecionadas para garantir que suas peças cheguem com segurança e dentro do prazo. Todo pedido é embalado com cuidado e rastreável a partir da expedição.</InfoText></InfoSection>
      <InfoSection bg="#f2f2f0" title="Modalidades">
        <InfoGrid>{[['Entrega padrão','5 a 10 dias úteis após confirmação do pagamento. Gratuita para pedidos acima de R$ 299.'],['Entrega expressa','2 a 3 dias úteis. Disponível para capitais e regiões metropolitanas.'],['Retirada em loja','Disponível nas lojas físicas Gauge33. Prazo: 1 dia útil após separação do pedido.']].map(([t,d]) => <InfoCard key={t} title={t} text={d} />)}</InfoGrid>
      </InfoSection>
    </InfoPageLayout>
  );
}

// ── Trocas ──────────────────────────────────────────────────────────────────
export function TrocasPage() {
  return (
    <InfoPageLayout heroSubtitle="Gauge33 — Atendimento" heroTitle="Trocas e devoluções">
      <InfoSection><InfoText>Você tem 30 dias corridos a partir do recebimento para solicitar troca ou devolução, sem necessidade de justificativa.</InfoText></InfoSection>
      <InfoSection bg="#f2f2f0" title="Como funciona">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[['1. Solicite pelo site','Acesse "Meus pedidos", selecione o pedido e clique em "Solicitar troca ou devolução".'],['2. Embale o produto','Reembale a peça na embalagem original ou em qualquer embalagem segura. Inclua o código de solicitação.'],['3. Aguarde a coleta','Nossa transportadora entrará em contato em até 2 dias úteis para agendar a coleta, sem custo.'],['4. Reembolso ou troca','Após recebermos e inspecionarmos a peça, processamos em até 5 dias úteis.']].map(([title, text]) => (
            <div key={title} style={{ background: '#fff', padding: '24px 28px', display: 'flex', gap: 24 }}>
              <p style={{ fontSize: '.65rem', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{title.split('.')[0]}.</p>
              <div><p style={{ fontSize: '.82rem', fontWeight: 500, marginBottom: 6 }}>{title.split('. ')[1]}</p><p style={{ fontSize: '.8rem', color: '#767676', lineHeight: 1.8 }}>{text}</p></div>
            </div>
          ))}
        </div>
      </InfoSection>
    </InfoPageLayout>
  );
}

// ── Tabela de medidas ───────────────────────────────────────────────────────
const TH = ({ c }) => <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 600, borderBottom: '1px solid #0a0a0a' }}>{c}</th>;
const TD = ({ c }) => <td style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0', color: '#767676', fontSize: '.8rem' }}>{c}</td>;

export function TabelaMedidasPage() {
  return (
    <InfoPageLayout heroSubtitle="Gauge33 — Atendimento" heroTitle="Tabela de medidas">
      <InfoSection><InfoText>Use as tabelas abaixo para encontrar o tamanho ideal. As medidas são do corpo, não da peça. Em caso de dúvida entre dois tamanhos, recomendamos optar pelo maior para alfaiataria e pelo menor para básicos e malhas.</InfoText></InfoSection>
      <InfoSection bg="#f2f2f0" title="Feminino">
        <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Tamanho','Peito (cm)','Cintura (cm)','Quadril (cm)'].map(h => <TH key={h} c={h} />)}</tr></thead>
          <tbody>{[['PP / XS','80–84','62–66','88–92'],['P / S','84–88','66–70','92–96'],['M','88–92','70–74','96–100'],['G / L','92–96','74–78','100–104'],['GG / XL','96–102','78–84','104–110']].map(r => <tr key={r[0]}>{r.map((c,i) => <TD key={i} c={c} />)}</tr>)}</tbody>
        </table></div>
      </InfoSection>
      <InfoSection title="Masculino">
        <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Tamanho','Peito (cm)','Cintura (cm)','Quadril (cm)'].map(h => <TH key={h} c={h} />)}</tr></thead>
          <tbody>{[['PP / XS','86–90','72–76','88–92'],['P / S','90–94','76–80','92–96'],['M','94–98','80–84','96–100'],['G / L','98–104','84–90','100–106'],['GG / XL','104–110','90–96','106–112']].map(r => <tr key={r[0]}>{r.map((c,i) => <TD key={i} c={c} />)}</tr>)}</tbody>
        </table></div>
      </InfoSection>
    </InfoPageLayout>
  );
}

// ── Fale conosco ────────────────────────────────────────────────────────────
export function FaleConoscoPage() {
  const [form, setForm] = useState({ name:'',email:'',subject:'',message:'' });
  const [sent, setSent] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <InfoPageLayout heroSubtitle="Gauge33 — Atendimento" heroTitle="Fale conosco">
      <InfoSection><InfoText>Nossa equipe está disponível de segunda a sexta, das 9h às 18h. Respondemos todas as mensagens em até 1 dia útil.</InfoText></InfoSection>
      <InfoSection bg="#f2f2f0" title="Canais de atendimento">
        <InfoGrid>{[['E-mail','atendimento@gauge33.com — respondemos em até 1 dia útil.'],['WhatsApp','(11) 9 9999-9999 — seg a sex, 9h às 18h.'],['Chat no site','Disponível no rodapé durante o horário comercial.']].map(([t,d]) => <InfoCard key={t} title={t} text={d} />)}</InfoGrid>
      </InfoSection>
      <InfoSection title="Envie uma mensagem">
        {sent ? <div style={{ textAlign: 'center', padding: '48px 0' }}><p className="serif" style={{ fontSize: '1.4rem', fontWeight: 400, marginBottom: 16 }}>Mensagem enviada.</p><p style={{ fontSize: '.85rem', color: '#767676' }}>Nossa equipe responderá em até 1 dia útil.</p></div>
        : <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><label className="label">Nome</label><input className="input" placeholder="Seu nome" value={form.name} onChange={set('name')} /></div>
              <div><label className="label">E-mail</label><input className="input" type="email" placeholder="seu@email.com" value={form.email} onChange={set('email')} /></div>
            </div>
            <div><label className="label">Assunto</label><select className="input" value={form.subject} onChange={set('subject')} style={{ cursor: 'pointer' }}><option value="">Selecione um assunto</option><option value="pedido">Dúvida sobre pedido</option><option value="troca">Troca ou devolução</option><option value="produto">Informações sobre produto</option><option value="tamanho">Dúvida sobre tamanho</option><option value="outro">Outro</option></select></div>
            <div><label className="label">Mensagem</label><textarea className="input" placeholder="Descreva sua dúvida..." rows={5} value={form.message} onChange={set('message')} style={{ height: 'auto', resize: 'vertical', padding: '12px 16px' }} /></div>
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => setSent(true)}>Enviar mensagem</button>
          </div>}
      </InfoSection>
    </InfoPageLayout>
  );
}

// ── Nossa história ──────────────────────────────────────────────────────────
export function NossaHistoriaPage() {
  return (
    <InfoPageLayout heroImage="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=80&fit=crop" heroSubtitle="Gauge33" heroTitle="Nossa história">
      <InfoSection>
        <InfoText>A Gauge33 nasceu em 2018 a partir de uma frustração simples: era difícil encontrar roupas bem feitas que não dependessem de logotipos visíveis ou tendências de estação para justificar seu preço.</InfoText>
        <InfoText>O nome vem do "gauge" — a medida de espessura de fios e tecidos. O número 33 é a densidade de fios por centímetro que consideramos o ponto de equilíbrio entre toque, resistência e aparência visual.</InfoText>
      </InfoSection>
      <InfoSection bg="#f2f2f0" title="Nossos princípios">
        <InfoGrid>{[['Especificação antes de estética','Todo projeto começa pela definição do tecido, do fio e do acabamento — não pelo visual.'],['Produção local','Mais de 90% das nossas peças são produzidas no Brasil.'],['Sem coleções descartáveis','Não lançamos por sazonalidade. Lançamos quando uma peça está pronta.'],['Transparência de produto','Toda peça tem ficha técnica com composição, fornecedores e instruções de cuidado.']].map(([t,d]) => <InfoCard key={t} title={t} text={d} />)}</InfoGrid>
      </InfoSection>
    </InfoPageLayout>
  );
}

// ── Sustentabilidade ────────────────────────────────────────────────────────
export function SustentabilidadePage() {
  return (
    <InfoPageLayout heroImage="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1800&q=80&fit=crop" heroSubtitle="Gauge33" heroTitle="Sustentabilidade">
      <InfoSection>
        <InfoText>Sustentabilidade na Gauge33 não é marketing — é uma restrição de projeto. Nossa abordagem é sobre durabilidade antes de certificações. Uma peça que dura 10 anos tem impacto ambiental muito menor do que uma "sustentável" que dura 2 lavagens.</InfoText>
      </InfoSection>
      <InfoSection bg="#f2f2f0" title="O que fazemos">
        <InfoGrid>{[['Matérias-primas rastreadas','Lã com certificação RWS, algodão orgânico GOTS e linho europeu sem agrotóxicos.'],['Embalagens biodegradáveis','Papel reciclado, sacolas de amido de milho e caixas FSC. Eliminamos plástico em 2022.'],['Produção sob demanda','Produzimos em lotes menores e repomos conforme a demanda. Nunca descartamos sobras.'],['Reparos gratuitos','Toda peça Gauge33 tem garantia vitalícia de reparos básicos sem custo ao cliente.']].map(([t,d]) => <InfoCard key={t} title={t} text={d} />)}</InfoGrid>
      </InfoSection>
    </InfoPageLayout>
  );
}

// ── Trabalhe conosco ────────────────────────────────────────────────────────
export function TrabalheConoscoPage() {
  return (
    <InfoPageLayout heroImage="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1800&q=80&fit=crop" heroSubtitle="Gauge33" heroTitle="Trabalhe conosco">
      <InfoSection><InfoText>A Gauge33 é uma empresa pequena por escolha. Trabalhamos com uma equipe enxuta de pessoas que têm autonomia real sobre seu trabalho.</InfoText></InfoSection>
      <InfoSection bg="#f2f2f0" title="Vagas abertas">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[['Designer de produto — Alfaiataria','São Paulo, SP — Híbrido'],['Desenvolvedor(a) full-stack','Remoto — Brasil'],['Especialista em fotografia de moda','São Paulo, SP — Presencial'],['Analista de operações e logística','São Paulo, SP — Híbrido']].map(([role, location]) => (
            <div key={role} style={{ background: '#fff', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div><p style={{ fontSize: '.85rem', fontWeight: 500, marginBottom: 4 }}>{role}</p><p style={{ fontSize: '.72rem', color: '#767676' }}>{location}</p></div>
              <button className="btn btn-outline btn-sm">Ver vaga</button>
            </div>
          ))}
        </div>
      </InfoSection>
      <InfoSection><InfoText>Não encontrou uma vaga adequada? Envie seu portfólio para <strong>vagas@gauge33.com</strong>. Guardamos currículos por 6 meses.</InfoText></InfoSection>
    </InfoPageLayout>
  );
}

// ── Imprensa ────────────────────────────────────────────────────────────────
export function ImprensaPage() {
  return (
    <InfoPageLayout heroImage="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1800&q=80&fit=crop" heroSubtitle="Gauge33" heroTitle="Imprensa">
      <InfoSection><InfoText>Para solicitações de imprensa, amostras, entrevistas ou parcerias editoriais, entre em contato: <strong>press@gauge33.com</strong>. Respondemos em até 2 dias úteis.</InfoText></InfoSection>
      <InfoSection bg="#f2f2f0" title="Press kit">
        <InfoGrid>{[['Marca e identidade visual','Logotipos em SVG e PNG, paleta de cores e tipografia oficial. Disponível mediante solicitação.'],['Lookbook da temporada','Imagens de alta resolução para uso editorial. Crédito obrigatório: Gauge33.'],['Ficha da empresa','Histórico, dados de fundação, número de colaboradores e informações institucionais.']].map(([t,d]) => <InfoCard key={t} title={t} text={d} />)}</InfoGrid>
      </InfoSection>
      <InfoSection title="Menções recentes">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[['Vogue Brasil','"A Gauge33 entende que minimalismo não é ausência de design — é presença de intenção."','Março 2025'],['Folha de São Paulo','"A marca paulistana que apostou na transparência de processo como diferencial competitivo."','Janeiro 2025'],['GQ Brasil','"10 marcas brasileiras que você deveria conhecer em 2025."','Dezembro 2024']].map(([pub,quote,date]) => (
            <div key={pub} style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><p style={{ fontSize: '.72rem', fontWeight: 600 }}>{pub}</p><p style={{ fontSize: '.7rem', color: '#b0b0b0' }}>{date}</p></div>
              <p className="serif" style={{ fontSize: '1rem', fontWeight: 400, color: '#767676', fontStyle: 'italic', lineHeight: 1.6 }}>{quote}</p>
            </div>
          ))}
        </div>
      </InfoSection>
    </InfoPageLayout>
  );
}
