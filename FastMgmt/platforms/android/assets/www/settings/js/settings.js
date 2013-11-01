$(document).on("pageinit", getSettings);

function getSettings(){
	var permanentStorage = window.localStorage;
	var first = (permanentStorage.getItem("firstTime") == 'false')? false:true;
//	alert(first + " -settings");
	if(!first){
		$("#settings").append($("<div>Loading Settings...</div>").attr('id','loading'));  
		loadSettings(permanentStorage);
		$("#loading").remove();  
	}
	
}

function loadSettings(permanentStorage){
	var startTracking = permanentStorage.getItem("startTracking");
	var trackingTime = permanentStorage.getItem("trackingTime");
	var amount = permanentStorage.getItem("amount");
	var categories = permanentStorage.getItem("categories");
	
	var mySwitch = $("select#flip");
	mySwitch[0].selectedIndex = (startTracking == "now")? 0: 1; //0 = now || 1 = before
	mySwitch.slider("refresh");

	onClickSelectedTrackingTime(trackingTime);
	$("#amount").val(amount+" DKK");
	if(categories == "yes"){
		$("#categories_yes").attr("checked",true).checkboxradio("refresh");
		$("#categories_no").attr("checked",false).checkboxradio("refresh");
	}else{
		$("#categories_yes").attr("checked",false).checkboxradio("refresh");
		$("#categories_no").attr("checked",true).checkboxradio("refresh");
	}
}

function clearText(id){
	$("#"+id).attr("value","");
	$("#"+id).css("color","#000000");
}

function onClickSelectedTrackingTime(id){
//	alert(id);
	$("#lv_trackingTime").children("li").addClass("ui-btn-up-c").removeClass("ui-btn-up-b");
	$("#"+id).removeClass("ui-btn-up-c").addClass("ui-btn-up-b");
	if(id == "day"){
		id = "Daily";
	}else if(id == "week"){
		id = "Weekly";
	}else if(id == "month"){
		id = "Monthly";
	}
	$("#h_selectTrackingTime span.ui-btn-text").text("Selected: "+id);

}

function onClickSaveBtn(){
	var trackingTime = $("#lv_trackingTime .ui-btn-up-b").attr("id");
	var errors = "";
	if(trackingTime == null){
		errors += "- Select a tracking time! \n";
	}
	var amount = $("#amount").val();
	if(amount == null || amount == "Amount..." ){
		errors += "- Input amount! \n";
	}
	var categories = $("input:checked").attr("id");
	if(categories == null){
		errors += "- Select use of categories! \n";
	}
	if(errors != ""){
		errors = "Something went wrong : \n" + errors;
		alert(errors);
		return;
	}else{
		var labels = $(".ui-slider").children(".ui-slider-label");
		var startTracking = "";
		for(var i= 0; i< 2; i++ ){
			var label = labels.eq(i);
			if(label.width() > 0){
				startTracking = (label.text() == "Starting now!")? "now" : "before";
			}
		}
		
		if(categories == "categories_yes"){
			categories = "yes";
		}else{
			categories = "no";
		}

		var permanentStorage = window.localStorage;
		permanentStorage.setItem("startTracking",startTracking);
		permanentStorage.setItem("trackingTime", trackingTime);
		permanentStorage.setItem("amount", amount);
		permanentStorage.setItem("categories", categories);
		alert('Saved!');
		window.location.replace("../index.html");
		return;
	}
	alert("Something went wrong! Try again...");		
	window.location.replace("settings.html");
}