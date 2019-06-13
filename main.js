$(function() {
    var issuer = "https://phantauth.net";
    var page = window.location.hostname;
  
    function beforeLogin() {
      $(".after-login").hide();
      $(".before-login").show();
    }
  
    function afterLogin() {
      $(".before-login").hide();
      $(".after-login").show();
    }
  
    function newClient() {
      return new Oidc.OidcClient({
        authority: issuer,
        client_id: "phantauth+phantauth.test@gmail.com",
        redirect_uri: window.location.href,
        response_type: "id_token token",
        scope: "openid profile email phone address",
        filterProtocolClaims: false,
        loadUserInfo: false
      });
    }
  
    function login() {
      $(".after-login").hide();
      newClient()
        .createSigninRequest({ state: { bar: Math.random() } })
        .then(function(req) {
          window.location = req.url;
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  
    function process() {
      newClient()
        .processSigninResponse()
        .then(function(response) {
          localStorage.setItem(page, JSON.stringify(response.profile));
          window.location.hash = "";
          history.pushState("", document.title, window.location.pathname);
          update();
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  
    function isLoggedIn() {
      return localStorage.getItem(page);
    }
  
    function getProfile() {
      return JSON.parse(localStorage.getItem(page));
    }
  
    function update() {
      var bindings = {};
      bindings["user"] = getProfile();
      rivets.bind($("#user"), bindings);
      afterLogin();
    }
  
    function logout() {
      localStorage.removeItem(page);
      beforeLogin();
      return false;
    }
  
    $("#login").click(login);
    $("#logout").click(logout);
  
    if (isLoggedIn()) {
      update();
    } else if (window.location.hash !== "") {
      process();
    } else {
      beforeLogin();
    }
  });
  