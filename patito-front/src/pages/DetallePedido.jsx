import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const ESTATUS_COLOR = { PENDIENTE: '#faad14', ENTREGADO: '#52c41a', CANCELADO: '#ff4d4f' }

export default function DetallePedido() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pedido, setPedido] = useState(null)

  useEffect(() => {
    api.get(`/pedidos/${id}`).then(r => setPedido(r.data))
  }, [id])

  if (!pedido) return <div style={{ padding: '2rem' }}>Cargando...</div>

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button style={styles.back} onClick={() => navigate('/pedidos')}>← Regresar</button>
        <h2>Pedido #{pedido.id}</h2>

        <div style={styles.grid}>
          <div><b>Tienda:</b> {pedido.tiendaId}</div>
          <div><b>Vendedor:</b> {pedido.vendedor}</div>
          <div><b>Fecha:</b> {new Date(pedido.fechaCreacion).toLocaleString()}</div>
          <div><b>IP:</b> {pedido.ipUsuario}</div>
          <div>
            <b>Estatus:</b>{' '}
            <span style={{ ...styles.badge, background: ESTATUS_COLOR[pedido.estatus] }}>{pedido.estatus}</span>
          </div>
        </div>

        <h4>Cliente</h4>
        <div style={styles.grid}>
          <div><b>Nombre:</b> {pedido.cliente.nombre}</div>
          <div><b>Correo:</b> {pedido.cliente.correo || '—'}</div>
          <div><b>Teléfono:</b> {pedido.cliente.telefono || '—'}</div>
        </div>

        <h4>Productos</h4>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>HAWA</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Cantidad</th>
              <th style={styles.th}>Precio lista</th>
              <th style={styles.th}>Descuento</th>
              <th style={styles.th}>Precio final</th>
            </tr>
          </thead>
          <tbody>
            {pedido.detalles.map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={styles.td}>{d.hawa}</td>
                <td style={styles.td}>{d.nombreProducto}</td>
                <td style={styles.td}>{d.cantidad}</td>
                <td style={styles.td}>${d.precioLista.toLocaleString()}</td>
                <td style={styles.td}>${d.descuento.toLocaleString()}</td>
                <td style={styles.td}><b>${d.precioFinal.toLocaleString()}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '2rem', background: '#f0f2f5', minHeight: '100vh' },
  card: { background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: '800px', margin: '0 auto' },
  back: { background: 'none', border: 'none', color: '#1890ff', cursor: 'pointer', fontSize: '0.95rem', marginBottom: '1rem', padding: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', margin: '0.5rem 0 1rem' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '12px', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '0.6rem', textAlign: 'left', borderBottom: '2px solid #f0f0f0', background: '#fafafa' },
  td: { padding: '0.6rem' },
}
