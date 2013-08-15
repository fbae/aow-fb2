// Sets the require.js configuration for your application.
require.config( {
	// 3rd party script alias names (Easier to type 'jquery' than 'libs/jquery-1.8.2.min')
	paths: {
		// Core Libraries
		'jquery': 'vendor/jquery-2.0.3.min',
		'jquerymobile': 'vendor/jquery.mobile-1.3.1.min',
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
	require( [ "jquerymobile", 'parseURL' ], function() {
		// Instantiates a new Backbone.js Mobile Router
		this.router = new Fb2Router();

		// erledigt restliche Initialisierungen
		fb2_config.log.push({dt:(new Date).getTime(), msg: 'Router instanziiert'});

		// ohne localStorage nicht weitermachen und Fehlerseite anzeigen
		if (!localStorage) {
			$.mobile.changePage( '#FlS', {reverse: false, changeHash: false} );			
			return false;
		}

		// log löschen, falls status == debug
		if (fb2_config.status === 'debug') localStorage.log = [];

		// GeräteNamen setzen
		if (!localStorage.device || (localStorage.device === undefined)) { //TODO: testen
			var device = $.url().param('device');
			fb2_config.device = (device !== undefined) ? device : 'oN'+(new Date()).getTime();
			fb2_config.log.push({dt: (new Date).getTime(), msg: 'device gesetzt: ' + device});
		}

		// StartTag und StartZeit setzten, falls welche übergeben wurden
		var tagS = $.url().param('st');
		if (tagS !== undefined) { // TODO: testen
			var tagA = tagS.split('-');
			var sT = new Date(parseInt(tagA[0]),parseInt(tagA[1]),parseInt(tagA[2]));
			fb2_config.tag = sT;
			fb2_config.log.push({dt: (new Date).getTime(), msg: 'Starttag aus Parameter gesetzt: ' + sT});
		} else 
			if (!localStorage.startTag) {
				var sT = new Date();
				sT.hours = 12;
				sT.minutes = 30;
				sT.seconds = 0;
				sT.millisconds = 0;
				fb2_config.tag = sT;
				fb2_config.log.push({dt: (new Date).getTime(), msg: 'Starttag auf heute gesetzt: ' + sT});
			}

		var zeitS = $.url().param('sz');
		if (zeitS) { // TODO: testen
			var zeitA = zeitS.split(':');
			var zeitStd = parseInt(zeitA[0]);
			var zeitMin = parseInt(zeitA[1]);
			if (!sT) var sT = fb2_config.tag;
			sT.setHours(zeitStd);
			sT.setMinutes(zeitMin);
			fb2_config.tag = sT;
			console.debug(sT, localStorage.startTag);
			fb2_config.log.push({dt: (new Date).getTime(), msg: 'StartZeit gesetzt: ' + sT});
		}
		localStorage.log = JSON.stringify(fb2_config.log);
	});
} );

// Globale Variable
var fb2_config = {
	version: '0.1',
	'status': 'debug', 

	fragenCollection: [],
	zeitenCollection: [],
	log: (localStorage.log) ? JSON.parse(localStorage.log) : [],
	antworten: (localStorage.antworten) ? JSON.parse(localStorage.antworten) : []
};

Object.defineProperty(fb2_config, 'device', {
	get: function() { return localStorage.device; },
	set: function(d) { localStorage.device = d}
});
Object.defineProperty(fb2_config, 'tag', {
	get: function() { return new Date(JSON.parse(localStorage.startTag)); },
	set: function(d) { localStorage.startTag = JSON.stringify(d); }
});
Object.defineProperty(fb2_config, 'anzHeute', {
	get: function() {
		return Math.floor(((new Date()).getTime() - this.tag.getTime())/1000/60/60/24);
	}
});
Object.defineProperty(fb2_config, 'artHeute', {
	get: function() {
		return Math.abs(this.anzHeute % 2);
	}
})
