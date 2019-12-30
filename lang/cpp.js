
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
        // Keywords
        [/\b(abstract|continue|for|new|switch|goto|do|if|private|this|break|protected|throw|else|public|enum|return|catch|try|static|class|finally|virtual|const|while|loop)\b/, "keyword"],
  
        // Directives
        [/(#include)(\s+)(\S+)/, ['keyword', 'default', 'string']],
        [/#\S+/, 'keyword'],

        // Types
        [/([A-Za-z_][0-9A-Za-z_]*)(\s+)(?=[A-Za-z_])/, ['type', 'default']],
        [/([A-Za-z_][0-9A-Za-z_]*)(\s+)(?=[*&][^\s])/, ['type', 'default']],
  
        // Functions
        [/([A-Za-z][0-9A-Za-z_]*)(\()/, ['function', 'default']],
        [/([A-Za-z][0-9A-Za-z_]*)(<[^\(\s]+>)(\()/, ['function', 'type', 'default']],
        
        [/\b(NULL|nullptr)\b/, 'number' ],  // to show class names nicely
        [/\b([0-9A-Z_]+)\b/, 'number' ],
  
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
        [/[;,.]/, 'delimiter'],
        [/\b[A-Za-z_$]+\b/, 'identifier'],
  
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
  };
  