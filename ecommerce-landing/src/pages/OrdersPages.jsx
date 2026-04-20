import { useState, useEffect } from 'react';
import { Spinner } from '../components/ui/Spinner.jsx';
import { fmt, fmtDate, fmtDateShort } from '../utils/format.js';
import { orders as ordersApi } from '../api.js';

const STATUS_COLOR = { pending:'#767676',confirmed:'#16a34a',processing:'#16a34a',shipped:'#0284c7',delivered:'#16a34a',cancelled:'#c0392b',refunded:'#c0392b' };

export function OrderDetailPage({ orderId, setPage }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { ordersApi.detail(orderId).then(setOrder).catch(() => setOrder(null)).finally(() => setLoading(false)); }, [orderId]);

  const handleCancel = async () => {
    if (!confirm('Confirma o cancelamento?')) return;
    await ordersApi.cancel(order.id);
    setOrder(o => ({ ...o, status: 'cancelled', status_display: 'Cancelado', can_cancel: false }));
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spinner dark /></div>;
  if (!order) return <div style={{ textAlign: 'center', padding: '80px 20px', color: '#767676' }}>Pedido não encontrado.</div>;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(20px,4vw,60px)' }}>
      <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 28, marginBottom: 40 }}>
        <p style={{ fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#767676', marginBottom: 10 }}>Pedido {order.order_number}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span style={{ fontSize: '.72rem', fontWeight: 500, letterSpacing: '.06em', color: STATUS_COLOR[order.status] || '#767676', textTransform: 'uppercase' }}>{order.status_display}</span>
            <p style={{ fontSize: '.75rem', color: '#767676', marginTop: 6 }}>{fmtDate(order.created_at)}</p>
          </div>
          <p className="serif" style={{ fontSize: '1.6rem', fontWeight: 400 }}>{fmt(order.total)}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 40 }}>
        {[['Entrega', <p style={{ fontSize: '.82rem', color: '#767676', lineHeight: 1.6 }}>{order.shipping_address}</p>],
          ['Pagamento', <><p style={{ fontSize: '.82rem', color: '#767676' }}>{order.payment_method_display}</p>{order.tracking_code && <p style={{ fontSize: '.78rem', color: '#767676', marginTop: 8 }}>Rastreio: <strong style={{ color: '#0a0a0a' }}>{order.tracking_code}</strong></p>}</>]
        ].map(([title, content]) => (
          <div key={title} style={{ padding: 20, border: '1px solid #e0e0e0', borderRadius: 4 }}>
            <p style={{ fontSize: '.65rem', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#767676', marginBottom: 10 }}>{title}</p>
            {content}
          </div>
        ))}
      </div>

      <div style={{ border: '1px solid #e0e0e0', overflow: 'hidden', marginBottom: 24 }}>
        {order.items.map((item, i) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: i < order.items.length - 1 ? '1px solid #f2f2f0' : 'none' }}>
            <div>
              <p style={{ fontSize: '.875rem', fontWeight: 500 }}>{item.product_name}</p>
              <p style={{ fontSize: '.72rem', color: '#767676' }}>Ref. {item.product_sku} · {fmt(item.unit_price)} × {item.quantity}</p>
            </div>
            <span style={{ fontWeight: 600, fontSize: '.875rem' }}>{fmt(item.line_total)}</span>
          </div>
        ))}
        <div style={{ padding: '14px 20px', background: '#f2f2f0', display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}><span>Total</span><span>{fmt(order.total)}</span></div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-outline" onClick={() => setPage('orders')}>Meus pedidos</button>
        {order.can_cancel && <button className="btn btn-danger" onClick={handleCancel}>Cancelar pedido</button>}
      </div>
    </div>
  );
}

export function OrdersPage({ setPage }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { ordersApi.list().then(d => setList(d.results || d)).catch(() => setList([])).finally(() => setLoading(false)); }, []);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(20px,4vw,60px)' }}>
      <div style={{ marginBottom: 48 }}>
        <p style={{ fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase', color: '#767676', marginBottom: 10 }}>Gauge33</p>
        <h1 className="serif" style={{ fontSize: '2rem', fontWeight: 400 }}>Meus pedidos</h1>
      </div>
      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spinner dark /></div>
      : list.length === 0 ? <div style={{ textAlign: 'center', padding: '80px 0' }}><p className="serif" style={{ fontSize: '1.4rem', fontWeight: 400, color: '#767676', marginBottom: 32 }}>Nenhum pedido ainda.</p><button className="btn btn-primary" onClick={() => setPage('products')}>Descobrir a coleção</button></div>
      : <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {list.map((order, idx) => (
            <div key={order.id}>
              <button onClick={() => setPage(`order:${order.id}`)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '24px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 20 }}>
                <div>
                  <p style={{ fontSize: '.78rem', fontWeight: 500, marginBottom: 4 }}>{order.order_number}</p>
                  <p style={{ fontSize: '.72rem', color: '#767676' }}>{fmtDateShort(order.created_at)} · {order.items?.length} {order.items?.length === 1 ? 'peça' : 'peças'}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0 }}>
                  <span style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 500, color: STATUS_COLOR[order.status] || '#767676' }}>{order.status_display}</span>
                  <span style={{ fontSize: '.9rem', fontWeight: 500 }}>{fmt(order.total)}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#767676" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </button>
              {idx < list.length - 1 && <div style={{ height: 1, background: '#e0e0e0' }} />}
            </div>
          ))}
        </div>}
    </div>
  );
}
