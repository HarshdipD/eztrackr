document.addEventListener('DOMContentLoaded', function() { // this function  starts when extension is clicked

    /* credentials and all that

     - api_key can be found at: https://trello.com/app-key
     - token can be genereated just below api_key
    ----------- TO DO: wahid/jeremie: api_key and token are to be added with ouath ------------
    ---- to do: add promises so nothing happens before contents are finally fetched ----
     - idList is a temporary variable for testing purposes. This is supposed to be automatically fetched when extension is clicked
     - board_id is the id of the board that is to be populated. This needs to be setup permanently so user doesn't have to choose it everytime

    */ 

    var oauth_missing_div = document.getElementById('oauth_missing');
    var oauth_ok_div = document.getElementById('oauth_ok');
    // var board_missing_div = document.getElementById('board_missing');

    let api_key = '';
    let token = '';
    let idList = '';
    let board_id = '';

    // if not authorized 
    if(api_key === "") {
        oauth_missing_div.style.display = 'block';
        //TODO NOW HERE WE AUTHORIZE THE USER OK
    } 
    // else if(board_id === '') {
    //     // TO DO: we need to find a way to update board id
    //     // we ask user to connect a board or let us create a new one!
    //     board_missing_div.style.display = 'block';
    //     var createBoardButton = document.getElementById('create_board');
    //     createBoardButton.addEventListener('click', function() {
    //         console.log("create board process");
    //     });

    // } 
    else { // user has board set, lets get to it!

        oauth_ok_div.style.display = 'block';

        // magic time
        var checkPageButton = document.getElementById('checkPage');

        // yooooo
        let dropdown = document.getElementById('list_options');
        dropdown.length = 0;
        let defaultOption = document.createElement('option');
        defaultOption.text = 'Choose list';
        dropdown.add(defaultOption);
        dropdown.selectedIndex = 0;

        // fetches all the lists from the board whose id is ${board_id}
        // this is to be populated in the drop down of the extension
        fetch(`https://api.trello.com/1/boards/${board_id}/lists?key=${api_key}&token=${token}`, {
            method: 'GET'
            })
            .then(response => {
                console.log(
                `Response: ${response.status} ${response.statusText}`
                );
                // lists with id and names in drop down of id: list_options
                response.json().then(function(data) {  
                    let option;
                
                    for (let i = 0; i < data.length; i++) {
                    option = document.createElement('option');
                    option.text = data[i].name;
                    option.value = data[i].id;
                    dropdown.add(option);
                    }    
                });
            })
            .catch(err => console.error(err));
    
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

                fetch(`https://api.trello.com/1/cards?key=${api_key}&token=${token}&idList=${idList}&name=${data_company}&desc=${description}`, {
                method: 'POST',
                })
                .then(response => {
                    console.log("result", response);
                    if(response.status == 400){
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
