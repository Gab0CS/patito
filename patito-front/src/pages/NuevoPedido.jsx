import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function NuevoPedido() {
  const navigate = useNavigate()
  const [tiendaId, setTiendaId] = useState('')
  const [vendedor, setVendedor] = useState('')
  const [cliente, setCliente] = useState({ nombre: '', correo: '', telefono: '' })
  const [hawa, setHawa] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [producto, setProducto] = useState(null)
  const [detalles, setDetalles] = useState([])
  const [error, setError] = useState('')
  const [step, setStep] = useState('form') // form | confirm | result
  const [resultado, setResultado] = useState(null)

  const buscarProducto = async () => {
    setError('')
    setProducto(null)
    try {
      const { data } = await api.get(`/productos/${hawa}`)
      setProducto(data)
    } catch {
      setError('Producto no encontrado')
    }
  }

  const agregarProducto = () => {
    if (!producto) return
    const yaEsta = detalles.find(d => d.hawa === producto.hawa)
    const cantidadTotal = (yaEsta?.cantidad || 0) + cantidad
    if (cantidadTotal > producto.existencias) {
      setError('No hay suficientes existencias')
      return
    }
    if (yaEsta) {
      setDetalles(detalles.map(d => d.hawa === producto.hawa ? { ...d, cantidad: d.cantidad + cantidad } : d))
    } else {
      setDetalles([...detalles, { ...producto, cantidad }])
    }
    setHawa('')
    setCantidad(1)
    setProducto(null)
  }

  const quitarDetalle = hawa => setDetalles(detalles.filter(d => d.hawa !== hawa))

  const confirmar = async () => {
    try {
      const { data } = await api.post('/pedidos', {
        tiendaId,
        vendedor,
        cliente,
        detalles: detalles.map(d => ({ hawa: d.hawa, cantidad: d.cantidad })),
      })
      setResultado(data)
      setStep('result')
    } catch (e) {
      setError(e.response?.data?.error || 'Error al crear pedido')
      setStep('confirm')
    }
  }

  if (step === 'result') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={{ color: 'green' }}>✓ Pedido creado exitosamente</h2>
          <p><b>Folio:</b> #{resultado.id}</p>
          <p><b>Estatus:</b> {resultado.estatus}</p>
          <p><b>Cliente:</b> {resultado.cliente.nombre}</p>
          <p><b>Vendedor:</b> {resultado.vendedor}</p>
          <h4>Productos:</h4>
          <table style={styles.table}>
            <thead><tr><th>HAWA</th><th>Nombre</th><th>Cant.</th><th>Precio Final</th></tr></thead>
            <tbody>
              {resultado.detalles.map(d => (
                <tr key={d.id}>
                  <td>{d.hawa}</td>
                  <td>{d.nombreProducto}</td>
                  <td>{d.cantidad}</td>
                  <td>${d.precioFinal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button style={styles.btn} onClick={() => navigate('/pedidos')}>Ver todos los pedidos</button>
        </div>
      </div>
    )
  }

  if (step === 'confirm') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Confirmar Pedido</h2>
          <p><b>Tienda:</b> {tiendaId}</p>
          <p><b>Vendedor:</b> {vendedor}</p>
          <p><b>Cliente:</b> {cliente.nombre} | {cliente.correo} | {cliente.telefono}</p>
          <h4>Productos:</h4>
          <table style={styles.table}>
            <thead><tr><th>HAWA</th><th>Nombre</th><th>Cant.</th><th>Descuento</th><th>Precio Lista</th></tr></thead>
            <tbody>
              {detalles.map(d => (
                <tr key={d.hawa}>
                  <td>{d.hawa}</td>
                  <td>{d.nombre}</td>
                  <td>{d.cantidad}</td>
                  <td>${d.descuento.toLocaleString()}</td>
                  <td>${d.precioLista.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button style={{ ...styles.btn, background: '#ccc', color: '#000' }} onClick={() => setStep('form')}>Regresar</button>
            <button style={styles.btn} onClick={confirmar}>Confirmar Pedido</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Nuevo Pedido</h2>

        <section>
          <h4>Datos generales</h4>
          <div style={styles.row}>
            <input style={styles.input} placeholder="ID Tienda" value={tiendaId} onChange={e => setTiendaId(e.target.value)} />
            <input style={styles.input} placeholder="Vendedor" value={vendedor} onChange={e => setVendedor(e.target.value)} />
          </div>
        </section>

        <section>
          <h4>Datos del cliente</h4>
          <div style={styles.row}>
            <input style={styles.input} placeholder="Nombre *" value={cliente.nombre} onChange={e => setCliente({ ...cliente, nombre: e.target.value })} />
            <input style={styles.input} placeholder="Correo" value={cliente.correo} onChange={e => setCliente({ ...cliente, correo: e.target.value })} />
            <input style={styles.input} placeholder="Teléfono" value={cliente.telefono} onChange={e => setCliente({ ...cliente, telefono: e.target.value })} />
          </div>
        </section>

        <section>
          <h4>Agregar producto por HAWA</h4>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input style={styles.input} placeholder="HAWA" value={hawa} onChange={e => setHawa(e.target.value.toUpperCase())} />
            <input style={{ ...styles.input, width: '60px' }} type="number" min="1" value={cantidad} onChange={e => setCantidad(Number(e.target.value))} />
            <button style={styles.btnSm} onClick={buscarProducto}>Buscar</button>
          </div>

          {producto && (
            <div style={styles.productoCard}>
              <p><b>{producto.nombre}</b> ({producto.hawa})</p>
              <p>Precio lista: <b>${producto.precioLista.toLocaleString()}</b> | Descuento: <b>${producto.descuento.toLocaleString()}</b></p>
              <p>Existencias: <b style={{ color: producto.existencias > 0 ? 'green' : 'red' }}>{producto.existencias}</b></p>
              <button
                style={{ ...styles.btn, opacity: producto.existencias === 0 ? 0.5 : 1 }}
                disabled={producto.existencias === 0}
                onClick={agregarProducto}
              >
                {producto.existencias === 0 ? 'Sin existencias' : 'Agregar al pedido'}
              </button>
            </div>
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </section>

        {detalles.length > 0 && (
          <section>
            <h4>Lista del pedido</h4>
            <table style={styles.table}>
              <thead><tr><th>HAWA</th><th>Nombre</th><th>Cant.</th><th>Precio</th><th></th></tr></thead>
              <tbody>
                {detalles.map(d => (
                  <tr key={d.hawa}>
                    <td>{d.hawa}</td>
                    <td>{d.nombre}</td>
                    <td>{d.cantidad}</td>
                    <td>${d.precioLista.toLocaleString()}</td>
                    <td><button onClick={() => quitarDetalle(d.hawa)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <button
          style={{ ...styles.btn, marginTop: '1rem', opacity: detalles.length === 0 || !tiendaId || !vendedor || !cliente.nombre ? 0.5 : 1 }}
          disabled={detalles.length === 0 || !tiendaId || !vendedor || !cliente.nombre}
          onClick={() => { setError(''); setStep('confirm') }}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '2rem', background: '#f0f2f5', minHeight: '100vh' },
  card: { background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: '700px' },
  row: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  input: { padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.95rem', flex: 1, minWidth: '120px' },
  btn: { padding: '0.6rem 1.2rem', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.95rem' },
  btnSm: { padding: '0.5rem 0.8rem', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  productoCard: { margin: '0.8rem 0', padding: '0.8rem', border: '1px solid #e0e0e0', borderRadius: '6px', background: '#fafafa' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
}
