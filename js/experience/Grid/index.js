import Cube from './Cube'
import Ground from './Ground'

class _Grid {
  init(size = 25, length = 8) {
    const { scene } = XR8.Threejs.xrScene()
    const container = new THREE.Group()
    container.scale.multiplyScalar(0.015)
    container.rotateX(Math.PI / 2)
    scene.add(container)

    this.ground = new Ground(size, length)
    container.add(this.ground)

    this.cubeList = []
    for (let j = 0; j < length; j++) {
      this.cubeList[j] = []
      for (let i = 0; i < length; i++) {
        this.cubeList[j][i] = new Cube(j, i, size, length)
        container.add(this.cubeList[j][i])
      }
    }
  }
}

const Grid = new _Grid()
export default Grid
