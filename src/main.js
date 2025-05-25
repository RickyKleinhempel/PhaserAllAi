import Phaser from 'phaser';
import GameScene from './scenes/GameScene.js';

// Game constants
export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 1024;
export const FIELD_SIZE = 32;
export const FIELDS_X = 32;
export const FIELDS_Y = 32;
export const BALL_RADIUS = 6;
export const BALL_SPEED = 2;

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#ddd',
    physics: {
        default: 'arcade',
        arcade: {
            enableBody: true,
            debug: false
        }
    },
    scene: [GameScene]
};

// Initialize the game
const game = new Phaser.Game(config);

// Export for global access
window.game = game;

// Global test function for browser console
window.testGame = function() {
    const scene = game.scene.getScene('GameScene');
    if (scene) {
        scene.runDiagnostics();
        return scene;
    } else {
        console.error('GameScene not found');
        return null;
    }
};

// Global function to start/stop game for testing
window.toggleGame = function() {
    const scene = game.scene.getScene('GameScene');
    if (scene) {
        if (scene.gameRunning) {
            scene.pauseGame();
            console.log('Game paused');
        } else {
            scene.startGame();
            console.log('Game started');
        }
    }
};
