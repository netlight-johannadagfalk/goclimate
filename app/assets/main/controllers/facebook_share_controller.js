import { Controller } from 'stimulus';
import withFacebookSDK from '../../util/with_facebook_sdk';

export default class FacebookShareController extends Controller {
  share(event) {
    event.preventDefault();

    withFacebookSDK(() => {
      FB.ui({
        method: 'share',
        href: this.element.dataset.shareUrl,
        quote: this.element.dataset.shareQuote,
        hashtag: '#goclimate'
      }, (_) => {});
    });
  }
}
