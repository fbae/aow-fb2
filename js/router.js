// Fb2 Router
// =============

// Includes file dependencies
define(
		[ 'jquery','backbone', 'model', 'view' ],
		function( $, Backbone, Fb2Model, Fb2View ) {
	// Extends Backbone.Router
	var Fb2Router = Backbone.Router.extend( {
		// The Router constructor
		initialize: function() {
			// Instantiates a new Vehicles Fb2 View
			//frank this.vehiclesView = new Fb2View( { el: '#vehicles', collection: new CategoriesCollection( [] , { type: 'vehicles' } ) } );
			// Tells Backbone to start watching for hashchange events
			Backbone.history.start();
		},
		// Backbone.js Routes
		routes: {
			// When there is no hash bang on the url, the home method is called
			'': 'home',
			'p1': 'p1',

			// When #fb2? is on the url, the fb2 method is called
			'fb2?:type': 'frage'
		},
		// Home method
		home: function() {
			// zeigt die Start-Seite 
			$.mobile.changePage( '#home' , { reverse: false, changeHash: false } );
		},

		p1: function() {
			console.log('mobile.changePage p1');
			$.mobile.changePage( '#p1', { reverse: false, chageHash: false} );},

		// Fb2 method that passes in the type that is appended to the url hash
		frage: function(type) {
			// Stores the current Fb2 View inside of the currentView variable
			var currentView = this[ type + 'View' ];
			// If there are no collections in the current Fb2 View
			if(!currentView.collection.length) {
				// Show's the jQuery Fb2 loading icon
				$.mobile.loading( 'show' );
				// Fetches the Collection of Fb2 Models for the current Fb2 View
				currentView.collection.fetch().done( function() {
					// Programatically changes to the current categories page
					$.mobile.changePage( '#' + type, { reverse: false, changeHash: false } );
				} );
			}
			// If there already collections in the current Fb2 View
			else {
				// Programatically changes to the current categories page
				$.mobile.changePage( '#' + type, { reverse: false, changeHash: false } );
			}
		}
	} );
	// Returns the Router class
	return Fb2Router;
} );
