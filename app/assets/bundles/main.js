/* eslint-disable import/first */

/* Polyfills */
import 'whatwg-fetch';
import 'core-js/features/promise';

/* Polyfills for Stimulus */
import 'core-js/features/array';
import 'core-js/features/map';
import 'core-js/features/object/assign';
import 'core-js/features/set';
import 'element-closest';
import 'mutation-observer-inner-html-shim';
import 'eventlistener-polyfill';

/* Rails UJS */
import Rails from '@rails/ujs';

Rails.start();

/* Stimulus */
import { Application } from 'stimulus';
import { definitionsFromContext } from 'stimulus/webpack-helpers';

const application = Application.start();
application.load(definitionsFromContext(
  require.context('../shared/controllers', true, /\.js$/)
));
application.load(definitionsFromContext(
  require.context('../main/controllers', true, /\.js$/)
));

/* Font Awesome */
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/regular.css';
import '@fortawesome/fontawesome-free/css/brands.css';

/* Styling */
import '../main/index.css';
