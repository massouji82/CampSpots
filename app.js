const	bodyParser 		= require('body-parser'),
		flash			= require('connect-flash'),
		express 		= require('express'),
		app 			= express(),
		mongoose 		= require('mongoose'),
		passport		= require('passport'),
		LocalStrategy	= require('passport-local'),
		methodOverride	= require('method-override'),
		Campground 		= require('./models/campground'),
		Comment			= require('./models/comment'),
		User			= require('./models/user'),
		seeDB			= require('./seeds');

// requiring routes
const 	commentRoutes 		= require('./routes/comments'),
		campgroundRoutes 	= require('./routes/campgrounds'),
		indexRoutes			= require('./routes/index');

mongoose.connect('mongodb://localhost/yelp_camp_v12Deployed', { useNewUrlParser: true });
mongoose.connect('mongodb+srv://massouji:pwT6mpSjxbnvsR6@cluster0-iaenq.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });

mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seeDB(); // seed the database

// PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: 'Kian er den beste!',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use('/', indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen('3000', function(){
	console.log('YelpCamp is up!!!')
});



