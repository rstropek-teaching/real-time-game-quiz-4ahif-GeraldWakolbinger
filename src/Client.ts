let Client = {};
Client.socket = io.connect();

Client.socket.on('news', function (data) {
    console.log(data);
    Client.socket.emit('my other event', { my: 'data' });
});
Client.socket.on('allplayers', function(data){
    console.log(data);
});
Client.socket.on('gridUpdate', function(data:string[][]){
    console.log("incoming Data:");
    console.log(data);
    for(let i =0;i<data.length;i++)
    {
        for(let j =0;j<data[i].length;j++)
        {
            console.log(data[i][j]);
            Game.prototype.tileGrid[i][j] = Game.prototype.addTileByName(i, j, data[i][j]);
        }
    }

    console.log("Grid-update completed");
});
Client.tilesSwapped = function(grid:any[][])
{
    console.log("Grid:");
    console.log(grid);
    let stringArr: string[][] = [
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null]
    ];
    
    for(let i =0;i<stringArr.length;i++)
    {
        for(let j =0;j<stringArr[i].length;j++)
        {
            stringArr[i][j] = Game.prototype.tileGrid[i][j].tileType;
        }
    }
    console.log(stringArr);
    Client.socket.emit('tileSwap',stringArr);
    console.log("new tileGrid emitted");
    
}
