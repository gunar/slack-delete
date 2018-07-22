// ==UserScript==
// @name       Slack Easy Delete
// @author     http://github.com/gunar
// @version    1.0
// ==/UserScript==

;(function() {
  'use strict'
  function makeRequest(url, params) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest()
      xhr.open('POST', url, true)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response)
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText,
          })
        }
      }
      xhr.onerror = function() {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        })
      }
      xhr.send(params)
    })
  }

  const _x_id = () =>
    `${window.boot_data.version_uid.substring(0, 8)}-${new Date().getTime() / 1000}`

  var maxConcurrent = 1
  var maxQueue = Infinity
  var queue = new Queue(maxConcurrent, maxQueue)

  const queryString = obj => {
    const str = []
    for (const p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
    return str.join('&')
  }

  const enqueueDeleteMessage = (...args) =>
    queue.add(() =>
      (({ channel, ts }) => {
        const token = window.boot_data.api_token
        const params = queryString({ channel, token, ts })
        const url = `https://${window.location.host}/api/chat.delete?_x_id=${_x_id()}`
        return makeRequest(url, params)
      })(...args)
    )

  const deleteHoveredMessage = () => {
    const el = document.querySelector('.c-message--hover')
    if (!el) return
    // extract channel and ts from link
    // example href: /archives/C8ZM37LNQ/p1532163134000047
    const linkHref = el.querySelector('.c-timestamp').getAttribute('href')
    const hrefParts = linkHref.split('/')
    const channel = hrefParts[2]
    const ts = hrefParts[3].substr(1, 10) + '.' + hrefParts[3].substr(11)
    enqueueDeleteMessage({ channel, ts })
    el.parentNode.removeChild(el)
  }

  // const shouldDelete = e => e.shiftKey && e.keyCode === 8 // shift + backspace

  const shouldDelete = e => e.ctrlKey && e.shiftKey && e.code === 'Space'

  const onKeyUp = e => {
    if (shouldDelete(e)) deleteHoveredMessage()
  }

  document.addEventListener('keyup', onKeyUp, false)
})()
