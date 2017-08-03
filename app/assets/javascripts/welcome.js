$(document).ready(function() {

	function planSum(){
    	var food = parseInt($('#food').val());
    	var car = parseInt($('#car').val());
		var flying = parseInt($('#flying').val());
		var base_cost = parseInt($('#base_cost').val());
		
		var total = Math.round(parseFloat(gon.lifestyle_choice_prices[base_cost]) + parseFloat(gon.lifestyle_choice_prices[food]) + parseFloat(gon.lifestyle_choice_prices[car]) + parseFloat(gon.lifestyle_choice_prices[flying]));
		$('#sum').text(total);
		$('#custom-plan').attr("href", "/users/sign_up?choices=" + base_cost + "," + food + "," + car + "," + flying);
    };

    $('#food').change(function() {
  		planSum();
	});
	$('#car').change(function() {
  		planSum();
	});
	$('#flying').change(function() {
  		planSum();
	});

	//for faq links
	$('.panel-title a').on('click', function (e) {
	   window.location.hash = e.target.hash + "id";
	});
    var anchor = window.location.hash.replace("id", "");
    $(anchor).collapse('show');
});