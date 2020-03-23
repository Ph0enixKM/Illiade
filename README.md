<div align="center">
    <img src="https://raw.githubusercontent.com/Ph0enixKM/Illiade/master/logo/logo.png" width="200">
</div>

# Illiade
> Current stable version: Illiade Risen

The official Phoenix Arts IDE.
Download newest release [here](https://github.com/Ph0enixKM/Illiade/releases/latest)
Once installed you can run the executable
or if you have **Ubuntu | Debian | Lava** operating system
you can easily run it with `illiade` or shortname `illie`

## Installation (Linux)
Illiade can be easily installed on linux via this command:
```bash
curl -s https://raw.githubusercontent.com/Ph0enixKM/Illiade/master/linux.sh | bash
```

## CLI
- Open current directory `illie .`
- Open current directory as a separate process `illie . &`
- Open custom directory `illie ./my-cool-project`
- Open custom file `illie /home/user/file.md`

## Compiling (MacOS/Windows)
It is adviced to use Linux operating system for development on Illiade IDE.
If you want to get Illiade working on MacOS then below I have written what must be done after finished downloading.

##### Prerequisities:
1. (MacOS) Install Homebrew using the command: `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
2. (MacOS) Install XCode which you can find in the [App Store](https://apps.apple.com/us/app/xcode/id497799835?mt=12)
3. Install Node Package Manager (and Node.js)
    - MacOS: `brew install node`
    - Windows: download nodejs installer and run it from [this website](https://nodejs.org/)
4. (MacOS) Install Python if you don't have one `brew install python3`
5. (MacOS) Install XCode Command Line Tools `xcode-select --install`
4. (Windows) Install build tools in CMD run as Administrator `npm install --global --production windows-build-tools`
5. Install electron-rebuild npm package globally `npm i electron-rebuild -g`

##### Recipe
1. Go to the path where Illiade is installed
    - Windows: go to the downloaded directory containing `Illiade.exe` file
    - MacOS: go to the directory containing named `Illiade.app/Contents`
2. Go to the app directory by running `cd resources/app/`
3. Run the following command: `npm run rebuild-pty`
4. Done 🎉

## Upcomming changes
_🤞 - In progress | 👍 - Done and ready_
- Hide terminal when *"Alt-tabbing"* \[👍]
- Fix common terminal issues \[👍]
- Fix bug with resizing and zooming in terminal \[👍]
- Add new tab in terminal \[👍]
- Add animation on file drop \[👍]
- Edit saving terminal position based on *%* not on *px* \[👍]
- Terminal update position *(in %)* when window resized \[👍]
- Terminal update terminal path when project *ROOT* changed \[👍]
- Terminal change dimensions with (ALT + Arrow instead CTRL + Arrow) \[👍]
