function Vector(x, y) {
    return {
        x, y,

        distanceTo(vector) {
            return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2);
        },

        minus(vector) {
            return Vector(this.x - vector.x, this.y - vector.y);
        },

        plus(vector) {
            return Vector(this.x + vector.x, this.y + vector.y);
        },

        length() {
            return this.distanceTo(Vector(0, 0))
        },

        normalize() {
            return Vector(this.x / this.length(), this.y / this.length());
        },

        dot(vector) {
            return this.x * vector.x + this.y * vector.y;
        },

        mul(c) {
            return Vector(this.x * c, this.y * c)
        }
    };
}

function Circle(position, velocity, radius) {
    return {
        position, velocity, radius,
        mass: radius / 10,

        collide(circle) {
            this.position.minus(this.velocity);
            circle.position.minus(circle.velocity);

            let axisVector = this.position.minus(circle.position).normalize();      //высчитываем новую ось
            let v1x1 = this.velocity.dot(axisVector);       //высчитывание проекции скоростей на новые оси до столкновения
            let v1x2 = circle.velocity.dot(axisVector);     //высчитывание проекции скоростей на новые оси до столкновения

            let v2x1 = ((this.mass  - circle.mass) * v1x1 + 2 * circle.mass * v1x2) / (this.mass + circle.mass);    //высчитывание проекции скоростей на новые оси после столкновения
            let v2x2 = ((circle.mass - this.mass) * v1x2 + 2 * this.mass * v1x1) / (this.mass + circle.mass);       //высчитывание проекции скоростей на новые оси после столкновения

            this.velocity = this.velocity.plus(axisVector.mul(v2x1 - v1x1));            //перевод на нашу первую ось   
            circle.velocity = circle.velocity.plus(axisVector.mul(v2x2 - v1x2));        //перевод на нашу первую ось
        },

        intersects(circle) {
            return this.position.distanceTo(circle.position) < 
                this.radius + circle.radius;
        },

        isOutOfBounds (topLeft, bottomRight) {
            if (this.position.x + this.radius < topLeft.x)
                return true;

            if (this.position.x - this.radius > bottomRight.x)
                return true;

            if (this.position.y + this.radius < topLeft.y)
                return true;

            if (this.position.y - this.radius > bottomRight.y)
                return true;
        }
    };
}