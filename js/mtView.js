// View für eine Frage, die sich aus mehreren Teilfragen zusammensetzen kann
// =========================================================================

define([ "jquery", 'underscore', "backbone" ], function( $, _, Backbone ) {
	var MtView = Backbone.View.extend( {
		el: '#f', 

		initialize: function() {
		},

		render: function() {
			var f = this.collection; // Fragen
			// aktuelle Frage ermitteln
			var ablauf = f.ablauf[f.typ][f.akt];
			var frage = f.get(ablauf['f'][0]);
			var fO = _.clone(frage);
			// vorherige und nachfolgende Frage für Verlinkung bestimmen
			fO.next = f.nachher();
			fO.prev = f.vorher();
			fO.heading = (ablauf.hasOwnProperty('heading')) ? ablauf.heading : null;
			fO.kodierung = f.zeitpunkt() + frage.id;
			// Template rendern
			this.template = _.template(frage.attributes.template,fO);
			// HTML in DOM einhängen und mit page() jqm die Seite verbessert
			this.$el.html(this.template);
			this.$el.find( ":jqmData(role=listview)" ).listview(); // jqm verbessern 
			this.$el.page();
			// verbessern: http://jquerymobile.com/demos/1.2.0/docs/pages/page-dynamic.html

			// Maintains chainability
			return this;
		}
	} );
	// Returns the View class
	return MtView;
} );

