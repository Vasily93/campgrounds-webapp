const express = require('express');
const port = 3000;
const path = require('path');
const Campgroud = require('./models/campground');
const Review = require('./models/review');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const {campgroundSchema, reviewSchema} = require('./schemas');
const campgrounds = require('./routes/campgrounds');


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



const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/campgrounds', campgrounds);


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(' , =>')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(' , =>')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

//Routes below

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/campgrounds/:id/reviews', validateReview, catchAsync( async (req, res) => {
    const {id} = req.params;
    const campground = await Campgroud.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campgroud.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

//Error handler
app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Default Error message';
    res.status(statusCode).render('error', {err})
})



app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})