const path = require('path')
const fs = require('fs')
const amdLoader = require('../../node_modules/monaco-editor/min/vs/loader.js')
const parseTmTheme = require('monaco-themes').parseTmTheme
const amdRequire = amdLoader.require
const amdDefine = amdLoader.require.define

function uriFromPath (_path) {
    pathName = path.resolve(_path).replace(/\\/g, '/')
    if (pathName.length > 0 && pathName.charAt(0) !== '/')
        pathName = '/' + pathName
    return encodeURI('file://' + pathName)
}

amdRequire.config({
    baseUrl: uriFromPath(path.join(__dirname, '../../node_modules/monaco-editor/min'))
})



// workaround monaco-css not understanding the environment
self.module = undefined



amdRequire(['vs/editor/editor.main'], () => {

    // Config Theme
    monaco.editor.defineTheme('blaze', {
        base: 'vs-dark', // can also be vs-dark or hc-black
        inherit: true, // can also be false to completely replace the builtin rules
        rules: [
            { token: 'comment.cpp', foreground: '555555', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'cc4400' },
            { token: 'number', foreground: 'ff8800' },
            { token: 'string', foreground: '44aa00' },
            { background : '000000'}
        ]
    })

    editor = monaco.editor.create(document.getElementById('editor'), {
        value: [
            'int main() {',
            '\treturn 0;',
            '}',
        ].join('\n'),
        language: 'cpp',
        theme: "blaze",
        contextmenu: false,
        automaticLayout: true
    })

    setTimeout(() => {
        let style = $('.monaco-list style')
        style.remove()
    }, 1000)

})
