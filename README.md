<div align="center">
    <img src="https://raw.githubusercontent.com/Ph0enixKM/Illiade/master/logo/logo.png" width="200">
</div>

# Illiade
The official Phoenix Arts IDE.
Download newest release [here](https://github.com/Ph0enixKM/Illiade/releases/latest)
Once installed you can run the executable
or if you have **Ubuntu | Debian | Lava** operating system
you can easily run it with `illiade` or shortname `illie`

## CLI
- Open current directory `illie .`
- Open current directory as a separate process `illie . &`
- Open custom directory `illie ./my-cool-project`
- Open custom file `illie /home/user/file.md`

## Troubleshooting
### Terminal is not working
> Related to node-pty error

##### Prerequisities:
1. Install Node Package Manager
    - Linux: `sudo apt install npm`
    - Windows: download nodejs installer and run it from [this website](https://nodejs.org/)
2. Install electron-rebuild npm package globally `npm i electron-rebuild -g`
3. (Windows) install build tools in CMD run as Administrator `npm install --global --production windows-build-tools`

##### Recipe
1. Go to the path where Illiade is installed
    - Linux: `cd /opt/Illiade/`
    - Windows: (go to the downloaded directory containing `Illiade.exe` file)
2. Go to the app directory by running `cd resources/app/`
3. Run the following command: `npm run rebuild-pty`
4. Done 🎉

## Upcomming changes
_🤞 - In progress | 👍 - Done and ready_
- Hide terminal when *"Alt-tabbing"* \[👍]
- Fix common terminal issues \[🤞]
- Fix bug with resizing and zooming in terminal \[👍]
- Add new tab in terminal \[🤞]
- Add animation on file drop \[🤞]
- Edit saving terminal position based on *%* not on *px* \[👍]
- Terminal update position *(in %)* when window resized \[👍]
- Terminal update terminal path when project *ROOT* changed \[🤞]
