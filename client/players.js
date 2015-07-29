
Template.players.events({
	'click .start-challenge': function() {
		var userId = Meteor.userId();
		if(userId && this._id) {
			Games.insert({
				players: [userId, this._id]
			});
		}
	}
});