// Sets the require.js configuration for your application.
require.config( {
	// 3rd party script alias names (Easier to type 'jquery' than 'libs/jquery-1.8.2.min')
	paths: {
		// Core Libraries
		'jquery': 'vendor/jquery-2.0.3.min',
		'jqueryCookie': 'vendor/jquery.cookie',
		'jquerymobile': 'vendor/jquery.mobile-1.3.1.min',
		'text':'vendor/text', //require text-Plugin
		'underscore': 'vendor/underscore',
		'backbone': 'vendor/backbone.min'
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
require([ "jquery", "backbone", "router" ], function( $, Backbone, Fb2Router ) {
	$( document ).on( "mobileinit",
		// Set up the "mobileinit" handler before requiring jQuery Mobile's module
		function() {
			// Prevents all anchor click handling including the addition of active button state and alternate link bluring.
			$.mobile.linkBindingEnabled = false;
			// Disabling this will prevent jQuery Mobile from handling hash changes
			$.mobile.hashListeningEnabled = false;
		}
	)
	require( [ "jquerymobile", 'jqueryCookie' ], function() {
		// Instantiates a new Backbone.js Mobile Router
		this.router = new Fb2Router();

		// erledigt restliche Initialisierungen
		fb2_config.log.push({dt:(new Date).getTime(), msg: 'Router instanziiert'});

		if ($.cookie('device') && fb2_config.device && fb2_config.device === undefined) {
			fb2_config.device = $.cookie('device');
			fb2_config.log.push({dt: (new Date).getTime(), msg: 'Cookie gefunden: ' + fb2_config.device});
		} else { // Gerätenamen als default setzen (später im Cookie-Manager ändern?) TODO: testen
			var device = new RegExp('device=([^&amp;#]*)').exec(window.location.href);
			console.debug('device', device);
			fb2_config.device = (typeof device === 'array') ? device[1] : 'umauo01';
			$.cookie('device',fb2_config.device);
			fb2_config.log.push({dt: (new Date).getTime(), msg: 'Cookie gesetzt: ' + fb2_config.device});
		}

		localStorage.log = JSON.stringify(fb2_config.log);
	});
} );

// Globale Variable
var fb2_config = {
	device: undefined,
	fragenCollection: [],
	zeitenCollection: [],
	log: (localStorage.log) ? JSON.parse(localStorage.log) : [],
	antworten: (localStorage.antworten) ? JSON.parse(localStorage.antworten) : [],
}
