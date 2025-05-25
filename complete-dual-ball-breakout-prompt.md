# Vollständiger Prompt für Dual Ball Breakout Spiel

## Aufgabe
Erstelle ein statisches HTML-Breakout-Spiel mit zwei Bällen auf einem 32x32 Spielfeld (1024x1024 Pixel Canvas). Das Spiel soll als eine einzige HTML-Datei implementiert werden, die CSS, JavaScript und alle Features enthält.

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

## Visuelle Effekte

### Partikel-System:
- **12 Partikel** pro Feldumwandlung
- **Lebensdauer**: 60-100 Frames (zufällig)
- **Bewegung**: Radiale Explosion vom Feldmittelpunkt
- **Größenanimation**: Erst größer werdend (30%), dann kleiner werdend (70%)
- **Farbübergang**: RGB-Interpolation von alter zu neuer Feldfarbe
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
- **Lautstärke**: 0.3 initial, exponentieller Abfall zu 0.01
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

// Spielfeld und Effekte
let gameField = []; // 32x32 Array
let particles = [];
let animatedFields = [];

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
    trail: []
};

let darkBall = {
    x: CANVAS_WIDTH * 0.25,
    y: CANVAS_HEIGHT / 2,
    dx: BALL_SPEED,
    dy: -BALL_SPEED,
    type: 'dark',
    trail: []
};
```

### Kern-Funktionen:
- `initGameField()`: Spielfeld initialisieren
- `drawGameField()`: Statische Felder rendern
- `drawBall(ball)`: Ball mit Schweif zeichnen
- `checkFieldCollision(ball)`: Feldkollision und -umwandlung
- `checkWallCollision(ball)`: Wandkollisionen
- `createConversionParticles()`: Partikeleffekte erstellen
- `createFieldAnimation()`: Feldanimationen starten
- `updateAndDrawParticles()`: Partikel-System
- `updateAndDrawAnimatedFields()`: Animierte Felder
- `playConversionSound()`: Audio-Effekte
- `updateAutoColors()`: Automatische Farbanimation
- `hslToHex()`: HSL zu Hex Konvertierung

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
2. **HSL-Farbanimationen**: Mathematisch saubere Farbübergänge
3. **3D-Flip-Animationen**: Realistische Feldumwandlungs-Effekte
4. **Mehrstufige Partikeleffekte**: Größen- und Transparenz-Animationen
5. **Web Audio Synthesis**: Prozedural generierte Sounds
6. **Performance-optimiert**: Effiziente Render-Zyklen

## Ziel
Das finale Spiel soll visuell ansprechend, flüssig animiert und vollständig funktional sein. Alle Features sollen nahtlos zusammenarbeiten und eine moderne, polierte Spielerfahrung bieten. Der Code soll sauber strukturiert und gut kommentiert sein.
