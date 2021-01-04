const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {campgroundSchema} = require('../schemas');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const {index,
        create,
        edit,
        deleteCamp,
        show,
        renderNewForm,
        fetchEditCamp,
        renderEditForm
    } = require('../controllers/campgrounds');
router.route('/')
    .get(catchAsync(index))
    .post(isLoggedIn, validateCampground, catchAsync(create))

router.get('/new', isLoggedIn, renderNewForm)

router.route('/:id')
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(edit))
    .get(catchAsync(show))
    .delete(isLoggedIn, isAuthor, catchAsync(deleteCamp))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(fetchEditCamp))
router.get('/:id/edit', isLoggedIn, renderEditForm)

module.exports = router;