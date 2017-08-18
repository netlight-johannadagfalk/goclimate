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

	$('#user_toplist_collapsed').on('hidden.bs.collapse', function () {
	  $('#user_toplist_open_link').show();
	  $('#user_toplist_collapse_link').hide();
	});

	$('#user_toplist_collapsed').on('show.bs.collapse', function () {
	  $('#user_toplist_open_link').hide();
	  $('#user_toplist_collapse_link').show();
	});

	$('#user_toplist_collapse_link').hide();
});