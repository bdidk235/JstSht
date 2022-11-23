const perfectFrameTime = 1000 / 60;
let deltaTime = 0;
let lastTimestamp = 0;

var width = window.innerWidth;
var height = window.innerHeight;

var cubeSize = 50;
var cubePos = [width / 2 - cubeSize / 2, height - cubeSize];
var gravity = 0;
var gravityMult = 1;
var move = 0;
var moveMult = 1;
var moving = false;
var onFloor = true;

function update(timestamp) {
    requestAnimationFrame(update);
    deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;

    const canvas = document.getElementById("main");
    width = window.innerWidth;
    height = window.innerHeight;

    cubePos[0] += move * moveMult * deltaTime;

    if (moving) {
        moveMult = Math.min(moveMult + 0.1 * deltaTime, 16);
    } else {
        move *= Math.min(deltaTime * 0.25, 1);
        moveMult *= Math.min(deltaTime * 0.25, 1);
    }

    cubePos[0] = Math.min(Math.max(cubePos[0], 0), width - cubeSize)

    onFloor = cubePos[1] >= height - cubeSize;

    if (!onFloor) {
        gravity -= gravityMult * deltaTime * 0.2;
        gravityMult = Math.min(gravityMult + 0.1 * deltaTime, 8)
    } else {
        gravity = 0;
        gravityMult = 1;
    }

    if (cubePos[1] > height - cubeSize) {
        cubePos[1] -= (cubePos[1] - (height - cubeSize)) * deltaTime / 6;
        if (cubePos[1] < (height - cubeSize) + 1) cubePos[1] = height - cubeSize;
    }

    cubePos[1] -= gravity * deltaTime;

    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(0, 0, width, height);

        ctx.translate(cubePos[0] + cubeSize / 2, cubePos[1] + cubeSize / 2);
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(-cubeSize / 2, -cubeSize / 2, cubeSize, cubeSize);
        ctx.fillStyle = "rgb(0, 255, 255)";
        ctx.fillRect(0, -cubeSize / 4, cubeSize / 2, cubeSize / 4);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}

window.onload = function () {
    requestAnimationFrame(update);

    document.onkeydown = function (event) {
        if (event.code === "Space") {
            if (onFloor) {
                cubePos[1] = height - cubeSize - 1;
                gravity += 9;
            }
        } else if (event.code === "KeyA") {
            moving = true;
            move = -1;
        } else if (event.code === "KeyD") {
            moving = true;
            move = 1;
        }
    };

    document.onkeyup = function (event) {
        if (event.code === "KeyA" || event.code === "KeyD") moving = false;
    };
}