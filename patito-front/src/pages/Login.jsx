import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/login', form)
      localStorage.setItem('token', data.token)
      navigate('/pedidos')
    } catch {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Tiendas Patito</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Usuario"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button style={styles.btn} type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
  card: { background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', width: '320px' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' },
  btn: { padding: '0.7rem', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
}
