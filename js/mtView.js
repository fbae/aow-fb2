// View für eine Frage, die sich aus mehreren Teilfragen zusammensetzen kann
// =========================================================================

define([ "jquery", 'underscore', "backbone" ], function( $, _, Backbone ) {
	var FView = Backbone.View.extend( {
		el: '#f', 

		initialize: function() {
		},

		render: function() {
			var f = this.collection; // Fragen
			// aktuelle Frage ermitteln
			var frage = f.get(f.ablauf[f.typ][f.akt]['f'][0]);
			var fO = JSON.parse(frage.attributes.toJSON());
			// vorherige und nachfolgende Frage für Verlinkung bestimmen
			fO.next = f.nachher();
			fO.prev = f.vorher();
			fO.kodierung = f.zeitpunkt() + frage.id;
			// Template rendern
			this.template = _.template(frage.attributes.template,fO);
			// HTML in DOM einhängen und mit page() jqm die Seite verbessert
			this.$el.html(this.template).page();
			this.$el.find( ":jqmData(role=listview)" ).listview(); // jqm verbessern 
			// verbessern: http://jquerymobile.com/demos/1.2.0/docs/pages/page-dynamic.html

			// Maintains chainability
			return this;
		}
	} );
	// Returns the View class
	return FView;
} );

