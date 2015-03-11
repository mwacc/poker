// Init
$(function() {
	var owner = $('#page_owner_name').val()
	sessionId = $('#session_id').val() // global variable
	if( owner ) {
		// owner session, send registration message
		sendRegistrationMessage(owner)
	} 
});

$(window).unload(function() {
   // fire disconect there
});

//Socket.io
var socket = io();


function registerMember() {
	var member = $('#page_member_name').val()
	sendRegistrationMessage(member)
}

function sendRegistrationMessage(name) {
	$('#current_user').val(name)
	socket.emit('join', {'sessionId': sessionId, 'name': name});
}

function bid(value) {
	var name = $('#current_user').val();
	socket.emit('bid', {'sessionId': sessionId, 'name': name, 'bid': value});	
	$(".bid-button").attr("disabled", true);
}

function getUserId(name) {
	return "is"+name;
}

function newRound() {
	sessionId = $('#session_id').val()
	socket.emit('newRound',  {'sessionId': sessionId} )
}

socket.on('join', function(users){
	$('#names').empty();
	for(name in users)
		$('#names').append($('<li id="'+getUserId(name)+'">').text(name));
});

socket.on('bid', function(data){
	var sessionId = data['sessionId'];
	var name = data['name'];
	var bid = data['bid'];
	console.log('user '+name+' @ session '+sessionId+' made bid '+bid);		

	$("#"+getUserId(name)).append( "  "+bid );
});

socket.on('newRound', function(sessionId){
	$(".bid-button").attr("disabled", false);
});