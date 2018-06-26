const has = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

const TurndownService = require('turndown');

const {
  strikethrough,
  taskListItems,
  highlightedCodeBlock
} = require('turndown-plugin-gfm');

const rules = {
  ignoreHeadElements: {
    filter: ['meta', 'title', 'style', 'script'],
    replacement() {
      return '';
    },
  },
};

const newTurndownService = options => {
  const svc = new TurndownService(options);

  svc.use([strikethrough, taskListItems, highlightedCodeBlock]);

  Object.keys(rules).forEach(key => svc.addRule(key, rules[key]));

  return svc;
};

const optionKeys = [
  'headingStyle', 'hr', 'bulletListMarker', 'fence', 'emDelimiter',
  'strongDelimiter', 'linkStyle', 'linkReferenceStyle',
];

const createTurndown = (_z, bundle) => {
  const opts = {};

  optionKeys
    .filter(key => has(bundle.inputData, key))
    .forEach(key => opts[key] = bundle.inputData[key]);

  const svc = newTurndownService(opts);

  return {
    markdown: svc.turndown(bundle.inputData.inputText)
  };
};

module.exports = {
  key: 'turndown',
  noun: 'Turndown',

  display: {
    label: 'Convert HTML to Markdown',
    description: 'Converts an HTML string to a Markdown string.'
  },

  operation: {
    inputFields: [{
        key: 'inputText',
        label: 'Input Text',
        required: true,
      },
      {
        key: 'headingStyle',
        label: 'Heading Style',
        choices: ['setext', 'atx'],
        default: 'setext',
      },
      {
        key: 'hr',
        label: 'Horizontal Rule',
        choices: ['* * *', '- - -', '_ _ _'],
        default: '* * *',
      },
      {
        key: 'bulletListMarker',
        label: 'Bullet List Marker',
        choices: ['*', '-', '+'],
        default: '*',
      },
      {
        key: 'codeBlockStyle',
        label: 'Code Block Style',
        choices: ['indented', 'fenced'],
        default: 'indented',
      },
      {
        key: 'fence',
        label: 'Code Fence Style',
        choices: ['```', '~~~'],
        default: '```',
      },
      {
        key: 'emDelimiter',
        label: 'Emphasis Delimiter',
        choices: ['_', '*'],
        default: '_',
      },
      {
        key: 'strongDelimiter',
        label: 'Strong Delimiter',
        choices: ['**', '__'],
        default: '**',
      },
      {
        key: 'linkStyle',
        label: 'Link Style',
        choices: ['referenced', 'inlined'],
        default: 'referenced',
      },
      {
        key: 'linkReferenceStyle',
        label: 'Link Reference Style',
        choices: ['full', 'collapsed', 'shortcut'],
        default: 'full',
      }
    ],
    perform: createTurndown,

    sample: {
      markdown: '# Hello World\n\n',
    },

    outputFields: [
      { key: 'markdown', type: 'string' },
    ]
  }
};
