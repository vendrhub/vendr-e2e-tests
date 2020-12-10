import app from './app'
import getCompareSnapshotsPlugin from 'cypress-visual-regression/dist/plugin';

export default async (on, config) => {

  // Register App plugin
  await app(on, config);

  // Register Visual Regressions plugin
  getCompareSnapshotsPlugin(on, config)
  
}
