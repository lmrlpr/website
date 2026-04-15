import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { Nav } from './components/layout/Nav'
import { PageTransition } from './components/ui/PageTransition'
import { GateGuard } from './components/ui/GateGuard'
import Accueil from './pages/Accueil/index'
import PromRestaurant from './pages/PromRestaurant/index'
import PromGotham from './pages/PromGotham/index'
import Merch from './pages/Merch/index'
import Admin from './pages/Admin/index'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Accueil /></PageTransition>} />
        <Route path="/prom/restaurant" element={<GateGuard><PageTransition><PromRestaurant /></PageTransition></GateGuard>} />
        <Route path="/prom/gotham" element={<GateGuard><PageTransition><PromGotham /></PageTransition></GateGuard>} />
        <Route path="/merch" element={<PageTransition><Merch /></PageTransition>} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <CartProvider>
        <AuthProvider>
          <Nav />
          <AnimatedRoutes />
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
