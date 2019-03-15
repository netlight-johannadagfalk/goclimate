$(document).ready(function() {
  function updateSum(){
    var employees = parseInt($('#number_of_employees').val());
    if (isNaN(employees)) {
      employees = 0;
    };

    var tonne_co2 = 22 * employees;

    if (gon.locale === 'en') {
      var price = tonne_co2 * gon.BUSINESS_SEK_PER_TONNE / gon.SEK_PER_USD / 12;
      price = Math.round(price).toLocaleString('en');
      var price_text = '$' + price + ' /month';
    } else if (gon.locale === 'de') {
      var price = tonne_co2 * gon.BUSINESS_SEK_PER_TONNE / gon.SEK_PER_EUR / 12;
      price = Math.round(price).toLocaleString('de');
      var price_text = price + ' €/month';
    } else {
      var price = tonne_co2 * gon.BUSINESS_SEK_PER_TONNE / 12;
      price = (Math.round(price / 100) * 100).toLocaleString('sv');
      var price_text = price + ' kr/månad';
    }

    $('.big-number').text(price_text);
  }

  $('#number_of_employees').on('input', function() {
    updateSum();
  });
  
  updateSum();
});
