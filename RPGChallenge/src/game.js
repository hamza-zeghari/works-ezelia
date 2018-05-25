//Create game engine 
const game = new Game.RPG({	
    width: 960,
    height: 600 
});

//Disable game input for now, we'll re-enable them from gui.js when the player clicks Play button.
//when game inputs are disabled, the player cannot interact with the game elements (map, characters, ...etc), but he can still interact with GUI elements.
game.mInput.enabled = false;

//pause game rendering
game.mRenderer.paused = true;


//here we define a game scene (this is a specific format for our engine)
const scene = {
    map: { file: './assets/maps/map.json' },
    characters: [
        {
            name:'mainPlayer',
            animCfg: './assets/hero1-256x256.json',  
			tint: 0xEEDDDD,
            coords: {x:22, y:9},
            anchor: { x: 0.5, y: 0.8 },
            props: {
                boundingBox: { x1: -20, x2: 25, y1: -40, y2: 88 }
            }
        },
        {
            name:'NPC1',
            animCfg: './assets/hero1-256x256.json',   
			tint: 0xFF0000,
            coords: {x:22, y:14},
            anchor: { x: 0.5, y: 0.85 },
            props: {
                boundingBox: { x1: -20, x2: 25, y1: -40, y2: 88 }
            }
        },

         {
            name:'NPC2',
            animCfg: './assets/hero1-256x256.json',   
			tint: 0x008200,
            coords: {x:26, y:14},
            anchor: { x: 0.5, y: 0.85 },
            props: {
                boundingBox: { x1: -20, x2: 25, y1: -40, y2: 88 }
            }
        }
        
    ],
    mainplayer:'mainPlayer'
}



game.start(scene, () => {    
	//game engine is ready
	
	//get main player instance 
	const player = game.getCharacterByName('mainPlayer');
	
	//get NPC1 instance
	const npc1 = game.getCharacterByName('NPC1');
	const npc2 = game.getCharacterByName('NPC2');
	npc2.on('click',function (){
		game.mCameraMoves.follow(npc2);
		alert("alert");
		let npc2Dialog =showDialog2(
			"Hi there, where i will go ",
			[
			    {
					text:"move backward",
					Callback:function(){
						npc2.entity.coords.y--;
					    npc2.entity.coords.x;
					    npc2.moveTo(npc2.entity.coords.x,npc2.entity.coords.y++);
					   	game.mCameraMoves.follow(player);					
						game.mInput.enabled = true;
						npc2Dialog.destroy();

					}
				},			    {
					text:"move forward",
					Callback:function(){
						npc2.entity.coords.y++;
					    npc2.entity.coords.x;
					    npc2.moveTo(npc2.entity.coords.x,npc2.entity.coords.y--);
					   	game.mCameraMoves.follow(player);					
						game.mInput.enabled = true;
						npc2Dialog.destroy();

					}
				},			    {
					text:"move left",
					Callback:function(){
						npc2.entity.coords.y;
					    npc2.entity.coords.x--;
					    npc2.moveTo(npc2.entity.coords.x++,npc2.entity.coords.y);
					   	game.mCameraMoves.follow(player);					
						game.mInput.enabled = true;
						npc2Dialog.destroy();

					}
				},			    {
					text:"move right",
					Callback:function(){
						npc2.entity.coords.y;
					    npc2.entity.coords.x++;
					    npc2.moveTo(npc2.entity.coords.x--,npc2.entity.coords.y);
					   	game.mCameraMoves.follow(player);					
						game.mInput.enabled = true;
						npc2Dialog.destroy();

					}
				}

			]
			)
	})
	npc1.on('click', function () {
		game.mCameraMoves.follow(npc1); //points the camera at npc1
		
		let npc1Dialog = showDialog(
			"Hi there, could you tell me what's my colour ?", 
			
			
			'green', function() {
				console.log('green');
				
				const lbl = npc1Dialog.getChildByName('dlgLabel');
				lbl.text = 'Wrong answer !';
				
				setTimeout(()=> {
										
					game.mCameraMoves.follow(player);					
					game.mInput.enabled = true;
					npc1Dialog.destroy();
					
				}, 2000);

			}, 
			
			'red', function() {
				console.log('red');		
				const lb2 = npc1Dialog.getChildByName('dlgLabel');
				lb2.text = 'Good choice!';
				
				setTimeout(()=> {
										
					game.mCameraMoves.follow(player);					
					game.mInput.enabled = true;
					npc1Dialog.destroy();
					
				}, 3000);	


								
			}, 

		'bleu', function() {
				console.log('bleu');		
				const lb3 = npc1Dialog.getChildByName('dlgLabel');
				lb3.text = 'Bad choice!';
				
				setTimeout(()=> {
										
					game.mCameraMoves.follow(player);					
					game.mInput.enabled = true;
					npc1Dialog.destroy();
					
				}, 5000);	
				

								
			});


	})

});



//tileClick event is triggered when the user clicks a map tile, x and y contain the clicked coords 
game.on('tileClick', (x, y) => {
	if (game.mMapManager.walkable(x, y)) {
		
		//move cursor to the target position
		game.cursor.setPos(x, y);
		//play cursor click animation
		game.cursor.click();
		
		
		//move the game player to that position.
		game.player.moveTo(x, y);
	}		
});


//Custom action area handler
const DangerZoneHandler = new Ext.Tiled.TiledMapActionHandler(game.mMapManager);
DangerZoneHandler.on('characterEnter', (character, x, y, action) => {
    console.log('characterEnter DangerZoneHandler ');
    character.blink()
});

game.mMapManager.addActionHandler('DangerZone', DangerZoneHandler);

