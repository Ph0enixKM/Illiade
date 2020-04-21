# This Script installs you a new Illiade version

# Global variables
debian_download=https://github.com/Ph0enixKM/Illiade/releases/download/1.3.0b/illiade_1.3.0_64.deb

cmddim="\e[2m"
cmdbold="\e[1m"
cmdcls="\e[0m"
cmderr="\e[31m"
cmdok="\e[32m"
os_type=''

echo
echo -e $cmdbold 'Installing your Illiade (Pillar)' $cmdcls
echo -e $cmddim 'Let us start!' $cmdcls
echo
echo

supported_distros=()

# Ask for password
sudo echo ''

# Spinning animation
function spinner {
    local i sp n
    sp='/-\|'
    n=${#sp}
    printf ' '
    while sleep 0.1; do
        printf "%s\b" "${sp:i++%n:1}"
    done
}

release_file=`cat /etc/os-release`
distro=`eval $release_file '; echo $ID'`
supports=`echo ${supported_distros[*]} | grep -c $distro`

if [[ -f '/etc/debian_version' ]]; then
    printf ${cmddim}${cmdok}
    echo 'It is a Debian-based OS - proceeding to the .deb instalation'
    printf $cmdcls
    os_type=debian
else
    if [[ supports -eq '1' ]]; then
        printf ${cmddim}${cmdok}
        echo Your distribution $distro is supported
        printf $cmdcls
        os_type=$distro
    else
        printf $cmderr
        echo Your distribution $distro is sadly not supported
        printf $cmddim
        echo Try to download and install Illiade manually
        echo We are sorry for this issue
        echo You can create an issue on GitHub so that we may add support
        printf $cmdcls
        exit 1
    fi
fi


# Install dependencies
wget --version &> /dev/null
if [[ $? -ne '0' ]]; then
    printf $cmderr
    echo Error: install wget
    printf $cmddim
    echo It seems that wget tool is not installed
    echo You should be able to install it using
    echo any package manager.
    printf $cmdcls
    exit 1
fi


echo -e ${cmddim}This may take some time... meanwhile you can get some coffee${cmdcls}
echo -n 'Downloading'
spinner &

cd ~
rm illiade.deb &> /dev/null

# Downloading Script
if [[ os_type -eq "debian" ]]; then
    echo -n ''
    wget -O illiade.deb $debian_download &> /dev/null
fi

sleep 0.5

# Kill spinner
kill "$!" &> /dev/null

# Download Done
printf $cmdok
printf "%s\b" "✔"
printf $cmdcls
echo

echo -n 'Installing'
spinner &

# Installing Script


if [[ os_type -eq "debian" ]]; then
    echo -n ''
    sudo dpkg -i ~/illiade.deb &> /dev/null
fi

# -- TMP --
sleep 0.5

# Kill spinner
kill "$!" &> /dev/null

# Installation Done
printf $cmdok
printf "%s\b" "✔"
printf $cmdcls
echo

echo -n 'Cleaning Up'
spinner &

# Cleaning Up Script
echo -n ''
sudo rm ~/illiade.deb &> /dev/null
cd /opt/Illiade/
sudo chown root chrome-sandbox
sudo chmod 4755 chrome-sandbox

# -- TMP --
sleep 0.5

# Kill spinner
kill "$!" &> /dev/null

# Installation Done
printf $cmdok
printf "%s\b" "✔"
printf $cmdcls
echo
echo

printf $cmdok
echo Illiade is ready for action!
printf $cmddim
echo Now go ahead and try it out!