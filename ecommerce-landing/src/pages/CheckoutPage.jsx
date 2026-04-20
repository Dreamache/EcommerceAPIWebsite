import { useState } from 'react';
import { Spinner } from '../components/ui/Spinner.jsx';
import { fmt } from '../utils/format.js';
import { orders as ordersApi } from '../api.js';

export function CheckoutPage({ cartData, setPage, onOrderPlaced }) {
  const [form, setForm] = useState({ payment_method: 'pix', shipping_street: '', shipping_number: '', shipping_complement: '', shipping_neighborhood: '', shipping_city: '', shipping_state: '', shipping_zip_code: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const items = cartData?.items || [];

  const handleOrder = async () => {
    setError(''); setLoading(true);
    try { const order = await ordersApi.create(form); onOrderPlaced(order); setPage(`order:${order.id}`); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#fafafa', minHeight: '80vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(20px,4vw,60px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="serif" style={{ fontSize: '1.2rem', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 8 }}>Gauge33</p>
          <p style={{ fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#767676' }}>Finalizar compra</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={{ fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 600 }}>Endereço de entrega</p>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <div><label className="label">Rua</label><input className="input" placeholder="Rua das Flores" value={form.shipping_street} onChange={set('shipping_street')} /></div>
              <div><label className="label">Número</label><input className="input" placeholder="100" value={form.shipping_number} onChange={set('shipping_number')} /></div>
            </div>
            <div><label className="label">Complemento (opcional)</label><input className="input" placeholder="Apto 42" value={form.shipping_complement} onChange={set('shipping_complement')} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label className="label">Bairro</label><input className="input" placeholder="Centro" value={form.shipping_neighborhood} onChange={set('shipping_neighborhood')} /></div>
              <div><label className="label">CEP</label><input className="input" placeholder="60000-000" value={form.shipping_zip_code} onChange={set('shipping_zip_code')} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <div><label className="label">Cidade</label><input className="input" placeholder="Fortaleza" value={form.shipping_city} onChange={set('shipping_city')} /></div>
              <div><label className="label">Estado</label><input className="input" placeholder="CE" maxLength={2} value={form.shipping_state} onChange={set('shipping_state')} /></div>
            </div>
            <div>
              <p style={{ fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>Pagamento</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[['pix','PIX — 5% de desconto'],['boleto','Boleto bancário'],['credit_card','Cartão de crédito']].map(([v,l]) => (
                  <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: form.payment_method === v ? '#f2f2f0' : '#fff', border: `1px solid ${form.payment_method === v ? '#0a0a0a' : '#e0e0e0'}`, cursor: 'pointer', transition: 'all .15s' }}>
                    <input type="radio" value={v} checked={form.payment_method === v} onChange={set('payment_method')} style={{ accentColor: '#0a0a0a' }} />
                    <span style={{ fontSize: '.82rem', fontWeight: form.payment_method === v ? 500 : 400 }}>{l}</span>
                  </label>
                ))}
              </div>
            </div>
            {error && <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca' }}><p style={{ fontSize: '.78rem', color: '#c0392b' }}>{error}</p></div>}
          </div>

          <div>
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', padding: 32, position: 'sticky', top: 80 }}>
              <p style={{ fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 24 }}>Resumo do pedido</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 56, height: 72, background: '#f2f2f0', flexShrink: 0, overflow: 'hidden' }}>
                      {item.product.main_image && <img src={item.product.main_image.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '.78rem', marginBottom: 2 }}>{item.product.name}</p>
                      <p style={{ fontSize: '.72rem', color: '#767676' }}>Qtd: {item.quantity}</p>
                    </div>
                    <span style={{ fontSize: '.78rem', fontWeight: 500, flexShrink: 0 }}>{fmt(item.line_total)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ fontSize: '.78rem', color: '#767676' }}>Subtotal</span><span style={{ fontSize: '.78rem' }}>{fmt(cartData?.subtotal || 0)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}><span style={{ fontSize: '.78rem', color: '#767676' }}>Entrega</span><span style={{ fontSize: '.78rem', color: '#16a34a' }}>Grátis</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #e0e0e0' }}><span style={{ fontSize: '.85rem', fontWeight: 600 }}>Total</span><span style={{ fontSize: '.95rem', fontWeight: 600 }}>{fmt(cartData?.subtotal || 0)}</span></div>
              </div>
              <button className="btn btn-primary btn-full" style={{ marginTop: 24, letterSpacing: '.12em' }} onClick={handleOrder} disabled={loading}>{loading ? <Spinner /> : 'Confirmar pedido'}</button>
              <p style={{ marginTop: 16, textAlign: 'center', fontSize: '.65rem', color: '#b0b0b0', letterSpacing: '.06em' }}>Compra 100% segura</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
