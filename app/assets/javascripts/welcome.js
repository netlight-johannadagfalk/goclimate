$(document).ready(function() {

	function planSum(){
    	var food = parseInt($('#food').val());
    	var car = parseInt($('#car').val());
		var flying = parseInt($('#flying').val());
		var base_cost = parseInt($('#base_cost').val());

		var tonne_co2 = parseFloat(gon.lifestyle_choice_co2[base_cost]) + parseFloat(gon.lifestyle_choice_co2[food]) + parseFloat(gon.lifestyle_choice_co2[car]) + parseFloat(gon.lifestyle_choice_co2[flying]);
		var rounded_price_with_buffer = 0;
		
	    if (gon.locale == "en") {
	      var price = tonne_co2 * gon.SEK_PER_TONNE / gon.SEK_PER_DOLLAR / 12;
	      var rounded_price_with_buffer = Math.round((price * gon.BUFFER_SIZE)*10) / 10;
	      var price_per_tonne = Math.round((gon.SEK_PER_TONNE / gon.SEK_PER_DOLLAR)*10) / 10;
	      var footprint_x2 = Math.round(tonne_co2 * 10) * 2 / 10
	      tonne_c02 = Math.round(tonne_co2 * 10) / 10
	    } else {
	      var price = tonne_co2 * gon.SEK_PER_TONNE / 12;
	      var rounded_price_with_buffer = Math.ceil(price * gon.BUFFER_SIZE / 5) * 5;
	      var price_per_tonne = gon.SEK_PER_TONNE;
	      var footprint_x2 = Math.round(tonne_co2) * 2
	      tonne_c02 = Math.round(tonne_co2)
	    }

		var data_content = gon.price_info_popup_content.replace('%{footprint}', tonne_co2);
		data_content = data_content.replace('%{footprint_x2}', footprint_x2);
		data_content = data_content.replace('%{price_per_tonne}', price_per_tonne);
		data_content = data_content.replace('%{price_per_month}', rounded_price_with_buffer);

		$('.custom-plan-price #sum').text(rounded_price_with_buffer);
		$('#custom-ton').text(Math.round(tonne_co2, 2));
		$('.custom-plan-price .price-info-helper').attr('data-content', data_content);
		$('.popover-content').html(data_content);
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

    $(function () {
  		$('[data-toggle="popover"]').popover();
	})
});