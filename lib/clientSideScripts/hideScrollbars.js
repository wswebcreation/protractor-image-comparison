/**
 * Hide the scrollbars
 *
 * @param {boolean} enabled
 */
export default function hideScrollBars(hide) {
  if (hide) {
    document.documentElement.style.overflow = 'hidden';
  } else {
    document.documentElement.style.overflow = '';
  }
}
