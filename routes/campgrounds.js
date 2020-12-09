const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {campgroundSchema} = require('../schemas');
const Campgroud = require('../models/campground');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(' , =>')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}


router.get('/',catchAsync( async (req, res, next) => {
    const campgrounds = await Campgroud.find({});
    res.render('campgrounds/index', {campgrounds})
}))

router.post('/', validateCampground, catchAsync( async (req, res, next) => {
    const campground = new Campgroud(req.body.campground);
    await campground.save();
    res.redirect('/campgrounds')    
}))

router.put('/:id', validateCampground, catchAsync( async (req, res, next) => {
    const {id} = req.params;
    console.log(req.body.campground)
    await Campgroud.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', catchAsync( async (req, res, next) => {
    const {id} = req.params;
    await Campgroud.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))


router.get('/new' , (req, res) => {
    res.render('campgrounds/new')
})

router.get('/:id/edit', catchAsync( async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campgroud.findById(id);
    res.render('campgrounds/edit', {campground})
}))


router.get('/:id', catchAsync( async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campgroud.findById(id).populate('reviews');
    res.render('campgrounds/show', {campground})
}))

router.get('/:id/edit', (req, res) => {
    res.render('campgrounds/edit', )
})

module.exports = router;