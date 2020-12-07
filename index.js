let express = require('express');
let app = express();
let ejs = require('ejs');
const haikus = require('./haikus.json');
const port = process.env.PORT || 3000;
const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.HOST,
  port: 5432
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))
app.set('view engine', 'ejs');

console.log('hi');

app.get('/', (req, res) => {
  pool.query('SELECT * FROM haikus ORDER BY id', (err, haikus) => {
    res.render('index', {haikus: haikus.rows});
  });
});

app.post('/heart', (req, res) => {
  pool.query('UPDATE haikus SET hearts = hearts + 1 WHERE id = $1', [req.body.id], (err, haikus) => {
    res.send('Success');
  });
});

app.listen(port);
console.log('Server running on','http://localhost:3000')
