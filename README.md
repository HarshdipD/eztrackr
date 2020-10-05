# job-tracker
A Chrome extension that saves your jobs to your Trello boards. 

## How it works
Just click on the extension icon, enter the fields and it will add it to your decided Trello board.
What it currently adds: Job company, position, location, and the URL of the page where you applied the job. This information is added as a card to a list. 

### Does it work right now? 
If you're an end user looking to add jobs, NO. This extension is still under active development. A beta-version will come soon!
<br>
If you're a developer, YES. You need to get your credentials, board and list IDs from Trello, fill them in `popup.js` and it should work! You're also welcome to contribute new features! The project is heavily docuemented, and I'll add in-progress and to-do items in the Projects section soon.

### Setting it up
If you're here to help contribute, here are a few steps on how to set this extension up

1. Make sure you have enabled developer mode in Chrome at `chrome://extensions`
2. Clone this repo, and press 'Load unpacked' to load this extension
3. Go to popup.js and fill in the fields of `api_key`, `token` and `board_id`. The first two can be found out at https://trello.com/app-key and the board_id is the id in URL of one of your Trello boards
4. That's it! You should be able to use the extension and see your cards being saved on Trello.

**Why so many steps?** Want to help with Trello oauth and make this a finished product? Head over to https://github.com/HarshdipD/job-tracker/issues/8 and make a PR! 

#### TODO:
Once the extension is set with Trello's oauth, the first version should be out for use!

