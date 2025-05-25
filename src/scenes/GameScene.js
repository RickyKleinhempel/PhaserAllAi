import { 
    CANVAS_WIDTH, 
    CANVAS_HEIGHT, 
    FIELD_SIZE, 
    FIELDS_X, 
    FIELDS_Y, 
    BALL_RADIUS, 
    BALL_SPEED 
} from '../main.js';
import { ColorManager } from '../utils/ColorManager.js';
import { AudioManager } from '../utils/AudioManager.js';
import { ParticleManager } from '../utils/ParticleManager.js';
import { PowerupManager } from '../utils/PowerupManager.js';
import { FieldManager } from '../utils/FieldManager.js';
import { Ball } from '../gameObjects/Ball.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init() {
        // Game state
        this.gameRunning = false;
        this.gameSpeed = 2.0;
        
        // Initialize managers
        this.colorManager = new ColorManager(this);
        this.audioManager = new AudioManager(this);
        this.particleManager = new ParticleManager(this);
        this.powerupManager = new PowerupManager(this);
        this.fieldManager = new FieldManager(this);
        
        // Game field - 0 = light field, 1 = dark field
        this.gameField = [];
        
        // Initialize game field
        this.initGameField();
    }

    create() {
        // Create graphics objects
        this.fieldGraphics = this.add.graphics();
        this.particleGraphics = this.add.graphics();
        this.powerupGraphics = this.add.graphics();
          // Create balls
        this.lightBall = new Ball(this, CANVAS_WIDTH * 0.75, CANVAS_HEIGHT / 2, 'light');
        this.darkBall = new Ball(this, CANVAS_WIDTH * 0.25, CANVAS_HEIGHT / 2, 'dark');
        
        // Don't set velocities yet - wait for game start
        this.lightBall.setVelocity(0, 0);
        this.darkBall.setVelocity(0, 0);
        
        // Initialize audio (after user interaction)
        this.input.once('pointerdown', () => {
            this.audioManager.init();
        });
        
        // Set up UI event listeners
        this.setupUIListeners();
          // Initial render
        this.render();
          console.log('GameScene created successfully');
        console.log('Light ball position:', this.lightBall.x, this.lightBall.y);
        console.log('Dark ball position:', this.darkBall.x, this.darkBall.y);
        console.log('Field counts - Light:', this.countFields(0), 'Dark:', this.countFields(1));
        
        // Run diagnostics after a short delay
        setTimeout(() => this.runDiagnostics(), 1000);
    }

    update(time, delta) {
        if (!this.gameRunning) return;

        // Calculate speed-adjusted delta
        const adjustedDelta = delta * this.gameSpeed;
        
        // Update automatic colors
        this.colorManager.update(adjustedDelta);
        
        // Update balls
        this.lightBall.update(adjustedDelta);
        this.darkBall.update(adjustedDelta);
        
        // Check collisions
        this.checkCollisions();
        
        // Update managers
        this.particleManager.update(adjustedDelta);
        this.powerupManager.update(adjustedDelta);
        this.fieldManager.update(adjustedDelta);
        
        // Render everything
        this.render();
    }

    initGameField() {
        this.gameField = [];
        for (let y = 0; y < FIELDS_Y; y++) {
            this.gameField[y] = [];
            for (let x = 0; x < FIELDS_X; x++) {
                // Left half = light fields (0), right half = dark fields (1)
                this.gameField[y][x] = x < FIELDS_X / 2 ? 0 : 1;
            }
        }
        this.updateFieldCounts();
    }

    updateFieldCounts() {
        let lightCount = 0;
        let darkCount = 0;
        
        for (let y = 0; y < FIELDS_Y; y++) {
            for (let x = 0; x < FIELDS_X; x++) {
                if (this.gameField[y][x] === 0) lightCount++;
                else darkCount++;
            }
        }
        
        document.getElementById('lightFields').textContent = lightCount;
        document.getElementById('darkFields').textContent = darkCount;
    }

    checkCollisions() {
        // Check wall collisions
        this.checkWallCollision(this.lightBall);
        this.checkWallCollision(this.darkBall);
        
        // Check powerup collisions
        this.powerupManager.checkCollisions(this.lightBall);
        this.powerupManager.checkCollisions(this.darkBall);
        
        // Check field collisions
        if (this.checkFieldCollision(this.lightBall)) {
            this.updateFieldCounts();
        }
        if (this.checkFieldCollision(this.darkBall)) {
            this.updateFieldCounts();
        }
    }    checkWallCollision(ball) {
        const bounds = ball.getBounds();
        let bounced = false;
        
        // Left wall
        if (bounds.left <= 0) {
            ball.body.setVelocityX(Math.abs(ball.body.velocity.x));
            ball.x = BALL_RADIUS;
            bounced = true;
        }
        
        // Right wall
        if (bounds.right >= CANVAS_WIDTH) {
            ball.body.setVelocityX(-Math.abs(ball.body.velocity.x));
            ball.x = CANVAS_WIDTH - BALL_RADIUS;
            bounced = true;
        }
        
        // Top wall
        if (bounds.top <= 0) {
            ball.body.setVelocityY(Math.abs(ball.body.velocity.y));
            ball.y = BALL_RADIUS;
            bounced = true;
        }
        
        // Bottom wall
        if (bounds.bottom >= CANVAS_HEIGHT) {
            ball.body.setVelocityY(-Math.abs(ball.body.velocity.y));
            ball.y = CANVAS_HEIGHT - BALL_RADIUS;
            bounced = true;
        }
        
        if (bounced) {
            console.log(`Ball ${ball.ballType} bounced off wall at position:`, ball.x, ball.y);
        }
    }

    checkFieldCollision(ball) {
        const ballLeft = ball.x - BALL_RADIUS;
        const ballRight = ball.x + BALL_RADIUS;
        const ballTop = ball.y - BALL_RADIUS;
        const ballBottom = ball.y + BALL_RADIUS;
        
        // Determine affected fields
        const leftField = Math.floor(ballLeft / FIELD_SIZE);
        const rightField = Math.floor(ballRight / FIELD_SIZE);
        const topField = Math.floor(ballTop / FIELD_SIZE);
        const bottomField = Math.floor(ballBottom / FIELD_SIZE);
        
        let collisionX = false;
        let collisionY = false;
        
        for (let y = Math.max(0, topField); y <= Math.min(FIELDS_Y - 1, bottomField); y++) {
            for (let x = Math.max(0, leftField); x <= Math.min(FIELDS_X - 1, rightField); x++) {
                const fieldType = this.gameField[y][x];
                const ballIsLight = ball.ballType === 'light';
                
                // Determine collision direction
                const fieldCenterX = x * FIELD_SIZE + FIELD_SIZE / 2;
                const fieldCenterY = y * FIELD_SIZE + FIELD_SIZE / 2;
                
                const deltaX = ball.x - fieldCenterX;
                const deltaY = ball.y - fieldCenterY;                  // Collision logic
                if (ballIsLight) {
                    // Light ball: converts light fields (0) to dark, bounces off light fields
                    if (fieldType === 0) {
                        // Convert field
                        this.gameField[y][x] = 1;
                        
                        // Check for powerup explosion
                        if (ball.powerupCharges > 0) {
                            this.powerupManager.triggerExplosion(ball, x, y);
                        } else {
                            // Normal effects
                            this.audioManager.playConversionSound(true);
                            this.particleManager.createConversionParticles(x, y, 0, 1);
                            this.fieldManager.createAnimation(x, y, 0, 1);
                        }
                        
                        // Ball bounces
                        if (Math.abs(deltaX) > Math.abs(deltaY)) {
                            collisionX = true;
                        } else {
                            collisionY = true;
                        }
                    }
                } else {
                    // Dark ball: converts dark fields (1) to light, bounces off dark fields
                    if (fieldType === 1) {
                        // Convert field
                        this.gameField[y][x] = 0;
                          // Check for powerup explosion
                        if (ball.powerupCharges > 0) {
                            this.powerupManager.triggerExplosion(ball, x, y);
                        } else {
                            // Normal effects
                            this.audioManager.playConversionSound(false);
                            this.particleManager.createConversionParticles(x, y, 1, 0);
                            this.fieldManager.createAnimation(x, y, 1, 0);
                        }
                        
                        // Ball bounces
                        if (Math.abs(deltaX) > Math.abs(deltaY)) {
                            collisionX = true;
                        } else {
                            collisionY = true;
                        }
                    }
                }
            }
        }
          // Change ball direction on collision
        if (collisionX) {
            ball.body.velocity.x *= -1;
            console.log('Ball collision X detected for', ball.ballType);
        }
        if (collisionY) {
            ball.body.velocity.y *= -1;
            console.log('Ball collision Y detected for', ball.ballType);
        }
        
        return collisionX || collisionY;
    }

    render() {
        // Clear graphics
        this.fieldGraphics.clear();
        this.particleGraphics.clear();
        this.powerupGraphics.clear();
        
        // Render game field
        this.renderGameField();
        
        // Render animated fields
        this.fieldManager.render(this.fieldGraphics);
        
        // Render particles
        this.particleManager.render(this.particleGraphics);
        
        // Render powerups
        this.powerupManager.render(this.powerupGraphics);
        
        // Update balls' visual representation
        this.lightBall.render();
        this.darkBall.render();
    }

    renderGameField() {
        for (let y = 0; y < FIELDS_Y; y++) {
            for (let x = 0; x < FIELDS_X; x++) {
                // Skip animated fields
                if (this.fieldManager.isFieldAnimated(x, y)) continue;
                
                const fieldX = x * FIELD_SIZE;
                const fieldY = y * FIELD_SIZE;
                
                if (this.gameField[y][x] === 0) {
                    this.fieldGraphics.fillStyle(Phaser.Display.Color.HexStringToColor(this.colorManager.lightFieldColor).color);
                } else {
                    this.fieldGraphics.fillStyle(Phaser.Display.Color.HexStringToColor(this.colorManager.darkFieldColor).color);
                }
                
                this.fieldGraphics.fillRect(fieldX, fieldY, FIELD_SIZE, FIELD_SIZE);
            }
        }
    }

    setupUIListeners() {
        // Start button
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Pause button
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.pauseGame();
        });
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        // Speed control
        const speedSlider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');
        
        speedSlider.addEventListener('input', (e) => {
            this.gameSpeed = parseFloat(e.target.value);
            speedValue.textContent = this.gameSpeed.toFixed(2) + 'x';
        });
        
        // Color controls
        const lightColorPicker = document.getElementById('lightColorPicker');
        const darkColorPicker = document.getElementById('darkColorPicker');
          lightColorPicker.addEventListener('input', (e) => {
            this.colorManager.setLightColor(e.target.value);
        });
        
        darkColorPicker.addEventListener('input', (e) => {
            this.colorManager.setDarkColor(e.target.value);
        });
        
        // Auto color button
        const autoColorBtn = document.getElementById('autoColorBtn');
        autoColorBtn.addEventListener('click', () => {
            this.colorManager.toggleAutoMode();
            this.updateAutoColorButton();
        });
        
        // Color mode button
        const colorModeBtn = document.getElementById('colorModeBtn');
        colorModeBtn.addEventListener('click', () => {
            this.colorManager.nextMode();
            colorModeBtn.textContent = this.colorManager.getCurrentModeName();
        });
        
        // Color speed control
        const colorSpeedSlider = document.getElementById('colorSpeedSlider');
        const colorSpeedValue = document.getElementById('colorSpeedValue');
        
        colorSpeedSlider.addEventListener('input', (e) => {
            this.colorManager.setAnimationSpeed(parseFloat(e.target.value));
            colorSpeedValue.textContent = parseFloat(e.target.value).toFixed(1) + 'x';
        });
    }

    updateAutoColorButton() {
        const btn = document.getElementById('autoColorBtn');
        if (this.colorManager.autoMode) {
            btn.classList.add('active');
            btn.textContent = 'Auto-Farben: AN';
        } else {
            btn.classList.remove('active');
            btn.textContent = 'Auto-Farben: AUS';
        }
    }    startGame() {
        this.audioManager.init();
        this.gameRunning = true;
        this.scene.resume();
        
        // Set ball velocities when game starts
        this.lightBall.setVelocity(-BALL_SPEED, BALL_SPEED);
        this.darkBall.setVelocity(BALL_SPEED, -BALL_SPEED);
        
        console.log('Game started!');
    }    pauseGame() {
        this.gameRunning = false;
        
        // Stop ball movement
        this.lightBall.setVelocity(0, 0);
        this.darkBall.setVelocity(0, 0);
        
        this.scene.pause();
    }

    resetGame() {
        this.pauseGame();
        
        // Reset game field
        this.initGameField();
        
        // Reset managers
        this.particleManager.reset();
        this.fieldManager.reset();
        this.powerupManager.reset();
        
        // Reset balls
        this.lightBall.reset(CANVAS_WIDTH * 0.75, CANVAS_HEIGHT / 2, -BALL_SPEED, BALL_SPEED);
        this.darkBall.reset(CANVAS_WIDTH * 0.25, CANVAS_HEIGHT / 2, BALL_SPEED, -BALL_SPEED);
          // Render
        this.render();
    }

    setGameSpeed(speed) {
        this.gameSpeed = speed;
    }    countFields(fieldType) {
        let count = 0;
        for (let y = 0; y < FIELDS_Y; y++) {
            for (let x = 0; x < FIELDS_X; x++) {
                if (this.gameField[y][x] === fieldType) {
                    count++;
                }
            }
        }
        return count;
    }

    runDiagnostics() {
        console.log('=== GAME DIAGNOSTICS ===');
        console.log('Game running:', this.gameRunning);
        console.log('Game speed:', this.gameSpeed);
        console.log('Light ball:', {
            x: this.lightBall.x,
            y: this.lightBall.y,
            velocity: { x: this.lightBall.body.velocity.x, y: this.lightBall.body.velocity.y },
            powerupCharges: this.lightBall.powerupCharges
        });
        console.log('Dark ball:', {
            x: this.darkBall.x,
            y: this.darkBall.y,
            velocity: { x: this.darkBall.body.velocity.x, y: this.darkBall.body.velocity.y },
            powerupCharges: this.darkBall.powerupCharges
        });
        console.log('Field counts:', {
            light: this.countFields(0),
            dark: this.countFields(1)
        });
        console.log('Color manager:', {
            lightColor: this.colorManager.lightFieldColor,
            darkColor: this.colorManager.darkFieldColor,
            autoMode: this.colorManager.autoMode,
            animationMode: this.colorManager.animationMode
        });
        console.log('Powerups:', this.powerupManager.powerups.length);
        console.log('Particles:', this.particleManager.particles.length);
        console.log('=== END DIAGNOSTICS ===');
    }
}
