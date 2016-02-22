declare var $: any;
declare var moment: any;

function calendar (calendar_id, events_list_id, rushEvents) {
	var $calendar = $(calendar_id),
		$events_list = $(events_list_id);

	var events = rushEvents;

	$calendar.fullCalendar({
		header: {
			left: 'prev',
			center: 'title',
			right: 'next'
		},
		buttonIcons: {
			prev: ' icon icon-chevron-left',
			next: ' icon icon-chevron-right'
		},
		editable: false,
		eventLimit: false,
		events: events,
		eventAfterAllRender: function (view, element) {
			render_hightlight_event_list(view.title);
			events_paging();
		}
	});

	function render_hightlight_event_list (month_year) {
		var client_events = $calendar.fullCalendar('clientEvents', calendar_events_filter),
			event_list_html = [ '<dl class="events-list">' ],
			format_string = 'YYYY-MM-DD';

		for (var i = 0, l = client_events.length; i < l; i++) {
			var e = client_events[i],
				date_title = moment(e.start).format('MMMM D'),
				startDay = e.start.format('D'),
				endDay = e.end.format('D');

			if ( ('end' in e && e.end !== null) && (startDay != endDay) )
				// console.log('e.start:', e.start.format('D'),' e.end:', e.end.format('D'));
				date_title += ' - ' + moment(e.end).format('D');

			event_list_html.push('<dt>', date_title, '</dt>', '<dd><a href="'+ e.url +'" title="'+e.title+'">', e.title, '</a></dd>');

			if ('end' in e && e.end !== null) {
				var diff = moment(e.end).diff(e.start, 'days');

				for (var ii = 0; ii <= diff; ii++) {
					var data_date = moment(e.start).add(ii, 'day').format(format_string);

					$calendar.find('td[data-date="' + data_date + '"]').addClass('has-event');
				}
			} else {
				var data_date = moment(e.start).format(format_string);

				$calendar.find('td[data-date="' + moment(e.start).format(format_string) + '"]').addClass('has-event');
			}
		}

		event_list_html.push('</dl>');

		$events_list.html(event_list_html.join(''));
	}

	function calendar_events_filter (e) {
		var format_string = 'MMMM YYYY';

		return moment(e.start).format(format_string) === $calendar.fullCalendar('getDate').format(format_string);
	}
}

function events_paging () {
	var per_page = 5;

	$('.events-paging[data-for-list]').each(function () {
		var $events_paging = $(this),
			$list = $('#' + $events_paging.data('for-list') + ' .events-list > *'),
			page_count = Math.ceil($list.length / 2 / per_page);

		$events_paging.html('<a id="chevron" href=""><i class="icon icon-chevron-right"></i></a>').show();

		for (var i = Math.ceil($list.length / 2 / per_page); i > 0; i--) {
			var attr = (i === 1) ? ' class="active"' : '';

			$events_paging.prepend([ '<a href=""', attr, '>', (i), '</a> ' ].join(''));
		}

		if (page_count < 2) {
			$events_paging.hide();
		}

		after_click($list, 0);

		$events_paging.on('click', 'a', function () {
			var $this = $(this),
				$links = $events_paging.find('a'),
				index = $links.index($this);

			if ($this.is(':last-child')){
				index = $links.index($links.filter('.active')) + 1;
			}

			if (index >= $links.length - 1)
				index = $links.length - 2;

			$links.removeClass('active').eq(index).addClass('active');

			if(index >= $links.length - 2 /*last page + chevron*/)
				$('#chevron').hide();
			else
				$('#chevron').show();

			after_click($list, index);

			return false;
		});
	});

	function after_click ($list, index){
		$list.each(function (i) {
			if (i >= (index * 5) * 2 && i < ((index + 1) * 5) * 2) {
				$(this).show();
			}
			else {
				$(this).hide();
			}
		});
	}
}

import {EventFeed} from '../services/EventFeed';

interface calendarProps {
  // TODO: create properties for CalendarBanner Component to use
}

export class Calendar extends React.Component<any, any> {
  constructor(props:any){
    super(props);
  }
  componentDidMount() {
    // do jquery stuff here...
    var eventFeed = new EventFeed();
		var rushEvents;
    //var rushEvents = eventFeed.getSearchResultsMock();

		eventFeed.getSearchResults('Corporate Event').then((events)=>{
			//console.log(JSON.stringify(events,null,4));
			rushEvents = events;
			calendar('#homepage-calendar', '#homepage-events-list', rushEvents);
		});
  }
  render() {
    return (
      <div className="row"  >
        <div className="col-xs-8">
          <div id="homepage-calendar" className="events-calendar"></div>
        </div>
				<div className="col-xs-4">
					<div id="homepage-events-list"></div>
					<div style={{float:"left"}}><a href="https://rushenterprises.sharepoint.com/sites/eventshub/events">View All</a></div>
					<div className="events-paging" data-for-list="homepage-events-list">
						<a id="chevron" href=""><i className="icon icon-chevron-right"></i></a>
					</div>
				</div>
      </div>
    )
  }
  showComponent() {
    React.render(
      <Calendar />,
      document.getElementById('fullCalendar'));
  }
}
