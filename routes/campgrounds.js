const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {campgroundSchema} = require('../schemas');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

router.get('/',catchAsync( async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}))

router.post('/', isLoggedIn, validateCampground, catchAsync( async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfuly made a new campground!')
    res.redirect('/campgrounds')    
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync( async (req, res, next) => {
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfuly updated campground!')
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync( async (req, res, next) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfuly deleted campground!')
    res.redirect('/campgrounds')
}))


router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync( async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground})
}))


router.get('/:id', catchAsync( async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
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