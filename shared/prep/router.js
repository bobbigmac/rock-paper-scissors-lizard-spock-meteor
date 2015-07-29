Router.configure({
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  layoutTemplate: 'layout'
});

Router.route('/', {
	name: 'players',
	waitOn: function () {
		return [
			Meteor.subscribe('available-players'),
			Meteor.subscribe('my-games')
		];
	},
	data: function() {
		var userId = Meteor.userId();
		if(userId) {
			Session.set('page-title', '');
			var game = Games.find({ players: userId, open: true });
			
			Tracker.autorun(function() {
				var singleGame = game.fetch()[0];
				Meteor.subscribe('available-players', singleGame && singleGame._id);
			});

			var data = {
				players: Meteor.users.find({ _id: { $ne: userId }}),
				playing: game.fetch()[0]
			};
			return data;
		}
	}
});