const 	express 	= require('express'),
		router 		= express.Router(),
		middleware	= require('../middleware'),
		Campground	= require('../models/campground');

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});

//NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, function(req, res){
	res.render('campgrounds/new');
});

//CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res){
	// get data from form and add to campgrounds array
	const 	name 	= req.body.name,
		 	image 	= req.body.image,
			desc 	= req.body.description,
			price 	= req.body.price,
			author 	= {
				id: req.user._id,
				username: req.user.username
			};
	const newCampground = {name: name, image: image, description: desc, price: price, author: author};
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			// redirect back to campgrounds page
			res.redirect('/campgrounds');
		}
	});
});

//SHOW - shows more info about one specific campground
router.get('/:id', function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash('error', 'Campground not found');
			res.redirect('back');
		} else {
			//render show template with that campground
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});

//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render('campgrounds/edit', {campground: foundCampground});
	});
});

//UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
	// find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if (err) {
			req.redirect('/campgrounds');
		} else {
			// redirect somewhere(show page)
			res.redirect('/campgrounds/' + req.params.id);
		}
	})
});

//DESTROY CAMPGROUND PAGE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Campground removed'); 
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;

