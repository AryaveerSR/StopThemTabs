/**
 * This script is run on every page on load and sets up the
 * event interceptor.
 */

// Whether the blocker is enabled for this page.
//
let is_enabled = false;

/**
 * Event handler for the `click` event that blocks any new tab requests.
 *
 * @param {MouseEvent} ev
 */
function block_on_click(ev) {
  let target = ev.target;

  // If the event is triggered on an element that's not an `<a>` tag,
  // go up the parent nodes until we find one.
  //
  // The loop terminates when it encounters the `Document` node, which
  // always returns `null` as its `parentNode`.
  //
  while (
    target &&
    target.tagName != undefined &&
    target.tagName.toLowerCase() !== "a"
  ) {
    target = target.parentNode;
  }

  if (
    target &&
    target.tagName != undefined &&
    target.tagName.toLowerCase() === "a" &&
    target.getAttribute("target") === "_blank"
  ) {
    ev.preventDefault();
    ev.stopPropagation();
  }
}

/**
 * Blocks new tab requests from form submit events.
 *
 * @param {SubmitEvent} ev
 */
function block_on_submit(ev) {
  const form = ev.target;

  if (form.target == "_blank") {
    ev.preventDefault();
  }
}

/**
 * Enables the blocker for this page.
 */
function enable_blocker() {
  document.addEventListener("click", block_on_click, true);
  document.addEventListener("submit", block_on_submit, true);
}

/**
 * Disables the blocker for this page.
 */
function disable_blocker() {
  document.removeEventListener("click", block_on_click, true);
  document.removeEventListener("submit", block_on_submit, true);
}

/**
 * Fetch preferences (if any) from the local storage, and set the
 * event listeners if enabled for this page.
 */
chrome.storage.local.get([window.location.hostname], (result) => {
  is_enabled = result[window.location.hostname] || false;

  if (is_enabled) enable_blocker();
});

/**
 * Listen for messages from the popup window.
 * They allow the user to toggle the blocker for the currently opened site.
 */
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "toggle_block") {
    is_enabled = request.state;

    if (is_enabled) enable_blocker();
    else disable_blocker();
  }
});
