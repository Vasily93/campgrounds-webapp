const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../schemas');
const Review = require('../models/review');
const Campgroud = require('../models/campground');
const {validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');


router.post('/', isLoggedIn,  validateReview, catchAsync( async (req, res) => {
    const {id} = req.params;
    const campground = await Campgroud.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await campground.save(); 
    await review.save();
    req.flash('success', 'Successfuly posted new review!')
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campgroud.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfuly deleted review')
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;