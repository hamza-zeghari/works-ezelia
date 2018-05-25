I assume that you know nodejs, Javascript (ES5 and ES6)
please use the latest version of Chrome browser to avoid compatibility issues.

Read the following carefully, and try to complete the five tasks.

If you can't complete them all, your application may still be considered, 
just send what you were able to do, and provide some source to help me evaluate your skills : github repo, source codes, personnal website ...etc

If you think you found a bug in my code, don't hesitate to drop my an email to contact@ezelia.com using subject : [Iso HTML5:bug] <your name>


Ready ? let's get started !


== Task I : start and discover the game ==

 - Open a terminal and go to the folder that contains the present README file

 - Install "static-server" globally using the following command : 
npm i static-server -g

 - Run the following command : 
static-server -p 8080 ./ 

 - Open chrome browser and go to : http://localhost:8080/ , you should see a game screen apearing with a "play" button.

 - click "play" to start, click on random spots to move your character.


Congratulations, you've completed the first task !

Note : since this first part is mandatory to get started, if you fail to run the game, you can contact me at contact@ezelia.com using subject "[Iso HTML5 : 1st Part] <your name>"
please don't contact me for information about how to install nodejs and what does localhost mean, you are supposed to know that stuff ;).



== Task II : Identify, understand and fix a bug ==
At this point, you'll need to open ./src/game.js and ./src/gui.js in your favorite code editor.
(hey sis/bro opening chrome dev tools is a good idea too ;)) 

the game code uses an internal engine based on Pixijs (http://www.pixijs.com/)
the gui code uses EZGUI library (http://ezgui.ezelia.com/)

 - Refresh the game page and click on the red character, a dialog apear and you can no more move your character.
 - Click on the first choice "green", the dialog text change to "wrong choice" then close, you can control your character again.
 - now click on the second choice "red" ... outch the dialog get stuck and you can't control your player anymore.
 
 ==> fix the code : 
   1 - When the player click "red" choice, change the dialog text to show "Good choice!", then close it after 3 seconds.
   2 - Make sure that the player can move his character again.
   3 - Make sure that the camera follows the main character.




== Task III : modify the code ==
in gui.js file, see how showDialog() Method works, and how it uses dialogJSONTemplate object.

showDialog creates a dialog box with two choices (it was used in the previous task to display "green" and "red" choices.

 1 - Modify showDialog to make it display three choices.
 2 - In game.js, modify the code in order to show three choices when clicking the red character, the third choice is up to you, use your imagination :)
 3 - Understand how NPC1 character is created, and create a NPC2 character colored in green and positionned at coords :{x:26, y:14}
 4 - Display an alert when NPC2 is clicked.

 
 
 

== Task IV : Enhance the code ==
 
in the previous step, you changed showDialog to display three choices, note that showDialog syntax is ugly, and the number of choices is hardcoded, let's fix this !

We want to create a better showDialog method (let's call it, showDialog2) that displays an arbitrary number of choices.
the method should be invoked this way : 

showDialog2("my text goes here", 
	[
	{text:"my choice1", callback : function() {/* my callback 1 */}},
	{text:"my choice2", callback : function() {/* my callback 2 */}},
	{text:"my choice3", callback : function() {/* my callback 3 */}},
        ...
	])

The method will never be called with less than one choice and more than 5 choices.

 1 - Create this method
 2 - When the player clicks NPC2, use showDialog2 to display the following choices : "move forward", "move backward", "move left" and "move right"
     Clicking each choice should move NPC2 by one step to the corresponding direction then close the dialog box.

     Hint : assuming that npc2 variables contains and instance of NPC2 character, you can get the current NPC2 corrds using npc2.entity.coords.x and pc2.entity.coords.y


== Task V : The most difficult one ==
Zip, tar or archive the code.
send it to contact@ezelia.com
use the following subject format : "[Iso HTML5 application] <your name>"


Congratulations, you did it !

