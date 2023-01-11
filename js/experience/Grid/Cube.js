import * as THREE from 'three'

class Cube extends THREE.Mesh {
  constructor(j, i, size, length) {
    const margin = 75
    const scale = size * length + margin * length

    const geometry = new THREE.BoxGeometry(size, size, size)
    const material = new THREE.MeshStandardMaterial({
      color: Math.random() * 0xffffff,
      roughness: 1,
      metalness: 0,
    })
    super(geometry, material)

    const offset = 3
    this.position.set(
      j * margin - scale / offset,
      0,
      i * margin - scale / offset
    )
  }
  update(FrequencyData, size) {
    this.material.color = new THREE.Color(
      'hsl(' + (FrequencyData / 256) * 360 + ', 100%, 40%)'
    )
    this.scale.y = Math.pow(FrequencyData / 128, 4) + 0.1
    this.position.y = (this.scale.y * size) / 2
  }
}

export default Cube
