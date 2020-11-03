const express = require('express');
const port = 3000;
const path = require('path');
const Campgroud = require('./models/campground');
const methodOverride = require('method-override');

//mongo db connection
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/camp-app', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected')
});



//Routes below
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campgroud.find({});
    res.render('campgrounds/index', {campgrounds})
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campgroud(req.body.campground);
    await campground.save();
    res.redirect('/campgrounds')
})

app.put('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    await Campgroud.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    await Campgroud.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})

app.get('/campgrounds/new' , (req, res) => {
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const {id} = req.params;
    const campground = await Campgroud.findById(id);
    res.render('campgrounds/edit', {campground})
})


app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const campground = await Campgroud.findById(id);
    res.render('campgrounds/show', {campground})
})

app.get('/campgroudns/:id/edit', (req, res) => {
    res.render('campgrounds/edit', )
})


app.get('*', (req, res) => {
    res.send('You got Undefined route :P')
})



app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})