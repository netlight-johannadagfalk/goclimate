$(document).ready(function() {
	$('#shareModal').modal();


	function shareFacebook() {
		FB.ui({
		  method: 'share',
		  href: window.urlToShare,
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