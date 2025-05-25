import { FIELD_SIZE } from '../main.js';

export class FieldManager {
    constructor(scene) {
        this.scene = scene;
        this.animatedFields = [];
    }

    update(delta) {
        const adjustedDelta = delta / 16.67; // Normalize to 60fps equivalent
        
        for (let i = this.animatedFields.length - 1; i >= 0; i--) {
            const field = this.animatedFields[i];
            
            // Update animation
            field.currentFrame += adjustedDelta;
            const progress = field.currentFrame / field.duration;
            field.rotation = progress * field.maxRotation;
            
            // Remove animation when finished
            if (field.currentFrame >= field.duration) {
                this.animatedFields.splice(i, 1);
            }
        }
    }

    render(graphics) {
        for (const field of this.animatedFields) {
            const progress = field.currentFrame / field.duration;
            this.drawRotatingField(graphics, field, progress);
        }
    }

    drawRotatingField(graphics, field, progress) {
        const fieldX = field.x * FIELD_SIZE;
        const fieldY = field.y * FIELD_SIZE;
        const centerX = fieldX + FIELD_SIZE / 2;
        const centerY = fieldY + FIELD_SIZE / 2;
        
        // Vertical rotation around horizontal axis (X-axis)
        // Y-axis scaling for 3D flip effect from bottom to top
        const scaleY = Math.cos(progress * Math.PI);
        
        // Only draw when field is actually visible (not completely sideways)
        if (Math.abs(scaleY) > 0.02) {
            // During first half of animation show old color
            // During second half show new color
            let currentColor;
            if (progress < 0.5) {
                // First half: Old color (visible from bottom)
                currentColor = field.fromColor === 0 ? 
                    this.scene.colorManager.lightFieldColor : 
                    this.scene.colorManager.darkFieldColor;
            } else {
                // Second half: New color (visible from top)
                currentColor = field.toColor === 0 ? 
                    this.scene.colorManager.lightFieldColor : 
                    this.scene.colorManager.darkFieldColor;
            }
              // Apply Y-scaling for 3D effect
            const actualScaleY = Math.abs(scaleY);
            
            // Draw field with scaling effect
            graphics.fillStyle(Phaser.Display.Color.HexStringToColor(currentColor).color);
            graphics.fillRect(
                centerX - FIELD_SIZE / 2, 
                centerY - (FIELD_SIZE / 2) * actualScaleY, 
                FIELD_SIZE, 
                FIELD_SIZE * actualScaleY
            );
            
            // Additional visual effect: shadow/gradient for more 3D feel
            if (actualScaleY < 0.3) {
                graphics.fillStyle(0x000000, 0.2);
                graphics.fillRect(
                    centerX - FIELD_SIZE / 2, 
                    centerY - (FIELD_SIZE / 2) * actualScaleY, 
                    FIELD_SIZE, 
                    FIELD_SIZE * actualScaleY
                );
            }
        }
    }

    createAnimation(x, y, fromColor, toColor) {
        // Remove existing animation for this field
        this.animatedFields = this.animatedFields.filter(field => !(field.x === x && field.y === y));
        
        // Add new animation
        this.animatedFields.push({
            x: x,
            y: y,
            fromColor: fromColor,
            toColor: toColor,
            rotation: 0,
            maxRotation: Math.PI, // 180 degree rotation
            duration: 40, // 40 frames = 0.67 seconds at 60fps
            currentFrame: 0
        });
    }

    isFieldAnimated(x, y) {
        return this.animatedFields.some(field => field.x === x && field.y === y);
    }

    reset() {
        this.animatedFields = [];
    }
}
