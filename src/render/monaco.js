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
    monaco.languages.register({ id: 'C++' })
    monaco.languages.setMonarchTokensProvider('C++', CPP_LANGUAGE)
    
    // Register a completion item provider for the new language
    monaco.languages.registerCompletionItemProvider('C++', {
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
            { token: 'comment', foreground: '555555', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'CA00B9' },
            { token: 'number', foreground: 'FF7700' },
            { token: 'string', foreground: '7CC471' },
            { token: 'type', foreground: '30B8C3' },
            { token: 'function', foreground: '5DA3F2' },
            { token: 'identifier', foreground: 'EF575A' },
            { background : '000000'}
        ]
    })

    editor = monaco.editor.create(document.getElementById('editor'), {
        value: [
            'int main() {',
            '\treturn 0;',
            '}',
        ].join('\n'),
        language: 'C++',
        theme: 'blaze',
        contextmenu: false,
        automaticLayout: true,
        scrollbar: {
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            vertical: 'hidden',
            horizontal: 'hidden',
            verticalScrollbarSize: 15,
            horizontalScrollbarSize: 15
        }
    })

    setTimeout(() => {
        let style = $('.monaco-list style')
        style.remove()
    }, 1000)


})
