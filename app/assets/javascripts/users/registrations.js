$(document).ready(function() {

	if($('#card-element').length) {

		if (location.hostname === "localhost") {
			var stripe = Stripe('pk_test_a1OlA12lwmhYeYTK77LvdqIe');
		} else {
			var stripe = Stripe('pk_live_3HlQg5UTUX1iwEVSuH9Hk6bI');
		}

		var elements = stripe.elements();

		if(mobilecheck()) {
			// Custom styling can be passed to options when creating an Element.
			var style = {
			  base: {
			    // Add your base input styles here. For example:
			    fontSize: '28px',
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

		} else {
			
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
			// Custom styling can be passed to options when creating an Element.
			
		}
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

		$('#payment-form').on('submit', function(event) {
		  event.preventDefault();

		  stripe.createToken(card).then(function(result) {
		    if (result.error || $('#email').val().length === 0 || $('#password').val().length === 0 || $('.field_with_errors').length !== 0){
		      // Inform the user if there was an error
		      if (result.error === undefined) {
				$('#card-errors').text("Check your email or password");
		      } else {
		      	$('#card-errors').textContent = result.error.message;
		      }
		      $('#register-button').prop('disabled', false);
		    } else {
		      // Send the token to your server
		      stripeTokenHandler(result.token);
		    }
		  });
		});
		function stripeTokenHandler(token) {
		  // Insert the token ID into the form so it gets submitted to the server
		  var form = document.getElementById('payment-form');
		  var hiddenInput = document.createElement('input');
		  hiddenInput.setAttribute('type', 'hidden');
		  hiddenInput.setAttribute('name', 'stripeToken');
		  hiddenInput.setAttribute('value', token.id);
		  form.appendChild(hiddenInput);

		  // Submit the form
		  form.submit();
		}
	}
   
});