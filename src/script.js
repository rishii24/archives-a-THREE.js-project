import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'

//Texture Loader
const textureLoader = new THREE.TextureLoader()

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Geometry // Object
const geometry = new THREE.PlaneBufferGeometry(1, 1.3)

// Materials

for (let index = 0; index < 11; index++) {
    const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load(`/images/${index}.jpg`)
    })

    // Mesh

    const img = new THREE.Mesh(geometry, material)
    img.position.set(Math.random(), index * -1.8)

    scene.add(img)
}

let imgobj = []
scene.traverse((object) => {
    if (object.isMesh)
        imgobj.push(object)
})




// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Mouse //to scroll or slide
window.addEventListener('wheel', onMouseWheel)

let y = 0
let position = 0

function onMouseWheel(event) {
    y = event.deltaY * 0.000999
}

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

/**
 * Animate
 */


const raycaster = new THREE.Raycaster()

const clock = new THREE.Clock()

const tick = () => {

    const elapsedTime = clock.getElapsedTime()

    // Update objects

    position += y
    y *= .4

    //Raycaster

    raycaster.setFromCamera(mouse, camera)
    const intersect = raycaster.intersectObjects(imgobj)

    for (const intersects of intersect) {
        gsap.to(intersects.object.scale, { x: 1.5, y: 1.5 })
        gsap.to(intersects.object.rotation, { y: -.2 })
        gsap.to(intersects.object.position, { z: -0.5 })

    }

    for (const object of imgobj) {
        if (!intersect.find(intersects => intersects.object === object)) {
            gsap.to(object.scale, { x: 1, y: 1 })
            gsap.to(object.rotation, { y: 0 })
            gsap.to(object.position, {z : 0 })

        }
    }

    camera.position.y = -position

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()