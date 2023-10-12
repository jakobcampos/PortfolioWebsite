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
        autoScrolling: true,
        navigation: true,
        controlArrows: true, // arrows disabled
        continuousVertical: true,
        // loopTop: true,
        // loopBottom: true,
    // other options...
    onLeave: function(origin, destination, direction) {
        // Remove the 'show-section' class from the section we are leaving
        // to reset its state for the next time it comes into view.
        origin.item.classList.remove('show-section');

        // If the target section is 'about-me-section' or 'projects-section',
        // add the 'show-section' class to make it visible with a transition.
        if (['about-me-section', 'projects-section', 'contact-me-section'].includes(destination.item.id)) {
            destination.item.classList.add('show-section');
        }
    },
    afterLoad: function(origin, destination, direction) {
        // Removing 'show-section' class from the sections that were not targeted,
        // to reset their state for the next time they come into view.
        
        // If the arrived section is NOT 'about-me-section', hide the 'about-me-section'.
        if (destination.item.id !== 'about-me-section') {
            document.getElementById('about-me-section').classList.remove('show-section');
        }
        
        // If the arrived section is NOT 'projects-section', hide the 'projects-section'.
        if (destination.item.id !== 'projects-section') {
            document.getElementById('projects-section').classList.remove('show-section');
        }

        // If the arrived section is NOT 'projects-section', hide the 'projects-section'.
        if (destination.item.id !== 'contact-me-section') {
            document.getElementById('contact-me-section').classList.remove('show-section');
        }
    }
    });

    // Sandwhich UI 
    document.querySelector('.menuicon a').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('sidenav').classList.toggle('show');
        document.getElementById('overlay').classList.toggle('show');
    });

    document.querySelectorAll("#sidenav a").forEach(a => {
        a.addEventListener("click", function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScrollToElement(document.querySelector(target));
        });
    });

    document.querySelectorAll('.fp-custom-arrow.left').forEach(a => {
        a.addEventListener("click", function (e) {
            e.preventDefault();
            // Move to the previous section or slide
            fullpage_api.moveSlideLeft(); // or fullpage_api.moveSlideLeft();
        });
    });

    // Attach event listener for the "right" button
    document.querySelectorAll('.fp-custom-arrow.right').forEach(a => {
        a.addEventListener("click", function (e) {
            e.preventDefault();
            // Move to the next section or slide
            fullpage_api.moveSlideRight(); // or fullpage_api.moveSlideRight();
        });
    });
    
});