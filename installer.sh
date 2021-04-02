###
# Global variables
###

# Link to debian package download
deb_download='https://github.com/Ph0enixKM/Illiade/releases/download/1.3.12b/illiade_1.3.12_64.deb'
# Link to zip download
zip_download='https://github.com/Ph0enixKM/Illiade/releases/download/1.3.1b/illiade-linux-1.3.1_64.zip'
# Ware name
warename=Illiade
# Version name
version=Pillar
# Path to the executable (from the root of project)
exec_path=/run_illi.sh
# Create symlinks with given names in array
symlinks=(illiade illi)
# Shall I even proceed to install debian package? (YES / NO)
use_deb=YES
# Name of your organization
org_name=phx

###
# Installer
###

# Colors of the terminal
cmddim="\e[2m"
cmdbold="\e[1m"
cmdcls="\e[0m"
cmderr="\e[31m"
cmdok="\e[32m"
os_type=''

echo
echo -e ${cmdbold}Installing your $warename '('$version')' $cmdcls
echo -e $cmddim 'Let us start!' $cmdcls
echo
echo

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
dpkg --version &> /dev/null
let deb=$(( ($? == 0) ? 1 : 0 ))

# Disable debian if desired
if [[ $use_deb == 'NO' || $1 == 'zip' ]]; then
    deb=0
fi


if [[ -f '/etc/debian_version' && deb -eq 1 ]]; then
    printf ${cmddim}${cmdok}
    echo 'It is a Debian-based OS - proceeding to the .deb installation'
    printf $cmdcls
else
    if [[ deb -eq 1 ]]; then
        printf ${cmddim}${cmdok}
        echo 'proceeding to the .deb installation'
        printf $cmdcls
    else
        printf ${cmddim}${cmdok}
        echo 'proceeding to the .zip installation'
        printf $cmdcls
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

if [[ deb -eq 0 ]]; then
    unzip -v &> /dev/null
    if [[ $? -ne '0' ]]; then
        printf $cmderr
        echo Error: install unzip
        printf $cmddim
        echo It seems that unzip tool is not installed
        echo You should be able to install it using
        echo any package manager.
        printf $cmdcls
        exit 1
    fi
fi


echo -e ${cmddim}This may take some time... meanwhile you can get some coffee${cmdcls}
echo -n 'Downloading'
spinner &

cd ~
rm $warename.deb &> /dev/null

# Downloading Script
if [[ deb -eq 1 ]]; then
    echo -n ''
    wget -O ${warename}.deb $deb_download &> /dev/null
else
    echo -n ''
    wget -O ${warename}.zip $zip_download &> /dev/null
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


if [[ deb -eq 1 ]]; then
    echo -n ''
    sudo dpkg -i ~/$warename.deb &> /dev/null
else
    cd /
    if [[ ! -d '/ware' ]]; then
        mkdir ware
    fi
    cd /ware
    if [[ ! -d "/ware/${org_name}" ]]; then
        mkdir $org_name
    fi
    rm -rf /ware/${org_name}/$warename
    cp ~/${warename}.zip /ware/${org_name}/${warename}.zip
    cd /ware/${org_name}
    unzip ${warename}.zip -d $warename
    rm -rf /ware/${org_name}/${warename}.zip
    for sym in "${symlinks[@]}"; do
        ln -s /ware/${org_name}/${warename}${exec_path} /bin/$sym
    done
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
sudo rm ~/${warename}.deb &> /dev/null
cd /ware/${org_name}/${warename}/
# If it's an Electron app - just in case
sudo chown root chrome-sandbox &> /dev/null
sudo chmod 4755 chrome-sandbox &> /dev/null

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
echo $warename is ready for action!
printf $cmddim
echo Now go ahead and try it out!
