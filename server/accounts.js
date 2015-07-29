Meteor.startup(function() {
	//Add any extra roles
	var roles = ['basic', 'admin'];

	if(Meteor.roles.find().count() != roles.length) {
		roles.map(function(role) {
			Roles.createRole(role);
		});
	}
});

Accounts.onCreateUser(function(options, user) {
  user.roles = ['basic'];

	if(options.profile) {
		user.profile = options.profile;
	};
    
	var email = (user && user.emails && typeof(user.emails) === 'object' && user.emails instanceof Array && user.emails[0] && user.emails[0].address);
	if(user && email) {
		//Do any additional profile work
	}

	return user;
});