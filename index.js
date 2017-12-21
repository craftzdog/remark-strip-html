module.exports = strip;

function strip() {
  return one;
}

/* Expose modifiers for available node types.
 * Node types not listed here are not changed
 * (but their children are). */
var map = {};

map.html = empty;

/* One node. */
function one(node) {
  var type = node && node.type;

  if (type in map) {
    node = map[type](node);
  }

  if ('length' in node) {
    node = all(node);
  }

  if (node.children) {
    node.children = all(node.children);
  }

  return node;
}

/* Multiple nodes. */
function all(nodes) {
  var index = -1;
  var length = nodes.length;
  var result = [];
  var value;

  while (++index < length) {
    value = one(nodes[index]);

    if (value && typeof value.length === 'number') {
      result = result.concat(value.map(one));
    } else {
      result.push(value);
    }
  }

  return clean(result);
}

/* Clean nodes: merges text's. */
function clean(values) {
  var index = -1;
  var length = values.length;
  var result = [];
  var prev = null;
  var value;

  while (++index < length) {
    value = values[index];

    if (prev && 'value' in value && value.type === prev.type) {
      prev.value += value.value;
    } else {
      result.push(value);
      prev = value;
    }
  }

  return result;
}

/* Return nothing. */
function empty(token) {
  const value = token.value.replace(/<(?:.|\n)*?>/gm, '');
  return {type: 'text', value: value};
}
