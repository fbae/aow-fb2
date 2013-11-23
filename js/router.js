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
			this.fragen = new Fragen();
			Backbone.history.start();
		},

		routes: {
			// When there is no hash bang on the url, the home method is called
			'': 'home',
			'S': 'speichern',
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
			fb2.log({
				msg:'speichern nach Durchlauf ' + this.fragen.art,
				data: antw
			}); 
			fb2.speichereAntworten(); // solange change:antworten nicht richtig funktioniert - mit callback?

			this.fragen.typ = 'O';
			var danke = $('#danke').popup('open');
			console.debug( 'speichern - danke:',danke);
			setTimeout(function(){danke.popup("close");},1500);
			this.home();
		},

		settings: function() {
			if (!this.settingsView) this.settingsView = new SettingsView();
			this.settingsView.render();
			this.settingsView.$el.trigger('create');
			$.mobile.changePage( '#settings', { reverse: false, changeHash: true } );
		},

		ablaufX: function(typC) {
			if (typC == 'A')
				this.fragen.typ = typC
			else
				this.fragen.typ = typC + ((fb2.artHeute) ? 'A' : 'B');
			fb2.log({msg:'ablaufX Typ:' + this.fragen.typ});
			this.fragen.akt = 0;
			this.fragen.zeit = new Date();
			fb2.neueAntworten();
			var frageView = this.fragen.view();
			var view = new frageView( {collection: this.fragen} );
			view.render();
			view.$el.trigger('create');
			$.mobile.changePage('#f?0', {reverse: false, changeHash: true} );
		},
		ablaufW: function() { 
			// den Zustand A und B triggern
			if (fb2.has('art')) fb2.set('art', !fb2.get('art'));
			this.ablaufX('W'); 
		},
		ablaufQ: function() { this.ablaufX('Q'); },
		ablaufN: function() { this.ablaufX('N'); },
		ablaufA: function() { this.ablaufX('A'); },

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
//			console.info( 'frage fragen:',this.fragen);
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
