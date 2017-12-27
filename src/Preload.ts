let Preload = function(game:any){}

Preload.prototype = {

	preload: function(){ 
		this.game.load.image('dragon', 'img/dragon.png');
		this.game.load.image('kraken', 'img/kraken.png');
		this.game.load.image('godzilla', 'img/godzilla.png');
		this.game.load.image('alien', 'img/alien.png');
	},

	create: function(){
		this.game.state.start("Game");
	}
};