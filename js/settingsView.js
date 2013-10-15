// View für die Einstellungen 
// ==========================

define(function( require ) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var Fb2Model = require('fb2Model');
	var settingsViewTemplate = require('text!../templates/settingsView.html');
	var SbView = require('sbView');

	var SettingsView = Backbone.View.extend( {
		el: '#settings :jqmData(role=content)',
		model: fb2,

		initialize: function() {
			this.template = _.template(settingsViewTemplate);
			this.sb = fb2.naechsterWerktag();

			// Werte vorbesetzen
			$(this.template).find('#select-choice-day')
				.find('option[value="'+this.sb.getDate()+'"]').attr('selected','selected');
			$(this.template).find('#select-choice-month')
				.find('option[value="'+this.sb.getMonth()+'"]').attr('selected','selected');
			$(this.template).find('#select-choice-year')
				.find('option[value="'+this.sb.getFullYear()+'"]').attr('selected','selected');
			$(this.template).find('#select-choice-hour')
				.find('option[value="'+this.sb.getHours()+'"]').attr('selected','selected');
			var q = Math.round(this.sb.getMinutes()/15);
			q = (q == 4) ? 0 : q*15 ; 
			$(this.template).find('#select-choice-quarter')
				.find('option[value="'+q+'"]').attr('selected','selected');
		},

		events: {
			// Hängt von den Elementen im Template ab
			'click #save0DataButton': 'saveAll',
			'click #changeSchichtbeginnButton': 'changeSchichtbeginnVisiblility',
			'change #select-choice-quarter': 'cSQ',
			'change #select-choice-hour': 'cSH',
			'change #select-choice-year': 'cSY',
			'change #select-choice-month': 'cSM',
			'change #select-choice-day': 'cSD',
		},

		render: function() {
			var compiledTemplate = this.template(fb2.settings);
			this.$el.html(compiledTemplate);
			this.$el.find('select').selectmenu();
			this.$el.find('#settingsSaveAllDataErfolg').popup();
			this.$el.find('#settingsSaveAllDataFehler').popup();
			this.$el.page();
			return this;
		},

		saveAll: function() { if (navigator.onLine) fb2.saveAll(); },
		cSQ: function(evt) { this.sb.setMinutes(evt.target.value); this.cS();	},
		cSH: function(evt) { this.sb.setHours(evt.target.value); this.cS();	},
		cSY: function(evt) { this.sb.setFullYear(evt.target.value); this.cS();	},
		cSM: function(evt) { this.sb.setMonth(evt.target.value); this.cS();	},
		cSD: function(evt) { this.sb.setDate(evt.target.value); this.cS();	},
		cS: function() {
			fb2.set('schichtbeginn',this.sb);
			fb2.trigger('change:schichtbeginn',fb2,this.sb);
		},
		changeSchichtbeginnVisibility: function() {
			var cS = $('#changeSchichtbeginn');
			if (cS)
				if (cS.css('visibility') == 'hidden')
					cS.css('visibility','visible')
				else
					cS.css('visibility','hidden');
		},
	} );
	return SettingsView;
} );

