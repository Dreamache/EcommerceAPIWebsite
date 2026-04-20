import { useState, useEffect } from 'react';
import { Spinner } from '../components/ui/Spinner.jsx';
import { QtyControl } from '../components/ui/QtyControl.jsx';
import { fmt } from '../utils/format.js';
import { catalog } from '../api.js';

export function ProductDetailPage({ slug, setPage, onAddToCart }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
    setLoading(true);
    catalog.product(slug).then(setProduct).catch(() => setProduct(null)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><Spinner dark /></div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '120px 20px' }}><p className="serif" style={{ fontSize: '1.6rem', fontWeight: 400, color: '#767676', marginBottom: 32 }}>Peça não encontrada.</p><button className="btn btn-outline" onClick={() => setPage('products')}>Voltar para a coleção</button></div>;

  const images = product.images || [];
  const currentImg = images[imgIdx];

  const handleAdd = async () => { setAdding(true); await onAddToCart(product.id, qty); setAdding(false); };

  const accordionItems = [
    ['Descrição', product.description || product.short_description || 'Sem descrição disponível.'],
    ['Composição e cuidados', 'Consulte a etiqueta para informações de composição e instruções de lavagem específicas para esta peça.'],
    ['Entrega e devolução', 'Entrega gratuita para compras acima de R$ 299. Devolução ou troca em até 30 dias após o recebimento.'],
  ];

  return (
    <div>
      <div style={{ padding: '16px clamp(20px,4vw,60px)', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ display: 'flex', gap: 8, fontSize: '.68rem', letterSpacing: '.06em', color: '#767676' }}>
          <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#767676' }}>Início</button>
          <span>/</span>
          <button onClick={() => setPage('products')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#767676' }}>Coleção</button>
          <span>/</span>
          <span style={{ color: '#0a0a0a' }}>{product.name}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 0, minHeight: '80vh' }}>
        <div style={{ position: 'relative', background: '#f2f2f0' }}>
          <div style={{ aspectRatio: '3/4', overflow: 'hidden', position: 'sticky', top: 60 }}>
            {currentImg ? <img src={currentImg.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#b0b0b0' }}>Sem imagem</span></div>}
          </div>
          {images.length > 1 && (
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {images.map((img, i) => (
                <button key={img.id} onClick={() => setImgIdx(i)} style={{ width: 48, height: 60, padding: 0, border: 'none', outline: i === imgIdx ? '1px solid #0a0a0a' : '1px solid transparent', outlineOffset: 2, cursor: 'pointer', overflow: 'hidden', background: '#e8e8e6' }}>
                  <img src={img.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: 'clamp(32px,5vw,64px) clamp(24px,4vw,60px)', display: 'flex', flexDirection: 'column' }}>
          {product.categories?.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {product.categories.map(c => <span key={c.id} style={{ fontSize: '.62rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#767676' }}>{c.name}</span>)}
            </div>
          )}
          <h1 className="serif" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 400, letterSpacing: '-.01em', marginBottom: 20, lineHeight: 1.2 }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8 }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{fmt(product.price)}</span>
            {product.compare_price && <span style={{ fontSize: '.9rem', color: '#b0b0b0', textDecoration: 'line-through' }}>{fmt(product.compare_price)}</span>}
            {product.discount_percentage && <span className="badge badge-sale">{product.discount_percentage}% off</span>}
          </div>
          {product.short_description && <p style={{ fontSize: '.85rem', color: '#767676', lineHeight: 1.7, marginBottom: 32 }}>{product.short_description}</p>}

          {product.is_available ? (
            <div style={{ marginBottom: 32 }}>
              {product.stock > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
                  <span style={{ fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#767676' }}>Quantidade</span>
                  <QtyControl value={qty} max={product.stock} onChange={setQty} />
                  <span style={{ fontSize: '.7rem', color: '#b0b0b0' }}>{product.stock} disponíveis</span>
                </div>
              )}
              <button className="btn btn-primary btn-full btn-lg" onClick={handleAdd} disabled={adding} style={{ letterSpacing: '.12em' }}>
                {adding ? <div className="spinner" /> : 'Adicionar à sacola'}
              </button>
            </div>
          ) : (
            <div style={{ padding: '16px 20px', background: '#f2f2f0', marginBottom: 32 }}>
              <p style={{ fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#767676' }}>Peça esgotada</p>
            </div>
          )}

          <div style={{ borderTop: '1px solid #e0e0e0' }}>
            {accordionItems.map(([title, content]) => (
              <div key={title} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <button onClick={() => setOpenAccordion(openAccordion === title ? null : title)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 500 }}>{title}</span>
                  <span style={{ fontSize: '1.2rem', color: '#767676', lineHeight: 1, transform: openAccordion === title ? 'rotate(45deg)' : 'none', transition: 'transform .2s' }}>+</span>
                </button>
                {openAccordion === title && <p style={{ fontSize: '.82rem', color: '#767676', lineHeight: 1.8, paddingBottom: 20 }}>{content}</p>}
              </div>
            ))}
          </div>
          <p style={{ marginTop: 24, fontSize: '.65rem', color: '#b0b0b0', letterSpacing: '.06em' }}>Ref. {product.sku}</p>
        </div>
      </div>
    </div>
  );
}
