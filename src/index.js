import './style/main.styl'
import * as THREE from 'three'
import setUp from './three-scenes/setup.js'
import Container from './three-layout/Container.js'
import sunDial from './three-scenes/sundial.js'
import hourGlass from './three-scenes/hourglass.js'
import clock from './three-scenes/clock.js'
import {TweenLite} from 'gsap/all'
import * as dat from 'dat.gui';
import setup from './three-scenes/setup.js'

const gui = new dat.GUI();
const guiParams = {
    spotPosX:0,
    spotIntensity:0.8,
    spotBlur:Math.PI * 0.1,
    sunLX:-2,
    sunLintensity:0.4
}
gui.add(guiParams,'spotIntensity',0,5)
gui.add(guiParams,'spotPosX',-10,10)
gui.add(guiParams,'spotBlur',0,2)
gui.add(guiParams,'sunLX',-10,10)
gui.add(guiParams,'sunLintensity',0,2)


/**
 * Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xFFFFFF)
scene.fog = new THREE.Fog( scene.background, 1, 4 );

/**
 * Sizes
 */
const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight

/**
 * Resize
 */
window.addEventListener('resize', () =>
{ 
    // Update sizes object
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
})

/**
 * Camera
 */
const cameraWrapper = new THREE.Group()
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 1
cameraWrapper.position.y=0.2
cameraWrapper.rotation.x=-0.3
cameraWrapper.add(camera)
scene.add(cameraWrapper)
let mouse = {}
function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    camera.position.x=-(mouse.x/4)
    camera.position.y=-(mouse.y/4)
    camera.rotation.y=-(mouse.x/4)
    camera.rotation.x=(mouse.y/4)
}
window.addEventListener( 'mousemove', onMouseMove, false );

// Light & Ground setup
scene.add(setUp.init())

/**
 * Objects
 */
let slider = {
    curIndex:0,
    containerAray:[],
    sceneAray:[sunDial.init(),hourGlass.init(),clock.init()],
    sceneInfoDom:[
        document.querySelector('#title'),
        document.querySelector('#description'),
        document.querySelector('#howto')
    ],
    sceneData:[
        [
            "Le cadran solaire",
            "le cadran ect ect ect",
            "Bouger la souris sur l'écran pour faire bouger le soleil",
            {
                r:0.48,
                g:0.757,
                b:1
            }
        ],
        [
            "Sablier",
            "le sablier ect ect ect",
            " cliquez pour retourner le sablier",
            {
                r:0.8,
                g:0.5,
                b:0
            }
        ],
        [
            "Pendule",
            "le pendule ect ect ect",
            "remontez le pendule pour ect ect ect",
            {
                r:0.3,
                g:0.9,
                b:0.2
            }
        ]
    ],
    group:new THREE.Group(),
    settings:{
        width:2,
        height:1,
        depth:1,
        margin:2
    },

    setInfo : function() {
        this.sceneInfoDom.map((element , index) => {
            element.innerHTML=this.sceneData[this.curIndex][index]
        })
    },
    init : function() {
        for(let i=0;i<this.sceneAray.length;i++){
            this.containerAray.push(new Container(this.settings.width,this.settings.height,this.settings.depth,i*(this.settings.width+this.settings.margin)))
            this.containerAray[i].group.add(this.sceneAray[i])
            this.group.add(this.containerAray[i].group)
            scene.add(this.group)
        }
        this.handleNext()
        this.setInfo()
    },
    goTo: function(target) {
        if(target>=this.containerAray.length){
            target=0
        }
        TweenLite.to(
            this.group.position,
            2,
            {
                x:-(target*(this.settings.width+this.settings.margin)),
                ease:'Power3.easeInOut'
            }
        )
        TweenLite.to(
            setup.walls.rotation,
            2,
            {
                y:setup.walls.rotation.y+6.28319,
                ease:'Power3.easeInOut'
            }
        )
        TweenLite.to(
            this.containerAray[this.curIndex].group.rotation,
            2,
            {
                x:this.containerAray[this.curIndex].group.rotation.x-6.28319,
                ease:'Power3.easeInOut'
            }
        )
        var initial = new THREE.Color(setup.sunL.color.getHex())
        console.log(initial)
        console.log(target)
        TweenLite.to(
            initial,
            2,
            {
                r:this.sceneData[target][3].r,
                g:this.sceneData[target][3].g,
                b:this.sceneData[target][3].b,
            onUpdate:function(){
                setup.sunL.color=initial
                setup.ambiantL.color=initial
            }
            }
        )

        
        this.curIndex = target
        this.setInfo()
    },
    handleNext:function(){
        const btnNext = document.querySelector('#next-btn')
        btnNext.addEventListener('click',()=>{
            this.goTo(this.curIndex+1)
        }, false)
    }
}
slider.init()

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // options are THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

/**
 * Loop
 */
const loop = () =>
{
    setup.spotL
    //Update dat GUI testing variables
    setUp.spotL.intensity=guiParams.spotIntensity
    setUp.spotL.position.x=guiParams.spotPosX
    setUp.spotL.angle=guiParams.spotBlur
    setUp.sunL.position.x=guiParams.sunLX
    setUp.sunL.intensity=guiParams.sunLintensity

    window.requestAnimationFrame(loop)
    // Render
    renderer.render(scene, camera)
}

loop()