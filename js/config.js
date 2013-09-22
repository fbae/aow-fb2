// Sets the require.js configuration for your application.
require.config( {
	// 3rd party script alias names (Easier to type 'jquery' than 'libs/jquery-1.8.2.min')
	paths: {
		// Core Libraries
		'jquery': 'vendor/jquery-2.0.3.min',
		'jquerymobile': 'vendor/jquery.mobile-1.3.2.min',
		'parseURL': 'vendor/purl',
		'text':'vendor/text', //require text-Plugin
		'underscore': 'vendor/underscore',
		'backbone': 'vendor/backbone.min'
	},
	// Sets the configuration for your third party scripts that are not AMD compatible
	shim: {
		underscore: {
			exports: '_'
		},
		'backbone': {
			'deps': [ 'underscore', 'jquery' ],
			'exports': 'Backbone' //attaches 'Backbone' to the window object
		}
	} // end Shim Configuration
} );

// Includes File Dependencies
require(['jquery','backbone','router','fb2Model'], function( $, Backbone, Fb2Router, Fb2 ) {

	function twoDigits(d) {
		if(0 <= d && d < 10) return "0" + d.toString();
		if(-10 < d && d < 0) return "-0" + (-1*d).toString();
		return d.toString();
	}
	Date.prototype.toMysqlFormat = function() {
		return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + 
			twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + 
			twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
	};

	$( document ).on( "mobileinit",
		function() {
			// Prevents all anchor click handling including the addition of active button state and alternate link bluring.
			$.mobile.linkBindingEnabled = false;
			// Disabling this will prevent jQuery Mobile from handling hash changes
			$.mobile.hashListeningEnabled = false;
		}
	);
	
	require( [ "jquerymobile", 'parseURL' ], function() {
		this.router = new Fb2Router();
		fb2.router = this.router;

		// ohne localStorage nicht weitermachen und Fehlerseite anzeigen
		if (!localStorage) {
			$.mobile.changePage( '#FlS', {reverse: false, changeHash: false} );			
			return false;
		}

		// GeräteNamen setzen, falls in url übergeben wurde
		var device = $.url().param('device');
		if (device) fb2.set({'device':device});

		// StartTag und StartZeit setzten, falls welche übergeben wurden
		var tagS = $.url().param('st');
		var zeitS = $.url().param('sz');

		if (tagS !== undefined) { // TODO: testen
			var tagA = tagS.split('-');
			var sT = new Date(parseInt(tagA[0]),parseInt(tagA[1])-1,parseInt(tagA[2]));
			if (!zeitS) fb2.set({'tag': sT});
		}

		if (zeitS) { // TODO: testen
			var zeitA = zeitS.split(':');
			var zeitStd = parseInt(zeitA[0]);
			var zeitMin = parseInt(zeitA[1]);
			if (!sT) var sT = fb2.get('tag');
			sT.setHours(zeitStd);
			sT.setMinutes(zeitMin);
			fb2.set({'tag': sT});
		}
	
		console.debug( 'chrome:alarm: ', chrome, chrome.alarms);
	});
} );
