import $ from 'jquery';

function initializeUsersRegistrations() {
  function scrollToAnchor(aid){
    var aTag = $(aid);
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
  };

  if($('#error_explanation').length) {
    scrollToAnchor('#error_explanation');
  };
  $('#scroll-to-second-section').on('click', function (e) {
    scrollToAnchor('#second-section');
  });
  $('#scroll-to-third-section').on('click', function (e) {
    scrollToAnchor('#third-section');
  });

  if ($('#user_privacy_policy').length == 0 || $('#user_privacy_policy').is(':checked')) {
    $('#register-button').prop('disabled', false);
  } else {
    $('#register-button').prop('disabled', true);
  }

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

  function handleStripeSignUp(paymentMethod) {
    ga('send', {
      hitType: 'event',
      eventAction: 'commit'
    });
    // Submit the form
    $.post($('#payment-form').attr('action'),
      formFieldsJson({ paymentMethodId: paymentMethod.id }),
      function(backendResponse) {
        if (backendResponse.error) {
          console.log(backendResponse.error)
          $('#error-content').text(backendResponse.error)
          enableSubmit()
        } else if (backendResponse.redirectTo) {
          window.location.href = backendResponse.redirectTo
        } else if (backendResponse.paymentIntentClientSecret) {
          stripe.handleCardPayment(backendResponse.paymentIntentClientSecret)
            .then(function(stripeResponse) {
              if (stripeResponse.error) {
                enableSubmit()
                $('#card-errors').text(stripeResponse.error.message)
              } else {
                $.post(backendResponse.verifyPath,
                  formFieldsJson({
                    stripeCustomerId: backendResponse.stripeCustomerId,
                    paymentIntentId: stripeResponse.paymentIntent.id
                  }),
                  function(scaBackendResponse) {
                    if (scaBackendResponse.error) {
                      enableSubmit()
                      console.log(scaBackendResponse.error)
                      $('#card-errors').text(scaBackendResponse.error)
                    } else if (scaBackendResponse.redirectTo) {
                      window.location.href = scaBackendResponse.redirectTo
                      console.log('It worked with sca, redirecting to ' + scaBackendResponse.redirectTo)
                    } else {
                      enableSubmit()
                      $('#error-content').text(scaBackendResponse.error)
                      console.log("Unexpected response from server", scaBackendResponse)
                    }
                  })
              }
            })
        } else {
          enableSubmit()
          $('#error-content').text(backendResponse.error)
          console.log("Unexpected response from server", backendResponse)
        }
      }
    )
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
        displayError.text(event.error.message)
      } else {
        displayError.text('')
      }
    });

    $('#user_privacy_policy').click(function() {
      if ($('#user_privacy_policy').is(':checked')) {
        $('#register-button').prop('disabled', false);
      } else {
        $('#register-button').prop('disabled', true);
      }
    });

    $('#payment-form').on('submit', function(event) {
      disableSubmit()

      stripe.createPaymentMethod('card', card).then(function(result) {
        if (result.error || 
          ($('#email').val() !== undefined && $('#email').val().length === 0) || 
          ($('#password').val() !== undefined && $('#password').val().length === 0) || 
          $('.field_with_errors').length !== 0){
          // Inform the user if there was an error
          if (result.error === undefined) {
            $('#card-errors').text("Check your email or password");
          } else {
            $('#card-errors').text(result.error.message)
          }
          enableSubmit();
        } else {
          // Send the source to your server
          handleStripeSignUp(result.paymentMethod);
        }
      });
      //https://stackoverflow.com/questions/1357118/event-preventdefault-vs-return-false
      return false;
    });
  }
};

window.initializeUsersRegistrations = initializeUsersRegistrations;
