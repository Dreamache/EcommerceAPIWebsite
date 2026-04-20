import { useState, useEffect, useCallback } from 'react';
import { ProductCard } from '../components/ProductCard.jsx';
import { catalog } from '../api.js';

export function ProductsPage({ setPage }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [ordering, setOrdering] = useState('-created_at');

  useEffect(() => { catalog.categories().then(d => setCategories(d.results || d)).catch(() => {}); }, []);

  const load = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (activeCategory) p.set('category', activeCategory);
    p.set('ordering', ordering);
    catalog.products(`?${p.toString()}`).then(d => setProducts(d.results || [])).catch(() => setProducts([])).finally(() => setLoading(false));
  }, [activeCategory, ordering]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div style={{ padding: '48px clamp(20px,4vw,60px) 32px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
        <div>
          <p style={{ fontSize: '.65rem', letterSpacing: '.16em', textTransform: 'uppercase', color: '#767676', marginBottom: 8 }}>Gauge33</p>
          <h1 className="serif" style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 400, letterSpacing: '-.01em' }}>
            {activeCategory ? categories.find(c => c.slug === activeCategory)?.name || 'Coleção' : 'Coleção completa'}
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: '.72rem', color: '#767676' }}>{products.length} {products.length === 1 ? 'peça' : 'peças'}</span>
          <select value={ordering} onChange={e => setOrdering(e.target.value)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '.72rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#0a0a0a', appearance: 'none' }}>
            <option value="-created_at">Novidades</option>
            <option value="price">Menor preço</option>
            <option value="-price">Maior preço</option>
            <option value="name">A — Z</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        <aside style={{ width: 200, flexShrink: 0, padding: '32px 24px 32px clamp(20px,4vw,60px)', borderRight: '1px solid #e0e0e0', position: 'sticky', top: 60, height: 'fit-content' }} className="hide-mobile">
          <p style={{ fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 20 }}>Categorias</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FilterItem label="Todas" active={!activeCategory} onClick={() => setActiveCategory('')} />
            {categories.map(c => <FilterItem key={c.id} label={c.name} active={activeCategory === c.slug} onClick={() => setActiveCategory(activeCategory === c.slug ? '' : c.slug)} />)}
          </div>
        </aside>

        <main style={{ flex: 1, padding: '2px 0' }}>
          {loading ? <SkeletonGrid /> : products.length === 0 ? (
            <div style={{ padding: '80px 40px', textAlign: 'center' }}><p className="serif" style={{ fontSize: '1.4rem', fontWeight: 400, color: '#767676' }}>Nenhuma peça encontrada.</p></div>
          ) : (
            <div className="grid-products-3" style={{ gap: 2 }}>
              {products.map(p => <ProductCard key={p.id} product={p} setPage={setPage} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function FilterItem({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '6px 0', fontSize: '.78rem', color: active ? '#0a0a0a' : '#767676', fontWeight: active ? 500 : 400, borderBottom: active ? '1px solid #0a0a0a' : '1px solid transparent', transition: 'all .15s' }}>{label}</button>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid-products-3" style={{ gap: 2 }}>
      {[...Array(9)].map((_, i) => (
        <div key={i}>
          <div className="skeleton" style={{ aspectRatio: '3/4' }} />
          <div style={{ padding: '12px 16px 16px', background: '#fff' }}>
            <div className="skeleton" style={{ height: 12, width: '55%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 12, width: '30%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
