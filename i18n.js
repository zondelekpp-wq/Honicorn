/* Honicorn – texts in 7 languages. © 2026 Piotr Żondełek. All rights reserved. */
const MAIL='<a href="mailto:zondelek.p.p@gmail.com">zondelek.p.p@gmail.com</a>';
const I18N={
en:{
tagline:"Blow off steam. Safely. Ridiculously.",start:"I'm fuming! Let's go",tools:"Pick your weapon",
t_smash:"Rage Room",d_smash:"Smash plates, vases and the office printer.",
t_scream:"Scream-o-meter",d_scream:"Scream into the mic and topple the tower.",
t_crush:"Problem Crusher",d_crush:"Write or say what bugs you. Then destroy it.",
t_insult:"Insult Generator",d_insult:"Absurd insults to yell at the universe.",
t_volcano:"Volcano",d_volcano:"Shake until it erupts.",
t_bag:"Punching Bag",d_bag:"It has a face. A smug one.",
meterTitle:"Rage-o-meter",meterBefore:"How angry are you right now?",meterAfter:"And how about now?",
lv:["Chill","Irritated","Angry","Furious","Volcano mode"],next:"Next",
done:"Done – cool me down",back:"Tools",home:"Home",atStart:"Starting level",
smashHint:"Tap to smash. Shaking works too.",destroyed:"Smashed",
screamStart:"Turn on the microphone",screamHold:"Hold to roar",screamHint:"Scream! Knock the tower down.",micDenied:"No microphone access – hold the button to roar instead.",towers:"Towers",
sl:["Whisper","Grumble","Shout","Neighbour is calling","Seismic alert"],peak:"Record",
crushPh:"What's driving you mad? Write it or say it…",speak:"🎙️ Say it",stopRec:"⏹ Stop",recording:"Listening…",voiceNote:"Voice note",crumple:"Crumple it!",needText:"Write or say something first.",whereTo:"Where should it go?",
dTrash:"Bin",dShred:"Shredder",dRocket:"Into space",dGoat:"Feed the goat",gone:"Gone. It doesn't exist anymore.",again:"Another problem",notSaved:"Nothing is saved. It disappears for good.",
insAnother:"Another one",insShout:"🔊 Shout it",insCopy:"Copy",copied:"Copied!",insHint:"Yell it out loud. Seriously, it helps.",
volHint:"Tap like crazy or shake your phone!",pressure:"Pressure",eruptions:"Eruptions",
bagHint:"Hit it. It deserves it.",hits:"Hits",power:"Power",
coolTitle:"Cool down",inhale:"Breathe in…",exhale:"Breathe out…",coolSub:"The robot is cleaning up your mess. You just breathe.",skip:"Skip",meanPaused:"Mean mode paused. Even I respect breathing.",
resTitle:"Your result",resDown:"Down by {n}. Nicely done!",resSame:"Same level. Fancy another round or a longer breather?",resUp:"Up by {n}. Happens! Try another tool or a longer breather.",resOnly:"You're at {n}/10 now.",again2:"Another round",
settings:"Settings",language:"Language",colours:"Colours",sound:"Sound",vibration:"Vibration",history:"History",noHistory:"No sessions yet.",avgDrop:"Average drop",sessions:"Sessions",clearHist:"Clear history",
about:"About",terms:"Terms & privacy",support:"Buy me a coffee",share:"Share",shareText:"Honicorn – blow off steam, safely and ridiculously.",linkCopied:"Link copied!",
meanOn:"Mega mean mode ON 😈",meanOff:"Nice mode 😇",meanWarn:"In mega mean mode Honicorn teases you. It's all a joke – switch it off anytime.",ok:"Bring it on",cancel:"Cancel",motion:"📳 Enable shaking",
install:"📲 Install the app",iosHint:"On iPhone: tap Share ⬆️, then “Add to Home Screen”.",menuHint:"Open the browser menu ⋮ and choose “Install app” or “Add to Home screen”.",inAppHint:"Open this page in Chrome or Safari to install it.",
supportText:"Everything in Honicorn is and will stay free. A coffee is simply voluntary support for the creative process. ☕",
r:{gen:["Is that all you've got? My calculator gets angrier.","Terrifying. A hamster just laughed at you.","You call that rage? Pudding is scarier.","Keep going. The screen isn't even scared.","Adorable. Now do it like you mean it.","Somewhere a kitten is more intimidating than you.","My last reboot had more passion.","Slow clap. Very, very slow."],
smash:["The plate survived. Emotionally, at least.","My grandma breaks more dishes by accident."],
scream:["Was that a scream or a polite sneeze?","The neighbours didn't even notice. Again."],
crush:["That's your big problem? Cute.","Even the goat says it's a tiny problem."],
volcano:["That's not a volcano, that's a warm puddle.","Shake harder. It's a phone, not a soufflé."],
bag:["The bag is yawning.","Are you punching it or patting it?"],
insult:["Reading insults off a screen. So brave.","Louder. Nobody heard that."],
idle:"Hello? Did you rage-quit already?",down:"Look at you, all calm. Took you long enough.",same:"Nothing changed. Impressive, in a way. Again?",up:"Angrier than before? Honestly, that's a talent. Round two?"},
info:`<h3>Why it works</h3>
<p><b>Naming it.</b> Writing or saying what makes you angry is more than a game. Psychologists call it <i>affect labelling</i>: putting an emotion into words lowers its intensity.</p>
<p><b>Moving it.</b> Anger is energy in your body. A short burst of tapping, shaking and shouting lets it out – without breaking anything real or hurting anyone.</p>
<p><b>Laughing at it.</b> It's hard to stay furious while a goat eats your problem. Humour breaks the anger loop.</p>
<p><b>Landing softly.</b> Venting on its own can keep anger going, so every session ends with slow breathing and a check on the Rage-o-meter. First the blast, then the exhale.</p>
<h3>Who it's for</h3>
<p>Anyone having one of those days: after a terrible meeting, in a traffic jam, after a fight with the printer or a phone call you'd rather forget. No diagnosis needed.</p>
<h3>Good to know</h3>
<p>Honicorn is a fun tool, not therapy. If anger often takes over, or you feel you might hurt yourself or someone else, please talk to a doctor, a psychologist or someone you trust.</p>
<p>Mega mean mode 😈 only teases your rage skills – never who you are.</p>`,
termsHtml:`<h3>Terms of use</h3>
<p>Honicorn is free. It is provided "as is", for fun and relaxation, and is not a medical or psychological tool.</p>
<p>Use smashing and shaking safely: hold your phone firmly and mind your surroundings.</p>
<h3>Privacy</h3>
<p>No account, no ads, no tracking. Your settings and Rage-o-meter history are stored only on your device, and you can delete them in Settings.</p>
<p>The microphone is used only live, to measure loudness in the Scream-o-meter – nothing is recorded or sent. Voice notes in the Problem Crusher stay in your phone's memory and are deleted when you destroy them.</p>
<p>Speech-to-text ("Say it") uses your browser's built-in speech service, which may send audio to its provider (for example Google in Chrome). If you prefer, just type.</p>
<h3>Copyright</h3>
<p>© 2026 Piotr Żondełek. All rights reserved. Copying, modifying or redistributing the app or any of its parts without written permission is not allowed.</p>
<p>Contact: ${MAIL}</p>`},

pl:{
tagline:"Spuść parę. Bezpiecznie. Absurdalnie.",start:"Kipię! Zaczynamy",tools:"Wybierz broń",
t_smash:"Pokój furii",d_smash:"Tłucz talerze, wazony i biurową drukarkę.",
t_scream:"Krzykomierz",d_scream:"Wykrzycz się do mikrofonu i zwal wieżę.",
t_crush:"Zgniatarka problemów",d_crush:"Napisz albo powiedz, co cię wkurza. Potem to zniszcz.",
t_insult:"Generator obelg",d_insult:"Absurdalne obelgi do wykrzyczenia w eter.",
t_volcano:"Wulkan",d_volcano:"Potrząsaj, aż wybuchnie.",
t_bag:"Worek treningowy",d_bag:"Ma twarz. Bardzo zadowoloną z siebie.",
meterTitle:"Wkurzometr",meterBefore:"Jak mocno cię teraz nosi?",meterAfter:"A teraz?",
lv:["Luz","Irytacja","Złość","Furia","Tryb wulkan"],next:"Dalej",
done:"Gotowe – wycisz mnie",back:"Narzędzia",home:"Start",atStart:"Na starcie",
smashHint:"Stuknij, żeby rozwalić. Potrząsanie też działa.",destroyed:"Rozbite",
screamStart:"Włącz mikrofon",screamHold:"Przytrzymaj i ryknij",screamHint:"Krzycz! Zwal wieżę.",micDenied:"Brak dostępu do mikrofonu – przytrzymaj przycisk, żeby ryknąć.",towers:"Wieże",
sl:["Szept","Burczenie","Krzyk","Sąsiad już dzwoni","Alarm sejsmiczny"],peak:"Rekord",
crushPh:"Co cię doprowadza do szału? Napisz albo powiedz…",speak:"🎙️ Powiedz",stopRec:"⏹ Stop",recording:"Słucham…",voiceNote:"Notatka głosowa",crumple:"Zgnieć to!",needText:"Najpierw coś napisz albo powiedz.",whereTo:"Gdzie z tym?",
dTrash:"Do kosza",dShred:"Do niszczarki",dRocket:"W kosmos",dGoat:"Nakarm kozę",gone:"Po sprawie. To już nie istnieje.",again:"Kolejny problem",notSaved:"Nic nie jest zapisywane. Znika na zawsze.",
insAnother:"Następna",insShout:"🔊 Wykrzycz",insCopy:"Kopiuj",copied:"Skopiowane!",insHint:"Powiedz to na głos. Serio, pomaga.",
volHint:"Stukaj jak najszybciej albo potrząsaj telefonem!",pressure:"Ciśnienie",eruptions:"Wybuchy",
bagHint:"Przywal mu. Zasłużył.",hits:"Ciosy",power:"Moc",
coolTitle:"Wyciszenie",inhale:"Wdech…",exhale:"Wydech…",coolSub:"Robot sprząta twój bałagan. Ty tylko oddychaj.",skip:"Pomiń",meanPaused:"Tryb wredny w pauzie. Nawet ja szanuję oddech.",
resTitle:"Twój wynik",resDown:"Mniej o {n}. Dobra robota!",resSame:"Bez zmian. Może jeszcze jedna runda albo dłuższe wyciszenie?",resUp:"Więcej o {n}. Zdarza się! Spróbuj innego narzędzia albo dłuższego wyciszenia.",resOnly:"Jesteś teraz na {n}/10.",again2:"Jeszcze raz",
settings:"Ustawienia",language:"Język",colours:"Kolory",sound:"Dźwięk",vibration:"Wibracje",history:"Historia",noHistory:"Jeszcze nie ma sesji.",avgDrop:"Średni spadek",sessions:"Sesje",clearHist:"Wyczyść historię",
about:"O aplikacji",terms:"Regulamin i prywatność",support:"Postaw kawę",share:"Udostępnij",shareText:"Honicorn – spuść parę, bezpiecznie i absurdalnie.",linkCopied:"Link skopiowany!",
meanOn:"Tryb mega wredny WŁĄCZONY 😈",meanOff:"Tryb miły 😇",meanWarn:"W trybie mega wrednym Honicorn będzie ci dogryzać. To wszystko żart – wyłączysz go w każdej chwili.",ok:"Dawaj",cancel:"Anuluj",motion:"📳 Włącz potrząsanie",
install:"📲 Zainstaluj aplikację",iosHint:"Na iPhonie: stuknij Udostępnij ⬆️, a potem „Do ekranu początkowego”.",menuHint:"Otwórz menu przeglądarki ⋮ i wybierz „Zainstaluj aplikację” lub „Dodaj do ekranu głównego”.",inAppHint:"Otwórz tę stronę w Chrome lub Safari, żeby ją zainstalować.",
supportText:"Wszystko w Honicornie jest i zawsze będzie darmowe. Kawa to po prostu dobrowolne wsparcie procesu twórczego. ☕",
r:{gen:["To wszystko, na co cię stać? Mój kalkulator wkurza się bardziej.","Przerażające. Chomik właśnie się z ciebie zaśmiał.","To ma być furia? Budyń bywa groźniejszy.","Dalej, dalej. Ekran nawet się nie boi.","Słodkie. A teraz na serio.","Gdzieś na świecie kotek jest groźniejszy od ciebie.","Mój ostatni restart miał więcej pasji.","Powolne oklaski. Bardzo powolne."],
smash:["Talerz przeżył. Przynajmniej emocjonalnie.","Babcia tłucze więcej naczyń przypadkiem."],
scream:["To był krzyk czy grzeczne kichnięcie?","Sąsiedzi nawet nie zauważyli. Znowu."],
crush:["To jest ten wielki problem? Uroczo.","Nawet koza mówi, że to problemik."],
volcano:["To nie wulkan, to ciepła kałuża.","Mocniej. To telefon, nie suflet."],
bag:["Worek ziewa.","Bijesz go czy głaszczesz?"],
insult:["Czytanie obelg z ekranu. Jakie odważne.","Głośniej. Nikt nie usłyszał."],
idle:"Halo? Już się poddajesz?",down:"No proszę, spokój. Długo to trwało.",same:"Nic się nie zmieniło. Na swój sposób imponujące. Jeszcze raz?",up:"Złość ci wzrosła? Szczerze, to talent. Runda druga?"},
info:`<h3>Dlaczego to działa</h3>
<p><b>Nazwanie.</b> Napisanie albo powiedzenie, co cię wkurza, to coś więcej niż zabawa. Psycholodzy nazywają to <i>etykietowaniem emocji</i>: ubranie emocji w słowa zmniejsza jej siłę.</p>
<p><b>Ruch.</b> Złość to energia w ciele. Krótka seria stukania, potrząsania i krzyku pozwala ją wypuścić – bez niszczenia prawdziwych rzeczy i bez krzywdzenia kogokolwiek.</p>
<p><b>Śmiech.</b> Trudno dalej kipieć, kiedy koza zjada twój problem. Humor przerywa spiralę złości.</p>
<p><b>Miękkie lądowanie.</b> Samo wyładowanie potrafi podtrzymywać złość, dlatego każda sesja kończy się spokojnym oddechem i sprawdzeniem Wkurzometru. Najpierw wybuch, potem wydech.</p>
<h3>Dla kogo</h3>
<p>Dla każdego, kto ma jeden z tych dni: po fatalnym zebraniu, w korku, po walce z drukarką albo po telefonie, o którym wolisz zapomnieć. Żadna diagnoza nie jest potrzebna.</p>
<h3>Dobrze wiedzieć</h3>
<p>Honicorn to zabawne narzędzie, nie terapia. Jeśli złość często przejmuje nad tobą kontrolę albo czujesz, że możesz skrzywdzić siebie lub kogoś innego, porozmawiaj z lekarzem, psychologiem albo kimś, komu ufasz.</p>
<p>Tryb mega wredny 😈 droczy się tylko z twoimi umiejętnościami wściekania się – nigdy z tym, kim jesteś.</p>`,
termsHtml:`<h3>Zasady korzystania</h3>
<p>Honicorn jest darmowy. Jest udostępniany „tak jak jest”, dla zabawy i odprężenia, i nie jest narzędziem medycznym ani psychologicznym.</p>
<p>Korzystaj z tłuczenia i potrząsania bezpiecznie: trzymaj telefon mocno i uważaj na otoczenie.</p>
<h3>Prywatność</h3>
<p>Bez konta, bez reklam, bez śledzenia. Ustawienia i historia Wkurzometru są zapisywane tylko na twoim urządzeniu i możesz je usunąć w Ustawieniach.</p>
<p>Mikrofon jest używany tylko na żywo, do mierzenia głośności w Krzykomierzu – nic nie jest nagrywane ani wysyłane. Notatki głosowe w Zgniatarce problemów zostają w pamięci telefonu i są usuwane, gdy je zniszczysz.</p>
<p>Zamiana mowy na tekst („Powiedz”) korzysta z wbudowanej usługi przeglądarki, która może wysyłać dźwięk do swojego dostawcy (np. Google w Chrome). Jeśli wolisz, po prostu pisz.</p>
<h3>Prawa autorskie</h3>
<p>© 2026 Piotr Żondełek. Wszelkie prawa zastrzeżone. Kopiowanie, modyfikowanie i rozpowszechnianie aplikacji lub jej części bez pisemnej zgody jest zabronione.</p>
<p>Kontakt: ${MAIL}</p>`},

de:{
tagline:"Dampf ablassen. Sicher. Absurd.",start:"Ich koche! Los geht's",tools:"Wähle deine Waffe",
t_smash:"Wutraum",d_smash:"Zertrümmere Teller, Vasen und den Bürodrucker.",
t_scream:"Schreimeter",d_scream:"Schrei ins Mikro und bring den Turm zum Einsturz.",
t_crush:"Problemquetsche",d_crush:"Schreib oder sag, was dich nervt. Dann zerstör es.",
t_insult:"Beleidigungsgenerator",d_insult:"Absurde Beschimpfungen fürs Universum.",
t_volcano:"Vulkan",d_volcano:"Schüttle, bis er ausbricht.",
t_bag:"Boxsack",d_bag:"Er hat ein Gesicht. Ein ziemlich selbstgefälliges.",
meterTitle:"Wutometer",meterBefore:"Wie wütend bist du gerade?",meterAfter:"Und jetzt?",
lv:["Entspannt","Gereizt","Wütend","Rasend","Vulkanmodus"],next:"Weiter",
done:"Fertig – beruhig mich",back:"Werkzeuge",home:"Start",atStart:"Startwert",
smashHint:"Tippen zum Zertrümmern. Schütteln geht auch.",destroyed:"Zerdeppert",
screamStart:"Mikrofon einschalten",screamHold:"Halten zum Brüllen",screamHint:"Schrei! Wirf den Turm um.",micDenied:"Kein Mikrofonzugriff – halte stattdessen den Knopf zum Brüllen.",towers:"Türme",
sl:["Flüstern","Grummeln","Schreien","Der Nachbar ruft an","Erdbebenalarm"],peak:"Rekord",
crushPh:"Was treibt dich in den Wahnsinn? Schreib es oder sag es…",speak:"🎙️ Sagen",stopRec:"⏹ Stopp",recording:"Ich höre zu…",voiceNote:"Sprachnotiz",crumple:"Zerknüllen!",needText:"Schreib oder sag zuerst etwas.",whereTo:"Wohin damit?",
dTrash:"In den Müll",dShred:"Aktenvernichter",dRocket:"Ins All",dGoat:"Ziege füttern",gone:"Weg. Existiert nicht mehr.",again:"Nächstes Problem",notSaved:"Nichts wird gespeichert. Es verschwindet für immer.",
insAnother:"Noch eine",insShout:"🔊 Rausbrüllen",insCopy:"Kopieren",copied:"Kopiert!",insHint:"Sag es laut. Ehrlich, es hilft.",
volHint:"Tippe wie verrückt oder schüttle dein Handy!",pressure:"Druck",eruptions:"Ausbrüche",
bagHint:"Hau drauf. Er hat's verdient.",hits:"Treffer",power:"Power",
coolTitle:"Runterkommen",inhale:"Einatmen…",exhale:"Ausatmen…",coolSub:"Der Roboter räumt dein Chaos auf. Du atmest nur.",skip:"Überspringen",meanPaused:"Fiesmodus pausiert. Sogar ich respektiere das Atmen.",
resTitle:"Dein Ergebnis",resDown:"{n} weniger. Gut gemacht!",resSame:"Gleiches Level. Noch eine Runde oder länger atmen?",resUp:"{n} mehr. Passiert! Probier ein anderes Werkzeug oder atme länger.",resOnly:"Du bist jetzt bei {n}/10.",again2:"Noch eine Runde",
settings:"Einstellungen",language:"Sprache",colours:"Farben",sound:"Ton",vibration:"Vibration",history:"Verlauf",noHistory:"Noch keine Sitzungen.",avgDrop:"Ø Rückgang",sessions:"Sitzungen",clearHist:"Verlauf löschen",
about:"Über die App",terms:"Nutzung & Datenschutz",support:"Kauf mir einen Kaffee",share:"Teilen",shareText:"Honicorn – Dampf ablassen, sicher und absurd.",linkCopied:"Link kopiert!",
meanOn:"Mega-Fiesmodus AN 😈",meanOff:"Netter Modus 😇",meanWarn:"Im Mega-Fiesmodus zieht Honicorn dich auf. Alles nur Spaß – jederzeit abschaltbar.",ok:"Her damit",cancel:"Abbrechen",motion:"📳 Schütteln aktivieren",
install:"📲 App installieren",iosHint:"Auf dem iPhone: Teilen ⬆️ tippen, dann „Zum Home-Bildschirm“.",menuHint:"Öffne das Browsermenü ⋮ und wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“.",inAppHint:"Öffne diese Seite in Chrome oder Safari, um sie zu installieren.",
supportText:"Alles in Honicorn ist und bleibt kostenlos. Ein Kaffee ist einfach freiwillige Unterstützung für den kreativen Prozess. ☕",
r:{gen:["Ist das alles? Mein Taschenrechner wird wütender.","Furchterregend. Ein Hamster lacht dich gerade aus.","Das soll Wut sein? Pudding ist bedrohlicher.","Weiter so. Der Bildschirm hat nicht mal Angst.","Niedlich. Jetzt nochmal mit Gefühl.","Irgendwo ist ein Kätzchen einschüchternder als du.","Mein letzter Neustart hatte mehr Leidenschaft.","Langsames Klatschen. Sehr langsam."],
smash:["Der Teller hat überlebt. Zumindest emotional.","Oma zerdeppert aus Versehen mehr Geschirr."],
scream:["War das ein Schrei oder ein höfliches Niesen?","Die Nachbarn haben nichts gemerkt. Schon wieder."],
crush:["Das ist dein großes Problem? Süß.","Sogar die Ziege sagt, das ist ein Problemchen."],
volcano:["Das ist kein Vulkan, das ist eine warme Pfütze.","Fester schütteln. Das ist ein Handy, kein Soufflé."],
bag:["Der Boxsack gähnt.","Boxt du ihn oder streichelst du ihn?"],
insult:["Beleidigungen vom Bildschirm ablesen. Wie mutig.","Lauter. Das hat keiner gehört."],
idle:"Hallo? Schon aufgegeben?",down:"Sieh an, ganz ruhig. Hat ja gedauert.",same:"Nichts hat sich geändert. Auf seine Art beeindruckend. Nochmal?",up:"Noch wütender? Ehrlich, das ist ein Talent. Runde zwei?"},
info:`<h3>Warum es funktioniert</h3>
<p><b>Benennen.</b> Aufzuschreiben oder auszusprechen, was dich wütend macht, ist mehr als ein Spiel. Psychologen nennen das <i>Affekt-Etikettierung</i>: Ein Gefühl in Worte zu fassen, schwächt es ab.</p>
<p><b>Bewegen.</b> Wut ist Energie im Körper. Ein kurzer Ausbruch aus Tippen, Schütteln und Schreien lässt sie raus – ohne echte Dinge kaputt zu machen oder jemanden zu verletzen.</p>
<p><b>Lachen.</b> Es ist schwer, wütend zu bleiben, während eine Ziege dein Problem frisst. Humor unterbricht die Wutspirale.</p>
<p><b>Sanft landen.</b> Nur Dampf ablassen kann die Wut am Laufen halten. Darum endet jede Sitzung mit ruhigem Atmen und einem Blick aufs Wutometer. Erst der Knall, dann das Ausatmen.</p>
<h3>Für wen</h3>
<p>Für alle, die einen dieser Tage haben: nach einem furchtbaren Meeting, im Stau, nach einem Kampf mit dem Drucker oder einem Telefonat, das du lieber vergessen würdest. Keine Diagnose nötig.</p>
<h3>Gut zu wissen</h3>
<p>Honicorn ist ein spaßiges Werkzeug, keine Therapie. Wenn die Wut oft die Oberhand gewinnt oder du das Gefühl hast, dir oder anderen schaden zu können, sprich bitte mit einer Ärztin, einem Psychologen oder jemandem, dem du vertraust.</p>
<p>Der Mega-Fiesmodus 😈 neckt nur deine Wut-Künste – niemals dich als Person.</p>`,
termsHtml:`<h3>Nutzungsbedingungen</h3>
<p>Honicorn ist kostenlos. Die App wird „wie sie ist“ bereitgestellt, zum Spaß und zur Entspannung, und ist kein medizinisches oder psychologisches Hilfsmittel.</p>
<p>Nutze Zertrümmern und Schütteln sicher: Halte dein Handy gut fest und achte auf deine Umgebung.</p>
<h3>Datenschutz</h3>
<p>Kein Konto, keine Werbung, kein Tracking. Einstellungen und Wutometer-Verlauf werden nur auf deinem Gerät gespeichert und lassen sich in den Einstellungen löschen.</p>
<p>Das Mikrofon wird nur live genutzt, um im Schreimeter die Lautstärke zu messen – nichts wird aufgenommen oder gesendet. Sprachnotizen in der Problemquetsche bleiben im Speicher deines Handys und werden gelöscht, wenn du sie zerstörst.</p>
<p>Die Spracherkennung („Sagen“) nutzt den eingebauten Dienst deines Browsers, der Audio an seinen Anbieter senden kann (z. B. Google in Chrome). Wenn dir das lieber ist, tippe einfach.</p>
<h3>Urheberrecht</h3>
<p>© 2026 Piotr Żondełek. Alle Rechte vorbehalten. Kopieren, Verändern oder Weiterverbreiten der App oder ihrer Teile ohne schriftliche Erlaubnis ist nicht gestattet.</p>
<p>Kontakt: ${MAIL}</p>`},

es:{
tagline:"Suelta vapor. Seguro. Absurdo.",start:"¡Echo humo! Vamos",tools:"Elige tu arma",
t_smash:"Sala de la furia",d_smash:"Rompe platos, jarrones y la impresora de la oficina.",
t_scream:"Gritómetro",d_scream:"Grita al micro y derriba la torre.",
t_crush:"Trituradora de problemas",d_crush:"Escribe o di lo que te molesta. Luego destrúyelo.",
t_insult:"Generador de insultos",d_insult:"Insultos absurdos para gritarle al universo.",
t_volcano:"Volcán",d_volcano:"Agita hasta que entre en erupción.",
t_bag:"Saco de boxeo",d_bag:"Tiene cara. Y muy creída.",
meterTitle:"Rabiómetro",meterBefore:"¿Cuánta rabia tienes ahora mismo?",meterAfter:"¿Y ahora?",
lv:["Tranqui","Irritación","Enfado","Furia","Modo volcán"],next:"Siguiente",
done:"Listo – cálmame",back:"Herramientas",home:"Inicio",atStart:"Al empezar",
smashHint:"Toca para romper. Agitar también vale.",destroyed:"Rotos",
screamStart:"Activar micrófono",screamHold:"Mantén para rugir",screamHint:"¡Grita! Derriba la torre.",micDenied:"Sin acceso al micrófono: mantén pulsado el botón para rugir.",towers:"Torres",
sl:["Susurro","Gruñido","Grito","Llama el vecino","Alerta sísmica"],peak:"Récord",
crushPh:"¿Qué te saca de quicio? Escríbelo o dilo…",speak:"🎙️ Decirlo",stopRec:"⏹ Parar",recording:"Escuchando…",voiceNote:"Nota de voz",crumple:"¡Arrúgalo!",needText:"Primero escribe o di algo.",whereTo:"¿A dónde lo mandamos?",
dTrash:"A la papelera",dShred:"Trituradora",dRocket:"Al espacio",dGoat:"Dárselo a la cabra",gone:"Adiós. Ya no existe.",again:"Otro problema",notSaved:"No se guarda nada. Desaparece para siempre.",
insAnother:"Otro",insShout:"🔊 Gritarlo",insCopy:"Copiar",copied:"¡Copiado!",insHint:"Dilo en voz alta. En serio, ayuda.",
volHint:"¡Toca sin parar o agita el móvil!",pressure:"Presión",eruptions:"Erupciones",
bagHint:"Dale. Se lo merece.",hits:"Golpes",power:"Fuerza",
coolTitle:"Calma",inhale:"Inspira…",exhale:"Espira…",coolSub:"El robot está limpiando tu desastre. Tú solo respira.",skip:"Saltar",meanPaused:"Modo borde en pausa. Hasta yo respeto la respiración.",
resTitle:"Tu resultado",resDown:"{n} menos. ¡Bien hecho!",resSame:"Mismo nivel. ¿Otra ronda o una pausa más larga?",resUp:"{n} más. ¡Pasa! Prueba otra herramienta o una pausa más larga.",resOnly:"Ahora estás en {n}/10.",again2:"Otra ronda",
settings:"Ajustes",language:"Idioma",colours:"Colores",sound:"Sonido",vibration:"Vibración",history:"Historial",noHistory:"Aún no hay sesiones.",avgDrop:"Bajada media",sessions:"Sesiones",clearHist:"Borrar historial",
about:"Acerca de",terms:"Términos y privacidad",support:"Invítame a un café",share:"Compartir",shareText:"Honicorn – suelta vapor, seguro y absurdo.",linkCopied:"¡Enlace copiado!",
meanOn:"Modo mega borde ACTIVADO 😈",meanOff:"Modo amable 😇",meanWarn:"En el modo mega borde, Honicorn se mete contigo. Todo es broma: puedes desactivarlo cuando quieras.",ok:"Adelante",cancel:"Cancelar",motion:"📳 Activar agitar",
install:"📲 Instalar la app",iosHint:"En iPhone: toca Compartir ⬆️ y luego «Añadir a pantalla de inicio».",menuHint:"Abre el menú del navegador ⋮ y elige «Instalar app» o «Añadir a pantalla de inicio».",inAppHint:"Abre esta página en Chrome o Safari para instalarla.",
supportText:"Todo en Honicorn es y seguirá siendo gratis. Un café es simplemente un apoyo voluntario al proceso creativo. ☕",
r:{gen:["¿Eso es todo? Mi calculadora se enfada más.","Aterrador. Un hámster se acaba de reír de ti.","¿A eso llamas rabia? Un flan da más miedo.","Sigue así. La pantalla ni se inmuta.","Qué mono. Ahora hazlo en serio.","En algún lugar hay un gatito más intimidante que tú.","Mi último reinicio tuvo más pasión.","Aplauso lento. Muy lento."],
smash:["El plato sobrevivió. Al menos emocionalmente.","Mi abuela rompe más platos sin querer."],
scream:["¿Eso fue un grito o un estornudo educado?","Los vecinos ni se enteraron. Otra vez."],
crush:["¿Ese es tu gran problema? Qué tierno.","Hasta la cabra dice que es un problemita."],
volcano:["Eso no es un volcán, es un charco tibio.","Agita más fuerte. Es un móvil, no un suflé."],
bag:["El saco está bostezando.","¿Lo golpeas o lo acaricias?"],
insult:["Leer insultos de una pantalla. Qué valentía.","Más alto. Nadie lo oyó."],
idle:"¿Hola? ¿Ya te rindes?",down:"Vaya, calma total. Ya era hora.",same:"Nada ha cambiado. Impresionante, a su manera. ¿Otra?",up:"¿Más rabia que antes? Sinceramente, es un talento. ¿Segunda ronda?"},
info:`<h3>Por qué funciona</h3>
<p><b>Ponerle nombre.</b> Escribir o decir lo que te enfada es más que un juego. Los psicólogos lo llaman <i>etiquetado afectivo</i>: poner una emoción en palabras reduce su intensidad.</p>
<p><b>Moverlo.</b> La rabia es energía en el cuerpo. Una ráfaga corta de toques, sacudidas y gritos la deja salir, sin romper nada real ni hacer daño a nadie.</p>
<p><b>Reírse.</b> Cuesta seguir echando humo mientras una cabra se come tu problema. El humor rompe la espiral de la rabia.</p>
<p><b>Aterrizar suave.</b> Desahogarse sin más puede mantener la rabia, por eso cada sesión termina con respiración lenta y una revisión del Rabiómetro. Primero la explosión, luego la exhalación.</p>
<h3>Para quién</h3>
<p>Para cualquiera que tenga uno de esos días: tras una reunión horrible, en un atasco, después de pelearse con la impresora o de una llamada que prefieres olvidar. No hace falta ningún diagnóstico.</p>
<h3>Bueno saber</h3>
<p>Honicorn es una herramienta divertida, no una terapia. Si la rabia toma el control a menudo, o sientes que podrías hacerte daño o hacérselo a alguien, habla con un médico, un psicólogo o alguien de confianza.</p>
<p>El modo mega borde 😈 solo se burla de tus habilidades para enfadarte, nunca de quién eres.</p>`,
termsHtml:`<h3>Condiciones de uso</h3>
<p>Honicorn es gratis. Se ofrece «tal cual», para divertirse y relajarse, y no es una herramienta médica ni psicológica.</p>
<p>Usa las funciones de romper y agitar con seguridad: sujeta bien el móvil y fíjate en lo que tienes alrededor.</p>
<h3>Privacidad</h3>
<p>Sin cuenta, sin anuncios, sin rastreo. Los ajustes y el historial del Rabiómetro se guardan solo en tu dispositivo y puedes borrarlos en Ajustes.</p>
<p>El micrófono solo se usa en directo para medir el volumen en el Gritómetro: no se graba ni se envía nada. Las notas de voz de la Trituradora de problemas se quedan en la memoria del móvil y se borran cuando las destruyes.</p>
<p>El dictado («Decirlo») usa el servicio de voz integrado del navegador, que puede enviar el audio a su proveedor (por ejemplo, Google en Chrome). Si lo prefieres, simplemente escribe.</p>
<h3>Derechos de autor</h3>
<p>© 2026 Piotr Żondełek. Todos los derechos reservados. No se permite copiar, modificar ni redistribuir la aplicación ni sus partes sin permiso por escrito.</p>
<p>Contacto: ${MAIL}</p>`},

fr:{
tagline:"Lâche la vapeur. Sans danger. Sans logique.",start:"Je bous ! C'est parti",tools:"Choisis ton arme",
t_smash:"Salle de rage",d_smash:"Casse des assiettes, des vases et l'imprimante du bureau.",
t_scream:"Cri-o-mètre",d_scream:"Crie dans le micro et fais tomber la tour.",
t_crush:"Broyeur à problèmes",d_crush:"Écris ou dis ce qui t'énerve. Puis détruis-le.",
t_insult:"Générateur d'insultes",d_insult:"Des insultes absurdes à crier à l'univers.",
t_volcano:"Volcan",d_volcano:"Secoue jusqu'à l'éruption.",
t_bag:"Sac de frappe",d_bag:"Il a un visage. Très content de lui.",
meterTitle:"Rageomètre",meterBefore:"À quel point es-tu en colère, là ?",meterAfter:"Et maintenant ?",
lv:["Zen","Agacement","Colère","Fureur","Mode volcan"],next:"Suivant",
done:"Fini – calme-moi",back:"Outils",home:"Accueil",atStart:"Au départ",
smashHint:"Tape pour casser. Secouer marche aussi.",destroyed:"Cassés",
screamStart:"Activer le micro",screamHold:"Maintiens pour rugir",screamHint:"Crie ! Fais tomber la tour.",micDenied:"Pas d'accès au micro – maintiens le bouton pour rugir.",towers:"Tours",
sl:["Murmure","Grognement","Cri","Le voisin appelle","Alerte sismique"],peak:"Record",
crushPh:"Qu'est-ce qui te met hors de toi ? Écris-le ou dis-le…",speak:"🎙️ Le dire",stopRec:"⏹ Stop",recording:"J'écoute…",voiceNote:"Note vocale",crumple:"Froisse-le !",needText:"Écris ou dis quelque chose d'abord.",whereTo:"On l'envoie où ?",
dTrash:"À la poubelle",dShred:"Broyeuse",dRocket:"Dans l'espace",dGoat:"Nourrir la chèvre",gone:"Disparu. Ça n'existe plus.",again:"Autre problème",notSaved:"Rien n'est enregistré. Ça disparaît pour de bon.",
insAnother:"Encore",insShout:"🔊 Le crier",insCopy:"Copier",copied:"Copié !",insHint:"Dis-le à voix haute. Sérieux, ça aide.",
volHint:"Tape à toute vitesse ou secoue ton téléphone !",pressure:"Pression",eruptions:"Éruptions",
bagHint:"Frappe-le. Il l'a mérité.",hits:"Coups",power:"Puissance",
coolTitle:"Retour au calme",inhale:"Inspire…",exhale:"Expire…",coolSub:"Le robot range ton bazar. Toi, tu respires.",skip:"Passer",meanPaused:"Mode méchant en pause. Même moi, je respecte la respiration.",
resTitle:"Ton résultat",resDown:"{n} de moins. Bien joué !",resSame:"Même niveau. Encore un tour ou une pause plus longue ?",resUp:"{n} de plus. Ça arrive ! Essaie un autre outil ou une pause plus longue.",resOnly:"Tu es à {n}/10 maintenant.",again2:"Encore un tour",
settings:"Réglages",language:"Langue",colours:"Couleurs",sound:"Son",vibration:"Vibration",history:"Historique",noHistory:"Pas encore de séances.",avgDrop:"Baisse moyenne",sessions:"Séances",clearHist:"Effacer l'historique",
about:"À propos",terms:"Conditions et confidentialité",support:"Offre-moi un café",share:"Partager",shareText:"Honicorn – lâche la vapeur, sans danger et sans logique.",linkCopied:"Lien copié !",
meanOn:"Mode méga méchant ACTIVÉ 😈",meanOff:"Mode gentil 😇",meanWarn:"En mode méga méchant, Honicorn te charrie. C'est pour rire – tu peux le couper à tout moment.",ok:"Vas-y",cancel:"Annuler",motion:"📳 Activer la secousse",
install:"📲 Installer l'appli",iosHint:"Sur iPhone : touche Partager ⬆️, puis « Sur l'écran d'accueil ».",menuHint:"Ouvre le menu du navigateur ⋮ et choisis « Installer l'application » ou « Ajouter à l'écran d'accueil ».",inAppHint:"Ouvre cette page dans Chrome ou Safari pour l'installer.",
supportText:"Tout dans Honicorn est et restera gratuit. Un café, c'est simplement un soutien volontaire au processus créatif. ☕",
r:{gen:["C'est tout ? Ma calculatrice s'énerve plus que ça.","Terrifiant. Un hamster vient de se moquer de toi.","C'est ça, ta rage ? Un flan fait plus peur.","Continue. L'écran n'a même pas peur.","Mignon. Maintenant, pour de vrai.","Quelque part, un chaton est plus intimidant que toi.","Mon dernier redémarrage avait plus de passion.","Applaudissements lents. Très lents."],
smash:["L'assiette a survécu. Émotionnellement, du moins.","Ma grand-mère casse plus de vaisselle sans faire exprès."],
scream:["C'était un cri ou un éternuement poli ?","Les voisins n'ont rien remarqué. Encore."],
crush:["C'est ça, ton gros problème ? Trop mignon.","Même la chèvre dit que c'est un petit problème."],
volcano:["Ce n'est pas un volcan, c'est une flaque tiède.","Secoue plus fort. C'est un téléphone, pas un soufflé."],
bag:["Le sac bâille.","Tu le frappes ou tu le caresses ?"],
insult:["Lire des insultes sur un écran. Quel courage.","Plus fort. Personne n'a entendu."],
idle:"Allô ? Tu abandonnes déjà ?",down:"Tiens, le calme. Il était temps.",same:"Rien n'a changé. Impressionnant, à sa manière. On recommence ?",up:"Encore plus en colère ? Franchement, c'est un talent. Deuxième round ?"},
info:`<h3>Pourquoi ça marche</h3>
<p><b>Le nommer.</b> Écrire ou dire ce qui t'énerve, c'est plus qu'un jeu. Les psychologues appellent ça l'<i>étiquetage affectif</i> : mettre des mots sur une émotion en réduit l'intensité.</p>
<p><b>Le bouger.</b> La colère, c'est de l'énergie dans le corps. Une courte rafale de tapes, de secousses et de cris la laisse sortir – sans rien casser de réel ni blesser personne.</p>
<p><b>En rire.</b> Difficile de rester en rogne pendant qu'une chèvre mange ton problème. L'humour casse la spirale de la colère.</p>
<p><b>Atterrir en douceur.</b> Se défouler seul peut entretenir la colère, c'est pourquoi chaque séance se termine par une respiration lente et un coup d'œil au Rageomètre. D'abord l'explosion, puis l'expiration.</p>
<h3>Pour qui</h3>
<p>Pour tous ceux qui vivent une de ces journées : après une réunion affreuse, dans un bouchon, après un combat avec l'imprimante ou un appel que tu préfères oublier. Aucun diagnostic nécessaire.</p>
<h3>Bon à savoir</h3>
<p>Honicorn est un outil ludique, pas une thérapie. Si la colère prend souvent le dessus, ou si tu sens que tu pourrais te faire du mal ou en faire à quelqu'un, parle à un médecin, un psychologue ou une personne de confiance.</p>
<p>Le mode méga méchant 😈 se moque seulement de tes talents de colère – jamais de qui tu es.</p>`,
termsHtml:`<h3>Conditions d'utilisation</h3>
<p>Honicorn est gratuit. L'application est fournie « telle quelle », pour s'amuser et se détendre, et n'est pas un outil médical ou psychologique.</p>
<p>Utilise la casse et la secousse en sécurité : tiens bien ton téléphone et fais attention à ce qui t'entoure.</p>
<h3>Confidentialité</h3>
<p>Pas de compte, pas de pub, pas de pistage. Tes réglages et ton historique du Rageomètre sont enregistrés uniquement sur ton appareil, et tu peux les supprimer dans les Réglages.</p>
<p>Le micro sert uniquement en direct, à mesurer le volume dans le Cri-o-mètre – rien n'est enregistré ni envoyé. Les notes vocales du Broyeur à problèmes restent dans la mémoire du téléphone et sont effacées quand tu les détruis.</p>
<p>La dictée (« Le dire ») utilise le service vocal intégré du navigateur, qui peut envoyer l'audio à son fournisseur (par exemple Google dans Chrome). Si tu préfères, écris simplement.</p>
<h3>Droits d'auteur</h3>
<p>© 2026 Piotr Żondełek. Tous droits réservés. Copier, modifier ou redistribuer l'application ou ses parties sans autorisation écrite est interdit.</p>
<p>Contact : ${MAIL}</p>`},

zh:{
tagline:"释放怒气。安全，又荒唐。",start:"我快炸了！开始",tools:"选择你的武器",
t_smash:"发泄室",d_smash:"砸盘子、花瓶和办公室的打印机。",
t_scream:"尖叫计",d_scream:"对着麦克风大喊，把塔震倒。",
t_crush:"烦恼粉碎机",d_crush:"写下或说出让你烦的事，然后摧毁它。",
t_insult:"骂人生成器",d_insult:"对着宇宙大喊的荒唐骂词。",
t_volcano:"火山",d_volcano:"使劲摇，直到它喷发。",
t_bag:"沙袋",d_bag:"它有张脸，一脸得意。",
meterTitle:"火气计",meterBefore:"你现在有多生气？",meterAfter:"现在呢？",
lv:["淡定","烦躁","生气","暴怒","火山模式"],next:"下一步",
done:"完成——帮我冷静",back:"工具",home:"首页",atStart:"开始时",
smashHint:"点击砸碎，摇手机也行。",destroyed:"已砸碎",
screamStart:"打开麦克风",screamHold:"按住怒吼",screamHint:"大喊吧！把塔震倒。",micDenied:"无法使用麦克风——按住按钮来怒吼。",towers:"塔",
sl:["耳语","嘟囔","大喊","邻居打电话来了","地震警报"],peak:"纪录",
crushPh:"什么让你抓狂？写下来或说出来……",speak:"🎙️ 说出来",stopRec:"⏹ 停止",recording:"正在听……",voiceNote:"语音备忘",crumple:"揉成团！",needText:"先写点或说点什么。",whereTo:"把它送去哪儿？",
dTrash:"垃圾桶",dShred:"碎纸机",dRocket:"送上太空",dGoat:"喂山羊",gone:"没了。它已经不存在了。",again:"下一个烦恼",notSaved:"什么都不会保存，永远消失。",
insAnother:"再来一个",insShout:"🔊 喊出来",insCopy:"复制",copied:"已复制！",insHint:"大声说出来。真的有用。",
volHint:"疯狂点击或摇晃手机！",pressure:"压力",eruptions:"喷发",
bagHint:"揍它。它活该。",hits:"击打",power:"力量",
coolTitle:"冷静一下",inhale:"吸气……",exhale:"呼气……",coolSub:"机器人正在收拾你的烂摊子。你只管呼吸。",skip:"跳过",meanPaused:"毒舌模式暂停。连我都尊重呼吸。",
resTitle:"你的结果",resDown:"降了 {n}。干得好！",resSame:"没变化。再来一轮，还是多呼吸一会儿？",resUp:"升了 {n}。很正常！试试别的工具或多呼吸一会儿。",resOnly:"你现在是 {n}/10。",again2:"再来一轮",
settings:"设置",language:"语言",colours:"颜色",sound:"声音",vibration:"振动",history:"记录",noHistory:"还没有记录。",avgDrop:"平均下降",sessions:"次数",clearHist:"清除记录",
about:"关于",terms:"条款与隐私",support:"请我喝咖啡",share:"分享",shareText:"Honicorn——安全又荒唐地释放怒气。",linkCopied:"链接已复制！",
meanOn:"超级毒舌模式已开启 😈",meanOff:"友好模式 😇",meanWarn:"在超级毒舌模式下，Honicorn 会损你几句。全是玩笑——随时可以关闭。",ok:"来吧",cancel:"取消",motion:"📳 启用摇晃",
install:"📲 安装应用",iosHint:"iPhone：点按分享 ⬆️，然后选择“添加到主屏幕”。",menuHint:"打开浏览器菜单 ⋮，选择“安装应用”或“添加到主屏幕”。",inAppHint:"请在 Chrome 或 Safari 中打开此页面进行安装。",
supportText:"Honicorn 的一切现在和将来都是免费的。一杯咖啡只是对创作过程的自愿支持。☕",
r:{gen:["就这？我的计算器都比你会生气。","好可怕哦。一只仓鼠刚刚笑话了你。","这叫愤怒？布丁都比你凶。","继续啊。屏幕一点都不怕。","真可爱。现在认真点。","世界上某处，一只小猫都比你有气势。","我上次重启都比这有激情。","慢慢鼓掌。非常慢。"],
smash:["盘子活下来了，至少心理上是。","我奶奶不小心打碎的碗都比你多。"],
scream:["这是尖叫还是礼貌的喷嚏？","邻居根本没注意到。又一次。"],
crush:["这就是你的大问题？好可爱。","连山羊都说这是个小问题。"],
volcano:["这不是火山，是一摊温水。","使劲摇。这是手机，不是舒芙蕾。"],
bag:["沙袋在打哈欠。","你是在打它还是在摸它？"],
insult:["照着屏幕念骂词。好勇敢。","大声点。没人听见。"],
idle:"喂？这就放弃了？",down:"哟，冷静了。可真够久的。",same:"毫无变化。某种程度上挺厉害。再来？",up:"更生气了？说真的，这是天赋。第二轮？"},
info:`<h3>为什么有效</h3>
<p><b>说出来。</b>写下或说出让你生气的事，不只是好玩。心理学家称之为<i>情绪标注</i>：把情绪化为语言，会降低它的强度。</p>
<p><b>动起来。</b>愤怒是身体里的能量。一阵点击、摇晃和喊叫能把它释放出来——不会弄坏真东西，也不会伤害任何人。</p>
<p><b>笑一笑。</b>看着山羊吃掉你的烦恼，很难继续火冒三丈。幽默能打断愤怒的循环。</p>
<p><b>温柔着陆。</b>光是发泄可能让怒气持续，所以每次都以缓慢呼吸和查看火气计结束。先爆发，再呼气。</p>
<h3>适合谁</h3>
<p>适合每个碰上糟糕日子的人：开完糟糕的会、堵在路上、和打印机大战一场，或接了一通想忘掉的电话之后。不需要任何诊断。</p>
<h3>须知</h3>
<p>Honicorn 是个好玩的工具，不是治疗。如果愤怒经常失控，或你觉得可能伤害自己或他人，请和医生、心理咨询师或你信任的人谈谈。</p>
<p>超级毒舌模式 😈 只拿你的“生气技术”开玩笑——绝不针对你这个人。</p>`,
termsHtml:`<h3>使用条款</h3>
<p>Honicorn 免费。本应用按“现状”提供，用于娱乐和放松，不是医疗或心理工具。</p>
<p>请安全地使用砸和摇的功能：握紧手机，注意周围环境。</p>
<h3>隐私</h3>
<p>无需账户，无广告，无追踪。你的设置和火气计记录只保存在你的设备上，可在设置中删除。</p>
<p>麦克风只在尖叫计中实时测量音量——不会录音或上传任何内容。烦恼粉碎机中的语音备忘只留在手机内存中，销毁时即被删除。</p>
<p>语音转文字（“说出来”）使用浏览器内置的语音服务，可能会把音频发送给其提供商（例如 Chrome 中的 Google）。如果你介意，直接打字即可。</p>
<h3>版权</h3>
<p>© 2026 Piotr Żondełek。保留所有权利。未经书面许可，禁止复制、修改或传播本应用或其任何部分。</p>
<p>联系：${MAIL}</p>`},

uk:{
tagline:"Випусти пару. Безпечно. Абсурдно.",start:"Я киплю! Поїхали",tools:"Обери зброю",
t_smash:"Кімната люті",d_smash:"Бий тарілки, вази й офісний принтер.",
t_scream:"Крикомір",d_scream:"Кричи в мікрофон і звали вежу.",
t_crush:"Подрібнювач проблем",d_crush:"Напиши або скажи, що тебе бісить. Потім знищ це.",
t_insult:"Генератор образ",d_insult:"Абсурдні образи, щоб прокричати їх у всесвіт.",
t_volcano:"Вулкан",d_volcano:"Струшуй, поки не вибухне.",
t_bag:"Боксерська груша",d_bag:"У неї є обличчя. Дуже самовдоволене.",
meterTitle:"Злостомір",meterBefore:"Наскільки ти злишся зараз?",meterAfter:"А тепер?",
lv:["Спокій","Роздратування","Злість","Лють","Режим вулкана"],next:"Далі",
done:"Готово – заспокой мене",back:"Інструменти",home:"Головна",atStart:"На старті",
smashHint:"Торкнись, щоб розбити. Струшування теж працює.",destroyed:"Розбито",
screamStart:"Увімкнути мікрофон",screamHold:"Тримай, щоб ревіти",screamHint:"Кричи! Звали вежу.",micDenied:"Немає доступу до мікрофона – тримай кнопку, щоб ревіти.",towers:"Вежі",
sl:["Шепіт","Бурчання","Крик","Сусід уже дзвонить","Сейсмічна тривога"],peak:"Рекорд",
crushPh:"Що доводить тебе до сказу? Напиши або скажи…",speak:"🎙️ Сказати",stopRec:"⏹ Стоп",recording:"Слухаю…",voiceNote:"Голосова нотатка",crumple:"Зімни це!",needText:"Спершу напиши або скажи щось.",whereTo:"Куди це відправити?",
dTrash:"У смітник",dShred:"У шредер",dRocket:"У космос",dGoat:"Нагодувати козу",gone:"Усе. Цього більше не існує.",again:"Ще одна проблема",notSaved:"Нічого не зберігається. Зникає назавжди.",
insAnother:"Ще одну",insShout:"🔊 Прокричати",insCopy:"Копіювати",copied:"Скопійовано!",insHint:"Скажи це вголос. Серйозно, допомагає.",
volHint:"Тисни щосили або струшуй телефон!",pressure:"Тиск",eruptions:"Виверження",
bagHint:"Вдар її. Вона заслужила.",hits:"Удари",power:"Сила",
coolTitle:"Заспокоєння",inhale:"Вдих…",exhale:"Видих…",coolSub:"Робот прибирає твій безлад. Ти просто дихай.",skip:"Пропустити",meanPaused:"Злий режим на паузі. Навіть я поважаю дихання.",
resTitle:"Твій результат",resDown:"Менше на {n}. Чудово!",resSame:"Без змін. Ще раунд чи довша пауза?",resUp:"Більше на {n}. Буває! Спробуй інший інструмент або довшу паузу.",resOnly:"Зараз у тебе {n}/10.",again2:"Ще раунд",
settings:"Налаштування",language:"Мова",colours:"Кольори",sound:"Звук",vibration:"Вібрація",history:"Історія",noHistory:"Ще немає сесій.",avgDrop:"Середнє зниження",sessions:"Сесії",clearHist:"Очистити історію",
about:"Про застосунок",terms:"Умови та приватність",support:"Пригости кавою",share:"Поділитися",shareText:"Honicorn – випусти пару, безпечно й абсурдно.",linkCopied:"Посилання скопійовано!",
meanOn:"Мега-злий режим УВІМКНЕНО 😈",meanOff:"Добрий режим 😇",meanWarn:"У мега-злому режимі Honicorn з тебе кепкує. Це лише жарт – вимкнути можна будь-коли.",ok:"Давай",cancel:"Скасувати",motion:"📳 Увімкнути струшування",
install:"📲 Встановити застосунок",iosHint:"На iPhone: торкнись «Поділитися» ⬆️, потім «На початковий екран».",menuHint:"Відкрий меню браузера ⋮ і вибери «Встановити застосунок» або «Додати на головний екран».",inAppHint:"Відкрий цю сторінку в Chrome або Safari, щоб установити її.",
supportText:"Усе в Honicorn є і завжди буде безкоштовним. Кава – це просто добровільна підтримка творчого процесу. ☕",
r:{gen:["Це все? Мій калькулятор злиться сильніше.","Страшно. Хом'як щойно з тебе посміявся.","Це лють? Пудинг і той грізніший.","Давай-давай. Екран навіть не боїться.","Мило. А тепер по-справжньому.","Десь у світі кошеня грізніше за тебе.","Мій останній перезапуск мав більше пристрасті.","Повільні оплески. Дуже повільні."],
smash:["Тарілка вижила. Принаймні емоційно.","Бабуся випадково б'є більше посуду."],
scream:["Це був крик чи ввічливе чхання?","Сусіди навіть не помітили. Знову."],
crush:["Оце твоя велика проблема? Мило.","Навіть коза каже, що це проблемка."],
volcano:["Це не вулкан, а тепла калюжа.","Струшуй сильніше. Це телефон, а не суфле."],
bag:["Груша позіхає.","Ти її б'єш чи гладиш?"],
insult:["Читати образи з екрана. Яка сміливість.","Голосніше. Ніхто не почув."],
idle:"Агов? Вже здаєшся?",down:"Ну нарешті, спокій. Довгенько.",same:"Нічого не змінилося. По-своєму вражає. Ще раз?",up:"Злості стало більше? Чесно, це талант. Другий раунд?"},
info:`<h3>Чому це працює</h3>
<p><b>Назвати.</b> Написати або сказати, що тебе злить, – це більше, ніж гра. Психологи називають це <i>маркуванням емоцій</i>: коли вкладаєш емоцію в слова, вона слабшає.</p>
<p><b>Рухатися.</b> Злість – це енергія в тілі. Коротка серія натискань, струшувань і крику випускає її назовні – без шкоди справжнім речам і людям.</p>
<p><b>Посміятися.</b> Важко далі кипіти, коли коза їсть твою проблему. Гумор розриває спіраль злості.</p>
<p><b>М'яко приземлитися.</b> Саме лише виплескування може підтримувати злість, тож кожна сесія завершується повільним диханням і перевіркою Злостоміра. Спершу вибух, потім видих.</p>
<h3>Для кого</h3>
<p>Для кожного, у кого видався один із тих днів: після жахливої наради, у заторі, після бою з принтером або дзвінка, який хочеться забути. Діагноз не потрібен.</p>
<h3>Варто знати</h3>
<p>Honicorn – це веселий інструмент, а не терапія. Якщо злість часто бере гору або ти відчуваєш, що можеш зашкодити собі чи комусь іншому, поговори з лікарем, психологом або людиною, якій довіряєш.</p>
<p>Мега-злий режим 😈 кепкує лише з твоїх навичок злитися – ніколи з того, хто ти є.</p>`,
termsHtml:`<h3>Умови користування</h3>
<p>Honicorn безкоштовний. Застосунок надається «як є», для розваги й розслаблення, і не є медичним чи психологічним інструментом.</p>
<p>Користуйся розбиванням і струшуванням безпечно: міцно тримай телефон і зважай на оточення.</p>
<h3>Приватність</h3>
<p>Без акаунта, без реклами, без стеження. Налаштування та історія Злостоміра зберігаються лише на твоєму пристрої, і їх можна видалити в Налаштуваннях.</p>
<p>Мікрофон використовується лише наживо, щоб вимірювати гучність у Крикомірі, – нічого не записується і не надсилається. Голосові нотатки в Подрібнювачі проблем лишаються в пам'яті телефона і видаляються, коли ти їх знищуєш.</p>
<p>Перетворення мовлення на текст («Сказати») використовує вбудований сервіс браузера, який може надсилати аудіо своєму постачальнику (наприклад, Google у Chrome). Якщо хочеш, просто пиши.</p>
<h3>Авторське право</h3>
<p>© 2026 Piotr Żondełek. Усі права захищено. Копіювати, змінювати чи поширювати застосунок або його частини без письмового дозволу заборонено.</p>
<p>Контакт: ${MAIL}</p>`}
};

/* Insult generator parts: adjective, noun, suffix */
const INS={
en:{a:["burnt","rusty","half-baked","soggy","expired","deflated","crumpled","wobbly","overcooked","lukewarm"],n:["colander","cauliflower","slipper","toaster","dumpling","potato","vacuum cleaner","rubber duck","teaspoon","sock puppet"],s:["from the discount bin","with no batteries","from last Tuesday","on a bad hair day","without instructions","in a raincoat","from the bottom drawer","with hiccups"],f:(a,n,s)=>`You ${a} ${n} ${s}!`},
pl:{a:["przypalony","zardzewiały","niedopieczony","rozmokły","przeterminowany","sflaczały","wymięty","chybotliwy","rozgotowany","letni"],n:["durszlaku","kalafiorze","kapciu","tosterze","pierogu","ziemniaku","odkurzaczu","widelcu","kaloryferze","budyniu"],s:["z promocji","bez baterii","z zeszłego wtorku","bez instrukcji","w przeciwdeszczowej pelerynie","z dolnej szuflady","z czkawką","z wyprzedaży"],f:(a,n,s)=>`Ty ${a} ${n} ${s}!`},
de:{a:["verbrannter","rostiger","halbgarer","matschiger","abgelaufener","schlaffer","zerknitterter","wackeliger","verkochter","lauwarmer"],n:["Toaster","Blumenkohl","Pantoffel","Knödel","Staubsauger","Teelöffel","Kochlöffel","Heizkörper","Pudding","Zwieback"],s:["vom Wühltisch","ohne Batterien","von letztem Dienstag","ohne Anleitung","im Regenmantel","aus der untersten Schublade","mit Schluckauf","im Sonderangebot"],f:(a,n,s)=>`Du ${a} ${n} ${s}!`},
es:{a:["quemado","oxidado","medio crudo","empapado","caducado","desinflado","arrugado","tambaleante","recocido","tibio"],n:["colador","tostador","calcetín","buñuelo","plumero","cucharón","radiador","flan","pepino","churro"],s:["de oferta","sin pilas","del martes pasado","sin instrucciones","con chubasquero","del último cajón","con hipo","de saldo"],f:(a,n,s)=>`¡So ${n} ${a} ${s}!`},
fr:{a:["cramé","rouillé","mal cuit","ramolli","périmé","dégonflé","froissé","bancal","trop cuit","tiède"],n:["grille-pain","chou-fleur","chausson","aspirateur","croûton","radiateur","flan","cornichon","pruneau","tire-bouchon"],s:["en promo","sans piles","de mardi dernier","sans mode d'emploi","en imperméable","du fond du tiroir","qui a le hoquet","soldé"],f:(a,n,s)=>`Espèce de ${n} ${a} ${s} !`},
zh:{a:["烤焦的","生锈的","半生不熟的","泡软的","过期的","泄了气的","皱巴巴的","摇摇晃晃的","煮过头的","温吞吞的"],n:["漏勺","花椰菜","拖鞋","烤面包机","饺子","土豆","吸尘器","橡皮鸭","茶匙","袜子木偶"],s:["打折区的","没装电池的","上周二的","没有说明书的","穿雨衣的","抽屉底下的","打着嗝的","清仓甩卖的"],f:(a,n,s)=>`你这个${s}${a}${n}！`},
uk:{a:["підгорілий","іржавий","недопечений","розмоклий","прострочений","здутий","пом'ятий","хиткий","переварений","теплуватий"],n:["друшляку","тостере","капцю","варенику","пилососе","кабачку","вінику","радіаторе","пудингу","сухарику"],s:["з розпродажу","без батарейок","з минулого вівторка","без інструкції","у дощовику","з нижньої шухляди","з гикавкою","за акцією"],f:(a,n,s)=>`Ти ${a} ${n} ${s}!`}
};
