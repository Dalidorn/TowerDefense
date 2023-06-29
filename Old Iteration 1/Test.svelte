<script>
    import { onMount } from "svelte";

    let canvas;
    let ctx;

    // Define the squares as arrays of points
    const square1 = [
        { x: -150, y: -150 },
        { x: 150, y: -150 },
        { x: 150, y: 150 },
        { x: -150, y: 150 },
    ];

    const square2 = [
        { x: -100, y: -100 },
        { x: 100, y: -100 },
        { x: 100, y: 100 },
        { x: -100, y: 100 },
    ];

    let angle = 0;

    function drawSquare(square, angle, fillColor, outlineColor) {
        ctx.save();
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (const pt of square) {
            const rotatedPt = rotatePoint(pt, angle);
            ctx.lineTo(rotatedPt.x, rotatedPt.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    function rotatePoint(pt, angle) {
        const { x, y } = pt;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const rotatedX = x * cos - y * sin;
        const rotatedY = x * sin + y * cos;
        return { x: rotatedX, y: rotatedY };
    }

    function polyLine(vertices, x1, y1, x2, y2) {
        for (let i = 0; i < vertices.length; i++) {
            const current = vertices[i];
            const next = vertices[(i + 1) % vertices.length];
            if (
                lineLine(x1, y1, x2, y2, current.x, current.y, next.x, next.y)
            ) {
                return true;
            }
        }
        return false;
    }

    function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
        const uA =
            ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
            ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        const uB =
            ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
            ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
    }

    function polyPoly(p1, p2) {
        for (let i = 0; i < p1.length; i++) {
            const vertex = p1[i];
            if (polyPoint(p2, vertex.x, vertex.y)) {
                console.log("hit");
                return true;
            }
        }
        return false;
    }

    function polyPoint(vertices, px, py) {
        let collision = false;

        for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            const vi = vertices[i];
            const vj = vertices[j];

            if (
                vi.y > py !== vj.y > py &&
                px < ((vj.x - vi.x) * (py - vi.y)) / (vj.y - vi.y) + vi.x
            ) {
                collision = !collision;
            }
        }

        return collision;
    }

    function draw() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update rotation angle
        angle += 0.02;

        // Calculate the center of the canvas
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Draw the first square
        ctx.save();
        ctx.translate(centerX - 150, centerY);
        ctx.rotate(angle);
        drawSquare(square1, 0, "rgba(0, 150, 255, 0.6)", "black");
        ctx.restore();

        // Draw the second square
        ctx.save();
        ctx.translate(centerX + 150, centerY);
        ctx.rotate(angle);
        const hit = polyPoly(square1, square2);
        const fillColor = hit ? "black" : "blue";
        const outlineColor = hit ? "red" : "black";
        drawSquare(square2, angle, fillColor, outlineColor);
        ctx.restore();

        // Schedule the next frame
        requestAnimationFrame(draw);
    }

    // Start the animation loop
    onMount(() => {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        draw();
    });
</script>

<canvas id="canvas" width="800" height="600" />

<style>
    canvas {
        border: 1px solid black;
    }
</style>
