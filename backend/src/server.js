require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || true,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

const frontendDir = path.join(__dirname, '..', '..', 'frontend');
app.use(express.static(frontendDir));

app.use(routes);

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'findit-api' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`FindIt API + static frontend http://localhost:${PORT}`);
});
