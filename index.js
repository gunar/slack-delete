// ==UserScript==
// @name       Slack Easy Delete
// @author     http://github.com/gunar
// @version    1.0
// ==/UserScript==

(function() {
  'use strict';

  function makeRequest (url, params) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };
      xhr.send(params);
    });
  }

  const _x_id = () => `${window.boot_data.version_uid.substring(0, 8)}-${(new Date).getTime()/1000}`

  var maxConcurrent = 3;
  var maxQueue = Infinity;
  var queue = new Queue(maxConcurrent, maxQueue);

  const queryString = obj => {
    const str = [];
    for (const p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
    return str.join('&')
  }

  const deleteMessage = (...args) => 
    queue.add(() =>
      (({ channel, ts }) => {
        const token = window.boot_data.api_token
        const params = queryString({ channel, token, ts })
        const url = `https://${window.location.host}/api/chat.delete?_x_id=${_x_id()}`
        return makeRequest(url, params)
      })(...args)
    )

  const deleteHoveredMessage = () => {
    const el = document.querySelector('ts-message:hover')
    if (!el) return
    const ts = el.getAttribute('data-ts')
    const channel = el.getAttribute('data-model-ob-id')
    deleteMessage({ channel, ts })
    el.parentNode.removeChild(el)
  }

  const onKeyUp = e => {
    if (e.ctrlKey && e.shiftKey && e.code === 'Space') {
      deleteHoveredMessage()
    }
  }

  document.addEventListener('keyup', onKeyUp, false)
})();
