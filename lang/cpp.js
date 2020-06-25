
const CPP_CONFIG = {
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

const CPP_LANGUAGE = {
    // Set defaultToken to invalid to see what you do not tokenize yet
    // defaultToken: 'invalid',

    keywords: [
      'abstract', 'continue', 'for', 'new', 'switch', 'goto', 'do',
      'if', 'private', 'this', 'break', 'protected', 'throw', 'else', 'public',
      'enum', 'return', 'catch', 'try', 'static', 'class',
      'finally', 'virtual', 'const', 'while', 'true', 'false', 'loop'
    ],

    operators: [
      '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
      '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
      '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
      '%=', '<<=', '>>=', '>>>='
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
        [/\b(typedef)(\s+)(struct)(\s+)([A-Za-z0-9_$]+)/, ['keyword', 'default', 'keyword', 'default', 'special']],
        [/\b(enum)(\s+)(class)(\s+)([A-Za-z0-9_$]+)/, ['keyword', 'default', 'keyword', 'default', 'special']],
        [/\b(class|struct|union|enum|namespace)(\s+)([A-Za-z0-9_$]+)/, ['keyword', 'default', 'special']],
        [/this/, 'special'],

        // Keywords
        [/\b(friend|virtual|operator|long|template|typename|using|typedef|namespace|abstract|continue|for|new|switch|goto|do|if|private|this|break|protected|throw|else|public|enum|return|catch|try|static|class|finally|virtual|const|while|loop|loopWith|loopFromTo|export)\b/, "keyword"],
        [/(\*|&)(?=[^&])/, 'keyword'],

        // Directives
        [/(^\s*)(#include)(\s+)(\S+)/, ['default', 'keyword', 'default', 'string']],
        [/(^\s*)(#pragma)(\s+)(once)/, ['default', 'keyword', 'default', 'number']],
        [/^\s*#\S+/, 'keyword'],

        // [/\s([A-Z_$][0-9A-Za-z_$]*)\b/, 'special' ],
        [/([A-Za-z_][0-9A-Za-z_<>]*)([:]+)(\s*operator)(\s+)(?=[A-Za-z_])/, ['special', 'default', 'keyword', 'default']],
        [/([A-Za-z_][0-9A-Za-z_:<>]*)(\s*operator)(\s+)(?=[A-Za-z_])/, ['type', 'keyword', 'default']],

        // Types
        [/([A-Za-z_$][A-Za-z0-9_:<>$]*)(\<\S*\>)(?=\s*[A-Za-z_0-9$]+\s*[=;,])/, ['type', 'type']],
        [/([A-Za-z_][0-9A-Za-z_:<>]*)(\s+)(?=[A-Za-z_$])/, ['type', 'default']],
        [/([A-Za-z_][0-9A-Za-z_:<>]*)(\s+)(?=[*&][^\s])/, ['type', 'default']],
        [/([A-Za-z_][0-9A-Za-z_:<>]*)([*&]+)(\s+)(?=[A-Za-z_$])/, ['type', 'keyword', 'default']],

        // Functions
        [/([A-Za-z_$][0-9A-Za-z_]*)(\s*\()/, ['function', 'default']],
        // [/([A-Za-z][0-9A-Za-z_]*)(\s*<[^\(\s]+>\s*)(\()/, ['function', 'type', 'default']],

        [/\b(NULL|nullptr)\b/, 'number' ],
        [/\b([A-Z_$]+[0-9A-Za-z_$]*)\b/, 'special' ],
        [/\$[0-9a-zA-Z\$_]*\b/, 'special'],

        // whitespace
        { include: '@whitespace' },

        // delimiters and operators
        [/@symbols/, { cases: { '@operators': 'operator',
        '@default'  : 'default' } } ],

        // numbers
        [/\b\d*\.\d+([eE][\-+]?\d+)?\b/, 'number.float'],
        [/\b0[xX][0-9a-fA-F]+\b/, 'number.hex'],
        [/\b\d+\b/, 'number'],

        // booleans
        [/\b(true|false|on|off)\b/, 'number'],

        // delimiter: after number because of .\d floats
        [/[;,.:]/, 'delimiter'],

        // identifiers
        [/([A-Za-z_$][A-Za-z0-9_$]*)(\<\S*\>)(\()/, ['function', 'type', 'default']],
        [/([A-Za-z_$][A-Za-z0-9_$]*)(\<\S*\>)/, ['identifier', 'type']],
        [/([A-Z_$][A-Za-z0-9_$]*)(\<\S*\>)/, ['special', 'type']],
        [/\b[A-Za-z_$][A-Za-z0-9_$]*\b/, 'identifier'],

        // strings
        [/"/,  { token: 'string.quote', bracket: '@open', next: '@string' } ],

        // characters
        [/'[^\\']'/, 'string'],
        [/(')(@escapes)(')/, ['string','string.escape','string']],
        [/'/, 'string.invalid']
      ],

      comment: [
        [/[^\/*]+/, 'comment' ],
        [/\/\*/,    'comment', '@push' ],    // nested comment
        ["\\*/",    'comment', '@pop'  ],
        [/[\/*]/,   'comment' ]
      ],

      string: [
        [/[^\\"]+/,  'string'],
        [/@escapes/, 'string.escape'],
        [/\\./,      'string.escape.invalid'],
        [/"/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
      ],

      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\*/,       'comment', '@comment' ],
        [/\/\/.*$/,    'comment'],
      ],
    },
}
