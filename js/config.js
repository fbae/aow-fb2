// Sets the require.js configuration for your application.
/*
 * Dateien die eventuell aktualisiert werden könnten
 * Stand: 7.1.2014
 *	require -> 2.1.9
 *	text-Plugin von require
 *	backbone -> 1.1.0
 *	underscore -> 1.5.2
 *	jquery-2.0.3
 *	jquery.mobile-1.4.0
 *	purl
 *
 */
require.config( {
	paths: {
		// Core Libraries
		'jquery': 'vendor/jquery-2.0.3.min',
		'jquerymobile': 'vendor/jquery.mobile-1.3.2.min',
		'parseURL': 'vendor/purl',
		'text':'vendor/text', //require text-Plugin
		'underscore': 'vendor/underscore.min',
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

// indexedDB initialisieren
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

// Includes File Dependencies
require(['jquery','backbone'], function( $, Backbone ) {

	if ( !window.indexedDB ) {
		// Fehlermeldung anzeigen und nichts ausführen
		require( [ "jquerymobile" ], function() {
			$.mobile.changePage( '#Fehler' , { reverse: false, changeHash: false } );
		});
	} else 
 		// das Programm starten	
		require(['router','fb2Model'], function( Fb2Router, Fb2 ) {

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
			Date.prototype.toGerman = function() {
				return this.getDate() + '.' + (1 + this.getMonth()) + "." + this.getFullYear() +
					 " " + this.getHours() + ":" + this.getMinutes();
				
			}

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

				// indexedDB - Fehler anzeigen falls nicht definiert ist.
				if ( !window.indexedDB ) {
					console.error('Fehler: indexedDB');
					$.mobile.changePage( '#Fehler' , { reverse: false, changeHash: false } );
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

				// Versuchsperson setzen, falls in url übergeben
				var vpn = $.url().param('vpn');
				if (vpn) {
					fb2.set({'person':vpn});
				}
			}); // require jquerymobile
		}); // require router
}); // require jquery
