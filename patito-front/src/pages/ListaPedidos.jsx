import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const ESTATUS_OPTS = ['ENTREGADO', 'CANCELADO']
const ESTATUS_COLOR = { PENDIENTE: '#faad14', ENTREGADO: '#52c41a', CANCELADO: '#ff4d4f' }

export default function ListaPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const cargar = async () => {
    const { data } = await api.get('/pedidos')
    setPedidos(data)
  }

  useEffect(() => { cargar() }, [])

  const cambiarEstatus = async (id, estatus) => {
    setError('')
    try {
      await api.patch(`/pedidos/${id}/estatus`, { estatus })
      cargar()
    } catch (e) {
      setError(e.response?.data?.error || 'Error al cambiar estatus')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Pedidos</h2>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button style={styles.btn} onClick={() => navigate('/nuevo-pedido')}>+ Nuevo pedido</button>
            <button style={{ ...styles.btn, background: '#ff4d4f' }} onClick={() => { localStorage.removeItem('token'); navigate('/') }}>Cerrar sesión</button>
          </div>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <table style={styles.table}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Tienda</th>
              <th style={styles.th}>Vendedor</th>
              <th style={styles.th}>Cliente</th>
              <th style={styles.th}>Fecha</th>
              <th style={styles.th}>Estatus</th>
              <th style={styles.th}>Cambiar estatus</th>
              <th style={styles.th}>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={styles.td}>{p.id}</td>
                <td style={styles.td}>{p.tiendaId}</td>
                <td style={styles.td}>{p.vendedor}</td>
                <td style={styles.td}>{p.cliente.nombre}</td>
                <td style={styles.td}>{new Date(p.fechaCreacion).toLocaleString()}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background: ESTATUS_COLOR[p.estatus] }}>{p.estatus}</span>
                </td>
                <td style={styles.td}>
                  {p.estatus === 'PENDIENTE' ? (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {ESTATUS_OPTS.map(opt => (
                        <button
                          key={opt}
                          style={{ ...styles.btnSm, background: opt === 'CANCELADO' ? '#ff4d4f' : '#52c41a' }}
                          onClick={() => cambiarEstatus(p.id, opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : '—'}
                </td>
                <td style={styles.td}>
                  <button style={styles.btnSm} onClick={() => navigate(`/pedidos/${p.id}`)}>Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pedidos.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>No hay pedidos registrados</p>}
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '2rem', background: '#f0f2f5', minHeight: '100vh' },
  card: { background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  btn: { padding: '0.6rem 1.2rem', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnSm: { padding: '0.3rem 0.7rem', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', background: '#1890ff', fontSize: '0.8rem' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
  th: { padding: '0.6rem', textAlign: 'left', borderBottom: '2px solid #f0f0f0' },
  td: { padding: '0.6rem', verticalAlign: 'middle' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '12px', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' },
}
