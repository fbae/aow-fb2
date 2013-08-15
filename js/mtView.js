// View für eine Frage
// ===================

define([ "jquery", 'underscore', "backbone","model", 'fragen' ], function( $, _, Backbone, Fb2Model, Fragen ) {
	var MtView = Backbone.View.extend( {
		el: '#f', 
		// The View Constructor
		initialize: function() {
			// The render method is called when Fb2 Models are added to the Collection
			//frank this.collection.on( "added", this.render, this );
		},
		render: function() {
			var f = this.collection; // Fragen
			var frage = f.get(f.ablauf[f.typ][f.aktuell]['f'][0]).attributes;
			frage.next = f.next;
			frage.prev = f.prev;

			this.template = _.template(frage.template,frage);
			// Renders the view's template inside of the current listview element
			this.$el.html(this.template);
			// Maintains chainability
			return this;
		}
	} );
	// Returns the View class
	return MtView;
} );

