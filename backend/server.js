const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const historiasRoutes = require('./routes/historias');
const reportesEmocionalesRoutes = require('./routes/reportes-emocionales');
const atencionesGrupalesRoutes = require('./routes/atenciones-grupales');
const citasRoutes = require('./routes/citas');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kidspsicologo';
mongoose.connect(mongoURI)
.then(async () => {
  console.log('Connected to MongoDB');
  // Nota: Para cambiar la contraseña del admin, usa el endpoint /api/auth/change-password
})
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/historias', historiasRoutes);
app.use('/api/reportes-emocionales', reportesEmocionalesRoutes);
app.use('/api/atenciones-grupales', atencionesGrupalesRoutes);
app.use('/api/citas', citasRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// For Vercel deployment
module.exports = app;

// Local development
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
