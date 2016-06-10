//$ = jQuery = require('jquery'); // see cory's course on pluralsight
// [$]
import {config} from './services/shared';
import {NewsCarousel} from './components/news-carousel';
import {MainBanner} from './components/main-banner';
import {FooterLinks} from './components/footer-links';
import SuiteBarTop = require('./components/suite-bar-top/suite-bar-top');

import actions = require('./actions');
// import ChirpStore = require('./stores/chirps');
// [ChirpStore]
//import {API} from './services/Api';

//import {RssService} from './services/RSS';

// import {StockFeedService} from './services/StockFeed';

import {StockTicker} from './components/stock-ticker';

import {Calendar} from './components/calendar';

import {DataService} from './services/data-service';

import {EventFeed} from './services/event-feed';

import {AlertsToasterMessage} from './components/alerts-toaster-message';
import {AlertsNotification} from './components/alerts-notification';

import {MegaMenu} from './components/mega-menu';

import {FAQLinkList} from './components/faq-links';

// HR Site
import {HelpLinkList} from './components/hr/help-links';
import {BenefitsTeam} from './components/hr/benefits-team';

import {Department} from './components/search-location/department';
import {Managers} from './components/search-location/managers';
import {InfoPanel} from './components/search-location/info-panel';
import {ServicePanel} from './components/search-location/services';
import {BrandPanel} from './components/search-location/brands';
import {Hours} from './components/search-location/hours';

// import {UserProfile} from './services/UserProfile';
import {PersonDetails} from './components/search-person-detail/person-details';

import {PreviewHome} from './components/preview-home';

import {PreviewArticle} from './components/preview-article';

import {KnowRush} from './components/get-to-know-rush';
import {CSI} from './components/csi';
import {Spotlight} from './components/spotlight';
import {HomeBanner} from './components/home-banner';
import {DocumentCenter} from './components/document-center';
import {DocCenter_BPCForecast} from './components/document-centers/bpc-forecast';
// import {} from './services/DataService'; //TODO: remove after testing


//*****TEST********//
var getTerm = function (id) {
  var scriptbase = _spPageContextInfo.webServerRelativeUrl + "/_layouts/15/";      

  function getTerm()
  {
      var context = SP.ClientContext.get_current();         
      var taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);  
      var term=taxSession.getTerm(id);
      context.load(term);
      context.executeQueryAsync(function() {
            console.log(term.get_name());
          },
          function() {
            console.log('failed!');
          });
  }

  $.getScript(scriptbase + "SP.Taxonomy.js", getTerm);   
  
};
//********TEST*******//


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
						$('#O365_MainLink_Logo').attr('href', '/sites/rushnet');

						$('span.o365cs-nav-brandingText').html('<h1>RushNet</h1>'); // Add Intranet Name
						$('span.o365cs-nav-brandingText').attr('style', 'visibility: visible;');

						$('a.o365cs-nav-appTitle.o365cs-topnavText.o365button').attr('href', '/sites/rushnet');
						$('a.o365cs-nav-appTitle.o365cs-topnavText.o365button').removeAttr('style');
						$('span.o365cs-nav-appTitle.o365cs-topnavText').removeAttr('style');
						$('.o365cs-nav-appTitleLine.o365cs-nav-brandingText.o365cs-topnavText.o365cs-rsp-tw-hide.o365cs-rsp-tn-hide').removeAttr('style');

						$('.o365cs-nav-centerAlign').attr('style', 'font-size:15px; color:#fff; text-align:right;');

						$('span.o365cs-nav-brandingText').parent().attr('style', 'vertical-align: bottom; margin-bottom: 4px;'); // Tim
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
        //let abs_url = config.abs_url;
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
									//$('.o365cs-rsp-off .o365cs-rsp-off-hide').attr('style', 'display: none!important');
									$('.o365cs-rsp-off-hide').attr('style', 'display: none!important');
									$('.o365cs-rsp-m-hide').attr('style', 'display: none!important');
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
    let pathname = window.location.pathname.toLowerCase();
		//console.log(`pathame: ${pathname}`);

    // Documents/nationalaccounts site
    if(pathname.indexOf('/documents/nationalaccounts') > 0) {
      let doc = new DocumentCenter(null);
      doc.showComponent();
    }

		// BPC Forecast Document Library		
		if(pathname.indexOf('/documents/finance/pages/bpc-forecast') > 0) {
			let doc = new DocCenter_BPCForecast(null);
			doc.showComponent();
		}
    
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
      
      var knowRush = new KnowRush(null);
      knowRush.showComponent();
      
      var csi = new CSI(null);
      csi.showComponent();
      
      let spotlight = new Spotlight(null);
      spotlight.showComponent();
      
      let banner = new HomeBanner(null);
      banner.showComponent();    
           
      // var columns = [
      //   'Publish_x0020_Start_x0020_Date',
      //   'Publish_x0020_End_x0020_Date',
      //   'EncodedAbsUrl',
      //   'ArticleURL'
      // ];
      // var service = new DataService();
      // service.getListItems('rushnet','GetToKnowRushEnterprises', columns).then((data)=>{
      //   console.log(JSON.stringify(data,null,4));
      // });        
            
		}

		if ($('#hr-benefits').length) {
			// Code that targets the hr-benefits page goes here
			var helpLinks = new HelpLinkList(null);
			helpLinks.showComponent();

			var benefits = new BenefitsTeam(null);
			benefits.showComponent();
		}

		if ($('#RushSearchLocationDetail').length) {
			var info = new InfoPanel(null);
			info.showComponent();

			var department = new Department(null);
			department.showComponent();

			var managers = new Managers(null);
			managers.showComponent();

			var services = new ServicePanel(null);
			services.showComponent();

			var brands = new BrandPanel(null);
			brands.showComponent();

			var hours = new Hours(null);
			hours.showComponent();
		}

		if ($('#RushSearchPersonDetail').length) {
			// var profile = new UserProfile();
			// profile.getSPUserProfile();
			var profile = new PersonDetails(null);
			profile.showComponent();
		}

		if ($('#ArticleList').length) {
			var preview = new PreviewHome(null);
			preview.showComponent();
		}

		if ($('#PreviewContent').length) {
			var article = new PreviewArticle(null);
			article.showComponent();
		}


		/*Render Stock Ticker*/
		var stockTicker = new StockTicker(null);
		stockTicker.show();

	});
