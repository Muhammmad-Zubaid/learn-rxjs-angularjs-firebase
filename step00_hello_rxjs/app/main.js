var button = document.getElementById('button');

var clicks = Rx.Observable.fromEvent(button, "click");



clicks.subscribe(
  function(x){ alert("clicked") },
  function(err){ alert("error")},
  function(){ alert('Completed') }
);