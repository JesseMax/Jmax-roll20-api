/* 
 * Version 0.1 
 * Made By Jesse Smith
 * Discord: DMJesseMax #2197
 * Roll20: https://app.roll20.net/users/2001966/jessemax
 * Github: https://github.com/JesseMax/Jmax-roll20-api
 * Reddit: https://www.reddit.com/user/DMJesseMax
 * Patreon: https://patreon.com/????
 * Paypal.me: https://www.paypal.me/JesseMax
*/

/* TODO
 * * * There is an error on max iinsperations per level
 * Check for Insperation Attribute, if none, add
 * Grab 'who' if not GM to use it as the second arg?
 ---- playerIsGM(playerid) is boolian to determine gm status
 *
 // --* Change chats to whispers, except player requests (Working)
 // --* Remove extra comments
 *
 * Help File

 * UPGRADES CONSIDERED/PLANNED
 *
 * --all to set all to a specific amount of Inspirations
 * --set to set to a specific amount (name/all check)
 * Tell player how many inspirations they have
 * Ability to use multiple Inspirations
 * (2) What multi Insp can do
 * Player can use own inspiration
 * Should error be an array? ['error', 'no name']?
 * Whisper/no Whisper group totals
 * Subtract Long Rest amounts
 *
 * DONE
 * Add or Subtract insperations
 * Remove log and extranious chat checks
 *
 * COMMANDS
 * !InspireMe 
 * without attributes will send whisper to GM with Inspiration totals
 * --group will send Inspiration totals to public chat
 * --use --<player name> will deduct 1 inspiration from player
 * --level display the level of the group
 * --confirmLevel will raise the level of the group
 * --inspAdd --<player name> adds an inspiration for the player
*/

 /* Globals
  * sendChat
  *
 */

/* Character	Replacement
 %	&#37;
)	&#41;
 ?	&#63;
@	&#64;
[	&#91; or &lbrack;
]	&#93; or &rbrack;


*/

 var InspireMe = InspireMe || (function() {
 	'use strict';

	const version = '0.1 beta';
	const lastUpdate = new Date(2021, 5, 23);

	const checkInstall = function() {
		log('-=> InspireMe v'+version+' <=- ['+lastUpdate+']');
	};

	function chatInsp(titleColor,myTitle,inspContent,isGM, msgFrom, isWhisper) {

		var myWhisper = isWhisper;
		var amGM = isGM;
		var myWhisper = '';

		if (isWhisper && amGM){
			var myWhisper = '/w gm ';
		};

		if (isWhisper && !amGM){
			var myWhisper = '/w '+msgFrom+ ' ';
		}

		let inspBorderStart = '<div style="border: 3px groove black; margin:2px 5px 0px -30px ; border-radius:9px; background-color: beige;">';
		let inspTitle = '<div style="font-weight: bold; text-align:center; background-color: #0E446C; border-bottom: 1px solid black;font-size: 130%;padding: 5px 3px;'+
						'color:'+titleColor+';">'+
						myTitle +
						'</div><div style="margin: 15px 7px 5px 7px;">';
		let inspBorderEnd = '</div></div>';	

		sendChat('Group Inspiration', myWhisper + inspBorderStart+inspTitle+inspContent+inspBorderEnd);

	};

	function getCharStandardAttributes(charid, attrName) {
		//Grabs Attribute specified in attrName

		const attrs = findObjs ({
			type: 'attribute',
			characterid: charid,
            name: attrName
		});

		return attrs[0];
	};

	function changeCharAttribute(attrName, newValue, changeType) {
		//Changes the value of current for attrName to the value of newValue

		const sheetInsp = findObjs({ type: 'character', name: 'Inspiration' })[0];
		var lowerAttr = attrName.toLowerCase();
		var changeAttr = findObjs({type: 'attribute', characterid: sheetInsp.id, name: lowerAttr }) [0];

		changeAttr.setWithWorker('current', newValue);

		var myReturn = getAttrByName(sheetInsp.id,attrName);

		return myReturn;
	};

	function playerAttribute(player) {
		//Grabs Name of Attribute for specific Player

		// Korey = Strength
		// Kevin = Dexterity
		// Carson = Constitution
		// Nicholas = Intelligence
		// Bethany = Wisdom

		var lplayer = player.toLowerCase();
		switch (lplayer){
			case 'korey':
				var playerAtt = 'Strength';
				break;
			case 'kevin':
				var playerAtt = 'Dexterity';
				break;
			case 'carson':
				var playerAtt = 'Constitution';
				break;
			case 'nicholas':
				var playerAtt = 'Intelligence';
				break;
			case 'bethany':
				var playerAtt = 'Wisdom';
				break;
			default:
				var playerAtt = 'Error';
				break;
		};
		return playerAtt;
	};

	
	const handleInput = (msg) => {
		// This is the main function

		if (msg.type !== 'api') return;
		if (msg.content.indexOf("!InspireMe") == -1) return;
		//above line should check to see if api call is for InspireMe

		const sheetInsp = findObjs({ type: 'character', name: 'Inspiration' })[0];
		//gets stats from charactersheet named Inspiration

		if (sheetInsp) {
			var koreyValue = getAttrByName(sheetInsp.id,'strength');
			var kevinValue = getAttrByName(sheetInsp.id,'dexterity');
			var carsonValue = getAttrByName(sheetInsp.id,'constitution');
			var nicholasValue = getAttrByName(sheetInsp.id,'intelligence');
			var bethanyValue = getAttrByName(sheetInsp.id,'wisdom');
			var sheetLevelValue = getAttrByName(sheetInsp.id,'level');
			var maxInspirations = getAttrByName(sheetInsp.id,'pb');

		};

		
		//Potential Args
		// --all to set all to a certain level?
		// --set to set to a specific amount (name/all check)

		let args = msg.content.split(/\s+--/);
		let titleColor, inspTitle, inspContent, myError;
		var msgWhisper = false;

		let isGM = playerIsGM(msg.playerid);
		let msgFrom = msg.who;

		if (!args[1] && isGM) {
			//display the chart of Inspiration points

			titleColor = 'Yellow';
			inspTitle = 'Group Inspiration Totals';

			inspContent = '<div style="width:100%"><table style="margin: 0px 20px 5px 30px;width:40%"><tr><td>Duck</td><td style="text-align:center;">'+ carsonValue + '</td></tr>';
			inspContent = inspContent +'<tr><td>Edward</td><td style="text-align:center;">'+ kevinValue + '</td></tr>';
			inspContent = inspContent +'<tr><td>Erist</td><td style="text-align:center;">'+ koreyValue + '</td></tr>';
			inspContent = inspContent +'<tr><td>Ladd</td><td style="text-align:center;">'+ bethanyValue + '</td></tr>';
			inspContent = inspContent +'<tr><td>Sharo</td><td style="text-align:center;">'+ nicholasValue + '</td></tr></div>';

			inspContent = inspContent +'<div style="text-align:center;">Current Inspiration Maximum is: '+ maxInspirations +'</div>';
			
			var myWhisper = true;
			
			chatInsp(titleColor,inspTitle,inspContent, isGM, msgFrom, myWhisper);

		};

		if (!args[1] && !isGM) {
			titleColor = 'Yellow';
			inspTitle = 'Inspiration Total';

			inspContent = '<div style="width:100%"><table style="margin: 0px 20px 5px 30px;width:40%">';

			switch (msg.who) {
				case 'Erist':
					var playerValue = koreyValue;
					break;
				case 'Duck':
					var playerValue = carsonValue;
					break;
				case 'Kevin':
					var playerValue = kevinValue;
					break;
				case 'Nicholas P.':
					var playerValue = nicholasValue;
					break;
				case 'Bethany':
					var playerValue = bethanyValue;
					break;
				default:
					var playerValue = 'Error';
					break;
			};

			if (playerValue != 'Error') {
				inspContent = inspContent +'<tr><td>Inspiration</td><td style="text-align:center;">'+ playerValue + '</td></tr></div>';

			} else {

			inspContent = inspContent +'<tr><td>Error</td><td style="text-align:center;">Player total Not Found</td></tr></div>';
			};

			inspContent = inspContent +'<div style="text-align:center;">Current Inspiration Maximum is: '+ maxInspirations +'</div>';
			
			chatInsp(titleColor,inspTitle,inspContent, isGM, msgFrom, true);
		};

		if (args[1] != null && args[1] != '') {
			//grab the argument and parse to the correct thing todo


			
			// ** Check if it was sent by GM

			switch (args[1]) {
				// ** Would this be better to be indexOf?
				case 'level':
				// raise the level of all the characters
					var sheetLevel = findObjs({type: 'attribute', characterid: sheetInsp.id, name: 'level' }) [0];
					if ( sheetLevel ) {
						var sheetLevelValue = sheetLevel.get('current');
						var maxInspirations = getAttrByName(sheetInsp.id,'pb');
						//send chat with current level
					
						titleColor = 'Ivory';
						inspTitle = 'Group Level';
						inspContent = 'The group is currently at level '+ sheetLevelValue + '.<br>';
						inspContent = inspContent +'They have a maximum of '+ maxInspirations + ' inspirations.';
						inspContent = inspContent +'<br><br>[Raise Level](!InspireMe --confirmLevel)';

						msgWhisper = true;

						// moved to end chatInsp(titleColor,inspTitle,inspContent);

						//prompt for level raise
						//raise level
					};
					break;
				
				case 'confirmLevel':
					//Move Obj from above and place here, use promoted variables in level?
					if (sheetInsp) {
						var baseAttr = getCharStandardAttributes(sheetInsp.id, 'base_level');
						var baseAttrValue = baseAttr.get('current');
						baseAttrValue = parseInt(baseAttrValue) + 1;
						
						//log(baseAttrValue);
						//log(baseAttr.get('current'));
						baseAttr.setWithWorker('current', baseAttrValue);

						titleColor = 'Ivory';
						inspTitle = 'New Group Level';
						inspContent = 'The group has been raised to level '+ baseAttrValue + '.<br>';
						inspContent = inspContent +'They have a maximum of '+ maxInspirations + ' inspirations.';

						// moved to end chatInsp(titleColor,inspTitle,inspContent);

					};
					break;
				case 'group':
				    titleColor = 'Yellow';
			inspTitle = 'Group Inspiration Totals';

			inspContent = '<div style="width:100%"><table style="margin: 0px 20px 5px 30px;width:40%"><tr><td>Duck</td><td style="text-align:center;">'+ carsonValue + '</td></tr>';
			inspContent = inspContent +'<tr><td>Edward</td><td style="text-align:center;">'+ kevinValue + '</td></tr>';
			inspContent = inspContent +'<tr><td>Erist</td><td style="text-align:center;">'+ koreyValue + '</td></tr>';
			inspContent = inspContent +'<tr><td>Ladd</td><td style="text-align:center;">'+ bethanyValue + '</td></tr>';
			inspContent = inspContent +'<tr><td>Sharo</td><td style="text-align:center;">'+ nicholasValue + '</td></tr></div>';

			inspContent = inspContent +'<div style="text-align:center;">Current Inspiration Maximum is: '+ maxInspirations +'</div>';
			
			var myWhisper = false;
			
			//chatInsp(titleColor,inspTitle,inspContent, isGM, msgFrom, myWhisper);
			break;
				    
				case 'inspAdd':
					// grab args[2] for the player name, no player name, error, then return.
					if (!args[2]) {
						myError = 'noName';
						break;
					};

					var attToChange = playerAttribute(args[2]);
					
					if (attToChange === 'Error') {
						myError = 'noName';
						break;
						
					}

					var inspChange = getAttrByName(sheetInsp.id,attToChange);
					var newInspValue = parseInt(inspChange) + 1;
					var inspMax = parseInt(maxInspirations);

					if (newInspValue < inspMax+1){

						let changedInsp = changeCharAttribute(attToChange, newInspValue);

						titleColor = 'Ivory';
						inspTitle = 'Inspiration Added';
						inspContent = 'Player now has '+ changedInsp + ' Inspirations.<br>';
						inspContent = inspContent +'The current maximum is '+ maxInspirations + '.';
						
					} else {
						titleColor = 'Red';
						inspTitle = 'Error';
						inspContent = '<div style="text-align:center;">Player has '+ inspChange + ' Inspirations.<br>';
						inspContent = inspContent +'The current maximum is '+ maxInspirations + '.';
						inspContent = inspContent +'<br><br><span style="color:red;font-weight:bold;">Inspiration was not added.</span></div>';

					};
					var msgWhisper = true;

					break;
				case 'inspRemove':
					//fall through
				case 'use':
					// grab args[2] for the player name no player name, error, then return.
					if (!args[2]) {
						myError = 'noName';
						break;
					};

					var attToChange = playerAttribute(args[2]);
					//check attToChange for Value

					if (attToChange === 'Error') {
						myError = 'noName';
						break;
						
					};
					
					var inspChange = getAttrByName(sheetInsp.id,attToChange);
					var newInspValue = parseInt(inspChange) - 1;
					var inspMax = parseInt(maxInspirations);

					if (newInspValue > -1){

						let changedInsp = changeCharAttribute(attToChange, newInspValue);

						titleColor = 'Ivory';
						inspTitle = 'Inspiration Removed';
						inspContent = 'Player now has '+ changedInsp + ' inspirations.<br>';
						inspContent = inspContent +'Current maximum: '+ maxInspirations + '.';

					} else {
						titleColor = 'Red';
						inspTitle = 'Error';
						inspContent = '<div style="text-align:center;">Player does not have any Inspirations.<br>';
						inspContent = inspContent +'<br><span style="color:red;font-weight:bold;">No Inspiration was removed.</span></div>';

					};
					var msgWhisper = true;

					break;
				default:
					titleColor = 'Red';
					inspTitle = 'Nothing Happened';
					inspContent = "<div style='text-align:center;'>If you expected something, it didn't happen.</div>";
					
					break;


			};

			if (myError === 'noName') {
				titleColor = 'Red';
				inspTitle = 'Error';
				inspContent = '<div style="text-align:center;">Player name was not specified or could not be found.</div>';

			};

			chatInsp(titleColor,inspTitle,inspContent,isGM, msgFrom, msgWhisper);

		};
	};

/*

//HP Attribute Modification
//type "!modHP" to decrease HP
on("chat:message", function(msg) {
     if(msg.type == "api" && msg.content.indexOf("!modHP ") !== -1) {
          var numdice = msg.content.replace("!modHP ", "");
          var attribObj = findObjs({ type: 'attribute', characterid: character.id, name: "Hit Points" })[0];
          if (attribObj) {
               var hp = attribObj.get('current') -1;
               attribObj.set('current', hp);
          } 
     }
});

/*
	const helpFile = '<div style="border:3px solid black; padding: 1em;border-radius: 9px;margin:2px 5px 0px -30px;background-color:white;"><h1 style="margin-bottom: 0px;margin-top:0px;">CritCards</h1><p style="font-size: 75%; margin-top: 0px;">'+version+'</p>'+
	                '<p>This is a Roll20 API script that will choose a random result from a set of damage and effects. It is intended to be used to increase the enjoyment of the game when a Critical Hit or Miss is rolled by a player.</p>'+
					'<h3 style="margin-bottom: 0px; color: gray;">Caution</h3>'+
					'<p style="margin-top: 0px;">This is a homebrew effect. Other than additional damage dice for critical hits, consequences and critical fails are not a part of the 5e ruleset. Additionally, as certain characters rise in level they have more potential to roll critical hits and auto fails as a part of their turn. Use caution when applying this homebrew effect to high level characters.</p>'+
					'<hr />'+
					'<h2>Basic usage</h2>'+
					'<p>The script can be called using the following syntax:</p>'+
					'<pre><code>!CritCards --options Attack&nbsp;Type</code></pre>'+
					'<h3>Options</h3>'+
					'<p>Here, you supply either hit or miss to indicate what style of card will be drawn. If neither is supplied, the script will return this help message.</p>'+
					'<h3>Attack Type</h3>'+
					'<p>What attack type was the character or monster performing? Choose any of the standard 3 types of attack: melee, range, or magic.</p>'+
					'<p>If no type is specified, the system will return the last type used or, if none was used, it will default to melee.</p>'+
					'<h3>Example</h3>'+
					'<p>Suppose that the barbarian swings his sword, attacking the dragon and rolls a Natural 20. The command would be</p>'+
					'<pre><code>!CritCards --hit melee</code></pre>'+
					'<p>Note that the -- is only needed for the hit or miss command, not the attack type.</p>'+
					'<hr />'+
					'<h2>Card Results</h2>'+
					'<p>Cards will indicate hit or miss and contain the attack type.</p>'+
					'<p>Hit cards will then indicate the damage that should be calculated. (see below)</p>'+
					'<p>The Card will then add flavor text and indicate what extra effect, if any should happen.</p>'+
					'<p><strong>Note:</strong> Some cards will indicate that dice need to be rolled for some elements (like number of rounds the effect will last). The dice do not currently auto roll, this is planned for a future update.</p>'+
					'<h3>Additional Damage</h3>'+
					'<p>The damage section of the CritCards <strong><em>replaces&nbsp;</em></strong>the rule of doubling your dice damage and adding a modifier. Types of damage rolls include:</p>'+
					'<ul>'+
					'<li>'+
					'<strong>Critical Roll</strong>&nbsp;This is the most prevelant and is the normal double the attack dice and add your modifier roll.'+
					'</li>'+
					'<li>'+
					'<strong>Critical Roll +extra</strong>&nbsp;This adds additional damage on top of the normal critical roll. Double your damage dice, add the modifier, then add the additional dice to the roll.'+
					'</li>'+
					'<li>'+
					'<strong>Double Critical</strong>&nbsp;Instead of doubling your dice, roll 4 sets of damage dice and add your modifier.'+
					'</li>'+
					'<li>'+
					'<strong>Normal Damage</strong> Roll normal damage. In these cases the effect will add additional damge that will likely exceed normal critical rolls.'+
					'</li>'+
					'</ul></div>';
	*/
	


	const registerEventHandlers = function() {
		on('chat:message', handleInput);
	};

	on("ready", () => {
		checkInstall();
		registerEventHandlers();
	
	});

 }());

//else {
//						errors.push(`No character named ${name} found.`);
//						return null;

// CSS TABLE
			//var inspContentCSS = '<style>.col{float:left;width:50%;padding:10px;}.row:after{content:"";display:table;clear:both;}</style>';
			//var inspContent = '<div style="width:100%;display:table;margin: 10px 20px 5px 30px;"><div style="display:table-row-group;"><div style="display:table-row;"><div style="display:table-cell;">Duck</div><div style="display:table-cell;">'+ carsonValue + '</div></div>';
			//inspContent = inspContent +'<div style="display:table-row;"><div style="display:table-cell;">Edward</div><div style="display:table-cell;">'+ kevinValue + '</div></div>';
			//inspContent = inspContent +'<div style="display:table-row;"><div style="display:table-cell;">Erist</div><div style="display:table-cell;">'+ koreyValue + '</div></div>';
			//inspContent = inspContent +'<div style="display:table-row;"><div style="display:table-cell;">Ladd</div><div style="display:table-cell;">'+ bethanyValue + '</div></div>';
			//inspContent = inspContent +'<div style="display:table-row;"><div style="display:table-cell;">Sharo</div><div style="display:table-cell;">'+ nicholasValue + '</div></div></div>';

			//inspContent = inspContent +'<div style="text-align:center;">Current Insperation Maximum is: '+ maxInspirations +'</div>';

			//[Attack Roll](!attackroll &#64;{target|token_id} &#91;[1d6+&#63;{Bonus|0}]&#93;)


