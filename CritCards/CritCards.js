/* 
 * Version 0.2.01 Beta
 * Made By Jesse Smith
 * Discord: DMJesseMax #2197
 * Roll20: https://app.roll20.net/users/2001966/jessemax
 * Github: https://github.com/JesseMax/Jmax-roll20-api
 * Reddit: https://www.reddit.com/user/DMJesseMax
 * Patreon: https://www.patreon.com/gameswithdad
 * Paypal.me: https://www.paypal.me/JesseMax
 * Buy Me Coffee: https://www.buymeacoffee.com/JesseMax
*/

/* TODO
 *
 * Error Coding for someone sending one of the non 3 attack types
 * Create --help
 * Check attack type instead of defaulting to prevent an error
 * autoroll effect dice
 * /whisper help - need to figure out how to get player id/display name
 * 
*/

 /* Globals
  *sendChat
  *
 */

 /*
  * 0.1.4 Beta
  *   Fixed typo in concussion fail that caused message not to load.
  * 0.2.0 Beta
  *   Added sanity check to make sure !CristCards is being called
 */

 var CritCards = CritCards || (function() {
 	'use strict';

	const version = '0.2.01 Beta';
	const lastUpdate = new Date(2021, 4, 27);

	const checkInstall = function() {
		log('-=> CritCards v'+version+' <=- ['+lastUpdate+']');
	};

	const chooseCritHit = {
		melee: ["Sweep the legs@@C@@The target must make a DC 16 Dex saving throw. On a failed save, the target is knocked prone.",
				"Sliced tendon@@+@@The target's speed is reduced to 0 until the target's next turn.",
				"Vexing Cut@@C@@The target must make a DC 14 Con saving throw. On a failed save, the target cannot take reactions for 2d4 rounds.",
				"Knocked the wind out of 'em@@C@@The target adds 1 level of exhaustion.",
				"Blow to the head@@C@@Your target cannot take reactions until the start of your next turn.",
				"Surprise opening@@C@@You get one free attack against the target with a 1d4 penalty against your attack.",
				"Lean into the blow@@D@@In the process you drop your weapon. (You may use a bonus action to pick it up.)",
				"Concussion@@C@@Your allies have advantage on attacks against this target until the end of your next turn."],
//				"Nighty Night.@@+@@ "],
		range: ["In the knee@@C@@The targets speed is reduced by 5 ft until they take a short rest.",
				"Resistance is futile@@C@@For 1d6 rounds: if the target is resistant to this damage type, it loses that resistance. If it is not resistant, it becomes vulnerable.",
				"Now you see it...@@6@@The target must make a DC 16 Dex saving throw. On a failed save, the target loses and eye.",
				"Distracted@@C@@The target's closest ally gets disadvantage on next action.",
				"Nice shot Tex!@@C@@The target drops their weapon. (They may use a bonus action to pick it up.)",
				"Lodged in the Arm@@C@@The target reduces its Strength Modifier by 1d4 until they are healed.",
				"And stay down@@C@@The target is knocked prone.",
				"Over reaction@@N@@The target provokes an all your allies within range, each can use their reaction to make a single attack againt your target. If no allies are in range, the target is Frightened of you for 1d4 +1 rounds.",
				"Found an opening@@C@@You have advantage on attacks against this target until you successfully hit them again."],
		magic: ["Surge of power@@C@@You may immediately cast the same spell against any target within range, expending a spell slot as normal.",
				"Surge of power@@C@@You may immediately cast the same spell against any target within range, this attack does not expend a spell slot.",
				"Guiding attack@@C@@The target has disadvantage on saving throws against your spells for 1d4 rounds.",
				"Body Snatcher@@C@@The target must make a DC 12 Chrisma saving throw. On a failed save, you may choose to teleport the target up to 20 ft in any direction except up or down. You must be able to see the destination.",
				"Oh my?@@C@@A CR 1/4 creature chosen by the DM appears within 30 ft of you. It is hostile only to your target.",
				"I love you, man@@N@@The target also reacts as if you had successfully cast suggestion.",
				"I don't feel so good@@C@@The target is poisoned for 1 d10 rounds.",
				"Confusion@@N@@Make 2 rolls on the Wild Magic table. You  choose the one that happens to your target. Then, make a saving throw (your spell attack vs your spell mod) on a successful save, regain a spell slot.",
				"Weakening@@C@@The armor the target is wearing gives no bonus to AC for 1d4 rounds."]
	}

	const chooseCritFail = {
		melee: ["Twisted your ankle@@ @@Your speed is reduced by 15 ft until you finish a short rest.",
				"Two left feet@@ @@You cannot take the Disengage action until the end of your next turn.",
				"Bad rebound@@ @@Your weapon bounces off your target and strikes you in the face. Take 1/2 the weapons damage & you have disadvantage on attacks next turn.",
				"Up my sleeve...@@ @@You become entangled in your target's clothing or armor and must make a DC 14 Dex or Str saving throw to get free. (free action at end of turn) Until you do so, you cannot disengage and their attacks against you are made with advantage.",
				"Flustered.@@ @@You cannot take reactions until the start of your next turn.",
				"Frighting recovery@@ @@If the target's next attack hits you, roll a DC 16 Wis save. On a failed save, you are frightened of them until the end of your next turn.",
				"Dizzy & Fatigued@@ @@For the next 1d4 rounds, make a DC 12 Con saving throw at the start of your turn. On a failed save, you are blinded for that turn.",
				"Cramp!@@ @@You take 1d4 penalty to your next attack roll.",
				"Off balance@@ @@All enemies that attack you before your next turn add 1d6 to their attack roll.",
				"Just a bit outside@@ @@You swing true but at the last moment your target pivots causing you to swing past them, throwing you off balance. -2 to any DEX saves until the start of your next turn."],
		range: ["Oops!@@ @@Reroll this attack against an ally within 10 ft. of the original target.",
				"Wrist Strain@@ @@If this attach was made with a thrown weapon, take 1D6 damage.",
				"Confusion@@ @@You don't add your proficiency bonus to your attacks for 1d4 rounds.",
				"Feeble@@ @@You do not add your damage bonus to your next attack.",
				"Twang!@@ @@Weapon Damage: If this attach was made with a bow or crossbow: roll a D10. On a 1-9 the weapons damage is reduced by 1d4 until repaired. On a 10, the string snaps rendering the weapon useless until it is repaired.",
				"Dust in your eye@@ @@Deal 1/2 damage on your next two attacks.",
				"Determined@@Y @@ou have advantage on your next attack against the target.",
				"Peek-a-boo@@ @@If you were hiding: your target sees you. Reroll your Stealth check with disadvantage.",
				"Poor sport@@ @@Your target taunts you. Make a DC 12 Wis saving throw. On a failed save, you have disadvantage when attacking this target until you successfully hit them.",
				"Adjusting the Angle@@ @@Your aim is true but your target turns just in time. Your projectile glances off their shoulder causeing no damage."],
		magic: ["Spaced....@@ @@Make a DC 16 Wisdom save against your spellcasting ability. On a failed save, you are unable to cast this spell again until you finish a long rest.",
				"What the what?@@ @@A creature (CR 1/2 your level) chosen by the DM appears within 30 ft of you. It is hostile to everyone.",
				"Power of Deduction@@ @@The target has advantage on saving throws against your spells for 1d4 rounds.",
				"Body Snatcher@@ @@You and the target must each make a DC 12 Chr saving throw. If either of your fail, your minds are  switched for 1d4 rounds. (or, if shorter, until the battle ends.)",
				"Oh my?@@ @@A creature (CR 1/4 your level) chosen by the DM appears within 30 ft of you. It is hostile only to you.",
				"This isn't the right spell@@ @@The DM rolls twice on the wild magic table & picks 1 result, which happens.",
				"Hoisted by your own petard@@ @@Until you take a short rest, you become vulnerable to the damage type of the spell you attempted to cast.",
				"Not what was meant@@ @@The target of your spell becomes resistant to the damage type of the spell for 1d4 rounds."]
	}

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

	const hitTypes = Object.keys(chooseCritHit);
	const failTypes = Object.keys(chooseCritFail);

	let kind, result, rn, atkType=0, crdTitle, crdType, crdText, errCode, parsedEffect;
	// without argument, attack type will default to melee to prevent system error
	

	function createCard(myTitle, myAttack, myEffect) {
		let eftDmg;
		if (myEffect.length > 0) {
			parsedEffect = myEffect.split("@@",3);
			//let eftTitle = parsedEffect[0];
			//let eftDmg = parsedEffect[1];
			switch(parsedEffect[1]) {
				case 'D':
					eftDmg = 'Double Critical';
					break;
				case '+':
					eftDmg = 'Critical Damge with 1 extra damage die';
					break;
				case '6':
					eftDmg = 'Critical Damge + 1D6 extra damage';
					break;
				case 'N':
					eftDmg = 'Normal Damage';
					break;
				case 'C':
				//fall through
				default:
					eftDmg = 'Critical Damage';
					break;

			}
			//let eftDmg = parsedEffect[1];

		}
		let titleColor = "white";
		if (myTitle==="Critical Miss") titleColor="red";
		let crdBorderBegin = '<div style="border: 3px groove black; margin:2px 5px 0px -30px ; border-radius:9px; background-color: white;">';
		let crdTitle = '<div style="font-weight: bold; text-align:center; background-color: #0E446C; border-bottom: 1px solid black;font-size: 130%;padding: 5px 3px;'+
						'color:'+titleColor+';">'+
						myTitle +
						'</div>';
		let crdContent = '<div style="text-transform:capitalize;text-align:center;margin-top:3px;font-weight: bold;">'+myAttack+' Attack</div>';
		if (myTitle === "Critical Hit"){
			crdContent = crdContent + '<div style="margin-top:2px;""><div style="float:right;text-align:center;margin:auto;width:50%;color:red;">'+eftDmg+'</div>'+'<div style="font-weight:bold;margin:auto;width:100%;padding-left:3px;text-align:center;">Damage:</div></div>';
		}
		crdContent = crdContent + '<div style="clear:both;margin-top:4px;padding:3px;font-style:italic;font-weight:bold;text-align:center;">'+parsedEffect[0]+'</div>';
		crdContent = crdContent + '<div style="margin:2px;padding:3px;">'+parsedEffect[2]+'</div>';
		let crdBorderEnd = '</div>';

		sendChat('CritCards', crdBorderBegin+crdTitle+crdContent+crdBorderEnd);
	};

	const handleInput = (msg) => {
		//get ChatUser Infor
		//var character = findObjs({ type: 'character', name: msg.who })[0],
	    //    player = getObj('player', msg.playerid),
	    //    message = msg;
	    //var who = msg.who;
	    //sendChat('Whispered by '+character+' to '+msg.target_name, msg.content);
	    //log(who);
	    //log(character);
	    //log(player);
	    //log(message);
	    //End chat pick up

		if (msg.type != 'api') return;
		if (msg.content.indexOf("!CritCards") == -1) return;
		//above line should check to see if api call is for CritCards

		let args = msg.content.split(/\s+--/);
			//sendChat('Check', 'args =' + args);

		let sanityCheck = args.shift();
		//sanityCheck should be !CritCards

		if(args.length > 0) {
			let cmds = args.shift().split(/\s+/);
				//sendChat('Check', 'cmds =' + cmds)

			switch (cmds[1]) {
				case 'melee':
					//fall through
				case 'Melee':
					atkType = 0;
					break;
				case 'range':
					//fall through
				case 'Range':
					atkType = 1;
					break;
				case 'magic':
					//fall through
				case 'Magic':
					atkType = 2;
					break;
				default:
				    //need error code to prevent non attack type from sending card
					break;
			}


			switch (cmds[0]) {
				case 'hit':
					//fall through
				case 'Hit':
					//do the hit stuff
					crdTitle = "Critical Hit";
					//crdType = hitTypes[atkType]; //Probably not needed
					crdText = chooseCritHit[hitTypes[atkType]];
					break;
				case 'miss':
					//fall through
				case 'fail':
				case 'Fail':
				case  'Miss':
					//do the miss stuff
					crdTitle = "Critical Miss";
					//crdType = failTypes[atkType]; //Probably not needed
					crdText = chooseCritFail[failTypes[atkType]];
					break;
				case 'help':
					sendChat('CritCards', helpFile);
					crdText ='';
					break;
				default:
					sendChat('CritCards', 'Your first command should be hit or miss.');
					crdText ='';
					break;
			}

			if (crdText.length > 0) {
				var rn = Math.floor(Math.random()*(crdText.length));
					//sendChat('Sanity Check', 'crdText.length is '+crdText.length);
				let crdEffect = crdText[rn];
				createCard(crdTitle, cmds[1], crdEffect);
			}


		}
		else {
		    sendChat('CritCards', 'Arguments are required.<br />Use -- to send arguments.');
		}

	}



	const registerEventHandlers = function() {
		on('chat:message', handleInput);
	};

	on("ready", () => {
		checkInstall();
		registerEventHandlers();
	
	});

 }());



/*function registerEventHandlers()
{
	on('chat:message',CritHit.handleChatMessage);

	Unbelieveboat
}
*/

