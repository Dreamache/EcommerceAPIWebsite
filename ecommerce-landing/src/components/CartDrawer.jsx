import { Spinner } from './ui/Spinner.jsx';
import { QtyControl } from './ui/QtyControl.jsx';
import { fmt } from '../utils/format.js';

export function CartDrawer({ open, onClose, cartData, loading, onUpdate, onRemove, user, setPage }) {
  const items = cartData?.items || [];
  const subtotal = cartData?.subtotal || 0;
  const totalItems = items.reduce((a, i) => a + i.quantity, 0);

  return (
    <>
      <div className={`cart-overlay${open ? ' open' : ''}`} onClick={onClose} />
      <div className={`cart-drawer${open ? ' open' : ''}`}>
        <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: '.65rem', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 500 }}>Minha sacola</p>
            {totalItems > 0 && <p style={{ fontSize: '.72rem', color: '#767676', marginTop: 2 }}>{totalItems} {totalItems === 1 ? 'peça' : 'peças'}</p>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#767676' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
          {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner dark /></div>
          : items.length === 0 ? <div style={{ textAlign: 'center', padding: '60px 0' }}><p style={{ fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#767676', marginBottom: 24 }}>Sua sacola está vazia</p><button className="btn btn-outline btn-sm" onClick={onClose}>Continuar comprando</button></div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {items.map((item, idx) => (
                <div key={item.id}>
                  <div style={{ display: 'flex', gap: 16, padding: '16px 0' }}>
                    <div style={{ width: 80, height: 100, background: '#f2f2f0', flexShrink: 0, overflow: 'hidden' }}>
                      {item.product.main_image ? <img src={item.product.main_image.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: '#e8e8e6' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: '.8rem', fontWeight: 400, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</p>
                        <p style={{ fontSize: '.78rem', color: '#767676' }}>{fmt(item.unit_price)}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <QtyControl value={item.quantity} max={item.product.stock} onChange={(q) => onUpdate(item.id, q)} />
                        <button onClick={() => onRemove(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '.68rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#b0b0b0', textDecoration: 'underline' }}>Remover</button>
                      </div>
                    </div>
                  </div>
                  {idx < items.length - 1 && <div style={{ height: 1, background: '#f2f2f0' }} />}
                </div>
              ))}
            </div>}
        </div>

        {items.length > 0 && (
          <div style={{ padding: '20px 28px 32px', borderTop: '1px solid #e0e0e0', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '.72rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#767676' }}>Subtotal</span>
              <span style={{ fontSize: '.9rem', fontWeight: 500 }}>{fmt(subtotal)}</span>
            </div>
            <p style={{ fontSize: '.7rem', color: '#b0b0b0', marginBottom: 20 }}>Frete calculado no pagamento</p>
            <button className="btn btn-primary btn-full" style={{ letterSpacing: '.12em' }} onClick={() => { onClose(); setPage(user ? 'checkout' : 'login'); }}>Finalizar compra</button>
            <button className="btn btn-ghost btn-full" style={{ marginTop: 8, fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase' }} onClick={onClose}>Continuar comprando</button>
          </div>
        )}
      </div>
    </>
  );
}
