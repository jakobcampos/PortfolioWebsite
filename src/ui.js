if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.body.style.overflowY = 'hidden';
let enableCustomScroll = false;

window.onload = function() {

    //window.scrollTo(0, 0); // Ensure scroll is at top on reload
    window.scrollTo(0, 0);
    console.log("Initial Y:", window.scrollY); // Add this line
    document.body.style.overflowY = 'visible';
    setTimeout(() => {
        enableCustomScroll = true;
    }, 300); // A delay to ensure onload logic completion

    let isScrolling = false;
    const sections = document.querySelectorAll('section');

    // Log section heights for verification:
    sections.forEach((sec, idx) => {
        console.log(`Section ${idx} height: ${sec.offsetHeight}px`);
    });

    let currentSectionIndex = 0;
    let lastScrollTime = 0;

    function getScrollDuration(start, end) {
        const distance = Math.abs(start - end);
        const durationPerPx = 1; // Adjust to your needs
        return distance * durationPerPx;
    }
    
    function smoothScrollToElement(element) {
        isScrolling = true;
        const startY = window.scrollY;
        const endY = element.getBoundingClientRect().top + window.scrollY;
        const duration = getScrollDuration(startY, endY);
    
        let startTime = null;
    
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startY, endY - startY, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
            else isScrolling = false; // End scroll
        }
    
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        console.log("Start Y:", startY, "End Y:", endY, "Duration:", duration);

        requestAnimationFrame(animation); 
    }
    
    
    

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

    window.addEventListener('wheel', function(e) {
        if (!enableCustomScroll) return;
        const now = new Date().getTime();

        // Ignore scroll if it’s been less than 500ms since the last one
        if (now - lastScrollTime < 500 || isScrolling) {
            return;
        }

        lastScrollTime = now;

        if (e.deltaY > 0) {
            currentSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
        } else {
            currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
        }
        console.log("Current Section Index:", currentSectionIndex); // Add this line
        smoothScrollToElement(sections[currentSectionIndex]);
    });

    const hiddenElements = document.querySelectorAll('.hidden');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    
    hiddenElements.forEach((element) => {
        observer.observe(element);
    });

};
