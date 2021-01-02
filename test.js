'use strict';

var test = require('tape');
var remark = require('unified')()
  .use(require('remark-parse'))
  .use(require('remark-gfm'))
  .use(require('remark-stringify'), {
    bullet: '*',
    emphasis: '*',
    listItemIndent: '1'
  });
var u = require('unist-builder');
var strip = require('.');

function proc(value) {
  return remark().use(strip).processSync(value).toString().trimEnd();
}

test('stripMarkdown()', function (t) {
  t.deepEqual(
    remark().use(strip).runSync(u('root', [
      u('unknown', [
        u('strong', [u('text', 'value')])
      ]),
      u('anotherUnknown', 'with value')
    ])),
    u('root', [
      u('unknown', [
        u('strong', [u('text', 'value')])
      ]),
      u('anotherUnknown', 'with value')
    ]),
    'should keep unknown nodes'
  );

  t.equal(proc('Alfred'), 'Alfred', 'text');
  t.equal(proc('*Alfred*'), '*Alfred*', 'emphasis (1)');
  t.equal(proc('_Alfred_'), '*Alfred*', 'emphasis (2)');
  t.equal(proc('**Alfred**'), '**Alfred**', 'importance (1)');
  t.equal(proc('__Alfred__'), '**Alfred**', 'importance (2)');
  t.equal(proc('~~Alfred~~'), '~~Alfred~~', 'strikethrough');
  t.equal(proc('`Alfred`'), '`Alfred`', 'inline code');
  t.equal(proc('[Hello](world)'), '[Hello](world)', 'link');
  t.equal(proc('[**H**ello](world)'), '[**H**ello](world)', 'importance in link');
  t.equal(proc('[Hello][id]\n\n[id]: http://example.com "optional title"'), '[Hello][id]\n\n[id]: http://example.com "optional title"', 'reference-style link');
  t.equal(proc('Hello.\n\nWorld.'), 'Hello.\n\nWorld.', 'paragraph');
  t.equal(proc('## Alfred'), '## Alfred', 'headings (atx)');
  t.equal(proc('Alfred\n====='), '# Alfred', 'headings (setext)');

  t.equal(
    proc('- Hello\n  * World\n    + !'),
    '* Hello\n  * World\n    * !',
    'list item'
  );

  t.equal(
    proc('- Hello\n\n- World\n\n- !'),
    '* Hello\n\n* World\n\n* !',
    'list'
  );

  t.equal(
    proc('- Hello\n- \n- World!'),
    '* Hello\n*\n* World!',
    'empty list item'
  );

  t.equal(
    proc('> Hello\n> World\n> !'),
    '> Hello\n> World\n> !',
    'blockquote'
  );

  t.equal(proc('![An image](image.png "test")'), '![An image](image.png "test")', 'image (1)');
  t.equal(proc('![](image.png "test")'), '![](image.png "test")', 'image (2)');
  t.equal(proc('![](image.png)'), '![](image.png)', 'image (3)');
  t.equal(proc('![An image][id]\n\n[id]: http://example.com/a.jpg'), '![An image][id]\n\n[id]: http://example.com/a.jpg', 'reference-style image');

  t.equal(proc('---'), '***', 'thematic break');
  t.equal(proc('A  \nB'), 'A\\\nB', 'hard line break');
  t.equal(proc('A\nB'), 'A\nB', 'soft line break');
  t.equal(proc('| A | B |\n| - | - |\n| C | D |'), '| A | B |\n| - | - |\n| C | D |', 'table');
  t.equal(proc('    alert("hello");'), '    alert("hello");', 'code (1)');
  t.equal(proc('```js\nconsole.log("world");\n```'), '```js\nconsole.log("world");\n```', 'code (2)');
  t.equal(proc('<sup>Hello</sup>'), 'Hello', 'html (1)');
  t.equal(proc('<sup>Hello <strong>strong</strong></sup>'), 'Hello strong', 'html (2)');
  t.equal(proc('<pre>Hello</pre>'), 'Hello', 'html (3)');
  t.equal(proc('<script>alert("world");</script>'), 'alert("world");', 'html (4)');
  t.equal(proc('[<img src="http://example.com/a.jpg" />](http://example.com)'), '[](http://example.com)', 'html (5)');

  t.end();
});
