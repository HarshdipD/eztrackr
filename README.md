# eztrackr
A Chrome extension that saves your jobs to your Trello boards. 

<img src="https://media.discordapp.net/attachments/643672629076688917/764166953644064799/unknown.png?width=799&height=499" />
<br />
<img src="https://i.imgur.com/lfwpoJ3.jpeg" />

## How it works
Just click on the extension icon, enter the fields and it will add it to an already created Trello board. <br />
What it currently adds: Job company, position, location, and the URL of the page where you applied the job. This information is added as a card to a list. <br />
Current dev version (1.1.0) also adds the date of card creation.

### Does it work right now? 
Yes! Version 1 is out right now and you can install it here: https://chrome.google.com/webstore/detail/eztrackr/kdpbamlhffmfbgglmaedhopenkpgkfdg

### Setting it up
If you're here to help contribute, here are a few steps on how to set this extension up

1. Make sure you have enabled developer mode in Chrome at `chrome://extensions`
2. Clone this repo, and press 'Load unpacked' to load this extension
3. Go to key.js and replace the field of `api_key`. It can found out at https://trello.com/app-key
4. Add the Chrome extension ID to Allowed origins section in the same Trello page

That's it! You should be able to use the extension and see your cards being saved on Trello. 
Note: If you skip the 4th step, you will recieve an invalid redirect error. 

### Contributors:
1. <a href="https://github.com/jere-mie">Jeremie Bornais</a> for helping with the name and logo of the extension
2. <a href="https://github.com/JameelJiwani">Jameel Jiwani</a> for helping me with Trello oauth and common JavaScript issues!
