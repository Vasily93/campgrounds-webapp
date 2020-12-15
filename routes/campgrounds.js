const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {campgroundSchema} = require('../schemas');
const Campgroud = require('../models/campground');
const { isLoggedIn } = require('../middleware');

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

router.post('/', isLoggedIn, validateCampground, catchAsync( async (req, res, next) => {
    const campground = new Campgroud(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfuly made a new campground!')
    res.redirect('/campgrounds')    
}))

router.put('/:id', isLoggedIn, validateCampground, catchAsync( async (req, res, next) => {
    const {id} = req.params;
    console.log(req.body.campground)
    await Campgroud.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfuly updated campground!')
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync( async (req, res, next) => {
    const {id} = req.params;
    await Campgroud.findByIdAndDelete(id);
    req.flash('success', 'Successfuly deleted campground!')
    res.redirect('/campgrounds')
}))


router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

router.get('/:id/edit', isLoggedIn, catchAsync( async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campgroud.findById(id);
    res.render('campgrounds/edit', {campground})
}))


router.get('/:id', catchAsync( async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campgroud.findById(id).populate('reviews');
    if(!campground) {
        req.flash('error' , 'Can not find that campground')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground})
}))

router.get('/:id/edit', isLoggedIn, (req, res) => {
    res.render('campgrounds/edit', )
})

module.exports = router;