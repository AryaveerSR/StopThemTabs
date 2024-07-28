/**
 * Prevents any new tab from opening that was opened by a
 * blocked site. This is kind of a catchall, and causes screen
 * flickering, so the less its used, the better.
 *
 * @param {chrome.tabs.Tab} tab
 */
async function on_tab_created(tab) {
  // The tab was opened by the user.
  //
  if (!tab.openerTabId) return;

  const opener_tab = await chrome.tabs.get(tab.openerTabId);
  const hostname = new URL(opener_tab.url).hostname;

  const result = await chrome.storage.local.get([hostname]);

  // The opening tab is not blocked.
  //
  if (!result[hostname]) return;

  // Switch back to the opener tab and close the new tab.
  //
  await chrome.tabs.update(tab.openerTabId, { active: true });
  await chrome.tabs.remove(tab.id);
}

chrome.tabs.onCreated.addListener(on_tab_created);
