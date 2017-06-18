$(document).ready(function() {
	$('#shareModal').modal();

	$('#share-facebook').click(function() {
		FB.ui({
		  method: 'share',
		  href: 'https://www.goclimateneutral.org',
		  quote: window.facebookQuote,
		  hashtag: '#goclimateneutral'
		}, function(response){});
	});
});