$(document).ready(function() {

	function planSum(){
    	var food = $('#food').val();
    	var car = $('#car').val();
		var flight = $('#flight').val();
		var base_cost = $('#base_cost').val();
		var total = parseInt(base_cost) + parseInt(food) + parseInt(car) + parseInt(flight);
		console.log(total);
		$('#sum').text(total);
		$('#custom-plan').attr("href", "/users/sign_up?plan=" + total);
    };

    $('#food').change(function() {
  		planSum();
	});
	$('#car').change(function() {
  		planSum();
	});
	$('#flight').change(function() {
  		planSum();
	});
});