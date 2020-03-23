import * as THREE from 'three'

let clock = {
    // Le groupe dans lequel tous les mesh doivent être ajouter
    sceneGroup:new THREE.Group(),
    cube:new THREE.Mesh(
        new THREE.BoxGeometry(0.2,0.2,0.2),
        new THREE.MeshBasicMaterial({color:0x55f888})
    ),
    init:function(){
        // Ajouter ici tous les mesh créés au groupe
        this.sceneGroup.add(this.cube)
        // On retourne l'ensemble de la scène
        return this.sceneGroup
    }
}

export default clock