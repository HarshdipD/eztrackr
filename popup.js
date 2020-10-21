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
    var today = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const trelloBoardUrlPattern = /https\:\/\/trello\.com\/b\/(.{8})(\/.*)?$/;

    create_board.addEventListener('click', function () {
        board_url_div.style.display = "none";
        clear_board_url_data();
    });

    use_existing_board.addEventListener('click', function () {
        board_url_div.style.display = "block";
    });

    // if token doesn't exist, go to options page and make the user authorize it
    if (!token) {
        chrome.tabs.create({ url: chrome.extension.getURL('settings/index.html') });
        sendResponse();
        return true;
    }
    // if board does not exist, set up one and add it to local storage
    else if (!board_id) {
        board_set_up_function();
    }
    else {
        working();
    }

    function board_set_up_function() {
        board_missing_div.style.display = 'block';
        oauth_ok_div.style.display = 'none';

        set_board.addEventListener('click', function () {
            document.getElementById("set_board").innerHTML = "preparing your board...";

            if (create_board.checked) {
                board_create_function();
            } else {
                board_use_existing_function();
            }
        });
    }

    function board_create_function() {
        Trello.post(`/boards?token=${token}&name=Full time Hunt&defaultLists=false`)
            .then(async (response) => {
                localStorage.setItem('board_id', response.id);
                board_id = localStorage.getItem('board_id');
                Trello.post(`/lists?token=${token}&name=Offer&idBoard=${board_id}`);
                await Trello.post(`/lists?token=${token}&name=Reject&idBoard=${board_id}`);
                await Trello.post(`/lists?token=${token}&name=InProgress&idBoard=${board_id}`);
                await Trello.post(`/lists?token=${token}&name=Applied&idBoard=${board_id}`);
                await Trello.post(`/lists?token=${token}&name=Wishlist&idBoard=${board_id}`);
                document.getElementById("set_board").innerHTML = "Done!";
                working();
            })
            .catch(error => console.log(error));
    }

    function board_use_existing_function() {
        const userBoardId = extract_board_id(board_url.value);

        if (userBoardId) {
            Trello.get(`/boards/${userBoardId}?token=${token}`)
                .then(response => {
                    localStorage.setItem('board_id', response.id);
                    board_id = localStorage.getItem('board_id');
                    document.getElementById("set_board").innerHTML = "Done!";
                    working();
                })
                .catch(error => {
                    show_board_url_error("Could not find your board");
                });
        } else {
            show_board_url_error("Invalid URL");
        }
    }

    function extract_board_id(boardUrl) {
        let userBoardId = null;
        const boardUrlMatcher = boardUrl.match(trelloBoardUrlPattern);
        if (boardUrl && boardUrlMatcher) {
            userBoardId = boardUrlMatcher[1];
        }
        return userBoardId;
    }

    function show_board_url_error(message) {
        board_url_error.innerHTML = message;
        board_url.classList.add("is-invalid");
        document.getElementById("set_board").innerHTML = "Done";
    }

    function clear_board_url_data() {
        board_url_error.innerHTML = '';
        board_url.classList.remove("is-invalid");
        board_url.value = ''
    }

    function working() {
        // initializing it again IN CASE this is first time of use
        board_id = localStorage.getItem('board_id');

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
        
        // Populating Fields
        chrome.tabs.getSelected(null, function (tab) {
            document.getElementById('data_url').value = tab.url;
        });

        function getFieldsFromDOM() {
            let fields = []
            //Account for Companies which have no URL/Link
            try {
                let url = document.getElementsByClassName("jobs-details-top-card__company-url")[0].innerText.trim();
                fields.push(url)
                // fields.push(document.getElementsByClassName("jobs-details-top-card__company-url")[0].innerText.trim())
            } catch {
                var childNodes = document.getElementsByClassName("jobs-details-top-card__company-info")[0].childNodes;
                result = '';
                for (var i = 0; i < childNodes.length; i++) {
                    if(childNodes[i].nodeType == 3) {
                        result += childNodes[i].data;
                    }
                }
                fields.push(result.trim())
            }
            fields.push(document.getElementsByClassName("jobs-details-top-card__job-title")[0].innerText.trim())
            fields.push(document.getElementsByClassName("jobs-details-top-card__bullet")[0].innerText.trim())   
                  
            return fields
        }
        chrome.tabs.executeScript({
            code: '(' + getFieldsFromDOM +')();'
        }, (results) => {
            document.getElementById('data_company').value = results[0][0]
            document.getElementById('data_position').value = results[0][1]
            document.getElementById('data_location').value = results[0][2]
        });

        // END POPULATING FIELDS


        // On button click, POST all the field data in trello board
        checkPageButton.addEventListener('click', function () {

            // Button Click Event
            _gaq.push(['_trackEvent', 'Add To Trello', 'clicked']);

            chrome.tabs.getSelected(null, function (tab) {

                // Here's we'll make the card contents to POST
                let data_url = document.getElementById('data_url').value;
                let data_company = document.getElementById('data_company').value;
                let data_position = document.getElementById('data_position').value;
                let data_location = document.getElementById('data_location').value;
                let data_notes = document.getElementById('data_notes').value;
                idList = document.getElementById('list_options').value;
                let date_applied = today.getDate() + " " + monthNames[today.getMonth()] + ", " + today.getFullYear();

                let description = encodeURIComponent(`URL: ${data_url} \n Company: ${data_company} \n Position: ${data_position} \n Location: ${data_location} \n Date Applied: ${date_applied} \n\n Notes: ${data_notes}`);
                if(idList != 'Choose list'){
                    Trello.post(`/cards?key=${APP_KEY}&token=${token}&idList=${idList}&name=${data_company}&desc=${description}`)
                        .then(response => {
                            console.log("result", response);
                            if (response.status == 400 || response.status == 401 || response.status == 403) {
                                console.log("error error");
                                // now change divs
                                displayError('There was an issue posting this card to Trello. Please try again.');
                            } else {
                                console.log("POSTED");
                                // now change divs
                                let abc = document.getElementById('post_success');
                                oauth_ok_div.style.display = 'none';
                                abc.style.display = 'block';
                            }
                        })
                        .catch(err => console.error(err));
                  } else {
                    console.log("no list selected");
                    displayError('Trello list must be chosen before adding a new card');
                    document.getElementById('list_options').focus();
                  }        
            });
        }, false);
        
        function displayError(txt){
          let msg = document.getElementById('alert_msg');
          msg.innerHTML = txt;
          alertBox.style.display = 'block';
        }

        function closeAlert(){
          alertBox.style.display = 'none';
        }

        alertBoxButton.addEventListener('click', function () {
            closeAlert();
        });

        document.getElementById('list_options').addEventListener("change", closeAlert);
    }

}, false);
