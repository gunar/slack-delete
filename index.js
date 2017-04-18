// ==UserScript==
// @name       Slack Easy Delete
// @author     http://github.com/gunar
// @version    1.0
// ==/UserScript==

(function() {
  'use strict';
  const _x_id = () => `${window.boot_data.version_uid.substring(0, 8)}-${(new Date).getTime()/1000}`

  const throttle = (callback, limitMs = 100) => {
    let wait = false
    return function throttled() {
      if (!wait) {
        wait = true // Prevent future invocations for a time
        callback()
        setTimeout(() => { wait = false }, limitMs)
      }
    }
  }

  const queryString = obj => {
    const str = [];
    for (const p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
    return str.join('&')
  }

  const deleteHoveredMessage = () => {
    const el = document.querySelector('ts-message:hover')
    el.style.display = 'none'
    const ts = el.getAttribute('data-ts')
    const channel = el.getAttribute('data-model-ob-id')
    const token = window.boot_data.api_token
    const url = `https://${window.location.host}/api/chat.delete?_x_id=${_x_id()}`
    const params = queryString({ channel, token, ts })
    const http = new XMLHttpRequest()
    http.open('POST', url, true)
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    http.send(params)
  }

  const throttledDelete = throttle(deleteHoveredMessage)

  const onKeyUp = e => {
    if (e.ctrlKey && e.shiftKey && e.code === 'Space') {
      throttledDelete()
    }
  }

  document.addEventListener('keyup', onKeyUp, false)
})();
