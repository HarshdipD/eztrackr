document.addEventListener('DOMContentLoaded', function() { // this function  starts when extension is clicked

    // setting global variables
    Trello.setKey(APP_KEY);
    var token = localStorage.getItem('trello_token');
    var board_id = localStorage.getItem('board_id');
    var create_board = document.getElementById("create_board");
    var board_missing_div = document.getElementById('board_missing');
    var oauth_ok_div = document.getElementById('oauth_ok');
    var checkPageButton = document.getElementById('checkPage');

    // if token doesn't exist, go to options page and make the user authorize it
   if (!token) {
        chrome.tabs.create({url: chrome.extension.getURL('settings/index.html')});
        sendResponse();
        return true;
    }
    // if board does not exist, create one and add it to local storage
    else if(!board_id) {

        board_missing_div.style.display = 'block';

        create_board.addEventListener('click', function() {

            document.getElementById("create_board").innerHTML = "creating...";

            // create a new board and add lists to it
            Trello.post(`/boards?token=${token}&name=Full time Hunt`)
            .then(async (response) => 
                { 
                    localStorage.setItem('board_id', response.id);
                    board_id = localStorage.getItem('board_id');
                    Trello.post(`/lists?token=${token}&name=Offer&idBoard=${board_id}`);
                    Trello.post(`/lists?token=${token}&name=Reject&idBoard=${board_id}`);
                    Trello.post(`/lists?token=${token}&name=InProgress&idBoard=${board_id}`);
                    Trello.post(`/lists?token=${token}&name=Applied&idBoard=${board_id}`);
                    Trello.post(`/lists?token=${token}&name=Wishlist&idBoard=${board_id}`);
                    document.getElementById("create_board").innerHTML = "Done!";
                    working();
                })
            .catch(error => console(error));
        });
    }
    else {
        working();
    }

    function working(){    
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
            .then(data =>
                {  
                    let option;
                
                    for (let i = 0; i < data.length; i++) {
                    option = document.createElement('option');
                    option.text = data[i].name;
                    option.value = data[i].id;
                    dropdown.add(option);
                }
            })
            .catch(err => console.log("user has deleted the board manually."));
    
        // On button click, POST all the field data in trello board
        checkPageButton.addEventListener('click', function() {
            console.log("button clicked");
    
            chrome.tabs.getSelected(null, function(tab) {

                // Here's we'll make the card contents to POST
                let data_company = document.getElementById('data_company').value;
                let data_position = document.getElementById('data_position').value;
                let data_location = document.getElementById('data_location').value;
                let data_notes = document.getElementById('data_notes').value;
                idList = document.getElementById('list_options').value;

                let description = encodeURIComponent(`URL: ${tab.url} \n Company: ${data_company} \n Position: ${data_position} \n Location: ${data_location} \n\n Notes: ${data_notes}`);

                fetch(`https://api.trello.com/1/cards?key=${APP_KEY}&token=${token}&idList=${idList}&name=${data_company}&desc=${description}`, {
                method: 'POST',
                })
                .then(response => {
                    console.log("result", response);
                    if(response.status == 400 || response.status == 401){
                        console.log("ure dumb");
                        // now change divs
                        let abc = document.getElementById('post_fail');
                        abc.style.display = 'block';
                    } else{
                        console.log("POSTED");
                        // now change divs
                        let abc = document.getElementById('post_success');
                        oauth_ok_div.style.display = 'none';
                        abc.style.display = 'block';
                    }
                })
                .catch(err => console.error(err));
            });
        }, false);
    }
   
}, false);
