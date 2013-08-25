// View für eine Frage
// ===================

define([ "jquery", 'underscore', "backbone","model" ], function( $, _, Backbone, Fb2Model ) {
	var MtView = Backbone.View.extend( {
		el: '#f', 
		// The View Constructor
		initialize: function() {
			// The render method is called when Fb2 Models are added to the Collection
			//frank this.collection.on( "added", this.render, this );
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
console.debug( 'fO:',fO);
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
	return MtView;
} );

