/*

Tiled Map JSON loader

Stephen Orr
storr@storrdev.com

*/

(function() {

	var tilesets = [];
	var tiles = [];
	tiles.push(null);

	tmxJSON = {
	
		map: null,
	
		load: function(jsonFile) {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && xhr.status == 200) {
					// Call function for next step in process
					tmxJSON.parse(xhr.responseText);
				}
			}
			xhr.open("GET", jsonFile, true);
			xhr.send();
		},
		
		parse: function(json) {
			map = eval("(" + json + ")");
			
			tmxJSON.loadTilesetImages();
			
		},
		
		loadTilesetImages: function() {
		
			var successCount = 0;
			var errorCount = 0;

			for (var ts = 0; ts < map.tilesets.length; ts++) {
				
				var image = new Image();
				image.addEventListener("load", function() {
					successCount++;
					if (successCount + errorCount == map.tilesets.length) {
						tmxJSON.separateTiles();
					}
				});
				image.addEventListener("error", function() {
					errorCount++;
					alert("error loading: " + map.tilesets[ts].image);
				});
				image.src = map.tilesets[ts].image;
				
				tilesets.push(image);
				
			}
			
			
		},
		
		separateTiles: function() {
		
			for (var ts = 0; ts < tilesets.length; ts++) {
				
				var tileCanvas = document.createElement("canvas");
				var tileContext = tileCanvas.getContext("2d");
				
				tileCanvas.width = tilesets[ts].width;
				tileCanvas.height = tilesets[ts].height;

				tileContext.drawImage(tilesets[ts], 0, 0);
				
				var nTilesX = tilesets[ts].width / map.tilewidth;
				var nTilesY = tilesets[ts].height / map.tileheight;
				
				for (ty = 0; ty < nTilesY; ty++) {
					for (tx = 0; tx < nTilesX; tx++) {
						var x = tx * map.tilewidth;
						var y = ty * map.tileheight;
					
						var imageData = tileContext.getImageData(x, y, map.tilewidth, map.tileheight);

						tiles.push(imageData);
					}
				}
			}
			tmxJSON.drawTiles();
		},
		
		drawTiles: function() {
		
			for (var l = 0; l < map.layers.length; l++) {
				var x = 0;
				var y = 0;
				if (map.layers[l].type === "tilelayer") {
					for (var d = 0; d < map.layers[l].data.length; d++) {
						
						if (d % map.width == 0 && d != 0) {
							y += map.tileheight;
							x = 0;
						}
						
						
						if (map.layers[l].data[d] != 0) {
							context.putImageData(tiles[map.layers[l].data[d]], x, y);
						}
						x += map.tilewidth;
					}
					
				}
			}
		
		}
	};

}());