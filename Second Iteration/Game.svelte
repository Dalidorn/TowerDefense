<script>
    import { onMount, onDestroy } from "svelte";
    import {
        player,
        platforms,
        gameState,
        movePlayer,
        addPlatform,
        calculatePlayerMovement,
        checkCollisions,
        keys,
    } from "./game.js";

    let canvas;
    let ctx;
    let animationFrameId;

    onMount(() => {
        ctx = canvas.getContext("2d");
        animationFrameId = requestAnimationFrame(frame);
        window.addEventListener("keydown", keydownHandler);
        window.addEventListener("keyup", keyupHandler);

        const vertices = generateBottomRectangleVertices(); // Generate rectangle vertices
        addPlatform(vertices); // Add the rectangle platform
    });

    onDestroy(() => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("keydown", keydownHandler);
        window.removeEventListener("keyup", keyupHandler);
    });

    function frame() {
        const { dx, dy } = calculatePlayerMovement();
        movePlayer(dx, dy);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();

        animationFrameId = requestAnimationFrame(frame);
    }

    function keydownHandler(e) {
        if (e.key == "w") keys.update((state) => ({ ...state, w: true }));
        if (e.key == "a") keys.update((state) => ({ ...state, a: true }));
        if (e.key == "s") keys.update((state) => ({ ...state, s: true }));
        if (e.key == "d") keys.update((state) => ({ ...state, d: true }));
    }

    function keyupHandler(e) {
        if (e.key == "w") keys.update((state) => ({ ...state, w: false }));
        if (e.key == "a") keys.update((state) => ({ ...state, a: false }));
        if (e.key == "s") keys.update((state) => ({ ...state, s: false }));
        if (e.key == "d") keys.update((state) => ({ ...state, d: false }));
    }

    function draw() {
        let playerState;
        player.subscribe((value) => {
            playerState = value;
        })();

        let platformsState;
        platforms.subscribe((value) => {
            platformsState = value;
        })();

        // Clear the canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the platforms
        platformsState.forEach((platform) => {
            ctx.fillStyle = "yellow";
            ctx.fillRect(
                platform.boundingBox.left,
                platform.boundingBox.top,
                platform.boundingBox.right - platform.boundingBox.left,
                platform.boundingBox.bottom - platform.boundingBox.top
            );
        });

        platformsState.forEach((platform) => {
            ctx.beginPath();
            ctx.moveTo(platform.vertices[0].x, platform.vertices[0].y);
            for (let i = 1; i < platform.vertices.length; i++) {
                ctx.lineTo(platform.vertices[i].x, platform.vertices[i].y);
            }
            ctx.closePath();
            ctx.fillStyle = "green";
            ctx.fill();
        });

        // Draw the player
        ctx.fillStyle = "blue";
        ctx.fillRect(
            playerState.x,
            playerState.y,
            playerState.width,
            playerState.height
        );
    }

    function generateBottomRectangleVertices() {
        const vertices = [
            { x: 0, y: canvas.height }, // Bottom-left corner
            { x: canvas.width, y: canvas.height }, // Bottom-right corner
            { x: canvas.width, y: canvas.height - 50 }, // Top-right corner
            { x: 0, y: canvas.height - 50 }, // Top-left corner
        ];

        return vertices;
    }

    function generateRandomPolygonVertices(numSides, size) {
        const vertices = [];
        const centerX = Math.random() * 800; // Random x-coordinate for the center of the polygon
        const centerY = Math.random() * 600; // Random y-coordinate for the center of the polygon

        const angleIncrement = (2 * Math.PI) / numSides; // Angle increment based on the number of sides

        for (let i = 0; i < numSides; i++) {
            const radius = Math.random() * (size / 2); // Random radius within half the size

            const angle = i * angleIncrement;
            const x = centerX + radius * Math.cos(angle); // Calculate x-coordinate based on angle and radius
            const y = centerY + radius * Math.sin(angle); // Calculate y-coordinate based on angle and radius

            vertices.push({ x, y });
        }

        return vertices;
    }
</script>

<canvas bind:this={canvas} width="800" height="600" />

<p>Use WASD keys to move the blue square.</p>

<button
    on:click={() => {
        if (Math.random() > 0.5) {
            const vertices = generateRandomPolygonVertices(4, 200); // generate 4-sided polygon (a rectangle)
            addPlatform(vertices);
        } else {
            const vertices = generateRandomPolygonVertices(3, 200); // generate 3-sided polygon (a triangle)
            addPlatform(vertices);
        }
    }}
>
    Add Random Poly Platform
</button>

<style>
    canvas {
        border: 3px solid gray;
    }
</style>
