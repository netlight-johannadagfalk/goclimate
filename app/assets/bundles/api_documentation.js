/* Rails UJS */
import Rails from '@rails/ujs';
Rails.start()

/* Bootstrap requires jQuery globally */
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

/* Bootstrap */
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
