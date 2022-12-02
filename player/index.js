/**
 * @param {Object} config - an instance of the `PluginConfig` interface
 * @param {Object} canvas - an instance of the `PluginCanvas` interface
 * @returns {Object}
 */
function PluginPlayer({ config, canvas }) {
  const { CanvasCoordinateConfiguration } = canvas;
  const ANIMATION_FRAMES = [1, 2, 3, 4, 5, 6, 7, 8];
  let frameIndex = 0;
  let context = null;
  let myTileMap = null;
  let myPlayerTank = null;
  let currentRenderStrategy = DefaultRenderStrategy();

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLImageElement} tileMap
   * @param {Object} sourceTile
   * @param {SpriteConfiguration} sprite
   * @returns {Function}
   */
  function DefaultRenderStrategy() {
    return function ({ ctx, sourceTile, sprite, tileMap }) {
      const source = CanvasCoordinateConfiguration({
        x: sourceTile.x,
        y: sourceTile.y,
        width: 32,
        height: 32,
      });

      const dest = CanvasCoordinateConfiguration({
        x: sprite.x,
        y: sprite.y,
        width: 32,
        height: 32,
      });

      ctx.drawImage(tileMap, ...[...source, ...dest]);
      ctx.restore();
    };
  }

  /**
   * @param {Number} rotation
   * @returns {Function}
   */
  function RotateRenderStrategy(rotation) {
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLImageElement} tileMap
     * @param {Object} sourceTile
     * @param {SpriteConfiguration} sprite
     */
    return function ({ ctx, sourceTile, sprite, tileMap }) {
      const { x: srcX, y: srcY } = sourceTile;
      const source = CanvasCoordinateConfiguration({
        x: srcX,
        y: srcY,
        width: 32,
        height: 32,
      });

      const dest = CanvasCoordinateConfiguration({
        x: sprite.x,
        y: sprite.y,
        width: 32,
        height: 32,
      });

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(sprite.x + 16, sprite.y + 16);

      const angleInRadians = (rotation * Math.PI) / 180;

      ctx.rotate(angleInRadians);
      ctx.drawImage(tileMap, srcX, srcY, 32, 32, -16, -16, 32, 32);
      ctx.restore();
    };
  }

  /**
   * Animates the player's tank
   */
  function render(fn) {
    // See HTML5 Canvas 2nd Ed., Fulton pp. ~ 147
    const tileSrcX = Math.floor(ANIMATION_FRAMES[frameIndex] % 8) * 32;
    const tileSrcY = Math.floor(ANIMATION_FRAMES[frameIndex] / 8) * 32;
    const mySprite = myPlayerTank.getSprite();

    currentRenderStrategy({
      ctx: context,
      sprite: mySprite,
      sourceTile: {
        x: tileSrcX,
        y: tileSrcY,
      },
      tileMap: myTileMap,
    });

    currentRenderStrategy = DefaultRenderStrategy();

    frameIndex++;

    if (frameIndex == ANIMATION_FRAMES.length) {
      frameIndex = 0;
    }
  }

  /**
   * @param {HTMLImageElement} tileMap
   */
  function setTileMap(tileMap) {
    myTileMap = tileMap;
  }

  /**
   * @param {SpriteConfiguration} sprite
   * @returns {Object}
   */
  function TankAPI(sprite) {
    const instance = {
      setXVelocity(vx) {
        sprite.vx = vx;
        sprite.x += vx;
      },
      getSprite() {
        return sprite;
      },
      /**
       * @param {Number} x - number of pixels to move the tank
       */
      moveRight(x = 1) {
        sprite.vx = x;
        sprite.x += sprite.vx;
      },
      /**
       * @param {Number} x - number of pixels to move the tank
       */
      moveLeft(x = 1) {
        sprite.vx = x;
        sprite.x -= sprite.vx;
      },
      /**
       * @param {Number} y - number of pixels to move the tank
       */
      moveUp(y = 1) {
        sprite.vy = y;
        sprite.y -= sprite.vy;
      },
      /**
       * @param {Number} y - number of pixels to move the tank
       */
      moveDown(y = 1) {
        sprite.vy = y;
        sprite.y += sprite.vy;
      },
      /**
       * @param {Number} rotation - number of degrees to rotate the tank
       */
      rotate(rotation) {
        currentRenderStrategy = RotateRenderStrategy(rotation);
      },
    };

    myPlayerTank = Object.assign({}, instance);

    return instance;
  }

  /**
   * Sets the current context for drawing to a canvas object
   * @param {CanvasRenderingContext2D} ctx - an instance of the context2d interface
   */
  function setContext(ctx) {
    context = ctx;
  }

  return {
    render,
    setContext,
    setTileMap,
    TankAPI,
  };
}

export default function (bottle) {
  bottle.factory('Plugins.Player', function (container) {
    return PluginPlayer({
      config: container.Config,
      canvas: container.Canvas,
    });
  });
}
