const Campground = require('../models/campground');

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}

module.exports.create = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfuly made a new campground!')
    res.redirect('/campgrounds')    
}

module.exports.edit =  async (req, res, next) => {
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfuly updated campground!')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCamp =  async (req, res, next) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfuly deleted campground!')
    res.redirect('/campgrounds')
}

module.exports.show =  async (req, res, next) => {
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
}

module.exports.renderNewForm =  (req, res) => {
    res.render('campgrounds/new')
}

module.exports.fetchEditCamp =  async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground})
}

module.exports.renderEditForm = (req, res) => {
    res.render('campgrounds/edit', )
}