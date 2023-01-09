const perfectFrameTime = 1000 / 60;
let deltaTime = 0;
let lastTimestamp = 0;

var width = window.innerWidth;
var height = window.innerHeight;

// This is less likely to break
var cubeSize = 50;
var maxJumps = 2;
var maxSpeed = 12;
var friction = 8;
var infJumps = false;

// Game Stuff, Changing it may break it
var cubePos = [width / 2 - cubeSize / 2, height / 2 - cubeSize];
var gravity = 0;
var gravityMult = 1;
var move = 0;
var moveMult = 1;
var rightness = 0;
var left = false;
var right = false;
var wasRight = true;
var onFloor = false;
var jumps = maxJumps;

function lerp(start, end, amt) {
	return (1 - amt) * start + amt * end
}

function stableTime() {
	return Math.max(deltaTime, 0)
}

function movement() {
	// Movement
    cubePos[0] += move * moveMult * stableTime();

    if (left || right) {
		wasRight = right;
        moveMult = lerp(moveMult, maxSpeed, stableTime() / maxSpeed);
    } else {
        moveMult = lerp(moveMult, 0, stableTime() / 8);
    }

	abus = wasRight ? 0 : 1;
	rightness = lerp(rightness, abus, Math.max(stableTime() / 4, 1));

    cubePos[0] = Math.min(Math.max(cubePos[0], 0), width - cubeSize);

	if (cubePos[0] < 0 || cubePos[0] > width - cubeSize)
		moveMult = 0;

    onFloor = cubePos[1] >= height - cubeSize;

	// Gravity
    if (!onFloor) {
        gravity -= gravityMult * stableTime() * 0.2;
        gravityMult = lerp(gravityMult, 4, stableTime() / Math.max(moveMult, 0.1) / 32);
    } else {
		jumps = maxJumps;
        gravity = 0;
        gravityMult = 1;
    }

    if (cubePos[1] > height - cubeSize) {
        cubePos[1] -= (cubePos[1] - (height - cubeSize)) * stableTime() / 6;
        if (cubePos[1] < (height - cubeSize) + 1) cubePos[1] = height - cubeSize;
    }

    cubePos[1] -= gravity * stableTime();

	console.log(cubePos);
}

function update(timestamp) {
    requestAnimationFrame(update);
    deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;

    const canvas = document.getElementById("main");
    width = window.innerWidth;
    height = window.innerHeight;

    movement();

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
		ctx.fillRect(lerp(0, -cubeSize / 2, rightness), -cubeSize / 4, lerp(cubeSize / 2, cubeSize / 2, rightness), cubeSize / 4);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}

window.onload = function () {
    requestAnimationFrame(update);

    document.onkeydown = function (event) {
        if (event.code === "Space") {
            if (jumps > 0) {
				jumps -= 1;
				if (jumps < 1 && maxJumps > 1)
					moveMult *= 3;
					if (infJumps)
						jumps = maxJumps;
				if (onFloor)
					cubePos[1] = height - cubeSize - 1;
                gravity = 9;
            }
        }
		if (event.code === "KeyA") {
			left = true;
			move = -1;
        }
		if (event.code === "KeyD") {
			right = true;
			move = 1;
        }
    };

    document.onkeyup = function (event) {
        if (event.code === "KeyA") {
			left = false;
			if (right)
				move = 1;
		}
		if (event.code === "KeyD") {
			right = false;
			if (left)
				move = -1;
		}
    };
}