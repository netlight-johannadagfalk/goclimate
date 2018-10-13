// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's 
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require rails.validations
$(document).ready(function() {
	$('.dropdown-toggle').dropdown();

	setTimeout(function() {
        $(".alert").slideUp(1000);
    }, 5000);

	// Bootstrap tooltip iOS hack: https://github.com/twbs/bootstrap/pull/22481/commits/d40c7f1494c3385b60d3d9eed7ce0f36862042d9
    // if this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement &&
       !$(parent).closest(Selector.NAVBAR_NAV).length) {
      $('body').children().on('mouseover', null, $.noop)
    }
});