import app from './app'

export default async (on, config) => {

  // Register App plugin
  await app(on, config);
  
}
