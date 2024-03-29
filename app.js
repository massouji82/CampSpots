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

const url = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp_v12Deployed'
mongoose.connect(url, { useNewUrlParser: true });

mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seeDB(); // seed the database

app.locals.moment 	= require('moment');
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

// app.listen('3000', function(){
// 	console.log('YelpCamp is up!!!')
// });

const port = process.env.PORT || 3000;
const ip = process.env.IP;
app.listen(port,function(){
    console.log("Server has started .... at port "+ port+" ip: "+ip);
});


