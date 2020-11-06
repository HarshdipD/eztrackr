# eztrackr
A Chrome extension that saves your jobs to your Trello boards. 

<img src="https://media.discordapp.net/attachments/643672629076688917/764166953644064799/unknown.png?width=799&height=499" />
<br />
<img src="https://i.imgur.com/lfwpoJ3.jpeg" />

## How it works
Just click on the extension icon, enter the fields and it will add it to an already created Trello board! The extension auto-fills the fields if you're on LinkedIn jobs. 

### Does it work right now? 
Yes! You can install it here: https://chrome.google.com/webstore/detail/eztrackr/kdpbamlhffmfbgglmaedhopenkpgkfdg

### Setting it up
If you're here to help contribute, here are a few steps on how to set this extension up

1. Make sure you have enabled developer mode in Chrome at `chrome://extensions`
2. Clone this repo, and press 'Load unpacked' to load this extension
3. Go to key.js and replace the field of `APP_KEY`. It can found out at https://trello.com/app-key
4. Add the Chrome extension ID to Allowed origins section in the same Trello page (eg. `chrome-extension://okpdemdmpglaapjpbdphmfhlfjbilbpc`)

That's it! You should be able to use the extension and see your cards being saved on Trello.<br />
Note: If you skip the 4th step, you will recieve an invalid redirect error. 

### Contributors:
1. <a href="https://github.com/jere-mie">Jeremie Bornais</a> for helping with the name and logo of the extension
2. <a href="https://github.com/JameelJiwani">Jameel Jiwani</a> for helping me with Trello oauth and common JavaScript issues!
