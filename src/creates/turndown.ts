import TurndownService from 'turndown';
import {RulesMap, TurndownOptions} from 'turndown';
import {highlightedCodeBlock, strikethrough, taskListItems} from 'turndown-plugin-gfm';
import {Bundle, zObject} from 'zapier-platform-core';
import {has} from '../utils';

const rules: RulesMap = {
  ignoreHeadElements: {
    filter: ['meta', 'title', 'style', 'script'],
    replacement() {
      return '';
    },
  },
};

const newTurndownService = (options: Partial<TurndownOptions>) => Object.keys(rules)
    .reduce(
      (svc, key) => svc.addRule(key, rules[key]),
      new TurndownService(options).use([
        strikethrough,
        taskListItems,
        highlightedCodeBlock,
      ])
    );

const optionKeys: (keyof TurndownOptions)[] = [
  'headingStyle',
  'hr',
  'bulletListMarker',
  'fence',
  'emDelimiter',
  'strongDelimiter',
  'linkStyle',
  'linkReferenceStyle',
];

const createTurndown = (_z: zObject, bundle: Bundle) => {
  const opts: Partial<TurndownOptions> = {};

  optionKeys.filter(key => has(bundle.inputData, key))
    .forEach(key => (opts[key] = bundle.inputData[key]));

  const svc = newTurndownService(opts);

  return {
    markdown: svc.turndown(bundle.inputData.inputText),
  };
};

export default {
  key: 'turndown',
  noun: 'Turndown',

  display: {
    label: 'Convert HTML to Markdown',
    description: 'Converts an HTML string to a Markdown string.',
  },

  operation: {
    inputFields: [
      {
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
      },
    ],
    perform: createTurndown,

    sample: {
      markdown: '# Hello World\n\n',
    },

    outputFields: [
      {
        key: 'markdown',
        type: 'string',
      },
    ],
  },
};
