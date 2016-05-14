# ScreenshotAutomator
Automatically take screenshots of a webpage/URL once when it changes. The purpose is to have a timeline of how a project changes, and later merge these screenshtos into an animated gif or movie to visualize change over time.

Uses node-webshot (https://github.com/brenden/node-webshot) for screenshots, and currently only checks if the filesize of the screenshot has changed.
Might use resembles.js or similar to acutally compare the screenshots, havn't decided yet.

## Install

```
$ git clone https://github.com/Hurreman/ScreenshotAutomator.git ScreenshotAutomator
$ cd ScreenshotAutomator
$ npm install
```

*Phantomjs is used, and node-webshot seem to install the binary if it cannot find an already installed Phantomjs in the path*

## Usage

The script accepts four command-line arguments: url, prefix (optional, for screenshot naming. Defaults to "screenshot"), interval (optional, time between screenshots. Defaults to 10) and path (optional, where to save the screenshots. Defaults to "./Screenshots").

#### Take a screenshot of google.com every 10 seconds (default)
```
$ node main.js google.com
```

#### Take a screenshot of google.com once every hour and save the screenshots to the "./Screens" folder, with the "Google" prefix:
```
$ node main.js google.com Google 3600 ./Screens
```