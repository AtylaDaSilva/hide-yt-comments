function browserHistoryListener() {
    console.log("HIDE-YT-COMMENTS: Running background listener...")
    browser.webNavigation.onHistoryStateUpdated.addListener(
    (details) => {
        if (details.frameId !== 0) return;  // Only run on the top-level frame
        browser.tabs.executeScript(details.tabId, { file: "script.js" });
    },
    { url: [{ hostContains: "youtube.com" }] }
    );
}

browserHistoryListener();