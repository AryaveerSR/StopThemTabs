/**
 * This script is for the popup menu that appears every time the user presses
 * the extension icon. It toggles the blocker on the current site.
 */

/**
 * Sets the button's text content and style to reflect
 * the enabled or disabled state.
 *
 * @param {boolean} enabled
 */
function set_toggle_btn_state(enabled) {
  const toggle_btn = document.getElementById("toggle_btn");

  toggle_btn.textContent = enabled
    ? "Disable for this site"
    : "Enable for this site";

  toggle_btn.setAttribute("data-enabled", enabled ? "true" : "false");
}

/**
 * Click event handler for the toggle button.
 */
async function toggle_blocker() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tabs[0].url);
  const hostname = url.hostname;

  const result = await chrome.storage.local.get([hostname]);
  const new_state = !result[hostname];

  await chrome.storage.local.set({ [hostname]: new_state });

  set_toggle_btn_state(new_state);

  chrome.tabs.sendMessage(tabs[0].id, {
    action: "toggle_block",
    state: new_state,
  });
}

/**
 * Initialize the button text and event listeners on page load.
 */
document.addEventListener("DOMContentLoaded", async () => {
  const toggle_btn = document.getElementById("toggle_btn");

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tabs[0].url);
  const hostname = url.hostname;

  const result = await chrome.storage.local.get([hostname]);
  set_toggle_btn_state(result[hostname]);

  toggle_btn.addEventListener("click", toggle_blocker);
});
