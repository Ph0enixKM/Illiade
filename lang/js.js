
const JS_CONFIG = {
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

const JS_LANGUAGE = {
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
        [/\b(class|enum|struct|namespace)(\s+)([A-Za-z0-9_$]+)/, ['keyword', 'default', 'special']],
        [/\b(new)(\s+)([A-Za-z0-9_$]+)/, ['keyword', 'default', 'special'] ],
        [/\b(this)/, 'special' ],
        [/\b(super)(\s*\()/, ['special', 'default'] ],
        [/(\.)([A-Za-z_$][0-9A-Za-z_]*)(\s*\()/, ['default', 'function', 'default']],

        // Functions
        [/([A-Za-z_$][0-9A-Za-z_]*)(\s*\()/, ['function', 'default']],
        // [/([A-Za-z][0-9A-Za-z_]*)(\s*<[^\(\s]+>\s*)(\()/, ['function', 'type', 'default']],
        
        // Keywords
        [/\b(break|case|catch|class|continue|const|constructor|debugger|default|delete|do|else|export|extends|finally|for|from|function|get|if|import|in|instanceof|let|new|return|set|switch|symbol|throw|try|typeof|var|while|with|yield|async|await|of)\b/, "keyword"],
        [/(\*|&)(?=[^&])/, 'keyword'],

        // Directives
        [/(^\s*)(#include)(\s+)(\S+)/, ['default', 'keyword', 'default', 'string']],
        [/^\s*#\S+/, 'keyword'],
        
        
        
        [/\b(null|undefined|NaN|Infinity|true|false)\b/, 'number' ],
        [/\b([A-Z_$]+[0-9A-Z_$]*)\b/, 'special' ],
        
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
        // [/([A-Za-z_$][A-Za-z0-9_$]*)(\<\S*\>)/, ['identifier', 'type']],
        [/\b[A-Za-z_$][A-Za-z0-9_$]*\b/, 'identifier'],
        
        // strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/'([^'\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
        [/`/, 'string', '@string_backtick'],
  
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
  
      string_double: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop']
      ],
      string_single: [
        [/[^\\']+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/'/, 'string', '@pop']
      ],
      string_backtick: [
        [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
        [/[^\\`$]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/`/, 'string', '@pop']
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
    },
}
  