/* Rails UJS */
import Rails from '@rails/ujs';
Rails.start()

/* Bootstrap and our code that hasn't been updated require jQuery globally */
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

/* Font Awesome */
import 'font-awesome/scss/font-awesome.scss';

/* Bootstrap */
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

/* Social Buttons for Bootstrap */
import 'bootstrap-social/bootstrap-social.css';

/* CountUp.js */
/* TODO: Remove once welcome.js is moved to Webpack and can import CountUp directly */
import CountUp from 'countup.js';
window.CountUp = CountUp;
