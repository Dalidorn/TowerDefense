<script>
    import { onMount, afterUpdate } from "svelte";

    let canvas;
    let ctx;

    const tower = {
        x: 125,
        y: 100,
        size: 20,
        color: "green",
        attack: 10,
        attackSpeed: 1,
        attackRange: 150,
    };

    const source = {
        x: 100,
        y: 150,
        size: 20,
        color: "blue",
        health: 100,
    };

    const enemy = {
        x: 0,
        y: 0,
        size: 20,
        color: "red",
        speed: 1,
        health: 100,
        attack: 5,
        attackSpeed: 1,
        attackRange: 30,
        dead: true,
    };

    let play = false; // Flag to track if the game is currently playing

    let animationFrameId; // ID to track the animation frame
    let towerAttackIntervalId; // ID to track the tower attack interval

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
    }

    function toggleGame() {
        play = !play;

        if (play) {
            // Start the game
            if (!enemy.dead && source.health > 0) {
                // Only move the enemy if it's not dead and source is alive
                moveEnemy();
            }
            towerAttackIntervalId = setInterval(
                towerAttack,
                1000 / tower.attackSpeed
            );
            draw();
            animationFrameId = requestAnimationFrame(moveEnemy);
        } else {
            // Pause the game
            cancelAnimationFrame(animationFrameId);
            clearInterval(towerAttackIntervalId);
            draw();
        }
    }

    function resetEnemy() {
        if (enemy.dead && source.health > 0) {
            enemy.health = 100;
            enemy.x = 200;
            enemy.y = 150;
            enemy.dead = false;
            moveEnemy(); // Start the enemy movement loop
        }
    }

    onMount(() => {
        canvas = document.getElementById("gameCanvas");
        ctx = canvas.getContext("2d");
        draw();
    });

    afterUpdate(() => {
        draw();
    });
</script>

<canvas id="gameCanvas" width="400" height="300" />

{#if !enemy.dead}
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
