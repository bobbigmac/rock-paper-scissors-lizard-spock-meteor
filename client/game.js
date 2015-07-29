
Template.game.events({
	'click .set-choice': function() {
		var userId = Meteor.userId();
		var game = (userId && Games.findOne({ open: true, players: userId }));
		Meteor.call('set-choice', game._id, this.value);
	},
	'click .abandon-game': function() {
		//console.log(this);
		Games.remove(this._id);
	}
});

Template.game.helpers({
	player: function(_id) {
		return Meteor.users.findOne(_id);
	},
	playerMoved: function(_id, moved) {
		var user = Meteor.users.findOne(_id);
		return (user && moved && moved[user._id]);
	},
	playerMove: function(_id, moves) {
		var user = Meteor.users.findOne(_id);
		return (user && moves && moves[user._id]);
	},
	choices: function() {
		return [
			{ icon: 'hand-rock-o', name: 'Rock', value: 'rock' },
			{ icon: 'hand-paper-o', name: 'Paper', value: 'paper' },
			{ icon: 'hand-scissors-o', name: 'Scissors', value: 'scissors' },
			{ icon: 'hand-lizard-o', name: 'Lizard', value: 'lizard' },
			{ icon: 'hand-spock-o', name: 'Spock', value: 'spock' }
		];
	}
});