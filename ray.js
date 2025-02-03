class Ray {
    constructor(x, y, angle, length = 1000) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.length = length;
        
        // Calculate end point
        this.endX = this.x + Math.cos(this.angle) * this.length;
        this.endY = this.y + Math.sin(this.angle) * this.length;
    }

    update(x, y, angle) {
        // Update ray position and angle
        this.x = x;
        this.y = y;
        this.angle = angle;
        
        // Recalculate end point
        this.endX = this.x + Math.cos(this.angle) * this.length;
        this.endY = this.y + Math.sin(this.angle) * this.length;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.endX, this.endY);
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    cast(walls) {
        let closestPoint = null;
        let closestDistance = this.length;

        walls.forEach(wall => {
            // Line segment intersection check
            const x1 = wall.x;
            const y1 = wall.y;
            const x2 = wall.x + wall.width;
            const y2 = wall.y + wall.height;

            // Check each wall edge
            const edges = [
                {x1, y1, x2: x2, y2: y1}, // Top edge
                {x1, y1, x2: x1, y2: y2}, // Left edge
                {x1: x2, y1, x2, y2: y2}, // Right edge
                {x1, y1: y2, x2, y2}      // Bottom edge
            ];

            edges.forEach(edge => {
                const intersection = this.getIntersection(edge);
                if (intersection) {
                    const distance = getDistance(
                        {x: this.x, y: this.y},
                        {x: intersection.x, y: intersection.y}
                    );
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestPoint = intersection;
                    }
                }
            });
        });

        if (closestPoint) {
            this.endX = closestPoint.x;
            this.endY = closestPoint.y;
        }
    }

    getIntersection(edge) {
        const x1 = this.x;
        const y1 = this.y;
        const x2 = this.endX;
        const y2 = this.endY;
        const x3 = edge.x1;
        const y3 = edge.y1;
        const x4 = edge.x2;
        const y4 = edge.y2;

        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den === 0) return null;

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

        if (t > 0 && t < 1 && u > 0 && u < 1) {
            return {
                x: x1 + t * (x2 - x1),
                y: y1 + t * (y2 - y1)
            };
        }
        return null;
    }
}

class Flashlight {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.rays = [];
        this.rayCount = 500;  // Number of rays to create cone effect
        this.spreadAngle = Math.PI / 4;  // 45 degree spread
        
        // Create rays
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = this.angle - (this.spreadAngle/2) + (this.spreadAngle * i / (this.rayCount - 1));
            this.rays.push(new Ray(x, y, rayAngle));
        }
    }

    update(x, y, angle, walls) {
        this.x = x;
        this.y = y;
        this.angle = angle;

        // Update all rays
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = this.angle - (this.spreadAngle/2) + (this.spreadAngle * i / (this.rayCount - 1));
            this.rays[i].update(x, y, rayAngle);
            if (walls) {
                this.rays[i].cast(walls);
            }
        }
    }

    draw(ctx) {
        // Create gradient for flashlight effect
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, 1000
        );
        gradient.addColorStop(0, 'rgba(255, 255, 200, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');

        // Draw the cone of light
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        
        // Draw path through all ray endpoints
        for (const ray of this.rays) {
            ctx.lineTo(ray.endX, ray.endY);
        }
        
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}