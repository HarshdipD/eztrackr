function init() {
    var isFirefox = typeof InstallTrigger !== 'undefined';
    var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    // Firefox browser functions
    
    function onError(error) {
        console.log(error);
    }

    function removeTab(tab){
        browser.tabs.remove(tab[0].id);
    }

    // Check if page load is a redirect back from the auth procedure
    if (HashSearch.keyExists('token')) {

        Trello.authorize(
            {
                name: "Eztrackr",
                expiration: "never",
                interactive: false,
                scope: {read: true, write: true},
                success: function () {
        
                    if(isChrome){
                        try {
                            chrome.extension.sendMessage({
                                command: 'saveToken',
                                token: localStorage.getItem('trello_token')
                            }, function(data) {
                                chrome.tabs.getCurrent(function (tab) {
                                    chrome.tabs.remove(tab.id)
                                });
                            });
                        } catch (error) {
                            // do nothing
                        }
                    }
           
                    if(isFirefox){
                        try {
                            browser.runtime.sendMessage(null,{
                                command: 'saveToken',
                                token: localStorage.getItem('trello_token')
                            });
                            let querying = browser.tabs.query({currentWindow: true, active: true});
                            querying.then(removeTab, onError);
                        } catch (error){
                            
                        }

                        
                    }
                    
                },
                error: function () {
                    alert("Failed to authorize with Trello.")
                }
            });
    }

    // Message and button containers
    var lout = $("#loggedout");
    var lin = $("#loggedin");

    // Log in button
    $("#trello_helper_logout").click(function () {

        // Authorize Button Click Event
        // _gaq.push(['_trackEvent', 'Authorize Button', 'clicked']);

        Trello.setKey(APP_KEY);
        Trello.authorize(
            {
                name: "Eztrackr",
                type: "redirect",
                expiration: "never",
                interactive: true,
                scope: {read: true, write: true},
                success: function () {
                    // Can't do nothing, we've left the page
                },
                error: function () {
                    alert("Failed to authorize with Trello.")
                }
            });
    });

    // Log out button
    $("#trello_helper_login").click(function () {
        Trello.deauthorize();
        location.reload();
    });

    if (!localStorage.trello_token) {
        $(lout).show();
        $(lin).hide();
    } else {
        $(lout).hide();
        $(lin).show();
    }
}

$(document).ready(init);
