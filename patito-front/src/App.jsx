import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import NuevoPedido from './pages/NuevoPedido'
import ListaPedidos from './pages/ListaPedidos'
import DetallePedido from './pages/DetallePedido'

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pedidos" element={<PrivateRoute><ListaPedidos /></PrivateRoute>} />
        <Route path="/pedidos/:id" element={<PrivateRoute><DetallePedido /></PrivateRoute>} />
        <Route path="/nuevo-pedido" element={<PrivateRoute><NuevoPedido /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
