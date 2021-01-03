const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../schemas');
const Review = require('../models/review');
const Campgroud = require('../models/campground');
const {validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const {postReview, deleteReview} = require('../controllers/reviews');

router.post('/', isLoggedIn,  validateReview, catchAsync(postReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(deleteReview))

module.exports = router;