angular.module('myApp', []);

angular.module('myApp')
  .controller('BaseController', BaseController);

angular.module('myApp')
  .controller('LoginController', LoginController);


angular.module('myApp')
  .controller('MessengerController', MessengerController);

function BaseController() {
  this.loginView = './src/login.html';
  this.messengerView = './src/messenger.html';
  this.isLoggedIn = false;
}

const SSO_URL = 'https://accounts.newscred.com',
  CMP_HOST = 'https://cmp.newscred.com',
  CMP_HOME = `${CMP_HOST}/cloud/home`,
  LOGIN_URL = `${SSO_URL}/login`;

let cmpReq;

function LoginController() {
  this.email = 'ashrafuzzaman@newscred.com';
  this.password = 'qweqwe';
  this.loading = false;

  this.login = function () {
    this.loading = true;
    let ctrl = this;
    let req = request.defaults({ jar: true });

    return req.get(LOGIN_URL)
      .then(response => {
        let loginDom = new DOMParser().parseFromString(response, "text/html");
        return loginDom.querySelector('input[name=_csrf]').value;
      })
      .then(csrf => {
        return req.post(LOGIN_URL, {
          followRedirect: true,
          form: {
            email: ctrl.email,
            password: ctrl.password,
            _csrf: csrf
          }
        }).catch((err) => {
          // TODO: Need to handle invalid login where status != 302
          return req.get(SSO_URL);
        })
      })
      .then(() => {
        return req.get(CMP_HOME)
          .then((response) => {
            var csrfTokenRegexp = /window\.csrfToken\s=\s"(.+)";/g;
            var match = csrfTokenRegexp.exec(response);
            csrfToken = match[1];
            return csrfToken;
          })
      }).then((csrfToken) => {
        cmcReq = req.defaults({ json: true, headers: { 'X-CSRF-TOKEN': csrfToken } });
        this.loading = true;
        BaseController.isLoggedIn = true;
        return cmcReq;
      });
  }
}

function MessengerController() {
  this.chats = [];
  this.users = [];

  this.initialize = () => {
    return cmcReq.get('https://cmp.newscred.com/api/users')
      .then((users) => {
        this.users = users;
        console.log('users', users);
      });
  }

  this.initialize();
}
