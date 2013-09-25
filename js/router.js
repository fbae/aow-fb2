// Fb2 Router
// =============

// Includes file dependencies
define( function( require) {
	var $ = require('jquery');
	var Backbone = require('backbone');
	var	Fb2Model = require('fb2Model');
	var Fragen = require('fragen');
	var SettingsView = require('settingsView');

	// Extends Backbone.Router
	var Fb2Router = Backbone.Router.extend( {
		initialize: function() {
			console.debug( 'Fragen initialisieren');
			this.fragen = new Fragen();
			console.debug( 'Fragen initialisieren - fertig');

			Backbone.history.start();
		},

		routes: {
			// When there is no hash bang on the url, the home method is called
			'': 'home',
			'S': 'speichern',
			'FlS': 'FehlerLocalStorage',
			'settings': 'settings',

			'W': 'ablaufW',
			'Q': 'ablaufQ',
			'N': 'ablaufN',
			'A': 'ablaufA',

			// When #f? is on the url, the  method is called
			'f?:nr': 'frage'
		},

		home: function() {
			$.mobile.changePage( '#home' , { reverse: false, changeHash: false } );
		},

		speichern: function() {
			var antw = fb2.get('antworten');
			if (fb2.typ == 'A') antw.SB = fb2.get('schichtbeginn');
			fb2.log({
				msg:'speichern nach Durchlauf ' + this.fragen.art,
				data: antw
			}); 
			fb2.speichereAntworten(); // solange change:antworten nicht richtig funktioniert - mit callback?

			this.fragen.typ = 'O';
			this.home();
		},

		FehlerLocalStorage: function() {
			$.mobile.changePage( '#FlS', { reverse: false, changeHash: false } );
		},

		settings: function() {
			//TODO
			var settingsView = new SettingsView();
			settingsView.render();

			$.mobile.changePage( '#settings', { reverse: false, changeHash: false } );
		},

		ablaufW: function() {
			this.fragen.typ = (fb2.artHeute) ? 'WA' : 'WB';
			fb2.log({msg:'ablaufW Typ:' + this.fragen.typ});
			this.fragen.akt = 0;
			this.fragen.zeit = new Date();
			fb2.neueAntworten();
			var frageView = this.fragen.view();
			var view = new frageView( {collection: this.fragen} );
			view.render();
			view.$el.trigger('create');
			$.mobile.changePage('#f?0', {reverse: false, changeHash: true} );
		},
		ablaufQ: function() {
			this.fragen.typ = (fb2.artHeute) ? 'QA' : 'QB';
			fb2.log({msg:'ablaufQ Typ:' + this.fragen.typ});
			this.fragen.akt = 0;
			this.fragen.zeit = new Date();
			fb2.neueAntworten();
			var frageView = this.fragen.view();
			var view = new frageView( {collection: this.fragen} );
			view.render();
			view.$el.trigger('create');
			$.mobile.changePage('#f?0', {reverse: false, changeHash: true} );
		},
		ablaufN: function() {
			this.fragen.typ = (fb2.artHeute) ? 'NA' : 'NB';
			fb2.log({msg:'ablaufN Typ:' + this.fragen.typ});
			this.fragen.akt = 0;
			this.fragen.zeit = new Date();
			fb2.neueAntworten();
			var frageView = this.fragen.view();
			var view = new frageView( {collection: this.fragen} );
			view.render();
			view.$el.trigger('create');
			$.mobile.changePage('#f?0', {reverse: false, changeHash: true} );
		},
		ablaufA: function() {
			this.fragen.typ = 'A';
			fb2.log({msg:'ablaufA Typ:' + this.fragen.typ});
			this.fragen.akt = 0;
			this.fragen.zeit = new Date();
			fb2.neueAntworten();
			var frageView = this.fragen.view();
			var view = new frageView( {collection: this.fragen} );
			view.render();
			view.$el.trigger('create');
			$.mobile.changePage('#f?0', {reverse: false, changeHash: true} );
		},

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
			view.$el.trigger('create');
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
