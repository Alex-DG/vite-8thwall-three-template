import Box from '../classes/Box'
import ParticlesSystem from '../classes/ParticlesSystem'

export const initWorldPipelineModule = () => {
  const init = () => {
    Box.init()
    ParticlesSystem.init()

    console.log('✨', 'World ready')
  }

  const render = () => {
    ParticlesSystem?.update()
  }

  return {
    name: 'world-content',

    onStart: () => init(),

    onRender: () => render(),
  }
}
