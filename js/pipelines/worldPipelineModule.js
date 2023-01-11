import '../experience/Player/index.js'

import Analyser from '../experience/Analyzer'
import Grid from '../experience/Grid'
import Lights from '../experience/Lights'

export const initWorldPipelineModule = () => {
  const init = () => {
    Lights.init()
    Grid.init()
    // Analyser.init()

    console.log('✨', 'World ready')
  }

  const update = () => {}

  return {
    name: 'init-world',

    onStart: () => init(),

    onUpdate: () => update(),
  }
}
