$(document).on("pageinit", getSettings);

function getSettings(){
	var permanentStorage = window.localStorage;
	var first = (permanentStorage.getItem("firstTime") == 'false')? false:true;
	if(!first){
		var endOfTracking = new Date(permanentStorage.getItem("endOfTracking"));
		var dateNow = new Date();
		if(dateNow > endOfTracking){
			window.localStorage.clear(); 
			permanentStorage.setItem("spent",0);
			permanentStorage.setItem("expenses-expenses",0);
			permanentStorage.setItem("numberCategories",0);
			window.location.replace('settings.html');
		}		
		$(".ui-header").append("<a href='../index.html' class='ui-btn-right' data-ajax='false' " +
				"data-corners='false' data-theme='c' data-role='button' data-icon='home'>Home</a>").trigger("create");
		$("#settings").append($("<div>Loading Settings...</div>").attr('id','loading'));
		loadSettings(permanentStorage);
		$("#loading").remove();  
	}
	$('#flip').change(function(event) {
		var startTrackingChanged = permanentStorage.getItem("startTrackingChanged");
		startTrackingChanged = (startTrackingChanged == 'true')? false : true;
		permanentStorage.setItem("startTrackingChanged",startTrackingChanged);
	});
}

function loadSettings(permanentStorage){
	var startTracking = permanentStorage.getItem("startTracking");
	var trackingTime_array = permanentStorage.getItem("trackingTime").split("_");
	var trackingTime = trackingTime_array[0];
	var amount = permanentStorage.getItem("amount");
	var useCategories = permanentStorage.getItem("useCategories");
	
	var mySwitch = $("select#flip");
	mySwitch[0].selectedIndex = (startTracking == "now")? 0: 1; //0 = now || 1 = before
	mySwitch.slider("refresh");

	onClickSelectedTrackingTime(trackingTime);
	$("#amount").val(amount+" DKK");
	if(useCategories == "yes"){
		$("#categories_yes").attr("checked",true).checkboxradio("refresh");
		$("#categories_no").attr("checked",false).checkboxradio("refresh");
		if(parseInt(permanentStorage.getItem("numberCategories")) > 0){
			$("div.ui-header").append("<a href='../categories/editCategories.html' class='ui-btn-left' data-ajax='false' data-corners='false'" +
			"data-theme='c' data-role='button' data-icon='gear'>Categories</a>").trigger('create');
		}
	}else{
		$("#categories_yes").attr("checked",false).checkboxradio("refresh");
		$("#categories_no").attr("checked",true).checkboxradio("refresh");
	}
}

function clearText(id){
	$("#"+id).val("");
	$("#"+id).css("color","#000000");
}

function onClickSelectedTrackingTime(id){
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
	var permanentStorage = window.localStorage;

	var trackingTime = $("#lv_trackingTime .ui-btn-up-b").attr("id");
	var errors = "";
	if(trackingTime == null){
		errors += "- Select a tracking time! \n";
	}
	var amount = parseInt($("#amount").val());
	if(amount == "" || amount == "Amount..." || isNaN(amount) || amount < 0){
		errors += "- Input valid amount! \n";
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
		// set starting time for tracking
		var startTrackingChanged = permanentStorage.getItem("startTrackingChanged");
		if(startTrackingChanged == 'true'){
			if(startTracking == "now"){
				trackingTime += "_"+ getDate();
			}else{
				trackingTime += "_"+getStartOfTime(trackingTime);
			}
		}else{
			try{
				var tempTrackingTime = (permanentStorage.getItem("trackingTime")).split("_");
				trackingTime += "_"+tempTrackingTime[1];
			}catch(err){ //trackingTime has not been stored yet
				if(startTracking == "now"){
					trackingTime += "_"+ getDate();
				}else{
					trackingTime += "_"+getStartOfTime(trackingTime);
				}	
			}
		}
		//fix categories amounts
		if(permanentStorage.getItem("firstTime") == 'false'){
			var useCategories = permanentStorage.getItem("useCategories");
			if(categories != useCategories){
				fixCategoriesAmounts(categories);
			}
		}
		
		permanentStorage.setItem("startTracking",startTracking);
		permanentStorage.setItem("startTrackingChanged",'false');
		permanentStorage.setItem("trackingTime", trackingTime);
		permanentStorage.setItem("amount", amount);
		permanentStorage.setItem("useCategories", categories);
		permanentStorage.setItem("endOfTracking",getEndOfTime(trackingTime));
		permanentStorage.setItem("firstTime", false);
		alert('Saved!');
		window.location.replace("../index.html");
		
		return;
	}
	alert("Something went wrong! Try again...");		
	window.location.replace("settings.html");
}

function getStartOfTime(trackingTimeArray){
	var trackingTime = trackingTimeArray.split("_");
	var date = new Date();
		if(trackingTime[0] == "Weekly"){
		date.setDate(date.getDate()-( (date.getDay() == 0)?6:1));
	}else if(trackingTime[0] == "Monthly"){
		date.setDate(1);
	}
	date.setHours(0,0,0,0);
	return(date.toLocaleString());
}

function getEndOfTime(trackingTimeArray){
	var trackingTime = trackingTimeArray.split("_");
	var date = new Date();
	if(trackingTime[0] == "Daily"){
		date.setDate(date.getDate() + 1);
	}else if(trackingTime[0] == "Weekly"){
		date.setDate(date.getDate()+( (date.getDay() == 0)?7:6));
	}else if(trackingTime[0] == "Monthly"){
		date.setMonth(date.getMonth()+1);
		date.setDate(1);
	}
	date.setHours(0,0,0,0);
	return(date.toLocaleString());
}

function fixCategoriesAmounts(categories){
	var permanentStorage = window.localStorage;
	var numberCategories = parseInt(permanentStorage.getItem("numberCategories"));

	if(categories == "yes"){ //switched from no categories -> yes categories
		var expenses_expenses = parseInt(permanentStorage.getItem("expenses-expenses"));
		permanentStorage.setItem("expenses-category_"+numberCategories, expenses_expenses);
		permanentStorage.setItem("category_"+numberCategories,"No Categories expenses");
		numberCategories = numberCategories+ 1;
		permanentStorage.setItem("numberCategories",numberCategories);
		permanentStorage.setItem("expenses-expenses",0);
	}else{ // switched from yes categories -> no categories
		var numberCategories = parseInt(permanentStorage.getItem("numberCategories"));
		var expenses = 0;
		for(var i=0; i< numberCategories; i++){
			var category_expenses = parseInt(permanentStorage.getItem("expenses-category_"+i));
			expenses = expenses+ category_expenses;
			permanentStorage.removeItem("expenses-category_"+i);
		}
		permanentStorage.setItem("numberCategories",0);
		var expenses_expenses = parseInt(permanentStorage.getItem("expenses-expenses")) + expenses;
		permanentStorage.setItem("expenses-expenses",expenses_expenses);
	}
}

function getDate(){
	return new Date();
}