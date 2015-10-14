/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/builds/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	//$ = jQuery = require('jquery'); // see cory's course on pluralsight
	// [$]
	var topHeaderWidgets_1 = __webpack_require__(1);
	var newsCarousel_1 = __webpack_require__(2);
	var mainBanner_1 = __webpack_require__(3);
	var SuiteBarTop = __webpack_require__(4);
	__webpack_require__(9);
	var RenderUI = (function () {
	    function RenderUI() {
	    }
	    RenderUI.prototype.setSiteTitle = function () {
	        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
	            var interval = setInterval(function () {
	                if ($('#O365_MainLink_Logo').length) {
	                    $('#O365_MainLink_Logo').html('<a href="/sites/rushnet"><img src="/sites/rushnet/SiteAssets/rushlogo.PNG" class="companyLogo"></a>');
	                    $('#O365_MainLink_Logo').attr('style', 'visibility: visible');
	                    $('#O365_MainLink_Logo').attr('href', 'https://rushenterprises.sharepoint.com/sites/rushnet');
	                    $('span.o365cs-nav-brandingText').html('RushNet');
	                    $('span.o365cs-nav-brandingText').attr('style', 'visibility: visible;');
	                    $('a.o365cs-nav-appTitle.o365cs-topnavText.o365button').attr('href', 'https://rushenterprises.sharepoint.com/sites/rushnet');
	                    $('a.o365cs-nav-appTitle.o365cs-topnavText.o365button').removeAttr('style');
	                    $('span.o365cs-nav-appTitle.o365cs-topnavText').removeAttr('style');
	                    $('.o365cs-nav-appTitleLine.o365cs-nav-brandingText.o365cs-topnavText.o365cs-rsp-tw-hide.o365cs-rsp-tn-hide').removeAttr('style');
	                    $('.o365cs-nav-centerAlign').html('Documents&nbsp;&nbsp; Locations&nbsp;&nbsp; People');
	                    $('.o365cs-nav-centerAlign').attr('style', 'font-size:15px; color:#fff; text-align:right;');
	                    clearInterval(interval);
	                }
	            }, 1000);
	        }, 'sp.core.js');
	    };
	    RenderUI.prototype.showProfileInfoInConsole = function () {
	        jQuery(document).ready(function () {
	            SP.SOD.executeFunc('SP.js', 'SP.ClientContext', function () {
	                SP.SOD.executeFunc('userprofile', 'SP.UserProfiles.PeopleManager', function () {
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
	                    }, function (sender, args) { alert('Error: ' + args.get_message()); });
	                });
	            });
	        });
	    };
	    RenderUI.prototype.getUserGroups = function () {
	        jQuery(document).ready(function () {
	            //see: http://sharepoint.stackexchange.com/questions/101844/why-does-sp-js-load-only-when-i-am-editing-a-web-part-page
	            //see: http://blog.qumsieh.ca/2013/10/30/how-to-properly-reference-sp-js-in-a-master-page/
	            SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
	                var context = SP.ClientContext.get_current();
	                var oWeb = context.get_web();
	                var currentUser = oWeb.get_currentUser();
	                var allGroups = currentUser.get_groups();
	                context.load(allGroups);
	                context.executeQueryAsync(function (sender, args) {
	                    var groupsEnum = allGroups.getEnumerator();
	                    var currentGroup;
	                    while (groupsEnum.moveNext()) {
	                        currentGroup = groupsEnum.get_current();
	                    }
	                }, function (sender, args) {
	                    console.info('Error: ' + args.get_message());
	                });
	            });
	        });
	    };
	    RenderUI.prototype.setSearchBoxPlaceHolderText = function () {
	        $(function () {
	            var value = $('div.ms-srch-sb.ms-srch-sb-border>input').val();
	            if (value === "Search..." || value === "Search this site") {
	                $('div.ms-srch-sb.ms-srch-sb-border>input').val('');
	            }
	            $('div.ms-srch-sb.ms-srch-sb-border>input').attr('placeholder', 'Search Documents, Locations, or People');
	        });
	    };
	    return RenderUI;
	})();
	var renderUI = new RenderUI();
	renderUI.setSiteTitle();
	renderUI.showProfileInfoInConsole();
	renderUI.getUserGroups();
	renderUI.setSearchBoxPlaceHolderText();
	$(function () {
	    SuiteBarTop.showComponents();
	    console.info('test 1, 2, 3, 4, 5, 6, 7, 8, 9, 10...');
	    var topHeaderWidgets = new topHeaderWidgets_1.TopHeaderWidgets({ updates: 10, alerts: 3 });
	    topHeaderWidgets.showComponent();
	    if ($('.newsCarousel').length) {
	        var newsCarousel = new newsCarousel_1.NewsCarousel({ imgUrl: _spPageContextInfo.webAbsoluteUrl + '/_catalogs/masterpage/_Rushnet/home-masterpage/Page-Layouts/images/newsCarousel.png' });
	        newsCarousel.showComponent();
	        var mainBanner = new mainBanner_1.MainBanner(null);
	        mainBanner.showComponent();
	    }
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	//import React = require('react');
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var TopHeaderWidgets = (function (_super) {
	    __extends(TopHeaderWidgets, _super);
	    function TopHeaderWidgets(props) {
	        _super.call(this, props);
	    }
	    TopHeaderWidgets.prototype.render = function () {
	        return (React.createElement("div", null, React.createElement("a", {"href": "", "className": "notification float-right"}, "Alerts ", React.createElement("span", {"className": "counter red"}, "1")), React.createElement("a", {"href": "", "className": "notification float-right"}, "Updates ", React.createElement("span", {"className": "counter red"}, "10"))));
	    };
	    TopHeaderWidgets.prototype.showComponent = function () {
	        React.render(React.createElement(TopHeaderWidgets, {"updates": this.props.updates, "alerts": this.props.alerts}), document.querySelector('div.topBarContainer-widgets'));
	    };
	    return TopHeaderWidgets;
	})(React.Component);
	exports.TopHeaderWidgets = TopHeaderWidgets;


/***/ },
/* 2 */
/***/ function(module, exports) {

	//import React = require('react');
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var NewsCarousel = (function (_super) {
	    __extends(NewsCarousel, _super);
	    function NewsCarousel(props) {
	        _super.call(this, props);
	        this.foo = 42;
	    }
	    NewsCarousel.prototype.render = function () {
	        return (React.createElement("div", null, React.createElement("h1", {"style": { position: 'absolute', left: '34%' }}, "News Carousel"), React.createElement("img", {"style": { width: '100%', height: '350px' }, "src": this.props.imgUrl})));
	    };
	    NewsCarousel.prototype.showComponent = function () {
	        React.render(React.createElement(NewsCarousel, {"imgUrl": this.props.imgUrl}), document.querySelector('.newsCarousel'));
	    };
	    return NewsCarousel;
	})(React.Component);
	exports.NewsCarousel = NewsCarousel;


/***/ },
/* 3 */
/***/ function(module, exports) {

	//import React = require('react');
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MainBanner = (function (_super) {
	    __extends(MainBanner, _super);
	    function MainBanner(props) {
	        _super.call(this, props);
	    }
	    MainBanner.prototype.render = function () {
	        return (React.createElement("div", null, React.createElement("h1", {"style": { position: 'absolute', left: '40%' }}, "Main Banner")));
	    };
	    MainBanner.prototype.showComponent = function () {
	        React.render(React.createElement(MainBanner, null), document.querySelector('.mainBanner'));
	    };
	    return MainBanner;
	})(React.Component);
	exports.MainBanner = MainBanner;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var api = __webpack_require__(5);
	var ProfileImage = __webpack_require__(6);
	var TopLinks = __webpack_require__(7);
	var helpers = __webpack_require__(8);
	var SuiteBarTop = (function (_super) {
	    __extends(SuiteBarTop, _super);
	    function SuiteBarTop() {
	        _super.call(this);
	        this.state = { profileImageUrl: '', visible: false };
	    }
	    SuiteBarTop.prototype.componentDidMount = function () {
	        var _this = this;
	        var service = new api.DataService('fetching data from myService');
	        service.getSPUser()
	            .then(function (data) {
	            var email = data.Email;
	            var url = '/sites/rushnet/_layouts/15/userphoto.aspx?size=M&accountname=' + email;
	            if (helpers.isMounted(_this)) {
	                _this.setState({ profileImageUrl: url, visible: true });
	            }
	        });
	    };
	    SuiteBarTop.prototype.render = function () {
	        return (React.createElement(ProfileImage, {"imgUrl": this.state.profileImageUrl, "visible": this.state.visible}));
	    };
	    return SuiteBarTop;
	})(React.Component);
	function showComponents() {
	    SP.SOD.executeOrDelayUntilScriptLoaded(function () {
	        var interval = setInterval(function () {
	            if ($('div.o365cs-me-tile-nophoto-username-container').length) {
	                React.render(React.createElement(SuiteBarTop, null), document.querySelector('div.o365cs-me-tile-nophoto-username-container'));
	                React.render(React.createElement(TopLinks, null), document.querySelector('div.o365cs-nav-centerAlign'));
	                clearInterval(interval);
	            }
	        }, 1000);
	    }, 'sp.core.js');
	}
	exports.showComponents = showComponents;


/***/ },
/* 5 */
/***/ function(module, exports) {

	var DataService = (function () {
	    function DataService(message) {
	    }
	    DataService.prototype.getSPUser = function () {
	        var deferred = $.Deferred();
	        $.get(_spPageContextInfo.webAbsoluteUrl + "/_api/Web/CurrentUser?$select=Email", function (data, status) {
	            deferred.resolve(data);
	        }, 'json').fail(function (sender, args) {
	            deferred.reject(sender, args);
	            console.info('Error: ' + args.get_message());
	        });
	        return deferred.promise();
	    };
	    DataService.prototype.getTopLinks = function () {
	        var deferred = $.Deferred();
	        $.get("https://rushenterprises.sharepoint.com/sites/rushnet/_api/web/Lists/GetByTitle('TopLinks')/items?$select=Title,ID,Url", function (data) {
	            deferred.resolve(data.value);
	        }, 'json').fail(function (sender, args) {
	            console.error(args, 'status:', sender.status, '$.get() in getTopLinks() failed!');
	            deferred.reject("Ajax call failed in getTopLinks()");
	        });
	        return deferred.promise();
	    };
	    return DataService;
	})();
	exports.DataService = DataService;


/***/ },
/* 6 */
/***/ function(module, exports) {

	//import React = require('react');
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ProfileImage = (function (_super) {
	    __extends(ProfileImage, _super);
	    function ProfileImage(props) {
	        _super.call(this, props);
	    }
	    ProfileImage.prototype.render = function () {
	        return (React.createElement("img", {"src": this.props.imgUrl, "style": this.props.visible ? { visibility: 'visible' } : { visibility: 'hidden' }, "className": "profileImage", "alt": ""}));
	    };
	    return ProfileImage;
	})(React.Component);
	module.exports = ProfileImage;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var api = __webpack_require__(5);
	var helpers = __webpack_require__(8);
	var TopLinks = (function (_super) {
	    __extends(TopLinks, _super);
	    function TopLinks(props, state) {
	        _super.call(this, props, state);
	        this.state = { links: [] };
	    }
	    TopLinks.prototype.componentDidMount = function () {
	        var _this = this;
	        if (helpers.isMounted(this)) {
	            var service = new api.DataService();
	            service.getTopLinks().then(function (data) {
	                var temp;
	                temp = [];
	                _.map(data, function (n) {
	                    temp.push({ title: n.Title, id: n.Id, url: n.Url });
	                });
	                _this.setState({
	                    links: temp
	                });
	            });
	        }
	    };
	    TopLinks.prototype.render = function () {
	        var ulStyle = {
	            listStyleType: 'none',
	            margin: 0,
	            padding: 0
	        };
	        var liStyle = {
	            display: 'inline',
	            marginRight: '15px',
	            fontSize: '.8em',
	            fontWeight: 700
	        };
	        var aStyle = {
	            color: '#fff'
	        };
	        var createLink = function (link) {
	            return (React.createElement("li", {"style": liStyle, "key": link.id}, React.createElement("a", {"style": aStyle, "href": link.url}, link.title)));
	        };
	        return (React.createElement("ul", {"style": ulStyle, "className": 'topLinks'}, this.state.links.map(createLink, this)));
	    };
	    return TopLinks;
	})(React.Component);
	module.exports = TopLinks;


/***/ },
/* 8 */
/***/ function(module, exports) {

	//import React = require('react');
	function isMounted(component) {
	    try {
	        React.findDOMNode(component);
	        return true;
	    }
	    catch (e) {
	        return false;
	    }
	}
	exports.isMounted = isMounted;
	;


/***/ },
/* 9 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map