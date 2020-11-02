const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Routes below
app.get('/home', (req, res) => {
    res.render('home')
})


app.get('*', (req, res) => {
    res.send('You got Undefined route :P')
})



app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})