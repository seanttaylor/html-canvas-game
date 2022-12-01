import xml2js from 'xml2js';

const parser = new xml2js.Parser();

/**
 * Formats an XML tile map exported from the Tiled map editor
 * See (https://www.mapeditor.org/)
 * @param {Object} json - JSON that has been converted from and XML tile map
 * @returns {Object}
 */
function GameMapTMX(json) {
  const metadata = json.map.$;
  const mapCoords = json.map.layer[0].data[0]['_'];
  const coordsFilteredEmptyString = mapCoords
    .split('\n')
    .filter((c) => c !== '');
  const coordsStrippedTrailingComma = coordsFilteredEmptyString.map(
    (coordList) => {
      return coordList[coordList.length - 1] === ','
        ? coordList.slice(0, -1)
        : coordList;
    }
  );

  const coords = coordsStrippedTrailingComma.map((coordList) =>
    coordList.split(',').map((c) => Number(c))
  );

  return {
    metadata: {
      height: Number(metadata.height),
      width: Number(metadata.width),
      tileHeight: Number(metadata.tileheight),
      tileWidth: Number(metadata.tilewidth),
    },
    coords,
  };
}

/******** PLUGIN DEFINITION ********/

/**
 * Controls the Game map
 * @param {Object} canvas - an instance of the Canvas plugin interface
 * @returns {Object}
 */
function PluginMap(canvas) {
  const MAP_INDEX_OFFSET = -1;
  const { CanvasCoordinateConfiguration, CanvasDrawImage } = canvas;

  let mapRows = 10;
  let mapCols = 10;
  let tileMapXML = null;
  let myTileMap = null;
  let myTileMapCoords = null;
  let context = null;

  /**
   * @param {String} xml - a raw XML document describing a game tile map
   * @param {HTMLImageElement} tileMap - image element referencing a tilesheet
   * that pairs with the xml document
   */
  async function loadTileMapXML({ xml, tileMap }) {
    tileMapXML = xml;
    myTileMap = tileMap;

    try {
      const mapJSON = await parseXML(xml);
      const gameMapTMXConfig = GameMapTMX(mapJSON);

      myTileMapCoords = gameMapTMXConfig.coords;
      mapRows = gameMapTMXConfig.metadata.height;
      mapCols = gameMapTMXConfig.metadata.width;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Converts an XML document to JSON
   * @param {String} xml
   * @returns {Promise}
   */
  function parseXML(xml) {
    const promise = new Promise((resolve, reject) => {
      parser.parseString(xml, function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });

    return promise;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  function render() {
    for (let rowCtr = 0; rowCtr < mapRows; rowCtr++) {
      for (let colCtr = 0; colCtr < mapCols; colCtr++) {
        let tileId = myTileMapCoords[rowCtr][colCtr] + MAP_INDEX_OFFSET;
        let srcX = Math.floor(tileId % 8) * 32;
        let srcY = Math.floor(tileId / 8) * 32;

        let source = CanvasCoordinateConfiguration({
          x: srcX,
          y: srcY,
        });

        let dest = CanvasCoordinateConfiguration({
          x: colCtr * 32,
          y: rowCtr * 32,
        });

        CanvasDrawImage({ context, image: myTileMap })(source)(dest);
      }
    }
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
    loadTileMapXML,
    setContext,
  };
}

export default function (bottle) {
  bottle.factory('Plugins.Map', function (container) {
    return PluginMap(container.Canvas);
  });
}
