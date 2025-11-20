// frontend/src/App.jsx
import { useState } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Hacemos la petición al Backend
      const response = await fetch('http://localhost:3000/api/guardar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('¡Datos guardados en Clever Cloud!');
        setFormData({ nombre: '', email: '' }); // Limpiar form
      } else {
        alert('Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Demo React + Vite + SQL</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        
        <input
          type="text"
          name="nombre"
          placeholder="Tu Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          style={{ padding: '10px' }}
        />
        
        <input
          type="email"
          name="email"
          placeholder="Tu Correo"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: '10px' }}
        />
        
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
          Enviar a Base de Datos
        </button>
      
      </form>
    </div>
  )
}

export default App