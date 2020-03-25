
const VUE_CONFIG = {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/'],
    },
    brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')']
    ],
    autoClosingPairs: [
        { open: '[', close: ']' },
        { open: '{', close: '}' },
        { open: '(', close: ')' },
        { open: '\'', close: '\'', notIn: ['string', 'comment'] },
        { open: '"', close: '"', notIn: ['string'] },
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: '\'', close: '\'' },
    ],
    folding: {
        offSide: true
    }
  }
  
  const VUE_LANGUAGE = {
      // Set defaultToken to invalid to see what you do not tokenize yet
      // defaultToken: 'invalid',
    
      keywords: [
        'break', 'case', 'catch', 'class', 'continue', 'const',
        'constructor', 'debugger', 'default', 'delete', 'do', 'else',
        'export', 'extends', 'finally', 'for', 'from', 'function',
        'get', 'if', 'import', 'in', 'instanceof', 'let', 'new',
        'return', 'set', 'switch', 'symbol', 'throw',
        'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
        'async', 'await', 'of'
      ],
    
      operators: [
        '<=', '>=', '==', '!=', '===', '!==', '=>', '+', '-', '**',
        '*', '/', '%', '++', '--', '<<', '</', '>>', '>>>', '&',
        '|', '^', '!', '~', '&&', '||', '?', ':', '=', '+=', '-=',
        '*=', '**=', '/=', '%=', '<<=', '>>=', '>>>=', '&=', '|=',
        '^=', '@',
      ],
      
      brackets: [
        { open: '{', close: '}', token: 'delimiter.curly' },
        { open: '[', close: ']', token: 'delimiter.bracket' },
        { open: '(', close: ')', token: 'delimiter.parenthesis' }
      ],
    
      // Common expressions
      symbols:  /[=><!~?:&|+\-*\/\^%]+/,
    
      // Escapes
      escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    
      // The main tokenizer for our languages
      tokenizer: {
        root: [

            

          // Structure declarations
        //   [/\b(class|enum|struct|namespace)(\s+)([A-Za-z0-9_$]+)/, ['keyword', 'default', 'special']],
        //   [/\b(new)(\s+)([A-Za-z0-9_$]+)/, ['keyword', 'default', 'special'] ],
        //   [/\b(this)/, 'special' ],
        //   [/\b(super)(\s*\()/, ['special', 'default'] ],
        //   [/(\.)([A-Za-z_$][0-9A-Za-z_]*)(\s*\()/, ['default', 'function', 'default']],
          
        //   // Functions get and set shall not be highlighted
        //   [/(get|set)(\s*\()/, ['function', 'default']],
        //   [/(get|set)(\s*[=:]\s*function\s*\()/, ['function', 'default']],
          
        //   // Keywords
        //   [/\b(break|case|catch|class|continue|const|constructor|debugger|default|delete|do|else|export|extends|finally|for|from|function|get|if|import|in|instanceof|let|new|return|set|switch|symbol|throw|try|typeof|var|while|with|yield|async|await|of)\b/, "keyword"],
        //   [/(\*|&)(?=[^&])/, 'keyword'],
  
        //   // JSX
        //   [/(\s*<)([^/<>\s]+)/, ['default', { token: 'identifier', next: '@jsxElement' }]],
        //   // [/>[^<>{}]*\{/, 'default'],
        //   // [/\}[^<>{}]*\</, 'default'],
  
        //   // Directives
        //   [/(^\s*)(#include)(\s+)(\S+)/, ['default', 'keyword', 'default', 'string']],
        //   [/^\s*#\S+/, 'keyword'],
          
          
        //   // Functions
        //   // [/([A-Za-z][0-9A-Za-z_]*)(\s*<[^\(\s]+>\s*)(\()/, ['function', 'type', 'default']],
        //   [/([A-Za-z_$][0-9A-Za-z_]*)(\s*\()/, ['function', 'default']],
        //   [/([A-Za-z_$][0-9A-Za-z_]*)(\s*[=:]\s*function\s*\()/, ['function', 'default']],
          
        //   [/\b(null|undefined|NaN|Infinity|true|false)\b/, 'number' ],
        //   [/\b([A-Z_$]+[0-9A-Z_$]*)\b/, 'special' ],
          
        //   // whitespace
        //   { include: '@whitespace' },
          
        //   // delimiters and operators
        //   [/@symbols/, { cases: { '@operators': 'operator',
        //   '@default'  : 'default' } } ],
          
        //   // numbers
        //   [/\b\d*\.\d+([eE][\-+]?\d+)?\b/, 'number.float'],
        //   [/\b0[xX][0-9a-fA-F]+\b/, 'number.hex'],
        //   [/\b\d+\b/, 'number'],
          
        //   // booleans
        //   [/\b(true|false)\b/, 'number'],
          
        //   // delimiter: after number because of .\d floats
        //   [/[;,.:]/, 'delimiter'],
          
        //   // identifiers
        //   // [/([A-Za-z_$][A-Za-z0-9_$]*)(\<\S*\>)/, ['identifier', 'type']],
        //   [/\b[A-Za-z_$][A-Za-z0-9_$]*\b/, 'identifier'],
          
        //   // strings
        //   [/"([^"\\]|\\.)*$/, 'string.invalid'],
        //   [/'([^'\\]|\\.)*$/, 'string.invalid'],
        //   [/"/, 'string', '@string_double'],
        //   [/'/, 'string', '@string_single'],
        //   [/`/, 'string', '@string_backtick'],
    
        //   // characters
        //   [/'[^\\']'/, 'string'],
        //   [/(')(@escapes)(')/, ['string','type','string']],
        //   [/'/, 'string.invalid']
            // [/(<)(template)(>)/, ['default', 'identifier', {token: 'default', next: '@template', nextEmbedded: 'text/css'}]]
            [/(<)(style)/, ['delimiter', { token: 'tag', next: '@style' }]],
            [/(<)(script)/, ['delimiter', { token: 'tag', next: '@script' }]],

            [/(<)(template )(lang)(=)("pug")/, ['delimiter', 'tag', 'number', 'default', { token: 'string', next: '@templatePug' }]],
            [/(<)(template )(lang)(=)("jade")/, ['delimiter', 'tag', 'number', 'default', { token: 'string', next: '@templatePug' }]],
            [/(<)(template)/, ['delimiter', { token: 'tag', next: '@template' }]],
        ],

        // template: [
        //     [/(<\/)(template)(>)/, ['default', 'identifier', {token: 'rematch', next: '@pop', nextEmbedded: '@pop'}]],
        //     [/[^<]+/, '']
        // ],



        style: [
            [/"([^"]*)"/, 'attribute.value'],
            [/'([^']*)'/, 'attribute.value'],
            [/[\w\-]+/, 'attribute.name'],
            [/=/, 'delimiter'],
            [/>/, { token: 'delimiter', next: '@styleEmbedded', nextEmbedded: 'text/$sass' }],
            [/[ \t\r\n]+/],
            [/(<\/)(style\s*)(>)/, ['delimiter', 'tag', { token: 'delimiter', next: '@pop' }]]
        ],
        // After <style ... type
        styleAfterType: [
            [/=/, 'delimiter', '@styleAfterTypeEquals'],
            [/>/, { token: 'delimiter', next: '@styleEmbedded', nextEmbedded: 'text/$sass' }],
            [/[ \t\r\n]+/],
            [/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
        ],
        // After <style ... type =
        styleAfterTypeEquals: [
            [/"([^"]*)"/, { token: 'attribute.value', switchTo: '@styleWithCustomType.$1' }],
            [/'([^']*)'/, { token: 'attribute.value', switchTo: '@styleWithCustomType.$1' }],
            [/>/, { token: 'delimiter', next: '@styleEmbedded', nextEmbedded: 'text/$sass' }],
            [/[ \t\r\n]+/],
            [/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
        ],
        // After <style ... type = $S2
        styleWithCustomType: [
            [/>/, { token: 'delimiter', next: '@styleEmbedded.$S2', nextEmbedded: '$S2' }],
            [/"([^"]*)"/, 'attribute.value'],
            [/'([^']*)'/, 'attribute.value'],
            [/[\w\-]+/, 'attribute.name'],
            [/=/, 'delimiter'],
            [/[ \t\r\n]+/],
            [/<\/style\s*>/, { token: '@rematch', next: '@pop' }]
        ],
        styleEmbedded: [
            [/<\/style/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
            [/[^<]+/, '']
        ],


        script: [
            [/"([^"]*)"/, 'attribute.value'],
            [/'([^']*)'/, 'attribute.value'],
            [/[\w\-]+/, 'attribute.name'],
            [/=/, 'delimiter'],
            [/>/, { token: 'delimiter', next: '@scriptEmbedded', nextEmbedded: 'text/$ts' }],
            [/[ \t\r\n]+/],
            [/(<\/)(script\s*)(>)/, ['delimiter', 'tag', { token: 'delimiter', next: '@pop' }]]
        ],
        scriptEmbedded: [
            [/<\/script/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
            [/[^<]+/, '']
        ],

        templatePug: [
            [/"([^"]*)"/, 'attribute.value'],
            [/'([^']*)'/, 'attribute.value'],
            [/[\w\-]+/, 'attribute.name'],
            [/=/, 'delimiter'],
            [/>/, { token: 'delimiter', next: '@templateEmbedded', nextEmbedded: 'text/$pug' }],
            [/[ \t\r\n]+/],
            [/(<\/)(template\s*)(>)/, ['delimiter', 'tag', { token: 'delimiter', next: '@pop' }]]
        ],
        template: [
            [/"([^"]*)"/, 'attribute.value'],
            [/'([^']*)'/, 'attribute.value'],
            [/[\w\-]+/, 'attribute.name'],
            [/=/, 'delimiter'],
            [/>/, { token: 'delimiter', next: '@jsx' }],
            [/[ \t\r\n]+/],
            [/(<\/)(template\s*)(>)/, ['delimiter', 'tag', { token: 'delimiter', next: '@pop' }]]
        ],
        templateEmbedded: [
            [/<\/template/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
        ],
        // templateScript: [
        //     [/\{\{/, { token: 'delimiter', next: '@templateScriptEmbedded', nextEmbedded: 'text/$ts' }],
        //     [/[ \t\r\n]+/],
        //     [/(\}\})/, { token: 'delimiter', next: '@pop' }],
        // ],
        // templateScriptEmbedded: [
        //     [/\}\}/, {token: 'delimiter', next: '@pop', nextEmbedded: '@pop'}],
        //     [/[^\}]+/, ''],
        // ],


    
        comment: [
          [/[^\/*]+/, 'comment' ],
          [/\/\*/,    'comment', '@push' ],    // nested comment
          ["\\*/",    'comment', '@pop'  ],
          [/[\/*]/,   'comment' ]
        ],
  
        jsxElement: [
            [/\/>/, {token: 'delimiter', next: '@pop'}],
            [/>/, {token: 'delimiter', next: '@jsx'}],
            [/[^<>"',=\{\}\/]+/, 'number'],
            [/[,=]+/, 'delimiter'],
            [/\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
            [/"/, 'string', '@string_double'],
            [/'/, 'string', '@string_single']
        ],
  
        jsx: [
            [/[^{}<>]+/, 'default'],
            [/(<)([^/<>\s]+)/, ['delimiter', { token: 'identifier', next: '@jsxElement' }]],
            [/\{/, { token: 'default', next: '@eval', nextEmbedded: 'text/$ts' }],
            [/(<\/)([^<>]+)(>)/, [{token: 'delimiter'}, {token: 'identifier', next: '@pop'}, {token: 'delimiter', next: '@pop'}]]
        ],

        eval: [
            [/\}\}/, {token: '@rematch', next: '@pop', nextEmbedded: '@pop'}],

        ],
        bracketCounting: [
            [/\{/, 'delimiter.bracket', '@bracketCounting'],
            [/\}/, 'delimiter.bracket', '@pop'],
            // { include: 'root' }
        ],
    
        string_double: [
          [/[^\\"]+/, 'string'],
          [/@escapes/, 'type'],
          [/\\./, 'string.escape.invalid'],
          [/"/, 'string', '@pop']
        ],
        string_single: [
          [/[^\\']+/, 'string'],
          [/@escapes/, 'type'],
          [/\\./, 'string.escape.invalid'],
          [/'/, 'string', '@pop']
        ],
        string_backtick: [
          [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
          [/[^\\`$]+/, 'string'],
          [/@escapes/, 'type'],
          [/\\./, 'string.escape.invalid'],
          [/`/, 'string', '@pop']
        ],
        
        typeBracket: [
          [/\</, { token: 'type', next: '@typeCounting' }],
          [/[^>]+/, 'type'],
          [/\>/, 'type', '@pop']
        ],
        
        typeCounting: [
          [/\</, 'type', '@typeCounting'],
          [/\>/, 'type', '@pop'],
        ],
    
        whitespace: [
          [/[ \t\r\n]+/, 'white'],
          [/\/\*/,       'comment', '@comment' ],
          [/\/\/.*$/,    'comment'],
        ],
  
        
      },
  }
    