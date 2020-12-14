/* eslint-disable import/first */

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
  require.context('../admin/controllers', true, /\.js$/)
));

/* Bootstrap */
import 'bootstrap/dist/css/bootstrap.css';

/* Styling */
import '../admin/index.css';
