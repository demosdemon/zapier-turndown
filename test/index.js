const Promise = require('bluebird');
const should = require('should');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const zapier = require('zapier-platform-core');
const parse = require('emailjs-mime-parser').default;
const { TextDecoder } = require('text-encoding');

// Use this to make test calls into your app:
const App = require('../index');
const appTester = zapier.createAppTester(App);
const transform = require('../transform');

const isHtml = node => node && node.contentType && node.contentType.value === 'text/html';

const loadTestMessage = function(filename = 'original_msg.txt') {
  const loc = path.join(__dirname, filename);
  return Promise.resolve(loc)
    .then(fs.readFileAsync)
    .then(data => data.toString())
    .then(data => parse(data).childNodes)
    .spread((first, second) => {
      if (isHtml(first)) return first;
      if (isHtml(second)) return second;
      throw new Error('Unable to find html message!');
    })
    .tap(node => should.notStrictEqual(node.charset, 'binary'))
    .then(node => new TextDecoder(node.charset).decode(node.content));
};

describe('My App', () => {
  let email = undefined;

  before(() => loadTestMessage().then(msg => email = msg));

  it('should have an email body', done => {
    should.exist(email);
    done();
  });

  it('should transform the email body', done => {
    const value = transform(email).trim();
    console.log(value);
    should.exist(value);
    done();
  });
});
