export interface PathsConfig {
  plugin: string
  prefix: string
}

const pathsRoutes: PathsConfig[] = [
  {
    plugin: '../routes/pokemon/pokemon.routes',
    prefix: '/api/v1/pokemon'
  },
  {
    plugin: '../routes/battle/battle.routes',
    prefix: '/api/v1/battle'
  }
]

export default pathsRoutes
