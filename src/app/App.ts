//$ = jQuery = require('jquery'); // see cory's course on pluralsight
// [$]

import {TopHeaderWidgets} from './components/TopHeaderWidgets';
import {NewsCarousel} from './components/NewsCarousel';
import {MainBanner} from './components/MainBanner';
import SuiteBarTop = require('./components/suiteBarTop/SuiteBarTop');

import actions = require('./actions');
// import ChirpStore = require('./stores/chirps');
// [ChirpStore]
import {API} from './services/api';
import {RssService} from './services/RSS';

import {Reader} from './components/Reader';

// CSS Dependencies
/*
	See webpack.config.js
	Using the 'extract-text-webpack-plugin' to extract the css to a file
*/
require('../sass/styles.scss'); // see http://www.pluralsight.com/training/Player?author=joe-eames&name=webpack-fundamentals-m3&clip=4&course=webpack-fundamentals

class RenderUI {
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
						//console.info('Groups for Current User');
						var currentGroup:SP.Group;						while (groupsEnum.moveNext()){
							// console.info(groupsEnum.get_current());
							currentGroup = groupsEnum.get_current();
							//console.info(currentGroup.get_loginName());
						}

					}, (sender, args)=>{
						console.info('Error: ' + args.get_message());
					});
				});
			});
		}
		setSearchBoxPlaceHolderText() {
			$(function () {
					var value = $('#SearchBox input').val();
			    if (value === "Search..." || value === "Search this site") {
						$('#SearchBox input').removeAttr('value');
						$('#SearchBox input').removeAttr('title');
			    }
					$('#SearchBox input').attr('placeholder','Search Documents, Locations, or People');
			})
		}
	}

	var renderUI = new RenderUI();
	renderUI.setSiteTitle();
	renderUI.showProfileInfoInConsole();
	renderUI.getUserGroups();
	renderUI.setSearchBoxPlaceHolderText();

	$(()=>{
		// Render the SuiteBarTop Components
		SuiteBarTop.showComponents();
		console.info('test 1, 2, 3, 4...');
		// debugger;

		var reader = new Reader(null);
		reader.show();

		// testing out the rss node module
		var rssService = new RssService();
		rssService.fetch().then((data:any[])=>{
		  console.log(JSON.stringify(data[0],null,4));
		  console.log('length: ', data.length);
		});


		// Render the News Carousel on the Home Page
		//var topHeaderWidgets = new TopHeaderWidgets({updates: 10, alerts: 3});
		//topHeaderWidgets.showComponent();

		// if ($('.newsCarousel').length){
		// 	/**
		// 	 * Only render for Home-Page Layout
		// 	 */
		// 	var newsCarousel = new NewsCarousel({imgUrl: _spPageContextInfo.webAbsoluteUrl +'/_catalogs/masterpage/_Rushnet/home-masterpage/Page-Layouts/images/newsCarousel.png'});
		// 	newsCarousel.showComponent();
		// 	// see: http://stackoverflow.com/questions/25773668/react-js-render-components-at-different-locations
		//
		// 	var mainBanner = new MainBanner(null); // no properties being passed to the constructor
		// 	mainBanner.showComponent();
		// }
	});
