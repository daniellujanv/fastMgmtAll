document.addEventListener('deviceready', onDeviceReady, false);
$(document).on("pageinit", getSettings);


function onDeviceReady(){
	var permanentStorage = window.localStorage;
	$.mobile.allowCrossDomainPages = true;
	$.support.cors = true;

//	setSettings(permanentStorage);
	getSettings(permanentStorage);
}

function getSettings(){
	var permanentStorage = window.localStorage;
	var firstTime = permanentStorage.getItem("firstTime");
	if(firstTime == null){
		permanentStorage.setItem("spent",0);
		permanentStorage.setItem("expenses-expenses",0);
		permanentStorage.setItem("numberCategories",0);
		window.location.replace("settings/settings.html");
	}else{
		permanentStorage.setItem("firstTime", false);
		loadCategories(permanentStorage);
		loadAmounts(permanentStorage);
		loadTrackingTime(permanentStorage);
	}
}

function loadCategories(permanentStorage){
	var endOfTracking = new Date(permanentStorage.getItem("endOfTracking"));
	var dateNow = new Date();
	if(dateNow > endOfTracking){
		alert("Date Overdue. Go to settings and start tracking again!");
		$("#fc_categories").remove();
		$("#btn_addCategory").remove();
	}else{
		var useCategories = permanentStorage.getItem("useCategories");
		if(useCategories == "yes"){
			var numberCategories = permanentStorage.getItem("numberCategories");
			if(numberCategories == null){
				permanentStorage.setItem("numberCategories","0");
				return;
			}else if(numberCategories > 0){
				//$("div.ui-header").append("<a href='../categories/editCategories.html' class='ui-btn-left' data-ajax='false' data-corners='false'" +
				//"data-theme='c' data-role='button' data-icon='gear'>Edit Categories</a>");
				
				$("#ul_categories").remove();
				$("#lv_categories .ui-collapsible-content").append("<ul id='ul_categories' data-role='listview' data-icon='false' data-corners='false'></ul>");

				for(var i = 0; i< numberCategories; i++){
					var expenses = permanentStorage.getItem("expenses-category_"+i);
					var category = permanentStorage.getItem("category_"+i);
					$("#ul_categories").append("<li id='category_"+i+"' value='"+category+"' onClick=selectedCategory('category_"+i+"') >"
							+ "<a href='expenses/addExpense.html' data-rel='dialog'>" 
							+ category.replace("_"," ")+"<p class='ui-li-aside ui-li-desc'>"+expenses+" DKK</p>" 
							+ "</a>"
							+ "</li>");
				}
				$("#ul_categories").listview().listview("refresh");
				$("#lv_categories").attr("data-collapse-cue-text","Available Categories");
				$("#h_selectCategory .ui-btn-text").text("Select Category to add Expense");
			}
		}else{
			var expenses = permanentStorage.getItem("expenses-expenses");
			$("#ul_categories").remove();
			$("#lv_categories .ui-collapsible-content").append("<ul id='ul_categories' data-role='listview' data-icon='false' data-corners='false'></ul>");
			$("#ul_categories").append(
					"<li id='expenses' value='expenses' " +
					"onClick=selectedCategory('expenses')>"
					+ "<a href='expenses/addExpense.html' data-rel='dialog'>Add Expense" +
					"<p class='ui-li-aside ui-li-desc'>"+expenses+" DKK</p>" +
					"</a>"
//					+ category
					+ "</li>"
			);
			$("#ul_categories").listview().listview("refresh");
			$("#lv_categories").attr("data-collapse-cue-text","No Categories");
			$("#h_selectCategory .ui-btn-text").text("Click to add Expense");		
			$("#btn_addCategory").remove();
		}
	}
}

function loadAmounts(permanentStorage){
	var amount = permanentStorage.getItem("amount");
	var spent = permanentStorage.getItem("spent");
	if(amount != "" && amount != null){
		$("#ipt_selectedAmount").val( amount +" DKK");
	}else{
		$("#ipt_selectedAmount").val("0 DKK");
	}
	if(spent != "" && spent != null){
		$("#ipt_leftAmount").val(spent + " DKK");
	}else{
		$("#ipt_leftAmount").val("0 DKK");
	}
	if(parseInt(spent) > parseInt(amount)){
		$("#ipt_leftAmount").css("color","#ff4400");
	}
}

function loadTrackingTime(permanentStorage){
	try{
		var time  = (permanentStorage.getItem("trackingTime")).split("_");
		$("#h_timeExpenses").text(time[0]+ " Expenses");
		var date = new Date(time[1]);
		$("#h_startingFrom").text("Since: "+ dateToString(date));
	}catch(err){
		$("#h_timeExpenses").text("Tracking Time: Not Selected!");
	}

}

function dateToString(date){
	var days = {1:'Monday',2:'Tuesday',3:'Wednesday',4:'Thursday',5:'Friday',6:'Saturday',7:'Sunday'};
	var months = {1:'January',2:'February',3:'March',4:'April',5:'May',6:'June',7:'July',8:'August',9:'September',10:'October',11:'November',12:'December'};
	var newdate = new Date(date);
	var afterDate = (newdate.getDate() == 1)? 'st': 'th';
	var toString =  newdate.getDate()+afterDate+" of "+months[newdate.getMonth()]+" "+newdate.getFullYear()+" "+
					newdate.getHours()+":"+newdate.getMinutes()+":"+newdate.getSeconds();
	return toString;
}

function selectedCategory(category){
	console.log("selectedCategory "+category);
	var tempStorage = window.sessionStorage;
	tempStorage.setItem("selected_category",category);
}

function clearText(id){
	$("#"+id).attr("value","");
	$("#"+id).css("color","#000000");
}

function addCategory(){
	window.location.replace("categories/addCategory.html");
}

function onClickAddExpense(){
	var expense = parseInt($("#newExpense").val());
	if(expense == "" || expense == "Amount..." || isNaN(expense) || expense < 0){
		alert("Insert an amount to save!");
	}else{
		saveExpense(expense);
		$(".ui-dialog").dialog( "close" );
	}
}

function saveExpense(amount){
	var permanentStorage = window.localStorage;
	var tempStorage = window.sessionStorage;
	var category = tempStorage.getItem("selected_category");
	//adding expense to category
	console.log(category);
	//expenses format: expenses-category_#,sumexpenses
	var expenses = permanentStorage.getItem("expenses-"+category);
	var newAmount = parseInt(expenses) + parseInt(amount);
	permanentStorage.setItem("expenses-"+category, newAmount);
	console.log("newamount "+newAmount);
	//adding expense to all
	var spent = permanentStorage.getItem("spent");
	var newSpent = parseInt(spent) + parseInt(amount);
	var trackingAmount = permanentStorage.getItem("amount");
	if(trackingAmount < newSpent){
		alert("WARNING!!!!!! \n You are over the tracking amount!");
		$("#ipt_leftAmount").css("color","#ff4400");
	}
	permanentStorage.setItem("spent", newSpent);
	console.log("newspent "+newSpent);
	//reload
	getSettings();
}

function onClickAddCategory(){
	var permanentStorage = window.localStorage;
	var category = $("#name").val();
	category = category.replace(" ","_");
	if(category == "" || category == "Name..." ){
		alert("Enter name of category first!");
	}else{
		var numberCategories = parseInt(permanentStorage.getItem("numberCategories"));
		permanentStorage.setItem("category_"+numberCategories,category);
		permanentStorage.setItem("expenses-category_"+numberCategories,"0");
		var newNumber = numberCategories + 1;
		permanentStorage.setItem("numberCategories",(numberCategories+1));
		alert("Category "+ category.replace("_"," ") +" added!");
		window.location.replace("../index.html");
	}
}
