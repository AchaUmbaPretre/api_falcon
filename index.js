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
const menuRoutes = require('./routes/menuRoutes');
const rechargeRoutes = require('./routes/rechargeRoutes');
const paiementRoutes = require('./routes/paiementRoutes');
const depenseRoutes = require('./routes/depenseRoutes');
const factureRoutes = require('./routes/factureRoutes')

const app = express();

dotenv.config();

const environment = process.env.PORT || 'development';

if (environment === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

const corsOptions = {
  origin: '*', // Autorise toutes les origines, à personnaliser pour plus de sécurité
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept'
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(express.static('public'));

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const imageUrl = proxyUrl + 'https://apifalcon.loginsmart-cd.com/uploads/83fc25b5e1d6c680f9d80c2ce9f56bd3';


app.setMaxListeners(0);

const port = process.env.PORT || 8070;

app.use('/users', usersRoutes)
app.use('/menu', menuRoutes)
app.use('/client', clientRoutes)
app.use('/operation', operationRoutes)
app.use('/traceur', traceurRoutes)
app.use('/affectation', affectationRoutes)
app.use('/vehicule', vehiculeRoutes)
app.use('/recharge', rechargeRoutes)
app.use('/paiement', paiementRoutes)
app.use('/depense', depenseRoutes)
app.use('/facture', factureRoutes)


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