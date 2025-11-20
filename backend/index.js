// backend/index.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Permite que React se comunique con este servidor
app.use(express.json()); // Permite recibir JSON del frontend

// Conexión a Base de Datos (Clever Cloud)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a la BD:', err);
        return;
    }
    console.log('✅ Conectado a la Base de Datos en Clever Cloud');
});

// Ruta para recibir datos (POST)
app.post('/api/guardar', (req, res) => {
    const { nombre, email } = req.body;
    const sql = 'INSERT INTO usuarios (nombre, email) VALUES (?, ?)';
    
    db.query(sql, [nombre, email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error al guardar');
        }
        res.send('Usuario registrado con éxito');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});