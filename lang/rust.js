
const RUST_CONFIG = {
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

const RUST_LANGUAGE = {
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
        [/\b(impl|struct|enum)(\s+)([A-Za-z0-9_$]+)/, ['keyword', 'default', 'special']],
        [/self/, 'special'],
        [/super/, 'special'],

        // Keywords
        [/\b(as|break|const|continue|crate|else|enum|extern|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|static|struct|trait|type|unsafe|use|where|while|async|await|dyn|abstract|become|box|do|final|macro|override|priv|typeof|unsized|virtual|yield|try|union)\b/, "keyword"],
        [/(\*|&)(?=[^&])/, 'keyword'],

        // Directives
        [/(^\s*)(#include)(\s+)(\S+)/, ['default', 'keyword', 'default', 'string']],
        [/(^\s*)(#pragma)(\s+)(once)/, ['default', 'keyword', 'default', 'number']],
        [/^\s*#\S+/, 'comment'],

        // Types
        [/\b(bool|u8|u16|u32|u64|u128|i8|i16|i32|i64|i128|char|str|f32|f64|usize|isize)\b/, "type"],

        // Functions
        [/([A-Za-z_$][0-9A-Za-z_!]*)(\s*\()/, ['function', 'default']],
        // [/([A-Za-z][0-9A-Za-z_]*)(\s*<[^\(\s]+>\s*)(\()/, ['function', 'type', 'default']],

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
        [/\b(true|false)\b/, 'number'],

        // delimiter: after number because of .\d floats
        [/[;,.:]/, 'delimiter'],

        // identifiers
        [/[A-Za-z_$][0-9A-Za-z_]*\!/, 'function'],
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
