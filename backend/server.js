// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importa tus rutas
const authRoutes = require('./routes/authRoutes');
const feedRoutes = require('./routes/feedRoutes');
const mensajeRoutes = require('./routes/mensajeRoutes');
const mentoriasRoutes = require('./routes/mentoriaRoutes');
const projectRoutes = require('./routes/projectRoutes');
const rankingRoutes = require('./routes/rankingRoutes');
const retoRoutes = require('./routes/retoRoutes');
const actividadRoutes = require('./routes/actividadRoutes');
const trendingRoutes = require('./routes/trendingRoutes');
const suggestedRoutes = require('./routes/suggestedRoutes');
// const commentRoutes = require('./routes/commentRoutes'); // Descomenta si tienes esta ruta

const app = express();

// Middleware de CORS (habilita peticiones de tu frontend)
app.use(cors());

// Body parser para JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta para servir archivos subidos (imágenes, avatares, etc)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log de cada request para debug (opcional, útil en desarrollo)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}]`, req.method, req.url, req.body);
  next();
});

// Rutas principales de tu API
app.use('/api/auth', authRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/mensajes', mensajeRoutes);
app.use('/api/mentorias', mentoriasRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/retos', retoRoutes);
app.use('/api/actividad', actividadRoutes);
app.use('/api/trending', trendingRoutes);
app.use('/api/suggested', suggestedRoutes);
// app.use('/api/comment', commentRoutes); // Descomenta si tienes esta ruta

// Ruta de salud para pruebas rápidas
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', date: new Date() });
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ msg: 'Ruta no encontrada.' });
});

// Arrancar el servidor
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log('Servidor backend en puerto', PORT);
});
