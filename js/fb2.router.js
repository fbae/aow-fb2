// Fb2 Router
// =============

// Includes file dependencies
define(
		[ "jquery","backbone", "fb2.model", "categoriesCollection", "fb2.view" ],
		function( $, Backbone, Fb2Model, CategoriesCollection, Fb2View ) {
	// Extends Backbone.Router
	var Fb2Router = Backbone.Router.extend( {
		// The Router constructor
		initialize: function() {
			// Instantiates a new Animal Fb2 View
			this.animalsView = new Fb2View( { el: "#animals", collection: new CategoriesCollection( [] , { type: "animals" } ) } );
			// Instantiates a new Colors Fb2 View
			this.colorsView = new Fb2View( { el: "#colors", collection: new CategoriesCollection( [] , { type: "colors" } ) } );
			// Instantiates a new Vehicles Fb2 View
			this.vehiclesView = new Fb2View( { el: "#vehicles", collection: new CategoriesCollection( [] , { type: "vehicles" } ) } );
			// Tells Backbone to start watching for hashchange events
			Backbone.history.start();
		},
		// Backbone.js Routes
		routes: {
			// When there is no hash bang on the url, the home method is called
			"": "home",
			// When #fb2? is on the url, the fb2 method is called
			"fb2?:type": "fb2"
		},
		// Home method
		home: function() {
			// Programatically changes to the categories page
			$.fb2.changePage( "#categories" , { reverse: false, changeHash: false } );
		},
		// Fb2 method that passes in the type that is appended to the url hash
		fb2: function(type) {
			// Stores the current Fb2 View inside of the currentView variable
			var currentView = this[ type + "View" ];
			// If there are no collections in the current Fb2 View
			if(!currentView.collection.length) {
				// Show's the jQuery Fb2 loading icon
				$.fb2.loading( "show" );
				// Fetches the Collection of Fb2 Models for the current Fb2 View
				currentView.collection.fetch().done( function() {
					// Programatically changes to the current categories page
					$.fb2.changePage( "#" + type, { reverse: false, changeHash: false } );
				} );
			}
			// If there already collections in the current Fb2 View
			else {
				// Programatically changes to the current categories page
				$.fb2.changePage( "#" + type, { reverse: false, changeHash: false } );
			}
		}
	} );
	// Returns the Router class
	return Fb2Router;
} );
