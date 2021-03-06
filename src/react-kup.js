// Generated by CoffeeScript 1.7.1
var __slice = [].slice;

(function() {
  var ReactKupPrototype, isAttrs, isReactComponent, newReactKup, tagName, tagNames, _fn, _i, _len;
  tagNames = "a abbr address area article aside audio b base bdi bdo big blockquote body br\nbutton canvas caption cite code col colgroup data datalist dd del details dfn\ndiv dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6\nhead header hr html i iframe img input ins kbd keygen label legend li link main\nmap mark menu menuitem meta meter nav noscript object ol optgroup option output\np param pre progress q rp rt ruby s samp script section select small source\nspan strong style sub summary sup table tbody td textarea tfoot th thead time\ntitle tr track u ul var video wbr circle g line path polyline rect svg".split(/\s+/);
  isReactComponent = function(object) {
    var prototype;
    if (!object || !object.type || !object.type.prototype) {
      return false;
    }
    prototype = object.type.prototype;
    return ('function' === typeof prototype.mountComponentIntoNode) && ('function' === typeof prototype.receiveComponent);
  };
  isAttrs = function(value) {
    return 'object' === typeof value && !isReactComponent(value) && !Array.isArray(value);
  };
  ReactKupPrototype = {
    text: function(text) {
      return this.push(text);
    },
    push: function(child) {
      return this.childrenStack[this.childrenStack.length - 1].push(child);
    },
    children: function(content) {
      var children;
      if (isReactComponent(content)) {
        return [content];
      } else if (typeof content === 'function') {
        this.childrenStack.push([]);
        content();
        children = this.childrenStack.pop();
        return children;
      } else if (Array.isArray(content)) {
        return [].concat(content.map(this.children.bind(this)));
      } else if (content != null) {
        return [content];
      } else {
        return [];
      }
    },
    component: function(tagNameOrConstructor, attrsOrContent, optionalContent) {
      var attrs, children, component, content;
      attrs = isAttrs(attrsOrContent) ? attrsOrContent : {};
      content = optionalContent != null ? optionalContent : !isAttrs(attrsOrContent) ? attrsOrContent : void 0;
      children = this.children(content);
      component = (function() {
        var _ref;
        switch (typeof tagNameOrConstructor) {
          case 'string':
            return (_ref = this.react.DOM)[tagNameOrConstructor].apply(_ref, [attrs].concat(__slice.call(children)));
          case 'function':
            return (function(func, args, ctor) {
              ctor.prototype = func.prototype;
              var child = new ctor, result = func.apply(child, args);
              return Object(result) === result ? result : child;
            })(tagNameOrConstructor, [attrs].concat(__slice.call(children)), function(){});
          default:
            throw new Error('first argument to component must be a string or function');
        }
      }).call(this);
      return this.push(component);
    }
  };
  _fn = function(tagName) {
    return ReactKupPrototype[tagName] = function(attrs, content) {
      return this.component(tagName, attrs, content);
    };
  };
  for (_i = 0, _len = tagNames.length; _i < _len; _i++) {
    tagName = tagNames[_i];
    _fn(tagName);
  }
  newReactKup = function(react) {
    return function(cb) {
      var childrenStackTop, k;
      k = Object.create(ReactKupPrototype);
      k.react = react;
      k.childrenStack = [];
      k.childrenStack.push([]);
      if (cb != null) {
        cb(k);
        childrenStackTop = k.childrenStack[k.childrenStack.length - 1];
        return childrenStackTop[0];
      } else {
        return k;
      }
    };
  };
  if (typeof window !== "undefined" && window !== null) {
    return window.newReactKup = newReactKup;
  } else if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    return module.exports = newReactKup;
  } else {
    throw new Error('either the `window` global or the `module.exports` global must be defined');
  }
})();
