# eztrackr
A Chrome and Firefox extension that saves your jobs to your Trello boards ✨
<br /><br />
Add the job you just applied to right from the same tab and it will add it to your Trello board! You can then visit this board which will keep track of all your job applications.
<br />
You have an option to add your own board, or it can create a nice one for you. 
<br />
The extension also shows you current statistics 📈, and even auto-fills the fields if you're on LinkedIn jobs! 🤩


## Install it here:
🌐 Chrome: [https://chrome.google.com/webstore/detail/eztrackr/kdpbamlhffmfbgglmaedhopenkpgkfdg](Webstore link)
<br />
🌐 Firefox: Coming soon 😄
<br />
<br />
<span>
<img src="https://i.imgur.com/6qcSRTj.jpg" height="400px" />
<img src="https://i.imgur.com/7Y9mzRd.png" height="400px" />
</span>

## Support
😇 You can support this project in a number of ways: 
 - 🗨️ Recommending new features on [GitHub](https://github.com/HarshdipD/job-tracker/issues)
 - 💻 Contributing (or improving) your amazing coding skills to solve bugs and add new features - [GitHub](https://github.com/HarshdipD/job-tracker/)
 - 💬 Sharing it to other job seekers
 - 💖 Donating to me
    - Ko-fi - <a href="https://ko-fi.com/hsdeogan" target="_blank">hsdeogan</a>
    - PayPal - <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=ZBR894KSWNJPS&currency_code=CAD" target="_blank">deogan</a>

## Want to contribute?
Thank you for your interest in making this extension even better! 😊
<br />
If you'd like to report a bug or recommend a feature, please add it [on the issues page](https://github.com/HarshdipD/job-tracker/issues).
<br />
If you'd like to add a feature or fix any existing bugs, read ahead:

### Setting it up:
🔧 Here are a few steps on how to set this extension up:
#### Chrome: 
1. Make sure you have enabled developer mode in Chrome at `chrome://extensions`
2. Clone this repo, and press 'Load unpacked' to load this extension from the extension folder
3. Go to key.js and replace the field of your own `APP_KEY`. It can found out at https://trello.com/app-key
4. Add the Chrome extension ID to Allowed origins section in the same Trello page (eg. `chrome-extension://okpdemdmpglaapjpbdphmfhlfjbilbpc`)

#### Firefox:
1. Clone this repo, go to `about:debugging#/runtime/this-firefox`, click 'Load Temporary Add-on...' and select any file from the directory.
3. Go to key.js and replace the field of your own `APP_KEY`. It can found out at https://trello.com/app-key
4. Add the mozilla add-on ID to Allowed origins section in the same Trello page (eg. `moz-extension://1db0695c-a2f0-43bc-a02d-12e23ee3d721`)

That's it! You should be able to use the extension and see your cards being saved on Trello.<br />
<b>Don't forget</b> to add the ID in app-key page, or you will recieve an `invalid_redirect` error during authorization. 

## Contributors:
1. <a href="https://github.com/jere-mie">Jeremie Bornais</a> for helping with the name and logo of the extension
2. <a href="https://github.com/JameelJiwani">Jameel Jiwani</a> for helping me with Trello oauth and common JavaScript issues!
<br />
Other contributers can be found at <a href="https://github.com/HarshdipD/job-tracker">GitHub</a>
