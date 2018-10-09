import hideScrollBars from '../cliendSideScripts/hideScrollBars';

export default async function afterScreenshot(executor) {
  // Show the scrollbars
  await executor(hideScrollBars, true);
}
