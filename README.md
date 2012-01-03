# jQuery Mobile MVC Plugin

## Create MVC Style Handlers for your jQuery Mobile Pages

### Examples

(function($) {

	// Create a base page...
	var basePage = {
			name: "default",
			show: function($page) {
				log("showing the " + this.name + " page");
				
				disco.trackPage(this.name, "demo");
			}
		},
		// Our welcome page inherits from the basePage and adds a "create" handler.
		welcomePage = $.extend({}, basePage, {
			name: "welcome",
			trackClick: function(name) {
				// Track a button click
				disco.trackEvent(this.name, "demo");
			},
			create: function($page) {
				var self = this;
				
				this.$aboutLink = $page.find("#aboutLink");
				this.$installLink = $page.find("#installLink");
				this.$contactLink = $page.find("#contactLink");
				
				this.$aboutLink.click(function() { self.trackClick("aboutLink"); });
				this.$installLink.click(function() { self.trackClick("installLink"); });
				this.$contactLink.click(function() { self.trackClick("contactLink"); });
			}
		}),
		// The about page.
		aboutPage = $.extend({}, basePage, {
			name: "about"
		}),
		// The contact page.
		contactPage = $.extend({}, basePage, {
			name: "contact",
			create: function($page) {
				$page.find("#mailLink").click(function() {
					disco.trackEvent("mailLink", "demo");
				});
			}
		});
		
		// Export our pages to the 
		$.extend($.mobile.mvc.pages, {
			welcome: welcomePage,
			about: aboutPage,
			contact: contactPage
		});
	
})(jQuery);

Packaged up by [Jacob Gable](http://jacob4u2.posterous.com).

This project is licensed under the Microsoft Public License (Ms-PL) and MIT License.