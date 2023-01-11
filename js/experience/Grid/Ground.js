import * as THREE from 'three'

class Ground extends THREE.Mesh {
  constructor(size, length) {
    const w = length * 100 - size
    const h = length * 100 - size
    const geometry = new THREE.PlaneGeometry(w, h, 32, 32)
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      metalness: 0,
      wireframe: true,
    })
    super(geometry, material)

    this.rotation.x = -Math.PI / 2
    this.position.set(0, -size / 2, 0)
  }
}

export default Ground
