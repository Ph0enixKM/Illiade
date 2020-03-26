
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
            [/(<)(style)/, ['delimiter', { token: 'special', next: '@style' }]],
            [/(<)(script)/, ['delimiter', { token: 'special', next: '@script' }]],

            [/(<)(template )(lang)(=)("pug")/, ['delimiter', 'special', 'number', 'default', { token: 'string', next: '@templatePug' }]],
            [/(<)(template )(lang)(=)("jade")/, ['delimiter', 'special', 'number', 'default', { token: 'string', next: '@templatePug' }]],
            [/(<)(template)/, ['delimiter', { token: 'special', next: '@template' }]],
        ],

        style: [
            [/"([^"]*)"/, 'attribute.value'],
            [/'([^']*)'/, 'attribute.value'],
            [/[\w\-]+/, 'attribute.name'],
            [/=/, 'delimiter'],
            [/>/, { token: 'delimiter', next: '@styleEmbedded', nextEmbedded: 'text/$sass' }],
            [/[ \t\r\n]+/],
            [/(<\/)(style\s*)(>)/, ['delimiter', 'special', { token: 'delimiter', next: '@pop' }]]
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
            [/(<\/)(script\s*)(>)/, ['delimiter', 'special', { token: 'delimiter', next: '@pop' }]]
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
            [/(<\/)(template\s*)(>)/, ['delimiter', 'special', { token: 'delimiter', next: '@pop' }]]
        ],
        template: [
            [/"([^"]*)"/, 'attribute.value'],
            [/'([^']*)'/, 'attribute.value'],
            [/[\w\-]+/, 'attribute.name'],
            [/=/, 'delimiter'],
            [/>/, { token: 'delimiter', next: '@jsx' }],
            [/[ \t\r\n]+/],
            [/(<\/)(template\s*)(>)/, ['delimiter', 'special', { token: 'delimiter', next: '@pop' }]]
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

        vueDirective: [
            [/(:)([^="'\{\}\[\]]+)/, ['default', 'special']],
            [/[^:\s="']/, 'keyword'],
            [/['"]/, '@rematch', '@pop'],
        ],
  
        jsxElement: [
            [/(v\-)/, {token: 'keyword', next: '@vueDirective'}],
            [/\/>/, {token: 'delimiter', next: '@pop'}],
            [/>/, {token: 'delimiter', next: '@jsx'}],
            [/[^-<>"',:=\{\}\/]+(?=\=)/, 'number'],
            [/[,=]+/, 'delimiter'],
            [/\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
            [/"/, 'string', '@string_double'],
            [/'/, 'string', '@string_single'],
        ],

        jsxSelfClosingElement: [
            [/(v\-\S+)/, 'keyword', '@vueDirective'],
            [/>/, {token: 'delimiter', next: '@pop'}],
            [/[^-<>"',\s:=\{\}\/]+/, 'number'],
            [/[,=]+/, 'delimiter'],
            [/\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
            [/"/, 'string', '@string_double'],
            [/'/, 'string', '@string_single']
        ],
  
        jsx: [
            [/(<)(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/, ['delimiter', {token: 'identifier', next: '@jsxSelfClosingElement'}]],
            [/[^{}<>]+/, 'default'],
            [/(<)([^/<>\s]+)/, ['delimiter', { token: 'identifier', next: '@jsxElement' }]],
            [/\{/, { token: 'default', next: '@eval', nextEmbedded: 'text/$ts' }],
            [/(<\/)(template\s*)(>)/, [{token: 'delimiter'}, {token: 'special', next: '@pop'}, {token: 'delimiter', next: '@pop'}]],
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
    