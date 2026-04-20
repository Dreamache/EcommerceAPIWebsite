import { fmt } from '../utils/format.js';

export function ProductCard({ product, setPage }) {
  return (
    <div className="product-card" onClick={() => setPage(`product:${product.slug}`)}>
      <div className="product-card-img">
        {product.main_image
          ? <img src={product.main_image.image} alt={product.name} />
          : <div style={{ width: '100%', height: '100%', background: '#e8e8e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c0c0c0" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
        }
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {product.discount_percentage && <span className="badge badge-sale">-{product.discount_percentage}%</span>}
          {!product.is_available && <span className="badge" style={{ background: '#767676', color: '#fff' }}>Esgotado</span>}
        </div>
      </div>
      <div className="product-card-info">
        <p style={{ fontSize: '.8rem', fontWeight: 400, marginBottom: 4, lineHeight: 1.4, letterSpacing: '.01em' }}>{product.name}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '.8rem', fontWeight: 500 }}>{fmt(product.price)}</span>
          {product.compare_price && <span style={{ fontSize: '.75rem', color: '#b0b0b0', textDecoration: 'line-through' }}>{fmt(product.compare_price)}</span>}
        </div>
      </div>
    </div>
  );
}
