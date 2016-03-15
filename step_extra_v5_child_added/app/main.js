(function () {
  var makeCallback = function(eventType, observer) {
    if (eventType === 'value') {
      return function(snap) {
        observer.next(snap);
      };
    } else {
      return function(snap, prevName) {
        // Wrap into an object, since we can only pass one argument through.
        observer.next({snapshot: snap, prevName: prevName});
      }
    }
  };

  Firebase.prototype.__proto__.observe = function(eventType) {
    var query = this;
    return Rx.Observable.create(function(observer) {
      var listener = query.on(eventType, makeCallback(eventType, observer), function(error) {
        observer.error(error);
      });
      return function() {
        query.off(eventType, listener);
      }
    }).publish().refCount();
  };
})();

/**
 * Usage:
 *
 * var source = new Firebase("https://<your firebase>.firebaseio.com").observe('<event type>');
 * console.log(source instanceof Rx.Observable);
 * source.subscribe(function(changeData) {
 *   // If event type is 'value', changeData is a DataSnapshot
 *   // Otherwise, changeData is {snapshot: DataSnapshot, prevName: optional string of previous child location}
 * });
 *
 */

var myFirebaseRef = new Firebase("https://multi-test.firebaseio.com/");
var usersRef = myFirebaseRef.child("users");


usersRef.update({"zia": {
  name: "Zia Khan",
  location: "Karachi"
}});

var source = postsRef.observe('child_added');
console.log(source instanceof Rx.Observable);
source.subscribe(function(changeData) {
        // If event type is 'value', changeData is a DataSnapshot
        // Otherwise, changeData is {snapshot: DataSnapshot, prevName: optional string of previous child location}
        console.log(changeData.snapshot.key() + ": " + JSON.stringify(changeData.snapshot.val()));
});


usersRef.update({"zeeshan": {
  name: "Zeeshan Hanif",
  location: "USA"
}});

