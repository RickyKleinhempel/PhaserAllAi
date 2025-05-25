# Complete Phaser.js Dual Ball Breakout Game Development Prompt

## Project Overview
Create a complete dual ball breakout game using **Phaser.js 3.70+** with all modern features including a sophisticated powerup system, progressive speed mechanics, fullscreen support, and auto-start functionality. This should be built as a modern web application with proper module structure.

## Technical Stack & Setup

### Prerequisites
```json
{
  "dependencies": {
    "phaser": "^3.70.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

### Project Structure
```
index.html
package.json
vite.config.js
.gitignore
src/
  main.js
  fullscreen.js
  gameObjects/
    Ball.js
  scenes/
    GameScene.js
  utils/
    AudioManager.js
    ColorManager.js
    FieldManager.js
    ParticleManager.js
    PowerupManager.js
```

### Vite Configuration
```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    host: true,
    port: 3000,
  }
})
```

## Game Specifications

### Core Constants
```javascript
export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 1024;
export const FIELD_SIZE = 32;
export const FIELDS_X = 32;
export const FIELDS_Y = 32;
export const BALL_RADIUS = 6;
export const BALL_SPEED = 2;
```

### Game Field
- **Size**: 32x32 fields (1024x1024 pixel canvas)
- **Initial state**: Left half = light fields (0), right half = dark fields (1)
- **Total fields**: 1024 (512 light + 512 dark initially)

## Dual Ball System

### Ball Properties
- **Light Ball**: 
  - Type: `'light'`
  - Start position: `(CANVAS_WIDTH * 0.75, CANVAS_HEIGHT / 2)`
  - Initial velocity: `(-BALL_SPEED, BALL_SPEED)`
  - Converts light fields (0) → dark fields (1)
  - Moves freely over dark fields
- **Dark Ball**:
  - Type: `'dark'`
  - Start position: `(CANVAS_WIDTH * 0.25, CANVAS_HEIGHT / 2)`
  - Initial velocity: `(BALL_SPEED, -BALL_SPEED)`
  - Converts dark fields (1) → light fields (0)
  - Moves freely over light fields

### Ball Features
- **Trail system**: 16 position history with fading transparency
- **Progressive speed boost**: Each powerup doubles current speed (1x → 2x → 4x → 8x → 16x → ... → max 256x)
- **Speed boost timer**: 30 seconds per powerup collection, timer resets with each new powerup
- **Powerup charges**: Unlimited accumulation for explosion capabilities
- **Visual indicators**: 
  - Blue glow + speed lines for speed boost
  - Golden glow + charge dots/numbers for explosions
  - Dual display when both effects are active

## Advanced Powerup System

### Powerup Spawning
- **Frequency**: Every 3-8 seconds (randomized)
- **Appearance**: Golden star with pulsing animation
- **Visual effects**: Continuous sparkle particles
- **Position**: Random field locations (no duplicates per field)

### Powerup Collection Effects
- **Speed boost**: Progressive doubling (speed *= 2, max 256x)
- **Explosion charges**: +1 charge per powerup
- **Audio**: Ascending tone (600Hz → 1200Hz, 0.2s)
- **Particles**: 15 golden burst particles
- **Timer reset**: Each collection resets 30-second speed timer

### Explosion Mechanics
- **Trigger**: Charged ball hits convertible field
- **Radius**: 3 fields from impact point
- **Area conversion**: All matching fields in radius converted
- **Wave effect**: Distance-based delayed animations
- **Charge consumption**: -1 charge per explosion
- **Audio**: Dual-oscillator explosion sound (bass + crack)

## Visual Effects System

### Particle Engine
- **Types**: Normal, golden, spark, explosion
- **Standard conversion**: 12 particles per field
- **Powerup explosion**: 50+ explosion + 30+ spark particles
- **Collection effect**: 15 golden particles
- **Lifespan**: 60-100 frames (normal), 80-160 (explosion)
- **Behavior**: Radial explosion, velocity decay, size animation

### Field Animations
- **Type**: 3D vertical flip animation
- **Duration**: 40 frames
- **Effect**: Y-axis scaling with `Math.cos(progress * Math.PI)`
- **Color transition**: Old color → new color at 50% progress
- **Visibility**: Only render when `Math.abs(scaleY) > 0.02`

### Ball Visual Effects
- **Trail rendering**: Decreasing alpha and radius
- **Speed indicators**: 
  - Logarithmic scale for high speeds
  - Blue glow and radial lines
  - Speed multiplier text display
- **Charge indicators**:
  - 1-5 charges: Golden dots around ball
  - 6+ charges: Number text in center
  - Golden glow effect

## Audio System

### Web Audio Implementation
- **Technology**: Web Audio API with procedural generation
- **Initialization**: First user interaction enables audio context
- **Sound Types**:
  - Field conversion: Frequency sweeps (light: 800→400Hz, dark: 400→800Hz)
  - Powerup collection: Ascending tone (600→1200Hz)
  - Explosion: Dual oscillator (bass rumble + high crack)

## User Interface

### Control System
- **Buttons**: All control buttons hidden with CSS `display: none`
- **Auto-start**: Game begins automatically after 100ms delay via `this.time.delayedCall()`
- **No user interaction**: Game starts immediately without requiring clicks
- **Hidden UI elements**: Start button, reset button, all game controls
- **Speed control**: 0.25x to 10x multiplier slider (hidden but functional)
- **Score display**: Real-time field counters (visible)
- **Color pickers**: Customizable field colors (hidden)
- **Auto-color modes**: 5 mathematical animation patterns (hidden)

### Fullscreen Support
- **Toggle button**: Blue "Vollbild" button (hidden initially with `display: none`)
- **Cross-browser**: Support for all major browsers (webkit, moz, ms prefixes)
- **Responsive design**: Canvas adapts to different screen sizes with proper scaling
- **Exit methods**: Button click, Escape key, browser controls, click outside
- **Element management**: Moves game container to fullscreen overlay
- **Implementation**: Complete FullscreenManager class in `src/fullscreen.js`
- **CSS**: Dedicated fullscreen styles with responsive breakpoints
- **Event handling**: Proper fullscreen change listeners and cleanup

### Color System
- **Manual control**: Color pickers for light/dark fields
- **Auto-animation**: 5 modes with mathematical patterns
- **Real-time updates**: All elements respond immediately
- **Ball synchronization**: Ball colors match field colors
- **Powerup colors**: Dedicated golden palette (#FFD700, #FFA500, #FF6B00)

## Technical Implementation

### Phaser.js Architecture

#### Main Game Configuration
```javascript
const config = {
    type: Phaser.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#ddd',
    physics: {
        default: 'arcade',
        arcade: {
            enableBody: true,
            debug: false
        }
    },
    scene: [GameScene]
};
```

#### Ball Class (Ball.js)
```javascript
export class Ball extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y, ballType) {
        // Properties: ballType, powerupCharges, speedMultiplier, speedBoostTimer, trail
    }
    
    // Key methods:
    doubleSpeed() // Progressive speed multiplication
    update(delta) // Speed timer, trail updates
    render() // Visual effects, glow, indicators
    drawSpeedIndicators() // Logarithmic speed display
    drawPowerupCharges() // Charge visualization
}
```

#### PowerupManager Class
```javascript
export class PowerupManager {
    // Methods:
    spawnPowerup() // Random positioning with sparkles
    checkCollisions(ball) // Collection detection + effects
    triggerExplosion(ball, fieldX, fieldY) // Area-of-effect conversion
    updateSparkles() // Continuous particle effects
}
```

#### FullscreenManager Class (src/fullscreen.js)
```javascript
export class FullscreenManager {
    constructor() {
        this.isFullscreen = false;
        this.gameContainer = null;
        this.fullscreenContainer = null;
    }
    
    // Key methods:
    toggleFullscreen() // Cross-browser fullscreen toggle
    enterFullscreen() // Move elements to fullscreen
    exitFullscreen() // Restore normal layout
    setupEventListeners() // Handle escape key and clicks
    updateFullscreenStatus() // Track fullscreen state
}
```

#### Auto-Start Implementation
```javascript
// In GameScene.create()
this.time.delayedCall(100, () => {
    this.startGame();
});

// CSS for hidden controls
.controls {
    display: none;
}
```

#### GameScene Class
```javascript
export class GameScene extends Phaser.Scene {
    create() {
        // Auto-start implementation
        this.time.delayedCall(100, () => { this.startGame(); });
    }
    
    // Key systems:
    // - Field collision with explosion checks
    // - Progressive speed mechanics
    // - Particle management
    // - Audio integration
}
```

#### HTML Structure with Fullscreen Support
```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dual Ball Breakout</title>
    <style>
        /* Fullscreen styles */
        .fullscreen-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: black;
            z-index: 9999;
            display: none;
        }
        
        /* Hidden controls */
        .controls {
            display: none;
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
            #game-container canvas {
                width: 100vw !important;
                height: 100vh !important;
            }
        }
    </style>
</head>
<body>
    <div id="game-container"></div>
    <div id="fullscreen-container" class="fullscreen-container"></div>
    <div class="controls">
        <!-- All control buttons hidden -->
    </div>
    <script type="module" src="src/main.js"></script>
</body>
</html>
```

### Manager Classes

#### AudioManager
- Web Audio API implementation
- Procedural sound generation
- Multiple oscillator types
- Volume and frequency control

#### ColorManager
- HSL/RGB conversion utilities
- Auto-animation algorithms
- Real-time color updates
- Mathematical pattern generation

#### FieldManager
- 2D array field state management
- Animation system integration
- Conversion logic
- Visual update coordination

#### ParticleManager
- Multi-type particle system
- Lifecycle management
- Performance optimization
- Visual effect coordination

## Game Features

### Progressive Speed System
- **Mechanic**: Each powerup doubles current speed
- **Progression**: 1x → 2x → 4x → 8x → 16x → 32x → 64x → 128x → 256x (max)
- **Timer**: 30 seconds per boost, resets with each collection
- **Visual feedback**: Logarithmic indicator scale
- **Performance**: Speed cap prevents game breaking

### Auto-Start Functionality
- **Implementation**: Automatic game start after DOM load
- **UI**: All control buttons hidden by default
- **User experience**: Immediate gameplay without interaction
- **Audio handling**: Context initialized on first game action

### Advanced Collision System
- **Field detection**: Type-specific collision logic
- **Explosion integration**: Powerup charge checks
- **Wall bouncing**: Physics-based reflection
- **Performance**: Efficient collision algorithms

## Performance Optimizations

### Memory Management
- **Particle cleanup**: Automatic removal of expired particles
- **Trail limiting**: Maximum 16 positions per ball
- **Animation cleanup**: Completed animation removal
- **Powerup management**: Efficient spawning and collection

### Rendering Optimization
- **Selective rendering**: Separate passes for different effects
- **Visibility culling**: Skip invisible animations
- **Graphics batching**: Efficient Phaser.js usage
- **Update prioritization**: Critical systems first

## Deployment Preparation

### .gitignore Configuration
```
# Dependencies
node_modules/
npm-debug.log*

# Build outputs
dist/
build/

# Environment files
.env
.env.local
.env.production

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Debug files
debug-*.js
```

### Build System
- **Development**: `npm run dev` (Vite dev server, default port 3000)
- **Production**: `npm run build` (Optimized build to `dist/` folder)
- **Preview**: `npm run serve` (Local preview of production build)

### Free Hosting Options
- **Netlify**: Drag-and-drop `dist/` folder or connect Git repository
- **Vercel**: Import from GitHub with automatic builds
- **GitHub Pages**: Enable in repository settings, deploy from `dist/` branch
- **Surge.sh**: Command-line deployment: `npm install -g surge && surge dist/`
- **Firebase Hosting**: Google's hosting platform with CDN

## Expected Deliverable

A complete, modern web game with:

### Core Functionality
- ✅ Dual ball mechanics with type-specific behavior
- ✅ Progressive speed boost system (exponential growth)
- ✅ Advanced powerup system with explosions
- ✅ Comprehensive visual effects
- ✅ Auto-start with hidden controls
- ✅ Fullscreen support
- ✅ Cross-browser compatibility

### Technical Excellence
- ✅ Clean, modular Phaser.js architecture
- ✅ Efficient performance optimization
- ✅ Proper error handling
- ✅ Modern ES6+ JavaScript
- ✅ Responsive design
- ✅ Production-ready build system

### User Experience
- ✅ Immediate gameplay (auto-start)
- ✅ Intuitive visual feedback
- ✅ Smooth animations (60 FPS)
- ✅ Progressive difficulty through speed scaling
- ✅ Strategic depth via powerup mechanics
- ✅ Immersive fullscreen mode

## Implementation Notes

### Development Approach
1. **Setup**: Initialize Vite project with Phaser.js dependencies
2. **Core**: Implement basic dual ball mechanics with field collision
3. **Effects**: Add visual particle system and audio integration
4. **Powerups**: Integrate advanced powerup mechanics with explosions
5. **Speed**: Implement progressive speed system (exponential doubling)
6. **UI**: Add auto-start functionality and hide all controls
7. **Fullscreen**: Implement cross-browser fullscreen support
8. **Polish**: Optimize performance and validate all features
9. **Deploy**: Build for production and deploy to hosting platform

### Code Quality
- **Architecture**: Clean separation of concerns
- **Documentation**: Comprehensive code comments
- **Error handling**: Graceful failure management
- **Testing**: Thorough feature validation
- **Performance**: 60 FPS target maintenance

This prompt provides a complete blueprint for recreating your sophisticated Phaser.js dual ball breakout game with all advanced features, progressive mechanics, and modern web development practices.
