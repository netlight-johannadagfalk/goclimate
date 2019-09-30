import $ from 'jquery';

function initializeEditCard() {
  function scrollToAnchor(aid){
    var aTag = $(aid);
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
  };

  if($('#error_explanation').length) {
    scrollToAnchor('#error_explanation');
  };

  if($('#new-card-div').length) {
    $('#add-new-card').click(function(event) {
      event.preventDefault();
      $('#new-card-div').removeClass('hidden')
    });
  };

  $('#plan').on('change', function() {
    hideCurrentCard();
  });

  if($('#plan').length) {
    hideCurrentCard();
  };

  function hideCurrentCard(){
    if($('#plan').find(":selected").val() == "cancel") {
      $('#current-card-group').hide();
    } else {
      $('#current-card-group').show();
    }
  };

  function formFieldsJson(params) {
    var formParams = $('#payment-form')
      .serializeArray()
      .reduce(
        function(m,o) {
          m[o.name] = o.value;
          return m;
        }, {}
      )
    return $.extend({}, formParams, params)
  }

  function disableSubmit() {
    $('#button-spinner').removeClass('hidden')
    $('#register-button').prop('disabled', true);
  }

  function enableSubmit() {
    $('#button-spinner').addClass('hidden');
    if ($('#user_privacy_policy').length == 0 || $('#user_privacy_policy').is(':checked')) {
      $('#register-button').prop('disabled', false);
    }
  }

  if($('#card-element').length) {
    var stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
    var elements = stripe.elements();

    var style = {
      base: {
        // Add your base input styles here. For example:
        fontSize: '16px',
        iconColor: '#666EE8',
        color: '#31325F',
        lineHeight: '35px',
        fontWeight: 300,
        '::placeholder': {
          color: '#CFD7E0',
        },
      }
    };

    // Create an instance of the card Element
    var card = elements.create('card', {style: style, hidePostalCode: true});

    // Add an instance of the card Element into the `card-element` <div>
    card.mount('#card-element');

    card.addEventListener('change', function(event) {
      var displayError = $('#card-errors');
      if (event.error) {
        displayError.text(event.error.message);
      } else {
        displayError.text('');
      }
    });

    $('#payment-form').on('submit', function(event) {
      disableSubmit()

      if ($('#new-card-div').hasClass("hidden")) {
        // Not changing card - only plan
        $.post($('#payment-form').attr('action'),
          formFieldsJson({}),
          function(backendResponse) {
            if (backendResponse.error) {
              console.log(backendResponse.error)
              $('#error-content').text(backendResponse.error)
              enableSubmit()
            } else if (backendResponse.redirectTo) {
              window.location.href = backendResponse.redirectTo
            } else {
              enableSubmit()
              $('#error-content').text(backendResponse.error)
              console.log("Unexpected response from server")
            }
          })
      } else if ($('#new-card-div').length) {
        stripe.handleCardSetup($('#setup_intent_client_secret').val(), card)
          .then(function(result) {
            if (result.error) {
              $('#card-errors').text(result.error.message);
              enableSubmit();
            } else if (result.setupIntent.status === 'succeeded') {
              console.log(result.setupIntent)
              $.post($('#payment-form').attr('action'),
                formFieldsJson({ paymentMethodId: result.setupIntent.payment_method }),
                function(updateBackendResponse) {
                  if (updateBackendResponse.error) {
                    console.log(updateBackendResponse.error)
                    $('#error-content').text(updateBackendResponse.error)
                    enableSubmit()
                  } else if (updateBackendResponse.redirectTo) {
                    window.location.href = updateBackendResponse.redirectTo
                  } else {
                    enableSubmit()
                    $('#error-content').text(updateBackendResponse.error)
                    console.log("Unexpected response from server")
                  }
                });
            } else {
              $('#card-errors').text('Something went wrong, please try again')
              enableSubmit();
            }
          });
      }
      //https://stackoverflow.com/questions/1357118/event-preventdefault-vs-return-false
      return false;
    });
  }
};

window.initializeEditCard = initializeEditCard;
