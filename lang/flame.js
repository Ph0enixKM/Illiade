
const FLAME_CONFIG = {
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

const FLAME_LANGUAGE = {
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
    regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
    regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

    // The main tokenizer for our languages
    tokenizer: {
      root: [
        // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
        // [/\/(?=([^\\\/\*]|\\.)+\/([gimsuy]*)(\s*)(\.|;|\/|,|\)|\]|\}|$))/, { token: 'regexp', bracket: '@open', next: '@regexp' }],


        // Structure declarations
        [/\b(idea|tree)(\s+)([A-Za-z0-9_$]+)/, ['keyword', 'default', 'special']],
        [/\b(real)(\s+)([A-Za-z0-9_$]+)/, ['keyword', 'default', 'special'] ],
        [/\b(this)/, 'special' ],
        [/\b(super)(\s*\()/, ['special', 'default'] ],
        [/(\.)([A-Za-z_$][0-9A-Za-z_]*)(\s*\()/, ['default', 'function', 'default']],

        // Keywords
        [/\b(ref|break|setup|with|continue|const|default|loop|do|else|export|extends|finally|to|from|fun|if|import|let|real|return|fail|failed|throw|try|typeof|var|while|async|await|of)\b/, "keyword"],
        [/(\*|&)(?=[^&])/, 'keyword'],

        // Directives
        [/(^\s*)(#include)(\s+)(\S+)/, ['default', 'keyword', 'default', 'string']],
        [/^\s*#\S+/, 'keyword'],


        // Functions
        // [/([A-Za-z][0-9A-Za-z_]*)(\s*<[^\(\s]+>\s*)(\()/, ['function', 'type', 'default']],
        [/([A-Za-z_$][0-9A-Za-z_]*)(\s*\()/, ['function', 'default']],
        [/([A-Za-z_$][0-9A-Za-z_]*)(\s*[=:]\s*)(function)(\s*\()/, ['function', 'default', 'keyword', 'default']],
        [/\b([A-Z_$]+[0-9A-Za-z_$]*)\b/, 'special' ],

        // whitespace
        { include: '@whitespace' },
    	[/\$[0-9a-zA-Z\$_]*\b/, 'special'],

        // delimiters and operators
        [/@symbols/, { cases: { '@operators': 'operator',
        '@default'  : 'default' } } ],

        // numbers
        [/\b\d*\.\d+([eE][\-+]?\d+)?\b/, 'number.float'],
        [/\b0[xX][0-9a-fA-F]+\b/, 'number.hex'],
        [/\b\d+\b/, 'number'],

        // switches
        [/\b(on|off|none)\b/, 'number'],

        // delimiter: after number because of .\d floats
        [/[;,.:]/, 'delimiter'],

        // identifiers
        // [/([A-Za-z_$][A-Za-z0-9_$]*)(\<\S*\>)/, ['identifier', 'type']],
        [/\b[A-Za-z_$][A-Za-z0-9_$]*\b/, 'identifier'],

        // strings
        [/'([^'\\]|\\.)*$/, 'string.invalid'],
        [/'/, 'string', '@string'],

        // characters
        [/'[^\\']'/, 'string'],
        [/(')(@escapes)(')/, ['string','type','string']],
        [/'/, 'string.invalid']
      ],

      comment: [
        [/[^\/*]+/, 'comment' ],
        [/\/\*/,    'comment', '@push' ],    // nested comment
        ["\\*/",    'comment', '@pop'  ],
        [/[\/*]/,   'comment' ]
      ],

      // We match regular expression quite precisely
      regexp: [
        [/(\{)(\d+(?:,\d*)?)(\})/, ['regexp.escape.control', 'regexp.escape.control', 'regexp.escape.control']],
        [/(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/, ['regexp.escape.control', { token: 'regexp.escape.control', next: '@regexrange' }]],
        [/(\()(\?:|\?=|\?!)/, ['regexp.escape.control', 'regexp.escape.control']],
        [/[()]/, 'regexp.escape.control'],
        [/@regexpctl/, 'regexp.escape.control'],
        [/[^\\\/]/, 'regexp'],
        [/@regexpesc/, 'regexp.escape'],
        [/\\\./, 'regexp.invalid'],
        [/(\/)([gimsuy]*)/, [{ token: 'regexp', bracket: '@close', next: '@pop' }, 'keyword.other']],
      ],
      regexrange: [
          [/-/, 'regexp.escape.control'],
          [/\^/, 'regexp.invalid'],
          [/@regexpesc/, 'regexp.escape'],
          [/[^\]]/, 'regexp'],
          [/\]/, { token: 'regexp.escape.control', next: '@pop', bracket: '@close' }]
      ],

      string: [
        [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
        [/[^\\'$]+/, 'string'],
        [/@escapes/, 'type'],
        [/\\./, 'string.escape.invalid'],
        [/'/, 'string', '@pop']
      ],
      bracketCounting: [
        [/\{/, 'delimiter.bracket', '@bracketCounting'],
        [/\}/, 'delimiter.bracket', '@pop'],
        { include: 'root' }
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


    }
}
