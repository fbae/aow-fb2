// View für mehrere Fragen mit horizontaler Auswahl
// ================================================

define( function( require ) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var fViewTemplate = require('text!../templates/fView.html');

	var FView = Backbone.View.extend( {
		el: '#f',
		initialize: function() {
		},

		render: function() {
			var f = this.collection; // Fragen
			// aktuelle Frage ermitteln
			var fArr = f.ablauf[f.typ][f.akt]['f'];
			console.debug( 'fView render fArr:', fArr,f);
			
			// für alle Teilfragen die Templates zusammenstellen
			var teilFragenHTMLArr = new Array();
			for (var i=0; i<fArr.length; i++) {
				var frage = f.get(fArr[i]).attributes;
				var tfa = JSON.parse(frage.toJSON());
				tfa.kodierung = f.zeitpunkt() + frage.id;
				teilFragenHTMLArr.push(_.template(frage.template,tfa));
			}

			// TODO: eventuell noch gleichartige Fragen löschen (siehe Stimmung)

			var fO = {'fragenTemplates': teilFragenHTMLArr};
			// vorherige und nachfolgende Frage für Verlinkung bestimmen
			fO.next = f.nachher();
			fO.prev = f.vorher();

			// Template rendern
			this.template = _.template(fViewTemplate,fO);
			// HTML in DOM einhängen
			this.$el.html(this.template).page();
			this.$el.find( ":jqmData(role=controlgroup)" ).controlgroup(); 

			// Maintains chainability
			return this;
		}
	} );
	// Returns the View class
	return FView;
} );

