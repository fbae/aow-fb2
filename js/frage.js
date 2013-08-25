// Frage als Object
// ===================
'use strict';

// Includes file dependencies
define(function(require) {
	var $ = require('jquery');
	var frage5Template = require('text!../templates/frage5.html');
	var mt5aTemplate = require('text!../templates/mt5A.html');
	var mt5bTemplate = require('text!../templates/mt5B.html');

	function Frage(id,art,txt) {
		// Default-Werte vergeben
		this.id = (id !== undefined) ? id : -1;
		this.art = ((art !== undefined)) ? art : 5; // Art der Frage - wirkt sich auf das Template aus
		this.txt = (txt !== undefined) ? txt : 'Wie alt möchten Sie werden?';
		this.ant = null;

		this.__defineGetter__('template',function() {
			if (!this.tpl) {
				switch (this.art) {
					case 3:  this.tpl = mt5bTemplate; break;
					case 4:  this.tpl = mt5aTemplate; break;
					default: this.tpl = frage5Template;  
				}
			}
			return this.tpl;
		});
		this.template;

//		this.__defineGetter__('antwort',function() { return this.ant; });
//		this.__defineSetter__('antwort',function(a) { this.ant = a; });
	 	// TODO: eventuell Antwort auf Bereich prüfen

	};

	Frage.prototype.toJSON = function() {
		var res = new Object();
		res.id = this.id;
		res.art = this.art;
		res.txt = this.txt;
		res.ant = this.ant;
		return JSON.stringify( res );
	}

	return Frage;
});
