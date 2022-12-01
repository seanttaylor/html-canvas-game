/**
 *
 */
function PluginCanvas() {
  /**
   * Basic canvas fill text utility method
   * @returns {Array}
   */
  function CanvasFillText({ text, xPosition, yPosition }) {
    return [text, xPosition, yPosition];
  }

  /**
   *
   * @returns {Function}
   */
  function CanvasDrawTextConfiguration({
    fillStyle,
    fillText,
    font,
    textBaseline,
  }) {
    return function (ctx) {
      ctx.fillStyle = fillStyle;
      ctx.fillText(...fillText);
      ctx.font = font;
      ctx.textBaseline = textBaseline;
      return ctx;
    };
  }

  /**
   * Wrapper for the `canvas.drawImage` method's positional
   * arguments; returns a list of arguments to supply to the method in the correct order
   * (e.g. canvas.drawImage(imageElement, xpos, ypos, height, width)
   * @returns {Array}
   */
  function CanvasDrawImageConfiguration({
    image,
    srcXPosition,
    srcYPosition,
    srcHeight = 64,
    srcWidth = 64,
  }) {
    return [image, srcXPosition, srcYPosition, srcHeight, srcWidth];
  }

  /**
   * Creates a list of the required positional arguments for the
   * overloaded `context.drawImage` method; specifies the destination coordinates within a
   * canvas to place an image
   * @returns {Array}
   */
  function CanvasCoordinateConfiguration({ x, y, width = 32, height = 32 }) {
    return [x, y, width, height];
  }

  /**
   *
   * @param {Object} context
   * @param {Object} image
   * @returns {Function}
   */
  function CanvasDrawImage({ context, image }) {
    return function (canvasImageSourceConfig) {
      return function (canvasImageDestConfig) {
        if (!canvasImageDestConfig) {
          context.drawImage(image, ...canvasImageSourceConfig);
          return;
        }
        context.drawImage(
          image,
          ...canvasImageSourceConfig,
          ...canvasImageDestConfig
        );
      };
    };
  }

  return {
    CanvasFillText,
    CanvasDrawTextConfiguration,
    CanvasCoordinateConfiguration,
    CanvasDrawImage,
  };
}

export default function (bottle) {
  bottle.factory('Plugins.Canvas', function (/* container */) {
    return PluginCanvas();
  });
}
