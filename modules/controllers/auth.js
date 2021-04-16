const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const request = require('request');
const config = require('../../config');

// Authentication middleware
// This middleware will check access token in authorization headers of a request
// It will verify access token against Auth0 JSON web key set
exports.checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: 'https://andrasistemas.us.auth0.com/.well-known/jwks.json' //jwksUri origin of auth0.com/Applications/Application/portfolio-danny/Domain
  }),
  audience: 'https://andrasistemas.us.auth0.com/api/v2/', //audience origin of auth0.com/Applications/API/Auth0 Managment API/Identfier
  issuer: 'https://andrasistemas.us.auth0.com/',
  algorithms: ['RS256']
});

exports.checkRole = role => (req, res, next) => {
  const user = req.user
  
  // console.log(user)
  if (user && user[config.AUTH0_NAMESPACE + '/roles'].includes(role)) {
    next()
  } else {
    return res.status(401).send('You are not authorized to access this resource!')
  }
 
}

exports.getAccessToken = (callback) => {
  const options = {
    method: 'POST',
    url: config.AUTH0_TOKEN_URL,
    headers: {'content-type': 'application/json'},
    form: {
      grant_type: 'client_credentials',
      client_id: config.AUTH0_CLIENT_ID,
      client_secret: config.AUTH0_CLIENT_SECRET,
      audience: config.AUTH0_AUDIENCE
    }
  }
  
  return new Promise((resolve, reject) => {
    request(options, (error, res, body) => {
      if (error) {
        return reject(new Error(error))
      }

      resolve(body ? JSON.parse(body) : '')
    })
  })
}

exports.getAuth0User = accessToken => userId => {
  const options = {
    method: 'GET',
    url: `${config.AUTH0_DOMAIN}/api/v2/users/${userId}?fields=name,picture,user_id`,
    headers: {authorization: `Bearer ${accessToken}`}
  };

  return new Promise((resolve, reject) => {
    request(options, (error, res, body) => {
      if (error) {
        return reject(new Error(error))
      }

      resolve(body ? JSON.parse(body) : '')
    })
  })
}

// exports.changePictureTest = accessToken => {
//   var axios = require("axios").default;
//   const userId = ''

//   var options = {
//     method: 'PATCH',
//     url: `${config.AUTH0_DOMAIN}/api/v2/users/${userId}`,
//     headers: {authorization: `Bearer ${accessToken}`},
//     // headers: {authorization: `Bearer ${accessToken}`, 'content-type': 'application/json'},
//     data: {user_metadata: {picture: 'https://andraerpwebpub.s3.amazonaws.com/danny-profile.jpg'}}
//   };
  
//   // return new Promise((resolve, reject) => {
//   //   request(options, (error, res, body) => {
//   //     if (error) {
//   //       return reject(new Error(error))
//   //     }

//   //     resolve(body ? JSON.parse(body) : '')
//   //   })
//   // })
  
//   axios.request(options).then(function (response) {
//     console.log(response.data);
//   }).catch(function (error) {
//     console.error(error);
//   });  
// }

