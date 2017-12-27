"use strict";
var MainMenu = function (game) { };
MainMenu.prototype = {
    create: function () {
    },
    startGame: function () {
        this.game.state.start("Game");
    }
};
