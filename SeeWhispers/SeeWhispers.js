/* 
 * Version 0.0.1 Beta
 * Made By Jesse Smith
 * Discord: DMJesseMax #2197
 * Roll20: https://app.roll20.net/users/2001966/jessemax
 * Github: https://github.com/JesseMax/Jmax-roll20-api
 * Reddit: https://www.reddit.com/user/DMJesseMax
 * Patreon: https://patreon.com/????
 * Paypal.me: https://www.paypal.me/JesseMax
*/

/* This is a simple script that will allow the GM to see whispers between players and any whispers to the API.
* A future modification may add the ability to turn off API whispers.

/* TODO
 *
 * Choice of seeing API whispers
 * Shows 'speaking as' as the whisperer...can only the GM speak as someone else?
 * Testing needs to be done.
*/

 /* Globals
  *sendChat
  *
 */

 var SeeWhispers = SeeWhispers || (function() {
 	'use strict';

	const version = '0.0.1 Beta';
	const lastUpdate = new Date(2020, 3, 22);

	const handleInput = (msg) => {
		var who = msg.who;
		if('whisper' === msg.type && msg.target !='gm' && msg.playerid !=='API'){
			sendChat('See Whispers', '/w gm <b>'+who+' whipsered to '+msg.target_name+'</b><br>'+msg.content);
		}
	}

	const checkInstall = function() {
		log('-=> SeeWhispers v'+version+' <=- ['+lastUpdate+']');
	};

	const registerEventHandlers = function() {
		on('chat:message', handleInput);
	};

	on("ready", () => {
		checkInstall();
		registerEventHandlers();
	
	});

 }());



