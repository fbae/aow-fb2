// Fragen als Collection 
// ===================

define([ "jquery","backbone","model","frage" ], function( $, Backbone, FrageModel, Frage ) {

	var Fragen = Backbone.Collection.extend( {

		initialize: function( models, options ) {

			/* Definition einer Liste aller Fragen 
			 *	@param	models:Array of Objects	- im Normalfall Array of Fragen, sollte [] sein
			 *	@param	options:Object	- wird nicht benutzt, kann null oder undefined sein
			 * Aufruf mit initialize([])
			 */
			this.add(new Frage('1',5,['A','B','C','D','E'],'Wie heißen Sie'));
			this.add(new Frage('abc',5,[],'Wofür entscheiden Sie sich? - 5 ohne'));
			this.add(new Frage('bcd',5,['5','4','3','2','1'],'Wofür entscheiden Sie sich? - 5 mit, rückwärts'));
			this.add(new Frage('cde',7,[],'Wofür entscheiden Sie sich? - 7 ohne'));
			this.add(new Frage('def',7,['5','4','3','2','1','0','-1'],'Wofür entscheiden Sie sich? - 7 mit, rückwärts'));
			this.add(new Frage('efg','JN',[],'Wofür entscheiden Sie sich? - ja/nein'));
			this.add(new Frage('fgh','S',{start:0,ende:100,schritte:1},'Wofür entscheiden Sie sich? - Slider'));

		},

		// Sets the Collection model property to be a Fragebogen2 Model
		model: FrageModel,

		// Overriding the Backbone.sync method (the Backbone.fetch method calls the sync method when trying to fetch data)
		sync: function( method, model, options ) {

			/* TODO: das muss noch überarbeitet werden */

			// Local Variables
			// ===============

			// Instantiates an empty array
			var categories = [],

			// Stores the this context in the self variable
			self = this,

			// Creates a jQuery Deferred Object
			deferred = $.Deferred();

			// Uses a setTimeout to mimic a real world application that retrieves data asynchronously
			setTimeout( function() {

				// Filters the above sample JSON data to return an array of only the correct category type
				categories = _.filter( self.jsonArray, function( row ) {

				return row.category === self.type;

			} );

			// Calls the options.success method and passes an array of objects (Internally saves these objects as models to the current collection)
			options.success( categories );

			// Triggers the custom `added` method (which the Category View listens for)
			self.trigger( "added" );

			// Resolves the deferred object (this triggers the changePage method inside of the Category Router)
			deferred.resolve();

			}, 1000);

			// Returns the deferred object
			return deferred;

		}

	} );

	// Returns the Model class
	return Fragen;

} );
