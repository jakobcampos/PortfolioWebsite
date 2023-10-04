//script.js
import * as THREE from 'three'
import $ from 'jquery';

THREE.ColorManagement.enabled = false;

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

const materialSphere = new THREE.MeshBasicMaterial({
    color: 0xff8647,
    wireframe: true
})

const materialTorus = new THREE.MeshBasicMaterial({
    color: 0x929292,
    wireframe: true
})

const materialSmallCube = new THREE.MeshBasicMaterial({
    color: 0xfffc41,
    wireframe: true
})

const group = new THREE.Group()
scene.add(group)

// Objects
const objectsDistance = 15

const sphere = new THREE.Mesh(
    new THREE.OctahedronGeometry(.3, 5),
    materialSphere
)
const smallCube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 1, 2, 2, 2),
    materialSmallCube
)
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(2, 0.4, 16, 60),
    materialTorus
)

// Title Objects
group.add(sphere)
group.add(smallCube)
group.add(torus)

// Sphere Position
sphere.position.x = 1
sphere.position.y = 1
sphere.position.z = 3;

// Small Cube Position
smallCube.position.x = -4.2
smallCube.position.y = -1
smallCube.position.z = -3

// Object Scroll Position
torus.position.y = - objectsDistance * 0
const sectionMeshes = [ sphere, smallCube, torus ]

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, .1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    logarithmicDepthBuffer: true,
    canvas: canvas,
    alpha: true
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    if(newSection != currentSection)
    {
        currentSection = newSection
    }
})

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
}, { threshold: 0.2 });

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));


/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// Scrolling 
$(function() {
    
    // Navbar & Sandwich functionality
    document.querySelector('.menuicon a').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('sidenav').classList.toggle('show');
        document.getElementById('overlay').classList.toggle('show');
    });

    $("#sidenav a").on("click", function (e) {
        e.preventDefault();
        const target = $(this).attr('href');
        smoothScroll(target, 1500);
    });

    // Scrolling functionality
    let isScrolling = false;
    let currentSectionIndex = 0;
    const sections = ['section', '#aboutme', '#projects', '#contact'];
    let lastScrollTime = 0;
    let allowScroll = true;

    function smoothScroll(target) {
        if(isScrolling) return;
        
        isScrolling = true;
        $('html, body').stop().animate({ scrollTop: $(target).offset().top }, 1000, function() {
            console.log("Scroll completed to:", target);
            isScrolling = false;
            lastScrollTime = new Date().getTime();
        });
    }

    function scrollToSection() {
        const target = sections[currentSectionIndex];
        smoothScroll(target);
    }

    window.addEventListener('wheel', function (event) {
        event.preventDefault();

        if (!allowScroll) return;

        const now = new Date().getTime();
        
        // If it's been less than 1100ms since the last scroll, do nothing
        if (now - lastScrollTime < 300) {
            return;
        }
        
        lastScrollTime = now;
        
        if(isScrolling) return;
        
        if (event.deltaY > 0) {
            currentSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
        } else if (event.deltaY < 0) {
            currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
        }

        scrollToSection();

        allowScroll = false;
        setTimeout(() => {
            allowScroll = true;
        }, 600);

    }, { passive: false });
});
