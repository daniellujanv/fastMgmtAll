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

function clearText(id){
	$("#"+id).attr("value","");
	$("#"+id).css("color","#000000");
}
