# Vollständiger Prompt für Dual Ball Breakout Spiel mit Powerup-System

## Aufgabe
Erstelle ein statisches HTML-Breakout-Spiel mit zwei Bällen auf einem 32x32 Spielfeld (1024x1024 Pixel Canvas) inklusive einem vollständigen Powerup-System mit Explosionseffekten. Das Spiel soll als eine einzige HTML-Datei implementiert werden, die CSS, JavaScript und alle Features enthält.

## Spielfeld-Spezifikationen
- **Canvas-Größe**: 1024x1024 Pixel
- **Spielfeld**: 32x32 Felder, jedes Feld ist 32x32 Pixel groß
- **Initiale Aufteilung**: Linke Hälfte = helle Felder, rechte Hälfte = dunkle Felder
- **Feldarten**: 0 = helles Feld, 1 = dunkles Feld
- **Feldanzahl**: Startet mit 512 hellen und 512 dunklen Feldern

## Ball-System
### Zwei Bälle mit unterschiedlichen Eigenschaften:
1. **Heller Ball (Light Ball)**:
   - Startposition: 75% der Canvas-Breite (rechte Seite/dunkle Felder)
   - Typ-Identifikation: `ball.type === 'light'`
   - Farbe: Verwendet die aktuelle helle Feldfarbe (`lightFieldColor`)
   - Verhalten: Wandelt dunkle Felder in helle um, prallt von hellen Feldern ab

2. **Dunkler Ball (Dark Ball)**:
   - Startposition: 25% der Canvas-Breite (linke Seite/helle Felder) 
   - Typ-Identifikation: `ball.type === 'dark'`
   - Farbe: Verwendet die aktuelle dunkle Feldfarbe (`darkFieldColor`)
   - Verhalten: Wandelt helle Felder in dunkle um, prallt von dunklen Feldern ab

### Ball-Eigenschaften:
- **Radius**: 6 Pixel
- **Geschwindigkeit**: 2 Pixel pro Frame (Basis)
- **Schweif-Effekt**: 16 gespeicherte Positionen mit Transparenz-Verlauf
- **Kollisionserkennung**: Mit Wänden und Feldern gleicher Farbe
- **Rendering**: Randfarbe kontrastiert zur Füllfarbe für bessere Sichtbarkeit
- **Powerup-Ladungen**: Jeder Ball kann Powerup-Ladungen sammeln und speichern
- **Visuelle Powerup-Anzeige**: Goldener Glow und Ladungsanzeige um geladene Bälle

## Powerup-System

### Powerup-Spawning:
- **Goldene Stern-Powerups**: Spawnen zufällig alle 3-8 Sekunden auf dem Spielfeld
- **Visuelle Effekte**: Pulsende Animation mit goldenem Glow und Funken-Partikeln
- **Spawn-Logik**: Keine Doppel-Spawns auf derselben Feldposition
- **Kontinuierliche Funken**: Dynamische Partikeleffekte um jedes Powerup

### Powerup-Sammlung:
- **Kollisionserkennung**: Bälle sammeln Powerups bei Berührung
- **Powerup-Ladungen**: Jede Sammlung erhöht die Ladungsanzahl des Balls
- **Audio-Feedback**: Aufsteigender Ton (600Hz → 1200Hz) bei Sammlung
- **Sammel-Partikel**: 15 goldene Partikel explodieren bei Einsammlung
- **Visuelle Ball-Änderung**: Geladene Bälle zeigen goldenen Glow

### Explosions-Mechanik:
- **Trigger**: Geladene Bälle lösen Explosionen bei Feldkollisionen aus
- **Explosionsradius**: 3 Felder Radius um den Aufprallpunkt
- **Flächenumwandlung**: Alle passenden Felder im Radius werden umgewandelt
- **Welleneffekt**: Verzögerte Feldanimationen für visuellen Welleneffekt
- **Ladungsverbrauch**: Eine Ladung wird pro Explosion verbraucht

### Explosions-Effekte:
- **Audio**: Dramatischer Sound mit Bass-Rumpel (80Hz → 20Hz) und Knall (300Hz → 50Hz)
- **Partikel**: 50+ Explosionspartikel + 30+ Funkenpartikel
- **Verzögerung**: Distanzbasierte Animation für realistischen Welleneffekt
- **Farbübergänge**: Partikel wechseln von alter zu neuer Feldfarbe

### Visuelle Powerup-Anzeigen:
- **Ball-Glow**: Goldener Leuchteffekt um geladene Bälle
- **Ladungsanzeige**: 1-5 Ladungen als goldene Punkte um den Ball
- **Zahlenanzeige**: Bei >5 Ladungen wird die Zahl im Ball angezeigt
- **Dynamische Updates**: Sofortige visuelle Rückmeldung bei Änderungen

## Visuelle Effekte

### Partikel-System:
- **12 Partikel** pro normaler Feldumwandlung
- **65+ Partikel** pro Powerup-Explosion (50 Explosion + 15+ Funken)
- **15 goldene Partikel** pro Powerup-Sammlung
- **Kontinuierliche Funken** um jedes Powerup
- **Lebensdauer**: 60-100 Frames (zufällig) für normale, 80-160 für Explosionen
- **Bewegung**: Radiale Explosion vom Feldmittelpunkt
- **Größenanimation**: Erst größer werdend (30%), dann kleiner werdend (70%)
- **Farbübergänge**: 
  - RGB-Interpolation von alter zu neuer Feldfarbe (normale Partikel)
  - Gold zu Orange (Powerup-Partikel)
  - Weiß zu Gelb/Lila (Funken-Partikel)
- **Glow-Effekt**: Zusätzlicher vergrößerter Partikel mit 30% Transparenz
- **Geschwindigkeitsabnahme**: Realistische Bewegungsdämpfung

### Feld-Animations-System:
- **Drehanimation**: 40 Frames lange vertikale 3D-Flip-Animation
- **Drehachse**: Horizontale Achse (X-Achse) für vertikalen Flip
- **Timing**: Erste Hälfte zeigt alte Farbe, zweite Hälfte neue Farbe
- **3D-Effekt**: Y-Skalierung mit `Math.cos(progress * Math.PI)`
- **Sichtbarkeits-Schwelle**: `Math.abs(scaleY) > 0.02`
- **Schatten-Effekt**: Zusätzliche dunkle Überlagerung bei starker Drehung

## Audio-System
- **Web Audio API** für Soundgenerierung
- **Heller Ball**: Frequenz-Sweep von 800Hz zu 400Hz (0.1s)
- **Dunkler Ball**: Frequenz-Sweep von 400Hz zu 800Hz (0.1s)
- **Powerup-Sammlung**: Aufsteigender Ton von 600Hz zu 1200Hz (0.2s)
- **Explosions-Sound**: 
  - Bass-Rumpel: 80Hz → 20Hz (Sägezahn, 0.5s)
  - Knall-Ton: 300Hz → 50Hz (Rechteck, 0.3s)
  - Kombinierte Wiedergabe für dramatischen Effekt
- **Lautstärke**: 0.3-0.8 initial, exponentieller Abfall
- **Initialisierung**: Erste Benutzerinteraktion aktiviert Audio-Context

## Spielsteuerung

### Buttons:
- **Start**: "Spiel starten" - Grüner Button (#4CAF50)
- **Pause**: "Pause" - Oranger Button (#ff9800)
- **Reset**: "Reset" - Roter Button (#f44336)

### Geschwindigkeits-Kontrolle:
- **Slider**: 0.25x bis 10x Geschwindigkeit (Schritte: 0.25)
- **Standard**: 2.0x Geschwindigkeit
- **Anzeige**: Dynamisch aktualisierte Geschwindigkeitsanzeige
- **Implementation**: `performance.now()` basierte Frame-Timing

### Echtzeit-Anzeigen:
- **Feldanzähler**: Live-Update für helle und dunkle Felder
- **Styling**: Unterschiedliche Farben für helle (#333) und dunkle (#666) Felder

## Farbsystem

### Manuelle Farbkontrolle:
- **Color Picker**: Separate Picker für helle und dunkle Feldfarben
- **Standard-Farben**: Weiß (#ffffff) für hell, Schwarz (#000000) für dunkel
- **Live-Update**: Sofortige Anwendung bei Farbänderung
- **Ball-Synchronisation**: Ballfarben folgen automatisch den Feldfarben

### Automatisches Farbsystem:
- **Toggle-Button**: "Automatische Farben" mit aktiv/inaktiv Status
- **Button-Styling**: Lila (#9C27B0) normal, Pink (#E91E63) aktiv
- **HSL-Animation**: Kontinuierliche Hue-Rotation mit 0.5° pro Frame
- **Komplementär-Farben**: 180° Hue-Versatz zwischen hell und dunkel
- **Sättigung**: Hell = 80% S, 75% L; Dunkel = 90% S, 25% L
- **Color-Picker-Sync**: Automatische Aktualisierung der Picker-Werte

## Performance-Optimierungen
- **Partikel-Cleanup**: Automatische Entfernung abgelaufener Partikel
- **Animation-Management**: Effiziente Verwaltung animierter Felder
- **Trail-Begrenzung**: Maximal 16 Schweif-Positionen pro Ball
- **Selective Rendering**: Nur statische Felder im Hauptrender-Pass

## Code-Architektur

### Globale Variablen:
```javascript
// Spielzustand
let gameRunning = false;
let gameSpeed = 2.0;
let lastFrameTime = 0;

// Farben
let lightFieldColor = '#ffffff';
let darkFieldColor = '#000000';
let autoColorMode = false;
let colorAnimationTime = 0;
let colorAnimationMode = 0; // 0-4: Verschiedene Animationsmodi
let colorAnimationSpeed = 1.0;

// Spielfeld und Effekte
let gameField = []; // 32x32 Array
let particles = [];
let animatedFields = [];

// Powerup-System
let powerups = [];
let powerupSpawnTimer = 0;
let powerupSpawnInterval = 300; // Variable Spawn-Intervalle

// Audio
let audioContext = null;
```

### Ball-Objekte:
```javascript
let lightBall = {
    x: CANVAS_WIDTH * 0.75,
    y: CANVAS_HEIGHT / 2,
    dx: -BALL_SPEED,
    dy: BALL_SPEED,
    type: 'light',
    trail: [],
    powerupCharges: 0 // Powerup-Ladungen
};

let darkBall = {
    x: CANVAS_WIDTH * 0.25,
    y: CANVAS_HEIGHT / 2,
    dx: BALL_SPEED,
    dy: -BALL_SPEED,
    type: 'dark',
    trail: [],
    powerupCharges: 0 // Powerup-Ladungen
};
```

### Kern-Funktionen:
- `initGameField()`: Spielfeld initialisieren
- `drawGameField()`: Statische Felder rendern
- `drawBall(ball)`: Ball mit Schweif und Powerup-Anzeigen zeichnen
- `checkFieldCollision(ball)`: Feldkollision, -umwandlung und Powerup-Explosion
- `checkWallCollision(ball)`: Wandkollisionen
- `createConversionParticles()`: Normale Partikeleffekte erstellen
- `createFieldAnimation()`: Feldanimationen starten
- `updateAndDrawParticles()`: Partikel-System mit mehreren Typen
- `updateAndDrawAnimatedFields()`: Animierte Felder
- `playConversionSound()`: Audio-Effekte für normale Umwandlungen
- `updateAutoColors()`: Automatische Farbanimation mit 5 Modi
- `hslToHex()`: HSL zu Hex Konvertierung
- **Powerup-Funktionen**:
  - `spawnPowerup()`: Powerup-Spawning mit Funken-Effekt
  - `updateAndDrawPowerups()`: Powerup-Rendering und -Animation
  - `checkPowerupCollision(ball)`: Powerup-Kollisionserkennung
  - `triggerPowerupExplosion(ball, x, y)`: Explosions-Mechanik
  - `createExplosionParticles(x, y, isLightBall)`: Explosions-Partikel
  - `createPowerupCollectParticles(x, y)`: Sammel-Partikel
  - `playPowerupCollectSound()`: Powerup-Sammel-Audio
  - `playExplosionSound()`: Explosions-Audio
  - `drawStar(ctx, x, y, radius, points)`: Stern-Symbol zeichnen

## Styling-Anforderungen
- **Moderne UI**: Sauberes, responsives Design
- **Farbschema**: Grau-Töne mit farbigen Akzenten
- **Hover-Effekte**: Auf allen interaktiven Elementen
- **Flexbox-Layout**: Zentrierte Anordnung aller Elemente
- **Responsive**: Funktioniert auf verschiedenen Bildschirmgrößen

## Technische Anforderungen
- **Eine HTML-Datei**: Alles in einer Datei (HTML, CSS, JavaScript)
- **Moderne Browser**: ES6+ Features verwenden
- **Canvas 2D**: Keine WebGL oder externe Bibliotheken
- **60 FPS**: Optimiert für flüssige Animation
- **Event-Driven**: Reaktiv auf Benutzerinteraktionen

## Besondere Features
1. **Typ-basierte Ball-Identifikation**: Keine farbbasierten Vergleiche
2. **HSL-Farbanimationen**: Mathematisch saubere Farbübergänge mit 5 Modi
3. **3D-Flip-Animationen**: Realistische Feldumwandlungs-Effekte
4. **Mehrstufige Partikeleffekte**: Größen- und Transparenz-Animationen
5. **Web Audio Synthesis**: Prozedural generierte Sounds für alle Aktionen
6. **Performance-optimiert**: Effiziente Render-Zyklen
7. **Vollständiges Powerup-System**: 
   - Dynamisches Spawning mit visuellen Effekten
   - Explosions-Mechanik mit Flächenwirkung
   - Strategische Gameplay-Elemente
   - Umfangreiche Audio-visuelle Rückmeldung
8. **Erweiterte Partikel-Engine**: Unterstützt normale, goldene, Funken- und Explosions-Partikel
9. **Visuelle Powerup-Indikatoren**: Klare Anzeige des Ball-Status
10. **Welleneffekt-Animationen**: Zeitversetzte Feldumwandlungen bei Explosionen

## Ziel
Das finale Spiel soll visuell ansprechend, flüssig animiert und vollständig funktional sein mit einem ausgereiften Powerup-System, das strategische Tiefe und spektakuläre Effekte bietet. Alle Features sollen nahtlos zusammenarbeiten und eine moderne, polierte Spielerfahrung mit fesselnden Audio-visuellen Rückmeldungen bieten. Das Powerup-System fügt eine neue Gameplay-Dimension hinzu, die sowohl casual als auch strategisches Spiel ermöglicht. Der Code soll sauber strukturiert und gut kommentiert sein.
