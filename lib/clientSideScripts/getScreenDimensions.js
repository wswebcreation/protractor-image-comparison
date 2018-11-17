/**
 * Get all the screen dimensions
 *
 * @returns {
 *    {
 *      dimensions: {
 *        body: {
 *          scrollHeight: number,
 *          offsetHeight: number
 *        },
 *        html: {
 *          clientWidth: number,
 *          scrollWidth: number,
 *          clientHeight: number,
 *          scrollHeight: number,
 *          offsetHeight: number
 *        },
 *        window: {
 *          innerWidth: number,
 *          innerHeight: number,
 *          outerWidth: number,
 *          outerHeight: number,
 *          devicePixelRatio: number,
 *          screenWidth: number,
 *          screenHeight: number
 *        }
 *      }
 *    }
 *  }
 */
export default function getScreenDimensions() {
  const body = document.body;
  const html = document.documentElement;

  return {
    dimensions: {
      body: {
        scrollHeight: body.scrollHeight,
        offsetHeight: body.offsetHeight
      },
      html: {
        clientWidth: html.clientWidth,
        scrollWidth: html.scrollWidth,
        clientHeight: html.clientHeight,
        scrollHeight: html.scrollHeight,
        offsetHeight: html.offsetHeight
      },
      window: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        devicePixelRatio: typeof window.devicePixelRatio === 'undefined' ? 1 : window.devicePixelRatio,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      }
    }
  };
}
