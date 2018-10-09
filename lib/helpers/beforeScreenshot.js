import hideScrollBars from '../cliendSideScripts/hideScrollBars';

export default async function beforeScreenshot(executor) {
  // Hide the scrollbars
  await executor(hideScrollBars, false);
}
