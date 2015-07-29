//SEE https://github.com/ongoworks/meteor-security

Security.defineMethod("ownerIsLoggedInUser", {
  fetch: [],
  deny: function (type, arg, userId, doc) {
    return userId !== doc.owner;
  }
});

Security.defineMethod("testDoc", {
  fetch: [],
  deny: function (type, arg, userId, doc, fields, modifier) {
    return !(arg && arg(doc));
  }
});

Security.defineMethod("defaultDoc", {
  fetch: [],
  deny: function (type, arg, userId, doc, fields, modifier) {
    doc = ((arg && arg(doc)) || doc);
    return false;
  }
});

Security.defineMethod("moddingArrays", {
  fetch: [],
  deny: function (type, arg, userId, doc, fields, modifier) {
    console.log('moddingArray', type, arg, userId, fields, modifier);
    return true;
  }
});

Security.defineMethod("docHasProps", {
  fetch: [],
  deny: function (type, arg, userId, doc, fields, modifier) {
    //console.log('docHasProps', type, arg, userId, fields, modifier);
    arg = (arg instanceof String ? [arg] : arg);
    var okay = arg.every(function(prop) {
      return !!doc[prop];
    });
    return !okay;
  }
});

Security.defineMethod("userInArrays", {
  fetch: [],
  deny: function (type, arg, userId, doc, fields, modifier) {
    //console.log('userInArrays', type, arg, userId, fields, modifier);
    arg = (arg instanceof String ? [arg] : arg);
    var okay = arg.every(function(prop) {
      return (doc[prop] && doc[prop] instanceof Array && doc[prop].indexOf(userId) > -1);
    });
    return !okay;
  }
});

Security.defineMethod("updatingUserProps", {
  fetch: [],
  deny: function (type, arg, userId, doc, fields, modifier) {
    console.log('updatingUserProps', type, arg, userId, fields, modifier);
    return true;
  }
});

Security.defineMethod("idIsLoggedInUser", {
  fetch: [],
  deny: function (type, arg, userId, doc) {
    return userId !== doc._id;
  }
});

// Sets the owner property of document, and sets created date.
Security.defineMethod("setOwnerUser", {
  fetch: [],
  deny: function (type, arg, userId, doc) {
    doc.owner = userId;
    if(!doc.created) {
	    doc.created = new Date();
  	}
  	doc.modified = new Date();
    return false;
  }
});

// May be used as simple trigger responder to client-side updates
Security.defineMethod("watchChangesByBasic", {
  fetch: [],
  deny: function (type, arg, userId, doc) {
    if(type === 'update') {
      console.log('Had changes by basic user', userId, 'doc', doc._id);
    }
    return false;
  }
});

Security.defineMethod("ungamePlayers", {
  fetch: [],
  deny: function (type, arg, userId, doc) {
    if(type === 'remove') {
      //console.log('ungamePlayers game', doc._id, 'was removed by user', userId);
      Meteor.users.update({ game: doc._id }, {
        $unset: { game: true }
      }, { multi: true });
    }
    return false;
  }
});