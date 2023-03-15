const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./sources/users/authRoutes');

app.use('/', userRoutes);

app.listen(port, () => {
    console.log('Server started on port ', port);
});