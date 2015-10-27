$(init);

function init () {
	stock_ticker();
	homepage_news_rotator();
	content_rotator('.content-rotator .nav-link.left', '.content-rotator .nav-link.right', '.content-rotator .content');
	content_rotator('.team-content-rotator .nav-link.left', '.team-content-rotator .nav-link.right', '#team-member-content');
	calendar('#homepage-calendar', '#homepage-events-list');
	calendar('#hr-calendar', '#hr-events-list');
	mega_menu();
	accordion();
	picture_gallery();
	dropdowns();
	alerts();
}

function stock_ticker () {
	var $ticker = $('#stock-ticker'),
		$ticker_controls = $ticker.find('[class*="paging-control-"]'),
		$ticker_symbols = $ticker.find('#stock-symbols > div');

	$ticker_symbols.addClass('hide').first().removeClass('hide').addClass('show');

	$ticker_controls.on('click', function () {
		var $this = $(this),
			dir = $this.hasClass('paging-control-left') ? -1 : 1,
			index = $ticker_symbols.index($ticker_symbols.filter('.show')) + dir;

		if (index < 0) {
			index = $ticker_symbols.length - 1;
		} else if (index >= $ticker_symbols.length) {
			index = 0;
		}

		$ticker_symbols.addClass('hide').removeClass('show').eq(index).removeClass('hide').addClass('show');

		return false;
	});
}

function homepage_news_rotator () {
	var interval = setInterval(function() { // try to execute every 1 second
		if($('#press-coverage .news-link').length) {
				// the html element exists then continue
				var $anchors = $('#images-rotator-nav a'),
					$images = $('#images-rotator-images img'),
					$arrow = $('#news-rotator-active-arrow'),
					$links = $('#news-stories .news-link');

				$images.addClass('hide').eq(0).toggleClass('hide show');
				$links.eq(0).addClass('active');

				$anchors.on('click', function () {
					var $this = $(this),
						index = $anchors.index($this),
						$active_link = $links.eq(index),
						top = $active_link.position().top + ($active_link.height() / 2) - ($arrow.height() / 2);

					$links.removeClass('active').eq(index).addClass('active');

					$anchors.find('.icon').removeClass('icon-circle-full').addClass('icon-circle-empty');
					$this.find('.icon').toggleClass('icon-circle-empty icon-circle-full');
					$images.removeClass('show').addClass('hide').eq(index).toggleClass('hide show');
					$arrow.css({ top: top });

					return false;
				});

				var $new_links = $('#press-coverage .news-link'),
					page_links = '',
					per_page = 5;

					console.log('About to show 5 press coverage links');
				$new_links.filter(':lt(' + per_page + ')').show();

				for (var i = 0; i < Math.ceil($new_links.length / per_page); i++) {
					page_links += [ '<a href=""', (i == 0) ? ' class="active"' : '', '>', i + 1, '</a>' ].join('');
				}

				$('#press-paging').html(page_links).on('click', 'a', function () {
					var $this = $(this),
						index = $this.parent().find('a').index($this);

					$this.parent().find('a').removeClass('active');
					$this.addClass('active');

					// $new_links.hide();
					// $new_links.filter(':gt(' + ((index * per_page)) + '):lt(' + ((index + 1) * per_page) + ')').show();

					$new_links.each(function (i) {
						if (i > (index * per_page) - 1 && i < (index + 1) * per_page) {
							$(this).show();
						} else {
							$(this).hide();
						}
					});

					return false;
				});

				clearInterval(interval); // clear the interval and do not continue running
		}
	},1000);
}

function content_rotator (prev_link, next_link, content_wrap) {
	var $prev_link = $(prev_link),
		$next_link = $(next_link),
		$content = $(content_wrap).find('> *');

	$prev_link.on('click', function () {
		show_content(-1);

		return false;
	});
	$next_link.on('click', function () {
		show_content(1);

		return false;
	});
	$content.addClass('hide').eq(0).toggleClass('hide');

	function show_content (dir) {
		var index = $content.index($content.filter(':visible')),
			next_index = index + dir;

		if (next_index < 0) {
			next_index = $content.length - 1;
		} else if (next_index > $content.length - 1) {
			next_index = 0;
		}

		$content.addClass('hide').eq(next_index).toggleClass('hide');
	}
}

function calendar (calendar_id, events_list_id) {
	var $calendar = $(calendar_id),
		$events_list = $(events_list_id);

	var events = [{
		title: 'All Day Event',
		start: '2015-10-01'
	}, {
		title: 'Long Event',
		start: '2015-02-07',
		end: '2015-10-10'
	}, {
		id: 999,
		title: 'Repeating Event',
		start: '2015-10-09T16:00:00'
	}, {
		id: 999,
		title: 'Repeating Event',
		start: '2015-10-16T16:00:00'
	}, {
		title: 'Conference',
		start: '2015-10-11',
		end: '2015-10-13'
	}, {
		title: 'Meeting',
		start: '2015-10-12T10:30:00'
	}, {
		title: 'November Meeting',
		start: '2015-11-12T10:30:00'
	}];

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
		}
	});

	function render_hightlight_event_list (month_year) {
		var client_events = $calendar.fullCalendar('clientEvents', calendar_events_filter),
			event_list_html = [ '<dl class="events-list">' ];

		for (var i = 0, l = client_events.length; i < l; i++) {
			var e = client_events[i],
				date_title = moment(e.start).format('MMMM D');

			if ('end' in e && e.end !== null)
				date_title += ' - ' + moment(e.end).format('D');

			event_list_html.push('<dt>', date_title, '</dt>', '<dd><a href="">', e.title, '</a></dd>');

			$calendar.find('td[data-date="' + moment(e.start).format('YYYY-MM-DD') + '"]').addClass('has-event');
		}

		event_list_html.push('</dl>');

		$events_list.html(event_list_html.join(''));
	}

	function calendar_events_filter (e) {
		var format_string = 'MMMM YYYY';

		return moment(e.start).format(format_string) === $calendar.fullCalendar('getDate').format(format_string);
	}
}

function mega_menu () {
	var $anchors = $('#mega-menu a[data-group]');

	$anchors.on('click', function () {
		var $this = $(this),
			$submenu = $this.parent().parent(),
			width = 0;

		$anchors.removeClass('active');
		$this.addClass('active');

		$submenu.find('.link-group[data-group]').hide().filter('[data-group="' + $(this).data('group') + '"]').show();
		$submenu.find('.link-group:visible').each(function () {
			width += $(this).outerWidth();
		});
		$submenu.width(width);

		return false;
	});

	$('#mega-menu > li > a').on('mouseover', function () {
		var width = 0;

		$(this).parent().find('.sub-menu > .link-group:visible').each(function () {
			width += $(this).outerWidth();
		});

		$(this).parent().find('.sub-menu').width(width);
	});
}

function accordion () {
	$('.accordion .accordion-header a').on('click', function () {
		var $this = $(this),
			$icon = $this.find('.icon'),
			$accordion = $this.parent().parent(),
			up = $icon.hasClass('icon-arrow-up');

		$accordion.css({ height: up ? '60px' : 'auto' });

		$icon.toggleClass('icon-arrow-up icon-arrow-down');

		return false;
	});
}

function google_maps () {
	$('[data-map]').each(function () {
		var $this = $(this),
			geocoder = new google.maps.Geocoder(),
			map = new google.maps.Map($this[0], {
					center: { lat: -34.397, lng: 150.644 },
					zoom: 15,
					disableDefaultUI: true
				});

		geocoder.geocode({ 'address': $this.data('map') }, function (results, status) {
			if (status !== google.maps.GeocoderStatus.OK)
				return false;

			map.setCenter(results[0].geometry.location);

			new google.maps.Marker({ map: map, position: results[0].geometry.location });
		});
	});
}

function picture_gallery () {
	$('[data-gallery]').each(function () {
		var $gallery = $(this);

		$gallery.on('click', '.thumbnail', function () {
			$gallery.find('.main-image').attr('src', $(this).data('image'));

			return false;
		});
	});
}

function dropdowns () {
	$('.dropdown').each(function () {
		var $dropdown = $(this),
			$selected_item = $dropdown.find('.selected-item'),
			$dropdown_options = $dropdown.find('.dropdown-values'),
			$options = $dropdown_options.find('li');

		$selected_item.on('click', function (e) {
			e.stopPropagation();

			$('.dropdown-values').not($dropdown_options).removeClass('show');
			$dropdown_options.toggleClass('show');
		});
		$options.on('click', function () {
			$options.removeClass('active');
			$(this).addClass('active');
			$dropdown_options.toggleClass('show');
			$selected_item.find('.selected-value').text($(this).text());
		});
	});

	$(document).on('click', function (e) {
		$('.dropdown-values').removeClass('show');
	});
}

function alerts () {
	$('.alert').on('click', '.close-link a', function () {
		$(this).parent().parent().remove();

		if ($('.alert').length === 0)
			$('#alerts').remove();

		return false;
	});
}
