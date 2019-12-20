/* Rails UJS */
import Rails from '@rails/ujs';
Rails.start()

/* Bootstrap and inline jQuery calls require jQuery globally */
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

/* Font Awesome */
import 'font-awesome/scss/font-awesome.scss';

/* Bootstrap */
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

/* Social Buttons for Bootstrap */
import 'bootstrap-social/bootstrap-social.css';

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
import '../stylesheets/components/projects_map.scss';
import '../stylesheets/components/region_recommendation.scss';

/* Components */
import '../javascripts/components/business_offset_calculator';
import '../javascripts/components/counting_number';
import '../javascripts/components/projects_map_marker';
import '../javascripts/components/stripe_card_payment';
import '../javascripts/users/registrations';
import '../javascripts/welcome';
import '../javascripts/dashboard';
import '../javascripts/users';
import '../javascripts/users/edit_card';
import '../javascripts/users/edit_user';
