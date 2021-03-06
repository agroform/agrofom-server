require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const path         = require('path');
const cors         = require('cors');

require('./configs/db.config');

//const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
app.set('trust proxy', 1);
require('./configs/session.config.js')(app);

app.use(logger('dev', {
  skip: function (req, res) {
    return req.url.includes('favicon.ico');
  },
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_URL]
  })
)

app.use('/', require('./routes/index'));
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/file-upload'));
app.use('/api', require('./routes/farmer'));
app.use('/api', require('./routes/contractor'));

module.exports = app;
