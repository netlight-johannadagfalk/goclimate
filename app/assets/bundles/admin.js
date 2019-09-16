/* Rails UJS */
import Rails from '@rails/ujs';
Rails.start()

/* Bootstrap requires jQuery globally */
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;
