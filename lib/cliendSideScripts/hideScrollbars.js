/**
 * Hide the scrollbars
 *
 * @param {boolean} enabled
 */
export default function hideScrollBars(enabled) {
  if (enabled) {
    document.documentElement.style.overflow = '';
  } else {
    document.documentElement.style.overflow = 'hidden';
  }
}
