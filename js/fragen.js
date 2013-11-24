// Fragen als Collection 
// ===================

define(function( require ) {
	var $ = require('jquery');
	var Backbone = require('backbone');
	var Frage = require('frage');
	var MtView = require('mtView');
	var FView = require('fView');
	var fehlerView = require('fehlerView');
	var SbView = require('sbView');
	var SeView = require('seView');
	var MsgView = require('msgView');

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
			this.add(new Frage('MH1',2,'beschäftigte ich mich mit verschiedenen Dingen gleichzeitig.'));
      this.add(new Frage('MH2',2,'arbeitete ich an mehr als einer Aufgabe.'));
      this.add(new Frage('MH3',2,'arbeitete ich Aufgaben nacheinander ab.'));
      this.add(new Frage('MH4',2,'erledigte ich mehrere Arbeiten und Aufgaben gleichzeitig.'));
      this.add(new Frage('MH5',2,'musste ich viele Dinge gleichzeitig im Kopf behalten.'));
      this.add(new Frage('MH6',2,'erhielt ich Anweisungen, die ich gleichzeitig im Kopf behalten musste.'));
      this.add(new Frage('MH7',2,'gab es Momente, die für kurze Zeit höchste Konzentration erfordert haben.'));
      this.add(new Frage('MH8',2,'kam es vor, dass mehrere Personen gleichzeitig etwas von mir wollten.'));
			
			this.add(new Frage('MZ1',3,'beschäftigte ich mich mit verschiedenen Dingen gleichzeitig.'));
      this.add(new Frage('MZ2',3,'arbeitete ich an mehr als einer Aufgabe.'));
      this.add(new Frage('MZ3',3,'arbeitete ich Aufgaben nacheinander ab.'));
      this.add(new Frage('MZ4',3,'erledigte ich mehrere Arbeiten und Aufgaben gleichzeitig.'));
      this.add(new Frage('MZ5',3,'musste ich viele Dinge gleichzeitig im Kopf behalten.'));
      this.add(new Frage('MZ6',3,'erhielt ich Anweisungen, die ich gleichzeitig im Kopf behalten musste.'));
      this.add(new Frage('MZ7',3,'gab es Momente, die für kurze Zeit höchste Konzentration erfordert haben.'));
      this.add(new Frage('MZ8',3,'kam es vor, dass mehrere Personen gleichzeitig etwas von mir wollten.'));

			this.add(new Frage('MF1',3,
				'beschäftigte ich mich mit verschiedenen Dingen (z.B. Hausarbeit, private Erledigungen) gleichzeitig.'));
      this.add(new Frage('MF2',3,
				'arbeitete ich an mehr als einer Aufgabe (z.B. Hausarbeit, private Erledigungen).'));
      this.add(new Frage('MF3',3,
				'arbeitete ich Aufgaben (z.B. Hausarbeit, private Erledigungen) nacheinander ab.'));
      this.add(new Frage('MF4',3,
				'erledigte ich mehrere Arbeiten und Aufgaben (z.B. Hausarbeit, private Erledigungen) gleichzeitig.'));

      this.add(new Frage('FRE',5,
				'Während der letzten 2 Arbeitsstunden konnte ich selbst entscheiden, ob ich Dinge gleichzeitig tue.',
				'trifft überhaupt nicht zu','trifft völlig zu'));

      this.add(new Frage('STI1',7,'In diesem Moment fühle ich mich &hellip;', 'sehr müde','sehr wach'));
      this.add(new Frage('STI2',7,'In diesem Moment fühle ich mich &hellip;', 'sehr unzufrieden','sehr zufrieden'));
      this.add(new Frage('STI3',7,'In diesem Moment fühle ich mich &hellip;', 'sehr unruhig','sehr ruhig'));
      this.add(new Frage('STI4',7,'In diesem Moment fühle ich mich &hellip;', 'sehr energielos','sehr energiegeladen'));
      this.add(new Frage('STI5',7,'In diesem Moment fühle ich mich &hellip;', 'sehr unwohl','sehr wohl'));
      this.add(new Frage('STI6',7,'In diesem Moment fühle ich mich &hellip;', 'sehr angespannt','sehr entspannt'));

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
				'Misserfolg', 'perfekter Erfolg'));
      this.add(new Frage('WL5',20,
				'Wie sehr mussten Sie sich in den letzten zwei Stunden anstrengen, um Ihre Leistung zu erreichen?', 
				'sehr wenig', 'sehr stark'));
      this.add(new Frage('WL6',20,
				'Wie verunsichert entmutigt, gereizt und verärgert waren Sie in den letzten zwei Stunden?', 
				'sehr wenig', 'sehr stark'));
      this.add(new Frage('WL7',20,'Wie gestresst fühlten Sie sich in den letzten zwei Stunden?',
				'sehr wenig','sehr stark'));

      this.add(new Frage('QUA',5,
				'Heute konnte ich meinen persönlichen Anspruch an die Arbeit zufrieden stellen.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('FEH',5,
				'Heute habe ich Fehler während meiner Arbeitszeit gemacht.',
				'trifft überhaupt nicht zu','trifft völlig zu'));

      this.add(new Frage('WE1',5,
				'Ich war heute bei meiner Arbeit voll überschäumender Energie.',
				'trifft gar nicht zu','trifft völlig zu'));
      this.add(new Frage('WE2',5,
				'Ich fühlte mich heute beim Arbeiten fit und tatkräftig.',
				'trifft gar nicht zu','trifft völlig zu'));
      this.add(new Frage('WE3',5,
				'Ich war von meiner Arbeit begeistert.',
				'trifft gar nicht zu','trifft völlig zu'));
      this.add(new Frage('WE4',5,
				'Heute hat mich meine Arbeit inspiriert.',
				'trifft gar nicht zu','trifft völlig zu'));
      this.add(new Frage('WE5',5,
				'Als ich heute Morgen aufgestanden bin, habe ich mich auf meine Arbeit gefreut.',
				'trifft gar nicht zu','trifft völlig zu'));
      this.add(new Frage('WE6',5,
				'Heute habe ich mich glücklich gefühlt, wenn ich intensiv gearbeitet habe.',
				'trifft gar nicht zu','trifft völlig zu'));
      this.add(new Frage('WE7',5,
				'Ich war heute stolz auf meine Arbeit.',
				'trifft gar nicht zu','trifft völlig zu'));
      this.add(new Frage('WE8',5,
				'Ich bin heute völlig in meiner Arbeit aufgegangen.',
				'trifft gar nicht zu','trifft völlig zu'));
      this.add(new Frage('WE9',5,
				'Heute hat meine Arbeit mich mitgerissen.',
				'trifft gar nicht zu','trifft völlig zu'));

      this.add(new Frage('WD1',5,
				'Heute habe ich jede Gelegenheit genutzt mich vor der Arbeit zu drücken.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('WD2',5,
				'Heute habe ich darüber nachgedacht alles hinzuschmeißen.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('WD3',5,
				'Heute habe ich mich weniger angestrengt als von mir erwartet wird.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('WD4',5,
				'Heute habe ich insgesamt mehr Zeit mit Pausen verbracht, als mir zusteht.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('WD5',5,
				'Heute habe ich bei der Arbeit viel Zeit mit Tagträumen verbracht.',
				'trifft überhaupt nicht zu','trifft völlig zu'));

			// erster Durchlauf
      this.add(new Frage('REC1w',5,
				'&hellip; war ich voll neuer Energie.',
				'trifft gar nicht zu','trifft völlig zu'));
      this.add(new Frage('REC2w',5,
				'&hellip; fühlte ich mich körperlich erholt.',
				'trifft gar nicht zu','trifft völlig zu'));
      this.add(new Frage('REC3w',5,
				'&hellip; fühlte ich mich geistig erholt.',
				'trifft gar nicht zu','trifft völlig zu'));
      this.add(new Frage('REC4w',5,
				'&hellip; fühlte ich mich ausgeschlafen.',
				'trifft gar nicht zu','trifft völlig zu'));

			// nach der Arbeit
      this.add(new Frage('REC1',5,
				'… bin ich voll neuer Energie.',
				'trifft gar nicht zu','trifft völlig zu'));
      this.add(new Frage('REC2',5,
				'… fühle ich mich körperlich erholt.',
				'trifft gar nicht zu','trifft völlig zu'));
      this.add(new Frage('REC3',5,
				'… fühle ich mich geistig erholt.',
				'trifft gar nicht zu','trifft völlig zu'));
      this.add(new Frage('REC4',5,
				'… fühle ich mich ausgeschlafen.',
				'trifft gar nicht zu','trifft völlig zu'));

      this.add(new Frage('Z1',5,
				'Ich stand heute unter Zeitdruck.',
				'trifft gar nicht zu','trifft vollständig zu'));
      this.add(new Frage('Z2',5,
				'Ich musste heute schneller arbeiten, als ich es normalerweise tue, um meine Arbeit zu schaffen.',
				'trifft gar nicht zu','trifft vollständig zu'));
      this.add(new Frage('Z3',5,
				'Bei meiner Arbeit wurde heute ein hohes Arbeitstempo verlangt.',
				'trifft gar nicht zu','trifft vollständig zu'));

      this.add(new Frage('P',5,
				'Ich habe die Pausen, die mir während der Arbeitszeit zustehen, in vollem Umfang genutzt.',
				'trifft überhaupt nicht zu','trifft völlig zu'));

      this.add(new Frage('HS1',2,
				'Wenn Sie Ihre Tätigkeit heute betrachten, inwieweit konnten Sie die Reihenfolge der Arbeitsschritte selbst festlegen?'));
      this.add(new Frage('HS2',2,
				'Wie viel Einfluss hatten Sie heute darauf, welche Aufgaben Sie heute bearbeitet haben?'));
      this.add(new Frage('HS3',2,
				'Wenn man Ihre Arbeit heute betrachtet, wie viel Möglichkeiten zu eigenen Entscheidungen bot Ihnen Ihre Arbeit?'));

      this.add(new Frage('SU1',5,
				'Haben Sie Ihre Kollegen heute als Unterstützung erlebt?',
				'sehr wenig','sehr stark'));
      this.add(new Frage('SU2',5,
				'Haben Sie Ihre Führungskraft heute als Unterstützung erlebt?',
				'sehr wenig','sehr stark'));

      this.add(new Frage('WHI',5,
				'Meine beruflichen Anforderungen behinderten heute mein Privat- und/oder Familienleben.',
				'stimme überhaupt nicht zu','stimme voll zu'));

      this.add(new Frage('EMO1',5,'&hellip; ausgebrannt.','trifft gar nicht zu','trifft vollständig zu'));
      this.add(new Frage('EMO2',5,'&hellip; emotional erschöpft.','trifft gar nicht zu','trifft vollständig zu'));
      this.add(new Frage('EMO3',5,'&hellip; frustriert.','trifft gar nicht zu','trifft vollständig zu'));

      this.add(new Frage('IRR1',7,
				'Es fiel mir heute schwer nach der Arbeit, abzuschalten.',
				'trifft überhaupt nicht zu','trifft fast völlig zu'));
      this.add(new Frage('IRR2',7,
				'Ich musste auch zu Hause an Schwierigkeiten bei der Arbeit denken.',
				'trifft überhaupt nicht zu','trifft fast völlig zu'));
      this.add(new Frage('IRR3',7,
				'Wenn andere mich ansprachen, kam es vor, dass ich mürrisch reagierte.',
				'trifft überhaupt nicht zu','trifft fast völlig zu'));
      this.add(new Frage('IRR4',7,
				'Selbst im Urlaub müsste ich jetzt manchmal an Probleme bei der Arbeit denken.',
				'trifft überhaupt nicht zu','trifft fast völlig zu'));
      this.add(new Frage('IRR5',7,
				'Ich fühlte mich heute ab und zu wie jemand, den man als Nervenbündel bezeichnet.',
				'trifft überhaupt nicht zu','trifft fast völlig zu'));
      this.add(new Frage('IRR6',7,
				'Ich war schnell verärgert.',
				'trifft überhaupt nicht zu','trifft fast völlig zu'));
      this.add(new Frage('IRR7',7,
				'Ich reagierte heute gereizt, obwohl ich es gar nicht wollte.',
				'trifft überhaupt nicht zu','trifft fast völlig zu'));
      this.add(new Frage('IRR8',7,
				'Als ich müde von der Arbeit nach Hause kam, fand ich durch nichts Erholung.',
				'trifft überhaupt nicht zu','trifft fast völlig zu'));

      this.add(new Frage('UE1',24,'Wie viele Stunden haben Sie heute gearbeitet?'));
      this.add(new Frage('UE2',11,'Wie viele Überstunden haben Sie heute gearbeitet?'));
      this.add(new Frage('UE3',11,
				'Wie lange haben Sie nach Ausfüllen des letzten Fragebogens noch für das Unternehmen gearbeitet?'));

      this.add(new Frage('ED1',5,
				'Ich fühle mich ausgelaugt.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('ED2',5,
				'Momentan kommen mir meine Gedanken unkonzentriert vor.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('ED3',5,
				'Im Moment wäre es sehr anstrengend für mich, mich auf etwas zu konzentrieren.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('ED4',5,
				'Ich habe momentan nicht viel mentale Energie.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('ED5',5,
				'Ich fühle mich, als hätte ich keine Willenskraft mehr.',
				'trifft überhaupt nicht zu','trifft völlig zu'));

      this.add(new Frage('SL1',4,
				'Wie würden Sie die Qualität Ihres heutigen Schlafes beurteilen?',
				'sehr schlecht','sehr gut'));
      this.add(new Frage('SL2',49,'Wie viele Stunden haben Sie während der letzten Nacht tatsächlich geschlafen?'));

      this.add(new Frage('ABS1',5,
				'&hellip; habe ich die Arbeit vergessen.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('ABS2',5,
				'&hellip; habe ich überhaupt nicht an meine Arbeit gedacht.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('ABS3',5,
				'&hellip;  ist es mir gelungen, mich von meiner Arbeit zu distanzieren.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('ABS4',5,
				'&hellip;  habe ich Abstand zu meinen beruflichen Anforderungen gewonnen.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('ABS5',5,
				'&hellip;  habe ich meine Seele baumeln lassen.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('ABS6',5,
				'&hellip; habe ich Dinge unternommen, bei denen ich mich entspannt habe.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('ABS7',5,
				'&hellip;  habe ich die Zeit genutzt, um zu relaxen.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('ABS8',5,
				'&hellip;  habe ich mir Zeit zur Muße genommen.',
				'trifft überhaupt nicht zu','trifft völlig zu'));

      this.add(new Frage('ANF1',5,
				'&hellip; hatte ich zu Hause viel zu tun.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('ANF2',5,
				'&hellip; musste ich zu Hause viele Dinge in Eile erledigen.',
				'trifft überhaupt nicht zu','trifft völlig zu'));
      this.add(new Frage('ANF3',5,
				'&hellip; musste ich zu Hause viele Aufgaben erledigen (z.B. Hausarbeit / Pflege / Kinderbetreuung).',
				'trifft überhaupt nicht zu','trifft völlig zu'));
/*

*/
			this.ablauf = {
				RECw: [
					{v: FView, f:['REC1w', 'REC2w', 'REC3w'], heading: 'Als ich meine Arbeit heute begonnen habe, &hellip;'},
					{v: FView, f:['REC4w', 'SL1', 'SL2'], heading: 'Als ich meine Arbeit heute begonnen habe, &hellip;'},
				],
				STI: [
					{v: FView, f:['STI1','STI2','STI3']},
					{v: FView, f:['STI4','STI5','STI6']},
				],
				ED: [
				{v: FView, f:['ED1', 'ED2', 'ED3'], heading: 'Wie fühlen Sie sich momentan?'},
				{v: FView, f:['ED4', 'ED5'], heading: 'Wie fühlen Sie sich momentan?'},

				
				],
				MH: [
					{v: MsgView, msg:'Bitte geben Sie an, wie <strong>häufig</strong> folgende Situationen vorkamen.<br/>'},
					{v: MtView, f:['MH1'], heading: 'In den letzten 2 Arbeitsstunden'},
					{v: MtView, f:['MH2'], heading: 'In den letzten 2 Arbeitsstunden'},
					{v: MtView, f:['MH3'], heading: 'In den letzten 2 Arbeitsstunden'},
					{v: MtView, f:['MH4'], heading: 'In den letzten 2 Arbeitsstunden'},
					{v: MtView, f:['MH5'], heading: 'In den letzten 2 Arbeitsstunden'},
					{v: MtView, f:['MH6'], heading: 'In den letzten 2 Arbeitsstunden'},
					{v: MtView, f:['MH7'], heading: 'In den letzten 2 Arbeitsstunden'},
					{v: MtView, f:['MH8'], heading: 'In den letzten 2 Arbeitsstunden'},
				],
				MZ: [
					{v: MsgView, msg:'Bitte geben Sie an, wie sehr folgende Aussagen auf Sie <strong>zutreffen</strong>.<br/>'},
					{v: MtView, f:['MZ1'], heading: 'In den letzten 2 Arbeitsstunden'},
					{v: MtView, f:['MZ2'], heading: 'In den letzten 2 Arbeitsstunden'},
					{v: MtView, f:['MZ3'], heading: 'In den letzten 2 Arbeitsstunden'},
					{v: MtView, f:['MZ4'], heading: 'In den letzten 2 Arbeitsstunden'},
					{v: MtView, f:['MZ5'], heading: 'In den letzten 2 Arbeitsstunden'},
					{v: MtView, f:['MZ6'], heading: 'In den letzten 2 Arbeitsstunden'},
					{v: MtView, f:['MZ7'], heading: 'In den letzten 2 Arbeitsstunden'},
					{v: MtView, f:['MZ8'], heading: 'In den letzten 2 Arbeitsstunden'},
				],
				MF: [
					{v: MsgView, msg:'Bitte geben Sie an, wie sehr folgende Aussagen auf Sie <strong>zutreffen</strong>.<br/>'},
					{v: MtView, f:['MF1'], heading: 'In meiner Freizeit'},
					{v: MtView, f:['MF2'], heading: 'In meiner Freizeit'},
					{v: MtView, f:['MF3'], heading: 'In meiner Freizeit'},
					{v: MtView, f:['MF4'], heading: 'In meiner Freizeit'},
					{v: MtView, f:['MZ5'], heading: 'In meiner Freizeit'},
					{v: MtView, f:['MZ7'], heading: 'In meiner Freizeit'},
					{v: MtView, f:['MZ8'], heading: 'In meiner Freizeit'},
				],
				W2: [ 
					{v: FView, f:['FRE']},
					{v: FView, f:['FLO1','FLO2'], heading:'Bitte geben Sie an, inwieweit die folgenden Aussagen in den letzten zwei Stunden auf Sie zutrafen.'},
					{v: FView, f:['FLO3','FLO4'], heading:'Bitte geben Sie an, inwieweit die folgenden Aussagen in den letzten zwei Stunden auf Sie zutrafen.'},
				],
				WL: [ 
					{v: FView, f:['WL1', 'WL2', 'WL3']},
					{v: FView, f:['WL4', 'WL5', 'WL6']},
					{v: FView, f:['WL7']}
				],
				N1: [
					{v: FView, f:['QUA', 'FEH', 'WE1']},
					{v: FView, f:['WE2', 'WE3', 'WE4']},
					{v: FView, f:['WE5', 'WE6', 'WE7']},
					{v: FView, f:['WE8', 'WE9', 'WD1']},
					{v: FView, f:['WD2', 'WD3', 'WD4']},
					{v: FView, f:['REC1'], heading: 'Im Folgenden finden Sie einige Aussagen über Empfindungen, die man in seiner Freizeit erleben kann. Bitte kreuzen Sie an, inwieweit die jeweilige Aussage auf Sie zutrifft.<br/>Jetzt, nach Arbeitsende, …'},
					{v: FView, f:['REC2', 'REC3', 'REC4'], heading: 'Jetzt, nach Arbeitsende, …'},
				],
				N2: [
					{v: FView, f:['UE1', 'UE2']},
					{v: FView, f:['Z1', 'Z2', 'Z3'], heading: 'Inwiefern stimmen Sie den folgenden Aussagen zu?'},
					{v: FView, f:['P', 'SU1', 'SU2'] },
					{v: MtView, f:['HS1'] },
					{v: MtView, f:['HS2'] },
					{v: MtView, f:['HS3'] },
					{v: SeView}
				],
				A1: [
					{v: FView, f:['WHI', 'IRR1', 'IRR2']},
					{v: FView, f:['IRR3', 'IRR4', 'IRR5']},
					{v: FView, f:['IRR6', 'IRR7', 'IRR8']},
					{v: FView, f:['EMO1', 'EMO2', 'EMO3'], heading: 'Heute fühlte ich mich durch meine Arbeit &hellip;'},
					{v: FView, f:['ABS1', 'ABS2', 'ABS3'], heading: 'In meiner Freizeit &hellip;'},
					{v: FView, f:['ABS4', 'ABS5', 'ABS6'], heading: 'In meiner Freizeit &hellip;'},
					{v: FView, f:['ABS7', 'ABS8', 'UE3'], heading: 'In meiner Freizeit &hellip;'},
					{v: FView, f:['ANF1', 'ANF2', 'ANF3'], heading: 'In meiner Freizeit &hellip;'},
					{v: SbView}
				]
			};
	
			Object.defineProperty(this.ablauf, 'O', { // keine Ablauf
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return [] },
			});
			Object.defineProperty(this.ablauf, 'A', { // abends 
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return this.STI.concat(this.MF,this.A1) },
			});
			Object.defineProperty(this.ablauf, 'WA', { // erster Druchlauf - während der Arbeit
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return this.STI.concat(this.ED,this.RECw,this.MZ,this.W2,this.WL) },
			});
			Object.defineProperty(this.ablauf, 'WB', { // erster Druchlauf - während der Arbeit
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return this.STI.concat(this.ED,this.RECw,this.MH,this.W2,this.WL) },
			});
			Object.defineProperty(this.ablauf, 'QA', { // zweiter Durchlauf - während der Arbeit
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return this.STI.concat(this.ED,this.MH,this.W2,this.WL) },
			});
			Object.defineProperty(this.ablauf, 'QB', { // zweiter Durchlauf - während der Arbeit
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return this.STI.concat(this.ED,this.MZ,this.W2,this.WL) },
			});
			Object.defineProperty(this.ablauf, 'NA', { // Anhang zu nach der Arbeit 
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return this.STI.concat(this.ED,this.MZ,this.N1,this.WL,this.N2) },
			});
			Object.defineProperty(this.ablauf, 'NB', { // Anhang zu nach der Arbeit 
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return this.STI.concat(this.ED,this.MH,this.N1,this.WL,this.N2) },
			});
		}, // Ende initialize

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
		},
		entferneAntworten: function() {
			this.each(function(frage) { 
				frage.set( {'ant': null });
			});
		}
	}); // Ende Backbone.model.extend

	return Fragen;
}); // Ende define
