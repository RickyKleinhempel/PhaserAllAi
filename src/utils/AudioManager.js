export class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.audioContext = null;
        this.isInitialized = false;
        this.setupAudioButton();
    }

    setupAudioButton() {
        const audioBtn = document.getElementById('audioBtn');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                this.initAudio();
            });
        }
    }

    async initAudio() {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            this.isInitialized = true;
            
            // Update button appearance
            const audioBtn = document.getElementById('audioBtn');
            if (audioBtn) {
                audioBtn.textContent = '🔊 Audio aktiv';
                audioBtn.classList.add('enabled');
                audioBtn.disabled = true;
            }
            
            console.log('Audio successfully initialized');
        } catch (error) {
            console.error('Failed to initialize audio:', error);
        }
    }

    init() {
        // Legacy method - now handled by button
        if (!this.audioContext) {
            // Don't auto-initialize - wait for user gesture
            console.log('Audio initialization waiting for user interaction');
        }
    }    playConversionSound(isLightBall) {
        // Use global audio context if available
        const context = window.getAudioContext && window.getAudioContext();
        if (!context) return;
        
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        // Different tones for light and dark balls
        if (isLightBall) {
            oscillator.frequency.setValueAtTime(800, context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, context.currentTime + 0.1);
        } else {
            oscillator.frequency.setValueAtTime(400, context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, context.currentTime + 0.1);
        }
        
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(context.currentTime + 0.1);
    }    playPowerupCollectSound() {
        const context = window.getAudioContext && window.getAudioContext();
        if (!context) return;
        
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        // Ascending tone for powerup
        oscillator.frequency.setValueAtTime(600, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, context.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.4, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(context.currentTime + 0.2);
    }    playExplosionSound() {
        const context = window.getAudioContext && window.getAudioContext();
        if (!context) return;
        
        // Bass explosion sound
        const oscillator1 = context.createOscillator();
        const oscillator2 = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(context.destination);
        
        // Deep rumble tone
        oscillator1.frequency.setValueAtTime(80, context.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(20, context.currentTime + 0.5);
        oscillator1.type = 'sawtooth';
        
        // Higher crack
        oscillator2.frequency.setValueAtTime(300, context.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(50, context.currentTime + 0.3);
        oscillator2.type = 'square';
        
        gainNode.gain.setValueAtTime(0.8, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
        
        oscillator1.start();
        oscillator2.start();
        oscillator1.stop(context.currentTime + 0.5);
        oscillator2.stop(context.currentTime + 0.3);
    }
}
