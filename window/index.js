/**
 * A wrapper plugin for the the browser `window` APIs
 * @returns {Object}
 */
function PluginWindow() {
  return {
    WINDOW: window,
  };
}

export default function (bottle) {
  bottle.factory('Plugins.Window', function (container) {
    return PluginWindow();
  });
}
