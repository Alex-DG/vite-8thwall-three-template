import Box from '../Experience/Box'
import ParticlesSystem from '../experience/ParticlesSystem'

export const initWorldPipelineModule = () => {
  let box
  let particlesSystem

  const init = () => {
    const { scene } = XR8.Threejs.xrScene()

    box = new Box({ scene })
    particlesSystem = new ParticlesSystem({ scene, count: 1000 })

    console.log('✨', 'World ready')
  }

  const update = () => {
    box?.update()
    particlesSystem?.update()
  }

  return {
    name: 'init-world',

    onStart: () => init(),

    onUpdate: () => update(),
  }
}
