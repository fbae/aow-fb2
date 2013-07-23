// Sets the require.js configuration for your application.
require.config( {
	// 3rd party script alias names (Easier to type 'jquery' than 'libs/jquery-1.8.2.min')
	paths: {
		// Core Libraries
		'jquery': 'js/vendor/jquery-2.0.3.min',
		'jquerymobile': 'js/vendor/jquery.mobile-1.3.1.min',
		'underscore': 'js/vendor/underscore',
		'backbone': 'js/vendor/backbone.min'
	},
	// Sets the configuration for your third party scripts that are not AMD compatible
	shim: {
		'backbone': {
			'deps': [ 'underscore', 'jquery' ],
			'exports': 'Backbone' //attaches 'Backbone' to the window object
		}
	} // end Shim Configuration
} );
// Includes File Dependencies
require([ "jquery", "backbone", "fb2.router" ], function( $, Backbone, fb2Router ) {
	$( document ).on( "fbInit",
		// Set up the "mobileinit" handler before requiring jQuery Mobile's module
		function() {
			// Prevents all anchor click handling including the addition of active button state and alternate link bluring.
			$.fb2.linkBindingEnabled = false;
			// Disabling this will prevent jQuery Mobile from handling hash changes
			$.fb2.hashListeningEnabled = false;
		}
	)
	require( [ "jquerymobile" ], function() {
		// Instantiates a new Backbone.js Mobile Router
		this.router = new Fb2();
	});
} );
