class Scene {
    DISTANCE_CAMERA_CURSOR = 80;
    DISTANCE_CAMERA_CUBES = 100;

    constructor(verticalFOV) {
        {
            this.verticalFOV = verticalFOV;
            this.scene = new THREE.Scene();
            const [w, h] = [window.innerWidth, window.innerHeight];
            this.camera = new THREE.PerspectiveCamera(verticalFOV, w / h);
            this.renderer = new THREE.WebGLRenderer();
            this.cubes = [];
            this.mouse = new Mouse();
        }

        // Attach to renderer to dom
        document.querySelector(".cube").appendChild(this.renderer.domElement);

        // Re-render canvas on window resize event
        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Create cube, and add it to scene
        const N = 50;
        const spacing = 10;
        const geometry = this.cubeGeometry().scale(4, 4, 4);
        const material = new THREE.LineBasicMaterial({ color: 0x6611ff });
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                const cube = new THREE.Line(geometry, material);
                cube.position.x = (i - (N - 1) / 2) * spacing;
                cube.position.y = (j - (N - 1) / 2) * spacing;
                cube.position.z = -this.DISTANCE_CAMERA_CUBES;
                this.cubes.push(cube);
                this.scene.add(cube);
            }
        }

        this.camera.position.set(0, 0, 0);
        this.camera.lookAt(0, 0, 0);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.cubes.forEach((cube) => {
            this.scene.add(cube);
        });

        this.animationLoop();
    }

    animationLoop = () => {
        requestAnimationFrame(() => this.animationLoop());
        this.rotateCubes();
        // this.stepCubes();
        this.renderer.render(this.scene, this.camera);
    };

    cubeGeometry = () => {
        const points = [
            new THREE.Vector3(-1, -1, -1),
            new THREE.Vector3(-1, 1, -1),
            new THREE.Vector3(1, 1, -1),
            new THREE.Vector3(1, -1, -1),
            new THREE.Vector3(-1, -1, -1),

            new THREE.Vector3(-1, -1, 1),
            new THREE.Vector3(-1, 1, 1),
            new THREE.Vector3(1, 1, 1),
            new THREE.Vector3(1, -1, 1),
            new THREE.Vector3(-1, -1, 1),

            new THREE.Vector3(-1, 1, 1),
            new THREE.Vector3(-1, 1, -1),
            new THREE.Vector3(1, 1, -1),
            new THREE.Vector3(1, 1, 1),
            new THREE.Vector3(1, -1, 1),
            new THREE.Vector3(1, -1, -1),
        ];

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.scale(0.5, 0.5, 0.5);

        return geometry;
    };

    // rotate this.cubes
    rotateCubes = () => {
        for (const cube of this.cubes) {
            cube.rotation.x += 0.003;
            cube.rotation.y += 0.005;
        }
    };

    // stepCubes = () => {
    //     // mouse X to cursor X
    //     const k = this.DISTANCE_CAMERA_CUBES / this.DISTANCE_CAMERA_CURSOR;
    //     const [w, h] = [window.innerWidth, window.innerHeight];
    //     const [x, y] = [
    //         (this.mouse.position.x - w / 2) * k,
    //         (this.mouse.position.y - h / 2) * -k,
    //     ];

    //     const cursorPos = new THREE.Vector3(x, y, this.DISTANCE_CAMERA_CURSOR);
    //     for (const cube of this.cubes) {
    //         // cube.lookAt(cursorPos);
    //         // console.log(cube.position);
    //         cube.lookAt(new THREE.Vector3(50, 50, -50));
    //     }
    // };
}

// Represents and tracks the mouse's physical properties
class Mouse {
    constructor(x, y) {
        // Pixels from top-left of window
        this.position = new THREE.Vector2(0, 0);

        window.addEventListener("mousemove", this.onMouseMove);
    }

    onMouseMove = (e) => {
        this.position.x = e.x;
        this.position.y = e.y;
    };
}

new Scene(60);
