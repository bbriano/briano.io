<script lang="ts">
    import * as THREE from "three";
    import { onMount } from "svelte";

    let canvas: HTMLDivElement;
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.Renderer;
    let geometry: THREE.Geometry;
    let material: THREE.Material;
    let mesh: THREE.Mesh;

    onMount(() => {
        init();
        animate();
    });

    function init() {
        camera = new THREE.PerspectiveCamera(
            70,
            canvas.clientWidth / canvas.clientHeight,
            0.01,
            10
        );
        camera.position.z = 1;
        scene = new THREE.Scene();
        geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        material = new THREE.MeshNormalMaterial();
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        canvas.appendChild(renderer.domElement);

        window.addEventListener("resize", () => {
            camera.updateProjectionMatrix();
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;
        renderer.render(scene, camera);
    }
</script>

<div class="canvas" bind:this={canvas} />

<style>
    .canvas {
        width: 14rem;
        height: 14rem;
    }
</style>
