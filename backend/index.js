const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURACIÓN ROBUSTA (ANTI-CAÍDAS)
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // ESTO ES LO NUEVO Y MÁGICO:
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Verificador de conexión inicial (Opcional, solo para logs)
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error conectando al Pool:', err.message);
    } else {
        console.log('✅ Conexión exitosa al Pool de Clever Cloud');
        connection.release(); // Liberamos la conexión inmediatamente
    }
});

app.get('/', (req, res) => {
    res.send('API Backend activa y resistiendo desconexiones 🛡️');
});

app.post('/api/guardar', (req, res) => {
    const { nombre, email } = req.body;
    const sql = 'INSERT INTO usuarios (nombre, email) VALUES (?, ?)';
    
    db.query(sql, [nombre, email], (err, result) => {
        if (err) {
            console.error('❌ Error insertando datos:', err);
            // Si el error es de conexión cerrada, intentamos responder amablemente
            return res.status(500).json({ error: 'Error de conexión con base de datos', detalle: err.message });
        }
        console.log('✅ Usuario registrado:', nombre);
        res.status(200).json({ message: 'Usuario registrado con éxito' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});