'use strict';

let canvas = document.getElementById("tutorial");
let ctx = canvas.getContext("2d");

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;


function drawCircle(circle) {
    ctx.beginPath();
    ctx.arc(circle.position.x, circle.position.y, circle.radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawVector(from, to) {
    ctx.beginPath();       // Начинает новый путь
    ctx.moveTo(from.x, from.y);    // Рередвигает перо в точку (30, 50)
    ctx.lineTo(to.x, to.y);  // Рисует линию до точки (150, 100)
    ctx.stroke();
}

function intersects(thisCircle, thatCircle) {
    return thisCircle.position.distanceTo(thatCircle.position) <
        thisCircle.radius + thatCircle.radius;
}

let circles = [
    Circle(Vector(100, 100), Vector(1,.6), 50),     //первое - это координаты (пиксели) центра окружности, второе - это скорость
    Circle(Vector(200, 100), Vector(-1,0.5), 10),
    Circle(Vector(300, 400), Vector(0.0,0.3), 40),
    Circle(Vector(400, 60), Vector(0.6,0.4), 40),
    Circle(Vector(500, 80), Vector(-0.2,0.5), 20),
    Circle(Vector(600, 100), Vector(-0.1,0.2), 10),
    Circle(Vector(700, 50), Vector(0.1,0.4), 15)
];

let topLeft = Vector(0,0);
let bottomRight = Vector(window.innerWidth, window.innerHeight);
let cursorposition = Vector(0,0);

let gunFrom = Vector(bottomRight.x / 2, bottomRight.y);
let gunTo = cursorposition;

canvas.addEventListener('mousemove', function(e) {
    cursorposition = Vector(e.x, e.y);
    gunTo = cursorposition;
})

canvas.addEventListener('mousedown', function(e) {
    let speed = gunTo.distanceTo(gunFrom) / 150;
    let bulletVelocity = cursorposition.minus(gunFrom).normalize().mul(speed);

    circles.push(
        Circle(Vector(e.x, e.y), bulletVelocity, 15)
    )
})

function moveCircles () {
    circles.forEach(function(circle) {
        circle.position.x += circle.velocity.x;
        circle.position.y += circle.velocity.y;
    });
}

function collideWithBounce (circles, topLeft, bottomRight) {
    circles.forEach(function(circle) {
        if (circle.position.x - circle.radius <= topLeft.x) {
            circle.velocity.x = -circle.velocity.x;
        }

        if (circle.position.y - circle.radius <= topLeft.y) {
            circle.velocity.y = -circle.velocity.y;
        }

        if (circle.position.x + circle.radius >= bottomRight.x) {
            circle.velocity.x = -circle.velocity.x;
        }

        if (circle.position.y + circle.radius >= bottomRight.y) {
            circle.velocity.y = -circle.velocity.y;
        }
    });
}

function collideWithCircles (circles) {
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (intersects(circles[i], circles[j])) {
                circles[i].collide(circles[j]);
            }
        }
    }
}

function renderScene (drawContext, circles, gunFrom, gunTo) {
    drawContext.canvas.width  = window.innerWidth;
    drawContext.canvas.height = window.innerHeight;

    for (let i = 0; i < circles.length; i++) {
        drawCircle(circles[i]);
    }

    drawVector(gunFrom, gunTo);
}

let interval = setInterval(function() {

    moveCircles(circles);

    collideWithBounce(circles, topLeft, bottomRight);

    collideWithCircles(circles);

    renderScene(ctx, circles, gunFrom, gunTo);

}, 5);