// View für die Einstellungen 
// ==========================

define(function( require ) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var Fb2Model = require('fb2Model');
	var settingsViewTemplate = require('text!../templates/settingsView.html');

	var SettingsView = Backbone.View.extend( {
		el: '#settings :jqmData(role=content)',
		model: fb2,

		initialize: function() {
			this.template = _.template(settingsViewTemplate);
		},

		events: {
			// Hängt von den Elementen im Template ab
		},

		render: function() {
			var compiledTemplate = this.template(fb2.settings);
			console.debug( 'fb2: ',fb2);
			console.debug( 'compiledTemplate: ', compiledTemplate);
			this.$el.html(compiledTemplate);
			return this;
		}
	} );
	return SettingsView;
} );

