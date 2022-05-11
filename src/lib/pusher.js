import Pusher from 'pusher-js';

if (process.env.NODE_ENV == 'development') {
  Pusher.Runtime.createXHR = function () {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    return xhr;
  };
}

export default Pusher;
