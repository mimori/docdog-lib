import axios from 'axios';
import qs from 'qs';
import { post, processError } from './utils';
import loginApi from './login';

function doSignUp(data) {
  return loginApi
    .getAuthHeaders({
      autoLogin: true,
      anonLogin: true,
    })
    .then((headers) =>
      post('/rcms-api/3/member/new', data, headers)
        .then(processError)
        .catch((err) => {
            console.log(err);
          let err_msg = 'Error during signup'; // Default error message
          if (err.response && err.response.data && err.response.data.errors) {
            err_msg = err.response.data.errors.reduce((carry, obj) => {
              if (carry != '') {
                carry += '<br/>';
              }
              return obj.field ? carry.concat(obj.field + ':' + obj.code) : carry.concat(obj.message);
            }, '');
          } else {
            switch (err.response.status) {
              case 404:
                err_msg = 'The signup endpoint could not be found';
                break;
            }
          }
          return Promise.reject(err_msg);
        })
    );
}

export default {
  doSignUp,
};
