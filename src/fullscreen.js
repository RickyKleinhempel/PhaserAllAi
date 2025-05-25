/**
 * Fullscreen functionality for the Dual Ball Breakout game
 */

class FullscreenManager {
    constructor() {
        this.isFullscreen = false;
        this.fullscreenBtn = null;
        this.gameContainer = null;
        this.originalParent = null;
        this.fullscreenContainer = null;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupFullscreen());
        } else {
            this.setupFullscreen();
        }
    }
    
    setupFullscreen() {
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.gameContainer = document.getElementById('game-container');
        
        if (!this.fullscreenBtn || !this.gameContainer) {
            console.warn('Fullscreen elements not found, retrying...');
            setTimeout(() => this.setupFullscreen(), 100);
            return;
        }
        
        // Store original parent
        this.originalParent = this.gameContainer.parentNode;
        
        // Add click event listener
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Listen for escape key to exit fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isFullscreen) {
                this.exitFullscreen();
            }
        });
        
        // Listen for browser fullscreen changes
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
    }
    
    toggleFullscreen() {
        if (this.isFullscreen) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }
    
    enterFullscreen() {
        try {
            // Create fullscreen container
            this.createFullscreenContainer();
            
            // Move all game elements to fullscreen container
            this.moveElementsToFullscreen();
            
            // Request browser fullscreen
            this.requestBrowserFullscreen();
            
            this.isFullscreen = true;
            this.updateButtonText();
            
            console.log('Entered fullscreen mode');
        } catch (error) {
            console.error('Error entering fullscreen:', error);
        }
    }
    
    exitFullscreen() {
        try {
            // Exit browser fullscreen
            this.exitBrowserFullscreen();
            
            // Move elements back to original positions
            this.moveElementsBackToOriginal();
            
            // Remove fullscreen container
            if (this.fullscreenContainer) {
                document.body.removeChild(this.fullscreenContainer);
                this.fullscreenContainer = null;
            }
            
            this.isFullscreen = false;
            this.updateButtonText();
            
            console.log('Exited fullscreen mode');
        } catch (error) {
            console.error('Error exiting fullscreen:', error);
        }
    }
    
    createFullscreenContainer() {
        this.fullscreenContainer = document.createElement('div');
        this.fullscreenContainer.className = 'fullscreen-container';
        this.fullscreenContainer.id = 'fullscreen-container';
        document.body.appendChild(this.fullscreenContainer);
    }
    
    moveElementsToFullscreen() {
        // Get all main elements
        const title = document.querySelector('h1');
        const controls = document.querySelector('.controls');
        const gameContainer = document.getElementById('game-container');
        const score = document.querySelector('.score');
        const speedControl = document.querySelector('.speed-control');
        const colorControls = document.querySelector('.color-controls');
        
        // Create clones of elements (to preserve event listeners)
        const elementsToMove = [title, controls, gameContainer, score, speedControl, colorControls];
        
        elementsToMove.forEach(element => {
            if (element) {
                // Store original parent for restoration
                element.setAttribute('data-original-parent', element.parentNode.tagName);
                this.fullscreenContainer.appendChild(element);
            }
        });
    }
    
    moveElementsBackToOriginal() {
        // Move elements back to body
        const elementsToMove = this.fullscreenContainer.children;
        const elementsArray = Array.from(elementsToMove); // Convert to array to avoid live collection issues
        
        elementsArray.forEach(element => {
            document.body.appendChild(element);
        });
    }
    
    requestBrowserFullscreen() {
        const element = this.fullscreenContainer;
        
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
    
    exitBrowserFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    
    handleFullscreenChange() {
        // Check if we're still in browser fullscreen
        const isInBrowserFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
        
        // If we exited browser fullscreen but are still in our fullscreen mode, exit completely
        if (!isInBrowserFullscreen && this.isFullscreen) {
            this.exitFullscreen();
        }
    }
    
    updateButtonText() {
        if (this.fullscreenBtn) {
            this.fullscreenBtn.textContent = this.isFullscreen ? 'Vollbild verlassen' : 'Vollbild';
        }
    }
}

// Initialize fullscreen manager
const fullscreenManager = new FullscreenManager();

export default fullscreenManager;
