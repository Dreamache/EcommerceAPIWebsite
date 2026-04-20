export const globalCss = `
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'Inter', sans-serif; background: #fff; color: #0a0a0a; -webkit-font-smoothing: antialiased; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
input, select, textarea, button { font-family: inherit; }
::selection { background: #0a0a0a; color: #fff; }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #c0c0c0; }
.serif { font-family: 'EB Garamond', Georgia, serif; }
.btn { display: inline-flex; align-items: center; justify-content: center; padding: 0 32px; height: 48px; font-size: .75rem; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; border: 1px solid transparent; cursor: pointer; transition: background .2s, color .2s, border-color .2s; gap: 8px; white-space: nowrap; }
.btn-primary { background: #0a0a0a; color: #fff; border-color: #0a0a0a; }
.btn-primary:hover { background: #2a2a2a; }
.btn-primary:disabled { opacity: .4; cursor: not-allowed; }
.btn-outline { background: transparent; color: #0a0a0a; border-color: #0a0a0a; }
.btn-outline:hover { background: #0a0a0a; color: #fff; }
.btn-outline-white { background: transparent; color: #fff; border-color: #fff; }
.btn-outline-white:hover { background: #fff; color: #0a0a0a; }
.btn-ghost { background: transparent; color: #767676; border: none; padding: 0 12px; height: 40px; }
.btn-ghost:hover { color: #0a0a0a; }
.btn-danger { background: transparent; color: #c0392b; border-color: #c0392b; }
.btn-danger:hover { background: #c0392b; color: #fff; }
.btn-sm { height: 40px; padding: 0 20px; font-size: .7rem; }
.btn-lg { height: 56px; padding: 0 48px; font-size: .8rem; }
.btn-full { width: 100%; }
.input { width: 100%; padding: 0 16px; height: 48px; font-size: .875rem; border: 1px solid #e0e0e0; background: #fff; color: #0a0a0a; outline: none; transition: border-color .15s; }
.input:focus { border-color: #0a0a0a; }
.input::placeholder { color: #b0b0b0; }
.input-borderless { border: none; border-bottom: 1px solid #e0e0e0; padding: 0; height: 44px; background: transparent; border-radius: 0; }
.input-borderless:focus { border-bottom-color: #0a0a0a; }
.label { display: block; font-size: .68rem; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: #767676; margin-bottom: 8px; }
.container { max-width: 1440px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 80px); }
.container-narrow { max-width: 640px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 80px); }
.container-mid { max-width: 900px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 80px); }
.section { padding: 80px 0; }
.section-lg { padding: 120px 0; }
.section-sm { padding: 48px 0; }
.grid-products { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2px; }
.grid-products-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; }
.grid-products-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
.product-card { cursor: pointer; background: #f2f2f0; overflow: hidden; }
.product-card-img { aspect-ratio: 3/4; overflow: hidden; background: #f2f2f0; position: relative; }
.product-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
.product-card:hover .product-card-img img { transform: scale(1.03); }
.product-card-info { padding: 14px 16px 20px; background: #fff; }
.nav-link { font-size: .72rem; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: #767676; background: none; border: none; cursor: pointer; transition: color .15s; padding: 4px 0; }
.nav-link:hover, .nav-link.active { color: #0a0a0a; }
.badge { display: inline-block; padding: 3px 8px; font-size: .62rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; }
.badge-dark { background: #0a0a0a; color: #fff; }
.badge-sale { background: #c0392b; color: #fff; }
.toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); z-index: 9999; background: #0a0a0a; color: #fff; padding: 14px 28px; font-size: .75rem; letter-spacing: .06em; font-weight: 500; text-transform: uppercase; box-shadow: 0 8px 32px rgba(0,0,0,.2); animation: toastIn .25s ease; white-space: nowrap; }
.toast-error { background: #c0392b; }
@keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
.cart-drawer { position: fixed; top: 0; right: 0; bottom: 0; z-index: 900; width: 100%; max-width: 440px; background: #fff; border-left: 1px solid #e0e0e0; display: flex; flex-direction: column; transform: translateX(100%); transition: transform .35s cubic-bezier(.4,0,.2,1); }
.cart-drawer.open { transform: translateX(0); }
.cart-overlay { position: fixed; inset: 0; z-index: 899; background: rgba(0,0,0,.4); opacity: 0; pointer-events: none; transition: opacity .35s; }
.cart-overlay.open { opacity: 1; pointer-events: all; }
.spinner { width: 18px; height: 18px; border: 1.5px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
.spinner-dark { border: 1.5px solid #e0e0e0; border-top-color: #0a0a0a; }
@keyframes spin { to { transform: rotate(360deg); } }
.skeleton { background: linear-gradient(90deg, #f2f2f0 25%, #e8e8e6 50%, #f2f2f0 75%); background-size: 200% 100%; animation: shimmer 1.6s infinite; }
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
.qty-control { display: flex; align-items: center; border: 1px solid #e0e0e0; }
.qty-btn { width: 40px; height: 40px; background: transparent; border: none; font-size: 1rem; cursor: pointer; transition: background .15s; display: flex; align-items: center; justify-content: center; }
.qty-btn:hover { background: #f2f2f0; }
.qty-num { min-width: 40px; text-align: center; font-size: .82rem; font-weight: 500; }
.filter-btn { padding: 6px 16px; font-size: .68rem; letter-spacing: .1em; text-transform: uppercase; font-weight: 500; border: 1px solid #e0e0e0; background: #fff; color: #767676; cursor: pointer; transition: all .15s; }
.filter-btn:hover, .filter-btn.active { background: #0a0a0a; color: #fff; border-color: #0a0a0a; }
@media (max-width: 1024px) { .grid-products-4 { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) {
  .hide-mobile { display: none !important; }
  .grid-products, .grid-products-4, .grid-products-3 { grid-template-columns: repeat(2, 1fr); gap: 2px; }
  .section { padding: 60px 0; }
}
`;
