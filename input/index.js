/**
 * Exposes event handlers for input devices to control the player tank
 * @returns {Object}
 */
function PluginInput() {
  const UP = 38;
  const DOWN = 40;
  const RIGHT = 39;
  const LEFT = 37;

  let MOVE_UP = false;
  let MOVE_DOWN = false;
  let MOVE_RIGHT = false;
  let MOVE_LEFT = false;

  const controlMap = {
    keyup: keyUp,
    keydown: keyDown,
  };

  /**
   *
   */
  function keyUp(e) {
    switch (e.keyCode) {
      case UP:
        MOVE_UP = false;
        break;
      case DOWN:
        MOVE_DOWN = false;
        break;
      case LEFT:
        MOVE_LEFT = false;
        break;
      case RIGHT:
        MOVE_RIGHT = false;
        break;
    }
  }

  /**
   * @param {Object} e
   */
  function keyDown(e) {
    switch (e.keyCode) {
      case UP:
        MOVE_UP = true;
        break;
      case DOWN:
        MOVE_DOWN = true;
        break;
      case LEFT:
        MOVE_LEFT = true;
        break;
      case RIGHT:
        MOVE_RIGHT = true;
        break;
    }
  }

  /**
   * @param {Object} event
   * @param {String} eventName
   */
  function getCurrentControlState({ event, eventName }) {
    controlMap[eventName](event);

    return {
      keys: {
        MOVE_UP,
        MOVE_DOWN,
        MOVE_RIGHT,
        MOVE_LEFT,
      },
    };
  }

  return {
    keyboardCtrl: {
      getCurrentControlState,
    },
  };
}

export default function (bottle) {
  bottle.factory('Plugins.Input', function (container) {
    return PluginInput();
  });
}
