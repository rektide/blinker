'use strict';

var stringEscape= require('js-string-escape')

var tab,
  ws,
  _ws

function prepWs(url){
	url= url || 'ws://localhost:7432/blinkerd'

	_ws= new WebSocket(url)
	_ws.onopen= (function(){
		if(ws){
			ws.onmessage= null
			ws.close()
		}
		ws= _ws
	})
	_ws.onmessage= handleBlinker
}
prepWs()

chrome.tabs.query({active: true}, function(results){
	if(results.length)
		tab= results[0]
	
})

function handleBlinker(msg){
	if(!tab)
		return
	if(ws){
		// relay the message back
		ws.send(JSON.stringify({command:msg}))
	}
	var code= ['console.log(eval("', stringEscape(msg), '"))'].join('')
	tab.executeScript(tab, {code: code}, function(results){
		// already returning over console pipe
	})
}

function handleConsole(msg){
	if(ws)
		ws.send(JSON.stringify(msg))
}

if(chrome.experimental && chrome.experimental.devtools && chrome.experimental.devtools.console && chrome.experimental.devtools.console.onMessagesAdded){
	chrome.experimental.devtools.console.onMessagesAdded.addEventListener(handleConsole)
}
