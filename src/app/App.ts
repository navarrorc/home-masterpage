//$ = jQuery = require('jquery'); // see cory's course on pluralsight
// [$]

import {NewsCarousel} from './components/NewsCarousel';
import {MainBanner} from './components/MainBanner';
import {FooterLinks} from './components/FooterLinks';
import SuiteBarTop = require('./components/suiteBarTop/SuiteBarTop');

import actions = require('./actions');
// import ChirpStore = require('./stores/chirps');
// [ChirpStore]
//import {API} from './services/Api';

//import {RssService} from './services/RSS';

// import {StockFeedService} from './services/StockFeed';

import {StockTicker} from './components/StockTicker';

import {Calendar} from './components/Calendar';

import {DataService} from './services/DataService';

import {EventFeed} from './services/EventFeed';

import {AlertsToasterMessage} from './components/AlertsToasterMessage';
import {AlertsNotification} from './components/AlertsNotification';

import {MegaMenu} from './components/MegaMenu';

import {FAQLinkList} from './components/FAQLinks';

import {HelpLinkList} from './components/HR/HR-HelpLinks';

import {BenefitsTeam} from './components/HR/BenefitsTeam';



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

						$('span.o365cs-nav-brandingText').html('<h1>RushNet</h1>'); // Add Intranet Name
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
					//console.info(JSON.stringify(groups,null,4));
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


		// ReactJS Component that will be rendered on the MasterPage
		var alertsMessages = new AlertsToasterMessage(null);
		alertsMessages.showComponent();

		var alertsNotificationWidget = new AlertsNotification(null);
		alertsNotificationWidget.showComponent();

		var menu = new MegaMenu(null);
		menu.showComponent();

		var footer = new FooterLinks(null);
		footer.showComponent();

		if ($('#rushnet-homepage').length) {
			// Only on homepage of Intranet
			var calendar = new Calendar(null);
			calendar.showComponent();

			var faqLinks = new FAQLinkList(null);
			faqLinks.showComponent();

			var newsCarousel = new NewsCarousel(null);
			newsCarousel.showComponent();

		}

		if ($('#hr-benefits').length) {
			// Code that targets the hr-benefits page goes here
			var helpLinks = new HelpLinkList(null);
			helpLinks.showComponent();

			var benefits = new BenefitsTeam(null);
			benefits.showComponent();
		}


		/*Render Stock Ticker*/
		var stockTicker = new StockTicker(null);
		stockTicker.show();


	});
