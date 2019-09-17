import $ from 'jquery';
import CountUp from 'countup.js';

function initializeWelcome() {
  function planSum(){
    var food = parseInt($('#food').val());
    var car = parseInt($('#car').val());
    var flying = parseInt($('#flying').val());
    var base_cost = parseInt($('#base_cost').val());
    var people = parseInt($('#people').val());

    var tonne_co2 = parseFloat(gon.lifestyle_choice_co2[base_cost]) + parseFloat(gon.lifestyle_choice_co2[food]) + parseFloat(gon.lifestyle_choice_co2[car]) + parseFloat(gon.lifestyle_choice_co2[flying]);
    tonne_co2 = tonne_co2 * gon.lifestyle_choice_co2[people]
    var rounded_price_with_buffer = 0;

    if (gon.locale === 'en') {
      var price = tonne_co2 * gon.SEK_PER_TONNE / gon.SEK_PER_USD / 12;
      var rounded_price_with_buffer = Math.round((price * gon.BUFFER_SIZE) * 10) / 10;
      var price_per_tonne = Math.round((gon.SEK_PER_TONNE / gon.SEK_PER_USD) * 10) / 10;
    } else if (gon.locale === 'de') {
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
    $('#price-info-helper').attr('data-content', data_content);
    $('.popover-content').html(data_content);
    $('#custom-plan').attr('href', '/users/sign_up?choices=' + base_cost + ',' + food + ',' + car + ',' + flying + ',' + people);
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

  $('#total-carbon-offset').text('0');
  $('#total-users').text('0');
  $('#total-carbon-offset').appear();
  $('#total-users').appear();
  function countNumberUp(numberToCountUp){
    var separator;

    if (gon.locale == 'en') {
      separator = ',';
    } else {
      separator = ' ';
    }

    var options = {
      separator: separator
    };

    var numAnim = new CountUp(numberToCountUp, 1, $('#' + numberToCountUp).attr('data'), 0, 1, options);
    if (!numAnim.error) {
      numAnim.start();
    } else {
      console.error(numAnim.error);
    };
  }
  $('#total-carbon-offset').one('appear', function(event, _) {
    countNumberUp('total-carbon-offset');
  });
  $('#total-users').one('appear', function(event, _) {
    countNumberUp('total-users');
  });
};

window.initializeWelcome = initializeWelcome;
