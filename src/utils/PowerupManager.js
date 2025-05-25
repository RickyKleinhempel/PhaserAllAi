import { FIELD_SIZE, FIELDS_X, FIELDS_Y, BALL_RADIUS } from '../main.js';

export class PowerupManager {
    constructor(scene) {
        this.scene = scene;
        this.powerups = [];
        this.spawnTimer = 0;
        this.spawnInterval = 300; // Every 5 seconds at 60 FPS
    }

    update(delta) {
        const adjustedDelta = delta / 16.67; // Normalize to 60fps equivalent
        this.spawnTimer += adjustedDelta;
        
        // Spawn new powerup
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnPowerup();
            this.spawnTimer = 0;
            // Random interval for next powerup (3-8 seconds)
            this.spawnInterval = 180 + Math.random() * 300;
        }
        
        // Update existing powerups
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            
            if (powerup.collected) {
                this.powerups.splice(i, 1);
                continue;
            }
            
            // Update pulse animation
            powerup.pulseCycle += 0.15 * adjustedDelta;
            const pulseScale = 1 + Math.sin(powerup.pulseCycle) * 0.3;
            powerup.size = 8 + pulseScale * 4;
            
            // Update sparkles
            this.updateSparkles(powerup, adjustedDelta);
        }
    }

    updateSparkles(powerup, adjustedDelta) {
        // Update existing sparkles
        for (let j = powerup.sparkles.length - 1; j >= 0; j--) {
            const sparkle = powerup.sparkles[j];
            
            sparkle.x += sparkle.vx * adjustedDelta;
            sparkle.y += sparkle.vy * adjustedDelta;
            sparkle.life -= adjustedDelta;
            
            if (sparkle.life <= 0) {
                powerup.sparkles.splice(j, 1);
            }
        }
        
        // Add new sparkles
        if (Math.random() < 0.1) {
            const angle = Math.random() * Math.PI * 2;
            const distance = powerup.size;
            
            powerup.sparkles.push({
                x: powerup.x + Math.cos(angle) * distance,
                y: powerup.y + Math.sin(angle) * distance,
                vx: Math.cos(angle) * (1 + Math.random()),
                vy: Math.sin(angle) * (1 + Math.random()),
                life: 20 + Math.random() * 15,
                maxLife: 20 + Math.random() * 15,
                size: 1 + Math.random() * 2
            });
        }
    }

    render(graphics) {
        for (const powerup of this.powerups) {
            if (powerup.collected) continue;
              // Draw outer glow
            const glowSteps = 8;
            for (let i = 0; i < glowSteps; i++) {
                const alpha = 0.8 * (1 - i / glowSteps);
                const radius = powerup.size * (1 + i * 0.25);
                graphics.fillStyle('#FFD700', alpha * 0.4);
                graphics.fillCircle(powerup.x, powerup.y, radius);
            }
            
            // Draw inner core
            graphics.fillStyle('#FFD700');
            graphics.lineStyle(2, '#FFA500');
            graphics.fillCircle(powerup.x, powerup.y, powerup.size);
            graphics.strokeCircle(powerup.x, powerup.y, powerup.size);
            
            // Draw star symbol
            this.drawStar(graphics, powerup.x, powerup.y, powerup.size * 0.6, 5);
            
            // Draw sparkles
            for (const sparkle of powerup.sparkles) {
                const alpha = sparkle.life / sparkle.maxLife;
                graphics.fillStyle('#FFD700', alpha);
                graphics.fillCircle(sparkle.x, sparkle.y, sparkle.size * alpha);
            }
        }
    }    drawStar(graphics, x, y, radius, points) {
        const angle = Math.PI / points;
        
        // Create path for star
        const path = [];        for (let i = 0; i < 2 * points; i++) {
            const r = (i % 2 === 0) ? radius : radius * 0.5;
            const a = i * angle;
            const px = x + Math.cos(a) * r;
            const py = y + Math.sin(a) * r;
            path.push([px, py]);
        }
        
        graphics.fillStyle('#FF6B00');
        graphics.lineStyle(1, '#FF4500');
        
        graphics.beginPath();
        graphics.moveTo(path[0][0], path[0][1]);
        for (let i = 1; i < path.length; i++) {
            graphics.lineTo(path[i][0], path[i][1]);
        }
        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();
    }

    spawnPowerup() {
        // Random position on the game field
        const x = Math.floor(Math.random() * FIELDS_X);
        const y = Math.floor(Math.random() * FIELDS_Y);
        
        // Only spawn if the field doesn't already have a powerup
        const existingPowerup = this.powerups.find(p => p.fieldX === x && p.fieldY === y);
        if (existingPowerup) return;
        
        const centerX = x * FIELD_SIZE + FIELD_SIZE / 2;
        const centerY = y * FIELD_SIZE + FIELD_SIZE / 2;
        
        const powerup = {
            x: centerX,
            y: centerY,
            fieldX: x,
            fieldY: y,
            size: 8,
            maxSize: 12,
            pulseCycle: 0,
            sparkles: [],
            collected: false
        };
        
        // Create initial sparkles around the new powerup
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const distance = 15 + Math.random() * 10;
            
            powerup.sparkles.push({
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                vx: Math.cos(angle) * 2,
                vy: Math.sin(angle) * 2,
                life: 30 + Math.random() * 20,
                maxLife: 30 + Math.random() * 20,
                size: 2 + Math.random() * 3
            });
        }
        
        this.powerups.push(powerup);
    }    checkCollisions(ball) {
        for (const powerup of this.powerups) {
            if (powerup.collected) continue;
            
            const dx = ball.x - powerup.x;
            const dy = ball.y - powerup.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < BALL_RADIUS + powerup.size) {
                // Powerup collected
                powerup.collected = true;
                
                // Add explosive charge AND speed boost
                ball.powerupCharges++;
                ball.doubleSpeed();
                
                // Collection effects
                this.scene.audioManager.playPowerupCollectSound();
                this.scene.particleManager.createPowerupCollectParticles(powerup.x, powerup.y);
                
                return true;
            }
        }
        return false;
    }

    triggerExplosion(ball, fieldX, fieldY) {
        const explosionRadius = 3; // Radius in fields
        const centerX = fieldX * FIELD_SIZE + FIELD_SIZE / 2;
        const centerY = fieldY * FIELD_SIZE + FIELD_SIZE / 2;
        
        // Explosion sound
        this.scene.audioManager.playExplosionSound();
        
        // Convert all fields in radius
        let convertedFields = 0;
        for (let dy = -explosionRadius; dy <= explosionRadius; dy++) {
            for (let dx = -explosionRadius; dx <= explosionRadius; dx++) {
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= explosionRadius) {
                    const targetX = fieldX + dx;
                    const targetY = fieldY + dy;
                    
                    if (targetX >= 0 && targetX < FIELDS_X && targetY >= 0 && targetY < FIELDS_Y) {
                        const currentField = this.scene.gameField[targetY][targetX];
                        const ballIsLight = ball.ballType === 'light';
                        
                        // Logic like normal field conversion
                        if ((ballIsLight && currentField === 0) || (!ballIsLight && currentField === 1)) {
                            const newFieldType = ballIsLight ? 1 : 0;
                            this.scene.gameField[targetY][targetX] = newFieldType;
                            
                            // Delayed animation for wave effect
                            const delay = distance * 5; // Delay based on distance
                            this.scene.time.delayedCall(delay * (16.67 / this.scene.gameSpeed), () => {
                                this.scene.fieldManager.createAnimation(targetX, targetY, currentField, newFieldType);
                            });
                            
                            convertedFields++;
                        }
                    }
                }
            }
        }
        
        // Massive explosion particles
        this.scene.particleManager.createExplosionParticles(centerX, centerY, ball.ballType === 'light');
        
        // Consume powerup charge
        ball.powerupCharges--;
        
        return convertedFields > 0;
    }

    reset() {
        this.powerups = [];
        this.spawnTimer = 0;
    }
}
