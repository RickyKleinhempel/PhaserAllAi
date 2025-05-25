# Dual Ball Breakout Game - Complete Development Specification mit Powerup-System

## Project Overview
Create a complete HTML5 Canvas-based breakout-style game with dual balls, dynamic field conversion, visual effects, customizable features, and an advanced powerup system with explosive area-of-effect mechanics. The game should be implemented as a single HTML file with embedded CSS and JavaScript.

## Core Game Mechanics

### Game Field
- **Size**: 32x32 fields (1024x1024 pixel canvas)
- **Field dimensions**: Each field is 32x32 pixels
- **Initial state**: Left half (16 columns) = light fields, right half (16 columns) = dark fields
- **Total fields**: 1024 fields (512 light + 512 dark initially)

### Dual Ball System
- **Light Ball**: 
  - Type identifier: `'light'`
  - Starts on dark side (x: CANVAS_WIDTH * 0.75, y: CANVAS_HEIGHT / 2)
  - Initial velocity: dx: -BALL_SPEED, dy: BALL_SPEED
  - Converts light fields (0) to dark fields (1)
  - Can move freely over dark fields (1)
  - Bounces off light fields and walls
- **Dark Ball**: 
  - Type identifier: `'dark'`
  - Starts on light side (x: CANVAS_WIDTH * 0.25, y: CANVAS_HEIGHT / 2)
  - Initial velocity: dx: BALL_SPEED, dy: -BALL_SPEED
  - Converts dark fields (1) to light fields (0)
  - Can move freely over light fields (0)
  - Bounces off dark fields and walls
- **Ball properties**: Radius 6px, Speed 2 units per frame
- **Ball identification**: Use `ball.type` property instead of color comparison
- **Powerup charges**: Each ball can collect and store powerup charges (`ball.powerupCharges`)
- **Visual indicators**: Balls with charges display golden glow and charge indicators

### Collision Detection
- **Wall collisions**: Balls bounce off all four canvas edges
- **Field collisions**: 
  - Balls only collide with fields of their own type
  - Collision direction determines bounce angle (deltaX vs deltaY comparison)
  - Field conversion triggers on collision
  - **Powerup explosions**: If ball has charges, triggers area-of-effect conversion instead
- **Powerup collisions**: Balls collect powerups on contact, gaining charges

## Powerup System

### Powerup Spawning
- **Spawn rate**: Every 3-8 seconds (randomized intervals)
- **Appearance**: Golden star powerups with pulsing animation
- **Visual effects**: Continuous sparkle particles around each powerup
- **Positioning**: Random field locations, no duplicate spawns per field
- **Animation**: Pulsing glow effect with size variation

### Powerup Collection
- **Collision detection**: Ball radius + powerup size collision
- **Effect**: Increases ball's `powerupCharges` property by 1
- **Audio feedback**: Uplifting ascending tone (600Hz → 1200Hz, 0.2s)
- **Visual feedback**: 15 golden particle burst effect
- **Ball changes**: Immediate visual indicator update

### Powerup Explosion Mechanics
- **Trigger**: Charged ball hits convertible field
- **Explosion radius**: 3 fields in all directions from impact point
- **Area conversion**: All matching fields within radius are converted
- **Wave animation**: Delayed field animations based on distance from center
- **Charge consumption**: One charge consumed per explosion
- **Audio**: Dramatic explosion sound with bass rumble and high-frequency crack

### Powerup Visual Indicators
- **Ball glow**: Golden radial gradient around charged balls
- **Charge display**: 
  - 1-5 charges: Golden dots orbiting the ball
  - 6+ charges: Number displayed in center of ball
- **Real-time updates**: Immediate visual feedback for charge changes

## Visual Effects

### Ball Trails
- **Trail length**: 16 position history per ball
- **Visual effect**: Decreasing radius and transparency for trailing positions
- **Colors**: Match respective field colors with alpha transparency

### Field Conversion Animation
- **Type**: Vertical flip animation (3D card-flip effect)
- **Duration**: 40 frames
- **Effect**: Scale Y-axis using Math.cos(progress * Math.PI)
- **Color transition**: Show old color in first half, new color in second half
- **Visibility threshold**: Only render when Math.abs(scaleY) > 0.02

### Particle Effects
- **Standard conversion**: 12 particles per field conversion
- **Powerup explosion**: 50+ explosion particles + 30+ spark particles
- **Powerup collection**: 15 golden particles with special color behavior
- **Powerup sparkles**: Continuous particles around spawned powerups
- **Lifespan**: 
  - Standard: 60-100 frames (random variation)
  - Explosion: 80-160 frames for dramatic effect
  - Collection: 40-70 frames
- **Behavior**: 
  - Radial explosion pattern (360° distribution)
  - Variable speed: 1.5 + random * 4 (standard), up to 25 (explosion)
  - Velocity decay: 0.97-0.99 per frame (standard), 0.90-0.97 (explosion)
  - Size animation: Grow first 30%, then shrink
  - **Particle types**:
    - Normal: Color interpolation between old and new field colors
    - Golden: Gold to orange transition for powerup effects
    - Spark: White to colored for explosion effects
    - Explosion: Enhanced size and speed for dramatic impact
- **Visual enhancements**: 
  - Glow effect (2x size ring with 30% alpha) in first 50% of life
  - Slower fade-out (alpha = 1 - progress * 0.7)
  - Type-specific color behaviors

## Audio System
- **Technology**: Web Audio API
- **Standard conversion sounds**:
  - Light ball sound: 800Hz → 400Hz frequency sweep (0.1s)
  - Dark ball sound: 400Hz → 800Hz frequency sweep (0.1s)
- **Powerup audio**:
  - Collection sound: 600Hz → 1200Hz ascending tone (0.2s)
  - Explosion sound: Dual-oscillator system
    - Bass rumble: 80Hz → 20Hz (sawtooth, 0.5s)
    - High crack: 300Hz → 50Hz (square, 0.3s)
- **Audio properties**:
  - Standard: 0.3 gain with exponential ramp to 0.01
  - Powerup collection: 0.4 gain
  - Explosion: 0.8 gain for dramatic impact
- **Initialization**: First user interaction enables audio context

## User Interface

### Game Controls
- **Start Button**: Green (#4CAF50) - Initializes audio and starts game loop
- **Pause Button**: Orange (#ff9800) - Pauses/resumes game
- **Reset Button**: Red (#f44336) - Resets field, balls, particles, and animations

### Speed Control
- **Range**: 0.25x to 10x speed multiplier
- **Default**: 2.0x
- **Implementation**: Real-time frame timing adjustment using performance.now()
- **UI**: Slider with live speed display

### Color Customization
- **Light Field Color Picker**: Default #ffffff
- **Dark Field Color Picker**: Default #000000
- **Ball Colors**: Dynamically match selected field colors
- **Ball Borders**: Dark border (#333333) for light balls, light border (#cccccc) for dark balls

### Automatic Color Animation
- **Toggle Button**: Purple (#9C27B0) with active state (#E91E63)
- **Animation modes**: 5 different mathematical patterns:
  - Standard: Smooth HSL rotation with complementary colors
  - Wellen: Oscillating saturation and lightness waves
  - Puls: Rhythmic intensity changes with fast and slow pulses
  - Regenbogen: Rapid rainbow color cycling
  - Kontrast: Extreme color contrasts with dramatic shifts
- **Mode cycling**: Button click cycles through modes
- **Speed control**: 0.1x to 3.0x animation speed slider
- **Pattern properties**: 
  - Light fields: Variable HSL values based on mode
  - Dark fields: Coordinated but distinct color patterns
  - Mathematical functions: Sin, cos, and custom formulas per mode
- **UI Sync**: Updates color pickers in real-time

### Score Display
- **Light Fields Counter**: Real-time count of light fields
- **Dark Fields Counter**: Real-time count of dark fields
- **Update trigger**: After each field conversion

## Technical Implementation

### Game Loop
- **Framework**: requestAnimationFrame with FPS control
- **Target FPS**: 60 (16.67ms per frame)
- **Speed adjustment**: targetFrameTime = 16.67 / gameSpeed
- **Update order**: Auto colors → Ball movement → Collision detection → Rendering

### Data Structures
- **gameField**: 2D array (32x32) with 0 (light) and 1 (dark) values
- **particles**: Array of particle objects with position, velocity, life, colors, and type flags
- **animatedFields**: Array of field animations with progress tracking
- **powerups**: Array of powerup objects with position, animation state, and sparkle effects
- **Ball objects**: x, y, dx, dy, type, trail array, powerupCharges
- **Powerup objects**: x, y, fieldX, fieldY, size, pulseCycle, sparkles array, collected flag

### Color System
- **HSL to Hex conversion**: Implemented for automatic color transitions
- **RGB interpolation**: For particle color transitions
- **Real-time updates**: All visual elements respond to color changes immediately
- **Powerup colors**: Dedicated golden color scheme (#FFD700, #FFA500, #FF6B00)
- **Multi-type particle colors**: Support for normal, golden, spark, and explosion particle types

### Performance Optimizations
- **Particle cleanup**: Remove particles when life <= 0
- **Animation cleanup**: Remove completed field animations
- **Trail management**: Limit to 16 positions per ball
- **Visibility culling**: Skip rendering invisible flip animations
- **Powerup management**: Efficient spawning, collision detection, and cleanup
- **Selective rendering**: Separate rendering passes for different effect types
- **Memory management**: Proper cleanup of powerup sparkles and collected powerups

## Code Structure Requirements

### HTML Structure
```html
<!DOCTYPE html>
<html lang="de">
<head>
    <!-- Meta tags, title, embedded CSS -->
</head>
<body>
    <h1>Dual Ball Breakout</h1>
    <div class="controls"><!-- Game control buttons --></div>
    <canvas id="gameCanvas" width="1024" height="1024"></canvas>
    <div class="score"><!-- Field counters --></div>
    <div class="speed-control"><!-- Speed slider --></div>
    <div class="color-controls"><!-- Color pickers + auto button --></div>
    <script><!-- All game logic --></script>
</body>
</html>
```

### CSS Styling
- Modern, clean design with hover effects
- Responsive button styling with transitions
- Color-coded game controls
- Slider styling for speed control
- Active state styling for auto-color button

### JavaScript Architecture
- Modular function organization
- Separate functions for: initialization, game loop, rendering, collision detection, effects, powerup system
- Event-driven UI interactions
- Clean separation of game state and rendering logic
- **Powerup system integration**: Seamless integration with existing game mechanics
- **Enhanced particle engine**: Multi-type particle support with specialized behaviors
- **Advanced audio system**: Multiple sound types with procedural generation

## Game Constants
```javascript
const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 1024;
const FIELD_SIZE = 32;
const FIELDS_X = 32;
const FIELDS_Y = 32;
const BALL_RADIUS = 6;
const BALL_SPEED = 2;
```

## Expected Deliverable
A single HTML file containing a fully functional dual ball breakout game with all specified features, visual effects, audio feedback, customization options, and a complete powerup system with explosive area-of-effect mechanics. The powerup system should add strategic depth to gameplay while maintaining the fast-paced, visually appealing nature of the base game. The game should be playable immediately upon opening the file in a web browser, with no external dependencies required.

### Key Powerup System Requirements:
- Automatic powerup spawning with visual effects
- Ball charge collection and visual indicators
- Explosive field conversion with area-of-effect damage
- Enhanced particle systems with multiple effect types
- Comprehensive audio feedback for all powerup actions
- Strategic gameplay elements that enhance rather than complicate the core experience
