/* This file contains helper functions needed to generate the map 2D array
*/

// creating a blank map with mine array 
function initializeMap(height, width) {
    // 1, 2, 3, 4, 5, 6, 7, 8: numbers of mine near that tile
    // 10: no mine (cannot use 0 as 0 in tilemap represents no tile in map)
    // 9: bomb!
    var randmine = weightedRand({9:0.2, 10:0.8});
    var data = [];

    for (var y = 0; y < height; y++) {
        data.push([]);
        for (var x = 0; x < width; x++) {
            data[y].push(parseInt(randmine()));
            // if (x < width-1){
            //  data += ',';
            // }
        }
        // if (y < height-1){
        //  data += "\n";
        // }
    }
    //console.log(typeof data[0]);
    return data;
}

// completeMap: recursively call and updates the hint numbers on map 2D array
//              record the number of bomb with global variable bombCounter
// mapdata: the 2D array of the map
// start_h, end_h: start and end height location of the area
// start_w, end_w: start and end width location of the area
function completeMap(mapdata, start_h, end_h, start_w, end_w) {
    // divided in to 4 area: A B C D

    if ((end_h-start_h <= 2) || (end_w-start_w <= 2)) {
        // stop recursive call 
        for (var h = start_h; h < end_h; h++) {
            for (var w = start_w; w < end_w; w++) {
                if (mapdata[h][w] === 9) {
                    // increment the bombCounter as a mine is detected
                    bombCounter += 1;
                    mapdata = fillHint(mapdata, h, w);
                }
            }
        }

        return mapdata;

    } else {
        var m = end_h - start_h;  // height
        var n = end_w - start_w;  // width

        // be careful with these divisions!!!!, could it returns 0?
        // ...probably not as we stop when one of width or height is 1
        // but division could returns 1!!!
        var mid_m = Math.floor(m/2);
        var mid_n = Math.floor(n/2);

        //console.log("mid_m: "+mid_m+" mid_n: "+mid_n);

        // A: [0, 0]     [0, mid_n]        B: [0, mid_n]     [0, n]
        //    [mid_m, 0] [mid_m, mid_n]       [mid_m, mid_n] [mid_m, n]
        // C: [mid_m, 0] [mid_m, mid_n]    D: [mid_m, mid_n] [mid_m, n]
        //    [m, 0]     [m, mid_n]           [m, mid_n]     [m, n]

        // b/c it's dynamic scoping, mapdata updates along with the function call, 
        // thus there's no need to write in the form of:
        // mapdata = completeMap(...)
        completeMap(mapdata, start_h, start_h+mid_m, start_w, start_w+mid_n);
        completeMap(mapdata, start_h, start_h+mid_m, start_w+mid_n, end_w);
        completeMap(mapdata, start_h+mid_m, end_h, start_w, start_w+mid_n);
        completeMap(mapdata, start_h+mid_m, end_h, start_w+mid_n, end_w);

        return mapdata;  
    }
}


// fillHint: updates the hint numbers around a cell at position x,y on map 2D array
function fillHint(mapdata, x, y){
    // +1 to the blocks around the current block if the number is not 9 
    // [x-1, y-1] [x-1, y] [x-1, y+1]
    // [x, y-1]   [x, y]   [x, y+1]
    // [x+1, y-1] [x+1, y] [x+1, y+1]
    // x-1 not < 0, x+1 not > mapdata.length
    // y-1 not < 0, y+1 not > mapdata[0].length

    for (var m = x-1; m <= x+1; m++) {
        if (!(m < 0) && !(m >= mapdata.length)) {
            for (var n = y-1; n <= y+1; n++) {
                if (!(n < 0) && !(n >= mapdata[0].length)) {
                    //console.log("checking: " + mapdata[m][n]);
                    if (!(mapdata[m][n] === 9)) {
                        //console.log("runing?")
                        // mapdata[m][n] += 1;
                        if (mapdata[m][n] === 10) {
                            mapdata[m][n] = 1;
                        } else {
                            mapdata[m][n] += 1;
                        }
                    }
                }
            }
        }
    }

    return mapdata;
}

// need to convert the 2D array back to 1D array in order to build the tilemap json file
function get1DArray(input){
    var result = [];
    for (var i=0; i<input.length; i++) {
        result = result.concat(input[i]);
    }
    return result;
}

// build the tilemap Json file
// takes in 2 layer data, one for the bomb map, one for the cover map
function buildMapJson(data, map_height, map_width, tile_height, tile_width){
    // create a layer
    var layer1 = {
        "data": data,
        // height and width: row and column count; same as map height/width for fixed-size map
        "height": map_height,
        "width": map_width,
        // name of the layer
        "name": "BombLayer",
        "type": "tilelayer",
        // value between 0 and 1
        "opacity": 1,
        // whether layer is shown or hidden in editor
        "visible": true,
        // x and y: horizontal and vertical layer offset in tiles. Always 0.
        "x": 0,
        "y": 0
    };

    // create clad_data here - just all 11s (blank tile)
    var clad_data = [];
    for (var y = 0; y < map_height; y++) {
        clad_data.push([]);
        for (var x = 0; x < map_width; x++) {
            clad_data[y].push(11);
        }
    }
    clad_data = get1DArray(clad_data);
    //console.log("getting clad_data");
    //console.log(clad_data);

    var layer2 = {
        "data": clad_data,
        // height and width: row and column count; same as map height/width for fixed-size map
        "height": map_height,
        "width": map_width,
        // name of the layer
        "name": "CladLayer",
        "type": "tilelayer",
        // value between 0 and 1
        "opacity": 0.3,
        // whether layer is shown or hidden in editor
        "visible": true,
        // x and y: horizontal and vertical layer offset in tiles. Always 0.
        "x": 0,
        "y": 0
    };

    // create a tileset
/*    var tileset1 = {
        "firstgid": 1,
        "image": "..\/assets\/bombtiles.png", 
        "imageheight": 32,
        "imagewidth": 320,
        "margin":0,
        "name": "bombTile",
        "spacing": 0,
        "tileheight": tile_height,
        "properties": {},
        "tilewidth": tile_width,
        "columns": 10,
        "tilecount": 10
    };*/
    var tileset1 = {
        "firstgid": 1,
        "image": "..\/assets\/minetiles.png", 
        "imageheight": 64,
        "imagewidth": 320,
        "margin":0,
        "name": "bombTile",
        "spacing": 0,
        "tileheight": tile_height,
        "properties": {},
        "tilewidth": tile_width,
        "columns": 10,
        "tilecount": 20
    };

/*    var tileset2 = {
        "firstgid": 11,
        "image": "..\/assets\/minetiles.png", 
        "imageheight": 64,
        "imagewidth": 320,
        "margin":0,
        "name": "cladTile",
        "spacing": 0,
        "tileheight": tile_height,
        "properties": {},
        "tilewidth": tile_width,
        "columns": 10,
        "tilecount": 10
    };*/

    // create the map

    var map = {
        "background": "#b7b7b7",
        "height": map_height,
        "width": map_width, 
        "layers": [layer1, layer2],
        "orientation": "orthogonal",
        "renderorder":"right-down",
        "properties": {},
        "tileheight": tile_height,
        "tilewidth": tile_width,
        "tilesets": [tileset1],
        "version": 1
    };

    return map;
}