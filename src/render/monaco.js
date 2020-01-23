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
    
    // Register a new language
    monaco.languages.register({ id: '$cpp' })
    monaco.languages.setMonarchTokensProvider('$cpp', CPP_LANGUAGE)
    
    // Register a completion item provider for the new language
    monaco.languages.registerCompletionItemProvider('$cpp', {
        provideCompletionItems: () => {
            let suggestions = [{
                label: 'string',
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: 'string'
            }, {
                label: 'cout',
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'cout << ${1:condition} << \'\\n\';$0',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            }, {
                label: 'ifelse',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: [
                    'if (${1:condition}) {',
                    '\t$0',
                    '} else {',
                    '\t',
                    '}'
                ].join('\n'),
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            }];
            return { suggestions: suggestions };
        },
    })
    

    // Config Theme
    monaco.editor.defineTheme('blaze', {
        base: 'vs-dark', // can also be vs-dark or hc-black
        inherit: true, // can also be false to completely replace the builtin rules
        rules: [
            { token: 'comment', foreground: '888888', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'C526B8' },
            { token: 'number', foreground: 'FF7700' },
            { token: 'string', foreground: '7CC471' },
            { token: 'type', foreground: '30B8C3' },
            { token: 'function', foreground: '5DA3F2' },
            { token: 'identifier', foreground: 'ec5a5d' },
            { token: 'delimiter', foreground: '888888' },
            { token: 'special', foreground: 'E09C4F' },
            { background : '2a2522'}
        ]
    })

    window.editor = monaco.editor.create(document.getElementById('editor'), {
        value: '',
        language: '$cpp',
        theme: 'blaze',
        contextmenu: false,
        // automaticLayout: true,
        scrollbar: {
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            vertical: 'visible',
            horizontal: 'hidden',
            verticalScrollbarSize: 15,
            horizontalScrollbarSize: 15
        }
    })

    setTimeout(() => {
        let style = $('.monaco-list style')
        style.remove()
        EDITOR_LOAD.val = true
    }, 1000)


})
