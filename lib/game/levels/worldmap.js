ig.module( 'game.levels.worldmap' )
.requires( 'impact.image','game.entities.miscellaneous.owdoor','game.entities.miscellaneous.gate','game.entities.overworldplayer' )
.defines(function(){
LevelWorldmap=/*JSON[*/{"entities":[{"type":"EntityOwdoor","x":96,"y":112,"settings":{"size":{"x":16,"y":16},"level":2}},{"type":"EntityOwdoor","x":176,"y":64,"settings":{"size":{"x":16,"y":16},"level":4}},{"type":"EntityOwdoor","x":96,"y":64,"settings":{"size":{"x":16,"y":16},"level":3}},{"type":"EntityOwdoor","x":288,"y":16,"settings":{"size":{"x":16,"y":16},"level":5}},{"type":"EntityOwdoor","x":128,"y":160,"settings":{"size":{"x":24,"y":16},"level":7}},{"type":"EntityOwdoor","x":176,"y":112,"settings":{"size":{"x":16,"y":16},"level":6}},{"type":"EntityOwdoor","x":256,"y":160,"settings":{"size":{"x":16,"y":16},"level":10}},{"type":"EntityOwdoor","x":48,"y":160,"settings":{"size":{"x":16,"y":16},"level":8}},{"type":"EntityOwdoor","x":192,"y":208,"settings":{"size":{"x":16,"y":16},"level":9}},{"type":"EntityGate","x":96,"y":104,"settings":{"size":{"x":16,"y":8},"level":2}},{"type":"EntityGate","x":48,"y":176,"settings":{"size":{"x":16,"y":8},"level":8}},{"type":"EntityGate","x":176,"y":56,"settings":{"size":{"x":16,"y":8},"level":4}},{"type":"EntityGate","x":288,"y":32,"settings":{"size":{"x":16,"y":8},"level":5}},{"type":"EntityGate","x":120,"y":160,"settings":{"size":{"x":8,"y":16},"level":7}},{"type":"EntityGate","x":192,"y":200,"settings":{"size":{"x":16,"y":8},"level":9}},{"type":"EntityGate","x":112,"y":64,"settings":{"size":{"x":8,"y":16},"level":3}},{"type":"EntityOverworldplayer","x":32,"y":112},{"type":"EntityOwdoor","x":192,"y":160,"settings":{"size":{"x":4,"y":16}}},{"type":"EntityOwdoor","x":32,"y":112,"settings":{"size":{"x":16,"y":16},"level":0}},{"type":"EntityOwdoor","x":176,"y":16,"settings":{"size":{"x":16,"y":16}}},{"type":"EntityOwdoor","x":288,"y":112,"settings":{"size":{"x":16,"y":16}}},{"type":"EntityOwdoor","x":128,"y":112,"settings":{"size":{"x":16,"y":16}}},{"type":"EntityOwdoor","x":48,"y":208,"settings":{"size":{"x":16,"y":16}}},{"type":"EntityGate","x":168,"y":112,"settings":{"size":{"x":8,"y":12},"level":6}}],"layer":[{"name":"water","width":20,"height":15,"linkWithCollision":false,"visible":1,"tilesetName":"media/overworld/world_map.png","repeat":false,"preRender":false,"distance":"1","tilesize":16,"foreground":false,"data":[[0,0,0,0,0,0,0,0,0,0,0,0,13,13,13,13,13,13,13,13],[0,0,0,0,0,0,0,0,0,0,0,0,13,13,13,13,13,13,0,13],[0,0,0,0,0,0,0,0,0,0,13,13,13,13,13,13,13,13,13,13],[0,0,0,0,0,0,13,13,13,13,13,13,13,0,0,0,0,13,13,13],[0,0,0,13,13,13,11,13,13,13,13,13,13,0,0,0,0,13,13,13],[13,13,13,13,13,13,11,13,13,13,13,13,13,13,13,13,13,13,13,13],[13,13,13,13,13,13,11,13,13,13,13,13,13,13,13,13,13,13,13,13],[13,13,13,13,13,13,11,13,13,13,13,13,13,13,13,13,13,13,13,13],[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,0,0,0],[13,13,13,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,0,0],[13,13,13,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,0,0],[13,13,13,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,0,0],[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,0,0,0,0,0],[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,0,0,0,13],[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13]]},{"name":"first_layer","width":20,"height":15,"linkWithCollision":false,"visible":1,"tilesetName":"media/overworld/world_map.png","repeat":false,"preRender":false,"distance":"1","tilesize":16,"foreground":false,"data":[[25,25,25,25,25,25,25,25,25,25,25,25,0,0,0,0,0,0,0,0],[25,25,25,25,25,25,25,25,25,25,25,11,11,11,11,11,11,11,11,0],[25,25,25,25,25,25,25,25,25,25,11,11,11,11,25,25,25,0,11,0],[25,25,25,25,25,25,73,71,71,71,11,11,92,25,25,25,25,25,11,0],[25,25,25,13,13,13,11,11,11,11,11,11,92,25,25,25,25,25,11,0],[13,13,13,13,13,25,11,25,11,11,11,11,11,11,25,25,0,0,11,0],[13,25,25,25,25,25,11,11,0,0,11,11,11,11,0,0,0,0,11,0],[13,11,11,11,11,11,11,25,91,11,11,11,11,11,11,11,11,11,11,0],[13,25,25,25,25,25,11,84,91,13,13,13,13,13,13,13,25,25,25,25],[13,13,73,71,71,71,71,71,91,13,13,13,13,13,25,25,25,25,25,25],[13,13,91,11,11,11,11,11,11,13,13,13,11,11,11,11,11,25,25,25],[13,13,91,11,13,13,13,13,13,13,13,13,11,11,11,25,25,25,25,25],[13,13,91,11,13,13,13,13,13,13,13,13,11,92,13,25,25,25,25,25],[13,13,91,11,11,11,11,11,11,11,11,11,11,92,13,13,25,25,25,13],[13,13,83,72,72,72,72,72,72,72,72,72,72,84,13,13,13,13,13,13]]},{"name":"map_tiles","width":20,"height":15,"linkWithCollision":false,"visible":1,"tilesetName":"media/overworld/world_map.png","repeat":false,"preRender":false,"distance":"1","tilesize":16,"foreground":false,"data":[[12,12,12,12,12,88,11,11,11,11,11,84,51,51,51,51,51,51,51,0],[12,12,12,12,88,11,11,11,11,11,84,27,71,71,71,71,71,71,4,0],[12,60,60,88,11,11,72,72,72,84,0,0,0,0,77,59,78,0,0,0],[88,11,11,72,72,84,0,0,0,0,0,0,0,77,12,12,12,78,0,0],[72,72,84,0,0,0,2,11,11,11,11,3,0,87,12,12,60,88,0,0],[0,0,0,0,0,73,0,11,11,11,11,11,11,0,87,88,0,0,0,0],[0,73,71,71,71,11,0,11,11,11,11,11,11,11,71,71,71,71,0,74],[0,91,26,0,0,0,1,11,27,0,0,0,0,0,72,72,11,11,27,11],[0,83,11,11,11,11,11,11,11,11,72,72,72,84,0,0,91,11,11,11],[0,0,91,11,11,11,11,11,11,92,0,0,0,0,73,71,11,11,11,11],[0,0,0,6,0,0,0,0,5,92,0,0,27,71,11,11,11,11,11,11],[0,0,0,0,11,11,11,11,11,11,71,71,0,11,72,11,11,11,11,11],[0,77,78,0,11,11,11,11,11,11,11,11,0,0,0,83,11,11,11,77],[77,12,95,27,0,0,0,0,0,0,0,0,7,0,0,0,83,72,77,12],[12,12,95,0,0,0,0,0,0,0,0,0,0,0,0,0,0,77,12,12]]},{"name":"paths","width":20,"height":15,"linkWithCollision":false,"visible":1,"tilesetName":"media/overworld/world_tiles.png","repeat":false,"preRender":false,"distance":"1","tilesize":16,"foreground":false,"data":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,47,47,47,47,47,47,0,0],[0,0,0,0,0,0,0,0,0,0,0,39,0,0,0,0,0,0,39,0],[0,0,0,0,0,0,0,0,0,0,0,39,0,0,0,0,0,0,39,0],[0,0,0,0,0,0,50,47,47,47,47,50,50,0,0,0,0,0,39,0],[0,0,0,0,0,0,39,50,50,0,0,0,0,0,0,0,0,0,39,0],[0,0,0,0,0,0,39,0,0,0,0,0,0,0,0,0,0,0,39,0],[0,0,0,47,47,47,0,0,0,47,47,0,47,47,47,47,47,47,0,0],[0,0,0,0,0,0,0,0,39,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,39,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,47,47,47,47,0,0,0,0,0,47,47,47,0,0,0,0],[0,0,0,39,0,0,0,0,0,0,0,0,39,0,0,0,0,0,0,0],[0,0,0,39,0,0,0,0,0,0,0,0,39,0,0,0,0,0,0,0],[0,0,0,0,47,47,47,47,47,47,47,47,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},{"name":"castles","width":20,"height":15,"linkWithCollision":false,"visible":1,"tilesetName":"media/overworld/castles.png","repeat":false,"preRender":false,"distance":"1","tilesize":16,"foreground":false,"data":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},{"name":"cute_trees","width":20,"height":15,"linkWithCollision":false,"visible":1,"tilesetName":"media/overworld/cute_trees.png","repeat":false,"preRender":false,"distance":"1","tilesize":16,"foreground":false,"data":[[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],[1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],[0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},{"name":"cute_dugtrio","width":20,"height":15,"linkWithCollision":false,"visible":1,"tilesetName":"media/overworld/cute_dugtrio.png","repeat":false,"preRender":false,"distance":"1","tilesize":16,"foreground":false,"data":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},{"name":"cute_flowers","width":20,"height":15,"linkWithCollision":false,"visible":1,"tilesetName":"media/overworld/flowers.png","repeat":false,"preRender":false,"distance":"1","tilesize":16,"foreground":false,"data":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},{"name":"cute_hill","width":20,"height":15,"linkWithCollision":false,"visible":1,"tilesetName":"media/overworld/cute_hill.png","repeat":false,"preRender":false,"distance":"1","tilesize":16,"foreground":false,"data":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1]]},{"name":"cute_lightgreen_trees","width":20,"height":15,"linkWithCollision":false,"visible":1,"tilesetName":"media/overworld/cute_lightgreen_trees.png","repeat":false,"preRender":false,"distance":"1","tilesize":16,"foreground":false,"data":[[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},{"name":"collision","width":20,"height":15,"linkWithCollision":false,"visible":0,"tilesetName":"","repeat":false,"preRender":false,"distance":1,"tilesize":16,"foreground":false,"data":[[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1,1,1,0,1],[0,0,0,0,0,1,1,1,1,1,1,0,1,0,0,0,0,1,0,1],[0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,1],[0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,0,0,1,0,1],[0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],[0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],[0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,0],[0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,0],[0,0,1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,0],[0,0,1,0,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],[0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0]]}]}/*]JSON*/;
LevelWorldmapResources=[new ig.Image('media/overworld/world_map.png'), new ig.Image('media/overworld/world_map.png'), new ig.Image('media/overworld/world_map.png'), new ig.Image('media/overworld/world_tiles.png'), new ig.Image('media/overworld/castles.png'), new ig.Image('media/overworld/cute_trees.png'), new ig.Image('media/overworld/cute_dugtrio.png'), new ig.Image('media/overworld/flowers.png'), new ig.Image('media/overworld/cute_hill.png'), new ig.Image('media/overworld/cute_lightgreen_trees.png')];
});