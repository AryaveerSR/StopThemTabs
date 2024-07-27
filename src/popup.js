/**
 * This script is for the popup menu that appears every time the user presses
 * the extension icon. It toggles the blocker on the current site.
 */

const get_toggle_btn_content = (enabled) =>
  enabled ? "Disable for this site" : "Enable for this site";

/**
 * Click event handler for the toggle button.
 */
function toggle_blocker() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = new URL(tabs[0].url);
    const hostname = url.hostname;

    chrome.storage.local.get([hostname], (result) => {
      const new_state = !result[hostname];

      chrome.storage.local.set({ [hostname]: new_state }, () => {
        toggle_btn.textContent = get_toggle_btn_content(new_state);

        chrome.tabs.sendMessage(tabs[0].id, {
          action: "toggle_block",
          state: new_state,
        });
      });
    });
  });
}

/**
 * Initialize the button text and event listeners on page load.
 */
document.addEventListener("DOMContentLoaded", () => {
  const toggle_btn = document.getElementById("toggle_btn");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = new URL(tabs[0].url);
    const hostname = url.hostname;

    chrome.storage.local.get([hostname], (result) => {
      toggle_btn.textContent = get_toggle_btn_content(result[hostname]);
    });
  });

  toggle_btn.addEventListener("click", toggle_blocker);
});
