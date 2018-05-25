//Create a PixiJS container to host all our gui elements.
let guiContainer = new PIXI.Container();

//Create new layer for the game renderer and set its index to 100
let guiLayer = game.mRenderer.addLayer('GUI', 100, {skipGameRender:true});
//add the gui container to the created gui layer
guiLayer.addChild(guiContainer);



//Load EZGUI "metalworks" theme , then show the main gui screen
EZGUI.Theme.load(['./assets/metalworks-theme/metalworks-theme.json'], function () {
	console.log('GUI Theme ready');
	
	//show main gui screen
	setupMainGUI();
	
	//resume game rendering
	game.mRenderer.paused = false;

});




//===[ Gui Functions ] ===============================================================================

/**
* Create and show the main game GUI
*
*/
function setupMainGUI() {
	let mainScreen = EZGUI.create(mainScreenJSON, 'metalworks');
	guiContainer.addChild(mainScreen);
	
	EZGUI.components.playBtn.on('click', function() {
		//destroy mainscreen gui
		mainScreen.destroy();
		
		//enable game inputs : if we don't enable them, map clicks are ignored
		game.mInput.enabled = true;
						
	});				
}


/**
* This function create a dialog with two choices and return its corresponding instance.
* choice1Text : this text will be displayed as first choice1
* choice1Callback : this function will be called if the user clicks the first choice
* choice2Text : this text will be displayed as second choice1
* choice2Callback : this function will be called if the user clicks the second choice
*/ 
function showDialog(text, choice1Text, choice1Callback, choice2Text, choice2Callback , choice3Text, choice3Callback) {
	//clone our gui template definition
	const dialogJSON = JSON.parse(JSON.stringify(dialogJSONTemplate));
	dialogJSON.children[0].text = text;
	
	
	const dialogInstance = EZGUI.create(dialogJSON, 'metalworks');
	
	const choice1Btn = dialogInstance.getChildByName('choice1Btn');
	choice1Btn.text = choice1Text;
	choice1Btn.userData.callback = choice1Callback; //we store the callback function in the userData field 
	
	const choice2Btn = dialogInstance.getChildByName('choice2Btn');
	choice2Btn.text = choice2Text;
	choice2Btn.userData.callback = choice2Callback;

	const choice3Btn = dialogInstance.getChildByName('choice3Btn');
	choice3Btn.text = choice3Text;
	choice3Btn.userData.callback = choice3Callback;
	
	//bind button controls click event
	dialogInstance.bindChildrenOfType(EZGUI.Component.Button, 'click', function(evt, control) { //control argument contains the clicked button instance 
		
		if (control !== undefined && control.userData)
		{
			console.log('clicked', control.userData);
			
			//when a button is clicked, we check if its userData contains a callback 
			if (typeof control.userData.callback === 'function')
				control.userData.callback.call(dialogInstance);	//invoke the callback passing "dialogInstant" as "this" context.
			
			
			//once a choice is made (a button clicked), we hide all available buttons to prevent the user from making other choices.
			choice1Btn.visible = false;
			choice2Btn.visible = false;
			choice3Btn.visible = false;
		}

	});	
	
	
	
	guiContainer.addChild(dialogInstance);
	
	
	//disable game inputs
	game.mInput.enabled = false;
	
	return dialogInstance;
	
}
//====================================================================================================

function showDialog2(text,liste){
	const dialogJSON = JSON.parse(JSON.stringify(dialogJSONTemplate2));
	dialogJSON.children[0].text = text;
	const dialogInstance = EZGUI.create(dialogJSON, 'metalworks');
    var zar=[];
    console.log(typeof liste);
    	for(var i=0;i < liste.length;i++){
    
		zar[i]=dialogInstance.getChildByName("choice"+(i+1)+"Btn");
		zar[i].text = liste[i].text;
	    zar[i].userData.callback = liste[i].Callback;


	}
		dialogInstance.bindChildrenOfType(EZGUI.Component.Button, 'click', function(evt, control) { //control argument contains the clicked button instance 
		
		if (control !== undefined && control.userData)
		{
			console.log('clicked', control.userData);
			
			//when a button is clicked, we check if its userData contains a callback 
			if (typeof control.userData.callback === 'function')
				control.userData.callback.call(dialogInstance);	//invoke the callback passing "dialogInstant" as "this" context.
			
			
			//once a choice is made (a button clicked), we hide all available buttons to prevent the user from making other choices.
			for(var i=0; i<liste.lenght;i++){
				liste[i].visible=false;

			}
		}

	});	
	
	
	
	guiContainer.addChild(dialogInstance);
	
	
	//disable game inputs
	game.mInput.enabled = false;
	
	return dialogInstance;

}

//====[ GUI JSON Definitions ] =======================================================================
var mainScreenJSON = {
	id: 'mainScreen',
	component: 'Window',	
	padding: 4,
	position: { x: 0, y: 0 },
	width: game.mRenderer.canvas.width,
	height: game.mRenderer.canvas.height,

	layout: [1, 4],
	children: [
        {
            id: 'label1',
            text: 'Ezelia RPG Code Challenge #1',
            font: {
                size: '50px',
                family: 'Skranji',
                color: '#8f8'
            },
            component: 'Label',
            position: 'center',
            width: 600,
            height: 80
        },
		{
		  id: 'playBtn',
		  text: 'Play',
		  component: 'Button',
		  position: 'center',
            font: {
                size: '40px',
                family: 'Skranji',
                color: '#edd'
            },		  
		  width: 190,
		  height: 80
		}	
	]
}


var dialogJSONTemplate = {
	id: 'dialog',
	component: 'Window',	
	padding: 0,
	position: { x: 0, y: 0 },
	width: 300,
	height: 600,

	layout: [1,12], // layout 1,12 means : we create a gui component with 1 column and 12 rows
	children: [
        {
            name: 'dlgLabel',
            text: 'Default text',
            font: {
                size: '20px',
                family: 'Verdana',
                color: '#8f8',
				wordWrap:true,
				wordWrapWidth:280
            },
            component: 'Label',
            position: 'top center',
            width: 200,
            height: 150
        },
		null,
		null,
		{
		  name:'choice1Btn',
		  userData : {/*userData field will be used to store a callback associated to this button*/},
		  text: 'Choice1',
		  component: 'Button',
		  position: 'center',
		  
		  width: '100%',
		  height: 50
		},
		{
		  name:'choice2Btn',
		  userData : {},
		  text: 'Choice2',
		  component: 'Button',
		  position: 'center',
		  width: '100%',
		  height: 50
		},
		{
		  name:'choice3Btn',
		  userData : {},
		  text: 'Choice3',
		  component: 'Button',
		  position: 'center',
		  width: '100%',
		  height: 50
		}
	]
}

//====================================================================================================


var dialogJSONTemplate2 = {
	id: 'dialog',
	component: 'Window',	
	padding: 0,
	position: { x: 0, y: 0 },
	width: 300,
	height: 600,

	layout: [1,12], // layout 1,12 means : we create a gui component with 1 column and 12 rows
	children: [
        {
            name: 'dlgLabel',
            text: 'Default text',
            font: {
                size: '20px',
                family: 'Verdana',
                color: '#8f8',
				wordWrap:true,
				wordWrapWidth:280
            },
            component: 'Label',
            position: 'top center',
            width: 200,
            height: 150
        },
		null,
		null,
		{
		  name:'choice1Btn',
		  userData : {/*userData field will be used to store a callback associated to this button*/},
		  text: 'Choice1',
		  component: 'Button',
		  position: 'center',
		  
		  width: '100%',
		  height: 50
		},
		{
		  name:'choice2Btn',
		  userData : {},
		  text: 'Choice2',
		  component: 'Button',
		  position: 'center',
		  width: '100%',
		  height: 50
		},
		{
		  name:'choice3Btn',
		  userData : {},
		  text: 'Choice3',
		  component: 'Button',
		  position: 'center',
		  width: '100%',
		  height: 50
		}
		,
		{
		  name:'choice4Btn',
		  userData : {},
		  text: 'Choice4',
		  component: 'Button',
		  position: 'center',
		  width: '100%',
		  height: 50
		}
	]
}
