import { SceneSetup } from './scene.js';
import 'fullpage.js/dist/fullpage.min.css';
import fullpage from 'fullpage.js';

document.addEventListener("DOMContentLoaded", (event) => {

    const canvas = document.querySelector('.webgl');

    if(canvas) {
        const sceneSetup = new SceneSetup(canvas);
        // Start Animation
        sceneSetup.animate();
    } else {
        console.error('Canvas element not found in the DOM.');
    }

    // Initialize fullPage.js within the DOMContentLoaded event
    new fullpage('#fullpage', {
        licenseKey: 'SKLSJ-R0546-FHB77-L182H-AQWSO',
        anchors:['firstPage', 'secondPage'],
        sectionSelector: '.section',
        autoScrolling: true,
        navigation: true,
        controlArrows: true, // arrows disabled
        continuousVertical: true,
    });
    
});
