/**
 * Manages creation and configuration of game sprites
 * @returns {Object}
 */
function PluginSprite() {
  /**
   * Builds configuration object for use with the `canavas.drawImage` method
   * @param {SpriteConfiguration} source - configuration for selecting pixels from the
   * source image for creating the sprite
   * @param {SpriteConfiguration} sprite - configuration for the resulting sprite extracted
   * from the source image
   * @returns {Object}
   */
  function Sprite({ source, sprite }) {
    return {
      srcX: source.x,
      srcY: source.y,
      srcWidth: source.width,
      srcHeight: source.height,
      x: sprite.x,
      y: sprite.y,
      width: sprite.width,
      height: sprite.height,
      vx: sprite.vx,
      vy: sprite.vy,
    };
  }

  /**
   * Creates configuration for a bounding box for a sprite
   * @param {Number} x - x coordinate of the top corner of a rectangular region on the screen
   * @param {Number} y - y coordinate of the top corner of a rectangular region on the screen
   * @param {Number} width
   * @param {Number} height
   * @param {Number} vx - the x velocity
   * @param {Number} vy - the y velocity
   * @returns {Object}
   */
  function SpriteConfiguration({
    x = 0,
    y = 0,
    vx = 0,
    vy = 0,
    width = 64,
    height = 64,
  } = {}) {
    return {
      x,
      y,
      width,
      height,
      vx,
      vy,
    };
  }

  return {
    Sprite,
    SpriteConfiguration,
  };
}

export default function (bottle) {
  bottle.factory('Plugins.Sprite', function (/* container */) {
    return PluginSprite();
  });
}
