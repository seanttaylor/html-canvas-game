/******** ASSETS ********/

// const HELLO_WORLD_GIF_URL = 'https://tinyurl.com/23pzr79a';
const TILE_SHEET_URL = 'https://i.imgur.com/d7mhxFn.png';
const DEFAULT_TILE_MAP_URL =
  'https://gist.githubusercontent.com/seanttaylor/f791ce0fd59907f8b8dd0e36c5fe9804/raw/df0938a6256988fcff3fe4a642eeee8fc796beb8/tanks-tilemap.xml';

const ASSET_MAP = {
  TILE_SHEET_URL,
  DEFAULT_TILE_MAP_URL,
};
/******** SETTINGS ********/

const APP_VERSION = 'v0.0.1';
const REQUIRED_ASSETS = new Set([TILE_SHEET_URL, DEFAULT_TILE_MAP_URL]);

const loadedAssets = new Set([]);

/**
 * @param {Window} window - an instance of the `Window` interface
 */
function PluginConfig(window) {
  const { CustomEvent } = window;
  const assetsLoaded = new CustomEvent('assets.loaded');

  /**
   * @param {String} assetURL
   */
  function loadAsset(assetURL) {
    if (REQUIRED_ASSETS.has(assetURL)) {
      loadedAssets.add(assetURL);
    }

    if (loadedAssets.size === REQUIRED_ASSETS.size) {
      console.log(`${loadedAssets.size}/${REQUIRED_ASSETS.size} assets loaded`);
      window.dispatchEvent(assetsLoaded);
      return;
    }
  }

  /**
   *
   * @returns {Object}
   */
  function getRequiredAssets() {
    return ASSET_MAP;
  }

  /**
   *
   * @returns {Array}
   */
  function getLoadedAssets() {
    return Array.from(loadedAssets);
  }

  return {
    loadAsset,
    getRequiredAssets,
    getLoadedAssets,
    settings: {
      APP_VERSION,
    },
  };
}

export default function (bottle) {
  bottle.factory('Plugins.Config', function (container) {
    const { WINDOW } = container.Window;

    return PluginConfig(WINDOW);
  });
}
