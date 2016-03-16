;(function() {
  angular.module('example', ['rx']) .controller('AppCtrl', function($scope, firebaseRef) {
    var usersRef = firebaseRef.child("users");
    usersRef.update({"zia": {
        name: "Zia Khan",
        location: "Karachi"
    }});

    $scope.users = [];
    var source = usersRef.observe('child_added');
    console.log(source instanceof Rx.Observable);
    source.subscribe(function(changeData) {
        // If event type is 'value', changeData is a DataSnapshot
        // Otherwise, changeData is {snapshot: DataSnapshot, prevName: optional string of previous child location}
        var user = {
            id : changeData.snapshot.key(),
            data: changeData.snapshot.val()
        };
        
        console.log( user.id + ": " + JSON.stringify(user.data));
        $scope.users.push(user);
    });
   

    usersRef.update({"zeeshan": {
        name: "Zeeshan Hanif",
        location: "USA"
    }});
    
  }).factory("firebaseRef", function(rx){
   //https://gist.github.com/gsoltis/ee20138502a4764650f2
   
   var makeCallback = function(eventType, observer) {
    if (eventType === 'value') {
      return function(snap) {
        observer.onNext(snap);
      };
    } else {
      return function(snap, prevName) {
        // Wrap into an object, since we can only pass one argument through.
        observer.onNext({snapshot: snap, prevName: prevName});
      }
    }
  };
  
  Firebase.prototype.__proto__.observe = function(eventType) {
    var query = this;
    return rx.Observable.create(function(observer) {
      var listener = query.on(eventType, makeCallback(eventType, observer), function(error) {
        observer.onError(error);
      });
      return function() {
        query.off(eventType, listener);
      }
    }).publish().refCount();
  };
   
  var myFirebaseRef = new Firebase("https://multi-test.firebaseio.com/"); 
      
  return myFirebaseRef;
      
      
  });
}());


// Array Remove - By John Resig (MIT Licensed) http://stackoverflow.com/questions/500606/javascript-array-delete-elements
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
