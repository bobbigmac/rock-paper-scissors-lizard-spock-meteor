
Games.permit('insert')
	.ifHasRole('basic')
	.setOwnerUser()
	.docHasProps(['players'])
	.testDoc(function(doc) {
		return (doc && doc.players && doc.players.length <= 2);
	})
	.defaultDoc(function(doc) {
		doc.open = true;
		doc.moving = {};//do not publish
		doc.moved = {};//publish bool
		doc.moves = {};//publish, only after both moved
		doc.winner = false;
		return doc;
	})
	.apply();

Games.permit('update')
	.ifHasRole('basic')
	.onlyProps(['players'])
	.moddingArrays(['players'])
	.apply();

Games.permit('update')
	.ifHasRole('basic')
	.onlyProps(['moves'])
	.userInArrays(['players'])
	.updatingUserProps(['moves'])
	.apply();

Games.permit('remove')
	.ifHasRole('basic')
	.userInArrays(['players'])
	.ungamePlayers()
	.apply();