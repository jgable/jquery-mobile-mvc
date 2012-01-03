/* jquery.mobile.mvc.js 
   Website - http://github.com/jacob4u2/jquery-mobile-mvc
   By: Jacob Gable - http://jacob4u2.posterous.com
   License: Microsoft Public License / MIT
*/

(function ($, undefined) {

	if(!$.mobile) {
		throw "jquery-mobile-mvc must have jQuery Mobile to continue";
	}
	
	var pages = {},
		defaults = {
			pageNS: pages,
			pageKeyAttr: "data-page-key"		
		},
		pageEvents = "pagebeforecreate pagecreate pageinit pagebeforeshow pageshow pagebeforehide pagehide",
		fromDialog = false,
		dialogHandler = function (event) {
			var type = event.type.slice(4) + "dialog";

			// Using slice to cover both 'hidedialog' and 'beforehidedialog'.
			fromDialog = type.slice(-10) === "hidedialog";
			
			// Pass it down to our handlePageEvent.
			handlePageEvent(this, type);
		},
		pageHandler = function (event) {
			var evtType = event.type.slice(4);
			
			handlePageEvent(this, evtType);
		},
		navLinkHandler = function (e) {
			$.mobile.mvc.state = $.extend({}, $(this).data());        
		},
		settings = $.extend(defaults, $.mobile.mvcOptions)
		
	
    if($.fn.on) {
		// Use .on if it's available (jQuery 1.7) for performance (http://jsperf.com/jquery-live-vs-delegate-vs-on)
		$(document).on("div[data-role*='dialog']", pageEvents, dialogHandler);
		$(document).on("div[data-role*='page']", pageEvents, pageHandler);
		$(document).on(".navLink", "click", navLinkHandler);
	} else {
		$("div[data-role*='dialog']").live(pageEvents, dialogHandler);
		$("div[data-role*='page']").live(pageEvents, pageHandler);
		
		// Handle clicks on nav links by setting the navigation state 
		$(".navLink").live("click", navLinkHandler);
	}

    // page event handler
    function handlePageEvent(page, evtName) {

        // Bypass show events when coming back from a dialog
        if (fromDialog && (evtName === "beforeshow" || evtName === "show")) {

            if (evtName === "show") {
                // Reset fromDialog after running the show event.
                fromDialog = false;
            }

            evtName += "dialog";
        }

        // Get the id of our page from the page attribute, fall back to id if not found.
        var $this = $(page),
            thisId = $this.attr(settings.pageKeyAttr) || $this.attr("id");

        if (!thisId) {
            // Back out if no id defined...
            return;
        }
		
        // Remove any sketchy characters...
        thisId = thisId.replace(/\.html$/gi, "");

        // Check for page in the namespace and fire off the corresponding function.
        if (settings.pageNS[thisId] && ($.isFunction(settings.pageNS[thisId][evtName]))) {
            // Set the current page in the pages namespace.
			$.mobile.mvc.currPage = $this;
			
			// Run the function with the jQuery'd page container and the html element.
			settings.pageNS[thisId][evtName]($this, page);
        }
    };
	
	// Export the mvc namespace to jQuery Mobile.
	$.extend($.mobile, {
		mvc: {
			pages: settings.pageNS,
			settings: settings,
			state: undefined
		}
	});

})(jQuery);