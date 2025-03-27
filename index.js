require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

// Configuración
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI; // Usar variable de entorno

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
app.use(session({
    secret: 'secreto_seguro', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Conectar a MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Modelo de Usuario
const User = require('./models/user');

// Ruta de registro
app.post('/register', async (req, res) => {
    try {
        const { username, password, birthdate } = req.body;
        if (!username || !password) 
            return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'El nombre de usuario ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, birthdate });

        await newUser.save();
        res.status(201).json({ message: '✅ Usuario registrado' });
    } catch (error) {
        res.status(500).json({ error: '❌ Error en el registro' });
    }
});

// Ruta de autenticación
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        req.session.userId = user._id;
        res.json({ message: '✅ Autenticado correctamente', role: user.role });
    } catch (error) {
        res.status(500).json({ error: '❌ Error en la autenticación' });
    }
});

// Ruta para obtener información del usuario autenticado
app.get('/user-info', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    res.json({ username: user.username });
});

// Ruta de logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        res.json({ message: '✅ Sesión cerrada correctamente' });
    });
});

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
