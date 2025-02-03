class Player {
    constructor(x, y, width, height, gameEngine, sceneManager) {
        this.x = x;
        this.y = y;
        this.sprite = ASSET_MANAGER.getAsset("./assets/Handgun1.png");
        this.SCALE = 3;
        this.width = this.sprite.width * this.SCALE;
        this.height = this.sprite.height * this.SCALE;
        this.rotation = 0;
        this.speed = 5;
        this.boundingBox = new BoundingBox(this.x, this.y, this.width/2, this.height/2);
        this.gameEngine = gameEngine;
        this.sceneManager = sceneManager;
        
        // Replace ray with flashlight
        this.flashlight = new Flashlight(
            this.x + this.width/2, 
            this.y + this.height/2, 
            this.rotation
        );
    }

    update() {
        if (gameEngine.mouse) {
            const dx = gameEngine.mouse.x - (this.x + this.width/2);
            const dy = gameEngine.mouse.y - (this.y + this.height/2);
            this.rotation = Math.atan2(dy, dx);
        }

        // Handle X and Y movement separately
        let nextX = this.x;
        let nextY = this.y;

        // Handle horizontal movement first
        if (gameEngine.keys["a"] || gameEngine.keys["A"]) {
            nextX -= this.speed;
        }
        if (gameEngine.keys["d"] || gameEngine.keys["D"]) {
            nextX += this.speed;
        }

        // Check horizontal collision
        const horizontalBB = new BoundingBox(
            nextX + 40, 
            this.y + 40, 
            this.width/2, 
            this.height/2
        );

        let horizontalCollision = false;
        for (const wall of this.gameEngine.camera.walls) {
            if (horizontalBB.collide(wall.boundingBox)) {
                horizontalCollision = true;
                break;
            }
        }

        // Apply horizontal movement if no collision
        if (!horizontalCollision) {
            this.x = nextX;
        }

        // Handle vertical movement
        if (gameEngine.keys["w"] || gameEngine.keys["W"]) {
            nextY -= this.speed;
        }
        if (gameEngine.keys["s"] || gameEngine.keys["S"]) {
            nextY += this.speed;
        }

        // Check vertical collision
        const verticalBB = new BoundingBox(
            this.x + 40, 
            nextY + 40, 
            this.width/2, 
            this.height/2
        );

        let verticalCollision = false;
        for (const wall of this.gameEngine.camera.walls) {
            if (verticalBB.collide(wall.boundingBox)) {
                verticalCollision = true;
                break;
            }
        }

        // Apply vertical movement if no collision
        if (!verticalCollision) {
            this.y = nextY;
        }

        // Update the actual bounding box with final position
        this.boundingBox = new BoundingBox(this.x + 40, this.y + 40, this.width/2, this.height/2);

        // Update flashlight position and angle
        this.flashlight.update(
            this.x + this.width/2,
            this.y + this.height/2,
            this.rotation,
            this.gameEngine.camera.walls
        );
    }

    draw(ctx) {
        // Create a dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, params.canvasWidth, params.canvasHeight);
        
        // Draw flashlight (will cut through darkness)
        ctx.globalCompositeOperation = 'destination-out';
        this.flashlight.draw(ctx);
        ctx.globalCompositeOperation = 'source-over';

        // Draw player sprite and bounding box
        ctx.save();
        const centerX = this.x + (this.width / 2);
        const centerY = this.y + (this.height / 2);
        
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);
        ctx.drawImage(
            this.sprite,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        ctx.restore();

        if (params.debug) {
            ctx.strokeStyle = "red";
            ctx.strokeRect(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
        }
    }
}