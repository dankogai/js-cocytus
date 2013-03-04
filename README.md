cocytus.js
==========

A sandboxed web worker without eval() and assignments to global variables

SYNOPSIS
--------

````
<script src="cocytus.js"></script>
<script>
var jail = Cocytus();
jail.run(function() {
  var l = 42;
  postMessage(l);
  g = 42; // see what happens in console
  postMessage(g);
});
</script>
````

See demo.html for details
