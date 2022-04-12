'use strict'

var localVideo = document.querySelector('video#localvideo');
var remoteVideo = document.querySelector('video#remotevideo');

var btnStart = document.querySelector('button#start');
var btnCall = document.querySelector('button#call');
var btnHangup = document.querySelector('button#hangup');

var offerSdpTextarea = document.querySelector('textarea#offer');
var answerSdpTextarea = document.querySelector('textarea#answer');

var localStream;
var pc1;

function getMediaStream(stream){
	localVideo.srcObject = stream;
	localStream = stream;
}

function handleError(err){
	console.error('Failed to get Media Stream!', err);
}

//获取本地音视频流并使用video播放
function start(){

	if(!navigator.mediaDevices ||
		!navigator.mediaDevices.getUserMedia){
		console.error('the getUserMedia is not supported!');
		return;
	}else {
		var constraints = {
			video: true,
			audio: false
		}
		navigator.mediaDevices.getUserMedia(constraints)
					.then(getMediaStream)
					.catch(handleError);

		btnStart.disabled = true;
		btnCall.disabled = false;
		btnHangup.disabled = true;
	}
}

function getRemoteStream(e){
	remoteVideo.srcObject = e.streams[0];
}

function handleOfferError(err){
	console.error('Failed to create offer:', err);
}

function handleAnswerError(err){
	console.error('Failed to create answer:', err);
}

function getAnswer(desc){
	answerSdpTextarea.value = desc.sdp

	
	pc1.setRemoteDescription(desc);
}

function getOffer(desc){
	console.log(11111111111111, desc)
	//设置本地的描述信息
	pc1.setLocalDescription(desc);
	offerSdpTextarea.value = desc.sdp


}

function call(){
	//创建一个对等连接
	pc1 = new RTCPeerConnection();

	//监听候选人的信息变化
	pc1.onicecandidate = (e)=>{
		// 当 RTCPeerConnection通过RTCPeerConnection.setLocalDescription() (en-US)方法更改本地描述之后，该RTCPeerConnection会抛出icecandidate事件。
		// 监听这个事件需要将更改后的描述信息传送给远端RTCPeerConnection，
	}



// 方法将一个新的媒体轨道添加到轨道集，这些轨道将被传输给另一个对等点。
	localStream.getTracks().forEach((track)=>{
		pc1.addTrack(track, localStream);	
	});

	var offerOptions = {
		offerToRecieveAudio: 0, //是否向对方发送音频
		offerToRecieveVideo: 1
	}

	// 启动一个新的WebRTC去连接远程端点
	pc1.createOffer(offerOptions)
		.then(getOffer)
		.catch(handleOfferError);

	btnCall.disabled = true;
	btnHangup.disabled = false;
}

function hangup(){
	pc1.close();
	pc1 = null;

	btnCall.disabled = false;
	btnHangup.disabled = true;
}

btnStart.onclick = start;
btnCall.onclick = call;
btnHangup.onclick = hangup;
