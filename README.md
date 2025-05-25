# Dual Ball Breakout Game 🎮

Ein fortschrittliches Breakout-Spiel mit zwei Bällen, entwickelt mit **Phaser.js 3.70+** und modernen Web-Technologien. Dieses Projekt wurde vollständig automatisiert mit AI-Assistenten erstellt.

![Game Screenshot](docs/screenshot.png)

## 🤖 AI-Entwicklung

Dieses Projekt wurde **vollständig automatisiert** mit AI-Assistenten entwickelt:

- **GitHub Copilot**: Code-Generierung, Funktionsimplementierung, Debugging
- **Claude Sonnet 4**: Architektur-Design, Feature-Planung, Code-Optimierung

### Entwicklungsprozess
1. **Konzeptentwicklung** mit Claude Sonnet 4
2. **Code-Implementierung** mit GitHub Copilot
3. **Feature-Erweiterungen** durch iterative AI-Zusammenarbeit
4. **Testing & Optimierung** mit AI-geführter Problemlösung

## 🎯 Features

### Kern-Gameplay
- **Dual Ball System**: Zwei Bälle mit unterschiedlichen Eigenschaften
  - **Heller Ball**: Konvertiert helle Felder → dunkle Felder
  - **Dunkler Ball**: Konvertiert dunkle Felder → helle Felder
- **32x32 Spielfeld** (1024x1024 Pixel)
- **Physik-basierte Kollision** mit realistischen Reflexionen

### Fortschrittliche Mechaniken
- **Progressive Geschwindigkeitssteigerung**: Jedes Powerup verdoppelt die aktuelle Geschwindigkeit
  - Progression: 1x → 2x → 4x → 8x → 16x → 32x → 64x → 128x → 256x (max)
  - 30-Sekunden-Timer pro Boost
- **Powerup-System** mit doppelter Funktionalität:
  - Geschwindigkeitsboost (progressiv)
  - Explosionsladungen (unlimited stacking)
- **Bereichsexplosionen**: 3-Felder-Radius bei geladenen Ball-Kollisionen

### Visuelle Effekte
- **Partikelsystem**: 4 verschiedene Partikeltypen (Normal, Golden, Spark, Explosion)
- **3D-Feld-Animationen**: Vertikale Flip-Animationen bei Konvertierung
- **Ball-Trails**: 16 Positionen Verlaufsspur mit Transparenz
- **Geschwindigkeitsindikatoren**: Logarithmische Anzeige für hohe Geschwindigkeiten
- **Ladungsanzeige**: Goldene Punkte oder Zahlen für Explosionsladungen

### Audio-System
- **Web Audio API**: Prozedural generierte Sounds
- **3 Sound-Typen**:
  - Feldkonvertierung: Frequenz-Sweeps (800→400Hz / 400→800Hz)
  - Powerup-Sammlung: Aufsteigende Töne (600→1200Hz)
  - Explosionen: Dual-Oszillator (Bass + Crack)

### Benutzeroberfläche
- **Auto-Start**: Spiel startet automatisch ohne Benutzerinteraktion
- **Audio-Button**: Orange "🔊 Audio aktivieren" Button (oben rechts) für Browser-konforme Audio-Aktivierung
- **Versteckte Steuerung**: Alle Buttons ausgeblendet für immersive Erfahrung
- **Vollbild-Modus**: Cross-Browser-Unterstützung mit responsivem Design
- **Echtzeit-Anzeigen**: Live-Felderzähler und Geschwindigkeitsanzeige

## 🚀 Installation & Start

### Voraussetzungen
- Node.js 16+ 
- npm oder yarn

### Setup
```bash
# Repository klonen
git clone https://github.com/RickyKleinhempel/HtmlAI.git
cd HtmlAI

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Das Spiel ist dann unter `http://localhost:3000` verfügbar.

### Build für Produktion
```bash
# Production Build erstellen
npm run build

# Build-Vorschau
npm run serve
```

## 🏗️ Projektstruktur

```
├── index.html                 # Haupt-HTML-Datei
├── package.json              # Dependencies & Scripts
├── vite.config.js            # Vite-Konfiguration
├── src/
│   ├── main.js               # Haupteinstiegspunkt
│   ├── fullscreen.js         # Vollbild-Manager
│   ├── gameObjects/
│   │   └── Ball.js           # Ball-Klasse mit Trail & Effekten
│   ├── scenes/
│   │   └── GameScene.js      # Haupt-Spielszene
│   └── utils/
│       ├── AudioManager.js   # Web Audio API Implementation
│       ├── ColorManager.js   # Farbverwaltung & Animation
│       ├── FieldManager.js   # Spielfeld-Logik
│       ├── ParticleManager.js # Partikelsystem
│       └── PowerupManager.js # Powerup-System
├── AIPrompt/
│   └── complete-phaser-dual-ball-breakout-prompt.md # Vollständiger AI-Prompt
└── HtmlOnly/                 # Alternative HTML-Only Version
```

## 🔧 Technische Details

### Tech Stack
- **Phaser.js 3.70+**: Game Engine
- **Vite 5.0+**: Build-Tool & Dev-Server
- **Web Audio API**: Prozedurales Audio
- **Modern ES6+**: Modular JavaScript
- **CSS3**: Responsive Design & Animationen

### Performance-Optimierungen
- **60 FPS Target**: Optimierte Render-Zyklen
- **Memory Management**: Automatische Partikel-Bereinigung
- **Selective Rendering**: Nur sichtbare Elemente
- **Graphics Batching**: Effiziente Phaser.js-Nutzung

### Cross-Browser Support
- **Vollbild-APIs**: webkit, moz, ms Prefixes
- **Audio Context**: Graceful Fallbacks
- **Responsive Design**: Mobile & Desktop

## 🎮 Spielanleitung

### Ziel
Konvertiere alle Felder durch geschickte Ball-Navigation und strategische Powerup-Nutzung.

### Steuerung
- **Auto-Start**: Spiel startet automatisch
- **Audio**: Orange Button (oben rechts) zum Aktivieren der Sounds
- **Vollbild**: F11 oder Vollbild-Button (falls sichtbar)
- **Reset**: Browser-Refresh

### Strategien
1. **Powerup-Sammlung**: Maximiere Geschwindigkeitsboosts für schnellere Feldkonvertierung
2. **Ladungsmanagement**: Sammle Explosionsladungen für Bereichskonvertierung
3. **Ball-Koordination**: Nutze beide Bälle strategisch für optimale Feldabdeckung

## 🚀 Deployment

### Kostenlose Hosting-Optionen
- **Netlify**: Drag-and-drop `dist/` Ordner
- **Vercel**: GitHub-Import mit automatischen Builds
- **GitHub Pages**: Repository-Settings, deploy von `dist/` Branch
- **Surge.sh**: `npm install -g surge && surge dist/`
- **Firebase Hosting**: Google CDN-Platform

### Build-Commands
```bash
npm run build    # Production Build → dist/
npm run preview  # Build-Vorschau
```

## 📋 AI-Prompt

Der komplette AI-Prompt für die Neuerstellung dieses Projekts befindet sich in:
`AIPrompt/complete-phaser-dual-ball-breakout-prompt.md`

Dieser Prompt kann von jedem AI-Agenten verwendet werden, um das gesamte Projekt von Grund auf zu rekonstruieren.

## 🤝 Entwicklung mit AI

### Verwendete AI-Tools
- **GitHub Copilot**: 
  - Code-Vervollständigung
  - Funktionsimplementierung
  - Bug-Fixes
  - Refactoring
- **Claude Sonnet 4**:
  - Architektur-Design
  - Feature-Planung
  - Code-Review
  - Dokumentation

### AI-Entwicklungsworkflow
1. **Anforderungsanalyse** mit Claude
2. **Code-Generierung** mit Copilot
3. **Iterative Verbesserung** durch AI-Feedback
4. **Testing & Validation** mit AI-Unterstützung

## 📄 Lizenz

MIT License - Siehe [LICENSE](LICENSE) für Details.

## 🔮 Zukunft

Dieses Projekt demonstriert das Potenzial der AI-gestützten Softwareentwicklung. Alle Features wurden vollständig automatisiert implementiert, von der Konzeption bis zur produktionsreifen Anwendung.

---

**Entwickelt mit 🤖 AI-Power: GitHub Copilot + Claude Sonnet 4**
