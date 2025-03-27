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
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthdate: { type: Date },  // Se almacena pero no se usa para autenticación
    role: { type: String, default: 'user' }
});

const User = mongoose.model('User', UserSchema);

// Ruta de registro
app.post('/register', async (req, res) => {
    try {
        const { username, password, birthdate } = req.body;
        if (!username || !password) 
            return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });

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
        res.json({ message: '✅ Autenticado correctamente' });
    } catch (error) {
        res.status(500).json({ error: '❌ Error en la autenticación' });
    }
});

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
