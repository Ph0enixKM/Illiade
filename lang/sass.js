
const SASS_CONFIG = {
  comments: {
    blockComment: ['/*', '*/'],
  },
  autoClosingPairs: [
    { open: '(', close: ')' },
    { open: '\'', close: '\'', notIn: ['string', 'comment'] },
    { open: '"', close: '"', notIn: ['string'] },
  ],
  surroundingPairs: [
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: '\'', close: '\'' },
  ],
  folding: {
      offSide: true
  }
}

const SASS_LANGUAGE = {
    // Set defaultToken to invalid to see what you do not tokenize yet
    // defaultToken: 'invalid',
  
    brackets: [
      { open: '{', close: '}', token: 'delimiter.curly' },
      { open: '[', close: ']', token: 'delimiter.bracket' },
      { open: '(', close: ')', token: 'delimiter.parenthesis' }
    ],
  
    // Escapes
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  
    // The main tokenizer for our languages
    tokenizer: {
      root: [
        ['[@](page|content|font-face|-moz-document|import)', { token: 'keyword' }],
        ['([@])(keyframes|-webkit-keyframes|-moz-keyframes|-o-keyframes)(\\s*)(\\S+)', ['keyword', 'keyword', 'default', 'special']],
        [/\!important/, 'keyword'],
                
        // Keywords
        [/(\*|&)(?=[^&])/, 'keyword'],
        
        // Directives
        [/:\S+/, 'type'],
        [/#[A-Za-z0-9\$\-]+/, 'function'],
        [/\.[A-Za-z0-9\$\-]+/, 'number'],
        
        
        // Functions
        [/([A-Za-z_$\-][0-9A-Za-z_\-]*)(\s*\()/, ['function', 'default']],
        
        // whitespace
        { include: '@whitespace' },
        
        // Color
        [/#[0-9a-fA-F]+\b/, 'special'],
        
        // numbers
        [/\b\d*\.\d+([eE][\-+]?\d+)?\b/, 'number.float'],
        [/\b0[xX][0-9a-fA-F]+\b/, 'number.hex'],
        [/\b\d+\b/, 'number'],
        [/\b(\d+)(em|ex|ch|rem|vmin|vmax|vw|vh|vm|cm|mm|in|px|pt|pc|deg|grad|rad|turn|s|ms|Hz|kHz|[%])\b/, ['number', 'keyword']],
        
        // Key - Val
        [/\b([A-Za-z0-9_\$\-]+)(\s*:\s*)([^#\d\(]+$)/, ['default', 'default', 'identifier']],
        
        // delimiter: after number because of .\d floats
        [/[;,.:]/, 'delimiter'],
        
        // identifiers
        [/^\s*[A-Za-z_$][A-Za-z0-9_$]*\b/, 'identifier'],
        
        // strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/'([^'\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
  
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
  
      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\*/,       'comment', '@comment' ],
        [/\/\/.*$/,    'comment'],
      ],
    },
}
  