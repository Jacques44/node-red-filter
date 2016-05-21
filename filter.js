module.exports = function(RED) {
    function filterMsg(config) {
      RED.nodes.createNode(this, config);
      this.property = config.property;
      this.filter = config.filter;
      this.ignorecase = config.ignorecase;
      
      var node = this;
      var options = (node.ignorecase)?"i":"";
      var rx = null;
      try {
        rx  = new RegExp(node.filter, options);
      }
      catch (exception) {
        node.error(exception);
      }

      // Source: http://stackoverflow.com/questions/6906108/in-javascript-how-can-i-dynamically-get-a-nested-property-of-an-object
      function getPropByString(obj, propString) {
          if (!propString)
              return obj;

          var prop, props = propString.split('.');

          for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
              prop = props[i];

              var candidate = obj[prop];
              if (candidate !== undefined) {
                  obj = candidate;
              } else {
                  break;
              }
          }
          return obj[props[i]];
      }      
      
      this.on('input', function(msg) {
        // If no rx, bypass
        if (rx == null || rx.test(getPropByString(msg, node.property)))
          node.send([msg]);
        else node.send([ null, msg ]);
      });
    }
    RED.nodes.registerType("filter", filterMsg);
}