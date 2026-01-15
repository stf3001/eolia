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

// Partner Detail Pages
import FroniusDetail from './pages/partners/FroniusDetail'
import ImeonDetail from './pages/partners/ImeonDetail'
import EnergiestroDetail from './pages/partners/EnergiestroDetail'
import InstallersDetail from './pages/partners/InstallersDetail'

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

// About Pages
import AboutUs from './pages/AboutUs'
import Vision from './pages/Vision'
import WhyEolia from './pages/WhyEolia'
import Contact from './pages/Contact'

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
            <Route path="/partenaires/fronius" element={<FroniusDetail />} />
            <Route path="/partenaires/imeon" element={<ImeonDetail />} />
            <Route path="/partenaires/energiestro" element={<EnergiestroDetail />} />
            <Route path="/partenaires/installateurs" element={<InstallersDetail />} />

            <Route path="/anemometre" element={<Anemometer />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/commande" element={<Checkout />} />
            
            {/* Auth Routes */}
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/confirmer-compte" element={<ConfirmAccount />} />
            
            {/* Protected Routes */}
            <Route path="/espace-client" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/ambassadeur-b2b" element={<ProtectedRoute><B2BRegistration /></ProtectedRoute>} />
            
            {/* Public Ambassador Route (shows presentation or dashboard based on auth) */}
            <Route path="/ambassadeur" element={<Ambassador />} />
            
            {/* Informational Pages */}
            <Route path="/comment-ca-marche" element={<HowItWorks />} />
            <Route path="/processus-consuel" element={<ConsuelProcess />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* Legal Pages */}
            <Route path="/cgv" element={<CGV />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-cookies" element={<CookiePolicy />} />
            
            {/* About Pages */}
            <Route path="/a-propos/qui-sommes-nous" element={<AboutUs />} />
            <Route path="/a-propos/vision" element={<Vision />} />
            <Route path="/a-propos/pourquoi-eolia" element={<WhyEolia />} />
            <Route path="/a-propos/contact" element={<Contact />} />
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
