import { FIELD_SIZE } from '../main.js';

export class ParticleManager {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
    }

    update(delta) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Move particle
            const adjustedDelta = delta / 16.67; // Normalize to 60fps equivalent
            particle.x += particle.vx * adjustedDelta;
            particle.y += particle.vy * adjustedDelta;
            particle.life -= adjustedDelta;
            
            // Apply velocity decay
            particle.vx *= particle.decay;
            particle.vy *= particle.decay;
            
            // Remove expired particles
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
        }
    }

    render(graphics) {
        for (const particle of this.particles) {
            const progress = 1 - (particle.life / particle.maxLife);
            const alpha = Math.max(0, 1 - progress * 0.7);
            
            // Calculate particle color based on type
            let color;
            if (particle.isGolden) {
                // Golden powerup particles
                const r = Math.floor(255 - progress * 100);
                const g = Math.floor(215 - progress * 50);
                const b = Math.floor(0 + progress * 100);
                color = Phaser.Display.Color.GetColor(r, g, b);            } else if (particle.isSpark) {
                // Spark particles
                if (particle.fromColor === 'white') {
                    const intensity = Math.floor(255 * (1 - progress * 0.5));
                    color = Phaser.Display.Color.GetColor(intensity, intensity, intensity);
                } else {
                    // Use direct hex color
                    color = particle.toColor;
                }
            } else {
                // Normal conversion particles
                const fromColorHex = particle.fromColor === 0 ? 
                    this.scene.colorManager.lightFieldColor : 
                    this.scene.colorManager.darkFieldColor;
                const toColorHex = particle.toColor === 0 ? 
                    this.scene.colorManager.lightFieldColor : 
                    this.scene.colorManager.darkFieldColor;
                
                // Helper function to convert hex to RGB
                const hexToRgb = (hex) => {
                    const r = parseInt(hex.slice(1, 3), 16);
                    const g = parseInt(hex.slice(3, 5), 16);
                    const b = parseInt(hex.slice(5, 7), 16);
                    return { r, g, b };
                };
                
                const fromColor = hexToRgb(fromColorHex);
                const toColor = hexToRgb(toColorHex);
                
                // Interpolate between colors
                const r = Math.floor(fromColor.r + (toColor.r - fromColor.r) * progress);
                const g = Math.floor(fromColor.g + (toColor.g - fromColor.g) * progress);
                const b = Math.floor(fromColor.b + (toColor.b - fromColor.b) * progress);
                
                color = Phaser.Display.Color.GetColor(r, g, b);
            }
            
            // Calculate current size
            let currentSize;
            if (progress < 0.3) {
                // First 30%: particle grows
                currentSize = particle.initialSize * (1 + progress * 0.8);
            } else {
                // Remaining 70%: particle shrinks
                const shrinkProgress = (progress - 0.3) / 0.7;
                currentSize = particle.initialSize * (1.24 - shrinkProgress * 0.9);
            }
            
            // Draw particle
            graphics.fillStyle(color, alpha);
            graphics.fillCircle(particle.x, particle.y, currentSize * alpha);
            
            // Additional glow effect for first 50% of life
            if (progress < 0.5) {
                graphics.fillStyle(color, alpha * 0.3);
                graphics.fillCircle(particle.x, particle.y, currentSize * 2);
            }
        }
    }

    createConversionParticles(x, y, fromColor, toColor) {
        const centerX = x * FIELD_SIZE + FIELD_SIZE / 2;
        const centerY = y * FIELD_SIZE + FIELD_SIZE / 2;
        
        // 12 particles per conversion
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const speed = 1.5 + Math.random() * 4;
            const maxLife = 60 + Math.random() * 40;
            
            this.particles.push({
                x: centerX + (Math.random() - 0.5) * 8,
                y: centerY + (Math.random() - 0.5) * 8,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: maxLife,
                maxLife: maxLife,
                fromColor: fromColor,
                toColor: toColor,
                size: 3 + Math.random() * 4,
                initialSize: 3 + Math.random() * 4,
                decay: 0.97 + Math.random() * 0.02
            });
        }
    }

    createPowerupCollectParticles(x, y) {
        for (let i = 0; i < 15; i++) {
            const angle = (i / 15) * Math.PI * 2;
            const speed = 3 + Math.random() * 5;
            const maxLife = 40 + Math.random() * 30;
            
            this.particles.push({
                x: x + (Math.random() - 0.5) * 10,
                y: y + (Math.random() - 0.5) * 10,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: maxLife,
                maxLife: maxLife,
                fromColor: 'gold',
                toColor: 'orange',
                size: 4 + Math.random() * 3,
                initialSize: 4 + Math.random() * 3,
                decay: 0.95 + Math.random() * 0.03,
                isGolden: true
            });
        }
    }

    createExplosionParticles(x, y, isLightBall) {
        // Many particles for dramatic effect
        for (let i = 0; i < 50; i++) {
            const angle = (i / 50) * Math.PI * 2 + Math.random() * 0.5;
            const speed = 8 + Math.random() * 12;
            const maxLife = 80 + Math.random() * 60;
            
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: maxLife,
                maxLife: maxLife,
                fromColor: isLightBall ? 0 : 1,
                toColor: isLightBall ? 1 : 0,
                size: 6 + Math.random() * 8,
                initialSize: 6 + Math.random() * 8,
                decay: 0.92 + Math.random() * 0.05,
                isExplosion: true
            });
        }
        
        // Additional sparks
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 15 + Math.random() * 10;
            const maxLife = 60 + Math.random() * 40;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: maxLife,
                maxLife: maxLife,
                fromColor: 'white',
                toColor: isLightBall ? 'yellow' : 'purple',
                size: 3 + Math.random() * 4,
                initialSize: 3 + Math.random() * 4,
                decay: 0.90 + Math.random() * 0.05,
                isSpark: true
            });
        }
    }

    reset() {
        this.particles = [];
    }
}
