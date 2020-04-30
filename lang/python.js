const PY_CONFIG = {
    comments: {
        lineComment: '#',
        blockComment: ['\'\'\'', '\'\'\''],
    },
    brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')']
    ],
    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"', notIn: ['string'] },
        { open: '\'', close: '\'', notIn: ['string', 'comment'] },
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: '\'', close: '\'' },
    ],
    folding: {
        offSide: true,
        markers: {
            start: new RegExp("^\\s*#region\\b"),
            end: new RegExp("^\\s*#endregion\\b")
        }
    }
}
const PY_LANGUAGE = {
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    defaultToken: '',
    tokenPostfix: '.python',
    keywords: [
        'and',
        'as',
        'assert',
        'break',
        'continue',
        'def',
        'del',
        'elif',
        'else',
        'except',
        'exec',
        'finally',
        'for',
        'from',
        'global',
        'if',
        'import',
        'in',
        'is',
        'lambda',
        'None',
        'not',
        'or',
        'pass',
        'raise',
        'return',
        'self',
        'try',
        'while',
        'with',
        'yield',
        'int',
        'float',
        'long',
        'complex',
        'hex',
        'abs',
        'all',
        'any',
        'apply',
        'basestring',
        'bin',
        'bool',
        'buffer',
        'bytearray',
        'callable',
        'chr',
        'classmethod',
        'cmp',
        'coerce',
        'compile',
        'complex',
        'delattr',
        'dict',
        'dir',
        'divmod',
        'enumerate',
        'eval',
        'execfile',
        'frozenset',
        'getattr',
        'globals',
        'hasattr',
        'hash',
        'help',
        'id',
        'intern',
        'isinstance',
        'issubclass',
        'iter',
        'len',
        'locals',
        'list',
        'map',
        'max',
        'memoryview',
        'min',
        'next',
        'object',
        'oct',
        'open',
        'ord',
        'pow',
        'property',
        'reversed',
        'reduce',
        'reload',
        'repr',
        'reversed',
        'round',
        'set',
        'setattr',
        'sorted',
        'staticmethod',
        'str',
        'sum',
        'super',
        'tuple',
        'type',
        'unichr',
        'unicode',
        'vars',
        'xrange',
        'zip',
        'async',
        'await'
    ],
    brackets: [
        { open: '{', close: '}', token: 'delimiter.curly' },
        { open: '[', close: ']', token: 'delimiter.bracket' },
        { open: '(', close: ')', token: 'delimiter.parenthesis' }
    ],
    tokenizer: {
        root: [
            [/(^\s*)(class)(\s*)([A-Za-z0-9_\-$]+)/, ['default', 'keyword', 'default', 'special']],
            [/([a-z0-9_\-$][A-Za-z0-9_\-$]*)(?=\()/, 'function'],
            [/\b(self)\b/, 'special'],
            [/\b(True|False|None)\b/, 'number' ],
            [/^(\s*''')/, 'comment', '@endDocStringCom'],
            [/^(\s*""")/, 'comment', '@endDocStringCom'],
            { include: '@whitespace' },
            { include: '@numbers' },
            { include: '@strings' },
            [/[.,:;]/, 'delimiter'],
            [/[{}\[\]()]/, '@brackets'],
            [/\$[0-9a-zA-Z\$_]*\b/, 'special'],
            [/\b([A-Z_$]+[0-9A-Za-z_$]*)\b/, 'special' ],
            [/@[a-zA-Z]\w*/, 'tag'],
            [/[a-zA-Z]\w*/, {
                cases: {
                    '@keywords': 'keyword',
                    '@default': 'identifier'
                }
            }],
        ],
        // Deal with white space, including single and multi-line comments
        whitespace: [
            [/\s+/, 'white'],
            [/(^#.*$)/, 'comment'],
            [/'''/, 'string', '@endDocString'],
            [/"""/, 'string', '@endDblDocString']
        ],
        endDocString: [
            [/[^']+/, 'string'],
            [/\\'/, 'string'],
            [/'''/, 'string', '@popall'],
            [/'/, 'string']
        ],
        endDblDocString: [
            [/[^"]+/, 'string'],
            [/\\"/, 'string'],
            [/"""/, 'string', '@popall'],
            [/"/, 'string']
        ],
        endDocStringCom: [
            [/[^']+/, 'comment'],
            [/\\'/, 'comment'],
            [/'''/, 'comment', '@popall'],
            [/'/, 'comment']
        ],
        endDblDocStringCom: [
            [/[^"]+/, 'comment'],
            [/\\"/, 'comment'],
            [/"""/, 'comment', '@popall'],
            [/"/, 'comment']
        ],
        // Recognize hex, negatives, decimals, imaginaries, longs, and scientific notation
        numbers: [
            [/-?(\d[\d\_]+)/, 'number'],
            [/-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, 'number.hex'],
            [/-?(\d*\.)?\d+([eE][+\-]?\d+)?[jJ]?[lL]?/, 'number'],
        ],
        // Recognize strings, including those broken across lines with \ (but not without)
        strings: [
            [/'$/, 'string.escape', '@popall'],
            [/'/, 'string.escape', '@stringBody'],
            [/"$/, 'string.escape', '@popall'],
            [/"/, 'string.escape', '@dblStringBody']
        ],
        stringBody: [
            [/[^\\']+$/, 'string', '@popall'],
            [/[^\\']+/, 'string'],
            [/@escapes/, 'type'],
            [/\\./, 'string'],
            [/'/, 'string.escape', '@popall'],
            [/\\$/, 'string']
        ],
        dblStringBody: [
            [/[^\\"]+$/, 'string', '@popall'],
            [/[^\\"]+/, 'string'],
            [/\\./, 'string'],
            [/"/, 'string.escape', '@popall'],
            [/\\$/, 'string']
        ]
    }
}
