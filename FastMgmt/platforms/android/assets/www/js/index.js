document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady(){
	var permanentStorage = window.localStorage;
//	setSettings(permanentStorage);
	getSettings(permanentStorage);
}

function getSettings(permanentStorage){
	var firstTime = permanentStorage.getItem("firstTime");
	if(firstTime == null){
		permanentStorage.setItem("firstTime", true);
		window.location.replace("settings/settings.html");
	}else{
		permanentStorage.setItem("firstTime", false);
	}
}