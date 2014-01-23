/**
 * This is a HOF that is used by our React components to build onChange handlers
 * for a given key path into the model.
 */
module.exports = updatePath

function updatePath (path, value) {
  path = toPath(path)
  var curr = this
  var last = path.length - 1
  for (var i = 0; i < last; i++) {
    var k = path[i]
    if (!curr[k]) {
      if (typeof path[i + 1] === 'number') {
        curr = curr[k] = []
      } else {
        curr = curr[k] = {}
      }
    } else {
      curr = curr[k]
    }
  }
  curr[path[last]] = value
}

updatePath.bind = function (o, path, value) {
  if (typeof o !== 'object') {
    throw new TypeError('setPath must be bound to an object')
  }
  var updatePath = this
  if (path && value)
    return function () { updatePath.call(o, path, value) }
  else if (path)
    return function (value) { updatePath.call(o, path, value) }

  var fn = function (path, value) { updatePath.call(o, path, value) }
  fn.setter = updatePath.setter
  fn.prefix = updatePath.prefix
  return fn
}

updatePath.setter = function (path) {
  var updatePath = this
  return function (value) {
    updatePath.call(this, path, value)
  }
}

updatePath.prefix = function (prefix) {
  var updatePath = this
  prefix = toPath(prefix)
  prefixedUpdatePath.setter = function (path) {
    path = prefix.concat(toPath(path))
    return function (value) {
      updatePath.call(this, path, value)
    }
  }

  return prefixedUpdatePath

  function prefixedUpdatePath (path, value) {
    updatePath.call(this, prefix.concat(toPath(path)), value)
  }
}

function toPath (it) {
  return (typeof it === 'string') ? it.split('.') : it
}
