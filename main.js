const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const USERS_FILE = path.join(__dirname, 'users.json');
const SECRET_KEY = 'InvestigacionAplicada2Grupo1';

// Lista de tokens revocados
const revokedTokens = new Set();

// Función para asegurarse de que el archivo JSON existe
const ensureUsersFileExists = () => {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([])); // Crea un archivo vacío con un array
  }
};

// Función para leer los usuarios del archivo JSON
const readUsersFromFile = () => {
  ensureUsersFileExists();
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(data);
};

// Función para escribir los usuarios en el archivo JSON
const writeUsersToFile = (users) => {
  ensureUsersFileExists();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Ruta para el registro de usuario
app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Faltan datos para registrar el usuario.' });
  }

  const users = readUsersFromFile();
  const userExists = users.find(u => u.username === username || u.email === email);

  if (userExists) {
    return res.status(400).json({ message: 'El usuario o el email ya existe' });
  }

  const user = { username, password, email };
  users.push(user);
  writeUsersToFile(users);

  res.status(201).json({ message: 'Registro exitoso', user });
});

// Ruta para el inicio de sesión
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = readUsersFromFile();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.status(200).json({ token: 'Bearer ' + token });
});

// Middleware para verificar el token de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Verifica si el token es nulo, indefinido o vacío
  if (token == null || token === "") return res.sendStatus(401);

  if (revokedTokens.has(token)) return res.sendStatus(403); // Verifica si el token está en la lista de revocados

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Ruta para el recurso protegido
app.get('/api/protected-resource', authenticateToken, (req, res) => {
  res.status(200).json({ DatoProtegido: 'Informacion protegida' });
});

// Ruta para el cierre de sesión
app.post('/api/logout', authenticateToken, (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  revokedTokens.add(token); // Agrega el token a la lista de revocados
  res.status(200).json({ message: 'Sesion cerrada del usuario: ' + req.user.username });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
