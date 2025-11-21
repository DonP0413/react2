const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// CAMBIO IMPORTANTE: Usamos createPool en lugar de createConnection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Mantiene hasta 10 conexiones vivas
    queueLimit: 0
});

// Ya no necesitamos db.connect() manual, el pool lo maneja solo.
console.log('✅ Pool de conexiones configurado');

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Backend funcionando con Pool de conexiones 🚀');
});

app.post('/api/guardar', (req, res) => {
    const { nombre, email } = req.body;
    const sql = 'INSERT INTO usuarios (nombre, email) VALUES (?, ?)';
    
    // El uso es idéntico, pero ahora es resistente a desconexiones
    db.query(sql, [nombre, email], (err, result) => {
        if (err) {
            console.error('Error en query:', err);
            return res.status(500).send('Error al guardar en BD');
        }
        res.send('Usuario registrado con éxito');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});