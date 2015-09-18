/// <reference path="../../typings/tsd.d.ts"/>
module myModule {
	export class SimpleUserProfile {
		constructor() {
		}
		setProfileImage() {
			SP.SOD.executeOrDelayUntilScriptLoaded(()=>{ // must wait for sp.js to be loaded
				var context = SP.ClientContext.get_current();
				var oWeb = context.get_web();
				var currentUser = oWeb.get_currentUser();
				context.load(currentUser);
				context.executeQueryAsync((sender, args)=>{
					console.info(currentUser.get_email());
					var profileImage = '<img src="/sites/rushnet/_layouts/15/userphoto.aspx?size=M&accountname=' + currentUser.get_email() +'" alt="" class="profileImage">';

					var interval = setInterval(()=> { // wait 1 second before executing
						console.info($("div.o365cs-me-tile-nophoto-username-container").html());
						$("div.o365cs-me-tile-nophoto-username-container").html(profileImage);
						$("div.o365cs-me-tile-nophoto-username-container").attr("style", "visibility: visible");
					}, 1000);

				}, (sender, args)=>{
					console.info('Error: ' + args.get_message());
				});
			}, 'sp.js');
		};
	}

	// set profile image
	var profile = new SimpleUserProfile();
	profile.setProfileImage();

	// set logo and site title in suiteBarTop
	var interval = setInterval(function() {
		if ($('#O365_MainLink_Logo').length) {
			$('#O365_MainLink_Logo').html("<a href='/sites/rushnet'><img src='/sites/rushnet/SiteAssets/rushlogo.PNG' class='companyLogo'></a>");
			$('#O365_MainLink_Logo').attr("style", "visibility: visible;");
			$('span.o365cs-nav-brandingText').html("Rushnet"); // Add Intranet Name
			$("a.o365cs-nav-appTitle.o365cs-topnavText.o365button").attr("href", "https://rushenterprises.sharepoint.com/sites/rushnet");
			$('span.o365cs-nav-brandingText').attr("style", "visibility: visible;");
			$('.o365cs-nav-centerAlign').html("Documents&nbsp;&nbsp; Locations&nbsp;&nbsp; People");
			$('.o365cs-nav-centerAlign').attr("style", "font-size:15px; color:#fff; text-align:right;");

			clearInterval(interval);
		}
	}, 1000);


}
