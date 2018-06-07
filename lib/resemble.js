/*
 James Cryer / Huddle 2014
 URL: https://github.com/Huddle/Resemble.js
 */
'use strict';

var PNG = require('pngjs').PNG;
var fs = require('fs');

function resembleJS(fileOne, fileTwo, options) {
  var resembleOptions = options || [];
  var ignoreAlpha = 'ignoreAlpha' in resembleOptions ? resembleOptions.ignoreAlpha : false;
  var ignoreAntialiasing = 'ignoreAntialiasing' in resembleOptions ? resembleOptions.ignoreAntialiasing : false;
  var ignoreColors = 'ignoreColors' in resembleOptions ? resembleOptions.ignoreColors : false;
  var ignoreLess = 'ignoreLess' in resembleOptions ? resembleOptions.ignoreLess : false;
  var ignoreNothing = 'ignoreNothing' in resembleOptions ? resembleOptions.ignoreNothing : false;
  var ignoreRectangles = 'ignoreRectangles' in resembleOptions ? resembleOptions.ignoreRectangles : null;
  var ignoreTransparentPixel = 'ignoreTransparentPixel' in resembleOptions ? resembleOptions.ignoreTransparentPixel : false;
  var tolerance = {
    // between 0 and 255
    red: 16,
    green: 16,
    blue: 16,
    alpha: 16,
    minBrightness: 16,
    maxBrightness: 240
  };
  var pixelTransparency = 1;
  var errorPixelColor = { // Color for Error Pixels. Between 0 and 255.
    red: 255,
    green: 0,
    blue: 255,
    alpha: 255
  };
  var targetPix = { r: 0, g: 0, b: 0, a: 0 }; // isAntialiased
  var errorPixelTransform = {
    flat: function (px, offset, d1, d2) {
      px[offset] = errorPixelColor.red;
      px[offset + 1] = errorPixelColor.green;
      px[offset + 2] = errorPixelColor.blue;
      px[offset + 3] = errorPixelColor.alpha;
    },
    /**
     * NOT USING THESE METHODS
     */
    // movement: function (px, offset, d1, d2) {
    //   px[offset] =
    //     (d2.r * (errorPixelColor.red / 255) + errorPixelColor.red) /
    //     2;
    //   px[offset + 1] =
    //     (d2.g * (errorPixelColor.green / 255) +
    //       errorPixelColor.green) /
    //     2;
    //   px[offset + 2] =
    //     (d2.b * (errorPixelColor.blue / 255) +
    //       errorPixelColor.blue) /
    //     2;
    //   px[offset + 3] = d2.a;
    // },
    // flatDifferenceIntensity: function (px, offset, d1, d2) {
    //   px[offset] = errorPixelColor.red;
    //   px[offset + 1] = errorPixelColor.green;
    //   px[offset + 2] = errorPixelColor.blue;
    //   px[offset + 3] = colorsDistance(d1, d2);
    // },
    // movementDifferenceIntensity: function (px, offset, d1, d2) {
    //   var ratio = colorsDistance(d1, d2) / 255 * 0.8;
    //
    //   px[offset] =
    //     (1 - ratio) * (d2.r * (errorPixelColor.red / 255)) +
    //     ratio * errorPixelColor.red;
    //   px[offset + 1] =
    //     (1 - ratio) * (d2.g * (errorPixelColor.green / 255)) +
    //     ratio * errorPixelColor.green;
    //   px[offset + 2] =
    //     (1 - ratio) * (d2.b * (errorPixelColor.blue / 255)) +
    //     ratio * errorPixelColor.blue;
    //   px[offset + 3] = d2.a;
    // },
    // diffOnly: function (px, offset, d1, d2) {
    //   px[offset] = d2.r;
    //   px[offset + 1] = d2.g;
    //   px[offset + 2] = d2.b;
    //   px[offset + 3] = d2.a;
    // }
  };
  var errorPixel = errorPixelTransform.flat;
  var errorType;
  var boundingBox;
  var ignoredBox;
  var largeImageThreshold = 1200;
  var useCrossOrigin = true;
  var data = {};
  var images = [];
  var updateCallbackArray = [];

  if (ignoreAlpha) {
    tolerance.red = 16;
    tolerance.green = 16;
    tolerance.blue = 16;
    tolerance.alpha = 255;
    tolerance.minBrightness = 16;
    tolerance.maxBrightness = 240;

    ignoreAntialiasing = false;
    ignoreColors = false;
    ignoreLess = false;
    ignoreNothing = false;
  }

  if (ignoreAntialiasing) {
    tolerance.red = 32;
    tolerance.green = 32;
    tolerance.blue = 32;
    tolerance.alpha = 32;
    tolerance.minBrightness = 64;
    tolerance.maxBrightness = 96;

    ignoreColors = false;
    ignoreNothing = false;
  }

  if (ignoreColors) {
    tolerance.alpha = 16;
    tolerance.minBrightness = 16;
    tolerance.maxBrightness = 240;

    ignoreNothing = false;
  }

  if (ignoreNothing) {
    tolerance.red = 0;
    tolerance.green = 0;
    tolerance.blue = 0;
    tolerance.alpha = 0;
    tolerance.minBrightness = 0;
    tolerance.maxBrightness = 255;

    ignoreAntialiasing = false;
    ignoreColors = false;
    ignoreLess = false;
  }

  if (ignoreLess) {
    ignoreAntialiasing = false;
    ignoreColors = false;
  }

  /**
   * NOT USED BECAUSE OF NOT USING errorPixelTransform.flatDifferenceIntensity
   * AND errorPixelTransform.movementDifferenceIntensity
   */
  // function colorsDistance(c1, c2) {
  //   return (
  //     (Math.abs(c1.r - c2.r) +
  //       Math.abs(c1.g - c2.g) +
  //       Math.abs(c1.b - c2.b)) /
  //     3
  //   );
  // }

  /**
   * NOT USED BECAUSE OF NOT USING withinComparedArea
   */
  // function withinBoundingBox(x, y, width, height, box) {
  //   return (
  //     x > (box.left || 0) &&
  //     x < (box.right || width) &&
  //     y > (box.top || 0) &&
  //     y < (box.bottom || height)
  //   );
  // }

  /**
   * NOT USED BECAUSE OF NOT USING withinComparedArea because of own implementation of ignoreRectagnles
   */
  // function withinComparedArea(x, y, width, height) {
  //   var isIncluded = true;
  //
  //   if (
  //     boundingBox !== undefined &&
  //     !withinBoundingBox(x, y, width, height, boundingBox)
  //   ) {
  //     isIncluded = false;
  //   }
  //
  //   if (
  //     ignoredBox !== undefined &&
  //     withinBoundingBox(x, y, width, height, ignoredBox)
  //   ) {
  //     isIncluded = false;
  //   }
  //
  //   return isIncluded;
  // }

  function triggerDataUpdate() {
    var len = updateCallbackArray.length;
    var i;
    for (i = 0; i < len; i++) {
      /* istanbul ignore else */
      if (typeof updateCallbackArray[i] === 'function') {
        updateCallbackArray[i](data);
      }
    }
  }

  function loop(w, h, callback) {
    var x;
    var y;

    for (x = 0; x < w; x++) {
      for (y = 0; y < h; y++) {
        callback(x, y);
      }
    }
  }

  /**
   * NOT USED
   */
  // function parseImage(sourceImageData, width, height) {
  //   var pixelCount = 0;
  //   var redTotal = 0;
  //   var greenTotal = 0;
  //   var blueTotal = 0;
  //   var alphaTotal = 0;
  //   var brightnessTotal = 0;
  //   var whiteTotal = 0;
  //   var blackTotal = 0;
  //
  //   loop(width, height, function(horizontalPos, verticalPos) {
  //     var offset = (verticalPos * width + horizontalPos) * 4;
  //     var red = sourceImageData[offset];
  //     var green = sourceImageData[offset + 1];
  //     var blue = sourceImageData[offset + 2];
  //     var alpha = sourceImageData[offset + 3];
  //     var brightness = getBrightness(red, green, blue);
  //
  //     if (red === green && red === blue && alpha) {
  //       if (red === 0) {
  //         blackTotal++;
  //       } else if (red === 255) {
  //         whiteTotal++;
  //       }
  //     }
  //
  //     pixelCount++;
  //
  //     redTotal += red / 255 * 100;
  //     greenTotal += green / 255 * 100;
  //     blueTotal += blue / 255 * 100;
  //     alphaTotal += (255 - alpha) / 255 * 100;
  //     brightnessTotal += brightness / 255 * 100;
  //   });
  //
  //   data.red = Math.floor(redTotal / pixelCount);
  //   data.green = Math.floor(greenTotal / pixelCount);
  //   data.blue = Math.floor(blueTotal / pixelCount);
  //   data.alpha = Math.floor(alphaTotal / pixelCount);
  //   data.brightness = Math.floor(brightnessTotal / pixelCount);
  //   data.white = Math.floor(whiteTotal / pixelCount * 100);
  //   data.black = Math.floor(blackTotal / pixelCount * 100);
  //
  //   triggerDataUpdate();
  // }

  /**
   * WE ONLY NEED OT LOAD IMAGES THAT ARE PROVIDED BY PROTRACTOR-IMAGE-COMPARE
   * NOT LOADING THROUGH URL. THAT'S WHY IT DIFFERS
   */
  function loadImageData(fileData, callback) {
    var ext = fileData.substring(fileData.lastIndexOf('.') + 1);
    /* istanbul ignore else */

    if (ext == 'png') {
      var png = new PNG();
      fs.createReadStream(fileData)
        .pipe(png)
        .on('parsed', function () {
          callback(this, this.width, this.height);
        });
    }
  }

  function isColorSimilar(a, b, color) {
    var absDiff = Math.abs(a - b);

    if (typeof a === 'undefined') {
      return false;
    }
    if (typeof b === 'undefined') {
      return false;
    }

    if (a === b) {
      return true;
    } else if (absDiff < tolerance[color]) {
      return true;
    }
    return false;
  }

  function isPixelBrightnessSimilar(d1, d2) {
    var alpha = isColorSimilar(d1.a, d2.a, 'alpha');
    var brightness = isColorSimilar(
      d1.brightness,
      d2.brightness,
      'minBrightness'
    );
    return brightness && alpha;
  }

  function getBrightness(r, g, b) {
    return 0.3 * r + 0.59 * g + 0.11 * b;
  }

  function isRGBSame(d1, d2) {
    var red = d1.r === d2.r;
    var green = d1.g === d2.g;
    var blue = d1.b === d2.b;
    return red && green && blue;
  }

  function isRGBSimilar(d1, d2) {
    var red = isColorSimilar(d1.r, d2.r, 'red');
    var green = isColorSimilar(d1.g, d2.g, 'green');
    var blue = isColorSimilar(d1.b, d2.b, 'blue');
    var alpha = isColorSimilar(d1.a, d2.a, 'alpha');

    return red && green && blue && alpha;
  }

  function isContrasting(d1, d2) {
    return (
      Math.abs(d1.brightness - d2.brightness) >
      tolerance.maxBrightness
    );
  }

  function getHue(red, green, blue) {
    var r = red / 255;
    var g = green / 255;
    var b = blue / 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h;
    var d;

    if (max === min) {
      h = 0; // achromatic
    } else {
      d = max - min;
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h /= 6;
      }
    }

    return h;
  }

  function isAntialiased(sourcePix, pix, cacheSet, verticalPos, horizontalPos, width) {
    var offset;
    var distance = 1;
    var i;
    var j;
    var hasHighContrastSibling = 0;
    var hasSiblingWithDifferentHue = 0;
    var hasEquivalentSibling = 0;

    addHueInfo(sourcePix);

    for (i = distance * -1; i <= distance; i++) {
      for (j = distance * -1; j <= distance; j++) {

        if (i === 0 && j === 0) {
          // ignore source pixel
        } else {

          offset =
            ((verticalPos + j) * width + (horizontalPos + i)) *
            4;

          if (!getPixelInfo(targetPix, pix, offset, cacheSet)) {
            continue;
          }

          addBrightnessInfo(targetPix);
          addHueInfo(targetPix);

          /* istanbul ignore else */
          if (isContrasting(sourcePix, targetPix)) {
            hasHighContrastSibling++;
          }

          /* istanbul ignore else */
          if (isRGBSame(sourcePix, targetPix)) {
            hasEquivalentSibling++;
          }

          /* istanbul ignore else */
          if (Math.abs(targetPix.h - sourcePix.h) > 0.3) {
            hasSiblingWithDifferentHue++;
          }

          /* istanbul ignore else */
          if (
            hasSiblingWithDifferentHue > 1 ||
            hasHighContrastSibling > 1
          ) {
            return true;
          }
        }
      }
    }

    /* istanbul ignore else */
    if (hasEquivalentSibling < 2) {
      return true;
    }

    return false;
  }

  function copyPixel(px, offset, pix) {
    /* istanbul ignore else */
    if (errorType === 'diffOnly') {
      return;
    }

    px[offset] = pix.r; // r
    px[offset + 1] = pix.g; // g
    px[offset + 2] = pix.b; // b
    px[offset + 3] = pix.a * pixelTransparency; // a
  }

  function copyGrayScalePixel(px, offset, pix) {
    /* istanbul ignore else */
    if (errorType === 'diffOnly') {
      return;
    }

    px[offset] = pix.brightness; // r
    px[offset + 1] = pix.brightness; // g
    px[offset + 2] = pix.brightness; // b
    px[offset + 3] = pix.a * pixelTransparency; // a
  }

  function getPixelInfo(dst, pix, offset) {
    /* istanbul ignore else */
    if (pix.length > offset) {
      dst.r = pix[offset];
      dst.g = pix[offset + 1];
      dst.b = pix[offset + 2];
      dst.a = pix[offset + 3];

      return true;
    }

    return false;
  }

  function addBrightnessInfo(pix) {
    pix.brightness = getBrightness(pix.r, pix.g, pix.b); // 'corrected' lightness
  }

  function addHueInfo(pix) {
    pix.h = getHue(pix.r, pix.g, pix.b);
  }

  function analyseImages(img1, img2, width, height) {
    var data1 = img1.data;
    var data2 = img2.data;

    var imgd = new PNG({
      width: img1.width,
      height: img1.height,
      deflateChunkSize: img1.deflateChunkSize,
      deflateLevel: img1.deflateLevel,
      deflateStrategy: img1.deflateStrategy,
    });
    var pix = imgd.data;

    var mismatchCount = 0;
    var diffBounds = {
      top: height,
      left: width,
      bottom: 0,
      right: 0
    };
    var updateBounds = function (x, y) {
      diffBounds.left = Math.min(x, diffBounds.left);
      diffBounds.right = Math.max(x, diffBounds.right);
      diffBounds.top = Math.min(y, diffBounds.top);
      diffBounds.bottom = Math.max(y, diffBounds.bottom);
    };

    var time = Date.now();

    var skip;

    var currentRectangle = null;
    var rectagnlesIdx = 0;

    /* istanbul ignore else */
    if (
      !!largeImageThreshold &&
      ignoreAntialiasing &&
      (width > largeImageThreshold || height > largeImageThreshold)) {
      skip = 6;
    }

    var pixel1 = { r: 0, g: 0, b: 0, a: 0 };
    var pixel2 = { r: 0, g: 0, b: 0, a: 0 };

    loop(width, height, function (horizontalPos, verticalPos) {
      /* istanbul ignore else */
      if (skip) { // only skip if the image isn't small
        /* istanbul ignore else */
        if (
          verticalPos % skip === 0 ||
          horizontalPos % skip === 0
        ) {
          return;
        }
      }

      var offset = (verticalPos * width + horizontalPos) * 4;

      /* istanbul ignore else */
      if (!getPixelInfo(pixel1, data1, offset, 1) || !getPixelInfo(pixel2, data2, offset, 2)) {
        return;
      }

      /* istanbul ignore else */
      if (ignoreRectangles) {
        for (rectagnlesIdx = 0; rectagnlesIdx < ignoreRectangles.length; rectagnlesIdx++) {
          currentRectangle = ignoreRectangles[rectagnlesIdx];
          /* istanbul ignore else */
          if (
            (verticalPos >= currentRectangle.y) &&
            (verticalPos < currentRectangle.y + currentRectangle.height) &&
            (horizontalPos >= currentRectangle.x) &&
            (horizontalPos < currentRectangle.x + currentRectangle.width)
          ) {
            copyGrayScalePixel(pix, offset, pixel2);
            return;
          }
        }
      }

      /* istanbul ignore else */
      if (ignoreTransparentPixel && (pixel1.a < 255 || pixel2.a < 255)) {
        return;
      }

      /* istanbul ignore else */
      if (ignoreColors) {

        addBrightnessInfo(pixel1);
        addBrightnessInfo(pixel2);

        if (isPixelBrightnessSimilar(pixel1, pixel2)) {
          copyGrayScalePixel(pix, offset, pixel2);
        } else {
          errorPixel(pix, offset, pixel1, pixel2);
          mismatchCount++;
          updateBounds(horizontalPos, verticalPos);
        }
        return;
      }

      if (isRGBSimilar(pixel1, pixel2)) {
        copyPixel(pix, offset, pixel1);

      } else if (
        ignoreAntialiasing &&
        (addBrightnessInfo(pixel1), // jit pixel info augmentation looks a little weird, sorry.
          addBrightnessInfo(pixel2),
        isAntialiased(
          pixel1,
          data1,
          1,
          verticalPos,
          horizontalPos,
          width
        ) ||
        isAntialiased(
          pixel2,
          data2,
          2,
          verticalPos,
          horizontalPos,
          width
        ))
      ) {

        if (isPixelBrightnessSimilar(pixel1, pixel2)) {
          copyGrayScalePixel(pix, offset, pixel2);
        } else {
          errorPixel(pix, offset, pixel1, pixel2);
          mismatchCount++;
        }
      } else {
        errorPixel(pix, offset, pixel1, pixel2);
        mismatchCount++;
      }

    });

    data.rawMisMatchPercentage = mismatchCount / (height * width) * 100;
    data.misMatchPercentage = data.rawMisMatchPercentage.toFixed(2);
    data.diffBounds = diffBounds;
    data.analysisTime = Date.now() - time;

    data.getDiffImage = function (text) {
      return imgd;
    };
  }

  /**
   * NOT USED, THIS IS USED WHEN USING CANVAS
   */
  // function addLabel(text, context, hiddenCanvas) {
  //   var textPadding = 2;
  //
  //   context.font = "12px sans-serif";
  //
  //   var textWidth = context.measureText(text).width + textPadding * 2;
  //   var barHeight = 22;
  //
  //   if (textWidth > hiddenCanvas.width) {
  //     hiddenCanvas.width = textWidth;
  //   }
  //
  //   hiddenCanvas.height += barHeight;
  //
  //   context.fillStyle = "#666";
  //   context.fillRect(0, 0, hiddenCanvas.width, barHeight - 4);
  //   context.fillStyle = "#fff";
  //   context.fillRect(0, barHeight - 4, hiddenCanvas.width, 4);
  //
  //   context.fillStyle = "#fff";
  //   context.textBaseline = "top";
  //   context.font = "12px sans-serif";
  //   context.fillText(text, textPadding, 1);
  //
  //   return barHeight;
  // }

  /**
   * NOT USED, THIS IS USED WHEN USING CANVAS
   */
  // function normalise(img, w, h) {
  //   var c;
  //   var context;
  //
  //   if (img.height < h || img.width < w) {
  //     c = document.createElement('canvas');
  //     c.width = w;
  //     c.height = h;
  //     context = c.getContext('2d');
  //     context.putImageData(img, 0, 0);
  //     return context.getImageData(0, 0, w, h);
  //   }
  //
  //   return img;
  // }

  /**
   * NOT USED
   */
  // function outputSettings(options) {
  //   var key;
  //
  //   if (options.errorColor) {
  //     for (key in options.errorColor) {
  //       if (options.errorColor.hasOwnProperty(key)) {
  //         errorPixelColor[key] =
  //           options.errorColor[key] === void 0
  //             ? errorPixelColor[key]
  //             : options.errorColor[key];
  //       }
  //     }
  //   }
  //
  //   if (options.errorType && errorPixelTransform[options.errorType]) {
  //     errorPixel = errorPixelTransform[options.errorType];
  //     errorType = options.errorType;
  //   }
  //
  //   if (
  //     options.errorPixel &&
  //     typeof options.errorPixel === "function"
  //   ) {
  //     errorPixel = options.errorPixel;
  //   }
  //
  //   pixelTransparency = isNaN(Number(options.transparency))
  //     ? pixelTransparency
  //     : options.transparency;
  //
  //   if (options.largeImageThreshold !== undefined) {
  //     largeImageThreshold = options.largeImageThreshold;
  //   }
  //
  //   if (options.useCrossOrigin !== undefined) {
  //     useCrossOrigin = options.useCrossOrigin;
  //   }
  //
  //   if (options.boundingBox !== undefined) {
  //     boundingBox = options.boundingBox;
  //   }
  //
  //   if (options.ignoredBox !== undefined) {
  //     ignoredBox = options.ignoredBox;
  //   }
  // }

  function compare(one, two) {
    /**
     * NOT USED, WE DON'T SUPPORT outputSettings
     */
    // if (globalOutputSettings !== oldGlobalSettings) {
    //   outputSettings(globalOutputSettings);
    // }

    function onceWeHaveBoth(img) {
      var width;
      var height;

      images.push(img);
      if (images.length === 2) {
        if (images[0].error || images[1].error) {
          data = {};
          data.error = images[0].error
            ? images[0].error
            : images[1].error;
          triggerDataUpdate();
          return;
        }
        width = images[0].width > images[1].width
          ? images[0].width
          : images[1].width;
        height = images[0].height > images[1].height
          ? images[0].height
          : images[1].height;

        if (
          images[0].width === images[1].width &&
          images[0].height === images[1].height
        ) {
          data.isSameDimensions = true;
        } else {
          data.isSameDimensions = false;
        }

        data.dimensionDifference = {
          width: images[0].width - images[1].width,
          height: images[0].height - images[1].height
        };

        analyseImages(
          images[0],
          images[1],
          width,
          height
        );

        triggerDataUpdate();
      }
    }

    images = [];
    loadImageData(one, onceWeHaveBoth);
    loadImageData(two, onceWeHaveBoth);
  }

  return {
    onComplete: function (callback) {
      updateCallbackArray.push(callback);
      return compare(fileOne, fileTwo);
    }
  };
}

module.exports = resembleJS;
