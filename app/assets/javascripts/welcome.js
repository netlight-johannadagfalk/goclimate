import $ from 'jquery';

function initializeWelcome() {
  var signUpUrl = $('#custom-plan').attr('href').split('?')[0];

  function planSum(){
    var food = parseInt($('#food').val());
    var car = parseInt($('#car').val());
    var flying = parseInt($('#flying').val());
    var base_cost = parseInt($('#base_cost').val());
    var people = parseInt($('#people').val());

    var tonne_co2 = parseFloat(gon.lifestyle_choice_co2[base_cost]) + parseFloat(gon.lifestyle_choice_co2[food]) + parseFloat(gon.lifestyle_choice_co2[car]) + parseFloat(gon.lifestyle_choice_co2[flying]);
    tonne_co2 = tonne_co2 * gon.lifestyle_choice_co2[people]
    var rounded_price_with_buffer = 0;

    if (gon.currency === 'usd') {
      var price = tonne_co2 * gon.SEK_PER_TONNE / gon.SEK_PER_USD / 12;
      var rounded_price_with_buffer = Math.round((price * gon.BUFFER_SIZE) * 10) / 10;
      var price_per_tonne = Math.round((gon.SEK_PER_TONNE / gon.SEK_PER_USD) * 10) / 10;
    } else if (gon.currency === 'eur') {
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
    data_content = data_content.replace('%{price_per_tonne}', gon.currency_prefix + price_per_tonne + gon.currency_suffix);
    data_content = data_content.replace('%{price_per_month}', gon.currency_prefix + rounded_price_with_buffer + gon.currency_suffix);

    $('.custom-plan-price #sum').text(rounded_price_with_buffer);
    $('#price-info-helper').attr('data-content', data_content);
    $('.popover-content').html(data_content);
    $('#custom-plan').attr('href', signUpUrl + '?choices=' + base_cost + ',' + food + ',' + car + ',' + flying + ',' + people);
  };

  var impactCalculatorFields = document.querySelectorAll('#food, #car, #flying, #people');

  for (var i = 0; i < impactCalculatorFields.length; i++) {
    impactCalculatorFields[i].addEventListener('change', function() {
      planSum();
    });
  }

  planSum();

  $('[data-toggle="popover"]').popover();

  //cursor: pointer; fixes iOS bootstrap tooltip bug: https://github.com/twbs/bootstrap/issues/16028;
  $('#price-info-helper').on('show.bs.popover', function () {
    $('body').css('cursor', 'pointer');
  });
  $('#price-info-helper').on('hide.bs.popover', function () {
    $('body').css('cursor', 'default');
  });

  function scrollToAnchor(elementSelector) {
    var element = document.querySelector(elementSelector);
    element.scrollIntoView({behavior: "smooth", block: "center"});
  };

  var scrollToAnchorButtons = document.getElementsByClassName('im-in-button');
  for (var i = 0; i < scrollToAnchorButtons.length; i++) {
    scrollToAnchorButtons[i].addEventListener('click', function(event) {
      event.preventDefault();
      scrollToAnchor(event.target.hash);
    });
  }
};

window.initializeWelcome = initializeWelcome;
