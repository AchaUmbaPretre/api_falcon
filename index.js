const express = require('express');
const cors = require('cors');
const colors = require('colors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const operationRoutes = require('./routes/operationRoutes');
const affectationRoutes = require('./routes/affectationRoutes');
const traceurRoutes = require('./routes/traceurRoutes');
const vehiculeRoutes = require('./routes/vehiculeRoutes');

const app = express();

dotenv.config();

// Configuration de l'environnement de développement
const environment = process.env.PORT || 'development';

if (environment === 'development') {
  // Activer l'affichage des erreurs détaillées dans les journaux
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.setMaxListeners(0);

const port = process.env.PORT || 8070;


app.use('/users', usersRoutes)
app.use('/client', clientRoutes)
app.use('/operation', operationRoutes)
app.use('/traceur', traceurRoutes)
app.use('/affectation', affectationRoutes)
app.use('/vehicule', vehiculeRoutes)


app.listen(port, () => {
    console.log(
      `Le serveur est connecté au port ${port}`.bgCyan.white
    );
  });


// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Une erreur est survenue sur le serveur');
  });