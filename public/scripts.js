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
	socket.emit('join', {'sessionId': sessionId, 'name': name});
}

socket.on('join', function(users){
	$('#names').empty();
	for(name in users)
		$('#names').append($('<li>').text(name));
});