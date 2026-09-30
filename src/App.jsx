import { useEffect, useState } from 'react'
import SvgDefs from './SvgDefs.jsx'

const ngn = (k) => '₦' + (k / 100).toLocaleString('en-NG')
const kindOf = (n) => (/Slide/.test(n) ? 'slide' : /Boot/.test(n) ? 'boot' : 'shoe')

function Shoe({ u, a, kind = 'shoe', label }) {
  return (
    <svg viewBox="0 0 300 150" style={{ '--u': u, '--a': a }} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <use href={`#${kind}`} />
    </svg>
  )
}

function ProductCard({ p, onAdd }) {
  const [saved, setSaved] = useState(false)
  return (
    <article className="card">
      <div className="pic">
        {p.tag && <span className={'tag' + (p.tag === 'SALE' ? ' s' : '')}>{p.tag}</span>}
        <button className="wish" aria-pressed={saved} aria-label={`Save ${p.name}`} onClick={() => setSaved(!saved)}>{saved ? '♥' : '♡'}</button>
        <Shoe u={p.colors[0]} a={p.colors[1] || '#111'} kind={kindOf(p.name)} />
        <button className="qa" onClick={() => onAdd(p)}>Quick add</button>
      </div>
      <div className="info">
        <h3>SOLEVA {p.name}</h3>
        <div className="dots">{p.colors.map((c) => <i key={c} style={{ background: c }} />)}</div>
        <div className="price"><b>{ngn(p.price)}</b>{p.compareAt && <s>{ngn(p.compareAt)}</s>}</div>
      </div>
    </article>
  )
}

const CATS = [
  ['Sneakers', 'Lifestyle & casual', 'shoe', '#111', '#c6ff3d'],
  ['Boots', 'Ankle & outdoor', 'boot', '#8a6a4a', '#2a2a2a'],
  ['Slides', 'Comfort first', 'slide', '#5b6cff', '#111'],
  ['Sports & Running', 'Built for pace', 'shoe', '#e11d48', '#fff'],
]

export default function App() {
  const [products, setProducts] = useState(null)
  const [error, setError] = useState('')
  const [cart, setCart] = useState(0)
  const [toast, setToast] = useState('')
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/products').then((r) => r.json()).then((j) => setProducts(j.data)).catch(() => setError('Could not load products. Please refresh.'))
  }, [])
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2200); return () => clearTimeout(t) }, [toast])

  const add = (p) => { setCart((c) => c + 1); setToast(`Added SOLEVA ${p.name} to cart`) }
  const subscribe = async (e) => {
    e.preventDefault()
    const r = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    const j = await r.json(); setMsg(j.message || j.error); if (r.ok) setEmail('')
  }

  return (
    <>
      <SvgDefs />
      <div className="bar">Discover your next step. <b>Free delivery</b> on orders over ₦150,000 · New drop lands Friday</div>
      <header>
        <div className="wrap nav">
          <a className="logo" href="#top" aria-label="SOLEVA home">SOLEV<i>A</i></a>
          <nav className={'links' + (open ? ' open' : '')} aria-label="Main" onClick={() => setOpen(false)}>
            <a href="#new">Shop</a><a href="#new">New Arrivals</a><a href="#cats">Collections</a><a href="#drops">Drops</a><a href="#about">About</a>
          </nav>
          <div className="tools">
            <button className="btn-i" aria-label="Search">⌕</button>
            <button className="btn-i" aria-label="Account">☺</button>
            <button className="btn-i" aria-label="Wishlist">♡</button>
            <button className="btn-i" aria-label="Cart" onClick={() => setToast(cart ? `${cart} item(s) in cart (demo)` : 'Your cart is empty')}>🛍<span className="badge">{cart}</span></button>
            <button className="btn-i burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
          </div>
        </div>
      </header>

      <main id="top">
        <div className="hero"><div className="wrap">
          <div>
            <div className="eyebrow">Season 26 · Lagos</div>
            <h1>Step <span>Different.</span><br />Move Different.</h1>
            <p>Premium sneakers, boots and slides built for the way you move. Designed with confidence, priced for everyday life.</p>
            <div className="cta"><a className="btn p" href="#new">Shop Collection</a><a className="btn o" href="#drops">Explore New Drops</a></div>
          </div>
          <div className="stage"><Shoe u="#f5f5f2" a="#c6ff3d" label="SOLEVA Street Runner sneaker" /></div>
        </div></div>

        <section id="cats"><div className="wrap">
          <div className="hd"><h2>Shop by category</h2><a href="#new">View all</a></div>
          <div className="cats">
            {CATS.map(([n, s, k, u, a]) => (
              <a key={n} className="cat" href="#new"><div><b>{n}</b><br /><small>{s}</small></div><Shoe u={u} a={a} kind={k} /></a>
            ))}
          </div>
        </div></section>

        <section id="new" style={{ paddingTop: 0 }}><div className="wrap">
          <div className="hd"><h2>New arrivals</h2><a href="#new">Shop all</a></div>
          {error && <p role="alert">{error}</p>}
          {!products && !error && <p>Loading…</p>}
          <div className="grid">{products?.map((p) => <ProductCard key={p.id} p={p} onAdd={add} />)}</div>
        </div></section>

        <section id="drops" style={{ paddingTop: 0 }}><div className="wrap">
          <div className="promo">
            <div><div className="eyebrow" style={{ color: '#000' }}>Limited drop</div><h2>Trail Boot<br />Volt Edition</h2>
              <p style={{ maxWidth: 380, fontWeight: 600 }}>Only a small run. Once it's gone, it's gone.</p><a className="btn" href="#new">Get notified</a></div>
            <Shoe u="#8a6a4a" a="#111" kind="boot" />
          </div>
        </div></section>

        <section id="about" style={{ paddingTop: 0 }}><div className="wrap"><div className="news">
          <h2>Join the SOLEVA list</h2>
          <p style={{ color: 'var(--mute)', margin: '8px 0 0' }}>First access to drops, restocks and offers.</p>
          <form onSubmit={subscribe}>
            <label htmlFor="em" className="sr-only">Email</label>
            <input id="em" type="email" required placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="btn p" style={{ background: '#0a0a0a', color: 'var(--lime)' }}>Subscribe</button>
          </form>
          <div className="ok" role="status">{msg}</div>
        </div></div></section>
      </main>

      <footer><div className="wrap">
        <div className="cols">
          <div><div className="logo" style={{ color: '#fff' }}>SOLEV<i>A</i></div><p style={{ fontSize: 14, maxWidth: 280 }}>Step Different. Move Different. Premium footwear for Nigeria.</p></div>
          <div><h4>Shop</h4><a href="#new">New Arrivals</a><a href="#new">Best Sellers</a><a href="#drops">Drops</a></div>
          <div><h4>Help</h4><a href="#top">Track order</a><a href="#top">Shipping</a><a href="#top">Returns</a><a href="#top">FAQ</a></div>
          <div><h4>Contact</h4><a href="#top">WhatsApp chat</a><a href="#top">Instagram</a><a href="#top">Lagos, Nigeria</a></div>
        </div>
        <div className="copy"><span>© 2026 SOLEVA. All rights reserved.</span><span>Privacy · Terms</span></div>
      </div></footer>
      <div id="toast" className={toast ? 'on' : ''} role="status" aria-live="polite">{toast}</div>
    </>
  )
}
