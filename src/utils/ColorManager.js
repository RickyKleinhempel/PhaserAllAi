export class ColorManager {
    constructor(scene) {
        this.scene = scene;
        
        // Color state
        this.lightFieldColor = '#ffffff';
        this.darkFieldColor = '#000000';
        this.autoMode = false;
        this.animationTime = 0;
        this.animationMode = 0; // 0: Standard, 1: Wellen, 2: Puls, 3: Regenbogen, 4: Kontrast
        this.animationSpeed = 1.0;
        
        // Mode names
        this.modeNames = ['Standard', 'Wellen', 'Puls', 'Regenbogen', 'Kontrast'];
    }

    update(delta) {
        if (!this.autoMode) return;
        
        // Update animation time
        this.animationTime += (delta / 1000) * 60 * 0.8 * this.animationSpeed; // Convert to frame-based timing
        
        let lightHue, darkHue, lightSaturation, lightLightness, darkSaturation, darkLightness;
        
        switch (this.animationMode) {
            case 0: // Standard - smooth rotation
                lightHue = (this.animationTime * 0.5) % 360;
                darkHue = (lightHue + 180) % 360;
                lightSaturation = 80;
                lightLightness = 75;
                darkSaturation = 90;
                darkLightness = 25;
                break;
                
            case 1: // Wellen - oscillating saturation
                lightHue = (this.animationTime * 0.3) % 360;
                darkHue = (lightHue + 120) % 360;
                lightSaturation = 50 + Math.sin(this.animationTime * 0.1) * 40;
                lightLightness = 60 + Math.cos(this.animationTime * 0.15) * 20;
                darkSaturation = 70 + Math.cos(this.animationTime * 0.12) * 25;
                darkLightness = 30 + Math.sin(this.animationTime * 0.08) * 15;
                break;
                
            case 2: // Puls - rhythmic intensity
                const pulse = Math.sin(this.animationTime * 0.2);
                const fastPulse = Math.sin(this.animationTime * 0.8);
                lightHue = (this.animationTime * 0.4 + pulse * 30) % 360;
                darkHue = (lightHue + 90 + fastPulse * 60) % 360;
                lightSaturation = 60 + Math.abs(pulse) * 35;
                lightLightness = 50 + Math.abs(fastPulse) * 30;
                darkSaturation = 80 + Math.abs(pulse) * 20;
                darkLightness = 20 + Math.abs(fastPulse) * 25;
                break;
                
            case 3: // Regenbogen - fast color changes
                lightHue = (this.animationTime * 1.5) % 360;
                darkHue = (this.animationTime * 1.2 + 240) % 360;
                lightSaturation = 90 + Math.sin(this.animationTime * 0.3) * 10;
                lightLightness = 70 + Math.cos(this.animationTime * 0.4) * 15;
                darkSaturation = 95;
                darkLightness = 30 + Math.sin(this.animationTime * 0.25) * 10;
                break;
                
            case 4: // Kontrast - extreme contrasts
                const contrast = Math.sin(this.animationTime * 0.15);
                lightHue = contrast > 0 ? 45 + contrast * 60 : 200 + Math.abs(contrast) * 80;
                darkHue = contrast > 0 ? 220 + contrast * 40 : 20 + Math.abs(contrast) * 60;
                lightSaturation = 40 + Math.abs(contrast) * 55;
                lightLightness = 80 + contrast * 15;
                darkSaturation = 60 + Math.abs(contrast) * 35;
                darkLightness = 15 + Math.abs(contrast) * 20;
                break;
        }
        
        // Generate new colors
        this.lightFieldColor = this.hslToHex(lightHue, lightSaturation, lightLightness);
        this.darkFieldColor = this.hslToHex(darkHue, darkSaturation, darkLightness);
        
        // Update color pickers
        document.getElementById('lightColorPicker').value = this.lightFieldColor;
        document.getElementById('darkColorPicker').value = this.darkFieldColor;
    }

    setLightFieldColor(color) {
        this.lightFieldColor = color;
        this.autoMode = false;
    }

    setDarkFieldColor(color) {
        this.darkFieldColor = color;
        this.autoMode = false;
    }

    toggleAutoMode() {
        this.autoMode = !this.autoMode;
    }

    nextMode() {
        this.animationMode = (this.animationMode + 1) % this.modeNames.length;
        this.animationTime = 0; // Reset animation for immediate effect
    }

    getCurrentModeName() {
        return this.modeNames[this.animationMode];
    }    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
    }

    setLightColor(color) {
        this.lightFieldColor = color;
        this.autoMode = false;
    }

    setDarkColor(color) {
        this.darkFieldColor = color;
        this.autoMode = false;
    }

    setAutoColor(enabled) {
        this.autoMode = enabled;
    }

    setColorMode(modeName) {
        const index = this.modeNames.indexOf(modeName);
        if (index !== -1) {
            this.animationMode = index;
            this.animationTime = 0;
        }
    }

    hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
}
