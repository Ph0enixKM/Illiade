<div align="center">
    <img src="https://raw.githubusercontent.com/Ph0enixKM/Illiade/master/logo/logo.png" width="200">
</div>

# Illiade

> Current stable version: Illiade Pillar

The official Phoenix Arts IDE.
Download newest release [here](https://github.com/Ph0enixKM/Illiade/releases/latest)
Once installed you can run the executable
or if you have **Ubuntu | Debian | Lava** operating system
you can easily run it with `illiade` or shortname `illi`

## Installation (Linux)

Illiade can be easily installed on linux via this command:

```bash
curl -s https://raw.githubusercontent.com/Ph0enixKM/Illiade/master/linux.sh | bash
```

And that's it. The terminal will install Illiade for you!

<br>
<div align="center">
    <img src="logo/little-screenshot.jpg">
</div>
<br>

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
6. (Windows) Install build tools in CMD run as Administrator `npm install --global --production windows-build-tools`
7. Install electron-rebuild npm package globally `npm i electron-rebuild -g`

##### Recipe

1. Go to the path where Illiade is installed
   - Windows: go to the downloaded directory containing `Illiade.exe` file
   - MacOS: go to the directory containing named `Illiade.app/Contents`
2. Go to the app directory by running `cd resources/app/`
3. Run the following command: `npm run rebuild-pty`
4. Done 🎉

## Troubleshooting

**Installer can't install Illiade with dpkg**
_Solution would be to run this "zip" version of installer:_

```bash
curl -s https://raw.githubusercontent.com/Ph0enixKM/Illiade/master/linux.sh zip | bash
```

## Upcomming changes

_🤞 - In progress | 👍 - Done and ready_

- Make comments darker in the default theme \[👍]
- Add bash / shell icon for BashScripts \[👍]
- Refactor code for better maintaining \[👍]
- Windows - File Open error fix \[👍]
- Create File and Create Directory \[👍]
- Ambient sound behavior improvements \[👍]
- Open File Directory \[👍]
- Suggestion Bar Style updated \[👍]
- Renaming files automatically changes the opened file \[👍]
- Terminal moving with keyboard \[👍]
- Illiade user guide \[🤞]
- Restrict left panel to some size range \[👍]
- Save left panel size \[👍]
- Left panel animation \[👍]
- VueJS syntax integration \[👍]
- React syntax integration \[👍]
- Restrict terminal moving \[👍]
