/** Service worker entry point. Implementation lands as features are built. */
export default defineBackground(() => {
  // Chrome opens the side panel when its toolbar icon is clicked. Firefox has
  // no sidePanel API — its sidebar_action provides a toolbar toggle natively —
  // so skip this there to avoid a startup TypeError.
  if (chrome.sidePanel) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  }
});
