$(document).ready(function() {

	function planSum(){
		var food = parseInt($('#food').val());
		var car = parseInt($('#car').val());
		var flying = parseInt($('#flying').val());
		var base_cost = parseInt($('#base_cost').val());
		var people = parseInt($('#people').val());

		var tonne_co2 = parseFloat(gon.lifestyle_choice_co2[base_cost]) + parseFloat(gon.lifestyle_choice_co2[food]) + parseFloat(gon.lifestyle_choice_co2[car]) + parseFloat(gon.lifestyle_choice_co2[flying]);
		tonne_co2 = tonne_co2 * gon.lifestyle_choice_co2[people]
		var rounded_price_with_buffer = 0;

		if (gon.locale === "en") {
			var price = tonne_co2 * gon.SEK_PER_TONNE / gon.SEK_PER_USD / 12;
			var rounded_price_with_buffer = Math.round((price * gon.BUFFER_SIZE) * 10) / 10;
			var price_per_tonne = Math.round((gon.SEK_PER_TONNE / gon.SEK_PER_USD) * 10) / 10;
		} else if (gon.locale === "de") {
			var price = tonne_co2 * gon.SEK_PER_TONNE / gon.SEK_PER_EUR / 12;
			var rounded_price_with_buffer = Math.round((price * gon.BUFFER_SIZE) * 10) / 10;
			var price_per_tonne = Math.round((gon.SEK_PER_TONNE / gon.SEK_PER_EUR) * 10) / 10;
		} else {
			var price = tonne_co2 * gon.SEK_PER_TONNE / 12;
			var rounded_price_with_buffer = Math.ceil(price * gon.BUFFER_SIZE / 5) * 5;
			var price_per_tonne = gon.SEK_PER_TONNE;
		}

		var data_content = gon.price_info_popup_content.replace('%{footprint}', Math.round(tonne_co2 * 10) / 10);
		data_content = data_content.replace('%{footprint_x2}', Math.round(tonne_co2 * 10) / 10 * 2);
		data_content = data_content.replace('%{price_per_tonne}', price_per_tonne);
		data_content = data_content.replace('%{price_per_month}', rounded_price_with_buffer);

		$('.custom-plan-price #sum').text(rounded_price_with_buffer);
		$('.custom-plan-price .price-info-helper').attr('data-content', data_content);
		$('.popover-content').html(data_content);
		$('#custom-plan').attr("href", "/users/sign_up?choices=" + base_cost + "," + food + "," + car + "," + flying + "," + people);
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
	$('#people').change(function() {
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
	});

	function scrollToAnchor(aid){
		var aTag = $(aid);
		$('html,body').animate({scrollTop: aTag.offset().top},'slow');
	};

	$('.im-in-button').on('click', function (e) {
		scrollToAnchor('#choose-plan');
	});
});
