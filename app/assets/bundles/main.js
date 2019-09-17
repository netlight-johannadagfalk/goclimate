/* Rails UJS */
import Rails from '@rails/ujs';
Rails.start()

/* Bootstrap and our code that hasn't been updated require jQuery globally */
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

/* jQuery custom appear event that triggers when element enters viewport */
import 'jquery-appear-original';

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

/* Global styling */
import '../stylesheets/base.scss';
import '../stylesheets/type.scss';
import '../stylesheets/panels.scss';
import '../stylesheets/forms.scss';
import '../stylesheets/layout/content_section.scss';
import '../stylesheets/components/climate_report_table.scss';
import '../stylesheets/components/impact_calculator_fields.scss';
import '../stylesheets/components/navbar_goclimateneutral.scss';
import '../stylesheets/components/gift_cards_intro.scss';
import '../stylesheets/components/registrations_signup_form.scss';
import '../stylesheets/components/business_offset_form.scss';
import '../stylesheets/components/receipts.scss';
import '../stylesheets/components/flight_offset_details.scss';
import '../stylesheets/components/projects_teaser.scss';

/* Components */
import '../javascripts/components/business_offset_calculator';
import '../javascripts/components/stripe_card_payment';
