// Debug script to identify the ball disappearance issue
// This will add comprehensive logging to track ball states during explosions

console.log("=== BALL DISAPPEARANCE DEBUG SCRIPT LOADED ===");

// Add debug logging to track ball states
const originalBallUpdate = window.Ball?.prototype?.update;
if (originalBallUpdate) {
    window.Ball.prototype.update = function(delta) {
        const beforeX = this.x;
        const beforeY = this.y;
        const beforeVelX = this.body.velocity.x;
        const beforeVelY = this.body.velocity.y;
        
        // Call original update
        originalBallUpdate.call(this, delta);
        
        // Check for significant position/velocity changes
        const positionDelta = Math.sqrt((this.x - beforeX) ** 2 + (this.y - beforeY) ** 2);
        const velocityDelta = Math.sqrt((this.body.velocity.x - beforeVelX) ** 2 + (this.body.velocity.y - beforeVelY) ** 2);
        
        if (positionDelta > 50 || velocityDelta > 100) {
            console.warn(`[${this.ballType}] Large change detected:`, {
                positionDelta,
                velocityDelta,
                before: { x: beforeX, y: beforeY, vx: beforeVelX, vy: beforeVelY },
                after: { x: this.x, y: this.y, vx: this.body.velocity.x, vy: this.body.velocity.y }
            });
        }
    };
}

// Add debug to explosion trigger
const originalTriggerExplosion = window.PowerupManager?.prototype?.triggerExplosion;
if (originalTriggerExplosion) {
    window.PowerupManager.prototype.triggerExplosion = function(ball, fieldX, fieldY) {
        console.log(`[EXPLOSION] Triggered by ${ball.ballType} at field (${fieldX}, ${fieldY})`);
        
        // Log both ball positions before explosion
        const otherBall = ball.ballType === 'light' ? this.scene.darkBall : this.scene.lightBall;
        console.log(`[EXPLOSION] Ball positions - ${ball.ballType}: (${ball.x}, ${ball.y}), ${otherBall.ballType}: (${otherBall.x}, ${otherBall.y})`);
        
        // Calculate distance between explosion center and other ball
        const centerX = fieldX * window.FIELD_SIZE + window.FIELD_SIZE / 2;
        const centerY = fieldY * window.FIELD_SIZE + window.FIELD_SIZE / 2;
        const distance = Math.sqrt((otherBall.x - centerX) ** 2 + (otherBall.y - centerY) ** 2);
        const explosionRadius = 3 * window.FIELD_SIZE; // 3 fields
        
        console.log(`[EXPLOSION] Other ball distance from explosion center: ${distance}, explosion radius: ${explosionRadius}`);
        if (distance < explosionRadius) {
            console.warn(`[EXPLOSION] OTHER BALL IS WITHIN EXPLOSION RADIUS! This may cause the bug.`);
        }
        
        return originalTriggerExplosion.call(this, ball, fieldX, fieldY);
    };
}

// Add debug to collision detection
const originalCheckFieldCollision = window.GameScene?.prototype?.checkFieldCollision;
if (originalCheckFieldCollision) {
    window.GameScene.prototype.checkFieldCollision = function(ball) {
        const beforeX = ball.x;
        const beforeY = ball.y;
        const beforeVelX = ball.body.velocity.x;
        const beforeVelY = ball.body.velocity.y;
        
        const result = originalCheckFieldCollision.call(this, ball);
        
        if (result) {
            console.log(`[COLLISION] ${ball.ballType} collision detected at (${ball.x}, ${ball.y})`);
            
            // Check if velocity changed significantly
            const velChange = Math.sqrt((ball.body.velocity.x - beforeVelX) ** 2 + (ball.body.velocity.y - beforeVelY) ** 2);
            if (velChange > 50) {
                console.log(`[COLLISION] Velocity changed by ${velChange}`);
            }
        }
        
        return result;
    };
}

console.log("=== DEBUG SCRIPT SETUP COMPLETE ===");
