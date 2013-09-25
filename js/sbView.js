// View für Ende Abend-Durchlauf -> nächster Schichtbeginn 
// =======================================================

define( function( require ) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var sbViewTemplate = require('text!../templates/sbView.html');

	var SbView = Backbone.View.extend( {
		el: '#f',
		initialize: function() {
		},

		render: function() {
			var sb = fb2.naechsterWerktag();
			this.template = _.template(sbViewTemplate,null);
			this.$el.html(this.template).page();
			// Werte vorbesetzen
			this.$el.find('#select-choice-day')
				.change(function(evt) {
					sb.setDays(evt.target.value);
					fb2.set('schichtbeginn',sb);
					fb2.trigger('change:schichtbeginn',fb2,sb);
				})
				.find('option[value="'+sb.getDate()+'"]').attr('selected','selected');
			this.$el.find('#select-choice-month')
				.change(function(evt) {
					sb.setMonth(evt.target.value);
					fb2.set('schichtbeginn',sb);
					fb2.trigger('change:schichtbeginn',fb2,sb);
				})
				.find('option[value="'+(sb.getMonth()+1)+'"]').attr('selected','selected');
			this.$el.find('#select-choice-year')
				.change(function(evt) {
					sb.setYear(evt.target.value);
					fb2.set('schichtbeginn',sb);
					fb2.trigger('change:schichtbeginn',fb2,sb);
				})
				.find('option[value="'+sb.getFullYear()+'"]').attr('selected','selected');
			
			this.$el.find('#select-choice-hour')
				.change(function(evt) {
					sb.setHours(evt.target.value);
					fb2.set('schichtbeginn',sb);
					fb2.trigger('change:schichtbeginn',fb2,sb);
				})
				.find('option[value="'+sb.getHours()+'"]').attr('selected','selected');
			var q = Math.round(sb.getMinutes()/15);
			q = (q == 4) ? 0 : q*15 ; 
			this.$el.find('#select-choice-quarter')
				.change(function(evt) {
					sb.setMinutes(evt.target.value);
					fb2.set('schichtbeginn',sb);
					fb2.trigger('change:schichtbeginn',fb2,sb);
				})
				.find('option[value="'+q+'"]').attr('selected','selected');
			this.$el.page().find('select').selectmenu()
				
			return this;
		}
	} );
	// Returns the View class
	return SbView;
} );

