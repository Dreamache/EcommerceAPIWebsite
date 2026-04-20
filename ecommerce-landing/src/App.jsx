import { useState, useEffect } from 'react';
import { globalCss } from './styles/theme.js';
import { useAuth } from './hooks/useAuth.js';
import { useCart } from './hooks/useCart.js';
import { useToast } from './hooks/useToast.js';

import { AnnouncementBar } from './components/AnnouncementBar.jsx';
import { Navbar }          from './components/Navbar.jsx';
import { CartDrawer }      from './components/CartDrawer.jsx';
import { Footer }          from './components/Footer.jsx';
import { Toast }           from './components/ui/Toast.jsx';

// Páginas principais
import { HomePage }           from './pages/HomePage.jsx';
import { ProductsPage }       from './pages/ProductsPage.jsx';
import { ProductDetailPage }  from './pages/ProductDetailPage.jsx';
import { AuthPage }           from './pages/AuthPage.jsx';
import { CheckoutPage }       from './pages/CheckoutPage.jsx';
import { OrderDetailPage, OrdersPage } from './pages/OrdersPages.jsx';
import { AboutPage }          from './pages/AboutPage.jsx';

// Páginas de coleções e institucionais
import {
  NovaTemporadaPage, EssenciaisPage, AlfaiatariaPage, CasualPage, AcessoriosPage,
  ComoComprarPage, EntregasPage, TrocasPage, TabelaMedidasPage, FaleConoscoPage,
  NossaHistoriaPage, SustentabilidadePage, TrabalheConoscoPage, ImprensaPage,
} from './pages/info/AllInfoPages.jsx';

export default function App() {
  const [page, setPage] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);

  const { user, login, logout }  = useAuth();
  const { cartData, loading: cartLoading, itemCount, load: loadCart, add, updateItem, removeItem, clear } = useCart();
  const { toast, show: showToast } = useToast();

  useEffect(() => { if (user) loadCart(); else clear(); }, [user]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);

  const handleAddToCart = async (productId, quantity) => {
    if (!user) { showToast('Faça login para adicionar à sacola.'); setPage('login'); return; }
    try { await add(productId, quantity); setCartOpen(true); showToast('Peça adicionada à sacola.'); }
    catch (err) { showToast(err.message, 'error'); }
  };

  const handleLogout    = async () => { await logout(); showToast('Você saiu da conta.'); setPage('home'); };
  const handleCartOpen  = ()       => { if (!user) { showToast('Faça login para ver sua sacola.'); setPage('login'); return; } setCartOpen(true); };

  const renderPage = () => {
    if (page.startsWith('product:')) return <ProductDetailPage slug={page.replace('product:', '')} setPage={setPage} onAddToCart={handleAddToCart} />;
    if (page.startsWith('order:'))   return <OrderDetailPage   orderId={page.replace('order:', '')} setPage={setPage} />;
    if ((page === 'checkout' || page === 'orders') && !user)
      return <AuthPage mode="login" setPage={setPage} onLogin={res => login(res.user || res)} />;

    switch (page) {
      // Principais
      case 'home':      return <HomePage setPage={setPage} />;
      case 'products':  return <ProductsPage setPage={setPage} />;
      case 'about':     return <AboutPage />;
      case 'login':     return <AuthPage mode="login"     setPage={setPage} onLogin={res => login(res.user || res)} />;
      case 'register':  return <AuthPage mode="register"  setPage={setPage} onLogin={res => login(res.user || res)} />;
      case 'checkout':  return <CheckoutPage cartData={cartData} setPage={setPage} onOrderPlaced={() => { clear(); loadCart(); }} />;
      case 'orders':    return <OrdersPage setPage={setPage} />;
      // Coleções
      case 'nova-temporada': return <NovaTemporadaPage setPage={setPage} />;
      case 'essenciais':     return <EssenciaisPage    setPage={setPage} />;
      case 'alfaiataria':    return <AlfaiatariaPage   setPage={setPage} />;
      case 'casual':         return <CasualPage        setPage={setPage} />;
      case 'acessorios':     return <AcessoriosPage    setPage={setPage} />;
      // Atendimento
      case 'como-comprar':   return <ComoComprarPage   setPage={setPage} />;
      case 'entregas':       return <EntregasPage />;
      case 'trocas':         return <TrocasPage />;
      case 'tabela-medidas': return <TabelaMedidasPage />;
      case 'fale-conosco':   return <FaleConoscoPage />;
      // Institucional
      case 'nossa-historia':   return <NossaHistoriaPage />;
      case 'sustentabilidade': return <SustentabilidadePage />;
      case 'trabalhe-conosco': return <TrabalheConoscoPage />;
      case 'imprensa':         return <ImprensaPage />;

      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <>
      <style>{globalCss}</style>

      <AnnouncementBar setPage={setPage} />
      <Navbar
        page={page} setPage={setPage} user={user}
        cartCount={itemCount} onCartOpen={handleCartOpen} onLogout={handleLogout}
      />

      <main>{renderPage()}</main>

      <Footer setPage={setPage} />

      <CartDrawer
        open={cartOpen} onClose={() => setCartOpen(false)}
        cartData={cartData} loading={cartLoading}
        onUpdate={async (id, q) => { try { await updateItem(id, q); } catch(e) { showToast(e.message,'error'); }}}
        onRemove={async (id)    => { try { await removeItem(id);    } catch(e) { showToast(e.message,'error'); }}}
        user={user} setPage={setPage}
      />

      <Toast toast={toast} />
    </>
  );
}
