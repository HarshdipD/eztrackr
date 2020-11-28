document.addEventListener('DOMContentLoaded', function () { // this function  starts when extension is clicked
    // setting global variables
    Trello.setKey(APP_KEY);
    var token = localStorage.getItem('trello_token');
    var board_id = localStorage.getItem('board_id');
    var create_board = document.getElementById("create_board");
    var use_existing_board = document.getElementById("use_existing_board");
    var board_url = document.getElementById("board_url");
    var board_url_div = document.getElementById("board_url_div");
    var set_board = document.getElementById("set_board");
    var board_url_error = document.getElementById("board_url_error");
    var board_missing_div = document.getElementById('board_missing');
    var oauth_ok_div = document.getElementById('oauth_ok');
    var checkPageButton = document.getElementById('checkPage');
    var alertBox = document.getElementById('alert_box');
    var alertBoxButton = document.getElementById('close_alert');
    var user_board_url = localStorage.getItem('user_board_url');
    var use_board_list = document.getElementById("use_board_list");
    var board_url_list = document.getElementById("board_url_list");
    var list_boards = document.getElementById("list_boards");
    var board_label = document.getElementById("board_label");
    var today = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const trelloBoardUrlPattern = /https\:\/\/trello\.com\/b\/(.{8})(\/.*)?$/;
    // check browser type
    var isFirefox = typeof InstallTrigger !== 'undefined';
    var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    // Firefox browser functions
    
    function onError(error) {
        console.log(error);
    }

    function loadTabs(tabs){
        document.getElementById('data_url').value =  tabs[0].url;
    }

    // end of the Firefox browser func

    // if token doesn't exist, go to options page and make the user authorize it
    if (!token) {
        chrome.tabs.create({ url: chrome.extension.getURL('settings/index.html') });
        return true;
    }
    // if board does not exist, set up one and add it to local storage
    else if (!board_id) {
        board_set_up_function();
    }
    else {
        working();
    }

    async function getBoardsList() {
    try {
    
            const [ boards] = await Promise.all([Trello.get(
            `/members/me/boards?token=${token}`)]);
            if (boards) {
   
                let dropdown = document.getElementById('list_boards');
                dropdown.length = 0;
                let defaultOption = document.createElement('option');
                defaultOption.text = 'Choose your board';
                dropdown.add(defaultOption);
                dropdown.selectedIndex = 0;

                let option;
                boards.map((b,idex)=>{
                  option = document.createElement('option');
                  option.text = b.name;
                  option.value = b.shortLink
                  dropdown.add(option);
                
                });
            }
            
        } catch (err) {
    
        }
    }

    /*
     * Lets user create or add their Trello board and save to local storage 
     */
    function board_set_up_function() {
        board_missing_div.style.display = 'block';
        oauth_ok_div.style.display = 'none';
        getBoardsList();
        set_board.addEventListener('click', function () {
            document.getElementById("set_board").textContent = "preparing your board...";

            if (create_board.checked) {
                board_create_function();
            } else if(use_existing_board.checked) {
                board_use_existing_function();
            } else if(use_board_list.checked){
                board_use_existing_function();
            }
        });
    }

    /*
     * Send POST request to Trello to create a board
     * Returns JSON object of board details
     * Send further POST requests to create 5 lists (Wishlist, InProgress, Applied, Offer, Rejected)
     */

    function board_create_function() {
        Trello.post(`/boards?token=${token}&name=Full time Hunt&defaultLists=false`)
            .then(async (response) => {
                localStorage.setItem('board_id', response.id);
                board_id = localStorage.getItem('board_id'); // Save board_id on local storage
                Trello.post(`/lists?token=${token}&name=Offer&idBoard=${board_id}`);
                await Trello.post(`/lists?token=${token}&name=Reject&idBoard=${board_id}`);
                await Trello.post(`/lists?token=${token}&name=InProgress&idBoard=${board_id}`);
                await Trello.post(`/lists?token=${token}&name=Applied&idBoard=${board_id}`);
                await Trello.post(`/lists?token=${token}&name=Wishlist&idBoard=${board_id}`);
                document.getElementById("set_board").textContent = "Done!";
                working();
            })
            .catch(error => console.log(error));
    }


    create_board.addEventListener('click', function () {
        board_url_div.style.display = "none";
        board_url_list.style.display = "none";
        clear_board_url_data();
    });

    function clear_board_url_data() {
        board_url_error.textContent = '';
        board_url.classList.remove("is-invalid");
        board_url.value = '';
    }

    use_existing_board.addEventListener('click', function () {
        board_url_div.style.display = "block";
        board_url_list.style.display = "none";
    });

    use_board_list.addEventListener('click', function(){
        board_url_div.style.display = "none";
        board_url_list.style.display = "block";
    });

    function board_use_existing_function() {
        var userBoardId = "";
        if(use_existing_board.checked){
            userBoardId = extract_board_id(board_url.value);
        }
        else if(use_board_list.checked){
            userBoardId = list_boards.options[list_boards.selectedIndex].value;
        }

        if (userBoardId) {
            Trello.get(`/boards/${userBoardId}?token=${token}`)
                .then(response => {
                    localStorage.setItem('board_id', response.id);
                    board_id = localStorage.getItem('board_id');
                    document.getElementById("set_board").textContent = "Done!";
                    working();
                })
                .catch(error => {
                    show_board_url_error("Could not find your board");
                });
        } else {
            show_board_url_error("Invalid URL");
        }
    }

    /**
     * Parse board ID from Trello board URL and return it
     */
    function extract_board_id(boardUrl) {
        let userBoardId = null;
        const boardUrlMatcher = boardUrl.match(trelloBoardUrlPattern);
        if (boardUrl && boardUrlMatcher) {
            userBoardId = boardUrlMatcher[1];
            localStorage.setItem('user_board_url', boardUrl);
        }
        return userBoardId;
    }

    /**
     * Display error message
     */
    function show_board_url_error(message) {
        board_url_error.textContent = message;
        board_url.classList.add("is-invalid");
        document.getElementById("set_board").textContent = "Done";
    }

    /**
     * main function to create cards
     */
    function working() {
        // initializing it again in case this is first time of use
        board_id = localStorage.getItem('board_id');

        // add url for boards
        let anchor_1 = document.getElementById('user_board_url_1');
        let anchor_2 = document.getElementById('user_board_url_2');
        anchor_1.href = localStorage.getItem('user_board_url') ? `${user_board_url}` : 'https://trello.com/';
        anchor_2.href = localStorage.getItem('user_board_url') ? `${user_board_url}` : 'https://trello.com/';

        oauth_ok_div.style.display = 'block';
        board_missing_div.style.display = 'none';

        let dropdown = document.getElementById('list_options');
        dropdown.length = 0;
        let defaultOption = document.createElement('option');
        defaultOption.text = 'Choose list';
        dropdown.add(defaultOption);
        dropdown.selectedIndex = 0;

        // fetches all the lists from the board whose id is ${board_id}
        // this is to be populated in the drop down of the extension
        Trello.get(`/boards/${board_id}/lists?token=${token}`)
            .then(data => {
                let option;

                for (let i = 0; i < data.length; i++) {
                    option = document.createElement('option');
                    option.text = data[i].name;
                    option.value = data[i].id;
                    dropdown.add(option);
                }
            })
            .catch(err => {
                console.log("user has deleted the board manually.");
                board_set_up_function();
            });

        // START POPULATING FIELDS

        // For LinkedIn, fetch comapany name, position and location by web scraping
        // To do: other common job posting websites - this would require more organized code, different function for each website.
        if(isChrome) {
            // using try & catch to handle error 
            // since Firefox does not recognize "chrome"
            try {
                chrome.tabs.getSelected(null, function (tab) {
                    document.getElementById('data_url').value = tab.url;
                });
            } catch (error) {
                // onError();
            }
        }

        if(isFirefox){
            let querying = browser.tabs.query({currentWindow: true, active: true});
            querying.then(loadTabs, onError);
        }

        function getFieldsFromDOM() {
            let fields = []
            //Account for Companies which have no URL/Link
            try {
                let url = document.getElementsByClassName("jobs-details-top-card__company-url")[0].innerText.trim();
                fields.push(url)
            } catch {
                var childNodes = document.getElementsByClassName("jobs-details-top-card__company-info")[0].childNodes;
                result = '';
                for (var i = 0; i < childNodes.length; i++) {
                    if (childNodes[i].nodeType == 3) {
                        result += childNodes[i].data;
                    }
                }
                fields.push(result.trim())
            }
            fields.push(document.getElementsByClassName("jobs-details-top-card__job-title")[0].innerText.trim())
            fields.push(document.getElementsByClassName("jobs-details-top-card__bullet")[0].innerText.trim())

            return fields;
        }

        // if the website isn't LinkedIn, there will be error in console. Do not worry, for this is temporary :)
        function updateFields(results) {
            try {
                document.getElementById('data_company').value = results[0][0];
                document.getElementById('data_position').value = results[0][1];
                document.getElementById('data_location').value = results[0][2];
            } catch (error) {
                onError(error);
            }
        }
        const code = '(' + getFieldsFromDOM + ')();';
        if(isChrome){
            try {
                chrome.tabs.executeScript({
                    code
                }, (results) => {
                    updateFields(results);
                });
            } catch (error) {
                onError(error);
            }
        }

        if(isFirefox){
            const executing = browser.tabs.executeScript({
                code
            });
            executing.then(updateFields, onError);
        }
        // END POPULATING FIELDS


        // On button click, POST all the field data in trello board
        checkPageButton.addEventListener('click', function () {

            // Button Click Event to send to Analytics
            // _gaq.push(['_trackEvent', 'Add To Trello', 'clicked']);

            // Here's we'll make the card contents to POST
            let data_url = document.getElementById('data_url').value;
            let data_company = document.getElementById('data_company').value;
            let data_position = document.getElementById('data_position').value;
            let data_location = document.getElementById('data_location').value;
            let data_notes = document.getElementById('data_notes').value;
            idList = document.getElementById('list_options').value;
            let date_applied = today.getDate() + " " + monthNames[today.getMonth()] + ", " + today.getFullYear();

            let description = encodeURIComponent(`URL: ${data_url} \n Company: ${data_company} \n Position: ${data_position} \n Location: ${data_location} \n Date Applied: ${date_applied} \n\n Notes: ${data_notes}`);

            if (idList != 'Choose list') {
                Trello.post(`/cards?key=${APP_KEY}&token=${token}&idList=${idList}&name=${data_company}&desc=${description}`)
                    .then(response => {
                        console.log("result", response);
                        if (response.status == 400 || response.status == 401 || response.status == 403) {
                            // now change divs
                            displayError('There was an issue posting this card to Trello. Please try again.');
                        } else {
                            // now change divs
                            let abc = document.getElementById('post_success');
                            oauth_ok_div.style.display = 'none';
                            abc.style.display = 'block';
                        }
                    })
                    .catch(err => console.error(err));
            } else {
                displayError('Please choose a list to add the job to.');
                document.getElementById('list_options').focus();
            }
      
        }, false);

        function displayError(txt) {
            let msg = document.getElementById('alert_msg');
            msg.textContent = txt;
            alertBox.style.display = 'block';
        }

        function closeAlert() {
            alertBox.style.display = 'none';
        }

        alertBoxButton.addEventListener('click', function () {
            closeAlert();
        });

        // automatically close error message on list select
        document.getElementById('list_options').addEventListener("change", closeAlert);
    }

}, false);


/*
     * Wire googlemap api
     * countryRestrict : [] returns cities from the all the country. 
*/
// google.maps.event.addDomListener(window, 'load', initAutoComplete);
// let autocomplete;
// let countryRestrict = { country: [] };

// function initAutoComplete() {
//     autocomplete = new google.maps.places.Autocomplete(
//         document.getElementById("data_location"),
//         {
//             types: ["(cities)"],
//             componentRestrictions: countryRestrict,
//         }
//     )
   
// }
