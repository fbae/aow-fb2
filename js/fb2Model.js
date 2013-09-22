/*
 * settings Model
 * ==============
 * enthält alle Einstellungen und Eintrittspunkte, wie z.B.:
 *	fragen:Collection
 *
 */
define([ 'jquery', 'underscore', 'backbone' ],function( $, _, Backbone ) {
	var Fb2Model = Backbone.Model.extend( {

		initialize: function() {

			// indexedDB initialisieren
			window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
			window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
			window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

			// lege die Datenbank an, falls das noch nicht passiert ist, oder sich die Version geändert hat
			this.dbName = 'multitasking.uni-mainz';
			this.dbVersion = '4';

			var self= this;
			var openRequest = indexedDB.open(this.dbName,this.dbVersion);
			
			openRequest.onsuccess = function(e) {
				self.db = e.target.result;
				self.db.onerror = function(e) {
					// Fehler steigen auf - wird aus allen requests für alle auftauchenden Fehler abgerufen
					console.error('Fehler - indexedDB: ', e, 'ErrorCode:', e.target.errorCode);
				};
				
				// laden der Informationen aus der Datenbank und Abspeichern im Fb2Model
				var req = self.db.transaction('einstellungen').objectStore('einstellungen').openCursor();
				req.onsuccess = function(event) {
					var cursor = event.target.result;
					if (cursor) {
						if (!self.has(cursor.value.key)) {
							// aus der URL ausgelesene Werte nicht überschreiben
							var o = new Object();
							o[cursor.value.key] = cursor.value.value;
							self.set( o, { silent: true } );
						}
						cursor.continue();
					} else {
						// laden der Einstellungen ist jetzt fertig - jetzt nachbearbeiten
						// Gerätenamen setzen, falls nötig
						if ( !self.has('device') ) self.set('device','oN'+(new Date()).getTime());
						// StartTag und StartZeit einlesen
						if ( !self.has('tag') ) {
							var tag = new Date();
							tag.setHours(7);
							tag.setMinutes(30);
							tag.setSeconds(0);
							tag.setMilliseconds(0);
							self.set('tag',tag);
						}
						
						// gibt es nicht beendete Antworten, die eventuell passen könnten?
						if ( self.has('antwortenTabelle') && self.has('antwortenId')) {
	/*
	 * 					// Es sind Antworten noch nicht abgeschlossen, 
							// aber die Antworten könnten eventuell auch verfallen sein.
							// Nach 24 Stunden verfallen solche Antworten
							// TODO - das muss noch programmiert werden
							// TODO - laden aus IDB
							// TODO - füllen der Fragen und des Modells
							// TODO - Navigation zur letzten Fragenseite

							// Antworten für laden, falls es welche gibt, die noch nicht beendet wurden
							console.debug( 'heuteId: ', self.heuteId(), 'versuche gespeicherte Antwort zu laden');
							var req = self.db.transaction('antworten').objectStore('antworten').openCursor(self.heuteId());
							req.onsuccess = function(e) {
								var cursor = e.target.result;
								if (cursor) {
									self.set('antworten', cursor.value);
								} else {
									// es sind noch keine Antworten gespeichert
									self.set('antworten', self.neueAntworten());
								}
							}
							req.onerror = function(e) {
								console.debug('Antworten konnten nicht geladen werden',e);
							}
	*/
							console.debug( 'TODO - muss erst noch programmiert werden');
						}
					} // Ende nachbearbeiten
				} // Ende req.onsuccess
				req.onerror = function(e) {
					console.info( 'Es gibt keine Einstellungen: ', e );
				}


//			this.set('antworten', (localStorage.antworten) ? JSON.parse(localStorage.antworten) : []);
				console.log('IDB-Open erfolgreich aufgerufen',new Date());
			}; // Ende openRequest.onsuccess
			openRequest.onerror = function(e) {
				console.error('IDB(indexedDB) OPEN Fehler: ', e, 'ErrorCode:', e.target.errorCode);
			}
			openRequest.onupgradeneeded = function(e) {	// Update object stores and indices
				var db = e.target.result;

				// alle vorhandenen ObjectStores löschen
				if (db.objectStoreNames.length > 0) { // es sind ObjectStores vorhanden
					if (db.objectStoreNames.contains('log')) db.deleteObjectStore('log');
					if (db.objectStoreNames.contains('antwortenW')) db.deleteObjectStore('antwortenW');
					if (db.objectStoreNames.contains('antwortenQ')) db.deleteObjectStore('antwortenQ');
					if (db.objectStoreNames.contains('antwortenN')) db.deleteObjectStore('antwortenN');
					if (db.objectStoreNames.contains('antwortenA')) db.deleteObjectStore('antwortenA');
					if (db.objectStoreNames.contains('einstellungen')) db.deleteObjectStore('einstellungen');
				}

				// ObjectStore neu anlegen
				var objectStoreLog = db.createObjectStore('log', { keyPath: 'dt' });
				objectStoreLog.add( { dt:new Date(), msg:'log neu angelegt' } );
				var objectStoreAntwortenW = db.createObjectStore('antwortenW', { keyPath: 'id', autoIncrement: true });
				var objectStoreAntwortenQ = db.createObjectStore('antwortenQ', { keyPath: 'id', autoIncrement: true });
				var objectStoreAntwortenN = db.createObjectStore('antwortenN', { keyPath: 'id', autoIncrement: true });
				var objectStoreAntwortenA = db.createObjectStore('antwortenA', { keyPath: 'id', autoIncrement: true });
				var objectStoreEinstellungen = db.createObjectStore('einstellungen', { keyPath: 'key' });

			};  // Ende onUpgradeNeeded

			// initialisiere die Programm-Variablen ==================================
			this.set('status','debug');
			this.set('version','0.2');
			if (this.status == 'debug') this.db.transaction('log','readwrite').objectStore('log').clear();

		},

		setzeAntwort: function(antwortO) {
			if (typeof antwortO !== 'object') {
				console.warn('Fehler: es wird versucht eine Antwort zu speichern, ' +
						'aber die Antwort wird nicht übergeben - antwortO: ', antwortO);
				return undefined;
			}

			this.log({msg:'setzeAntwort', data:antwortO});

			if (this.has('antworten')) {
				var data = this.get('antworten');
			} else {
				console.warn('setzeAntwort - neueAntworten() aufgerufen, das sollte nicht mehr passieren.');
				var data = this.neueAntworten();
			}

			if (antwortO.kodierung) {
				var kod = new Object();
				kod.zeit = (antwortO.zeit) ? antwortO.zeit : new Date();
				kod.wert = (antwortO.antw) ? antwortO.antw : 'null';
				data[antwortO.kodierung] = kod;
//				console.debug( 'setzeAntwort data: ', data, 'antwortO.kodierung', antwortO.kodierung);
				this.set( {'antworten': data} );
				fb2.trigger('change:antworten',this,data); // Backbone scheint Änderungen in Objekten nicht zu erkennen
			} else {
				this.log({
					msg:'FEHLER: setzeAntwort gescheitert - keine Kodierung in antwortO', data:antwortO});
				return undefined;
			}

			// Eintrag in Collection: fragen
			this.fragen.setzeAntwort(antwortO);
		},	

		log: function(obj) {
			if (!this.db) {
				console.debug( 'Loggen wurde vertagt, weil this.db noch nicht fertig ist: obj', obj);
				setTimeout('fb2.log('+JSON.stringify(obj)+');',1000);
			}
			// obj ist entweder ein Objekt, dann sollte es das Attribut dt:Date() besitzen
			// oder obj ist ein string, dann wird das Objekt hergestellt
			if ( typeof obj == 'object' ) {
				var logO = obj;
				if (!logO.dt) logO.dt = new Date();
			} else {
				var logO = new Object();
				logO.msg = obj;
				logO.dt = new Date();
			}
			if (!logO.heuteId) logO.heuteId = this.heuteId();

			this.db.transaction('log', 'readwrite').objectStore('log').add(logO).onerror = function (e) { 
				console.warn('IDB - log -  mit obj: ',obj, ' Fehler: ',e); 
			};

		},

		nameAntwortenTabelle: function() {
			switch (this.fragen.typ) {
				case 'WA':
				case 'WB': return 'antwortenW'; break;
				case 'QA':
				case 'QB': return 'antwortenQ'; break;
				case 'NA':
				case 'NB': return 'antwortenN'; break;
				case 'A': return 'antwortenA'; break;
				default: return undefined;
			}
		},

		heuteId: function() {
			var heute = new Date();
			var m = heute.getUTCMonth() + 1;
			m = ((m<10) ? '0'+m : m);
			var d = heute.getUTCDay();
			d = ((d<10) ? '0'+d : d);
			return this.get('device') + '_' + heute.getUTCFullYear() + '-' + m + '-' + d;
		},

		neueAntworten: function() {
			var self = this;
			// alte Antworten löschen
			if (this.has('antworten')) this.unset('antworten', {silent: true});
			if (this.has('antwortenId')) this.unset('antwortenId');
			this.fragen.entferneAntworten();


			var antwTab = this.nameAntwortenTabelle();
			if (antwTab === undefined) {
				console.warn('neueAntworten - konnte TabellenName nicht richtig bestimmen');
				return undefined;
			}
			this.set('antwortenTabelle',antwTab);

			// neue Antworten eintragen
			var aO = new Object();
			aO.device = this.get('device');
			aO.tag = this.get('tag');
			aO.heuteId = this.heuteId();
			aO.antwortenErstellt = new Date();
			aO.fragenErstellt = this.fragen.zeit;
			aO.typ = this.fragen.typ;
			aO.person = this.get('person');

			var req = this.db.transaction(antwTab,'readwrite').objectStore(antwTab).add( aO );
			req.onerror = function(e) {
				console.warn( 'IDB - neueAntworten - konnten nicht gespeichert werden: ', aO);
			}
			req.onsuccess = function(e) {
				aO.id = e.target.result;
				self.set( { 'antworten': aO }, { silent: true } );
				self.set( { 'antwortenId': aO.id, 'antwortenTabelle': antwTab } );
			}
			return aO; // das ist fraglich, weil hier die id nicht enthalten ist
		},

		speichereAntworten: function(cb) {
			var antwTab = this.get('antwortenTabelle');
			var antw = this.get('antworten');
			this.db.transaction(antwTab,'readwrite').objectStore(antwTab).put( antw ).onerror = function(e) {
				console.warn( 'IDB - neueAntworten - konnten nicht gespeichert werden: ', antw, antwTab, this.fragen);
			}
			this.unset('antworten', {silent: true});
			this.unset('antwortenId');
			this.unset('antwortenTabelle');
		},

		saveTab: function(tabName) {
			// TODO: ist unfertig
			var self = this;
			// Antworten auslesen
			var req = self.db.transaction(tabName).objectStore(tabName).openCursor();
			req.onsuccess = function(e) {
				var cursor = e.target.result;
				if (cursor) {
					var cv = _.clone(cursor.value);
					_.each(cv, function(v,k,l) { 
						if (_.isDate(v)) {
							l[k] = v.toMysqlFormat();
						} else {
							if (_.isObject(v) && _.isDate(v.zeit)) {
								l[k + 'D'] = v.zeit.toMysqlFormat();
								l[k] = v.wert;
							}
						}
					} );
					console.debug( 'saveTab - cv: ', cv);
					cv.tabellenName = tabName;
					$.ajax({
						type: "POST",
						dataType: "json",
						data: cv,
						beforeSend: function(x) {
							if(x && x.overrideMimeType) {
								x.overrideMimeType("application/json;charset=UTF-8");
							}
						},
						url: 'api/putData.php',
						success: function(data) {
							console.debug( 'Erfolg - saveTab:success - data:', data);
							if (data.status == 'erfolg') { 
								/* löschen des Eintrages, falls data.status == erfolg
								 * data enthält die id und den tabellenNamen
								 */
								self.db.transaction(tabName,'readwrite').objectStore(tabName).delete(Number(data.id)).onerror = 
									function(e) {
										console.debug('Fehler - saveTab - in Tabelle '+tabName+' konnte der Eintrag id: '+
											data.id+' nicht gelöscht werden. e:',e);
									};
							} else {
								console.error('Fehler - saveTab - Nach der Übermittlung wurde ein Fehler gemeldet. data:', data);
							}
						},
						error: function(data) {
							console.error('Fehler - saveTab - ajax ist gescheitert. data:',data);
						}
					});
					cursor.continue();
				} else console.debug('Erfolg - saveTab - die Tabelle '+tabName+' müsste jetzt leer sein');
			}
		},
		saveAll: function() {
			var self = this;
			this.saveTab('antwortenW');
			this.saveTab('antwortenQ');
			this.saveTab('antwortenN');
			this.saveTab('antwortenA');

			// alle log-Einträge zusammenpacken und verschicken
			var log = new Array();
			var req = self.db.transaction('log').objectStore('log').openCursor();
			req.onerror = function(e) { console.warn('Fehler - saveAll - log konnte icht ausgelesen werden. ',e); }
			req.onsuccess = function(e) {
				var cursor = e.target.result;
				if (cursor) {
					log.push(cursor.value);
				} else {
					// ajax-Übertragung und anschließend Leeren des Log
					var data = new Object();
					data.log = log;
					data.settings = self.settings;
					$.ajax({
						type: "POST",
						dataType: "json",
						'data': data,
						beforeSend: function(x) {
							if(x && x.overrideMimeType) {
								x.overrideMimeType("application/json;charset=UTF-8");
							}
						},
						url: 'api/putData.php',
						success: function(data) {
							console.debug( 'Erfolg - saveLog:success - data:', data);
							if (data.status == 'erfolg') { 
								/* löschen des Eintrages, falls data.status == erfolg
								 * data enthält die id und den tabellenNamen
								 */
								self.db.transaction('log','readwrite').objectStore('log').clear().onerror = 
									function(e) {
										console.debug('Fehler - saveLog konnte nicht gelöscht werden. e:',e);
									};
							} else {
								console.error('Fehler - saveLog - Nach der Übermittlung wurde ein Fehler gemeldet. data:', data);
							}
						},
						error: function(data) {
							console.error('Fehler - saveLog - ajax ist gescheitert. data:',data);
						}
					});
					
				}
			}
		}
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
				o.person = this.get('person');
				return o;
			}
		},
	});

	// on... scheint nicht ausgelöst zu werden?
	// TODO wird noch nicht in DB eingetragen
	fb2.on('change:device', function(model, device) {
		this.db.transaction('einstellungen','readwrite').objectStore('einstellungen').put({
			'key':'device',
			'value':device
		}).onerror = function(e){
			console.warn('IDB - change:device - Einstellung für Device konnte nicht gespeichert werden.');
		};
		this.log('change:device ' + device);
	});
	fb2.on('change:tag', function(model, tag) {
		this.db.transaction('einstellungen','readwrite').objectStore('einstellungen').put({
			'key':'tag',
			'value':tag
		}).onerror = function(e){
			console.warn('IDB - change:tag - Einstellung für Tag konnte nicht gespeichert werden.');
		};
		this.log('change:tag ' + tag);
	});
	fb2.on('change:antwortenId', function(model, aI) {
		if (this.has('antwortenId')) {
			this.db.transaction('einstellungen','readwrite').objectStore('einstellungen').put( { 
				'key': 'antwortenId', 
				'value': aI } ).onerror = function() {
					console.warn( 'IDB - change:antwortenId - Fehler beim Schreiben der Einstellungen');
				}
		} else {
			this.db.transaction('einstellungen','readwrite').objectStore('einstellungen').delete('antwortenId');
		}
	});
	fb2.on('change:antwortenTabelle', function(model, aT) {
		if (this.has('antwortenTabelle')) {
			this.db.transaction('einstellungen','readwrite').objectStore('einstellungen').put( { 
				'key': 'antwortenTabelle', 
				'value': aT } ).onerror = function() {
					console.warn( 'IDB - change:antwortenTabelle - Fehler beim Schreiben der Einstellungen');
				}
		} else {
			this.db.transaction('einstellungen','readwrite').objectStore('einstellungen').delete('antwortenTabelle');
		}
	});

	fb2.on('change:antworten', function(model, antw) {
		console.debug( 'change:antworten antw', antw);
		var antwTab = this.get('antwortenTabelle');
		this.db.transaction(antwTab,'readwrite').objectStore(antwTab).put( antw ).onerror = function(e) {
			console.warn( 'IDB - neueAntworten - konnten nicht gespeichert werden: ', antw, antwTab, this.fragen);
		}
	});

	return Fb2Model;
} );

