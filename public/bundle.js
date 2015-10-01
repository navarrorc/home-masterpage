(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path='../../typings/tsd.d.ts'/>
var widgets = require('./components/topHeaderWidgets');
var news = require('./components/newsCarousel');
var banner = require('./components/mainBanner');
var suite = require('./components/suiteBarTop/_suiteBarTop');
var myModule;
(function (myModule) {
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
                        console.info('Groups for Current User');
                        var currentGroup;
                        while (groupsEnum.moveNext()) {
                            currentGroup = groupsEnum.get_current();
                            console.info(currentGroup.get_loginName());
                        }
                    }, function (sender, args) {
                        console.info('Error: ' + args.get_message());
                    });
                });
            });
        };
        RenderUI.prototype.setSearchBoxPlaceHolderText = function () {
            $(function () {
                var value = $('input#ctl00_PlaceHolderSearchArea_ctl00_csr_sbox').val();
                if (value === "Search..." || value === "Search this site") {
                    $('input#ctl00_PlaceHolderSearchArea_ctl00_csr_sbox').val('');
                }
                $('input#ctl00_PlaceHolderSearchArea_ctl00_csr_sbox').attr('placeholder', 'Search People, Locations or Documents');
            });
        };
        return RenderUI;
    })();
    myModule.RenderUI = RenderUI;
    var renderUI = new RenderUI();
    renderUI.setSiteTitle();
    renderUI.showProfileInfoInConsole();
    renderUI.getUserGroups();
    renderUI.setSearchBoxPlaceHolderText();
    $(function () {
        /**
         * Testing REST endpoint
         */
        //  var service = new Services.DataService('fetching data from myService');
        //  service.getGlobalLinks().then((data)=>{
        // 	 console.info(data);
        //  });
        suite.showComponents();
        var topHeaderWidgets = new widgets.TopHeaderWidgets({ imgUrl: 'https://rushenterprises.sharepoint.com/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/Page-Layouts/images/notification-stock-widget.png' });
        topHeaderWidgets.showComponent();
        if ($('.newsCarousel').length) {
            var newsCarousel = new news.NewsCarousel({ imgUrl: 'https://rushenterprises.sharepoint.com/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/Page-Layouts/images/newsCarousel.png' });
            newsCarousel.showComponent();
            var mainBanner = new banner.MainBanner(null);
            mainBanner.showComponent();
        }
    });
})(myModule || (myModule = {}));
},{"./components/mainBanner":3,"./components/newsCarousel":4,"./components/suiteBarTop/_suiteBarTop":5,"./components/topHeaderWidgets":8}],2:[function(require,module,exports){
/**
* Helper functions
**/
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var api = require('../../services/dataService');
var image = require('./profileImage');
var links = require('./topLinks');
var helpers = require('../_helpers');
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
            console.info('email:', email);
            var url = '/sites/rushnet/_layouts/15/userphoto.aspx?size=M&accountname=' + email;
            if (helpers.isMounted(_this)) {
                _this.setState({ profileImageUrl: url, visible: true });
            }
        });
    };
    SuiteBarTop.prototype.render = function () {
        return (React.createElement(image.ProfileImage, {"imgUrl": this.state.profileImageUrl, "visible": this.state.visible}));
    };
    return SuiteBarTop;
})(React.Component);
function showComponents() {
    SP.SOD.executeOrDelayUntilScriptLoaded(function () {
        var interval = setInterval(function () {
            if ($('div.o365cs-me-tile-nophoto-username-container').length) {
                React.render(React.createElement(SuiteBarTop, null), document.querySelector('div.o365cs-me-tile-nophoto-username-container'));
                React.render(React.createElement(links.TopLinks, null), document.querySelector('div.o365cs-nav-centerAlign'));
                clearInterval(interval);
            }
        }, 1000);
    }, 'sp.core.js');
}
exports.showComponents = showComponents;
},{"../../services/dataService":9,"../_helpers":2,"./profileImage":6,"./topLinks":7}],6:[function(require,module,exports){
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
        console.info("inside render() imgUrl:", this.props.imgUrl);
        return (React.createElement("img", {"src": this.props.imgUrl, "style": this.props.visible ? { visibility: 'visible' } : { visibility: 'hidden' }, "className": "profileImage", "alt": ""}));
    };
    return ProfileImage;
})(React.Component);
exports.ProfileImage = ProfileImage;
},{}],7:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var api = require('../../services/dataService');
var helpers = require('../_helpers');
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
                    temp.push({ title: n.Title, id: n.Id });
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
        var ilStyle = {
            display: 'inline',
            marginRight: '15px',
            fontSize: '.8em',
            fontWeight: 700
        };
        var createLink = function (link) {
            return (React.createElement("li", {"style": ilStyle, "key": link.id}, link.title));
        };
        return (React.createElement("ul", {"style": ulStyle}, this.state.links.map(createLink, this)));
    };
    return TopLinks;
})(React.Component);
exports.TopLinks = TopLinks;
},{"../../services/dataService":9,"../_helpers":2}],8:[function(require,module,exports){
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
        return (React.createElement("div", null, React.createElement("img", {"src": this.props.imgUrl, "style": { height: '45px' }})));
    };
    TopHeaderWidgets.prototype.showComponent = function () {
        React.render(React.createElement(TopHeaderWidgets, {"imgUrl": this.props.imgUrl}), document.querySelector('div.topBarContainer-widgets'));
    };
    return TopHeaderWidgets;
})(React.Component);
exports.TopHeaderWidgets = TopHeaderWidgets;
},{}],9:[function(require,module,exports){
var DataService = (function () {
    function DataService(message) {
        if (message) {
            console.info(message);
        }
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
        $.get(_spPageContextInfo.webAbsoluteUrl + "/_api/web/Lists/GetByTitle('TopLinks')/items?$select=Title,ID", function (data) {
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
},{}]},{},[1])
//# sourceMappingURL=bundle.js.map
