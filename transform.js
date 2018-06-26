const TurndownService = require('turndown');

const {
  strikethrough,
  tables,
  taskListItems,
  gfm,
  highlightedCodeBlock
} = require('turndown-plugin-gfm');

module.exports = transform;

const rules = {
  ignoreHeadElements: {
    filter: ['meta', 'title', 'style', 'script'],
    replacement() {
      return '';
    },
  },
};

function newTurndownService(opts) {
  const options = {
    // headingStyle: 'setext',
    // hr: '* * *',
    // bulletListMarker: '*',
    // codeBlockStyle: 'indented',
    // fence: '```',
    // emDelimiter: '_',
    // strongDelimiter: '**',
    linkStyle: 'referenced', // override default of 'inlined'
    // linkReferenceStyle: 'full',
    // br: '  ',

  };

  if (opts)
    Object.assign(options, opts);

  const svc = new TurndownService(options);

  svc.use(highlightedCodeBlock);
  svc.use(strikethrough);
  svc.use(taskListItems);
  // svc.use(tables);

  Object.keys(rules)
    .forEach(key => svc.addRule(key, rules[key]));

  return svc;
}

function transform(input) {
  const svc = newTurndownService();

  return svc.turndown(input);
}
