// Fb2 Router
// =============

// Includes file dependencies
define( function( require) {
	var $ = require('jquery');
	var Backbone = require('backbone');
	var	Fb2Model = require('model');
	var Fragen = require('fragen');

//	var MtView = require('mtView');
//	var fehlerView = require('fehlerView');

	// Extends Backbone.Router
	var Fb2Router = Backbone.Router.extend( {
		// The Router constructor
		initialize: function() {
			console.debug( 'Fragen initialisieren');
			this.fragen = new Fragen();
			console.debug( 'Fragen initialisieren - fertig');

			// Tells Backbone to start watching for hashchange events
			Backbone.history.start();
		},
		// Backbone.js Routes
		routes: {
			// When there is no hash bang on the url, the home method is called
			'': 'home',
			'S': 'speichern',
			'FlS': 'FehlerLocalStorage',
			'settings': 'settings',

			'W': 'ablaufW',
			'Q': 'ablaufQ',

			// When #a1? is on the url, the  method is called
			'f?:nr': 'frage'
		},

		home: function() {
			$.mobile.changePage( '#home' , { reverse: false, changeHash: false } );
		},
		speichern: function() {
			fb2_config.log.push({
				dt:(new Date()).getTime(), msg:'speichern nach Durchlauf ' + this.fragen.art,
				data: fb2_config.antworten[fb2_config.anzHeute]
			}); 
			this.fragen.typ = 'O';
			this.home();
		},
		FehlerLocalStorage: function() {
			$.mobile.changePage( '#FlS', { reverse: false, changeHash: false } );
		},
		settings: function() {
			//TODO
		},

		ablaufW: function() {
			this.fragen.typ = (fb2_config.artHeute) ? 'WA' : 'WB';
			fb2_config.log.push({dt:new Date(), msg:'ablaufW Typ:' + this.fragen.typ});
			localStorage.log = JSON.stringify(fb2_config.log);
			this.fragen.akt = 0;
			this.fragen.zeit = new Date();
			console.debug( 'ablaufW fragen:',this.fragen);
			var frageView = this.fragen.view();
			var view = new frageView( {collection: this.fragen} );
			view.render();
			$.mobile.changePage('#f', {reverse: false, changeHash: false} );
		},
		ablaufQ: function() {
			this.fragen.typ = (fb2_config.artHeute) ? 'QA' : 'QB';
			fb2_config.log.push({dt:new Date(), msg:'ablaufQ Typ:' + this.fragen.typ});
			localStorage.log = JSON.stringify(fb2_config.log);
			this.fragen.akt = 0;
			this.fragen.zeit = new Date();
			console.debug( 'ablaufQ fragen:',this.fragen);
			var frageView = this.fragen.view();
			var view = new frageView( {collection: this.fragen} );
			view.render();
			$.mobile.changePage('#f', {reverse: false, changeHash: false} );
		},

		// frage method that passes in the type that is appended to the url hash
		frage: function(nr) {
			if (this.fragen.typ == 'O') {
				console.warn( 'Fehler: es wurde kein Ablauf ausgewählt.' );
				return undefined;
			}
			nr = parseInt(nr);
			if ((nr !== 'NaN') && (0 <= nr) && (nr < this.fragen.anzahl())) {
				this.fragen.akt = nr;
			} else {
				if (this.fragen.akt + 1 < this.fragen.anzahl()) this.fragen.akt++;
				console.info( 'Fehler: der übergebene Parameter Nummer: ' + nr + 
						' passt nicht. Es wird versucht die nächste Frage zu wählen');
			}
			console.debug( 'frage fragen:',this.fragen);
			var frageView = this.fragen.view();
			var view = new frageView( {collection: this.fragen} );
			view.render();
			$('#f').trigger('create');
			$.mobile.changePage('#f?' + this.fragen.akt, {reverse: false, changeHash: true,
				allowSamePageTransition: true, reloadPage:false} );


/*
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
*/
		}
	} );
	// Returns the Router class
	return Fb2Router;
} );
