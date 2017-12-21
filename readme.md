# remark-strip-html

Remove HTML formatting from Markdown with [**remark**][remark].

## Installation

[npm][]:

```bash
npm install remark-strip-html
```

## Usage

```javascript
var remark = require('remark');
var strip = require('remark-strip-html');

remark()
  .use(strip)
  .process('<pre>Hello</pre>', function (err, file) {
    if (err) throw err;
    console.log(String(file));
  });
```

Yields:

```text
Hello
```

## API

### `remark().use(strip)`

Modifies **remark** to expose Markdown with HTML formatting removed.

*   Removes HTML tags

## License

[MIT][license] © [Takuya Matsuyama][author]

<!-- Definitions -->

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: https://www.craftz.dog/

[remark]: https://github.com/wooorm/remark
