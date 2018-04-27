angular.module('myApp', []);

angular.module('myApp')
  .controller('BaseController', BaseController);

angular.module('myApp')
  .controller('LoginController', ['$scope', LoginController]);


angular.module('myApp')
  .controller('MessengerController', ['$scope', MessengerController]);

const DEBUG = true;
let view = 'login';
// let view = 'messenger';

function BaseController() {
  this.loginView = './src/login.html';
  this.messengerView = './src/messenger.html';
  this.isLoggedIn = false;
  this.getView = function () {
    return view;
  };
}

const SSO_URL = 'https://accounts-staging.newscred.com',
  CMP_HOST = 'http://cmp-localdev.newscred.com:3000',
  CMP_HOME = `${CMP_HOST}/cloud/home`,
  LOGIN_URL = `${SSO_URL}/login`;

let cmpClient;

class CmpClient {
  constructor() {
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  login(email, password) {
    if (DEBUG) {
      this.loggedIn = true;
      return Promise.resolve({});
    }

    let req = request.defaults({ jar: true }),
      cmpClient = this;

    return req.get(LOGIN_URL)
      .then(response => {
        console.log('Get SSO csrf');
        let loginDom = new DOMParser().parseFromString(response, "text/html");
        return loginDom.querySelector('input[name=_csrf]').value;
      })
      .then(csrf => {
        console.log('Login with email and password');
        return req.post(LOGIN_URL, {
          followRedirect: true,
          resolveWithFullResponse: true,
          form: {
            email: email,
            password: password,
            _csrf: csrf
          }
        }).then((response, body) => {
          console.log('response, body', response, body);
        }).catch((err, response) => {
          // TODO: Need to handle invalid login where status != 302
          let cookieToSet = err.response.headers['set-cookie'][0];
          console.log('err, response', err, response);
          console.log('cookieToSet', cookieToSet);
        });
      })
      .then(() => {
        console.log('Load CMP home page to get CMP csrfToken');
        return req.get(CMP_HOME, { time: true })
          .then((response) => {
            console.log('CMP home page loaded');
            var csrfTokenRegexp = /window\.csrfToken\s=\s"(.+)";/g;
            var match = csrfTokenRegexp.exec(response);
            let csrfToken = match[1];
            return csrfToken;
          })
      }).then((csrfToken) => {
        console.log('Got CMP csrfToken');
        let cmcReq = req.defaults({ json: true, baseUrl: CMP_HOST, headers: { 'X-CSRF-TOKEN': csrfToken } });
        cmpClient.cmpReq = cmcReq;
        cmpClient.loggedIn = true;
        console.log('Setting this.loggedIn', cmpClient.loggedIn);
        return cmpClient;
      });
  }

  getUsers() {
    if (DEBUG) {
      return Promise.resolve([
        { "_id": "542b9c361a56de26e84bb04c", "fullName": "A.K.M. Ashrafuzzaman", "ssoId": "542b9a9b87997dac07000037", "avatarUrl": "https://s3.amazonaws.com/cmc-prod/profile-542b9c361a56de26e84bb04c1412750003040-avatar.jpg", "email": "ashrafuzzaman@newscred.com", "role": { "admin": true, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "53485358095518ed69c58bef", "fullName": "Aaron Kaplan", "ssoId": "53484cf7b357a5b06b000029", "avatarUrl": "https://s3.amazonaws.com/cmc-prod/profile-53485358095518ed69c58bef1443571353435-avatar.jpg", "email": "aaron@newscred.com", "role": { "admin": true, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "5ad0d19056b746c36ba02bab", "fullName": "Aaronmabl Kaplan", "ssoId": "5ad0d1042afae13126956bff", "avatarUrl": "", "email": "aaron+mabl@newscred.com", "role": { "admin": false, "externalApprover": false, "member": true, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "5adf5478427110c011dd3c30", "fullName": "Adam Wiles", "ssoId": "5adf5304641c6e403a947324", "avatarUrl": "", "email": "adam.wiles@newscred.com", "role": { "admin": true, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "5843bcfd5786eb861103da58", "fullName": "Adnan Tonmoy", "ssoId": "5843bb0b8a8862882e000009", "avatarUrl": "", "email": "adnan.tonmoy@newscred.com", "role": { "admin": true, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "5753cae6a05caf4eefedb0ae", "fullName": "Ahmed Shuhel", "ssoId": "5753ca8fa01153535e00022e", "avatarUrl": "", "email": "ahmedshuhel@newscred.com", "role": { "admin": true, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "59c24d658c71e9570737bded", "fullName": "Ahmed Sayeed Wasif", "ssoId": "59c24d51ccfc67241e9c4bfd", "avatarUrl": "", "email": "ahmed.wasif@newscred.com", "role": { "admin": true, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "5ad5dd267aac87282ad236b0", "fullName": "Ali Ashik", "ssoId": "5ad5dd09c23dae20e26673fe", "avatarUrl": "", "email": "ali.ashik@newscred.com", "role": { "admin": false, "externalApprover": false, "member": true, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "55e49fa7a05caf4eefed84da", "fullName": "Allegra Zagami", "ssoId": "55e49f3562a92fa624000003", "avatarUrl": "http://cmc-prod.s3.amazonaws.com/profile-55e49fa7a05caf4eefed84da1516387750876-avatar.jpg", "email": "allegra.zagami@newscred.com", "role": { "admin": false, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": false, "newsroomEditor": true } }, { "_id": "59c3ea8b8eadabd7039dc79a", "fullName": "Amanda Chen", "ssoId": "59c3ea86818cf6742967662a", "avatarUrl": "", "email": "amanda.chen@newscred.com", "role": { "admin": true, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "59d1d4d87d850ead11d51f66", "fullName": "Amit Mojumder", "ssoId": "59d1d4d2021f5b8f3eb0bf07", "avatarUrl": "", "email": "amit.mojumder@newscred.com", "role": { "admin": true, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "58935b8c76d0cb90477d01b0", "fullName": "Amulya Bhagat", "ssoId": "586c28868888f31b31e510bf", "avatarUrl": "http://cmc-prod.s3.amazonaws.com/profile-58935b8c76d0cb90477d01b01492097021897-avatar.png", "email": "amulya.bhagat@newscred.com", "role": { "admin": false, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": true, "newsroomEditor": false } }, { "_id": "52a888c309c48b4d03000009", "fullName": "Andrew Schlenger", "ssoId": "52d5bee50b8508d847000006", "avatarUrl": "https://s3.amazonaws.com/cmc-prod/profile-52a888c309c48b4d030000091479142841945-avatar.jpg", "email": "andrew.schlenger@newscred.com", "role": { "admin": true, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "5ac9aa0090b433b46279b1d6", "fullName": "Anik  Shovan", "ssoId": "5ac9a9f53d410e1bbbe1c170", "avatarUrl": "http://cmc-prod.s3.amazonaws.com/profile-5ac9aa0090b433b46279b1d61524373733231-avatar.png", "email": "anik.shovan@newscred.com", "role": { "admin": true, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "597831f3bbe7098e10d29569", "fullName": "Anisul Hoque", "ssoId": "5978316663ac12950c0e4472", "avatarUrl": "", "email": "mmd.anisul.hoque@newscred.com", "role": { "admin": true, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "591a1c5d4d07abd3583d4645", "fullName": "Ankit Malhotra", "ssoId": "591a1ad03d1769a10173db14", "avatarUrl": "", "email": "ankit.malhotra@newscred.com", "role": { "admin": false, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": true, "newsroomEditor": false } }, { "_id": "5a8368c9318461a22494c6ee", "fullName": "Anthony Aiosa", "ssoId": "5a835c25d12215776c9d63a0", "avatarUrl": "http://cmc-prod.s3.amazonaws.com/profile-5a8368c9318461a22494c6ee1520014537651-avatar.jpg", "email": "anthony.aiosa@newscred.com", "role": { "admin": true, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "5363b0bf095518ed69c58c6c", "fullName": "Arefeen Mansur", "ssoId": "5363b0437600faf148000014", "avatarUrl": "https://s3.amazonaws.com/cmc-prod/profile-5363b0bf095518ed69c58c6c1399263633744-avatar.jpg", "email": "arefeen@newscred.com", "role": { "admin": false, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": true, "newsroomEditor": false } }, { "_id": "52c56288029a968f180000c4", "fullName": "Asif Rahman", "ssoId": "52b87bb1ce33fff66900000e", "avatarUrl": "/static/images/default-user.png", "email": "asif@newscred.com", "role": { "admin": true, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "5891f5db96f214e9305b8663", "fullName": "Charles Hough", "ssoId": "5891f5d7916573f9023b94be", "avatarUrl": "http://cmc-prod.s3.amazonaws.com/profile-5891f5db96f214e9305b86631494713923927-avatar.png", "email": "charles.hough@newscred.com", "role": { "admin": false, "externalApprover": false, "member": true, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "5665cd27a05caf4eefedab6e", "fullName": "Chat Test", "ssoId": "5665ccd957bc788d65000085", "avatarUrl": "", "email": "russelltaff2012@u.northwestern.edu", "role": { "admin": false, "externalApprover": true, "member": false, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "540df85f1a56de26e84bafd5", "fullName": "Dave Trindall", "ssoId": "540df7f4add154010600002e", "avatarUrl": "https://s3.amazonaws.com/cmc-prod/profile-540df85f1a56de26e84bafd51437023440101-avatar.jpg", "email": "dave.trindall@newscred.com", "role": { "admin": false, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": true, "newsroomEditor": false } }, { "_id": "5664d1d7a05caf4eefedab64", "fullName": "Dave Trindall - External", "ssoId": "5664d1a88228201064000071", "avatarUrl": "", "email": "dave.trindall@gmail.com", "role": { "admin": true, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "5a95be6d7dcaa6f350803801", "fullName": "Dave Trindall Contr.", "ssoId": "5a95be6b6b37d94b6b98f06e", "avatarUrl": "", "email": "dave.trindall+contributor@newscred.com", "role": { "admin": false, "externalApprover": false, "member": false, "contributor": true, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "567c3945a05caf4eefedabe1", "fullName": "Dave Trindall Test", "ssoId": "567c39096cc175bc370000f0", "avatarUrl": "", "email": "dave.trindall+test.no.admin@newscred.com", "role": { "admin": false, "externalApprover": false, "member": true, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "588b86da84eab23365f48c0c", "fullName": "Dave Trindall Test 2", "ssoId": "588b86d62a2386e3403c358e", "avatarUrl": "", "email": "dave.trindall+test.no.admin.2@newscred.com", "role": { "admin": false, "externalApprover": false, "member": true, "contributor": false, "ncAdmin": false, "newsroomEditor": false } }, { "_id": "544f859e1a56de26e84bb0cb", "fullName": "Debasis Roy", "ssoId": "544f2700f38931c76d00004a", "avatarUrl": "https://s3.amazonaws.com/cmc-prod/profile-544f859e1a56de26e84bb0cb1424864171270-avatar.jpg", "email": "debasis@newscred.com", "role": { "admin": false, "externalApprover": false, "member": false, "contributor": false, "ncAdmin": true, "newsroomEditor": false } }
      ])
    }
    return this.cmpReq.get('/api/users');
  }

  getUserConversation(user) {
    if (DEBUG) {
      return Promise.resolve({ "_id": "5ae1dfd9cb93706100d3173a", "deletedAt": null, "deleted": false, "startedBy": "5a30b30ac4c12a3400dff6fa", "__v": 0, "participants": [ { "_id": "5a30b30ac4c12a3400dff6fa", "lastName": "Ashrafuzzaman", "firstName": "AKM", "avatarUrl": "http://cmc-dev.s3.amazonaws.com/profile-5a30b30ac4c12a3400dff6fa1524757287430-avatar.jpeg", "fullName": "AKM Ashrafuzzaman", "id": "5a30b30ac4c12a3400dff6fa" }, { "_id": "5a30b34b1d39544800602e1f", "lastName": "Dibosh", "firstName": "Munim", "avatarUrl": "", "fullName": "Munim Dibosh", "id": "5a30b34b1d39544800602e1f" } ], "createdAt": "2018-04-26T14:19:05.912Z" });
    }
    console.log('getUserConversation :: ', user._id);
    return this.cmpReq.post('/api/conversations', { form: { recipientId: user._id } });
  }

  getMessages(conversation) {
    if (DEBUG) {
      return Promise.resolve([{ "_id": "5ae1dfe2cb93706100d3173b", "conversationId": "5ae1dfd9cb93706100d3173a", "text": "Hi", "sender": { "_id": "5a30b30ac4c12a3400dff6fa", "lastName": "Ashrafuzzaman", "firstName": "AKM", "avatarUrl": "http://cmc-dev.s3.amazonaws.com/profile-5a30b30ac4c12a3400dff6fa1524757287430-avatar.jpeg", "fullName": "AKM Ashrafuzzaman", "id": "5a30b30ac4c12a3400dff6fa" }, "__v": 0 }, { "_id": "5ae1dfe7cb93706100d3173c", "conversationId": "5ae1dfd9cb93706100d3173a", "text": "1", "sender": { "_id": "5a30b30ac4c12a3400dff6fa", "lastName": "Ashrafuzzaman", "firstName": "AKM", "avatarUrl": "http://cmc-dev.s3.amazonaws.com/profile-5a30b30ac4c12a3400dff6fa1524757287430-avatar.jpeg", "fullName": "AKM Ashrafuzzaman", "id": "5a30b30ac4c12a3400dff6fa" }, "__v": 0 }, { "_id": "5ae1e110cb93706100d3173d", "conversationId": "5ae1dfd9cb93706100d3173a", "text": "Test", "sender": { "_id": "5a30b30ac4c12a3400dff6fa", "lastName": "Ashrafuzzaman", "firstName": "AKM", "avatarUrl": "http://cmc-dev.s3.amazonaws.com/profile-5a30b30ac4c12a3400dff6fa1524757287430-avatar.jpeg", "fullName": "AKM Ashrafuzzaman", "id": "5a30b30ac4c12a3400dff6fa" }, "__v": 0 }, { "_id": "5ae1eebe641ce554009a17e5", "conversationId": "5ae1dfd9cb93706100d3173a", "text": "1", "sender": { "_id": "5a30b30ac4c12a3400dff6fa", "lastName": "Ashrafuzzaman", "firstName": "AKM", "avatarUrl": "http://cmc-dev.s3.amazonaws.com/profile-5a30b30ac4c12a3400dff6fa1524757287430-avatar.jpeg", "fullName": "AKM Ashrafuzzaman", "id": "5a30b30ac4c12a3400dff6fa" }, "__v": 0 }, { "_id": "5ae1eed8641ce554009a17e6", "conversationId": "5ae1dfd9cb93706100d3173a", "text": "2", "sender": { "_id": "5a30b30ac4c12a3400dff6fa", "lastName": "Ashrafuzzaman", "firstName": "AKM", "avatarUrl": "http://cmc-dev.s3.amazonaws.com/profile-5a30b30ac4c12a3400dff6fa1524757287430-avatar.jpeg", "fullName": "AKM Ashrafuzzaman", "id": "5a30b30ac4c12a3400dff6fa" }, "__v": 0 }, { "_id": "5ae1eede641ce554009a17e7", "conversationId": "5ae1dfd9cb93706100d3173a", "text": "3", "sender": { "_id": "5a30b30ac4c12a3400dff6fa", "lastName": "Ashrafuzzaman", "firstName": "AKM", "avatarUrl": "http://cmc-dev.s3.amazonaws.com/profile-5a30b30ac4c12a3400dff6fa1524757287430-avatar.jpeg", "fullName": "AKM Ashrafuzzaman", "id": "5a30b30ac4c12a3400dff6fa" }, "__v": 0 }, { "_id": "5ae1ef15641ce554009a17e8", "conversationId": "5ae1dfd9cb93706100d3173a", "text": "4", "sender": { "_id": "5a30b30ac4c12a3400dff6fa", "lastName": "Ashrafuzzaman", "firstName": "AKM", "avatarUrl": "http://cmc-dev.s3.amazonaws.com/profile-5a30b30ac4c12a3400dff6fa1524757287430-avatar.jpeg", "fullName": "AKM Ashrafuzzaman", "id": "5a30b30ac4c12a3400dff6fa" }, "__v": 0 }, { "_id": "5ae1ef9c641ce554009a17eb", "conversationId": "5ae1dfd9cb93706100d3173a", "text": "5", "sender": { "_id": "5a30b30ac4c12a3400dff6fa", "lastName": "Ashrafuzzaman", "firstName": "AKM", "avatarUrl": "http://cmc-dev.s3.amazonaws.com/profile-5a30b30ac4c12a3400dff6fa1524757287430-avatar.jpeg", "fullName": "AKM Ashrafuzzaman", "id": "5a30b30ac4c12a3400dff6fa" }, "__v": 0 }, { "_id": "5ae1f12e1f87cf3f00f3f2d7", "conversationId": "5ae1dfd9cb93706100d3173a", "text": "1", "sender": { "_id": "5a30b30ac4c12a3400dff6fa", "lastName": "Ashrafuzzaman", "firstName": "AKM", "avatarUrl": "http://cmc-dev.s3.amazonaws.com/profile-5a30b30ac4c12a3400dff6fa1524757287430-avatar.jpeg", "fullName": "AKM Ashrafuzzaman", "id": "5a30b30ac4c12a3400dff6fa" }, "__v": 0 }]);
    }
    return this.cmpReq.get(`/api/conversations/${conversation._id}/messages`);
  }

  sendMessage(conversation, message) {
    console.log('conversation, message :: ', conversation._id, message);
    if (DEBUG) {
      return Promise.resolve({});
    }
    return this.cmpReq.post(`/api/conversations/${conversation._id}/send-message`, { form: { message: message } });
  }
}

function LoginController($scope) {
  this.email = 'ashrafuzzaman@newscred.com';
  this.password = 'qweqwe';
  this.loading = false;

  this.switchToMessagePanel = () => {
    this.loading = false;
    view = 'messenger';
  }

  this.login = function () {
    let ctrl = this;
    this.loading = true;
    if (!cmpClient) {
      cmpClient = new CmpClient();
    }

    return cmpClient.login(this.email, this.password).then(() => {
      $scope.$apply(() => {
        ctrl.switchToMessagePanel();
      });
    });
  }

  if (!DEBUG) {
    this.login();
  }
}

function MessengerController($scope) {
  this.users = [];
  this.currentUser;

  this.initialize = () => {
    return cmpClient.getUsers().then((users) => {
      return $scope.$apply(() => {
        this.users = users;
      });
    });
  }

  this.userFilter = (user) => {
    if (this.search) {
      return user.fullName.toLowerCase().includes(this.search.toLowerCase());
    }
    return true;
  }

  this.selectUser = (user) => {
    let ctrl = this;
    this.currentUser = user;

    cmpClient.getUserConversation(user)
      .then((conversation) => {
        user.conversation = conversation;
        return conversation;
      }).then((conversation) => {
        console.log('conversation', conversation);
        ctrl.loadMessages(conversation);
      });
  }

  this.loadMessages = (conversation) => {
    console.log('Loading Messages');
    return cmpClient.getMessages(conversation).then((messages) => {
      $scope.$apply(() => {
        this.currentMessages = messages;
      });
      console.log('messages', messages);
    });
  }

  this.sendMessage = (message) => {
    let ctrl = this;
    console.log('message', message);

    return cmpClient.sendMessage(this.currentUser.conversation, message).then((reply) => {
      $scope.$apply(() => {
        this.message = '';
      });
      console.log('reply', reply);
      return ctrl.loadMessages(this.currentUser.conversation);
    });
  }

  this.initialize();
}
