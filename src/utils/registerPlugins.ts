import { Server } from '@hapi/hapi'
import pathsRoutes from '../routes/'
export const registerPlugins = async (server: Server) => {
  try {
    const pluginModules = await Promise.all(
      pathsRoutes.map(async (row) => {
        const routes = require(row.plugin).default || require(row.plugin);
        return {
          plugin: {
            name: row.prefix.replace(/\//g, '') || 'default',
            register: async (srv: Server) => {
              srv.route(routes);
            }
          },
          options: {},
          routes: {
            prefix: row.prefix
          }
        };
      })
    );

    await server.register(pluginModules);
    console.log('All plugins registered successfully');
  } catch (error) {
    console.error('Failed to register plugins:', error);
    throw error;
  }
};
