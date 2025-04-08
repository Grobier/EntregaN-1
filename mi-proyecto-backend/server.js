const express = require('express');
const app = express();
const port = 8080;

//endpoints
app.get("/home" , (req,res)=> {
  res.send("Hola Gente")
});

// Middleware para parsear JSON y datos URL-encoded.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar routers.
const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/carts.routes');

// Configurar rutas base.
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Iniciar el servidor.
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
