import { SceneSetup } from './scene.js';
import './ui.js';

document.addEventListener("DOMContentLoaded", (event) => {

    const canvas = document.querySelector('.webgl');

    if(canvas) {
        const sceneSetup = new SceneSetup(canvas);
        // Start Animation
        sceneSetup.animate();
    } else {
        console.error('Canvas element not found in the DOM.');
    }
});
