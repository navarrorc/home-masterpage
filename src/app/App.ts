//$ = jQuery = require('jquery'); // see cory's course on pluralsight
// [$]

import {TopHeaderWidgets} from './components/TopHeaderWidgets';
import {NewsCarousel} from './components/NewsCarousel';
import {MainBanner} from './components/MainBanner';
import SuiteBarTop = require('./components/suiteBarTop/SuiteBarTop');

import actions = require('./actions');
// import ChirpStore = require('./stores/chirps');
// [ChirpStore]
//import {API} from './services/Api';

//import {RssService} from './services/RSS';

// import {StockFeedService} from './services/StockFeed';

import {PressCoverageReader} from './components/PressCoverageReader';

import {StockTicker} from './components/StockTicker';

import {DataService} from './services/DataService';

import {EventFeed} from './services/EventFeed';


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

						$('.o365cs-nav-centerAlign').attr('style', 'font-size:15px; color:#fff; text-align:right;');

						clearInterval(interval);
					}
				}, 1000);
			}, 'sp.core.js'); // Needed in order to properly override the suiteBarTop
		}
		// setSearchBoxPlaceHolderText() {
		// 	$(function () {
		// 			// var value = $('#SearchBox input').val();
		// 	    // if (value === "Search..." || value === "Search this site") {
		// 			// 	$('#SearchBox input').removeAttr('value');
		// 			// 	$('#SearchBox input').removeAttr('title');
		// 	    // }
		// 			// $('#SearchBox input').attr('placeholder','Search Documents, Locations, or People');
		// 	})
		// }
		showSharePointElements(){
			// Display SP Elements if site Owner
			$(()=>{
				var service = new DataService();
				var isOwner = false;
				var re = /\bOwners\b/i; // Owners SP Group
				service.getGroups().then((groups:string[])=>{
					console.info(JSON.stringify(groups,null,4));
					_.each(groups, (group)=>{
						if (group.match(re)){
							isOwner = true
						}
					});
					if (isOwner){
						// show SP elements
						SP.SOD.executeOrDelayUntilScriptLoaded(() => {
							var interval = setInterval(()=> { // wait 1 second before executing
								if($('.o365cs-nav-topItem.o365cs-rsp-tn-hideIfAffordanceOff').length){
									$('.o365cs-nav-topItem.o365cs-rsp-tw-hide.o365cs-rsp-tn-hide').attr('style', 'display: inline-block');
									$('.o365cs-nav-topItem.o365cs-rsp-tn-hideIfAffordanceOff').attr('style', 'display: inline-block!important');
									$('.o365cs-rsp-off .o365cs-rsp-off-hide').attr('style', 'display: none!important');
									$('#s4-ribbonrow').attr('style', 'display: inline');
									clearInterval(interval);
								}
							}, 3000);
						}, 'sp.core.js');
					}
				});
			})
		}
	}

	var renderUI = new RenderUI();
	renderUI.setSiteTitle();
	// renderUI.setSearchBoxPlaceHolderText();
	renderUI.showSharePointElements(); // only if site Owner

	$(()=>{
		// Render the SuiteBarTop Components
		SuiteBarTop.showComponents();
		// Display larger search icon
		$('.ms-srch-sb > .ms-srch-sb-searchLink > img').addClass('ms-srch-sbLarge-searchImg');

		console.info('test 1, 2, 3, 4, 5, 6, 7...');


		function printPageDetails(pageItem)
		{
				console.log(pageItem);
		    // console.log('Page Content: ' + pageItem.PublishingPageContent);
		    // console.log('Page Title: ' + pageItem.Title);
		    // console.log('Page Rollup Image ' + pageItem.PublishingRollupImage);
		}

		function logError(error){
		    console.log(JSON.stringify(error));
		}

		var eventFeed = new EventFeed();
		//console.log(_spPageContextInfo.webAbsoluteUrl);
		eventFeed.getSearchResuls();
		eventFeed.getPublishingPage('https://rushenterprises.sharepoint.com/sites/authoring/HR', 'Pages', 'CorporateArticleTest',['PublishingRollupImage','PublishingPageImage'],printPageDetails,logError);

		// $.ajax({
		// 	url: 'https://rushnetapi.azurewebsites.net/api/news',
		// 	//url: 'http://localhost:2331/api/test',
		// 	dataType: 'json'
		// }).done((data:any)=>{
		// 		console.log(JSON.stringify(data,null,4));
		// }).fail((jqHXR:JQueryXHR, textStatus:string, errorThrown:any)=>{
		// 	console.error(jqHXR.responseText || textStatus);
		// })

		// debugger;

		// testing stock feed
		// var stockFeed = new StockFeedService();
		// stockFeed.fetch().then((results:any)=>{
		// 	//console.log(JSON.stringify(results,null,4));
		// 	_.each(results, (value:any, index)=>{
		// 		console.log(value);
		// 	})
		// })
		// stockFeed.fetch();


		/* Render Press Coverage Component*/
		var pressCoverageReader = new PressCoverageReader(null);
		pressCoverageReader.show();

		/*Render Stock Ticker*/
		var stockTicker = new StockTicker(null);
		stockTicker.show();


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
