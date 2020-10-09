chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        chrome.pageAction.show(sender.tab.id);

        if (!request.command && !localStorage.getItem('trello_token')) {
            chrome.tabs.create({url: chrome.extension.getURL('settings/index.html')});
            sendResponse();
            return true;
        }

        // Now we have a token saved locally, as fetched from the settings page after authorization.
        if (request.command == 'saveToken') {
            localStorage.setItem('trello_token', request.token);
            sendResponse();
            return true;
        }

    });
