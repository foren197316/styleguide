# InterExchange Styleguide

### How to build the styleguide

```bash
$ sudo gem install hologram # may need to resource to make sure hologram is in path
$ brew install npm
$ npm install -g gulp
$ npm install -g bower
$ npm install
$ bower install
```

### How to watch and compile files as you go

```bash
$ gulp serve
```

https://localhost:3000

You still have to save twice before the page reloads. I can't figure out how to fix this. If you have an idea, you're most welcome to share it!

### How to publish to GH Pages

```bash
$ gulp deploy
```

### TODO

AWS Publish https://www.npmjs.org/package/gulp-awspublish

### Test

```
npm test
```
