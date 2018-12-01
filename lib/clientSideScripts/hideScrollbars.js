/**
 * Hide the scrollbars
 *
 * @param {boolean} hide Hide the scrollbars or not
 */
export default function hideScrollBars(hide) {
  if (hide) {
    document.documentElement.style.overflow = 'hidden';
  } else {
    document.documentElement.style.overflow = '';
  }
}
