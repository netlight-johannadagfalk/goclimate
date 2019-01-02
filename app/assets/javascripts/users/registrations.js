$(document).ready(function() {

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

	if($('#new-card-div').length) {
		$('#add-new-card').click(function() {
			$('#new-card-div').removeClass("hidden");
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

	if($('#card-element').length) {
		var stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
		var elements = stripe.elements();
			
		var style = {
		  base: {
		    // Add your base input styles here. For example:
		    fontSize: '16px',
		    color: '#000',
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
		  var displayError = document.getElementById('card-errors');
		  if (event.error) {
		    displayError.textContent = event.error.message;
		  } else {
		    displayError.textContent = '';
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

		  if ($('#new-card-div').length && $('#new-card-div').hasClass("hidden")) {

		  	var form = document.getElementById('payment-form');
		  	form.submit();

		  } else {

			stripe.createSource(card).then(function(result) {
			    if (result.error || 
			    	($('#email').val() !== undefined && $('#email').val().length === 0) || 
			    	($('#password').val() !== undefined && $('#password').val().length === 0) || 
			    	$('.field_with_errors').length !== 0){
			      // Inform the user if there was an error
			      if (result.error === undefined) {
					$('#card-errors').text("Check your email or password");
			      } else {
			      	$('#card-errors').textContent = result.error.message;
			      }
			      if ($('#user_privacy_policy').is(':checked')) {
			      	$('#register-button').prop('disabled', false);
			      }
			    } else {
			      // Send the source to your server
			      stripeSourceHandler(result.source);
			    }
			});
		  }

		  //https://stackoverflow.com/questions/1357118/event-preventdefault-vs-return-false
		  return false;
		});
		function stripeSourceHandler(source) {
		  // Insert the source ID into the form so it gets submitted to the server
		  var form = document.getElementById('payment-form');
		  var hiddenInput = document.createElement('input');
		  hiddenInput.setAttribute('type', 'hidden');
		  hiddenInput.setAttribute('name', 'stripeSource');
		  hiddenInput.setAttribute('value', source.id);

		  var hiddenInput2 = document.createElement('input');
		  hiddenInput2.setAttribute('type', 'hidden');
		  hiddenInput2.setAttribute('name', 'threeDSecure');
		  hiddenInput2.setAttribute('value', source.card.three_d_secure);

		  form.appendChild(hiddenInput);
		  form.appendChild(hiddenInput2);

		  ga('send', {
				hitType: 'event',
				eventAction: 'commit'
			});

		  // Submit the form
		  form.submit();
		}
	}
   
});
