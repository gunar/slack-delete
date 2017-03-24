// ==UserScript==
// @name       Slack Easy Delete
// @author     http://github.com/gunar
// @version    1.0
// ==/UserScript==

(function() {
  'use strict';
  const deleteHoveredMessage = () => {
    const actionsBtn = document.querySelector('ts-message:hover button[data-action="actions_menu"]')
    if (!actionsBtn) return
    actionsBtn.click()
    const deleteBtn = document.querySelector('li#delete_link a')
    if (!deleteBtn) return
    deleteBtn.click()
    const okBtn = document.querySelector('button.btn.dialog_go.btn_danger')
    if (!okBtn) return
    okBtn.click()
  }

  const keyUp = e => {
    // Control + Shift + Space
    if (e.ctrlKey && e.shiftKey && e.keyCode == '32') {
      deleteHoveredMessage()
    }
  }
  document.addEventListener('keyup', keyUp, false)
})();
