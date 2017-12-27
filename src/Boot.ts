
let Boot = function(game:any) {};
Boot.prototype = {
    preload: function() {
    },
    create: function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.state.start("Preload");
    }
};