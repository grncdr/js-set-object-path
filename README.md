# set-object-path

Functions for setting values deep insde nested objects.

I use this for generating callbacks that can modify data in a restricted scope
of a larger object.

## Synopsis

```javascript
var test = require('tape')
var setPath = require('./')

test('use .call to pass root object', function (t) {
  var o = {}
  setPath.call(o, 'a.b.c', 2)
  t.deepEqual(o, {a: {b: {c: 2}}})
  t.end()
})

test('use array-paths instead of dot-separated strings', function (t) {
  var o = {}
  setPath.call(o, ['people', 'Mr. Jones'], "is back")
  t.deepEqual(o, {
    people: {
      'Mr. Jones': 'is back'
    }
  })
  t.end()
})

test('use .setter to pass path implicitly', function (t) {
  var setName = setPath.setter('name')
  var my = {}
  setName.call(my, 'Stephen')
  t.equal(my.name, 'Stephen')
  t.end()
})

test('use .bind to pass root implicitly', function (t) {
  var my = {}
  var set = setPath.bind(my)
  set('name', 'Stephen')
  t.equal(my.name, 'Stephen')
  t.end()
})

test('chain .bind and .setter for awesomeness', function (t) {
  var my = {}
  var setMyName = setPath.setter('name').bind(my)
  setMyName('Stephen')
  t.equal(my.name, 'Stephen')
  
  // or do it the other way around
  setPath.bind(my).setter('name')('Still Stephen')
  t.equal(my.name, 'Still Stephen')
  t.end()
})

test('use .prefix to limit the scope of allowed changes', function (t) {
  var model = {}
  var setApples = setPath.prefix('apples').bind(model)
  var setOranges = setPath.prefix('oranges').bind(model)
  setApples('count', 1)
  setOranges('count', 2)
  t.deepEqual(model, {
    apples: { count: 1 },
    oranges: { count: 2 },
  })
  t.end()
})

test('chain .bind, .prefix, .setter', function (t) {
  var model = {}
  var setAppleCount = setPath.bind(model).prefix('apples').setter('count')
  var setOrangeCount = setPath.bind(model).prefix('oranges').setter('count')

  setAppleCount(3)
  setOrangeCount(4)
  t.deepEqual(model, {
    apples: { count: 3 },
    oranges: { count: 4 },
  })
  t.end()
})
```

## Install

    npm install set-object-path

## License

MIT
