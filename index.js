// ==UserScript==
// @name       Slack Easy Delete
// @author     http://github.com/gunar
// @version    1.0
// ==/UserScript==

(function() {
  'use strict';
  const deleteHoveredMessage = () => {
    document.querySelector('ts-message:hover button[data-action="actions_menu"]').click()
    document.querySelector('li#delete_link a').click()
    document.querySelector('button.btn.dialog_go.btn_danger').click()
  }

  const keyUp = e => {
    // Shift + Backspace
    if (e.shiftKey && e.keyCode === 8) {
      deleteHoveredMessage()
    }
  }
  document.addEventListener('keyup', keyUp, false)
})();
