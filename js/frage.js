// Frage als Object
// ===================
'use strict';

// Includes file dependencies
define('frage', [ 'jquery', 'underscore', 'text!templates/frage5.html'], function( $, _, frage5Template ) {
	function Frage(id,art,bes,txt) {
		// Default-Werte vergeben
		this.id = (id !== undefined) ? id : -1;
		this.art = ((art !== undefined) && Number.isInteger(art)) ? art : 5; // Art der Frage - wirkt sich auf das Template aus
		// Beschriftung und Werte für die Antworten
		this.bes = ((bes !== undefinde) && (typeof bes === 'array') && (this.art == bes.length)) ? 
			bes : [{b:'<10',w:1},{b:'<20',w:2},{b:'<=40',w:3},{b:'>40',w:4},{b:'>50',w:5}];
		this.txt = (txt !== undefined) ? txt : 'Wie alt möchten Sie werden?';
		this.zeit = null;
		this.__defineGetter__('Zeit',function(){ return this.zeit.getTime(); });
		this.__defineSetter__('Zeit',function() { this.zeit = new Date(); });
		this.setZeit();

		this.tpl = null;
		this.__defineGetter__('template',function() {
			if (this.tpl === null) {
				// TODO: hier muss noch die exakte Zuordnung des richtigen Templates stattfinden (in Abhängigkeit von this.art)
				var this.tpl = _.template(frage5Template, this.toJSON());  
			}
			return this.tpl;
		});
	};

	Frage.prototype.toJSON = function() {
		var res = new Object();
		res.id = this.id;
		res.art = this.art;
		res.txt = this.txt;
		res.zeit = this.Zeit;
		res.bes = this.bes;
		return JSON.stringify( res );
	}

	return Frage;
}
