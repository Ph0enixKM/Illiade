#/bin/bash

# Global variables
cmddim="\e[2m"
cmdbold="\e[1m"
cmdcls="\e[0m"
cmderr="\e[31m"
cmdok="\e[32m"

echo
echo -e $cmdbold 'Attempting to package Illaide for you' $cmdcls
echo -e $cmddim 'Let us start!' $cmdcls
echo
echo

rm -rf illiade-db/

# Run build for any distro: <distro_name> <npm_script_name> <platform>
function package {
    echo -e 'Running '$1' Packager 📦 ' $cmddim

    npm run $2 &> /dev/null

    printf $cmdcls
    if [[ $? == 0 ]]; then
        echo -e $cmdok '- Packaging done 👌' $cmdcls
        cp run_illi.sh dist-app/Illiade-${3}-x64/run_illi.sh
    else
        echo -e $cmderr '- Could not package... ' $cmdcls
    fi
    echo
}

package "Linux 🐧" package linux
package "Windows 🖼️ " package-win win32
package "Mac 🍎" package-mac darwin
