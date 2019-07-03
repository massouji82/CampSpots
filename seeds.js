const	mongoose 	= require('mongoose'),
		Campground 	= require('./models/campground'),
		Comment		= require('./models/comment');

const data = [
	{
		name: "Cloud's Rest",
		image: 'https://farm8.staticflickr.com/7393/14137069393_d2f0ab9187.jpg',
		description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit esse'
	},
	{
		name: "Desert Mesa",
		image: 'https://farm9.staticflickr.com/8215/8267860251_93a6778498.jpg',
		description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit esse'
	},
	{
		name: "Canyon Floor",
		image: 'https://farm4.staticflickr.com/3146/2980811752_4b0df9d215.jpg',
		description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit esse'
	}
]

function seedDB(){
	// Remove all campgrounds
	Campground.deleteMany({}, function(err){
		if (err) {
			console.log(err);
		} else {
			console.log('removed campgrounds!');
		}
		//add a few campgrounds
		data.forEach(function(seed){
			Campground.create(seed, function(err, campground){
				if (err) {
					console.log(err);
				} else {
					console.log('added a campground!');
					//add a few comments
					Comment.create(
						{
							text: 'This place is great, but I wish there was internet',
							author: 'Homer'	
						}, function(err, comment){
							if (err) {
								console.log(err);
							} else {
								campground.comments.push(comment);
								campground.save();
								console.log('created new comment');
							}
							
						}
					)
				}	
			});
		
		});
	});
}

module.exports = seedDB;

