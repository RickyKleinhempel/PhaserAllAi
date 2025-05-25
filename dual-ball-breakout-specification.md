# Dual Ball Breakout Game - Complete Development Specification

## Project Overview
Create a complete HTML5 Canvas-based breakout-style game with dual balls, dynamic field conversion, visual effects, and customizable features. The game should be implemented as a single HTML file with embedded CSS and JavaScript.

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

### Collision Detection
- **Wall collisions**: Balls bounce off all four canvas edges
- **Field collisions**: 
  - Balls only collide with fields of their own type
  - Collision direction determines bounce angle (deltaX vs deltaY comparison)
  - Field conversion triggers on collision

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
- **Quantity**: 12 particles per field conversion
- **Lifespan**: 60-100 frames (random variation)
- **Behavior**: 
  - Radial explosion pattern (360° distribution)
  - Variable speed: 1.5 + random * 4
  - Velocity decay: 0.97-0.99 per frame
  - Size animation: Grow first 30%, then shrink
  - Color interpolation between old and new field colors
- **Visual enhancements**: 
  - Glow effect (2x size ring with 30% alpha) in first 50% of life
  - Slower fade-out (alpha = 1 - progress * 0.7)

## Audio System
- **Technology**: Web Audio API
- **Light ball sound**: 800Hz → 400Hz frequency sweep
- **Dark ball sound**: 400Hz → 800Hz frequency sweep
- **Duration**: 0.1 seconds with exponential gain ramp

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
- **Animation**: HSL color space transitions
- **Speed**: 0.8 units per frame increment
- **Pattern**: Light and dark colors are complementary (180° hue difference)
- **Color properties**: 
  - Light fields: HSL(hue, 80%, 75%)
  - Dark fields: HSL(hue+180°, 90%, 25%)
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
- **particles**: Array of particle objects with position, velocity, life, colors
- **animatedFields**: Array of field animations with progress tracking
- **Ball objects**: x, y, dx, dy, type, trail array

### Color System
- **HSL to Hex conversion**: Implemented for automatic color transitions
- **RGB interpolation**: For particle color transitions
- **Real-time updates**: All visual elements respond to color changes immediately

### Performance Optimizations
- **Particle cleanup**: Remove particles when life <= 0
- **Animation cleanup**: Remove completed field animations
- **Trail management**: Limit to 16 positions per ball
- **Visibility culling**: Skip rendering invisible flip animations

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
- Separate functions for: initialization, game loop, rendering, collision detection, effects
- Event-driven UI interactions
- Clean separation of game state and rendering logic

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
A single HTML file containing a fully functional dual ball breakout game with all specified features, visual effects, audio feedback, and customization options. The game should be playable immediately upon opening the file in a web browser, with no external dependencies required.
