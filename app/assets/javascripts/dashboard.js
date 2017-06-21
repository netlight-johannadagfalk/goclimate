$(document).ready(function() {
	$('#shareModal').modal();


	function shareFacebook() {
		FB.ui({
		  method: 'share',
		  href: 'https://www.goclimateneutral.org',
		  quote: window.facebookQuote,
		  hashtag: '#goclimateneutral'
		}, function(response){});
	}
	$('#share-facebook-popup').click(function() {
		shareFacebook();
	});

	$('#share-facebook-bottom').click(function() {
		shareFacebook();
	});
});