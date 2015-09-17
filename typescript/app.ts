/// <reference path="../typings/tsd.d.ts" />
module myModule {

  // if (typeof jQuery == 'undefined') {
	// 	document.write('<script type="text/javascript" src="//code.jquery.com/jquery.min.js"><' + '/script>');
	// }

	var interval = setInterval(function() {
		if ($('#O365_MainLink_Logo').length) {
			$('#O365_MainLink_Logo').html("<a href='/sites/rushnet'><img src='/sites/rushnet/SiteAssets/rushlogo.PNG' class='companyLogo'></a>");
			$('#O365_MainLink_Logo').attr("style", "visibility: visible;");
			clearInterval(interval);
		}
	}, 1000);

  export class Greeter {
    greeting: string;
    constructor(message: string) {
      this.greeting = message;
    }
    greet() {
      return "Hello, " + this.greeting + "!";
    }
  }
}
