// jQuery DropDown
// Authored by: Justin Drentlaw (amd940)
// License: MIT

$.fn.dropDown = function(parent, options) {
	try {
		if (parent == "" || typeof parent != "string") {
			throw new Error("No parent element specified. Failed to create plugin object.");
		}
	}
	catch(e) {
		console.error(e.message);
		return;
	}
	
	// Set some vars for easy access.
	var parent = $(parent);
	var dropDown = $(this);
	
	// Insert drop down html into parent. I don't particularly like
	// this approach but it is the only way to make animations work correctly.
	var clone = dropDown.clone();
	clone.appendTo(parent);
	dropDown.remove();
	dropDown = clone;
	clone = undefined;
	
	// TODO: Change this before release.
	var settings = $.extend({
		// These are the defaults.
		display: "none",
		position: "absolute",
		color: "#333",
		backgroundColor: "#fff",
		border: "1px solid #6EA4CA",
		boxShadow: "3px 3px 3px rgba(60, 60, 60, 0.3)",
		opacity: "0"
	}, options);
	
	// Apply styles.
	dropDown.css(settings);
	// Insert line breaks and style links. Add hover effects.
	dropDown.children("a").css({'display': 'block', 'color': settings.color, 'margin': '0px', 'padding': "7px 10px"}).each(function(index, element) {
		$(element).after("<br>");
		$(element).mouseenter(function(e) {
			$(this).animate({
				'background-color': '#eee'
			});
		}).mouseleave(function(e) {
			$(this).animate({
				'background-color': '#fff'
			});
		});
	});
	//dropDown.children("a").width(width+'px');
	
	// Add invisible element that allows the mouse to traverse to the drop down without it disappearing.
	var spacer = $('<div class="spacer" style="position: absolute; left: 0px; top: -5px; width: '+parent.width()+'px; height: 5px;"></div>').prependTo(dropDown);
	
	// Reset the position of the drop down if the window is resized.
	$(window).resize(resetPosition);
	function resetPosition() {
		// Get the X and Y of the parent.
		x = parent.offset().left;
		y = parent.offset().top - $(document).scrollTop();
		// Set position of drop down.
		dropDown.css({
			top: (y+20)+'px',
			left: (x-10)+'px'
		});
	}
	// Set the position initially.
	resetPosition();
	
	
	var biggest, width = 0, runOnce = 0;
	parent.hover(function() {
		//dropDown.css("display", "block");
		
		dropDown.css({'display': 'block'}).animate({'opacity': '1'}, 400, 'swing', function() {
			if(runOnce == 0) {
				dropDown.children('a').each(function(index, element) {
					if ($(element).width() > width) {
						width = $(element).width();
						biggest = $(element);
					}
				});
				dropDown.children("a").not(biggest).width(width+'px');
				runOnce++;
			}
		}).dequeue();
	}, function() {
		//dropDown.css("display", "none");
		
		dropDown.animate({'opacity': '0'}, 400, 'swing', function() {
			dropDown.css("display", "none");
		}).dequeue();
	});
	
	// Trigger a render event once the script has finished rendering
	// the drop down box and subscribe to render events so that we
	// can re-position the drop down, just in case anything has moved.
	// (This is a fix to a bug where the drop down would be positioned
	// incorrectly if there was multiple drop downs being rendered on
	// one page in the same nav bar.)
	$(document).on('dropDown.render', resetPosition).trigger('dropDown.render');
	
	return this;
}