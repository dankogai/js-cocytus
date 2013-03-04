/*
 * $Id$
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  References:
 *    https://developer.mozilla.org/en-US/docs/DOM/Using_web_workers
 *    http://ejohn.org/blog/ecmascript-5-objects-and-properties/
 */

(function(global) {
    if (! global.document ) { // I'm a web worker
        var myFunction = global.Function;
        global.onmessage = function(event) {
            'use strict';
            var src = event.data;
            if (src.match(/^function/)) src = src.replace(/^[^\{]+/, '');
            try{
                (new myFunction(src))();
            }catch(e){
                throw e;
            }
        };
        Object.getOwnPropertyNames(global).forEach(function(p) {
                var go = global[p];
                if (!go) return;                      // undefined | null
                if (Object(go) !== go) return;        // non-objects
                if (go.hasOwnProperty('prototype')) { // has no prototype
                    // console.log(p);
                    var proto = go.prototype;
                    if (!proto.hasOwnProperty('constructor')) return;
                    // console.log(p + '.' + 'constructor');
                    delete proto.constructor;
                    Object.freeze(proto);
                }
            });
        delete global.Function;
        delete global.Worker;
        delete global.SharedWorker;
        delete global.eval;
        if (global.uneval) Object.seal(global);   // Firefox
        else               Object.freeze(global); // anything else
    } else {                // I'm a browser document
        if (! global.Worker ) throw 'Web Worker unsupported';
        var scripts = document.getElementsByTagName('script'),
            me      = scripts[scripts.length - 1],
            myuri   = me.src;
        var cocytus = function(o) {
            if (!(this instanceof cocytus)) return new cocytus(o);
            var worker = new Worker(myuri);
            // defaults
            worker.onmessage = function(ev) { console.log(ev) };
            worker.onerror = function(ev) { 
                console.log(ev);
                this.terminate();
            };
            worker.timeout = 1000; // ms
            worker.run = function(work, timeout) { 
                this.postMessage('' + work);
                if (!timeout) timeout = 0 + this.timeout;
                if (timeout) {
                    var that = this;
                    setTimeout(function(){ that.terminate() }, timeout);
                }
            };
            if (Object(o) === o) for (var p in o) worker[p] = o[p];
            return worker;
        };
        global.Cocytus = cocytus;
    }
})(this);
