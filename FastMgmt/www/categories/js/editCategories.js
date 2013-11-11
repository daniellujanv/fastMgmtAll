$(document).on("pageinit", getSettings);

function getSettings(){
	loadCategories();
}

function loadCategories(){
	var permanentStorage = window.localStorage;
	var numberCategories = permanentStorage.getItem("numberCategories");
	$("#cs_categories").text("");
	$("#cs_categories").append("<h1>Available Categories</h1>");
	for(var i = 0; i< numberCategories; i++){
		var category = permanentStorage.getItem("category_"+i);
		$("#cs_categories").append("<div id='lv_categories_"+i+"' data-role='collapsible' data-corners='false' data-collapsed='true'" +
				"data-collapsed-icon='arrow-d' data-expanded-icon='arrow-u' data-collapse-cue-text='"+category+"'>" +
						"<h1 id='h_"+i+"'>"+category+"</h1></div>");
		$("#lv_categories_"+i).append("<ul id='"+i+"' data-role='listview' data-icon='false' data-corners='false'></ul>");
		$("#"+i).append("<li data-icon='gear' id='rename_"+i+"' value='"+i+"' onClick=selectedCategory('rename','"+i+"') >"
				+ "<a href='renameCategory.html' data-rel='dialog'>Rename</a></li>");
		
		$("#"+i).append("<li data-icon='delete'  id='delete_"+i+"' value='"+i+"' onClick=selectedCategory('delete','"+i+"') >Delete</li>");
		$("#"+i).listview().listview("refresh");
	}
	$("#cs_categories").collapsibleset().collapsibleset("refresh");
}

function selectedCategory(action,id){
	if(action == "rename"){
		var tempStorage = window.sessionStorage;
		tempStorage.setItem("rename_category",id);
	}else{
		deleteCategory(id);
	}
}

function onClickRenameCategory(){
	var tempStorage = window.sessionStorage;
	var permanentStorage = window.localStorage;
	var category_id = tempStorage.getItem("rename_category");
	var newName = $("#name").val();
	permanentStorage.setItem("category_"+category_id, newName);
	$(".ui-dialog").dialog( "close" );
	alert("Saved!");
	window.location.replace("editCategories.html");	
}

function clearText(id){
	$("#"+id).attr("value","");
	$("#"+id).css("color","#000000");
}

function deleteCategory(id){
	if(confirm("Deleting the Category would erase the saved expenses")){
		var permanentStorage = window.localStorage;
		//expenses-category_#
		//category_#
		var numberCategories = parseInt(permanentStorage.getItem("numberCategories"));
		var category_expenses =  parseInt(permanentStorage.getItem("expenses-category_"+id));
		permanentStorage.setItem("spent",parseInt(permanentStorage.getItem("spent"))-category_expenses);
		var i = parseInt(id);
		for(i; i< numberCategories-1; i++){
			permanentStorage.setItem("category_"+i,permanentStorage.getItem("category_"+(i+1)));
			permanentStorage.setItem("expenses-category_"+i,permanentStorage.getItem("expenses-category_"+(i+1)));
		}
		permanentStorage.removeItem("category_"+numberCategories);
		permanentStorage.removeItem("expenses-category_"+numberCategories);
		permanentStorage.setItem("numberCategories", numberCategories-1);
		alert("Category Deleted!");
		window.location.replace("editCategories.html");			
	}
}