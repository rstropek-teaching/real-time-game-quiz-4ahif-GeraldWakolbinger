"use strict";
var Game = function (game) {
};
Game.prototype = {
    create: function () {
        var me = this;
        me.game.physics.startSystem(Phaser.Physics.ARCADE);
        me.game.stage.backgroundColor = "34495f";
        me.tileTypes = ['dragon', 'kraken', 'godzilla', 'alien'];
        me.score = 0;
        me.activeTile1 = null;
        me.activeTile1 = null;
        me.canMove = false;
        me.tileWidth = me.game.cache.getImage('dragon').width;
        me.tileHeight = me.game.cache.getImage('dragon').height;
        me.tiles = me.game.add.group();
        me.tileGrid = [
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null]
        ];
        var seed = Date.now();
        me.random = new Phaser.RandomDataGenerator([seed]);
        me.initTiles();
    },
    update: function () {
        var me = this;
        if (me.activeTile1 && !me.activeTile2) {
            var hoverX = me.game.input.x;
            var hoverY = me.game.input.y;
            var hoverPosX = Math.floor(hoverX / me.tileWidth);
            var hoverPosY = Math.floor(hoverY / me.tileHeight);
            var difX = (hoverPosX - me.startPosX);
            var difY = (hoverPosY - me.startPosY);
            console.log(Math.abs(difX) + " " + Math.abs(difY));
            if (!(hoverPosY > me.tileGrid[0].length - 1 || hoverPosY < 0) && !(hoverPosX > me.tileGrid.length - 1 || hoverPosX < 0)) {
                if ((Math.abs(difY) == 1 && difX == 0) || (Math.abs(difX) == 1 && difY == 0)) {
                    console.log("Tileswap coming in!");
                    me.canMove = false;
                    me.activeTile2 = me.tileGrid[hoverPosX][hoverPosY];
                    me.swapTiles();
                    me.game.time.events.add(500, function () {
                        me.checkMatch();
                    });
                }
            }
        }
    },
    gameOver: function () {
        this.game.state.start('GameOver');
    },
    initTiles: function () {
        var me = this;
        for (var i = 0; i < me.tileGrid.length; i++) {
            for (var j = 0; j < me.tileGrid.length; j++) {
                var tile = me.addTile(i, j);
                me.tileGrid[i][j] = tile;
            }
        }
        me.game.time.events.add(600, function () {
            me.checkMatch();
        });
    },
    addTile: function (x, y) {
        var me = this;
        var tileToAdd = me.tileTypes[me.random.integerInRange(0, me.tileTypes.length - 1)];
        var tile = me.tiles.create((x * me.tileWidth) + me.tileWidth / 2, 0, tileToAdd);
        me.game.add.tween(tile).to({ y: y * me.tileHeight + (me.tileHeight / 2) }, 500, Phaser.Easing.Linear.In, true);
        tile.anchor.setTo(0.5, 0.5);
        tile.inputEnabled = true;
        tile.tileType = tileToAdd;
        tile.events.onInputDown.add(me.tileDown, me);
        return tile;
    },
    tileDown: function (tile) {
        var me = this;
        console.log("TileDown!");
        if (me.canMove) {
            console.log("Tile ready to move out!");
            me.activeTile1 = tile;
            me.startPosX = (tile.x - me.tileWidth / 2) / me.tileWidth;
            me.startPosY = (tile.y - me.tileHeight / 2) / me.tileHeight;
            console.log(me.startPosX);
            console.log(me.startPosY);
        }
    },
    swapTiles: function () {
        var me = this;
        if (me.activeTile1 && me.activeTile2) {
            var tile1Pos = { x: (me.activeTile1.x - me.tileWidth / 2) / me.tileWidth, y: (me.activeTile1.y - me.tileHeight / 2) / me.tileHeight };
            var tile2Pos = { x: (me.activeTile2.x - me.tileWidth / 2) / me.tileWidth, y: (me.activeTile2.y - me.tileHeight / 2) / me.tileHeight };
            me.tileGrid[tile1Pos.x][tile1Pos.y] = me.activeTile2;
            me.tileGrid[tile2Pos.x][tile2Pos.y] = me.activeTile1;
            me.game.add.tween(me.activeTile1).to({ x: tile2Pos.x * me.tileWidth + (me.tileWidth / 2), y: tile2Pos.y * me.tileHeight + (me.tileHeight / 2) }, 200, Phaser.Easing.Linear.In, true);
            me.game.add.tween(me.activeTile2).to({ x: tile1Pos.x * me.tileWidth + (me.tileWidth / 2), y: tile1Pos.y * me.tileHeight + (me.tileHeight / 2) }, 200, Phaser.Easing.Linear.In, true);
            me.activeTile1 = me.tileGrid[tile1Pos.x][tile1Pos.y];
            me.activeTile2 = me.tileGrid[tile2Pos.x][tile2Pos.y];
        }
    },
    checkMatch: function () {
        var me = this;
        var matches = me.getMatches(me.tileGrid);
        if (matches.length > 0) {
            me.removeTileGroup(matches);
            me.resetTile();
            me.fillTile();
            me.game.time.events.add(500, function () {
                me.tileUp();
            });
            me.game.time.events.add(600, function () {
                me.checkMatch();
            });
        }
        else {
            me.swapTiles();
            me.game.time.events.add(500, function () {
                me.tileUp();
                me.canMove = true;
            });
        }
    },
    tileUp: function () {
        var me = this;
        me.activeTile1 = null;
        me.activeTile2 = null;
    },
    getMatches: function (tileGrid) {
        var matches = [];
        var groups = [];
        for (var i = 0; i < tileGrid.length; i++) {
            var tempArr = tileGrid[i];
            groups = [];
            for (var j = 0; j < tempArr.length; j++) {
                if (j < tempArr.length - 2)
                    if (tileGrid[i][j] && tileGrid[i][j + 1] && tileGrid[i][j + 2]) {
                        if (tileGrid[i][j].tileType == tileGrid[i][j + 1].tileType && tileGrid[i][j + 1].tileType == tileGrid[i][j + 2].tileType) {
                            if (groups.length > 0) {
                                if (groups.indexOf(tileGrid[i][j]) == -1) {
                                    matches.push(groups);
                                    groups = [];
                                }
                            }
                            if (groups.indexOf(tileGrid[i][j]) == -1) {
                                groups.push(tileGrid[i][j]);
                            }
                            if (groups.indexOf(tileGrid[i][j + 1]) == -1) {
                                groups.push(tileGrid[i][j + 1]);
                            }
                            if (groups.indexOf(tileGrid[i][j + 2]) == -1) {
                                groups.push(tileGrid[i][j + 2]);
                            }
                        }
                    }
            }
            if (groups.length > 0)
                matches.push(groups);
        }
        for (var j = 0; j < tileGrid.length; j++) {
            var tempArr = tileGrid[j];
            groups = [];
            for (var i = 0; i < tempArr.length; i++) {
                if (i < tempArr.length - 2)
                    if (tileGrid[i][j] && tileGrid[i + 1][j] && tileGrid[i + 2][j]) {
                        if (tileGrid[i][j].tileType == tileGrid[i + 1][j].tileType && tileGrid[i + 1][j].tileType == tileGrid[i + 2][j].tileType) {
                            if (groups.length > 0) {
                                if (groups.indexOf(tileGrid[i][j]) == -1) {
                                    matches.push(groups);
                                    groups = [];
                                }
                            }
                            if (groups.indexOf(tileGrid[i][j]) == -1) {
                                groups.push(tileGrid[i][j]);
                            }
                            if (groups.indexOf(tileGrid[i + 1][j]) == -1) {
                                groups.push(tileGrid[i + 1][j]);
                            }
                            if (groups.indexOf(tileGrid[i + 2][j]) == -1) {
                                groups.push(tileGrid[i + 2][j]);
                            }
                        }
                    }
            }
            if (groups.length > 0)
                matches.push(groups);
        }
        return matches;
    },
    removeTileGroup: function (matches) {
        var me = this;
        for (var i = 0; i < matches.length; i++) {
            var tempArr = matches[i];
            for (var j = 0; j < tempArr.length; j++) {
                var tile = tempArr[j];
                var tilePos = me.getTilePos(me.tileGrid, tile);
                me.tiles.remove(tile);
                if (tilePos.x != -1 && tilePos.y != -1) {
                    me.tileGrid[tilePos.x][tilePos.y] = null;
                }
            }
        }
    },
    getTilePos: function (tileGrid, tile) {
        var pos = { x: -1, y: -1 };
        for (var i = 0; i < tileGrid.length; i++) {
            for (var j = 0; j < tileGrid.length; j++) {
                if (tile == tileGrid[i][j]) {
                    pos.x = i;
                    pos.y = j;
                    //break;
                    j = tileGrid[i].length + 1;
                    i = tileGrid.length + 1;
                }
            }
        }
        return pos;
    },
    resetTile: function () {
        var me = this;
        for (var i = 0; i < me.tileGrid.length; i++) {
            for (var j = me.tileGrid[i].length - 1; j > 0; j--) {
                if (me.tileGrid[i][j] == null && me.tileGrid[i][j - 1] != null) {
                    var tempTile = me.tileGrid[i][j - 1];
                    me.tileGrid[i][j] = tempTile;
                    me.tileGrid[i][j - 1] = null;
                    me.game.add.tween(tempTile).to({ y: (me.tileHeight * j) + (me.tileHeight / 2) }, 200, Phaser.Easing.Linear.In, true);
                    j = me.tileGrid[i].length;
                }
            }
        }
    },
    fillTile: function () {
        var me = this;
        for (var i = 0; i < me.tileGrid.length; i++) {
            for (var j = 0; j < me.tileGrid.length; j++) {
                if (me.tileGrid[i][j] == null) {
                    var tile = me.addTile(i, j);
                    me.tileGrid[i][j] = tile;
                }
            }
        }
    }
};
