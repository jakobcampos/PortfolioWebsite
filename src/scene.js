// scene.js
import * as THREE from 'three';

THREE.ColorManagement.enabled = false;

export class SceneSetup {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.group = new THREE.Group();
        this.sectionMeshes = [];
        this.sizes = { width: window.innerWidth, height: window.innerHeight };
        this.cursor = { x: 0, y: 0 };
        this.scrollY = window.scrollY;
        this.currentSection = 0;
        this.clock = new THREE.Clock();
        this.previousTime = 0;
        this.objectsDistance = 15;
        this.animate = this.animate.bind(this);
        
        this._init();
    }

    _init() {
        this._createMaterials();
        this._createObjects();
        this._createCamera();
        this._createRenderer();
        this._setEventListeners();
    }

    _createMaterials() {
        this.materialSphere = new THREE.MeshBasicMaterial({ color: 0xff8647, wireframe: true });
        this.materialTorus = new THREE.MeshBasicMaterial({ color: 0x929292, wireframe: true });
        this.materialSmallCube = new THREE.MeshBasicMaterial({ color: 0xfffc41, wireframe: true });
    }

    _createObjects() {
        this.sphere = new THREE.Mesh(new THREE.OctahedronGeometry(.3, 5), this.materialSphere);
        this.smallCube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 1, 2, 2, 2), this.materialSmallCube);
        this.torus = new THREE.Mesh(new THREE.TorusGeometry(2, 0.4, 16, 60), this.materialTorus);
        
        // Sphere Position
        this.sphere.position.x = 1
        this.sphere.position.y = 1
        this.sphere.position.z = 3;

        // Small Cube Position
        this.smallCube.position.x = -4.2
        this.smallCube.position.y = -1
        this.smallCube.position.z = -3

        // Object Scroll Position
        this.torus.position.y = - this.objectsDistance * 0

        this.sectionMeshes = [this.sphere, this.smallCube, this.torus];
        this.group.add(this.sphere, this.smallCube, this.torus);
        this.scene.add(this.group);
    }

    _createCamera() {
        this.cameraGroup = new THREE.Group();
        this.camera = new THREE.PerspectiveCamera(60, this.sizes.width / this.sizes.height, .1, 100);
        this.camera.position.z = 6;
        this.cameraGroup.add(this.camera);
        this.scene.add(this.cameraGroup);
    }

    _createRenderer() {
        // Check for WebGL 2 compatibility and create a context if available
        this.context = this.canvas.getContext('webgl2');
        if (!this.context) {
            console.warn('WebGL 2 not available. Falling back on WebGL 1.');
            this.context = this.canvas.getContext('webgl');
        }
    
        if (!this.context) {
            alert('Unable to initialize WebGL. Your browser may not support it.');
            return;
        }
    
        // Create renderer with the WebGL context
        this.renderer = new THREE.WebGLRenderer({
            logarithmicDepthBuffer: true,
            canvas: this.canvas,
            context: this.context,
            alpha: true
        });
    
        this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    
    _setEventListeners() {
        window.addEventListener('resize', this._onWindowResize.bind(this));
        window.addEventListener('mousemove', this._onMouseMove.bind(this));
        window.addEventListener('scroll', this._onScroll.bind(this)); // Adding scroll event listener
    }
    
    _onScroll(event) {
        this.scrollY = window.scrollY;
    }

    _onWindowResize(event) {
        this.sizes.width = window.innerWidth;
        this.sizes.height = window.innerHeight;

        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    _onMouseMove(event) {
        this.cursor.x = event.clientX / this.sizes.width - 0.5;
        this.cursor.y = event.clientY / this.sizes.height - 0.5;
    }

    animate() {
        const elapsedTime = this.clock.getElapsedTime();
        const deltaTime = elapsedTime - this.previousTime;
        this.previousTime = elapsedTime;

        // Animate camera
        this.camera.position.y = - this.scrollY / this.sizes.height * this.objectsDistance

        const parallaxX = this.cursor.x * 0.5
        const parallaxY = - this.cursor.y * 0.5
        this.cameraGroup.position.x += (parallaxX - this.cameraGroup.position.x) * 5 * deltaTime
        this.cameraGroup.position.y += (parallaxY - this.cameraGroup.position.y) * 5 * deltaTime

        // Animate meshes
        for(const mesh of this.sectionMeshes)
        {
            mesh.rotation.x += deltaTime * 0.1
            mesh.rotation.y += deltaTime * 0.12
        }

        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.animate); // no need to bind here anymore
    }
}