var config = {"iceServers":[{"url":"stun:stun.l.google.com:19302"}]}; //Stun server: will create a custom signalling server

var connection = {
	'optional':
		[{'DtlsSrtpKeyAgreement': true}, {'RtpDataChannels': true }]
};

var peerConnection = new webkitRTCPeerConnection(config, connection);

peerConnection.onicecandidate = function(e) {
    if (!peerConnection || !e || !e.candidate) return;
    sendNegotiation("candidate", event.candidate);
}

var dataChannel = peerConnection.createDataChannel("datachannel", {reliable: true}); //Create a reliable data channel for sending data

//EVENT HANDELLING
dataChannel.onmessage = function(e){console.log("DC message:" + e.data);};
dataChannel.onopen = function(){console.log("------ DATACHANNEL OPENED ------");};
dataChannel.onclose = function(){console.log("------- DC closed! -------")};
dataChannel.onerror = function(){console.log("DC ERROR!!!")};

var sdpConstraints = {'mandatory':
  {
    'OfferToReceiveAudio': false,
    'OfferToReceiveVideo': false
  }
};

peerConnection.createOffer(function (sdp) {
	peerConnection.setLocalDescription(sdp);
	sendNegotiation("offer", sdp);
	console.log("------ SEND OFFER ------");
}, null, sdpConstraints);

function processIce(iceCandidate){
  peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
}

function processAnswer(answer){
  peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  console.log("------ PROCESSED ANSWER ------");
};
