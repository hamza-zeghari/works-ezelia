var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Game;
(function (Game) {
    //import CMove = Ezelia.Iso.ECS.Components.CMove;
    var CSkin = Ezelia.Iso.ECS.Components.CSkin;
    var CCoords = Ezelia.Iso.ECS.Components.CCoords;
    var CWalk = Ezelia.Iso.ECS.Components.CWalk;
    var CPos = Ezelia.Iso.ECS.Components.CPos;
    class Character extends Ezelia.Iso.Character {
        constructor(engine, x, y, animData, anchorX = 0.5, anchorY = 0.5) {
            super(engine, x, y, animData, anchorX, anchorY);
            this.engine = engine;
            //public fxentity: eee.Entity;
            //private pendingMove = { x: 0, y: 0, astar: null };
            this.blinking = false;
            this.inActionAreas = {};
            const __this = this;
            //var move: CMove = _this.entity.get(CMove);
            const skin = this.entity.get(CSkin);
            const coords = this.entity.get(CCoords);
            const walk = this.entity.get(CWalk);
            const pos = this.entity.get(CPos);
            skin.initOnRegister = true;
            skin.anchor.y = anchorY;
            //this._bullet = new CBullet();
            //this.entity.add(this._bullet);
            /*
            var fxskin = new Components.CSkin();
            //fxskin.visible = false;
            fxskin.anchor.x = anchorX;
            fxskin.anchor.y = anchorY;
            fxskin.anim = './assets/character-fx.json';
            fxskin.animId = 'idle';
            fxskin.animLoop = 1;
            this.fxentity = engine.ecs.createEntity(
                new Components.CProps(),
                coords,
                pos,
                fxskin
            );
            */
            this.entity.on('moveStart', function () {
                if (walk.path.length > 3 /*|| __this.pathLength > 3*/ || walk.skinPrefix == 'run') {
                    walk.speed = 30 * 3;
                    walk.skinPrefix = 'run';
                }
                else {
                    walk.speed = 30;
                    walk.skinPrefix = 'walk';
                }
                __this.setSkinsAnim(walk.skinPrefix);
            });
            this.entity.on('moveEnd', function () {
                //console.log('move Ended');
                walk.skinPrefix = 'idle';
                //__this.pathLength = 0;
                __this.setSkinsAnim(walk.skinPrefix);
            });
            //Handle enter/leave map action areas
            this.entity.on('coordsUpdate', function (x, y) {
                const actions = __this.engine.mMap.getActions(x, y);
                //get already registered areas.
                const areas = Object.keys(__this.inActionAreas);
                if (actions) {
                    actions.forEach(action => {
                        const areaIdx = areas.indexOf(action.id.toString());
                        if (areaIdx >= 0) { // this area was already attached (see tiledMapActionHandler)
                            areas.splice(areaIdx, 1);
                            return;
                        }
                        if (action.handler) {
                            //attach this new area
                            action.handler.notifyIn(__this, x, y, action);
                            //action.handler.trigger('characterEnter', action, __this, x, y);
                        }
                    });
                }
                for (let k of areas) {
                    if (__this.inActionAreas[k] && __this.inActionAreas[k].handler)
                        __this.inActionAreas[k].handler.notifyOut(__this, x, y, __this.inActionAreas[k]);
                }
                if (__this.onCoordsUpdate && typeof __this.onCoordsUpdate === 'function')
                    __this.onCoordsUpdate.call(__this, x, y);
            });
            //this.entity.on('coordsUpdate', function (x, y) {
            //    //console.log(x, y);
            //    __this.trigger('coordsUpdate', x, y);
            //});
            Ezelia.utils.Timer.wait(function () {
                return (skin && skin.animInstance);
            }, function () {
                if (skin && skin.animInstance) {
                    skin.animInstance.on('animationEnded', function () {
                        __this.setIdle();
                    });
                }
            }, 5000, 100);
        }
        addActionArea(id, data) {
            this.inActionAreas[id] = data;
        }
        removeActionArea(id) {
            delete this.inActionAreas[id];
        }
        setPos(x, y) {
            super.setPos(x, y);
            var coords = this.entity.get(CCoords);
            coords.z = x * coords.zFactor + y + 0.02;
            coords.zAdjust = 0.1;
            this.engine.mRenderer.dirty = true;
        }
        //public moveTo(tx, ty) {
        //    if (!this.pathFinder) return;
        //    var walk: CWalk = this.entity.get(CWalk);
        //    //var move: CMove = this.entity.get(CMove);
        //    var coords: CCoords = this.entity.get(CCoords);
        //    //console.log(' >> Player move To  ', move.moving);
        //    if (!walk) return;
        //    if (!walk.moving) {
        //        //console.log(' >> Player move To ==> Not moving ');
        //        var path = this.pathFinder.findPath(coords.x, coords.y, tx, ty).slice(1);
        //        this.pathMove(path);
        //        this.pathLength += walk.path.length;
        //        if (walk.path.length > 3 || this.pathLength > 3 || walk.skinPrefix == 'run') {
        //            walk.speed = 30 * 3;
        //            walk.skinPrefix = 'run';
        //        }
        //        else {
        //            walk.speed = 30;
        //            walk.skinPrefix = 'walk';
        //        }
        //    }
        //    else {
        //        //console.log(' >> Player move To ==> already moving ');
        //        var __this = this;
        //        this.stop();
        //        //console.log(' >> Changing direction ');
        //        this.entity.on('coordsUpdate', function () {
        //            //console.log(' >> stopping ');
        //            var path = __this.pathFinder.findPath(coords.x, coords.y, tx, ty).slice(1);
        //            __this.pathMove(path);
        //            __this.pathLength += walk.path.length;
        //            if (walk.path.length > 3 || __this.pathLength > 3 || walk.skinPrefix == 'run') {
        //                walk.speed = 30 * 3;
        //                walk.skinPrefix = 'run';
        //            }
        //            else {
        //                walk.speed = 30;
        //                walk.skinPrefix = 'walk';
        //            }
        //        }, 1)
        //    }
        //}
        //public jumpTo(tx, ty, top = 0, speed = 10) {
        //    this.entity['walk'].skinPrefix = 'jump';   
        //    var __this = this;
        //    this.entity.on('bulletMoveEnd', function () {
        //        __this.entity['walk'].skinPrefix = 'idle';
        //        __this.setIdle();
        //    }, 1);
        //    this.entity['skin'].visible = true;
        //    this._bullet.dx = tx;
        //    this._bullet.dy = ty;
        //    this._bullet.top = top;
        //    this._bullet.speed = speed;
        //}
        drawDebugBoundingBox() {
            var entity = this.entity;
            let skin = entity.skin;
            let boundingBox = entity.props.data.boundingBox;
            let game = this.engine;
            if (!this._debugGraphics) {
                this._debugGraphics = new PIXI.Graphics();
                skin.pixi.sprite.addChild(this._debugGraphics);
            }
            this._debugGraphics.clear();
            this._debugGraphics.beginFill(0xFF00BB, 0.25);
            this._debugGraphics.drawRect(-skin.width * (skin.anchor.x - 0.5) + boundingBox.x1, -skin.height * (skin.anchor.y - 0.5) + boundingBox.y1, boundingBox.x2 - boundingBox.x1, boundingBox.y2 - boundingBox.y1);
        }
        clearDebugBoundingBox() {
            if (this._debugGraphics)
                this._debugGraphics.clear();
        }
        blink(color = 0xFF0000, time = 100, number = 3) {
            if (this.blinking)
                return;
            this.blinking = true;
            const skin = this.entity.get(CSkin);
            const originalColor = skin.tint;
            const that = this;
            let totalBlinks = number * 2 + 1;
            const itv = setInterval(() => {
                if (skin.tint == originalColor)
                    skin.tint = color;
                else
                    skin.tint = originalColor;
                totalBlinks--;
                if (totalBlinks <= 0) {
                    skin.tint = originalColor;
                    that.blinking = false;
                    clearInterval(itv);
                }
            }, time);
        }
    }
    Game.Character = Character;
})(Game || (Game = {}));
var Game;
(function (Game) {
    var CSkin = Ezelia.Iso.ECS.Components.CSkin;
    var CCoords = Ezelia.Iso.ECS.Components.CCoords;
    var CPos = Ezelia.Iso.ECS.Components.CPos;
    class Cursor extends Ezelia.Iso.GameObject {
        constructor(engine, x, y, asset) {
            super(engine, x, y, asset);
            this.engine = engine;
            var skin = this.entity.get(CSkin);
            skin.anchor.y = 0.8;
            skin.layerId = 'bg';
        }
        setPos(x, y) {
            var coords = this.entity.get(CCoords);
            var pos = this.entity.get(CPos);
            coords.x = x;
            coords.y = y;
            //coords.z = x * 16 + y;
            coords.z = x * coords.zFactor + y + 0.1;
            //coords.zAdjust = 0.1;
            this.engine.mMap.Iso2Scr(x, y, pos);
            pos.z = this.engine.mMap.getAlt(coords.x, coords.y);
            //pos.y += this.engine.mMap.th/2;
            this.engine.mRenderer.updateEntity(this.entity);
            this.engine.mRenderer.dirty = true;
        }
        click(loop = 1) {
            var skin = this.entity.get(CSkin);
            //if (skin.animInstance) skin.animInstance.reset();
            skin.animLoop = loop;
            skin.animId = 'click';
            setTimeout(() => { skin.animId = 'default'; }, 500);
            //if (skin.animInstance && !this.cursorAnimCB) {
            //    this.cursorAnimCB = () => {
            //        skin.animId = 'default';
            //    }
            //    skin.animInstance.on('animationEnded', this.cursorAnimCB);
            //}
        }
    }
    Game.Cursor = Cursor;
})(Game || (Game = {}));
/// <reference path="../../../../lib/IsoEngine.all.d.ts" />
var Ext;
(function (Ext) {
    var Tiled;
    (function (Tiled) {
        var Components = Ezelia.Iso.ECS.Components;
        class TiledMapManager extends eee.System {
            constructor(engine, actionsHandlers) {
                super(['Map']);
                this.engine = engine;
                this.grid = [];
                this.mapsQueueSize = 0;
                this.mapActions = [];
                this.maps = {};
                this.baseDirectory = './';
                this.currentMap = '';
                this.mapWidth = 0;
                this.mapHeight = 0;
                this.TILED_FLIP = 0x80000000; //2147483648;
                this.H_FLIP_FLAG = 4;
                this.V_FLIP_FLAG = 2;
                this.ROT_FLAG = 1;
                this.ROTVAL_FLAG = 6;
                this.mapActionsHandlers = {};
                this.tempData = {};
                this.resLoader = new Ezelia.utils.ResourceLoader();
                this.mapActionsHandlers = Object.assign({}, this.mapActionsHandlers, actionsHandlers);
                this.pathFinder = new Ezelia.ai.AStar(this.walkable.bind(this), 'Diagonal');
            }
            init() {
                super.init();
                this.mMap = this.ecs.data.modules.get('Map');
                //this.mRenderer = this.engine.data.modules.get('Renderer');
                //this.mCamera = this.engine.data.modules.get('Camera');
            }
            addActionHandler(id, handler) {
                const __this = this;
                this.mapActionsHandlers[id] = handler;
                this.mMap.loopActions((x, y, action) => {
                    if (action.type === id && !action.handler) {
                        handler.mapManager = __this;
                        handler.register(action, x, y);
                    }
                });
            }
            walkable(x, y) {
                if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight)
                    return false;
                if (this.grid[x] != undefined && this.grid[x][y] != undefined && this.grid[x][y] > 0 && this.grid[x][y] < 8)
                    return false;
                return true;
            }
            addMapAction(x, y, id, action) {
                if (!this.mapActions)
                    this.mapActions = [];
                if (!this.mapActions[x])
                    this.mapActions[x] = [];
                if (!this.mapActions[x][y])
                    this.mapActions[x][y] = {};
                this.mapActions[x][y][id] = action;
            }
            getMapActions(x, y) {
                if (!this.mapActions)
                    return null;
                if (!this.mapActions[x])
                    return null;
                return this.mapActions[x][y];
            }
            destroyMap() {
                this.mapActions = [];
                this.grid = [];
                this.mMap.destroy();
            }
            //attach an object to the map so that its visibility 
            //can be correctly handler with updateEntitiesVisibility when moving from a map to another
            attachObject(entity, mapId) {
                if (!entity || !this.maps)
                    return false;
                if (!mapId)
                    mapId = this.currentMap;
                if (!this.maps[mapId]) {
                    this.maps[mapId] = {
                        entities: {}
                    };
                }
                this.dettachObject(entity);
                this.maps[mapId].entities[entity.id] = entity;
                return true;
            }
            dettachObject(entity) {
                if (!entity || !this.maps)
                    return false;
                for (var m in this.maps) {
                    var map = this.maps[m];
                    if (map.entities[entity.id]) {
                        delete map.entities[entity.id];
                        return true;
                    }
                }
                return false;
            }
            isObjectOnMap(entity, mapId) {
                if (!entity || !this.maps || !this.maps[mapId] || !this.maps[mapId].entities)
                    return false;
                for (var i in this.maps[mapId].entities) {
                    var e = this.maps[mapId].entities[i];
                    if (entity == e)
                        return true;
                }
                return false;
            }
            //loop all entities attached to maps and update their visibility according to active map
            updateEntitiesVisibility(mapId) {
                if (!mapId)
                    mapId = this.currentMap;
                for (var m in this.maps) {
                    var map = this.maps[m];
                    var inCurrentMap = (mapId == m);
                    for (var e in map.entities) {
                        var entity = map.entities[e];
                        var skin = entity.get(Components.CSkin);
                        if (skin) {
                            //save original object state
                            if (!inCurrentMap) {
                                skin.visible = false;
                            }
                            else {
                                skin.visible = skin['default_visibility'] != undefined ? skin['default_visibility'] : inCurrentMap;
                            }
                            //skin.visible = inCurrentMap;
                        }
                    }
                }
            }
            hideAllMapsEntities() {
                for (var m in this.maps) {
                    var map = this.maps[m];
                    for (var e in map.entities) {
                        var entity = map.entities[e];
                        var skin = entity.get(Components.CSkin);
                        if (skin) {
                            skin.visible = false;
                        }
                    }
                }
            }
            parseLayer(layer, _x, _y, _z, prefix = '') {
                var __this = this;
                var grid = this.grid;
                var fullname = prefix !== '' ? prefix + '/' + layer.name : layer.name;
                //if (l > 1) break;
                if (layer.type === 'group') {
                    for (let sublayer of layer.layers)
                        this.parseLayer(sublayer, _x, _y, _z, fullname);
                    return;
                }
                __this.tempData.layerIndex[fullname] = layer;
                if (!layer.offsetx)
                    layer.offsetx = 0;
                if (!layer.offsety)
                    layer.offsety = 0;
                //console.log('Layer = ', fullname, layer);
                //if (!layer.visible && layer.name.indexOf('grid') != 0) return;
                //layer is visible or grid layer
                var height = layer.height;
                var width = layer.width;
                //var startI = _x * width;
                //var startJ = _y * height;
                //Handle objects layers
                if (layer.objects) {
                    for (var o = 0; o < layer.objects.length; o++) {
                        const obj = layer.objects[o];
                        var oxStart = obj.x / __this.tempData.tileHeight;
                        var oyStart = obj.y / __this.tempData.tileHeight;
                        var xlen = oxStart + (obj.width / __this.tempData.tileHeight);
                        var ylen = oyStart + (obj.height / __this.tempData.tileHeight);
                        var id = obj.id;
                        const actionObj = { id: obj.id, type: obj.type, properties: obj.properties, handler: undefined };
                        for (var ox = oxStart; ox < xlen; ox++) {
                            for (var oy = oyStart; oy < ylen; oy++) {
                                __this.mMap.addAction(ox, oy, actionObj);
                                //if (actionsHandlers && actionsHandlers[obj.type] instanceof TiledMapActionHandler) {
                                //    actionsHandlers[obj.type].trigger('register', ox, oy, actionObj);  
                                //    actionObj.handler = actionsHandlers[obj.type];
                                //}
                            }
                        }
                    }
                }
                if (!layer.data)
                    return;
                for (var i = 0; i < layer.data.length; i++) {
                    var y = _x + Math.floor(i / width);
                    var x = _y + i % width;
                    if (layer.name.indexOf('grid') == 0 /*&& _z != 0*/) {
                        __this.mMap.setAlt(x, y, _z);
                    }
                    let id = layer.data[i];
                    if (id == 0)
                        continue;
                    //beta : handle fliped tiles
                    var xflip = 1;
                    var yflip = 1;
                    var rot = 0;
                    if (((id >>> 29) & __this.ROT_FLAG) == __this.ROT_FLAG) {
                        rot = ((id >>> 29) >> 1) == 1 ? -90 : 90;
                    }
                    else {
                        xflip = (((id >>> 29) & __this.H_FLIP_FLAG) == __this.H_FLIP_FLAG) ? -1 : 1;
                        yflip = (((id >>> 29) & __this.V_FLIP_FLAG) == __this.V_FLIP_FLAG) ? -1 : 1;
                    }
                    /*
                    if (id > _this.TILED_FLIP) {
                        id = Math.abs(_this.TILED_FLIP - id);
                        xflip = -1;
                    }
                    */
                    id = ((id << 3) >> 3); //clear 3 bits on the left
                    /////////////
                    var ts;
                    for (var t in __this.tempData.tsData) {
                        if (id >= t) {
                            ts = __this.tempData.tsData[t];
                        }
                    }
                    if (!ts)
                        continue;
                    const gid = id - ts.firstgid;
                    //console.log('gid => ', id, gid);
                    if (layer.name.indexOf('grid') == 0) {
                        if (grid instanceof Array) {
                            if (grid[x] == undefined)
                                grid[x] = [];
                            //var gid = id - ts.firstgid;
                            //if (ts.tileproperties && ) 
                            //grid[x][y] = gid;
                            if (ts && ts.tileproperties && ts.tileproperties[gid]) {
                                var props = ts.tileproperties[gid];
                                grid[x][y] = props.blocking || 0;
                                if (props.alt) { //read altittude property
                                    var alt = parseInt(props.alt);
                                    if (!isNaN(alt)) {
                                        __this.mMap.setAlt(x, y, _z + alt); //Set altittude
                                    }
                                }
                            }
                            continue;
                        }
                        break;
                    }
                    var skin = new Components.CSkin();
                    var pos = new Components.CPos();
                    var coords = new Components.CCoords(x, y, 0);
                    skin.anchor.x = 0.5;
                    skin.anchor.y = 0.5;
                    var skinUrl = Ezelia.utils.Path.resolve(__this.baseDirectory + ts.image);
                    skin.image = skinUrl; //IMG_PATH + filename;
                    skin.spw = ts.tilewidth;
                    skin.sph = ts.tileheight;
                    skin.frame = gid; //id - ts.firstgid;
                    if (ts.tiles) {
                        //if .tiles is set then it's not a tileset but a collection of images or an animation
                        //imgTile is set to identify collection of images tiles
                        if (ts.imgTile) {
                            skin.frame = undefined;
                            skin.spw = PIXI.utils.TextureCache[skinUrl].width;
                            skin.sph = PIXI.utils.TextureCache[skinUrl].height;
                        }
                        else {
                            if (ts.tiles[skin.frame] && ts.tiles[skin.frame].animation) {
                                var jsonAnim = [
                                    {
                                        "texture": skinUrl,
                                        "width": ts.tilewidth,
                                        "height": ts.tileheight,
                                        animations: {
                                            "default": { dt: 100, frames: [] }
                                        }
                                    }
                                ];
                                //var anim = { dt: 100, frames: [] };
                                for (var an in ts.tiles[skin.frame].animation) {
                                    jsonAnim[0].animations.default.frames.push([ts.tiles[skin.frame].animation[an].tileid, ts.tiles[skin.frame].animation[an].duration]);
                                }
                                //console.log('>>> Anim ? ', ts, jsonAnim);
                                skin.image = skinUrl;
                                skin.animId = 'default';
                                //skin.anim = 'idle';
                                skin.animInstance = new Ezelia.Anim.FrameSprite();
                                skin.animInstance.baseUrl = './';
                                skin.animInstance.loadFrames(jsonAnim, 'default');
                                //skin.spw = ts.tilewidth;
                                //skin.sph = 96;
                                skin.frame = 0;
                                skin.anim = 'default';
                                //if (!window['__dbg__']) window['__dbg__'] = [];
                                //window['__dbg__'].push(skin);
                                skin.animInstance.setAnimation('idle', true);
                                //TODO : handle animated tiled tiles
                            }
                        }
                    }
                    if (prefix !== '') {
                        skin.layerId = prefix.substr(0, prefix.indexOf('/')) || prefix; // layer.name.indexOf('bg') == 0 ? 'bg' : '';
                    }
                    else {
                        skin.layerId = layer.name.substr(0, layer.name.indexOf('-')) || layer.name; // layer.name.indexOf('bg') == 0 ? 'bg' : '';
                    }
                    if (skin.layerId.trim() === '')
                        skin.layerId = 'main';
                    skin.layerName = fullname;
                    skin.alpha = layer.opacity;
                    if (layer.properties) {
                        if (layer.properties.tint)
                            //convert color format from #AARRGGBB to int
                            skin.tint = parseInt(layer.properties.tint.substr(3), 16);
                    }
                    if (rot) {
                        /*
                            if (rot == 90) {
                                skin.anchor.x = skin.spw / _this.mMap.tw;
                                skin.anchor.y = skin.sph / _this.mMap.th;
                            }
                            /*
                            else {
                                skin.anchor.x = skin.spw / _this.mMap.tw;
                                skin.anchor.y = skin.sph / _this.mMap.th;
 
                            }
                            */
                        //skin.offset.x = 40;
                        //skin.offset.y += (skin.sph - PIXI.utils.TextureCache[IMG_PATH + filename].height) * 2;
                        skin.rotation = rot * Math.PI / 180; //convert to radian
                    }
                    else {
                        skin.scale.x *= xflip;
                        skin.scale.y *= yflip;
                    }
                    skin.offset.x *= skin.scale.x;
                    var tokens = layer.name.split('-');
                    if (tokens[1] != null) {
                        var zadj = parseInt(tokens[1]);
                        if (!isNaN(zadj) && zadj > 0) {
                            coords.zAdjust = (zadj - 1) * 128;
                            //console.log('>>>>', layer.name, 'Adjust by ', zadj, coords.zAdjust);
                        }
                    }
                    //console.log(' LName = ', layer.name);
                    //skin.offset.x = (ts.tilewidth - mapData.tilewidth);
                    //skin.offset.y = -ts.tileheight;
                    var offsetX = 0;
                    var offsetY = 0;
                    if (ts.tileoffset) {
                        offsetX = ts.tileoffset.x;
                        offsetY = ts.tileoffset.y;
                    }
                    if (ts.imgTile) {
                        //window['__skin__'] = skin;
                        //console.log('tile offset = ', ts.tileoffset, skin.rotation);
                        skin.offset.x = offsetX - __this.mMap.tw / 2 + skin.spw / 2;
                        skin.offset.y = offsetY + __this.mMap.th / 2 - skin.sph / 2;
                    }
                    else {
                        skin.offset.x = offsetX - __this.mMap.tw / 2 + skin.spw / 2;
                        skin.offset.y = offsetY + __this.mMap.th / 2 - skin.sph / 2;
                    }
                    pos.z = _z;
                    //skin.offset.x += ts.tilewidth * 0.5;
                    //skin.offset.y -= ts.tileheight * 0.5;
                    //add layer offset
                    __this.tempData.totalMapProgress++;
                    var progressPC = __this.tempData.totalMapProgress / __this.tempData.totalMapData;
                    if (progressPC > __this.tempData.lastProgressPC + 0.01) {
                        __this.tempData.lastProgressPC = progressPC;
                        //console.log('% = ', totalMapProgress, totalMapData, lastProgressPC);
                        __this.trigger('mapProgress', progressPC);
                    }
                    /*
                    if (layer.offsetx) skin.offset.x += layer.offsetx;
                    if (layer.offsety) skin.offset.y += layer.offsety;


                    __this.ecs.createEntity(
                        coords,
                        pos,
                        new Components.CTile(),
                        skin
                    );
                    */
                    var findEnt = skin.layerId.startsWith('bg') ? undefined : __this.engine.mMap.entities.values.filter(e => e.coords.x == coords.x && e.coords.y == coords.y);
                    if (findEnt && findEnt.length > 0 && skin.layerId === findEnt[0].skin.layerId) {
                        //stack the tile to existing bottom tile
                        skin.offset.x = layer.offsetx - __this.tempData.layerIndex[findEnt[0].skin.layerName].offsetx;
                        skin.offset.y = layer.offsety - __this.tempData.layerIndex[findEnt[0].skin.layerName].offsety;
                        //console.log('offset fix coords ', coords);
                        //console.log('Offset fix x', skin.offset.x, layer.offsetx, __this.tempData.layerIndex[findEnt[0].skin.layerName].offsetx);
                        //console.log('Offset fix y', skin.offset.y, layer.offsety, __this.tempData.layerIndex[findEnt[0].skin.layerName].offsety);
                        if (!findEnt[0].skin.children)
                            findEnt[0].skin.children = [];
                        findEnt[0].skin.children.push(skin);
                    }
                    else {
                        //no existing tile on this spot, create a new one
                        if (layer.offsetx)
                            skin.offset.x += layer.offsetx;
                        if (layer.offsety)
                            skin.offset.y += layer.offsety;
                        __this.ecs.createEntity(coords, pos, new Components.CTile(), skin);
                    }
                }
            }
            loadMapCB(jsonFile, _x, _y, _z = 0, cb) {
                let sourceFile = jsonFile;
                //clean up path name , assume map ID = file name without extension
                var mapId = jsonFile.substr(0, jsonFile.lastIndexOf('.')).substr(jsonFile.lastIndexOf('/') + 1);
                const baseDirectory = Ezelia.utils.Path.getBaseDir(jsonFile);
                this.baseDirectory = baseDirectory;
                this.currentMap = mapId;
                if (!this.maps[mapId]) {
                    this.maps[mapId] = {
                        entities: {},
                        baseDirectory: baseDirectory
                    };
                }
                var game = {};
                var __this = this;
                var loader = this.resLoader;
                var grid = this.grid;
                __this.tempData.tsData = {};
                var assets = [];
                //var gridTs: any = {};
                this.mapsQueueSize++;
                loader.get(jsonFile, function (mapData) {
                    if (!mapData.layers)
                        return;
                    __this.mMap.tw = mapData.tilewidth;
                    __this.mMap.th = mapData.tileheight;
                    __this.mapWidth = mapData.width;
                    __this.mapHeight = mapData.height;
                    if (mapData.tilesets) {
                        for (var t in mapData.tilesets) {
                            var tileset = mapData.tilesets[t];
                            //special grid tileset
                            //console.log(' Loading tileset ', tileset.name);
                            //if (tileset.name == 'grid')
                            //gridTs = tileset;
                            //is this a tileset ?
                            if (tileset.image) {
                                __this.tempData.tsData[tileset.firstgid] = tileset;
                                //var filename = tileset.image.substring(tileset.image.lastIndexOf('/') + 1);
                                var url = Ezelia.utils.Path.resolve(baseDirectory + tileset.image); //IMG_PATH + filename;// + '?v=' + GAME_CONFIG.ver;
                                var id = this.genId(url);
                                //assets.push({ id: id, src: url, tw: tileset.tilewidth, th: tileset.tileheight });
                                //console.log('Queue ', url);
                                assets.push(url);
                                //continue;
                            }
                            else {
                                //is this a collection of images ?
                                if (tileset.tiles) {
                                    var tIdx = 0;
                                    for (var t in tileset.tiles) {
                                        var tsItem = tileset.tiles[t];
                                        //consider each image as separate tileset with single image
                                        //TODO : maybe we can optimize this
                                        var tsClone = JSON.parse(JSON.stringify(tileset));
                                        tsClone.image = tsItem.image;
                                        tsClone.imgTile = true;
                                        __this.tempData.tsData[tileset.firstgid + tIdx] = tsClone;
                                        //var filename = tsItem.image.substring(tsItem.image.lastIndexOf('/') + 1);
                                        var url = Ezelia.utils.Path.resolve(baseDirectory + tsItem.image); //IMG_PATH + filename;// + '?v=' + GAME_CONFIG.ver;
                                        var id = this.genId(url);
                                        //assets.push({ id: id, src: url, tw: tileset.tilewidth, th: tileset.tileheight });
                                        //console.log('Queue ', url);
                                        assets.push(url);
                                        tIdx++;
                                    }
                                }
                            }
                        }
                    }
                    var time = 1000;
                    loader.queue(assets, function () {
                        //loadingSplash.visible = false;
                        __this.tempData.tileWidth = mapData.tilewidth;
                        __this.tempData.tileHeight = mapData.tileheight;
                        __this.tempData.totalMapData = mapData.width * mapData.height;
                        __this.tempData.totalMapProgress = 0;
                        __this.tempData.lastProgressPC = 0;
                        /*
                        for (var l = 0; l < mapData.layers.length; l++) {
                            if (!mapData.layers[l].data) continue;
                            for (var i = 0; i < mapData.layers[l].data.length; i++) {
                                totalMapData++;
                            }
                        }
                        */
                        __this.tempData.layerIndex = {};
                        for (let layer of mapData.layers) {
                            if (layer.type === 'group') {
                                __this.engine.mRenderer.addLayer(layer.name);
                            }
                        }
                        for (let layer of mapData.layers)
                            __this.parseLayer(layer, _x, _y, _z);
                        //Layers loaded ==> register handlers
                        __this.mMap.loopActions((x, y, action) => {
                            const handler = __this.mapActionsHandlers[action.type];
                            if (handler instanceof Tiled.TiledMapActionHandler) {
                                handler.mapManager = __this;
                                handler.register(action, x, y);
                            }
                        });
                        __this.updateEntitiesVisibility();
                        __this.mapsQueueSize--;
                        if (__this.mapsQueueSize == 0) {
                            __this.trigger('mapsLoaded');
                            __this.tempData = {};
                            ////TODO automatically build this list from the layers order
                            //const sortOrder = ['bg', 'main'];
                            //__this.engine.mRenderer.stage.children.sort((c1, c2) => sortOrder.indexOf(c1.name) > sortOrder.indexOf(c2.name))
                            if (typeof cb == 'function')
                                cb();
                        }
                    });
                    loader.start();
                });
            }
            loadMap(jsonFile, _x, _y, _z = 0) {
                let resolveContext;
                var promise = new Promise((resolve, reject) => { resolveContext = resolve; });
                this.loadMapCB(jsonFile, _x, _y, _z, resolveContext);
                return promise;
            }
        }
        Tiled.TiledMapManager = TiledMapManager;
    })(Tiled = Ext.Tiled || (Ext.Tiled = {}));
})(Ext || (Ext = {}));
var Ext;
(function (Ext) {
    var Tiled;
    (function (Tiled) {
        class TiledMapActionHandler extends Ezelia.Iso.ActionHandler {
            constructor(mapManager) {
                super();
                this.mapManager = mapManager;
                this.charactersInArea = {};
            }
            register(action, x, y) {
                action.handler = this;
                this.onRegister(action, x, y);
                //
            }
            notifyIn(character, x, y, action) {
                if (!this.charactersInArea[character.entity.id]) {
                    this.charactersInArea[character.entity.id] = character;
                    character.addActionArea(action.id, action);
                    //this.trigger('characterEnter', action, character, x, y);
                    this.onCharacterEnter(character, x, y, action);
                }
            }
            notifyOut(character, x, y, action) {
                if (this.charactersInArea[character.entity.id]) {
                    this.charactersInArea[character.entity.id] = undefined;
                    character.removeActionArea(action.id);
                    //this.trigger('characterLeave', action, character, x, y);
                    this.onCharacterLeave(character, x, y, action);
                }
            }
            onRegister(action, x, y) {
                this.trigger('register', action, x, y);
            }
            onCharacterEnter(character, x, y, action) {
                //console.log('onCharacterEnter', this);
                this.trigger('characterEnter', character, x, y, action);
            }
            onCharacterLeave(character, x, y, action) {
                //console.log('onCharacterLeave', this);
                this.trigger('characterLeave', character, x, y, action);
            }
        }
        Tiled.TiledMapActionHandler = TiledMapActionHandler;
    })(Tiled = Ext.Tiled || (Ext.Tiled = {}));
})(Ext || (Ext = {}));
/// <reference path="../TiledMapActionHandler.ts" />
var Ext;
(function (Ext) {
    var Tiled;
    (function (Tiled) {
        class SpawnHandler extends Tiled.TiledMapActionHandler {
            constructor(mapManager) {
                super(mapManager);
                this.mapManager = mapManager;
            }
            register(action, x, y) {
                if (!this.mapManager)
                    return;
                //console.log('Spawn register ', action, x, y);
                if (action.properties.instanceType == 'Player') {
                    if (action.properties.asset) {
                        const assetFile = Ezelia.utils.Path.resolve(this.mapManager.baseDirectory + action.properties.asset);
                        const character = new Game.Character(this.mapManager.engine, x, y, assetFile, 0.5, 0.8);
                        this.mapManager.attachObject(character.entity);
                    }
                }
                action.handler = this;
                this.trigger('register', action, x, y);
            }
            onRegister(callback) {
                this.on('register', callback);
            }
            onCharacterEnter(callback) {
            }
        }
        Tiled.SpawnHandler = SpawnHandler;
    })(Tiled = Ext.Tiled || (Ext.Tiled = {}));
})(Ext || (Ext = {}));
var Ext;
(function (Ext) {
    var Tiled;
    (function (Tiled) {
        class EmitterHandler extends Tiled.TiledMapActionHandler {
            constructor(mapManager) {
                super(mapManager);
                this.mapManager = mapManager;
            }
            register(action, x, y) {
                if (!this.mapManager)
                    return;
                //console.log('Spawn register ', action, x, y);
                if (action.properties.data) {
                    Promise.resolve(JSON.parse(action.properties.data)).then(emitterData => {
                        const emitter = new Ezelia.Iso.EmitterObject(this.mapManager.engine, x, y, emitterData);
                        if (action.properties.scaleX)
                            emitter.entity['skin'].scale.x = action.properties.scaleX;
                        if (action.properties.scaleY)
                            emitter.entity['skin'].scale.y = action.properties.scaleY;
                        this.mapManager.attachObject(emitter.entity);
                    });
                }
                action.handler = this;
                this.trigger('register', action, x, y);
            }
            onRegister(callback) {
                this.on('register', callback);
            }
            onCharacterEnter(callback) {
            }
        }
        Tiled.EmitterHandler = EmitterHandler;
    })(Tiled = Ext.Tiled || (Ext.Tiled = {}));
})(Ext || (Ext = {}));
/// <reference path="../TiledMapActionHandler.ts" />
var Ext;
(function (Ext) {
    var Tiled;
    (function (Tiled) {
        class TeleportHandler extends Tiled.TiledMapActionHandler {
            constructor(mapManager) {
                super(mapManager);
                this.mapManager = mapManager;
            }
            register(action, x, y) {
                if (!this.mapManager)
                    return;
                //console.log('TeleportHandler register ', action, x, y);
                action.handler = this;
                //this.trigger('register', action, x, y);
            }
            onRegister(callback) {
            }
            onCharacterEnter(character, x, y, action) {
                return __awaiter(this, void 0, void 0, function* () {
                    const game = character.engine;
                    //const player: any = this.player;
                    console.log('character enter', x, y, action, character);
                    //game.mRenderer.loading = true;
                    //game.mMapManager.baseDirectory
                    const targetMap = Ezelia.utils.Path.resolve(game.mMapManager.baseDirectory + action.properties.targetMap.replace('.tmx', '.json'));
                    const targetMapId = targetMap.substr(0, targetMap.lastIndexOf('.')).substr(targetMap.lastIndexOf('/') + 1);
                    yield game.fadeTo(1, 250);
                    character.hide();
                    game.cursor.hide();
                    game.mCameraMoves.unfollow();
                    game.mMapManager.destroyMap();
                    game.mMapManager.hideAllMapsEntities();
                    yield game.mMapManager.loadMap(targetMap, 0, 0, 0);
                    character.setPos(parseInt(action.properties.targetX), parseInt(action.properties.targetY));
                    game.mCameraMoves.cameraEntity.pos.x = character.entity.pos.x;
                    game.mCameraMoves.cameraEntity.pos.y = character.entity.pos.y;
                    game.mCameraMoves.follow(character, 0.02, 0.05);
                    yield game.fadeTo(0, 500, 500);
                    game.cursor.show();
                    character.show();
                });
            }
        }
        Tiled.TeleportHandler = TeleportHandler;
    })(Tiled = Ext.Tiled || (Ext.Tiled = {}));
})(Ext || (Ext = {}));
var Game;
(function (Game) {
    var utils;
    (function (utils) {
        utils.Easing = {
            Linear: {
                None: function (k) {
                    return k;
                }
            },
            Quadratic: {
                In: function (k) {
                    return k * k;
                },
                Out: function (k) {
                    return k * (2 - k);
                },
                InOut: function (k) {
                    if ((k *= 2) < 1)
                        return 0.5 * k * k;
                    return -0.5 * (--k * (k - 2) - 1);
                }
            },
            Cubic: {
                In: function (k) {
                    return k * k * k;
                },
                Out: function (k) {
                    return --k * k * k + 1;
                },
                InOut: function (k) {
                    if ((k *= 2) < 1)
                        return 0.5 * k * k * k;
                    return 0.5 * ((k -= 2) * k * k + 2);
                }
            },
            Quartic: {
                In: function (k) {
                    return k * k * k * k;
                },
                Out: function (k) {
                    return 1 - (--k * k * k * k);
                },
                InOut: function (k) {
                    if ((k *= 2) < 1)
                        return 0.5 * k * k * k * k;
                    return -0.5 * ((k -= 2) * k * k * k - 2);
                }
            },
            Quintic: {
                In: function (k) {
                    return k * k * k * k * k;
                },
                Out: function (k) {
                    return --k * k * k * k * k + 1;
                },
                InOut: function (k) {
                    if ((k *= 2) < 1)
                        return 0.5 * k * k * k * k * k;
                    return 0.5 * ((k -= 2) * k * k * k * k + 2);
                }
            },
            Sinusoidal: {
                In: function (k) {
                    return 1 - Math.cos(k * Math.PI / 2);
                },
                Out: function (k) {
                    return Math.sin(k * Math.PI / 2);
                },
                InOut: function (k) {
                    return 0.5 * (1 - Math.cos(Math.PI * k));
                }
            },
            Exponential: {
                In: function (k) {
                    return k === 0 ? 0 : Math.pow(1024, k - 1);
                },
                Out: function (k) {
                    return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
                },
                InOut: function (k) {
                    if (k === 0)
                        return 0;
                    if (k === 1)
                        return 1;
                    if ((k *= 2) < 1)
                        return 0.5 * Math.pow(1024, k - 1);
                    return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
                }
            },
            Circular: {
                In: function (k) {
                    return 1 - Math.sqrt(1 - k * k);
                },
                Out: function (k) {
                    return Math.sqrt(1 - (--k * k));
                },
                InOut: function (k) {
                    if ((k *= 2) < 1)
                        return -0.5 * (Math.sqrt(1 - k * k) - 1);
                    return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
                }
            },
            Elastic: {
                In: function (k) {
                    var s, a = 0.1, p = 0.4;
                    if (k === 0)
                        return 0;
                    if (k === 1)
                        return 1;
                    if (!a || a < 1) {
                        a = 1;
                        s = p / 4;
                    }
                    else
                        s = p * Math.asin(1 / a) / (2 * Math.PI);
                    return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
                },
                Out: function (k) {
                    var s, a = 0.1, p = 0.4;
                    if (k === 0)
                        return 0;
                    if (k === 1)
                        return 1;
                    if (!a || a < 1) {
                        a = 1;
                        s = p / 4;
                    }
                    else
                        s = p * Math.asin(1 / a) / (2 * Math.PI);
                    return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
                },
                InOut: function (k) {
                    var s, a = 0.1, p = 0.4;
                    if (k === 0)
                        return 0;
                    if (k === 1)
                        return 1;
                    if (!a || a < 1) {
                        a = 1;
                        s = p / 4;
                    }
                    else
                        s = p * Math.asin(1 / a) / (2 * Math.PI);
                    if ((k *= 2) < 1)
                        return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
                    return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
                }
            },
            Back: {
                In: function (k) {
                    var s = 1.70158;
                    return k * k * ((s + 1) * k - s);
                },
                Out: function (k) {
                    var s = 1.70158;
                    return --k * k * ((s + 1) * k + s) + 1;
                },
                InOut: function (k) {
                    var s = 1.70158 * 1.525;
                    if ((k *= 2) < 1)
                        return 0.5 * (k * k * ((s + 1) * k - s));
                    return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
                }
            },
            Back2: {
                In: function (k) {
                    var s = 2.70158;
                    return k * k * ((s + 1) * k - s);
                },
                Out: function (k) {
                    var s = 2.70158;
                    return --k * k * ((s + 1) * k + s) + 1;
                },
                InOut: function (k) {
                    var s = 2.70158 * 1.525;
                    if ((k *= 2) < 1)
                        return 0.5 * (k * k * ((s + 1) * k - s));
                    return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
                }
            },
            Bounce: {
                In: function (k) {
                    return 1 - utils.Easing.Bounce.Out(1 - k);
                },
                Out: function (k) {
                    if (k < (1 / 2.75)) {
                        return 7.5625 * k * k;
                    }
                    else if (k < (2 / 2.75)) {
                        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                    }
                    else if (k < (2.5 / 2.75)) {
                        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                    }
                    else {
                        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                    }
                },
                InOut: function (k) {
                    if (k < 0.5)
                        return utils.Easing.Bounce.In(k * 2) * 0.5;
                    return utils.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
                }
            }
        };
    })(utils = Game.utils || (Game.utils = {}));
})(Game || (Game = {}));
var Game;
(function (Game) {
    var utils;
    (function (utils) {
        utils.Interpolation = {
            Linear: function (v, k) {
                var m = v.length - 1, f = m * k, i = Math.floor(f), fn = utils.Interpolation.Utils.Linear;
                if (k < 0)
                    return fn(v[0], v[1], f);
                if (k > 1)
                    return fn(v[m], v[m - 1], m - f);
                return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
            },
            Bezier: function (v, k) {
                var b = 0, n = v.length - 1, pw = Math.pow, bn = utils.Interpolation.Utils.Bernstein, i;
                for (i = 0; i <= n; i++) {
                    b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
                }
                return b;
            },
            CatmullRom: function (v, k) {
                var m = v.length - 1, f = m * k, i = Math.floor(f), fn = utils.Interpolation.Utils.CatmullRom;
                if (v[0] === v[m]) {
                    if (k < 0)
                        i = Math.floor(f = m * (1 + k));
                    return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
                }
                else {
                    if (k < 0)
                        return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
                    if (k > 1)
                        return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
                    return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
                }
            },
            Utils: {
                Linear: function (p0, p1, t) {
                    return (p1 - p0) * t + p0;
                },
                Bernstein: function (n, i) {
                    var fc = utils.Interpolation.Utils.Factorial;
                    return fc(n) / fc(i) / fc(n - i);
                },
                Factorial: (function () {
                    var a = [1];
                    return function (n) {
                        var s = 1, i;
                        if (a[n])
                            return a[n];
                        for (i = n; i > 1; i--)
                            s *= i;
                        return a[n] = s;
                    };
                })(),
                CatmullRom: function (p0, p1, p2, p3, t) {
                    var v0 = (p2 - p0) * 0.5, v1 = (p3 - p1) * 0.5, t2 = t * t, t3 = t * t2;
                    return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
                }
            }
        };
    })(utils = Game.utils || (Game.utils = {}));
})(Game || (Game = {}));
/// <reference path="easing.ts" />
/// <reference path="interpolation.ts" />
/**
 * This is a part of Tween.js converted to TypeScript
 *
 * Tween.js - Licensed under the MIT license
 * https://github.com/sole/tween.js
 */
var Game;
(function (Game) {
    var utils;
    (function (utils) {
        class Tween {
            //#endregion
            constructor(object) {
                this._valuesStart = {};
                this._valuesEnd = {};
                this._valuesStartRepeat = {};
                this._duration = 1000;
                this._repeat = 0;
                this._yoyo = false;
                this._isPlaying = false;
                this._reversed = false;
                this._delayTime = 0;
                this._startTime = null;
                this._easingFunction = utils.Easing.Linear.None;
                this._interpolationFunction = utils.Interpolation.Linear;
                this._chainedTweens = [];
                this._onStartCallback = null;
                this._onStartCallbackFired = false;
                this._onUpdateCallback = null;
                this._onCompleteCallback = null;
                this._onStopCallback = null;
                this._object = object;
                // Set all starting values present on the target object
                for (var field in object) {
                    if (typeof object[field] == 'object') {
                        this._valuesStart[field] = NaN;
                    }
                    else {
                        this._valuesStart[field] = parseFloat(object[field], 10);
                    }
                }
            }
            static getAll() {
                return this._tweens;
            }
            static removeAll() {
                this._tweens = [];
            }
            static add(tween) {
                this._tweens.push(tween);
            }
            static remove(tween) {
                var i = this._tweens.indexOf(tween);
                if (i !== -1) {
                    this._tweens.splice(i, 1);
                }
            }
            static update(time) {
                if (this._tweens.length === 0)
                    return false;
                var i = 0;
                time = time !== undefined ? time : window.performance.now();
                while (i < this._tweens.length) {
                    if (this._tweens[i].update(time)) {
                        i++;
                    }
                    else {
                        this._tweens.splice(i, 1);
                    }
                }
                return true;
            }
            to(properties, duration) {
                if (duration !== undefined) {
                    this._duration = duration;
                }
                this._valuesEnd = properties;
                return this;
            }
            start(time) {
                Tween.add(this);
                this._isPlaying = true;
                this._onStartCallbackFired = false;
                this._startTime = time !== undefined ? time : window.performance.now();
                this._startTime += this._delayTime;
                for (var property in this._valuesEnd) {
                    // check if an Array was provided as property value
                    if (this._valuesEnd[property] instanceof Array) {
                        if (this._valuesEnd[property].length === 0) {
                            continue;
                        }
                        // create a local copy of the Array with the start value at the front
                        this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);
                    }
                    this._valuesStart[property] = this._object[property];
                    if ((this._valuesStart[property] instanceof Array) === false) {
                        this._valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
                    }
                    this._valuesStartRepeat[property] = this._valuesStart[property] || 0;
                }
                return this;
            }
            stop() {
                if (!this._isPlaying) {
                    return this;
                }
                Tween.remove(this);
                this._isPlaying = false;
                if (this._onStopCallback !== null) {
                    this._onStopCallback.call(this._object);
                }
                this.stopChainedTweens();
                return this;
            }
            stopChainedTweens() {
                for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
                    this._chainedTweens[i].stop();
                }
            }
            isReversed() {
                return this._reversed;
            }
            delay(amount) {
                this._delayTime = amount;
                return this;
            }
            repeat(times) {
                this._repeat = times;
                return this;
            }
            yoyo(yoyo) {
                this._yoyo = yoyo;
                return this;
            }
            easing(easing) {
                this._easingFunction = easing;
                return this;
            }
            interpolation(interpolation) {
                this._interpolationFunction = interpolation;
                return this;
            }
            chain() {
                this._chainedTweens = arguments;
                return this;
            }
            onStart(callback) {
                this._onStartCallback = callback;
                return this;
            }
            onUpdate(callback) {
                this._onUpdateCallback = callback;
                return this;
            }
            onComplete(callback) {
                this._onCompleteCallback = callback;
                return this;
            }
            onStop(callback) {
                this._onStopCallback = callback;
                return this;
            }
            update(time) {
                var property;
                if (time < this._startTime) {
                    return true;
                }
                if (this._onStartCallbackFired === false) {
                    if (this._onStartCallback !== null) {
                        this._onStartCallback.call(this._object);
                    }
                    this._onStartCallbackFired = true;
                }
                var elapsed = (time - this._startTime) / this._duration;
                elapsed = elapsed > 1 ? 1 : elapsed;
                var value = this._easingFunction(elapsed);
                for (property in this._valuesEnd) {
                    var start = this._valuesStart[property] || 0;
                    var end = this._valuesEnd[property];
                    if (end instanceof Array) {
                        this._object[property] = this._interpolationFunction(end, value);
                    }
                    else {
                        // Parses relative end values with start as base (e.g.: +10, -3)
                        if (typeof (end) === "string") {
                            end = start + parseFloat(end, 10);
                        }
                        // protect against non numeric properties.
                        if (typeof (end) === "number") {
                            this._object[property] = start + (end - start) * value;
                        }
                    }
                }
                if (this._onUpdateCallback !== null) {
                    this._onUpdateCallback.call(this._object, value);
                }
                if (elapsed == 1) {
                    if (this._repeat > 0) {
                        if (isFinite(this._repeat)) {
                            this._repeat--;
                        }
                        // reassign starting values, restart by making startTime = now
                        for (property in this._valuesStartRepeat) {
                            if (typeof (this._valuesEnd[property]) === "string") {
                                this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property], 10);
                            }
                            if (this._yoyo) {
                                var tmp = this._valuesStartRepeat[property];
                                this._valuesStartRepeat[property] = this._valuesEnd[property];
                                this._valuesEnd[property] = tmp;
                            }
                            this._valuesStart[property] = this._valuesStartRepeat[property];
                        }
                        if (this._yoyo) {
                            this._reversed = !this._reversed;
                        }
                        this._startTime = time + this._delayTime;
                        return true;
                    }
                    else {
                        if (this._onCompleteCallback !== null) {
                            this._onCompleteCallback.call(this._object);
                        }
                        for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
                            this._chainedTweens[i].start(time);
                        }
                        return false;
                    }
                }
                return true;
            }
        }
        //#region Static part replacing TWEEN namespace from original tweenjs
        Tween._tweens = [];
        utils.Tween = Tween;
    })(utils = Game.utils || (Game.utils = {}));
})(Game || (Game = {}));
/// <reference path="../tween/Tween.ts" />
var Game;
(function (Game) {
    var modules;
    (function (modules) {
        class Tweener extends eee.System {
            update() {
                Game.utils.Tween.update();
                //if (Game.Tween.update())
                //    game.mRenderer.dirty = true;
            }
        }
        modules.Tweener = Tweener;
    })(modules = Game.modules || (Game.modules = {}));
})(Game || (Game = {}));
/// <reference path="../../lib/eee.d.ts" />
/// <reference path="../../lib/IsoEngine.all.d.ts" />
/// <reference path="../Tiled/eee/systems/TiledMapManager.ts" />
/// <reference path="../Tiled/TiledMapActionHandler.ts" />
/// <reference path="../Tiled/handlers/SpawnHandler.ts" />
/// <reference path="../Tiled/handlers/EmitterHandler.ts" />
/// <reference path="../Tiled/handlers/TeleportHandler.ts" />
/// <reference path="modules/Tweener.ts" />
/// <reference path="Character.ts" />
/// <reference path="Cursor.ts" />
var Game;
(function (Game) {
    var Systems = Ezelia.Iso.ECS.Systems;
    class RPG extends Ezelia.Iso.Engine {
        constructor(settings) {
            super(Object.assign({}, settings, { managedRenderer: false }));
            this.settings = settings;
            this.loader = new Ezelia.utils.ResourceLoader();
            this.characters = {};
            this.charactersByName = {};
            this._ready = false;
            this.readyList = [];
            this.actionsHandlers = {
                Spawn: new Ext.Tiled.SpawnHandler(),
                Emitter: new Ext.Tiled.EmitterHandler(),
                Teleport: new Ext.Tiled.TeleportHandler()
            };
            this.mMapManager = new Ext.Tiled.TiledMapManager(this, this.actionsHandlers);
            this.mCameraMoves = new Systems.CameraMoves(this);
            this.mTweener = new Game.modules.Tweener();
            this.ecs.insertSystem(this.mMapManager, 'MapManager', false);
            this.ecs.insertSystem(this.mCameraMoves, 'CameraMoves');
            this.ecs.insertSystem(this.mTweener, 'Tweener');
        }
        start(scene, callback) {
            super.start();
            const game = this;
            this.setupInputHandlers();
            this.sceneOverlay = PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gMCFgw45u2KIgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAACklEQVQI12P4DwABAQEAG7buVgAAAABJRU5ErkJggg==');
            this.sceneOverlay.tint = 0;
            var fgcontainer = game.mRenderer.addLayer('overlay', 1000, { skipGameRender: true });
            //game.mRenderer.stage.addChild(fgcontainer);
            game.sceneOverlay.width = game.mCamera.width;
            game.sceneOverlay.height = game.mCamera.height;
            fgcontainer.addChild(game.sceneOverlay);
            game.mRenderer.sortLayers();
            game.mMapManager.loadMap(scene.map.file, 0, 0, 0)
                .then(() => {
                //put the overlay on top of the other containers
                game.mRenderer.stage.addChild(fgcontainer);
                game.cursor = new Game.Cursor(this, 0, 0, './assets/cursor.json');
                game.cursor.entity.skin.offset.y = 8;
                //Create characters
                for (let charConfig of scene.characters) {
                    const character = game.addCharacter(charConfig);
                }
                game.controlCharacter(scene.mainplayer);
                return game.fadeTo(0, 500);
            })
                .then(() => {
                if (game.player) {
                    game.player.show();
                }
                for (let c in game.characters)
                    game.mRenderer.updateEntity(game.characters[c].entity);
                game.mRenderer.loading = false;
                game._ready = true;
                let cb;
                while (cb = game.readyList.pop()) {
                    cb();
                }
                if (typeof callback === 'function')
                    callback();
            });
        }
        ready(callback) {
            if (typeof callback !== 'function')
                return;
            if (this._ready) {
                callback();
                return;
            }
            this.readyList.push(callback);
        }
        fadeTo(value, time = 250, delay = 0) {
            this.mRenderer.sortLayers();
            let contextResolve;
            const promise = new Promise((resolve, reject) => {
                contextResolve = resolve;
            });
            const tween = new Game.utils.Tween(this.sceneOverlay);
            tween.to({ alpha: value }, time)
                .delay(delay)
                .easing(Game.utils.Easing.Linear.None);
            tween.onComplete(contextResolve);
            tween.start();
            return promise;
        }
        /**
         * Create a new character and add it to the game scene.
         * @param settings
         * @param setMain
         */
        addCharacter(settings, setMain = false) {
            const character = new Game.Character(this, settings.coords.x, settings.coords.y, settings.animCfg, settings.anchor.x, settings.anchor.y);
            const game = this;
            character.pathFinder = this.mMapManager.pathFinder;
            if (typeof settings.visible !== 'undefined' && settings.visible === false)
                character.hide();
            if (settings.name)
                character.entity.props.name = settings.name;
            this.characters[character.entity.id] = character;
            if (character.entity.props.name)
                this.charactersByName[character.entity.props.name] = character;
            if (settings.props) {
                character.entity.props.data = Object.assign({}, character.entity.props.data, settings.props);
            }
            if (typeof settings.tint === 'number') {
                character.entity.skin.tint = settings.tint;
            }
            if (settings.map) {
                this.mMapManager.attachObject(character.entity, settings.map);
            }
            if (setMain) {
                this.player = character;
                //this.player.show();
                //this.player.playAnimation('spawn');
                this.mCameraMoves.follow(game.player, 0.02, 0.05);
            }
            this.mMapManager.attachObject(character.entity, settings.map);
            return character;
        }
        /**
         * Make the character controllable
         * @param character
         */
        controlCharacter(character) {
            const game = this;
            let targetCharacter;
            if (character instanceof Game.Character) {
                if (!this.characters[character.entity.id]) {
                    this.characters[character.entity.id] = character;
                    if (character.entity.props.name)
                        this.charactersByName[character.entity.props.name] = character;
                }
                targetCharacter = character;
            }
            else if (typeof character === 'string') {
                targetCharacter = this.getCharacterByName(character);
            }
            if (targetCharacter) {
                this.player = targetCharacter;
                this.mCameraMoves.follow(game.player, 0.02, 0.05);
            }
        }
        getCharacterByName(name) {
            return this.charactersByName[name];
        }
        findPointedEntities(x, y) {
            const game = this;
            // check if we clicked any game entity
            const entities = game.mGameObject.entities.values.filter(e => {
                if (e.props.host instanceof Game.Cursor)
                    return false;
                const cx = (e.pos.x - game.mCamera.x) - (e.skin.width * (e.skin.anchor.x - 0.5));
                const cy = (e.pos.y - game.mCamera.y) - (e.skin.height * (e.skin.anchor.y - 0.5));
                let x1, y1, x2, y2;
                if (e.props && e.props.data && e.props.data.boundingBox) {
                    x1 = e.props.data.boundingBox.x1;
                    x2 = e.props.data.boundingBox.x2;
                    y1 = e.props.data.boundingBox.y1;
                    y2 = e.props.data.boundingBox.y2;
                }
                else {
                    //TODO : add box collider component;
                    const ow = e.skin.width;
                    const oh = e.skin.height;
                    x1 = -(ow / 2);
                    x2 = (ow / 2);
                    y1 = -(oh / 2);
                    y2 = (oh / 2);
                }
                return (x >= (cx + x1) / game.mCamera.scale &&
                    x <= (cx + x2) / game.mCamera.scale &&
                    y >= (cy + y1) / game.mCamera.scale &&
                    y <= (cy + y2) / game.mCamera.scale);
            });
            return entities;
        }
        setupInputHandlers() {
            const game = this;
            game.mInput.on('mousemove', function (x, y) {
                var iso = game.mMap.Scr2Iso(x * game.mCamera.scale + game.mCamera.x, y * game.mCamera.scale + game.mCamera.y);
                //try to handle cursor click on altittude map
                var alt = game.mMap.getAlt(iso.x + TPos.S.x, iso.y + TPos.S.y);
                //var alt = game.mMap.getAlt(iso.x, iso.y);
                if (alt >= game.mMap.th / 2) {
                    //var iso2 = game.mMap.Scr2Iso(x * game.mCamera.scale + game.mCamera.x, y * game.mCamera.scale + game.mCamera.y);
                    iso.x += TPos.S.x;
                    iso.y += TPos.S.y;
                    //console.log('alt click ');
                }
                //game.cursor.setPos(iso.x, iso.y);
            });
            //game.mInput.on('mousemove', function (x, y, event) {
            //    const player: any = game.player;
            //    const cursor: any = game.cursor;
            //    if (!player) return;
            //    // check if we clicked any game entity
            //    const entities = game.mGameObject.entities.values.filter(e => {
            //        if (e.props.host instanceof Cursor) return false;
            //        const cx = (e.pos.x - game.mCamera.x) - (e.skin.width * (e.skin.anchor.x - 0.5)) ;                    
            //        const cy = (e.pos.y - game.mCamera.y) - (e.skin.height * (e.skin.anchor.y - 0.5)) ;
            //        let x1, y1, x2, y2;
            //        if (e.props && e.props.data && e.props.data.boundingBox) {
            //            x1 = e.props.data.boundingBox.x1;
            //            x2 = e.props.data.boundingBox.x2;
            //            y1 = e.props.data.boundingBox.y1;
            //            y2 = e.props.data.boundingBox.y2;
            //        }
            //        else {
            //            //TODO : add box collider component;
            //            const ow = e.skin.width;
            //            const oh = e.skin.height;
            //            x1 = -(ow / 2);
            //            x2 = (ow / 2);
            //            y1 = -(oh / 2);
            //            y2 = (oh / 2);
            //        }
            //        //return (px >= x1 && px <= x2 && py >= y1 && py <= y2);
            //        return (
            //            x >= (cx + x1) / game.mCamera.scale &&
            //            x <= (cx + x2) / game.mCamera.scale &&
            //            y >= (cy + y1) / game.mCamera.scale &&
            //            y <= (cy + y2) / game.mCamera.scale
            //            );
            //        //return (
            //        //    px >= -ow * (1 - e.skin.anchor.x) && px <= ow * e.skin.anchor.x &&
            //        //    py >= -oh * (1 - e.skin.anchor.y) && py <= oh * e.skin.anchor.y);
            //    });
            //    if (entities.length > 0) {
            //        console.log(x, y, 'in ', entities);
            //        return;
            //    }
            //});
            game.mInput.on('mouseclick', function (x, y, event) {
                const entities = game.findPointedEntities(x, y);
                if (entities.length > 0) {
                    for (let entity of entities) {
                        if (entity.props && entity.props.host instanceof eee.EventHandler)
                            entity.props.host.trigger('click');
                    }
                    return;
                }
                const player = game.player;
                const cursor = game.cursor;
                if (!player)
                    return;
                var iso = game.mMap.Scr2Iso(x * game.mCamera.scale + game.mCamera.x, y * game.mCamera.scale + game.mCamera.y);
                //try to handle cursor click on altittude map
                var alt = game.mMap.getAlt(iso.x + TPos.S.x, iso.y + TPos.S.y);
                if (alt >= game.mMap.th / 2) {
                    //var iso2 = game.mMap.Scr2Iso(x * game.mCamera.scale + game.mCamera.x, y * game.mCamera.scale + game.mCamera.y);
                    iso.x += TPos.S.x;
                    iso.y += TPos.S.y;
                    //console.log('alt click ');
                }
                //console.log('click ', x, y, iso);
                game.trigger('tileClick', iso.x, iso.y);
                /*
                if (game.mMapManager.walkable(iso.x, iso.y)) {
                    cursor.setPos(iso.x, iso.y);
                    cursor.click();
                    player.moveTo(iso.x, iso.y);
                }
                */
            });
        }
    }
    Game.RPG = RPG;
})(Game || (Game = {}));
