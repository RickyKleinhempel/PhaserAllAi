import { BALL_RADIUS, BALL_SPEED } from '../main.js';

export class Ball extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y, ballType) {
        super(scene);
        
        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);        // Ball properties
        this.ballType = ballType;
        this.powerupCharges = 0; // Used for explosions
        this.speedMultiplier = 1; // Speed multiplier system
        this.speedBoostTimer = 0; // Timer for speed boost duration (in seconds)
        this.trail = [];
        this.chargeText = null;
        
        // Set position
        this.x = x;
        this.y = y;
        
        // Set up physics body
        this.body.setCircle(BALL_RADIUS);
        this.body.setBounce(1, 1);
        this.body.setCollideWorldBounds(false); // We handle wall collision manually
          // Initial render
        this.render();
    }

    setVelocity(dx, dy) {
        this.body.setVelocity(dx * 50, dy * 50); // Scale for Phaser physics
    }    update(delta) {
        // Update trail
        this.updateTrail();
        
        // Update speed boost timer
        if (this.speedBoostTimer > 0) {
            this.speedBoostTimer -= delta / 1000; // Convert ms to seconds
            if (this.speedBoostTimer <= 0) {
                this.speedBoostTimer = 0;
                this.speedMultiplier = 1; // Reset speed to normal
            }
        }
        
        // Update charge text position if it exists
        if (this.chargeText) {
            this.chargeText.x = this.x;
            this.chargeText.y = this.y;
        }
        
        // Update velocity based on game speed
        const currentVelX = this.body.velocity.x;
        const currentVelY = this.body.velocity.y;
          // Normalize velocity to maintain consistent speed with multiplier
        const magnitude = Math.sqrt(currentVelX * currentVelX + currentVelY * currentVelY);
        if (magnitude > 0) {
            const targetMagnitude = BALL_SPEED * 50 * this.speedMultiplier; // Apply speed multiplier
            this.body.setVelocity(
                (currentVelX / magnitude) * targetMagnitude,
                (currentVelY / magnitude) * targetMagnitude
            );
        }
    }

    updateTrail() {
        // Add current position to trail
        this.trail.push({ x: this.x, y: this.y });
        
        // Limit trail length
        const maxTrailLength = 16;
        if (this.trail.length > maxTrailLength) {
            this.trail.shift();
        }
    }    render() {
        this.clear();
        
        // Get current colors
        const lightColor = this.scene.colorManager.lightFieldColor;
        const darkColor = this.scene.colorManager.darkFieldColor;
        
        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
            const pos = this.trail[i];
            const alpha = (i + 1) / this.trail.length * 0.8;
            const radius = BALL_RADIUS * alpha;
            
            if (this.ballType === 'light') {
                this.fillStyle(lightColor, alpha);
            } else {
                this.fillStyle(darkColor, alpha);
            }
            
            this.fillCircle(pos.x - this.x, pos.y - this.y, radius);
        }        // Draw speed glow if accelerated or powerup glow if charged
        if (this.speedMultiplier > 1) {
            this.drawSpeedGlow();
        } else if (this.powerupCharges > 0) {
            this.drawPowerupGlow();
        }
        
        // Draw ball
        if (this.ballType === 'light') {
            this.fillStyle(lightColor);
            this.lineStyle(2, '#333333');
        } else {
            this.fillStyle(darkColor);
            this.lineStyle(2, '#cccccc');
        }
        
        this.fillCircle(0, 0, BALL_RADIUS);
        this.strokeCircle(0, 0, BALL_RADIUS);        // Draw speed indicators and powerup charges
        if (this.speedMultiplier > 1) {
            this.drawSpeedIndicators();
        }
        if (this.powerupCharges > 0) {
            this.drawPowerupCharges();
        }    }drawSpeedGlow() {
        // Create blue/cyan glow effect for speed
        const glowRadius = BALL_RADIUS + 8;
        const steps = 8;
        
        for (let i = 0; i < steps; i++) {
            const alpha = 0.6 * (1 - i / steps);
            const radius = BALL_RADIUS + (i / steps) * 8;
            
            this.fillStyle('#00BFFF', alpha);
            this.fillCircle(0, 0, radius);
        }
    }drawSpeedIndicators() {
        // Draw speed lines to show acceleration
        // Use logarithmic scale for very high speeds to keep indicators manageable
        const displaySpeed = Math.log2(this.speedMultiplier); // 1x=0, 2x=1, 4x=2, 8x=3, etc.
        const speedLevel = Math.min(Math.floor(displaySpeed), 8); // Cap at 8 indicators (256x speed)
          for (let i = 0; i < speedLevel; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const distance = BALL_RADIUS + 10;
            const lineStartX = Math.cos(angle) * distance;
            const lineStartY = Math.sin(angle) * distance;
            const lineEndX = Math.cos(angle) * (distance + 6);
            const lineEndY = Math.sin(angle) * (distance + 6);
            
            this.lineStyle(2, '#00BFFF');
            this.lineBetween(lineStartX, lineStartY, lineEndX, lineEndY);
        }
        
        // Show speed multiplier text if significant
        if (this.speedMultiplier >= 2) {
            if (this.chargeText) {
                this.chargeText.destroy();
            }
            this.chargeText = this.scene.add.text(this.x, this.y, `${this.speedMultiplier.toFixed(0)}x`, {
                fontSize: '10px',
                fontFamily: 'Arial',
                color: '#00BFFF',
                stroke: '#000000',
                strokeThickness: 2,
                align: 'center'
            });
            this.chargeText.setOrigin(0.5, 0.5);
            this.chargeText.setDepth(1000);
        } else if (this.chargeText) {
            this.chargeText.destroy();
            this.chargeText = null;
        }
    }reset(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.powerupCharges = 0;
        this.speedMultiplier = 1; // Reset speed multiplier
        this.speedBoostTimer = 0; // Reset speed boost timer
        this.trail = [];
        if (this.chargeText) {
            this.chargeText.destroy();
            this.chargeText = null;
        }
        this.setVelocity(dx, dy);
        this.render();
    }    drawPowerupGlow() {
        // Create golden glow effect for powerup charges
        const glowRadius = BALL_RADIUS + 8;
        const steps = 8;
        
        for (let i = 0; i < steps; i++) {
            const alpha = 0.6 * (1 - i / steps);
            const radius = BALL_RADIUS + (i / steps) * 8;
            
            this.fillStyle('#FFD700', alpha);
            this.fillCircle(0, 0, radius);
        }
    }

    drawPowerupCharges() {        // Draw charge indicators
        for (let i = 0; i < this.powerupCharges && i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const distance = BALL_RADIUS + 12;
            const chargeX = Math.cos(angle) * distance;
            const chargeY = Math.sin(angle) * distance;
            
            this.fillStyle('#FFD700');
            this.lineStyle(1, '#FFA500');
            this.fillCircle(chargeX, chargeY, 3);
            this.strokeCircle(chargeX, chargeY, 3);
        }
        
        // If more than 5 charges, show number (but only when not showing speed)
        if (this.powerupCharges > 5 && this.speedMultiplier <= 1) {
            if (this.chargeText) {
                this.chargeText.destroy();
            }
            this.chargeText = this.scene.add.text(this.x, this.y, this.powerupCharges.toString(), {
                fontSize: '12px',
                fontFamily: 'Arial',
                color: '#FFD700',
                stroke: '#000000',
                strokeThickness: 2,
                align: 'center'
            });
            this.chargeText.setOrigin(0.5, 0.5);
            this.chargeText.setDepth(1000);
        } else if (this.chargeText && this.speedMultiplier <= 1) {
            this.chargeText.destroy();
            this.chargeText = null;
        }
    }    doubleSpeed() {
        // Progressive speed multiplication - double the current speed each time
        this.speedMultiplier *= 2;
        
        // Cap at reasonable maximum to prevent game breaking (256x should be enough!)
        const maxSpeed = 8;
        if (this.speedMultiplier > maxSpeed) {
            this.speedMultiplier = maxSpeed;
        }
        
        // Reset timer for 30 seconds each time
        this.speedBoostTimer = 30;
        
        // Update visual representation
        this.render();
        
        console.log(`Ball ${this.ballType} speed increased to ${this.speedMultiplier}x`);
    }

    getBounds() {
        return {
            left: this.x - BALL_RADIUS,
            right: this.x + BALL_RADIUS,
            top: this.y - BALL_RADIUS,
            bottom: this.y + BALL_RADIUS
        };
    }
}
