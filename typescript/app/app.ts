/// <reference path='../../typings/tsd.d.ts'/>

module myModule {
	export class RenderUI {
		constructor() {
		}
		setSiteTitle(){
			SP.SOD.executeOrDelayUntilScriptLoaded(() => {
				var interval = setInterval(()=> { // wait 1 second before executing
					if ($('#O365_MainLink_Logo').length) {
						$('#O365_MainLink_Logo').html('<a href="/sites/rushnet"><img src="/sites/rushnet/SiteAssets/rushlogo.PNG" class="companyLogo"></a>');
						$('#O365_MainLink_Logo').attr('style', 'visibility: visible');
						$('#O365_MainLink_Logo').attr('href', 'https://rushenterprises.sharepoint.com/sites/rushnet');

						$('span.o365cs-nav-brandingText').html('RushNet'); // Add Intranet Name
						$('span.o365cs-nav-brandingText').attr('style', 'visibility: visible;');

						$('a.o365cs-nav-appTitle.o365cs-topnavText.o365button').attr('href', 'https://rushenterprises.sharepoint.com/sites/rushnet');
						$('a.o365cs-nav-appTitle.o365cs-topnavText.o365button').removeAttr('style');
						$('span.o365cs-nav-appTitle.o365cs-topnavText').removeAttr('style');
						$('.o365cs-nav-appTitleLine.o365cs-nav-brandingText.o365cs-topnavText.o365cs-rsp-tw-hide.o365cs-rsp-tn-hide').removeAttr('style');

						//$('span.o365cs-nav-brandingText').removeAttr('style'); // variation, needed for SPTestUser1@rush-enterprises.com
						$('.o365cs-nav-centerAlign').html('Documents&nbsp;&nbsp; Locations&nbsp;&nbsp; People');
						$('.o365cs-nav-centerAlign').attr('style', 'font-size:15px; color:#fff; text-align:right;');

						clearInterval(interval);
					}
				}, 1000);
			}, 'sp.core.js'); // Needed in order to properly override the suiteBarTop

		}
		showProfileInfoInConsole(){
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
							//console.info(messageText);
						}, function (sender, args) { alert('Error: ' + args.get_message()); });

					});
				});
			});
		}
		getUserGroups() {
			jQuery(document).ready(function () {
				//see: http://sharepoint.stackexchange.com/questions/101844/why-does-sp-js-load-only-when-i-am-editing-a-web-part-page
				//see: http://blog.qumsieh.ca/2013/10/30/how-to-properly-reference-sp-js-in-a-master-page/

				SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ()=>{
					var context = SP.ClientContext.get_current();
					var oWeb = context.get_web();
					var currentUser = oWeb.get_currentUser();
					var allGroups = currentUser.get_groups();
					//context.load(currentUser);
					context.load(allGroups);
					context.executeQueryAsync((sender, args)=>{
						var groupsEnum = allGroups.getEnumerator();
						console.info('Groups for Current User');
						var currentGroup:SP.Group;
						while (groupsEnum.moveNext()){
							// console.info(groupsEnum.get_current());
							currentGroup = groupsEnum.get_current();
							console.info(currentGroup.get_loginName());
						}

					}, (sender, args)=>{
						console.info('Error: ' + args.get_message());
					});
				});
			});
		}
		setSearchBoxPlaceHolderText() {
			$(function () {
			    var value = $('input#ctl00_PlaceHolderSearchArea_ctl00_csr_sbox').val();
			    if (value === "Search..." || value === "Search this site") {
			        $('input#ctl00_PlaceHolderSearchArea_ctl00_csr_sbox').val('');
			    }
				// $('input#ctl00_PlaceHolderSearchArea_ctl00_csr_sbox').removeAttr('value');
				// $('input#ctl00_PlaceHolderSearchArea_ctl00_csr_sbox').removeAttr('onfocus');
				// $('input#ctl00_PlaceHolderSearchArea_ctl00_csr_sbox').removeAttr('onblur');
				// $('input#ctl00_PlaceHolderSearchArea_ctl00_csr_sbox').removeAttr('title');
				 $('input#ctl00_PlaceHolderSearchArea_ctl00_csr_sbox').attr('placeholder','Search People, Locations or Documents');
			})
		}
	}

	var renderUI = new RenderUI();
	renderUI.setSiteTitle();
	renderUI.showProfileInfoInConsole();
	renderUI.getUserGroups();
	renderUI.setSearchBoxPlaceHolderText();

	$(()=>{

		/**
		 * Testing REST endpoint
		 */
		//  var service = new Services.DataService('fetching data from myService');
		//  service.getGlobalLinks().then((data)=>{
		// 	 console.info(data);
		//  });


		// Render the SuiteBarTop Components
		C.showComponents();

		// Render the News Carousel on the Home Page
		//SP.SOD.executeOrDelayUntilScriptLoaded(() => {
				var topHeaderWidgets = new C.TopHeaderWidgets({imgUrl:'https://rushenterprises.sharepoint.com/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/Page-Layouts/images/notification-stock-widget.png'});
				topHeaderWidgets.showComponent();

				if ($('.newsCarousel').length){
					/**
					 * Only render for Home-Page Layout
					 */
					var newsCarousel = new C.NewsCarousel({imgUrl: 'https://rushenterprises.sharepoint.com/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/Page-Layouts/images/newsCarousel.png'});
					newsCarousel.showComponent();
					// see: http://stackoverflow.com/questions/25773668/react-js-render-components-at-different-locations

					var mainBanner = new C.MainBanner(null); // no properties being passed to the constructor
					mainBanner.showComponent();
				}
		//}, 'sp.core.js'); // Needed in order to properly override the suiteBarTop
	});

}
