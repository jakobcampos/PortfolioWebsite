//script.js
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

THREE.ColorManagement.enabled = false

/**
 * Debug
 */

// const gui = new dat.GUI()
//
//  const parameters = {
//      materialColor: '#ffeded'
//  }
//
//  gui
//      .addColor(parameters, 'materialColor')
//      .onChange(() =>
//      {
//          material.color.set(parameters.materialColor)
//          particlesMaterial.color.set(parameters.materialColor)
//     })
//
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/5.jpg')
//gradientTexture.magFilter = THREE.NearestFilter

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

const materialOctahedron = new THREE.MeshBasicMaterial({
    color: 0xb18cfe,
    wireframe: true
})

const materialCylinder = new THREE.MeshBasicMaterial({
    color: 0x74a7fe,
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
const octahedron = new THREE.Mesh(
    new THREE.OctahedronGeometry(1.5, 2),
    materialOctahedron
)
const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(1.25, 1.25, 3, 8, 1),
    materialCylinder
)

// Title Objects
group.add(sphere)
group.add(smallCube)
group.add(torus)

// My Project Object
group.add(octahedron)

// Contact Me Object
group.add(cylinder)

// Sphere Position
sphere.position.x = 1
sphere.position.y = 1
sphere.position.z = 3;

// Small Cube Position
smallCube.position.x = -4.2
smallCube.position.y = -1
smallCube.position.z = -3

// Octahedron Position
octahedron.position.x = - 3

// Cylinder Position
cylinder.position.x = 3

// Object Scroll Position
torus.position.y = - objectsDistance * 0
octahedron.position.y = - objectsDistance * 1
cylinder.position.y = - objectsDistance * 2

//scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [ sphere, smallCube, torus, octahedron, cylinder ]

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

// NAVBAR SANDWHICH STUFF

document.querySelector('.menu a').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('sidenav').classList.toggle('show');
    document.getElementById('overlay').classList.toggle('show');
});


$(document).ready(function() {
    // Smooth scroll to section when navigation link is clicked
    $("#sidenav a").on("click", function(event) {
        if (this.hash !== "") {
            event.preventDefault();

            const hash = this.hash;

            $("html, body").animate(
                {
                    scrollTop: $(hash).offset().top
                },
                800
            );
        }
    });
});
