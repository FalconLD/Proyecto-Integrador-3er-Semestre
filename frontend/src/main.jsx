import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { AdminGuard } from './admin/guards/AdminGuard'
import { AdminLayout } from './admin/layouts/AdminLayout'
import AdminPage from './pages/AdminPage'
import { ErrorBoundary } from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/progress" element={<App />} />
          <Route path="/ranking" element={<App />} />
          <Route path="/info" element={<App />} />
          <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index element={<AdminPage />} />
            <Route path="permisos" element={<AdminPage defaultVista="permisos" />} />
            <Route path="roles" element={<AdminPage defaultVista="roles" />} />
            <Route path="usuarios" element={<AdminPage defaultVista="usuarios" />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  </StrictMode>,
)
