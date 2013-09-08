// Fragen als Collection 
// ===================

define(function( require ) {
	var $ = require('jquery');
	var Backbone = require('backbone');
	var Frage = require('frage');
	var MtView = require('mtView');
	var FView = require('fView');
	var fehlerView = require('fehlerView');

	var Fragen = Backbone.Collection.extend( {


		initialize: function( models, options ) {

			/* Definition einer Liste aller Fragen 
			 *	@param	models:Array of Objects	- im Normalfall Array of Fragen, sollte [] sein
			 *	@param	options:Object	- Übergabe des Typs (damit die nächsten Fragen bestimmt werden können)
			 * Aufruf mit initialize([])
			 *
			 * ablauf ist ein Objekt dass den Ablaufplan für jeden Durchgang abspeichert,
			 * da auf einer Seite mehrere Fragen angezeigt werden können, ist es ein Array of Array
			 * ablauf.W -> während der Arbeit (erste Variante)
			 * ablauf.Q -> während der Arbeit (zweite Variante)
			 * ablauf.N -> nach der Arbeit
			 * ablauf.M -> nach der Arbeit (zweite Variante)
			 * ablauf.A -> Abends
			 *	W1, Q1 sind Teilabläufe, die durch die Property's zusammengesetzt werden.
			 *
			 * für die Typen gilt:
			 *	O -> kein Ablauf gewählt
			 *	WA -> Ablauf W (1. Durchgang A)
			 *	WB -> Ablauf Q (1. Durchgang B)
			 *	QA -> Ablauf Q (2. Durchgang B)
			 *	QB -> Ablauf W (2. Durchgang A)
			 *	NA -> Ablauf N (Nach der Arbeit A)
			 *	NB -> Ablauf M (Nach der Arbeit B)
			 *	A -> Ablauf A (Abends)
			 */

			// Voreinstellungen
			if (!this.typ) this.typ = 'O';
			this.akt = 0;
			this.zeit = new Date();

			// Fragen
			this.add(new Frage('MH1',4,'beschäftigte ich mich mit verschiedenen Dingen gleichzeitig.'));
      this.add(new Frage('MH2',4,'arbeitete ich an mehr als einer Aufgabe.'));
      this.add(new Frage('MH3',4,'bearbeitete ich Aufgaben nacheinander ab.'));
      this.add(new Frage('MH4',4,'erledigte ich mehrere Arbeiten und Aufgaben gleichzeitig.'));
      this.add(new Frage('MH5',4,'musste ich viele Dinge gleichzeitig im Kopf behalten.'));
      this.add(new Frage('MH6',4,'erhielt ich Anweisungen, die ich gleichzeitig im Kopf behalten musste.'));
      this.add(new Frage('MH7',4,'gab es Momente, die für kurze Zeit höchste Konzentration erfordert haben.'));
      this.add(new Frage('MH8',4,'kam es vor, dass mehrere Personen gleichzeitig etwas von mir wollten.'));
			this.add(new Frage('MZ1',3,'beschäftigte ich mich mit verschiedenen Dingen gleichzeitig.'));
      this.add(new Frage('MZ2',3,'arbeitete ich an mehr als einer Aufgabe.'));
      this.add(new Frage('MZ3',3,'bearbeitete ich Aufgaben nacheinander ab.'));
      this.add(new Frage('MZ4',3,'erledigte ich mehrere Arbeiten und Aufgaben gleichzeitig.'));
      this.add(new Frage('MZ5',3,'musste ich viele Dinge gleichzeitig im Kopf behalten.'));
      this.add(new Frage('MZ6',3,'erhielt ich Anweisungen, die ich gleichzeitig im Kopf behalten musste.'));
      this.add(new Frage('MZ7',3,'gab es Momente, die für kurze Zeit höchste Konzentration erfordert haben.'));
      this.add(new Frage('MZ8',3,'kam es vor, dass mehrere Personen gleichzeitig etwas von mir wollten.'));

      this.add(new Frage('FRE',5,'Während der letzten 2 Arbeitsstunden konnte ich selbst entscheiden, ob ich Dinge gleichzeitig tue.','trifft überhaupt nicht zu','trifft völlig zu'));

      this.add(new Frage('STI1',5,'In diesem Moment fühle ich mich &hellip;', 'sehr müde','sehr wach'));
      this.add(new Frage('STI2',5,'In diesem Moment fühle ich mich &hellip;', 'sehr unzufrieden','sehr zufrieden'));
      this.add(new Frage('STI3',5,'In diesem Moment fühle ich mich &hellip;', 'sehr unruhig','sehr ruhig'));
      this.add(new Frage('STI4',5,'In diesem Moment fühle ich mich &hellip;', 'sehr energielos','sehr energiegeladen'));
      this.add(new Frage('STI5',5,'In diesem Moment fühle ich mich &hellip;', 'sehr unwohl','sehr wohl'));
      this.add(new Frage('STI6',5,'In diesem Moment fühle ich mich &hellip;', 'sehr angespannt','sehr entspannt'));

      this.add(new Frage('FLO1',7,'Ich wusste bei jedem Schritt, was ich zu tun hatte.',
				'trifft nicht zu','trifft zu','teils teils'));
 		  this.add(new Frage('FLO2',7,'Ich hatte das Gefühl, den Ablauf unter Kontrolle zu haben.',
				'trifft nicht zu','trifft zu','teils teils'));
      this.add(new Frage('FLO3',7,'Ich war ganz vertieft in das, was ich gerade tat.',
				'trifft nicht zu','trifft zu','teils teils'));
      this.add(new Frage('FLO4',7,'Ich fühlte mich optimal beansprucht.',
				'trifft nicht zu','trifft zu','teils teils'));

      this.add(new Frage('WL1',20,'Wie hoch waren die geistigen Anforderungen in den letzten zwei Stunden?', 
				'sehr niedrig', 'sehr hoch'));
      this.add(new Frage('WL2',20,'Wie hoch waren die körperlichen Anforderungen in den letzten zwei Stunden?', 
				'sehr gering', 'sehr hoch'));
      this.add(new Frage('WL3',20,
				'Wie hoch war das Tempo, mit der Sie die einzelnen Aufgaben in den letzten zwei Stunden bewältigen mussten?', 
				'sehr niedrig', 'sehr hoch'));
      this.add(new Frage('WL4',20,
				'Wie erfolgreich haben Sie Ihre Aufgaben in den letzten zwei Stunden Ihrer Meinung nach durchgeführt?', 
				'perfekter Erfolg', 'Misserfolg'));
      this.add(new Frage('WL5',20,
				'Wie sehr mussten Sie sich in den letzten zwei Stunden anstrengen, um Ihre Leistung zu erreichen?', 
				'sehr wenig', 'sehr stark'));
      this.add(new Frage('WL6',20,
				'Wie verunsichert entmutigt, gereizt und verärgert waren Sie in den letzten zwei Stunden?', 
				'sehr wenig', 'sehr stark'));
      this.add(new Frage('WL7',20,'Wie gestresst fühlten Sie sich in den letzten zwei Stunden?',
				'sehr wenig','sehr stark'));

/*
      this.add(new Frage('',,''));
      this.add(new Frage('',,''));
      this.add(new Frage('',,''));
      this.add(new Frage('',,''));
      this.add(new Frage('',,''));
      this.add(new Frage('',,''));
*/
			this.ablauf = {
				STI: [
					{v: FView, f:['STI1','STI2','STI3']},
					{v: FView, f:['STI4','STI5','STI6']},
				],
				W1: [
					{v: MtView, f:['MH1']},
					{v: MtView, f:['MH2']},
					{v: MtView, f:['MH3']},
					{v: MtView, f:['MH4']},
					{v: MtView, f:['MH5']},
					{v: MtView, f:['MH6']},
					{v: MtView, f:['MH7']},
					{v: MtView, f:['MH8']},
				],
				Q1: [
					{v: MtView, f:['MZ1']},
					{v: MtView, f:['MZ2']},
					{v: MtView, f:['MZ3']},
					{v: MtView, f:['MZ4']},
					{v: MtView, f:['MZ5']},
					{v: MtView, f:['MZ6']},
					{v: MtView, f:['MZ7']},
					{v: MtView, f:['MZ8']},
				],
				W2: [ 
					{v: FView, f:['FRE']},
					{v: FView, f:['FLO1','FLO2'], heading:'Bitte geben sie an, inwieweit die folgenden Aussagen in den letzten zwei Stunden auf Sie zutrafen.'},
					{v: FView, f:['FLO3','FLO4'], heading:'Bitte geben sie an, inwieweit die folgenden Aussagen in den letzten zwei Stunden auf Sie zutrafen.'},
				],
				WL: [
					{v: FView, f:['WL1', 'WL2', 'WL3']},
					{v: FView, f:['WL4', 'WL5', 'WL6']},
					{v: FView, f:['WL7']}
				],
			};
	
			Object.defineProperty(this.ablauf, 'O', { // keine Ablauf
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return [] },
			});
			Object.defineProperty(this.ablauf, 'W', { // erster Druchlauf - während der Arbeit
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return this.STI.concat(this.W1,this.W2,this.WL) },
			});
			Object.defineProperty(this.ablauf, 'Q', { // zweiter Durchlauf - während der Arbeit
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return this.STI.concat(this.Q1,this.W2,this.WL) },
			});
			Object.defineProperty(this.ablauf, 'WA', {
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return this.W },
			});
			Object.defineProperty(this.ablauf, 'WB', {
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return this.Q },
			});
			Object.defineProperty(this.ablauf, 'QA', {
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return this.Q },
			});
			Object.defineProperty(this.ablauf, 'QB', {
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return this.W },
			});

		},

		/*
		 * erstellt für den konkreten Ablauf alle Seiten
		 * (es muss scheinbar immer auf eine andere Seite verlinkt werden, weil sonst die css-Eigenschaften
		 * nicht erneuert werden)
		 *	@param	typ: siehe oben
		createPages: function(typ) {
			if ( !( typ === 'WA' || typ === 'WB' || typ === 'QA' || typ === 'QB' || typ === 'N' || typ === 'A' ) ) {
				console.warn('Fehler: createPages versucht die Seiten für den Typ ' + typ + 
						' anzulegen, aber der Typ ist nicht bekannt.');
				return undefined;
			}
			this.art = art;
			this.zeit = new Date();
			this.akt = 0;

			// ttt $('body').

			return this;
		},
Nicht weiter verwendet
		 */


		// Sets the Collection model property to be a Fragebogen2 Model
		//model: ,

		// Overriding the Backbone.sync method (the Backbone.fetch method calls the sync method when trying to fetch data)
/*
 * sync: function( method, model, options ) {

			/* TODO: das muss noch überarbeitet werden */
/*

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

		},
*/
		vorher: function() {
		 	return (this.akt == 0) ? null : this.akt - 1; 
		},
		nachher: function() {
			if (!this.ablauf || (this.typ === 'O')) return undefined;
			var n = this.akt + 1;
			return (n < this.ablauf[this.typ].length) ? n : null;
		},
		// Anzahl der Fagen im aktuellen Ablauf
		anzahl: function() {
			if (this.ablauf && this.typ && (this.typ !== 'O'))
				return this.ablauf[this.typ].length;

			return -1;
		},
		zeitpunkt: function() {
			switch (this.typ) {
				case 'WA':
				case 'WB': return '1'; break;
				case 'QA':
				case 'QB': return '2'; break;
				case 'NA':
				case 'NB': return '3'; break;
				case 'A': return '4'; break;
				default: return '0';
			}
			return undefined;
		},

		setzeAntwort: function(antwortO) {
			if (antwortO.kodierung && antwortO.antw) {
				var kod = antwortO.kodierung.substr(1,antwortO.kodierung.length-1);
				this.get(kod).attributes.ant = antwortO.antw;
			}
		},
		view: function() {
			if ((this.typ != 'O') && (this.akt <= this.anzahl()))	{
				return this.ablauf[this.typ][this.akt].v;
			}

			// Fehler behandeln
			console.warn( 'Fehler: Fragen.view konnte nicht ermittelt werden', this.typ, this.akt, this.anzahl());
			fb2.log({ msg:'Fehler: Es wurde eine View abgerufen, die nicht ausgeliefert werden konnte'});
			return fehlerView;
		}

	} );

	// Returns the Model class
	return Fragen;

} );
