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
  postMessage(eval('++l')); // bang!
});
</script>
````

DESCRIPTION
-----------

Cocytus provides a JavaScript sandbox.  In cocytus:

+ global variables are forbidden
+ any form of `eval()` is forbidden
  + including `new Function()`
  + and `.constructor.constuctor` which points to `Function`
+ workers are terminated on timeout

See demo.html for details

COMPATIBILITIES
---------------

Works okay:

+ iOS 6 (Safari & UIWebView)
+ Safari 6 (Mac)
+ Android 4.x (Chrome and Built-in Browsers of Nexus 7 and Galaxy 3)
+ Chrome 25
+ Firefox 19
  + make sure to `this.terminate()` in `.onerror` or you will receive multiple exceptions.
+ IE 10 (Windows 8)

Works with issues:

+ Opera 12
  + Global variables cannot be forbidden
  + `setInterval()` and `setTimeout()` are not available

Doew not work:

+ Any JavaScript runtime without Web Workers
  + node.js withtout extentions
  + IE 9 and below

### Notes on Opera

+ In opera you can't really `Object.freeze()` the global object, which holds the global variables.
+ `setInterval()` and `setTimeout()` are redefined because they are not not really run on a different thread.  It even keeps running _after_ the worker 'thread' is terminated.  And calling _worker_.`terminate()` on terminated worker raises DOM exception.

http://dev.opera.com/articles/view/web-workers-rise-up/
> Opera is built as a single-threaded browser with support for a wide variety of platforms, so our current implementation of Web Workers interleaves code execution in the single UI thread.
