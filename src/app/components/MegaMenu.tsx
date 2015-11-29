import api = require('../services/DataService');

interface Department{
  title:string,
  parentGroup:number,
  children:MegaMenuLink[]
}

interface MegaMenuLink{
  linkID:number,
  parentID:number,
  tier:number,
  title:string,
  href:string,
  isNewWindow:boolean,
  column:number,
  columnTitle:string,
  children:MegaMenuLink[],
  departments:Department[]
}

function JsonToConsole(temp:any){
  var jsonString:string = JSON.stringify(temp);
  while(jsonString.length > 300)
  {
    //console.info(jsonString.substr(0,300));
    jsonString = jsonString.substr(300);
  }
  //console.info(jsonString);
}

function mega_menu () {
	var $anchors = $('#mega-menu a[data-group]'),
		is_tablet = false;

	window_size_changed();

	$anchors.on('click', function () {
		$anchors.removeClass('active');
		$(this).addClass('active');

		var $this = $(this);

		process_menu($this.parent().parent(), $this.data('group'));

		return false;
	});

	$('#mega-menu > li > a').on('mouseover', function () {
		if (is_tablet)
			return false;

		//var $this = $(this),
			var $submenu = $(this).parent().find('.sub-menu'),
			active_group = $submenu.find('a[data-group].active').data('group');

		if (!active_group)
			active_group = $submenu.find('a[data-group]:first-child').data('group');

		process_menu($submenu, active_group);
	});

	$('#mega-menu > li > a').on('click', function () {
		var $this = $(this),
			$li = $this.parent(),
			$parent = $li.parent(),
			hover_class = 'hover',
			$submenu = $li.find('.sub-menu'),
			active_group = $submenu.find('a[data-group].active').data('group');

		if (!active_group)
			active_group = $submenu.find('a[data-group]:first-child').data('group');

		if (is_tablet) {
			if ($li.hasClass(hover_class)) {
				$li.removeClass(hover_class);
			} else {
				$parent.find('> li').removeClass(hover_class);
				$li.addClass(hover_class);

				process_menu($li.find('.sub-menu'), active_group);
			}
		}

		return false;
	});

	$(window).resize(function () {
		if ($(window).width() <= 992 && !is_tablet) {
			is_tablet = true;

			window_size_changed();
		} else if ($(window).width() > 992 && is_tablet) {
			is_tablet = false;

			window_size_changed();
		}
	}).resize();

	function process_menu ($submenu, active_group) {
		var width = $('.container').width(),
			link_group_width = 'auto',
			$link_groups = $submenu.find('.link-group'),
			$active_groups = $link_groups.filter('[data-group="' + active_group + '"]');

		$link_groups.show();

		if (!is_tablet) {
			width = 1 + $submenu.find('> .link-group:first-child').outerWidth();

			$active_groups.each(function () {
				width += $(this).outerWidth();
			});
		} else {
			link_group_width = (100 / $active_groups.length) + '%';
		}

		$link_groups.filter('[data-group]:not([data-group="' + active_group + '"])').hide();
		$active_groups.width(link_group_width);
		$submenu.width(width);
	}

	function window_size_changed () {
		var $lis = $('#mega-menu > li:not(.divider)');

		if (is_tablet) {
			$lis.removeClass('is-hoverable');
		} else {
			$lis.addClass('is-hoverable');
		}
	}
}

export class MegaMenu extends React.Component<any, any> {
  constructor(props: any){
    super(props);
    this.state = {
      menu: []
    };
  }
  componentDidMount() {
    var service = new api.DataService();
    var listColumns = ['Title','Url','Opens_New_Window','Position','LinkID','ParentID','Tier','Column_Title'];
    service.getListItems('rushnet', 'Mega_Menu', listColumns).then((data:any)=>{
      var temp: MegaMenuLink[] = [];

      data = _.sortByOrder(data, ['Tier','Column_Title','Position'], ['asc','asc','asc']);
      //sort puts NULL at bottom of list

      // map data from Ajax call to fit the Link type [{title: 'link', id: 1}, ...]
      //for(var j = data.length - 1; j > 0; j--)
      for(var j = 0; j < data.length; j++)
      {
        var wasAdded = false;
        var link =
        {
          title: data[j].Title,
          href: data[j].Url,
          isNewWindow: data[j].Opens_New_Window,
          column: data[j].Position,
          linkID: data[j].LinkID,
          parentID: data[j].ParentID,
          tier: data[j].Tier,
          columnTitle: data[j].Column_Title == null ? "": data[j].Column_Title,
          children: [],
          departments: []
        };

        //search top to bottom, left to right
        var topLevel = null;
        var addToMenu = function(currentCollection:MegaMenuLink[])
        {
          if(currentCollection.length > 0 && !wasAdded)
          //sort puts NULL at bottom of list
            for(var i = 0; i < currentCollection.length; i++)
            {
              if(currentCollection[i].tier == 1)
                topLevel = currentCollection[i];
              if(currentCollection[i].linkID == link.parentID)
              {
                wasAdded = true;
                if(link.tier == 1 || link.tier == 2)
                  currentCollection[i].children.push(link);
                else if(topLevel.departments.length == 0)
                {
                  var newDepartment = {
                    title: link.columnTitle,
                    parentGroup: link.parentID,
                    children: []
                  };
                  newDepartment.children.push(link);
                  topLevel.departments.push(newDepartment);
                }
                else
                {
                  wasAdded = false;
                  for(var k = 0; k < topLevel.departments.length; k++)
                    if(topLevel.departments[k].title == link.columnTitle)
                    {
                      wasAdded = true;
                      topLevel.departments[k].children.push(link);
                      return;
                    }

                    if(!wasAdded)
                    {
                      wasAdded = true;
                      var newDepartment = {
                        title: link.columnTitle,
                        parentGroup: link.parentID,
                        children: []
                      };
                      newDepartment.children.push(link);
                      topLevel.departments.push(newDepartment);
                    }
                  }
              }
              else
                addToMenu(currentCollection[i].children);
            }
        }

        addToMenu(temp);

        if(!wasAdded)
          temp.push(link);
      };

    this.setState({
      menu: temp
    });

    JsonToConsole(temp);

    mega_menu();
    });
  }

  render(){
    var counter = 0;
    var createHeader = function(link:MegaMenuLink, index:number){
      counter++;
      var className = counter == 1 ? "active" : "";
      return (
        <div>
          {counter == 1 ? <li></li> : <li className="divider"></li>}
          <li key={index}>
            <a href={link.href} target={link.isNewWindow ? "_blank" : "_self"} className={className} >{link.title}</a>
            {link.children.length > 0 ? <SubMenu menu={link.children} options={link.departments} /> : ""}
          </li>
        </div>
      );
    }

    return (
        <div className="container clearfix">
      		<ul id="mega-menu" className="col-xs-12">

            {this.state.menu.map(createHeader, this)}

      		</ul>
      	</div>
    )
  }
  showComponent() {
    React.render(
      <MegaMenu />,
      document.getElementById('mega-menu-wrap'))
  }
}

class SubMenu extends React.Component<any, any> {
  constructor(props: any){
    super(props);
  }
  render(){
    var counter = 0;
    var generateSecondaryGroup = function(subMenu:MegaMenuLink, index:number){
      counter++;
      return (
        <a href="" data-group={subMenu.linkID} className={counter == 0 ? "active" : ""} key={index}>{subMenu.title}</a>
      );
    }

    var firstGroup:number = this.props.menu[0].linkID;
    var generateLinkGroup = function(subMenu:Department, index:number){
      if(firstGroup == -1) firstGroup = subMenu.parentGroup;

      return (
            <div className="link-group" data-group={subMenu.parentGroup} style={{display: firstGroup == subMenu.parentGroup ? 'block' : 'none'}} key={index}>
              <h2>{subMenu.title}</h2>
              <LinkGroup menu={subMenu.children} />
            </div>
      );
    };

    return (
      <div className="sub-menu">
        <div className="link-group link-group1">
          {this.props.menu.map(generateSecondaryGroup, this)}
        </div>

        {this.props.options.map(generateLinkGroup, this)}
      </div>
    )
  }
}

class LinkGroup extends React.Component<any, any> {
  constructor(props: any){
    super(props);
  }
  render(){
    var generateHelpLink = function(link:MegaMenuLink, index:number){
      return (
        <a href={link.href} target={link.isNewWindow ? "_blank" : "_self"} key={index}>{link.title}</a>
      );
    };

    return (
      <div>
        {this.props.menu.map(generateHelpLink, this)}
      </div>
    )
  }
}
