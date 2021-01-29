const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer();

function main() {
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const cubes = cubeGrid();

    function animate() {
        requestAnimationFrame(animate);

        rotateCubes(cubes);

        renderer.render(scene, camera);
    }
    animate();
}

function cubeGrid(N = 11, size = 2, spacing = 10) {
    cubes = [];

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

    points.forEach((point) => {
        point.multiplyScalar(size);
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const cube = new THREE.Line(geometry, material);
            cube.position.x = (i - (N - 1) / 2) * spacing;
            cube.position.y = (j - (N - 1) / 2) * spacing;
            scene.add(cube);
            cubes.push(cube);
        }
    }
    return cubes;
}

function rotateCubes(cubes) {
    for (const cube of cubes) {
        cube.rotation.x += 0.003;
        cube.rotation.y += 0.005;
    }
}

window.onload = main;
