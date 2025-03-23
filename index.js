require('dotenv').config(); // Cargar variables de entorno

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();

// Configuración
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI; // Usar variable de entorno para seguridad

app.use(express.json()); // Para procesar JSON
app.use(express.urlencoded({ extended: true })); // Para formularios
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos

// Configuración de sesiones
app.use(session({
    secret: 'secreto_seguro', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambiar a true si usas HTTPS
}));

// Conectar a MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Modelo de Usuario
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Ruta de registro
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Faltan datos' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: '✅ Usuario registrado' });
    } catch (error) {
        res.status(500).json({ error: '❌ Error en el registro' });
    }
});

// Ruta de login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Faltan datos' });

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: '❌ Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: '❌ Contraseña incorrecta' });

        req.session.user = { username };  // Guardar usuario en sesión
        res.json({ message: '✅ Login exitoso' });
    } catch (error) {
        res.status(500).json({ error: '❌ Error en el login' });
    }
});

// Ruta para obtener info del usuario autenticado
app.get('/user-info', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    res.json({ username: req.session.user.username });
});

// Ruta de logout
app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: '✅ Sesión cerrada' });
    });
});

// Servir el HTML de la carpeta "public"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
