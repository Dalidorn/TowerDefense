import { writable, get } from 'svelte/store';
import { Polygon } from "./polygon.js";

export const player = writable({ x: 0, y: 0, width: 50, height: 50 });
export const platforms = writable([]);
export const gameState = writable('idle'); // 'idle', 'running', 'gameover'
export const keys = writable({ w: false, a: false, s: false, d: false });
export const onGround = writable()
let velocityY = 0;
let jumpForce = -2;
let gravity = 0.8;

export function startGameLoop() {
    let previousTimestamp;

    function gameLoop(timestamp) {
        if (previousTimestamp) {
            const deltaTime = timestamp - previousTimestamp;

            const { dx, dy } = calculatePlayerMovement(deltaTime);
            movePlayer(dx, dy);
        }

        previousTimestamp = timestamp;
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

export function calculatePlayerMovement(deltaTime) {
    let keyState = get(keys);
    let onGroundState = get(onGround);

    let dx = 0, dy = 0;

    if (keyState.a) dx -= 5;
    if (keyState.d) dx += 5;

    if (keyState.w && onGroundState) {
        velocityY = jumpForce;
        onGround.set(false);
    }

    if (onGroundState && !keyState.w) {
        velocityY = 0;
    } else {
        // Apply gravity
        velocityY += gravity * (deltaTime / 1000);
        dy += velocityY;
    }

    return { dx, dy };
}

export function movePlayer(dx, dy) {
    if (!checkCollisions(dx, 0)) {
        player.update(state => {
            state.x += dx;
            return state;
        });
    }
    if (!checkCollisions(0, dy)) {
        player.update(state => {
            state.y += dy;
            return state;
        });
    }
}


export function addPlatform(vertices) {
    platforms.update(state => {
        let platform = new Polygon(vertices);
        state.push(platform);
        return state;
    });
}



export function checkCollisions(dx, dy) {
    let playerState;
    player.subscribe(value => { playerState = value; })();

    let platformsState;
    platforms.subscribe(value => { platformsState = value; })();

    const playerRect = {
        x: playerState.x + dx,
        y: playerState.y + dy,
        width: playerState.width,
        height: playerState.height
    };

    for (let platform of platformsState) {
        if (platform.polyRect(playerRect.x, playerRect.y, playerRect.width, playerRect.height)) {
            return true;
        }
    }
    return false;
}



