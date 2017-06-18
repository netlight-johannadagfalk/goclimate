$(document).ready(function() {
	

	$('#share-facebook').click(function() {
		FB.ui({
		  method: 'share',
		  href: 'https://www.goclimateneutral.org',
		}, function(response){});
	});
});