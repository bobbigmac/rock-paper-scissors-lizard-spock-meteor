
Meteor.startup(function () {
  AccountsGuest.name = true;
});

var rules = {
	'rock': ['scissors', 'lizard'],
	'paper': ['rock', 'spock'],
	'scissors': ['paper', 'lizard'],
	'lizard': ['paper', 'spock'],
	'spock': ['scissors', 'rock']
};

function getWinner(moving) {
	var keys = Object.keys(moving);

	var first = keys[0];
	var second = keys[1];
	var firstMove = moving[first];
	var secondMove = moving[second];

	if(firstMove !== secondMove) {
		//console.log('first', firstMove, 'second', secondMove);
		if(rules[firstMove] && rules[firstMove].indexOf(secondMove) > -1) {
			return first;
		}
		if(rules[secondMove] && rules[secondMove].indexOf(firstMove) > -1) {
			return second;
		}
	}
	return 'draw';
}

Meteor.methods({
	'set-choice': function(gameId, choice) {
		//TODO: Validate choice
		if(choice && this.userId && gameId) {
			var set = {};
			set['moved.'+this.userId] = true;
			set['moving.'+this.userId] = choice;

			var filter = { _id: gameId, players: this.userId, open: true };
			Games.update(filter, {
				$set: set
			}, function(err, updated) {
				if(!err) {
					//console.log('updated', updated);
				} else {
					console.log('err', err);
				}
			});

			//TODO: Check if both players moved, set moved, and set open = false
			var game = Games.findOne(filter);
			if(game) {
				var allMoved = game.players.every(function(userId) {
					return (userId && game && game.moved && game.moved[userId]);
				});
				
				//console.log('allMoved', allMoved);
				if(allMoved) {
					var moving = game.moving;
					var winnerId = getWinner(moving);
					//console.log('moving', moving, winnerId);

					Games.update({ _id: game._id }, {
						$set: {
							moves: moving,
							winner: winnerId
						}
					}, function(err, updated) {
						if(!err) {
							//console.log('updated', updated);
						} else {
							console.log('err', err);
						}
					});

					Meteor.setTimeout(function() {
						Games.update(game._id, { $set: {
							open: false
						}});
					}, 5000)
				}
			}
		}
	}
});