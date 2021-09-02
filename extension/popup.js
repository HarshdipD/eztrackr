document.addEventListener('DOMContentLoaded', function () {
    // setting global variables
    Trello.setKey(APP_KEY);
    let token = localStorage.getItem('trello_token');
    let board_id = localStorage.getItem('board_id');
    let create_board = document.getElementById("create_board");
    let use_existing_board = document.getElementById("use_existing_board");
    let board_url = document.getElementById("board_url");
    let board_url_div = document.getElementById("board_url_div");
    let set_board = document.getElementById("set_board");
    let board_url_error = document.getElementById("board_url_error");
    let board_missing_div = document.getElementById('board_missing');
    let oauth_ok_div = document.getElementById('oauth_ok');
    let checkPageButton = document.getElementById('checkPage');
    let alertBox = document.getElementById('alert_box');
    let alertBoxButton = document.getElementById('close_alert');
    let user_board_url = localStorage.getItem('user_board_url');
    let use_board_list = document.getElementById("use_board_list");
    let board_url_list = document.getElementById("board_url_list");
    let list_boards = document.getElementById("list_boards");
    let today = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const trelloBoardUrlPattern = /https\:\/\/trello\.com\/b\/(.{8})(\/.*)?$/;

    // Authorize user if token does not exist
    if (!token) {
        chrome.tabs.create({url: chrome.extension.getURL('settings/index.html')});
        return true;
    } else if (!board_id) {
        board_set_up_function();
    } else {
        working();
    }

    create_board.addEventListener('click', function () {
        board_url_div.style.display = 'none';
        board_url_list.style.display = 'none';
        clear_board_url_data();
    });

    function clear_board_url_data() {
        board_url_error.textContent = '';
        board_url.classList.remove('is-invalid');
        board_url.value = '';
    }

    use_existing_board.addEventListener('click', function () {
        board_url_div.style.display = 'block';
        board_url_list.style.display = 'none';
    });

    use_board_list.addEventListener('click', function () {
        board_url_div.style.display = 'none';
        board_url_list.style.display = 'block';
    });

    function board_set_up_function() {

        board_missing_div.style.display = 'block';
        oauth_ok_div.style.display = 'none';

        getBoardsList();

        set_board.addEventListener('click', function () {
            if (create_board.checked) {
                board_create_function();
            } else if (use_existing_board.checked || use_board_list.checked) {
                board_use_existing_function();
            }
        });
    }

    async function getBoardsList() {
        try {
            const [boards] = await Promise.all([Trello.get(
                `/members/me/boards?token=${token}`)]);
            if (boards) {

                let dropdown = document.getElementById('list_boards');
                dropdown.length = 0;
                let defaultOption = document.createElement('option');
                defaultOption.text = 'Choose your board';
                dropdown.add(defaultOption);
                dropdown.selectedIndex = 0;

                let option;
                boards.map((b) => {
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
     * Send POST request to Trello to create a board
     * Returns JSON object of board details
     * Send further POST requests to create 5 lists (Wishlist, InProgress, Applied, Offer, Rejected)
     */
    function board_create_function() {

        document.getElementById("set_board").textContent = "Preparing your board...";

        Trello.post(`/boards?token=${token}&name=Eztrackr board&defaultLists=false`)
            .then(async (response) => {

                localStorage.setItem('board_id', response.id);
                board_id = localStorage.getItem('board_id');
                localStorage.setItem('user_board_url', response.url);
                board_url = localStorage.getItem('board_url');

                Trello.post(`/lists?token=${token}&name=Offer&idBoard=${board_id}`);
                await Trello.post(`/lists?token=${token}&name=Reject&idBoard=${board_id}`);
                await Trello.post(`/lists?token=${token}&name=InProgress&idBoard=${board_id}`);
                await Trello.post(`/lists?token=${token}&name=Applied&idBoard=${board_id}`);
                await Trello.post(`/lists?token=${token}&name=Wishlist&idBoard=${board_id}`);

                document.getElementById('set_board').textContent = 'Done!';
                working();
            })
            .catch(error => console.log(error));
    }

    function board_use_existing_function() {
        let userBoardId = '';

        if (use_existing_board.checked) {
            userBoardId = extract_board_id(board_url.value);
        } else if (use_board_list.checked) {
            userBoardId = list_boards.options[list_boards.selectedIndex].value;
        }

        if (userBoardId) {

            document.getElementById("set_board").textContent = "Preparing your board...";

            Trello.get(`/boards/${userBoardId}?token=${token}`)
                .then(response => {
                    localStorage.setItem('board_id', response.id);
                    board_id = localStorage.getItem('board_id');
                    localStorage.setItem('user_board_url', response.url);
                    board_url = localStorage.getItem('board_url');
                    document.getElementById('set_board').textContent = 'Done!';
                    working();
                })
                .catch(error => {
                    show_board_url_error('Hmm... we can\'t find this board');
                });
        } else {
            show_board_url_error('Hmm... we can\'t find this board');
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
    }

    /**
     * main function to create cards
     */
    function working() {
        // initializing it again in case this is first time of use
        board_id = localStorage.getItem('board_id');

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

        chrome.tabs.getSelected(null, function (tab) {
            document.getElementById('data_url').value = tab.url;
        });

        const code = '(' + getFieldsFromDOM + ')();';
        chrome.tabs.executeScript({
            code
        }, (results) => {
            updateFields(results);
        });

        function getFieldsFromDOM() {
            let fields = []
            try {
                let url = document.getElementsByClassName("jobs-unified-top-card__content--two-pane")[0]
                    .querySelector('a').querySelector('h2').innerText;
                fields.push(url);
            } catch {
                fields.push('');
            }
            fields.push(document.getElementsByClassName('jobs-unified-top-card__subtitle-primary-grouping')[0]
                .querySelectorAll('span')[0].innerText)
            fields.push(document.getElementsByClassName('jobs-unified-top-card__subtitle-primary-grouping')[0]
                .querySelectorAll('span')[1].innerText)

            return fields;
        }

        function updateFields(results) {
            try {
                document.getElementById('data_position').value = results[0][0];
                document.getElementById('data_company').value = results[0][1];
                document.getElementById('data_location').value = results[0][2];
            } catch (error) {
            }
        }

        // POST all the field data in trello board
        checkPageButton.addEventListener('click', function () {

            _gaq.push(['_trackEvent', 'Add To Trello', 'clicked']);

            let data_url = document.getElementById('data_url').value;
            let data_company = document.getElementById('data_company').value;
            let data_position = document.getElementById('data_position').value;
            let data_location = document.getElementById('data_location').value;
            let data_notes = document.getElementById('data_notes').value;
            let idList = document.getElementById('list_options').value;
            let date_applied = today.getDate() + " " + monthNames[today.getMonth()] + ", " + today.getFullYear();

            let description = encodeURIComponent(`URL: ${data_url} \n Company: ${data_company} \n Position: ${data_position} \n Location: ${data_location} \n Date Applied: ${date_applied} \n\n Notes: ${data_notes}`);

            if (idList !== 'Choose list') {
                Trello.post(`/cards?key=${APP_KEY}&token=${token}&idList=${idList}&name=${data_company} - ${data_position}&desc=${description}`)
                    .then(response => {
                        console.log('result', response);
                        if (response.status === 400 || response.status === 401 || response.status === 403) {
                            displayError('There was an issue posting this card to Trello. Please try again.');
                        } else {
                            let abc = document.getElementById('post_success');
                            oauth_ok_div.style.display = 'none';
                            abc.style.display = 'block';
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        displayError('There was an issue posting this card to Trello. Please try again.');
                    });
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
/*
    google.maps.event.addDomListener(window, 'load', initAutoComplete);
    let autocomplete;
    let countryRestrict = { country: [] };

    function initAutoComplete() {
        autocomplete = new google.maps.places.Autocomplete(
            document.getElementById("data_location"),
            {
                types: ["(cities)"],
                componentRestrictions: countryRestrict,
            }
        )

    }
 */
