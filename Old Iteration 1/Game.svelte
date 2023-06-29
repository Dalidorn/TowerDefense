<script>
    import { onMount, afterUpdate } from "svelte";
    import Platform from "./Platform.js";
    import Player from "./Player.js";

    let canvas;
    let ctx;
    let platform;
    let player;

    const tower = {
        x: 125,
        y: 100,
        size: 20,
        color: "green",
        attack: 10,
        attackSpeed: 1,
        attackRange: 100,
    };

    const source = {
        x: 100,
        y: 150,
        size: 20,
        color: "blue",
        health: 100,
    };

    const enemy = {
        x: 1000,
        y: 0,
        size: 20,
        color: "red",
        speed: 1,
        health: 50,
        attack: 5,
        attackSpeed: 1,
        attackRange: 30,
        dead: true,
    };

    let play = false; // Flag to track if the game is currently playing

    let animationFrameId; // ID to track the animation frame
    let towerAttackIntervalId = null; // ID to track the tower attack interval

    const gravity = 0.3; // Gravity value
    let playerVelocityY = 0; // Vertical velocity of the player

    function drawPlayer() {
        ctx.fillStyle = "purple";
        ctx.fillRect(player.x, player.y, player.size, player.size);
    }

    function applyGravity() {
        let onGround = false; // Flag to track if the player is on the ground

        // Check collision between player and platform
        if (
            platform &&
            player.y + player.size >= platform.y &&
            player.y + player.size <= platform.y + platform.height &&
            player.x + player.size >= platform.x &&
            player.x <= platform.x + platform.width
        ) {
            onGround = true;
        }

        if (!onGround && player.y < canvas.height - player.size) {
            // If the player is not on the ground, apply gravity
            playerVelocityY += gravity;
            player.y += playerVelocityY;
        } else {
            // Player is on the ground or platform, reset the vertical velocity
            player.y = Math.min(player.y, canvas.height - player.size);
            playerVelocityY = 0;
        }
    }

    function drawTower() {
        ctx.fillStyle = tower.color;
        ctx.fillRect(tower.x, tower.y, tower.size, tower.size);
    }

    function drawSource() {
        ctx.fillStyle = source.color;
        ctx.fillRect(source.x, source.y, source.size, source.size);
    }

    function drawEnemy() {
        if (!enemy.dead) {
            ctx.fillStyle = enemy.color;
            ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
        }
    }

    function drawPlatform() {
        if (platform) {
            ctx.fillStyle = "brown";
            ctx.fillRect(
                platform.x,
                platform.y,
                platform.width,
                platform.height
            );
        }
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function moveEnemy() {
        if (!play || enemy.dead || source.health <= 0) {
            // Game is paused, enemy is dead, or source is dead, stop moving
            return;
        }

        const dx = source.x - enemy.x;
        const dy = source.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > enemy.attackRange) {
            tower;
            const vx = (dx / distance) * enemy.speed;
            const vy = (dy / distance) * enemy.speed;

            enemy.x += vx;
            enemy.y += vy;

            draw();
            animationFrameId = requestAnimationFrame(moveEnemy);
        } else {
            enemyAttack();
        }
    }

    function enemyAttack() {
        if (!play || enemy.dead || source.health <= 0) {
            // Game is paused, enemy is dead, or source is dead, stop attacking
            return;
        }

        source.health -= enemy.attack;
        console.log(
            "Enemy is attacking the source! Source health:",
            source.health
        );

        if (source.health <= 0) {
            console.log("Source destroyed!");
            return;
        }

        setTimeout(enemyAttack, 1000 / enemy.attackSpeed); // Attack speed delay
    }

    function towerAttack() {
        if (!play || enemy.dead || source.health <= 0) {
            // Game is paused, enemy is dead, or source is dead, stop attacking
            return;
        }

        enemy.health -= tower.attack;
        console.log(
            "Tower is attacking the enemy! Enemy health:",
            enemy.health
        );

        if (enemy.health <= 0) {
            console.log("Enemy defeated!");
            enemy.dead = true;
        }
    }

    function draw() {
        clearCanvas();
        drawTower();
        drawSource();
        drawEnemy();
        drawPlatform();
        drawPlayer();
        updatePlayerPosition();
    }

    function toggleGame() {
        play = !play;

        if (play) {
            // Start the game
            if (!enemy.dead && source.health > 0) {
                // Only move the enemy if it's not dead and source is alive
                moveEnemy();
            }

            if (!towerAttackIntervalId) {
                // Start the tower attack interval if it's not already running
                towerAttackIntervalId = setInterval(
                    towerAttack,
                    1000 / tower.attackSpeed
                );
            }

            draw();
            animationFrameId = requestAnimationFrame(frame);
        } else {
            // Pause the game
            cancelAnimationFrame(animationFrameId);

            if (towerAttackIntervalId) {
                // Clear the tower attack interval if it's running
                clearInterval(towerAttackIntervalId);
                towerAttackIntervalId = null;
            }

            draw();
        }
    }

    function frame() {
        if (play) {
            applyGravity(); // Apply gravity on each frame update
            draw(); // Draw the game elements
            animationFrameId = requestAnimationFrame(frame); // Schedule the next frame
        }
    }

    function resetEnemy() {
        if (enemy.dead && source.health > 0) {
            enemy.health = 100;
            enemy.x = 1000;
            enemy.y = 150;
            enemy.dead = false;
            moveEnemy(); // Start the enemy movement loop
        }
    }

    onMount(() => {
        canvas = document.getElementById("gameCanvas");
        ctx = canvas.getContext("2d");
        platform = new Platform(0, 300, 800, 20);
        player = new Player(300, 150, 30);
        draw();
    });

    afterUpdate(() => {
        draw();
    });

    // Add key code constants for movement
    const KEY_LEFT = 37;
    const KEY_UP = 38;
    const KEY_RIGHT = 39;
    const KEY_DOWN = 40;
    const KEY_A = 65;
    const KEY_W = 87;
    const KEY_D = 68;
    const KEY_S = 83;

    // Initialize the player's movement state
    const movement = {
        left: false,
        up: false,
        right: false,
        down: false,
    };

    // Update the player's movement state based on key events
    function handleKeyDown(event) {
        if (event.keyCode === KEY_LEFT || event.keyCode === KEY_A) {
            movement.left = true;
        } else if (event.keyCode === KEY_UP || event.keyCode === KEY_W) {
            movement.up = true;
        } else if (event.keyCode === KEY_RIGHT || event.keyCode === KEY_D) {
            movement.right = true;
        } else if (event.keyCode === KEY_DOWN || event.keyCode === KEY_S) {
            movement.down = true;
        }
    }

    function handleKeyUp(event) {
        if (event.keyCode === KEY_LEFT || event.keyCode === KEY_A) {
            movement.left = false;
        } else if (event.keyCode === KEY_UP || event.keyCode === KEY_W) {
            movement.up = false;
        } else if (event.keyCode === KEY_RIGHT || event.keyCode === KEY_D) {
            movement.right = false;
        } else if (event.keyCode === KEY_DOWN || event.keyCode === KEY_S) {
            movement.down = false;
        }
    }

    function updatePlayerPosition() {
        const speed = 5; // Player movement speed

        if (movement.left && player.x > 0) {
            player.x -= speed;
        }

        if (movement.up && player.y > 0) {
            player.y -= speed * 2;
        }

        if (movement.right && player.x + player.size < canvas.width) {
            player.x += speed;
        }

        if (movement.down && player.y + player.size < canvas.height) {
            player.y += speed;
        }
    }

    // Attach event listeners for key events
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
</script>

<canvas id="gameCanvas" width="800" height="600" />

{#if play}
    <button on:click={toggleGame}>Pause</button>
{:else}
    <button on:click={toggleGame}>Play</button>
{/if}

<button on:click={resetEnemy} disabled={!play || !enemy.dead}
    >Respawn Enemy</button
>

<style>
    canvas {
        border: 1px solid #000;
    }
</style>
