class SceneManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.gameEngine.camera = this;
        this.x = 0;
        this.gameEngine.addEntity(this);
        this.init();
    };

    init() {
        this.player = new Player(200, 200, 32, 32, this.gameEngine, this);
        this.gameEngine.addEntity(this.player);

        this.wall = new Wall(5*params.CELL_SIZE, 5*params.CELL_SIZE, params.CELL_SIZE, params.CELL_SIZE);
        this.gameEngine.addEntity(this.wall);

        this.walls = [this.wall];
    }

    clearEntities() {
        this.gameEngine.entities.forEach(function (entity) {
            entity.removeFromWorld = true;
        });
    };


    updateAudio() {
        var mute = document.getElementById("mute").checked;
        var volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);

    };

    update() {

        
    };

    draw(ctx) {
        this.drawGrid(ctx);
    };

    drawGrid(ctx) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;

        // Vertical lines
        for (let i = 0; i <= params.canvasWidth; i += params.CELL_SIZE) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, params.canvasHeight);
            ctx.stroke();
        }

        // Horizontal lines
        for (let i = 0; i <= params.canvasHeight; i += params.CELL_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(params.canvasWidth, i);
            ctx.stroke();
        }
    }
};

