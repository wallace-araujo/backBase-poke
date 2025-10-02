
import { Server } from '@hapi/hapi'
import * as dotenv from 'dotenv'
import HapiSwagger from 'hapi-swagger'
import Vision from '@hapi/vision'
import Inert from '@hapi/inert'
import Package from '../package.json'
import { registerPlugins } from './utils/registerPlugins'

dotenv.config()

export const init = async () => {
  const server: Server = new Server({
    port: process.env.NODE_ENV === 'test' ? 0 : process.env.PORT,
    host: '127.0.0.1',
    routes: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
  })

  const swaggerOptions: HapiSwagger.RegisterOptions = {
    info: {
      title: 'API BASE Pokemon',
      version: Package.version,
      description: 'Documentação da API BAS Pokemon'
    },
    grouping: 'tags',
  }

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    },
    {
      plugin: require('hapi-pino'),
      options: {
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:HH:MM:ss',
            ignore: 'pid,hostname,req.headers,res.headers,remoteAddress,remotePort,v',
            messageFormat: '{req.method} {req.url} - {msg}',
            singleLine: true,
            customColors: 'info:blue,warn:yellow,error:red'
          }
        },
        serializers: {
          req: (req: any) => ({
            method: req.method,
            url: req.url,
            body: req.payload
          }),
          res: (res: any) => ({
            statusCode: res.statusCode,
            body: res.source
          })
        },
        logPayload: true,
        logQuery: true,
        logRouteTags: false,
        logRequestStart: false,
        logRequestComplete: true
      }
    }
  ])

  await registerPlugins(server)



  if (process.env.NODE_ENV !== 'test') {
    await server.start();
    console.log('Server running on %s', server.info.uri);
  }
  return server;
}

if (process.env.NODE_ENV !== 'test') {
  process.on('unhandledRejection', (err: Error) => {
    console.error(err);
    process.exit(1);
  });

  init();
}