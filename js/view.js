// Fb2 View
// =============

// Includes file dependencies
define([ "jquery", "backbone","model" ], function( $, Backbone, Fb2Model ) {
	// Extends Backbone.View
	var Fb2View = Backbone.View.extend( {
		// The View Constructor
		initialize: function() {
			// The render method is called when Fb2 Models are added to the Collection
			//frank this.collection.on( "added", this.render, this );
		},
		// Renders all of the Fb2 models on the UI
		render: function() {
			// Sets the view's template property
			this.template = _.template( $( "script#listItems" ).html(), { "collection": [{1:'eins'},{2:'zwei'},{3:'drei'}] } );
			// Renders the view's template inside of the current listview element
			this.$el.find("ul").html(this.template);
			// Maintains chainability
			return this;
		}
	} );
	// Returns the View class
	return Fb2View;
} );
