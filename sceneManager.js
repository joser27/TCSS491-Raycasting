class SceneManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.gameEngine.camera = this;
        this.x = 0;
    };


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

    };
};

