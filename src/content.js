let is_enabled = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "toggle_block") {
    isEnabled = request.state;
  }
});

/**
 * Event handler for the `click` event that blocks any new tab requests.
 *
 * @param {MouseEvent} ev
 */
function block_new_tab(ev) {
  let target = ev.target;

  // If the event is triggered on an element that's not an `<a>` tag,
  // go up the parent nodes until we find one.
  //
  // The loop terminates when it encounters the `Document` node, which
  // always returns `null` as its `parentNode`.
  //
  while (target && target.tagName.toLowerCase() !== "a") {
    target = target.parentNode;
  }

  if (
    target &&
    target.tagName.toLowerCase() === "a" &&
    target.getAttribute("target") === "_blank"
  ) {
    ev.preventDefault();
    ev.stopPropagation();
  }
}

chrome.storage.local.get([window.location.hostname], function (result) {
  is_enabled = result[window.location.hostname] || false;
  if (is_enabled) {
    document.addEventListener("click", block_new_tab, true);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "toggleFeature") {
    is_enabled = request.state;
    if (is_enabled) {
      document.addEventListener("click", block_new_tab, true);
    } else {
      document.removeEventListener("click", block_new_tab, true);
    }
  }
});
