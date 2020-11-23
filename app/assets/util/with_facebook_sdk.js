let facebookStatus = 'uninitialized';
let actions = [];

function runActions() {
  actions.forEach((action) => action());
  actions = [];
}

function loadFacebookSDK() {
  facebookStatus = 'initializing';

  window.fbAsyncInit = function fbAsyncInit() {
    FB.init({
      appId: document.querySelector('meta[property="fb:app_id"]').content,
      xfbml: true,
      version: 'v9.0'
    });

    facebookStatus = 'initialized';
    runActions();
  };

  /* eslint-disable */
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {window.fbAsyncInit(); return;}
    js = d.createElement(s); js.id = id;
    if (window.locale === 'sv') {
      js.src = "//connect.facebook.net/sv_SE/sdk.js";
    } else if (window.locale === 'de') {
      js.src = "//connect.facebook.net/de_DE/sdk.js";
    } else {
      js.src = "//connect.facebook.net/en_US/sdk.js";
    }
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}

// Use this function to load the FB SDK on demand in response to a user action.
//
// NOTE: If needs change and we want to do something at every page load, we
// should not use this function but instead load FB in layouts or similar.
export default function withFacebookSDK(action) {
  actions.push(action);

  if (facebookStatus === 'uninitialized') {
    loadFacebookSDK();
  } else if (facebookStatus === 'initialized') {
    runActions();
  }
}
