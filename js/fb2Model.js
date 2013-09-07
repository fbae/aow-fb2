/*
 * settings Model
 * ==============
 * enthält alle Einstellungen und Eintrittspunkte, wie z.B.:
 *	fragen:Collection
 *
 */
define([ "jquery", "backbone" ],function( $, Backbone ) {
	var Fb2Model = Backbone.Model.extend( {

		initialize: function() {
			this.set('status','debug');
			this.set('version','0.1');
			this.logA = (localStorage.log && this.status != 'debug') ? JSON.parse(localStorage.log) : [];

			// Gerätenamen setzen, falls nötig 
			if (localStorage.device && (localStorage.device !== undefined)) {
				this.set('device',localStorage.device);
			} else {
				this.set('device','oN'+(new Date()).getTime());
			}

			// StartTag und StartZeit einlesen
			if (localStorage.startTag) {
				this.set('tag', new Date(JSON.parse(localStorage.startTag)));
			} else {
				var tag = new Date();
				tag.setHours(7);
				tag.setMinutes(30);
				tag.setSeconds(0);
				tag.setMilliseconds(0);
				this.set('tag',tag);
			}

			this.set('antworten', (localStorage.antworten) ? JSON.parse(localStorage.antworten) : []);
		},

		setzeAntwort: function(antwortO) {
//			console.debug( 'setzeAntwort aufgerufen mit antwortO:', antwortO);
			if (typeof antwortO !== 'object') {
				console.warn('Fehler: es wird versucht eine Antwort zu speichern, ' +
						'aber die Antwort wird nicht übergeben - antwortO: ', antwortO);
				return undefined;
			}

			this.log({msg:'setzeAntwort', data:antwortO});

			var heuteNr = this.anzHeute;
			var antwortenArr = this.get('antworten');

			if (!antwortenArr[heuteNr]) {
				// beim erstmaligen Aufruf weitere Eigenschaften speichern
				var ah = new Object();
				ah.erstellDatum = this.fragen.zeit;
				antwortenArr[heuteNr] = ah;
			}
			// TODO: vielleicht die Kodierung überprüfen? -> vermutlich nicht notwendig
			
			/* Datenbankeintrag (localStorage)
			 * Antworten werden zunächst alle zwischengespeichert in this.antworten[], somit müssen sie
			 * nur beim Neustart neu gelesen werden. Bei jeder Antwort müssen sie allerdings geschrieben 
			 * werden.
			 */
			var data = antwortenArr[heuteNr];
//			console.debug( 'data: ', data, 'antwortO.kodierung', antwortO.kodierung);
			if (antwortO.kodierung) {
				var kod = new Object();
				kod.zeit = (antwortO.zeit) ? antwortO.zeit : new Date();
				kod.wert = (antwortO.antw) ? antwortO.antw : 'null';
				data[antwortO.kodierung] = kod;
				antwortenArr[heuteNr] = data;
				this.set('antworten', antwortenArr);
				//TODO: eigentlich müsste jetzt ein "changed:antworten" ablaufen, tut es aber nicht? Die folgende Zeile ist fraglich.
				localStorage.antworten = JSON.stringify(antwortenArr);
				this.log({msg:'setzeAntwort erfolgreich', data: antwortO});
			} else {
//				console.warn( 'Fehler: ohne Kodierung keine Antwort in setzeAntwort: ', antwortO);
				this.log({
					msg:'FEHLER: setzeAntwort gescheitert - keine Kodierung in antwortO', data:antwortO});
				return undefined;
			}


			// Eintrag in Collection: fragen
			this.fragen.setzeAntwort(antwortO);
		},	

		log: function(obj) {
			if (!obj.dt) obj.dt = new Date();
			this.logA.push(obj);
			localStorage.log = JSON.stringify(this.logA);
		},

	} );

	window.fb2 = new Fb2Model;

	Object.defineProperties(fb2, {
		anzHeute: {
			writeable: false,
			get: function() {
				return Math.abs(Math.floor(((new Date()).getTime() - (this.get('tag')).getTime())/1000/60/60/24));
			}
		},
		artHeute: {
			writeable: false,
			get: function() {	return Math.abs(this.anzHeute % 2);}
		},
		fragen: {
			writeable:false,
			get: function() { return (this.router) ? this.router.fragen : undefined;}
		},
		settings: {
			writeable:false,
			get: function() {
				var o = new Object();
				o.status = this.get('status');
				o.version = this.get('version');
				o.device = this.get('device');
				o.tag = this.get('tag');
				return o;
			}
		}
	});

	// on... scheint nicht ausgelöst zu werden?
	fb2.on('change:device', function(model, device) {
		console.debug( 'change:device', model, device);
		localStorage.device = device;
		this.log({msg:'device geändert: ' + device});
	});
	fb2.on('change:tag', function(model, tag) {
		console.debug( 'change:tag', model, tag);
		localStorage.startTag = JSON.stringify(tag);
		this.log({msg: 'startTag geändert: ' + localStorage.startTag});
	});
	fb2.on('change:antworten', function(model, antwortenArr) {
		console.debug( 'change:antworten', model, antwortenArr);
		localStorage.antworten = JSON.stringify(antwortenArr);
	});

	return Fb2Model;
} );

