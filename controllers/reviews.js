const Review = require('../models/review');
const Campgroud = require('../models/campground');

module.exports.postReview =  async (req, res) => {
    const {id} = req.params;
    const campground = await Campgroud.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await campground.save(); 
    await review.save();
    req.flash('success', 'Successfuly posted new review!')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campgroud.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfuly deleted review')
    res.redirect(`/campgrounds/${id}`);
}