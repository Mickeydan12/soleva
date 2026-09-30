import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist')
const PORT = process.env.PORT || 3001
app.disable('x-powered-by')
app.use(express.json({ limit: '10kb' }))
app.use((_, res, next) => { res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'strict-origin-when-cross-origin' }); next() })

// Prices are integer kobo (1 NGN = 100 kobo). Sample data: swap for a database later.
const products = [
  { id: 1, name: 'Street Runner', price: 8500000, tag: 'NEW', category: 'sneakers', colors: ['#111111', '#e5e5e5', '#c6ff3d'] },
  { id: 2, name: 'Urban Low', price: 7200000, compareAt: 8500000, tag: 'SALE', category: 'sneakers', colors: ['#d9d9d4', '#111111'] },
  { id: 3, name: 'Court Classic', price: 9000000, tag: 'NEW', category: 'sneakers', colors: ['#f5f5f2', '#0a3d2e'] },
  { id: 4, name: 'Cloud Slide', price: 2800000, category: 'slides', colors: ['#5b6cff', '#111111', '#ffffff'] },
  { id: 5, name: 'Trail Boot', price: 14500000, tag: 'DROP', category: 'boots', colors: ['#8a6a4a', '#111111'] },
  { id: 6, name: 'Pace Runner', price: 10500000, compareAt: 12500000, tag: 'SALE', category: 'running', colors: ['#e11d48', '#111111'] },
  { id: 7, name: 'Street Runner Volt', price: 8900000, tag: 'NEW', category: 'sneakers', colors: ['#c6ff3d', '#111111'] },
  { id: 8, name: 'Urban Low Noir', price: 7200000, category: 'sneakers', colors: ['#222222', '#ffffff'] },
]
const subscribers = new Set()

app.get('/api/products', (req, res) => {
  const q = String(req.query.q || '').toLowerCase().slice(0, 50)
  res.json({ data: products.filter((p) => !q || p.name.toLowerCase().includes(q)) })
})
app.post('/api/newsletter', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) return res.status(400).json({ error: 'Please enter a valid email.' })
  subscribers.add(email)
  res.status(201).json({ message: "Thanks! You're on the list." })
})
app.use('/api', (_, res) => res.status(404).json({ error: 'Not found' }))

app.use(express.static(dist))
app.get(/^\/(?!api).*/, (_, res) => res.sendFile(path.join(dist, 'index.html')))
app.listen(PORT, () => console.log(`SOLEVA running on http://localhost:${PORT}`))
