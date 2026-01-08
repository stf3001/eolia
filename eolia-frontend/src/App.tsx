import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import CookieBanner from './components/common/CookieBanner'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { configureAmplify } from './config/aws-config'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Configure AWS Amplify
configureAmplify()

// Pages
import Home from './pages/Home'
import Calculator from './pages/Calculator'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Partners from './pages/Partners'
import Diagnostic from './pages/Diagnostic'
import Anemometer from './pages/Anemometer'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Dashboard from './pages/Dashboard'
import Ambassador from './pages/Ambassador'
import B2BRegistration from './pages/B2BRegistration'
import Login from './pages/Login'
import Register from './pages/Register'
import ConfirmAccount from './pages/ConfirmAccount'
import HowItWorks from './pages/HowItWorks'
import ConsuelProcess from './pages/ConsuelProcess'
import FAQ from './pages/FAQ'
import CGV from './pages/CGV'
import MentionsLegales from './pages/MentionsLegales'
import CookiePolicy from './pages/CookiePolicy'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/calculateur" element={<Calculator />} />
            <Route path="/produits" element={<Products />} />
            <Route path="/produits/:productId" element={<ProductDetail />} />
            <Route path="/partenaires" element={<Partners />} />
            <Route path="/diagnostic" element={<Diagnostic />} />
            <Route path="/anemometre" element={<Anemometer />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/commande" element={<Checkout />} />
            
            {/* Auth Routes */}
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/confirmer-compte" element={<ConfirmAccount />} />
            
            {/* Protected Routes */}
            <Route path="/espace-client" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/ambassadeur" element={<ProtectedRoute><Ambassador /></ProtectedRoute>} />
            <Route path="/ambassadeur-b2b" element={<ProtectedRoute><B2BRegistration /></ProtectedRoute>} />
            
            {/* Informational Pages */}
            <Route path="/comment-ca-marche" element={<HowItWorks />} />
            <Route path="/processus-consuel" element={<ConsuelProcess />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* Legal Pages */}
            <Route path="/cgv" element={<CGV />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-cookies" element={<CookiePolicy />} />
          </Routes>
          </main>
          <Footer />
          <CookieBanner />
        </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
