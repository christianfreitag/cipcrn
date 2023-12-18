const { json } = require('express');
const cors = require('cors');
const express = require('express');
const app = express();
const routes = require('./routes');


const port = 9696;
const hostname='10.9.182.197';

app.use(cors({origin:true,}));
app.use(express.json());
app.use(routes);
//PORTAs
app.listen(port, hostname, () => {
  console.log(`Servidor está funcionando corretamente no endereço: http://${hostname}:${port}/`);
});
