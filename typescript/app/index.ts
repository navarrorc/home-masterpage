/// <reference path='../../typings/tsd.d.ts'/>
$ = jQuery = require('jquery');
import sample = require('./sample2');
//import $ = require('jquery');
[sample, $]

class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

var greeter = new Greeter("world");

var button = document.createElement('button');
button.textContent = "Say Hello";
button.onclick = function() {
    alert(greeter.greet());
}

document.body.appendChild(button);
