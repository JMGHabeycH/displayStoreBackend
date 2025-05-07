const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');

const productRouter = require('./routes/products');

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})

