
Meteor.startup(function() {

	Games.find({
		open: true
	}).observe({
	  added: function(game) {
	  	if(game && game.players) {
	  		Meteor.users.update({ _id: { $in: game.players }}, {
	  			$set: {
	  				game: game._id
	  			}
	  		});
	  	}
	  }
	});

	Games.find({
		open: false
	}).observe({
	  added: function(game) {
	  	if(game && game.players) {
	  		Meteor.users.update({ _id: { $in: game.players }}, {
	  			$unset: {
	  				game: true
	  			}
	  		});
	  	}
	  }
	});

});