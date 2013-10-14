// Frage als Object
// ===================
'use strict';

// Includes file dependencies
define(function(require) {
	var $ = require('jquery');
	var frage4Template = require('text!../templates/frage4.html');
	var frage5Template = require('text!../templates/frage5.html');
	var frage7Template = require('text!../templates/frage7.html');
	var s11Template = require('text!../templates/slider0-10_15.html');
	var s20Template = require('text!../templates/slider1-20.html');
	var s21Template = require('text!../templates/slider0-20_15.html');
	var s49Template = require('text!../templates/slider0-12_15.html');
	var mt5aTemplate = require('text!../templates/mt5A.html');
	var mt5bTemplate = require('text!../templates/mt5B.html');

	function Frage(id,art,txt, lTxt, rTxt, mTxt) {
		// Default-Werte vergeben
		// lTxt und rTxt müssen nicht vergeben werden (siehe Multitastking)
		this.id = (id !== undefined) ? id : -1;
		this.art = ((art !== undefined)) ? art : 5; // Art der Frage - wirkt sich auf das Template aus
		this.txt = (txt !== undefined) ? txt : 'Wie alt möchten Sie werden?';
		this.ant = null;
		this.lTxt = (lTxt) ? lTxt : null;
		this.rTxt = (rTxt) ? rTxt : null;
		this.mTxt = (mTxt) ? mTxt : null;

		this.__defineGetter__('template',function() {
			if (!this.tpl) {
				switch (this.art) {
					case  2: this.tpl = mt5aTemplate; break;
					case  3: this.tpl = mt5bTemplate; break;
					case  4: this.tpl = frage4Template; break;
					case  7: this.tpl = frage7Template; break;
					case 11: this.tpl = s11Template; break;
					case 20: this.tpl = s20Template; break;
					case 21: this.tpl = s21Template; break;
					case 49: this.tpl = s49Template; ;break;
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
		if (this.lTxt) res.lTxt = this.lTxt;
		if (this.rTxt) res.rTxt = this.rTxt;
		if (this.mTxt) res.mTxt = this.mTxt;
		return JSON.stringify( res );
	}

	return Frage;
});
