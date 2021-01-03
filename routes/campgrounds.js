const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {campgroundSchema} = require('../schemas');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const {index, create, edit, deleteCamp, show, renderNewForm, fetchEditCamp, renderEditForm} = require('../controllers/campgrounds');

router.get('/',catchAsync(index))

router.post('/', isLoggedIn, validateCampground, catchAsync(create))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(edit))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(deleteCamp))


router.get('/new', isLoggedIn, renderNewForm)

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(fetchEditCamp))


router.get('/:id', catchAsync(show))

router.get('/:id/edit', isLoggedIn, renderEditForm)

module.exports = router;