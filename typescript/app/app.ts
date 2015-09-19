/// <reference path='../../typings/tsd.d.ts'/>
module myModule {
	export class RenderUI {
		constructor() {
		}
		setProfileImage() {
			jQuery(document).ready(function () {
				//see: http://sharepoint.stackexchange.com/questions/101844/why-does-sp-js-load-only-when-i-am-editing-a-web-part-page
				//see: http://blog.qumsieh.ca/2013/10/30/how-to-properly-reference-sp-js-in-a-master-page/

				SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ()=>{
					var context = SP.ClientContext.get_current();
					var oWeb = context.get_web();
					var currentUser = oWeb.get_currentUser();
					context.load(currentUser);
					context.executeQueryAsync((sender, args)=>{
						var profileImage = '<img src="/sites/rushnet/_layouts/15/userphoto.aspx?size=M&accountname=' + currentUser.get_email() + '" alt="" class="profileImage">';

						var interval = setInterval(()=> { // wait 1 second before executing
							if($('div.o365cs-me-tile-nophoto-username-container').length) {
								$('div.o365cs-me-tile-nophoto-username-container').html(profileImage);
								$('div.o365cs-me-tile-nophoto-username-container').attr('style', 'visibility: visible');
								clearInterval(interval);
							}
						}, 1000);

					}, (sender, args)=>{
						console.info('Error: ' + args.get_message());
					});
				});
			});
		};
		setSiteTitle(){
			var interval = setInterval(function() {
				if ($('#O365_MainLink_Logo').length) {
					$('#O365_MainLink_Logo').html('<a href="/sites/rushnet"><img src="/sites/rushnet/SiteAssets/rushlogo.PNG" class="companyLogo"></a>');
					$('#O365_MainLink_Logo').attr('style', 'visibility: visible');
					$('#O365_MainLink_Logo').attr('href', 'https://rushenterprises.sharepoint.com/sites/rushnet');
					$('span.o365cs-nav-brandingText').html('RushNet'); // Add Intranet Name
					$('a.o365cs-nav-appTitle.o365cs-topnavText.o365button').attr('href', 'https://rushenterprises.sharepoint.com/sites/rushnet');
					$('a.o365cs-nav-appTitle.o365cs-topnavText.o365button').removeAttr('style');
					$('span.o365cs-nav-brandingText').attr('style', 'visibility: visible');
					$('span.o365cs-nav-appTitle.o365cs-topnavText').removeAttr('style');
					$('.o365cs-nav-appTitleLine.o365cs-nav-brandingText.o365cs-topnavText.o365cs-rsp-tw-hide.o365cs-rsp-tn-hide').removeAttr('style');

					$('span.o365cs-nav-brandingText').removeAttr('style'); // variation, needed for SPTestUser1@rush-enterprises.com
					$('.o365cs-nav-centerAlign').html('Documents&nbsp;&nbsp; Locations&nbsp;&nbsp; People');
					$('.o365cs-nav-centerAlign').attr('style', 'font-size:15px; color:#fff; text-align:right;');

					clearInterval(interval);
				}
			}, 1000);
		}
		showProfileInfoOnConsole(){
			jQuery(document).ready(function () {
				SP.SOD.executeFunc('SP.js', 'SP.ClientContext', function() {
					// Make sure PeopleManager is available
					SP.SOD.executeFunc('userprofile', 'SP.UserProfiles.PeopleManager', function() {

						var context = SP.ClientContext.get_current();
						var peopleManager = new SP.UserProfiles.PeopleManager(context);
						var personProperties = peopleManager.getMyProperties();
						context.load(personProperties);
						context.executeQueryAsync(function (sender, args) {
							var properties = personProperties.get_userProfileProperties();
							var messageText = "";
							for (var key in properties) {
								messageText += "\n[" + key + "]: \"" + properties[key] + "\"";
							}
							console.info(messageText);
						}, function (sender, args) { alert('Error: ' + args.get_message()); });

					});
				});
			});
		}
	}


	var renderUI = new RenderUI();
	renderUI.setProfileImage();
	renderUI.setSiteTitle();
	renderUI.showProfileInfoOnConsole();

}
