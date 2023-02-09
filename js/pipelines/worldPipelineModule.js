import Box from '../Experience/Box'
import ParticlesSystem from '../experience/ParticlesSystem'

export const initWorldPipelineModule = () => {
  const init = () => {
    Box.init()
    ParticlesSystem.init()

    console.log('✨', 'World ready')
  }

  const render = () => {
    Box?.update()
    ParticlesSystem?.update()
  }

  return {
    name: 'init-world',

    onStart: () => init(),

    onRender: () => render(),
  }
}
