const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Inclusion des routes
const commandesRoutes = require('./routes/commandes');
const clientsRoutes = require('./routes/clients');

app.use('/api/commandes', commandesRoutes);
app.use('/api/clients', clientsRoutes);

app.get('/', (req, res) => {
  res.send('API SNK Plastic opérationnelle ✔');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur le port ${PORT}`);
const machinesRoutes = require('./routes/machines');
app.use('/api/machines', machinesRoutes);

});
