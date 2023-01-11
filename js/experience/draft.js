class Audio {
  constructor(soundUrl) {
    this.listener = new THREE.AudioListener()
    const audio = new THREE.Audio(this.listener)
    this.xhr = 0

    this.audioLoader = new THREE.AudioLoader()
    this.audioLoader.load(
      soundUrl,
      function (buffer) {
        audio.setBuffer(buffer)
        audio.setLoop(true)
        audio.setVolume(1.0)
      },
      // onProgress callback
      function (xhr) {
        if ((xhr.loaded / xhr.total) * 100 === 100) {
          setTimeout(() => {
            document.getElementById('overlay').style.display = 'block'
          }, 1000)
        } else {
        }
      },
      // onError callback
      function (err) {
        console.log('An error happened')
      }
    )
    this.soundPlay = () => {
      audio.play()
    }
    this.analyser = []
    this.analyser = new THREE.AudioAnalyser(audio, 512)

    this.dataArray = new Uint8Array()
  }

  update() {
    this.FrequencyData = this.analyser.getFrequencyData(this.dataArray)

    this.AverageFrequency = this.analyser.getAverageFrequency()
  }
}

class Canvas {
  constructor() {
    /************************/
    /*インタラクション用*/
    /************************/

    //スクロール量
    this.scrollY = 0
    //マウス座標
    this.mouse = new THREE.Vector2(0.5, 0.5)
    this.targetRadius = 0.05 // 半径の目標値
    //ウィンドウサイズ
    this.w = window.innerWidth
    this.h = window.innerHeight

    /************************/
    /*シーン設定*/
    /************************/

    // レンダラー
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    this.renderer.setSize(this.w, this.h) // 描画サイズ
    this.renderer.setPixelRatio(window.devicePixelRatio) // ピクセル比
    this.renderer.setClearColor(0xffffff)

    //#myCanvasにレンダラーのcanvasを追加
    const container = document.getElementById('myCanvas')
    container.appendChild(this.renderer.domElement)

    // カメラ
    /*js上の数値をpixelに変換する処理*/
    const fov = 60
    const fovRad = (fov / 2) * (Math.PI / 180)
    const dist = this.h / 2 / Math.tan(fovRad)
    /* */
    this.camera = new THREE.PerspectiveCamera(
      fov,
      this.w / this.h,
      1,
      dist * 10
    )
    this.camera.position.set(dist, dist * 1.5, dist)

    // シーン
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog(0xffffff, 500, 2000)

    // ライト
    this.pointLight = new THREE.DirectionalLight(0xffffff, 0.9)
    this.scene.add(this.pointLight)

    this.pointLight2 = new THREE.DirectionalLight(0xffffff, 1)
    this.pointLight2.position.set(500, 0, 500) // ライトの位置を設定
    this.pointLight2.rotation.set(Math.PI / 4, 0, 0)
    this.scene.add(this.pointLight2)

    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    )

    /************************/
    /*オブジェクト*/
    /************************/

    this.scene.add(this.plane)
    this.cubeList = []
    for (let j = 0; j < 16; j++) {
      this.cubeList[j] = []
      for (let i = 0; i < 16; i++) {
        this.cubeList[j][i] = new Cube(j, i, 50, 16)
        this.scene.add(this.cubeList[j][i])
      }
    }

    this.ground = new Ground()
    this.scene.add(this.ground)

    /************************/
    /*画面更新*/
    /************************/

    this.renderer.render(this.scene, this.camera)
    this.renderer.outputEncoding = THREE.sRGBEncoding

    const overlay = document.getElementById('overlay')
    const url = 'https://dl.dropbox.com/s/vyaqivm8x35zjq2/sound.m4a?dl=0'

    this.audio1 = new Audio(url)

    overlay.addEventListener('click', (e) => {
      overlay.remove()
      this.audio1.soundPlay()
      this.render()
    })
  }

  render() {
    requestAnimationFrame(() => {
      this.render()
    })

    // ミリ秒から秒に変換
    const sec = performance.now() / 1000
    this.audio1.update()

    //console.log(this.audio1.FrequencyData[255]);
    for (let j = 0; j < this.cubeList[0].length; j++) {
      for (let i = 0; i < this.cubeList[1].length; i++) {
        this.cubeList[j][i].update(this.audio1.FrequencyData[j * i], 50)
      }
    }
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  mouseMoved(x, y) {
    this.mouse.x = x / this.w // 原点を中心に持ってくる
    this.mouse.y = 1.0 - y / this.h // 軸を反転して原点を中心に持ってくる
  }

  scrolled(y) {
    this.scrollY = y
  }

  resized() {
    this.w = window.innerWidth
    this.h = window.innerHeight
    this.renderer.setSize(this.w, this.h)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.camera.aspect = this.w / this.h
    this.camera.updateProjectionMatrix()
  }
}

class Cube extends THREE.Mesh {
  constructor(j, i, size, length) {
    let margin = 75
    let scale = size * length + margin * length
    const geometry = new THREE.BoxGeometry(size, size, size)
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      metalness: 0,
    })
    super(geometry, material)
    this.position.set(j * margin - scale / 4, 0, i * margin - scale / 4)
  }
  update(FrequencyData, size) {
    this.material.color = new THREE.Color(
      'hsl(' + (FrequencyData / 256) * 360 + ', 100%, 40%)'
    )
    this.scale.y = Math.pow(FrequencyData / 128, 4) + 0.1
    this.position.y = (this.scale.y * size) / 2
  }
}

class Ground extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.PlaneGeometry(4000, 4000)
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      metalness: 0,
    })
    super(geometry, material)
    this.rotation.x = -Math.PI / 2
    this.position.set(0, 0, 0)
  }
  update() {}
}

//このクラス内に ページごとのcanvas外の処理を書いていきます
window.addEventListener('DOMContentLoaded', function () {
  const canvas = new Canvas()
  canvas.scrolled(window.scrollY)

  /************************/
  /*addEventListener*/
  /************************/

  window.addEventListener('mousemove', (e) => {
    canvas.mouseMoved(e.clientX, e.clientY)
  })

  window.addEventListener('scroll', (e) => {
    canvas.scrolled(window.scrollY)
  })

  window.addEventListener('resize', (e) => {
    canvas.resized()
  })
})
