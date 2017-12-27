let MainMenu = function(game:any){}

MainMenu.prototype = {

	create: function(){

	},

	startGame: function(){
		this.game.state.start("Game");
	}

}