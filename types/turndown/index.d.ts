// Type definitions for turndown 4.0
// Project: https://github.com/domchristie/turndown#readme
// Definitions by: Brandon LeBlanc <https://github.com/demosdemon>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export type Filter = (node: HTMLElement, options: TurndownOptions) => boolean;
export type FilterType = string | string[] | Filter;
export type Replacement = (content: string, node: HTMLElement, options: TurndownOptions) => string;
export type Plugin = (turndown: TurndownService) => void;
export type RulesMap = { [id: string]: TurndownRule };

export interface TurndownOptions {
  rules: RulesMap;
  headingStyle: 'setext' | 'atx';
  hr: '* * *' | '- - -' | '_ _ _';
  bulletListMarker: '*' | '+' | '-';
  codeBlockStyle: 'indented' | 'fenced';
  fence: '```' | '~~~';
  emDelimiter: '_' | '*';
  strongDelimiter: '**' | '__';
  linkStyle: 'inlined' | 'referenced';
  linkReferenceStyle: 'full' | 'collapsed' | 'shortcut';
  br: string;
  blankReplacement: Replacement;
  keepReplacement: Replacement;
  defaultReplacement: Replacement;
}

export interface TurndownRule {
  filter: FilterType;
  replacement: Replacement;
  append?: (options: TurndownOptions) => string;
}

export default class TurndownService {
  constructor(option?: Partial<TurndownOptions>);

  addRule(key: string, rule: TurndownRule): this;

  escape(string: string): string;

  keep(filter: FilterType): this;

  remove(filter: FilterType): this;

  turndown(input: string | HTMLElement): string;

  use(plugin: Plugin | Plugin[]): this;
}
