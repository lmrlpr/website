import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import Nav from './components/Nav'
import PageTransition from './components/PageTransition'
import Accueil from './pages/Accueil'
import Restaurant from './pages/Restaurant'
import Gotham from './pages/Gotham'
import Merch from './pages/Merch'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Accueil /></PageTransition>} />
        <Route path="/prom/restaurant" element={<PageTransition><Restaurant /></PageTransition>} />
        <Route path="/prom/gotham" element={<PageTransition><Gotham /></PageTransition>} />
        <Route path="/merch" element={<PageTransition><Merch /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Nav />
        <AnimatedRoutes />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
