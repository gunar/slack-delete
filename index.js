// ==UserScript==
// @name       Slack Easy Delete
// @author     http://github.com/gunar
// @version    1.0
// ==/UserScript==

(function() {
  'use strict';
  const _x_id = () => `${window.boot_data.version_uid.substring(0, 8)}-${(new Date).getTime()/1000.0}`

  // Limit is in ms
  const throttle = (callback, limit = 100) => {
    var wait = false
    return function() { // We return a throttled function
      if (!wait) {
        callback.call()
        wait = true // Prevent future invocations for a time
        setTimeout(function() {
          wait = false
        }, limit)
      }
    }
  }

  const queryString = obj => {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
    return str.join('&')
  }

  const deleteHoveredMessage = () => {
    const el = document.querySelector('ts-message:hover')
    el.style.display = "none"
    const ts = el.getAttribute('data-ts')
    const channel = el.getAttribute('data-model-ob-id')
    const token = window.boot_data.api_token
    const url = `https://${window.location.host}/api/chat.delete?_x_id=${_x_id()}`
    const params = queryString({
      channel,
      token,
      ts
    })

    const http = new XMLHttpRequest()
    http.open("POST", url, true)
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send(params)
  }

  const throttledDelete = throttle(deleteHoveredMessage)

  const handleKeyUp = e => {
    // Shift + Backspace
    if (e.shiftKey && e.keyCode === 8) {
      throttledDelete()
    }
  }

  document.addEventListener('keyup', handleKeyUp, false)
})();