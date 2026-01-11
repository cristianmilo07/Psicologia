# PsicoKids - Plataforma de Psicología Infantil

Plataforma web completa para el seguimiento y desarrollo emocional de niños, con áreas dedicadas para niños, padres y profesionales.

## 📁 Estructura del Proyecto

```
KidsPsicologo/
├── backend/              # Servidor Node.js + Express
│   ├── routes/          # Rutas de la API
│   ├── server.js        # Servidor principal
│   └── package.json     # Dependencias del backend
│
└── frontend/            # Aplicación Angular
    ├── src/
    │   ├── app/         # Componentes y servicios
    │   └── ...
    └── package.json     # Dependencias del frontend
```

## 🚀 Tecnologías

- **Frontend**: Angular 17 (última versión)
- **Backend**: Node.js con Express
- **Autenticación**: JWT (JSON Web Tokens)
- **Estilos**: SCSS con diseño moderno y colorido

## 📋 Características

- ✅ Sistema de autenticación completo (Login/Registro)
- ✅ Dashboard principal con navegación a las 3 zonas
- ✅ Zona Niños con reportes de emociones y actividades
- ✅ Zona Padres con recursos y seguimiento
- ✅ Zona Profesional con panel de control para psicólogos
- ✅ Diseño responsive y moderno
- ✅ Animaciones y efectos visuales

## 🛠️ Instalación

### 1. Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env (opcional)
# PORT=3000
# JWT_SECRET=your-secret-key-change-in-production
# NODE_ENV=development

# Iniciar el servidor
npm start
# o para desarrollo con auto-reload:
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### 2. Frontend

```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
ng serve
# o
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 👤 Usuario por Defecto

Para probar la aplicación, puedes usar:
- **Email**: admin@kidspsicologo.com
- **Contraseña**: admin123

O crear una nueva cuenta desde el formulario de registro.

## 🎨 Diseño

El diseño está inspirado en un ambiente amigable y colorido para niños, con:
- Colores pasteles y vibrantes
- Animaciones suaves de nubes y estrellas
- Tarjetas con bordes redondeados
- Iconos y emojis para mejor UX

## 🔒 Seguridad

- Las contraseñas se almacenan con hash bcrypt
- Tokens JWT para autenticación
- Guards en Angular para proteger rutas
- Validación de datos en frontend y backend

## 📝 Notas

- En producción, reemplaza el array de usuarios en memoria por una base de datos real (MongoDB, PostgreSQL, etc.)
- Cambia el JWT_SECRET por un valor seguro en producción
- Configura CORS adecuadamente para producción

## 🚧 Próximas Mejoras

- Integración con base de datos real
- Sistema de mensajería
- Juegos educativos interactivos
- Reportes y gráficos avanzados
- Notificaciones en tiempo real

