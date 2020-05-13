/* 
 * Version 0.0.1 
 * Made By Jesse Smith
 * Discord: DMJesseMax #2197
 * Roll20: https://app.roll20.net/users/2001966/jessemax
 * Github: https://github.com/JesseMax/Jmax-roll20-api
 * Reddit: https://www.reddit.com/user/DMJesseMax
 * Patreon: https://patreon.com/????
 * Paypal.me: https://www.paypal.me/JesseMax
*/

/* TODO
 * Check for Insperation Attribute, if none, add
 * Add or Subtract insperations
 * Set Maximum Insperations to prof level
 * Communicate how many insperations
 *
 * List all PCs & Insperation totals
 *
 * Help File
*/

 /* Globals
  *sendChat
  *
 */

 var InspireMe = InspireMe || (function() {
 	'use strict';

	const version = '0.0.1 ';
	const lastUpdate = new Date(2020, 4, 12);

	const checkInstall = function() {
		log('-=> InspireMe v'+version+' <=- ['+lastUpdate+']');
	};

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
	/*
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
		if (msg.type != 'api') return;

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
	*/


	const registerEventHandlers = function() {
		on('chat:message', handleInput);
	};

	on("ready", () => {
		checkInstall();
		registerEventHandlers();
	
	});

 }());



