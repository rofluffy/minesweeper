function onTileClicked() {
      // onClick
      var pointer = game.input.activePointer;

      var x = bomblayer.getTileX(pointer.worldX);
      var y = bomblayer.getTileY(pointer.worldY);

      var bombTile = map.getTile(x, y, bomblayer);
      var cladTile = map.getTile(x, y, cladlayer); // if data is 0 in layer, there's no tile created

      // tile.index gives the corresonding number of data on map
      // if 9, it's a bomb, BOOOMM!
      // if 10, it's a empty area, expand the map until reach the edge (#s that are not 9 nor 10)
      // else, just shows the number

      console.log(bombTile.index);
      //console.log(pointer.leftButton.isDown);
      //console.log(pointer.rightButton.isDown);

      if (pointer.leftButton.isDown && (cladTile != null)) {
            leftClick(bombTile, cladTile, x, y);
      } else if (pointer.rightButton.isDown && (cladTile != null)){
            rightClick(cladTile, x, y);
      }
}

function leftClick(bombTile, cladTile, x, y) {
      console.log("mouse left clicked");
      // show the number or expand the area by removing the tile on the upper layer
      console.log("cladTile: " + cladTile.index);
      console.log("bombTile: " + bombTile.index);

      // if it's a flag or "?" in cladlayer, the tile is not removable
      if (cladTile.index === 11) {
            if (bombTile.index != 10 && bombTile.index != 9) {
                  map.removeTile(x, y, cladlayer);
            } else if (bombTile.index === 9) {
                  console.log("BOMB!!!!!!!");
                  // end the game and show all locations of bomb
                  // TODO: add animation
                  getAllBombs(x, y);
            } else if (bombTile.index === 10){
                  // must === 10?
                  // expand the area
                  expandMtZone(x, y);
            }
      }
}

function rightClick(cladTile, x, y) {
      console.log("mouse right clicked");
      // change the state based on the state of the upper layer data
      // 0: no tile, shows the bottom layer
      // 11: normal tile that covers the bottom layer
      // 12: flag
      // 13: question mark
      switch (cladTile.index) {
            case 11:
            // map.replace(source, dest, x, y, width, height, layer)
            // width/height in tile: meaning, how many tiles you want to 
            // check for replacement
            map.replace(11, 12, x, y, 1, 1, cladlayer);
            break;

            case 12:
            map.replace(12, 13, x, y, 1, 1, cladlayer);
            break;

            case 13:
            map.replace(13, 11, x, y, 1, 1, cladlayer);
            break;
      }
}

// expandMtZone: expand the empty area until reach the edge of the area - numbers
//               between 1 to 8
// x, y: position on layer in tile unit
function expandMtZone(x, y){
      // x(width), y(height) is the postion of the tile on layer 2D array data
      // checks the 8 tiles arround (x, y)
      // [y-1, x-1] [y-1, x] [y-1, x+1]
      // [y, x-1]   [y, x]   [y, x+1]
      // [y+1, x-1] [y+1, x] [y+1, x+1]
      var cladtile = map.getTile(x, y, cladlayer);
      var tile = map.getTile(x, y, bomblayer);

      // - if 1-8, remove tile, stop expand
      // - if 10, remove tile, continue the expand
      if (tile.index > 0 && tile.index < 9 && cladtile != null) {
            map.removeTile(x, y, cladlayer);
      } else if (tile.index === 10 && cladtile != null) {
            map.removeTile(x, y, cladlayer);

            var width = map.width;
            var height = map.height;
            var w = x+1;
            var h = y+1;
            var tw = 0;
            var th = 0;

            if (w === width) {
                  w = x;
            }
            if (h === height) {
                  h = y;
            }
            if (x-1 > 0) {
                  tw = x-1;
            }
            if (y-1 > 0) {
                  th = y-1;
            }

            if (w-tw > 0 && h-th > 0) {
                  for (var tx = tw; tx <= w; tx++) {
                        for (var ty = th; ty <= h; ty++){
                              if (!(tx === x && ty === y)) {
                                    expandMtZone(tx, ty);
                              }
                        }
                  }
            }
      }
}

function getAllBombs(x, y, direction, width, height){
      console.log("calling get all bomb "+ x + " " + y);
      // call when a bomb is clicked to end the game
      // exapnd from x, y
      var cladtile = map.getTile(x, y, cladlayer);
      var tile = map.getTile(x, y, bomblayer);

      // stop when x === 0, y === 0, x === width, y === height

      if (tile.index === 9 && cladtile != null) {
            // remove tile from cladlayer
            map.removeTile(x, y, cladlayer);
            // TODO: play animation
      }

      // start searching the bombs from current x,y
      // to avoid repeatitive checks, checks should go only certain direction
      // a a b
      // d x b
      // d c c
      // this goes four direction, a b c d

      // a  a  a  a b 
      // d a1 a0 b1 b 
      // d d0  x b0 b
      // d d1 c0 c1 b
      // d  c  c  c c
      // each corner goes 2 direction
      // a1 goes a and d
      // b1 goes a and b
      // c1 goes b and c
      // d1 goes d and c

      // a  a  a  a  a  a  b
      // d  a  a  a  a  b  b
      // d  d a1 a0 b1  b  b
      // d  d d0  x b0  b  b
      // d  d d1 c0 c1  b  b
      // d  d  c  c  c  c  b
      // d  c  c  c  c  c  c

      var width = map.width;
      var height = map.height;
      var end_w = x+1;
      var end_h = y+1;
      var start_w = x-1;
      var start_h = y-1;

      if (end_w === width) {
            // x is already on edge of width
            end_w = x;
      }
      if (end_h === height) {
            // y is already on edge of height
            end_h = y;
      }
      if (start_w < 0) {
            // x is already on edge
            start_w = 0;
      }
      if (start_h < 0) {
            // y is aready on edge
            start_h = 0;
      }

      if (dir_a) {
            getAllBombs(start_w, start_h)
      }

}