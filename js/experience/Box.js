import * as THREE from 'three'

class _Box {
  init() {
    const { scene } = XR8.Threejs.xrScene()

    this.instance = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshNormalMaterial()
    )

    scene.add(this.instance)
  }

  update() {
    if (this.instance) {
      this.instance.rotation.x += 0.01
      this.instance.rotation.y += 0.01
    }
  }
}

const Box = new _Box()
export default Box
