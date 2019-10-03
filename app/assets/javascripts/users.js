import $ from 'jquery';

function initializeUsers() {
  function shareFacebook() {
    FB.ui({
      method: 'share',
      href: window.urlToShare,
      quote: window.facebookQuote,
      hashtag: '#goclimateneutral'
    }, function(response){});
  }

  $('#share-facebook-bottom').click(function() {
    shareFacebook();
  });

  if(window.location.href.indexOf("share") == -1) {
    $('#videoModal').modal('show');
  };

  $('#show-video').on('click', function (e) {
    e.preventDefault();
    $('#videoModal').modal('show');
    ga('send', {
      hitType: 'event',
      eventAction: 'viewVideo'
    });
  });

  $('#videoModal').on('hidden.bs.modal', function (e) {
    var $frame = $('#videoModal iframe');

    // saves the current iframe source
    var vidsrc = $frame.attr('src');

    // sets the source to nothing, stopping the video
    $frame.attr('src', '');

    // sets it back to the correct link so that it reloads immediately on the next window open
    $frame.attr('src', vidsrc);

  });
};

window.initializeUsers = initializeUsers;
