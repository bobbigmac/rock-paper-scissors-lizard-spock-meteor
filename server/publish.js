
Meteor.publish('my-games', function() {
	if(Roles.userIsInRole(this.userId, ['basic'])) {
		var games = Games.find({
			open: true,
			players: this.userId
		}, {
			fields: {
				_id: 1,
				players: 1,
				moved: 1,
				moves: 1,
				open: 1,
				winner: 1
			}
		});
		//console.log('my-games', games.count());
		return games;
	}
	this.ready();
	return;
});

Meteor.publish('available-players', function(gameId) {
	if(this.userId && Roles.userIsInRole(this.userId, ['basic'])) {
		var filter = false;
		var userOptions = {
			//TODO: Support reporting scores
			fields: { _id: 1, username: 1 }
		};

		var game = false;
		if(gameId) {
			game = Games.findOne({ _id: gameId }, { fields: { _id: 1, players: 1 }});
		}

		if(game)
		{
			filter = {
				game: game._id,
				_id: { $ne: this.userId }
			};
		}
		else
		{
			filter = {
				game: { $exists: false },
				_id: { $ne: this.userId }
			};
		}

		return Meteor.users.find(filter, userOptions);
	}
	this.ready();
	return;
});
