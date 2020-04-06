'use strict';

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function moveCircles () {
    circles.forEach(function(circle) {
        circle.position.x += circle.velocity.x;
        circle.position.y += circle.velocity.y;
    });
}

function filterOutOfBoundsCircles(circles, topLeft, bottomRight) {
    return circles.filter(circle => !circle.isOutOfBounds(topLeft, bottomRight));
}

function collideWithCircles (circles) {
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (circles[i].intersects(circles[j])) {        //стремный момент
                circles[i].collide(circles[j]);
            }
        }
    }
}

function nextCircle(gameCycle, lastGeneratedTimestamp, circleGenerateThreshold) {
    if (gameCycle - lastGeneratedTimestamp > circleGenerateThreshold) {
        let radius = randomNumber(15, 50);
        return Circle(
            Vector(
                randomNumber(radius, bottomRight.x - radius),
                -100
            ),
            Vector(
                Math.random() - 0.5,
                0.5 + Math.random() * 2
            ),
            radius
        )
    }
}

function intersectsWithPlayer (circle, bottomRight) {
    return circle.position.y + circle.radius > bottomRight.y;
}

function filterCirclesCollidedWithPlayer (circles, bottomRight) {
    return circles.filter(circle => intersectsWithPlayer(circle, bottomRight));
}

function gameOver(interval) {
    clearInterval(interval);
    alert('GAME OVER');
}

function calculateDamage(circle) {
    return circle.mass * circle.velocity.length() ** 2;
}

let canvas = document.getElementById("tutorial");
let drawingContext = canvas.getContext("2d");

canvas.addEventListener('mousemove', function(e) {
    cursorposition = Vector(e.x, e.y);
    gunTo = cursorposition;
})

canvas.addEventListener('mousedown', function(e) {
    let speed = gunTo.distanceTo(gunFrom) / 150;
    let bulletRadius = 10;
    let bulletVelocity = cursorposition.minus(gunFrom).normalize().mul(speed);

    circles.push(
        Circle(Vector(gunFrom.x, gunFrom.y - bulletRadius), bulletVelocity, bulletRadius)
    )
})

let gameCycle = 0;
let circles = [];
let topLeft = Vector(0, 0);
let bottomRight = Vector(window.innerWidth, window.innerHeight);
let lastGeneratedTimestamp = 0;
let circleGenerateThreshold = 100;
let gunFrom = Vector(bottomRight.x / 2, bottomRight.y);
let cursorposition = Vector(0, 0);
let gunTo = cursorposition;
let hitPoints = 100;
let graphics = Graphics(drawingContext);


let interval = setInterval(function() {
    gameCycle++;

    circles = filterOutOfBoundsCircles(circles, topLeft.plus(Vector(0, -200)), bottomRight);

    let newCircle = nextCircle(gameCycle, lastGeneratedTimestamp, circleGenerateThreshold);

    if (newCircle) {
        circles.push(newCircle);
        lastGeneratedTimestamp = gameCycle;
    }

    moveCircles(circles);

    collideWithCircles(circles);

    let collidedCircles = filterCirclesCollidedWithPlayer(circles, bottomRight);

    collidedCircles.forEach(function(circle) {
        let damage = calculateDamage(circle);
        hitPoints -= damage;
        console.log(hitPoints, damage);
    })

    circles = circles.filter(x => !collidedCircles.includes(x));
    
    graphics.renderScene(circles, gunFrom, gunTo);

    if (hitPoints < 0 ) {
        gameOver(interval);
    }

}, 12);