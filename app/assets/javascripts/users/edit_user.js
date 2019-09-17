function initializeEditUserName() {
  var userName = document.getElementById('userName');
  userName.addEventListener("input", function(event) {
    userName.setCustomValidity("");
    if (userName.value.match(/.+@.+\..+/)) {
      userName.setCustomValidity("Please don't use an email as your username. It will be shown publicly.");
    }
  });
};

window.initializeEditUserName = initializeEditUserName;
