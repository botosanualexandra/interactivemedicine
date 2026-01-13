
import React, { useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

function SolidColorMaterial(color) {
  return new THREE.MeshBasicMaterial({ color: color, side: THREE.FrontSide })
} 

export function MODEL_Sange(props) {
  const { animationSpeed = .1 } = props
  const { nodes, materials, animations } = useGLTF('./models/sangelesilimfa.glb')
  const group = React.useRef()
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    Object.values(materials).forEach(material => {
      if (material) {
        material.side = THREE.FrontSide
        material.needsUpdate = true
      }
    })
  }, [materials])
  
  // Play all animations when component mounts and control speed in real-time
  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((action) => {
        if (action) {
          action.timeScale = animationSpeed
          action.play()
        }
      })
    }
  }, [actions, animationSpeed])
  
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Top_Vein">
          <mesh name="BézierCurve007" geometry={nodes.BézierCurve007.geometry} material={materials.Blue} />
          <mesh name="BézierCurve007_1" geometry={nodes.BézierCurve007_1.geometry} material={SolidColorMaterial('#0e005a')} />
        </group>
        <mesh name="Limfa" geometry={nodes.Limfa.geometry} material={materials.M2} />
        <mesh name="Connecting_Veins" geometry={nodes.Connecting_Veins.geometry} material={materials.Gradient} />
        <group name="Bottom_Vein">
          <mesh name="BézierCurve015" geometry={nodes.BézierCurve015.geometry} material={materials.Red} />
          <mesh name="BézierCurve015_1" geometry={nodes.BézierCurve015_1.geometry} material={SolidColorMaterial('#790000')} />
        </group>
        <mesh name="particle005" geometry={nodes.particle005.geometry} material={materials.Red} position={[2.023, -0.35, 0.177]} rotation={[0.255, 0.302, 1.163]} scale={0.065} />
        <mesh name="particle006" geometry={nodes.particle006.geometry} material={materials.Red} position={[2.051, -0.11, 0.199]} rotation={[-2.697, -1.063, 1.492]} scale={0.065} />
        <mesh name="particle007" geometry={nodes.particle007.geometry} material={materials.Red} position={[1.843, -0.003, 0.298]} rotation={[-1.251, -0.012, 1.512]} scale={0.065} />
        <mesh name="particle008" geometry={nodes.particle008.geometry} material={materials.Red} position={[1.715, -0.038, 0.127]} rotation={[2.317, -1.2, 0.768]} scale={0.065} />
        <mesh name="particle009" geometry={nodes.particle009.geometry} material={materials.Red} position={[1.767, 0.072, 0.289]} rotation={[-2.773, -0.05, -2.001]} scale={0.065} />
        <mesh name="particle010" geometry={nodes.particle010.geometry} material={materials.Red} position={[1.488, 0.114, 0.242]} rotation={[-1.867, -0.934, 1.485]} scale={0.065} />
        <mesh name="particle011" geometry={nodes.particle011.geometry} material={materials.Red} position={[1.442, 0.251, 0.462]} rotation={[-1.332, -0.96, -0.031]} scale={0.065} />
        <mesh name="particle012" geometry={nodes.particle012.geometry} material={materials.Red} position={[1.426, 0.398, 0.487]} rotation={[-0.001, -0.025, -1.551]} scale={0.065} />
        <mesh name="particle013" geometry={nodes.particle013.geometry} material={materials.Red} position={[1.23, 0.498, 0.394]} rotation={[-1.068, -0.826, -1.37]} scale={0.065} />
        <mesh name="particle014" geometry={nodes.particle014.geometry} material={materials.Red} position={[1.143, 0.402, 0.388]} rotation={[2.765, 0.103, -2.656]} scale={0.065} />
        <mesh name="particle015" geometry={nodes.particle015.geometry} material={materials.Red} position={[1.008, 0.599, 0.49]} rotation={[-1.681, -0.669, -3.072]} scale={0.065} />
        <mesh name="particle016" geometry={nodes.particle016.geometry} material={materials.Red} position={[1.049, 0.565, 0.487]} rotation={[0.78, 0.462, 0.116]} scale={0.065} />
        <mesh name="particle017" geometry={nodes.particle017.geometry} material={materials.Red} position={[0.806, 0.68, 0.266]} rotation={[3.025, 0.968, 2.611]} scale={0.065} />
        <mesh name="particle018" geometry={nodes.particle018.geometry} material={materials.Red} position={[0.882, 0.765, 0.296]} rotation={[-0.925, 1.29, 1.568]} scale={0.065} />
        <mesh name="particle019" geometry={nodes.particle019.geometry} material={materials.Red} position={[0.599, 0.69, 0.335]} rotation={[-0.152, -1.149, -0.704]} scale={0.065} />
        <mesh name="particle020" geometry={nodes.particle020.geometry} material={materials.Red} position={[0.466, 0.834, 0.158]} rotation={[2.967, -0.313, 3.063]} scale={0.065} />
        <mesh name="particle021" geometry={nodes.particle021.geometry} material={materials.Red} position={[0.34, 0.84, 0.215]} rotation={[1.849, -1.282, 2.048]} scale={0.065} />
        <mesh name="particle022" geometry={nodes.particle022.geometry} material={materials.Red} position={[0.354, 0.869, -0.008]} rotation={[2.48, 0.389, -2.547]} scale={0.065} />
        <mesh name="particle023" geometry={nodes.particle023.geometry} material={materials.Red} position={[0.205, 0.969, 0.073]} rotation={[-2.832, -0.633, -2.422]} scale={0.065} />
        <mesh name="particle024" geometry={nodes.particle024.geometry} material={materials.Red} position={[0.118, 0.758, 0.034]} rotation={[-0.428, -0.427, 0.207]} scale={0.065} />
        <mesh name="particle025" geometry={nodes.particle025.geometry} material={materials.Red} position={[-0.103, 0.972, -0.083]} rotation={[1.883, 0.361, 2.864]} scale={0.065} />
        <mesh name="particle026" geometry={nodes.particle026.geometry} material={materials.Red} position={[-0.041, 1.007, -0.073]} rotation={[-2.104, 0.673, 2.946]} scale={0.065} />
        <mesh name="particle027" geometry={nodes.particle027.geometry} material={materials.Red} position={[-0.259, 1.077, -0.173]} rotation={[2.659, -0.852, -1.097]} scale={0.065} />
        <mesh name="particle028" geometry={nodes.particle028.geometry} material={materials.Red} position={[-0.43, 0.945, -0.225]} rotation={[0.25, 0.821, 0.38]} scale={0.065} />
        <mesh name="particle029" geometry={nodes.particle029.geometry} material={materials.Red} position={[-0.574, 1.083, -0.102]} rotation={[1.464, 0.428, 0.238]} scale={0.065} />
        <mesh name="particle030" geometry={nodes.particle030.geometry} material={materials.Red} position={[-0.605, 1.217, -0.165]} rotation={[-1.382, 0.234, 1.792]} scale={0.065} />
        <mesh name="particle031" geometry={nodes.particle031.geometry} material={materials.Red} position={[-0.635, 1.223, -0.172]} rotation={[-0.599, -0.545, -2.027]} scale={0.065} />
        <mesh name="particle032" geometry={nodes.particle032.geometry} material={materials.Red} position={[-0.775, 1.296, -0.229]} rotation={[-0.761, 0.049, -0.683]} scale={0.065} />
        <mesh name="particle033" geometry={nodes.particle033.geometry} material={materials.Red} position={[-0.897, 1.335, -0.259]} rotation={[-1.123, -1.327, -1.368]} scale={0.065} />
        <mesh name="particle034" geometry={nodes.particle034.geometry} material={materials.Red} position={[-1.187, 1.309, -0.236]} rotation={[-1.576, -0.875, 0.324]} scale={0.065} />
        <mesh name="particle035" geometry={nodes.particle035.geometry} material={materials.Red} position={[-1.181, 1.454, -0.237]} rotation={[-1.248, 0.643, -1.052]} scale={0.065} />
        <mesh name="particle036" geometry={nodes.particle036.geometry} material={materials.Red} position={[-1.238, 1.436, -0.274]} rotation={[1.758, 0.795, 0.867]} scale={0.065} />
        <mesh name="particle037" geometry={nodes.particle037.geometry} material={materials.Red} position={[-1.479, 1.313, -0.154]} rotation={[0.335, 0.568, -1.138]} scale={0.065} />
        <mesh name="particle038" geometry={nodes.particle038.geometry} material={materials.Red} position={[-1.581, 1.397, -0.06]} rotation={[-2.003, -0.255, -2.551]} scale={0.065} />
        <mesh name="particle039" geometry={nodes.particle039.geometry} material={materials.Red} position={[-1.625, 1.601, -0.092]} rotation={[0.974, -0.236, 1.394]} scale={0.065} />
        <mesh name="particle040" geometry={nodes.particle040.geometry} material={materials.Red} position={[-1.756, 1.437, -0.159]} rotation={[0.275, 0.553, -1.589]} scale={0.065} />
        <mesh name="particle041" geometry={nodes.particle041.geometry} material={materials.Red} position={[-1.802, 1.593, -0.024]} rotation={[0.753, -0.823, 1.141]} scale={0.065} />
        <mesh name="particle042" geometry={nodes.particle042.geometry} material={materials.Red} position={[-2.013, 1.564, -0.104]} rotation={[-2.051, 1.221, 1.802]} scale={0.065} />
        <mesh name="particle043" geometry={nodes.particle043.geometry} material={materials.Red} position={[-2.088, 1.646, 0.087]} rotation={[-0.119, -0.495, 1.364]} scale={0.065} />
        <mesh name="particle044" geometry={nodes.particle044.geometry} material={materials.Red} position={[-2.121, 1.482, 0.107]} rotation={[0, Math.PI / 8, 0]} scale={0.001} />
        <mesh name="particle045" geometry={nodes.particle045.geometry} material={materials.Red} position={[-2.193, 1.629, 0.1]} rotation={[0, 1.178, 1.233]} scale={0.001} />
        <mesh name="particle046" geometry={nodes.particle046.geometry} material={materials.Red} position={[-2.227, 1.433, 0.222]} rotation={[0, -1.178, -0.591]} scale={0.001} />
        <mesh name="particle047" geometry={nodes.particle047.geometry} material={materials.Red} position={[-2.149, 1.475, 0.221]} rotation={[0, -1.178, -0.591]} scale={0.001} />
        <mesh name="particle048" geometry={nodes.particle048.geometry} material={materials.Red} position={[-1.881, 1.427, -0.075]} rotation={[2.079, -0.758, 1.078]} scale={0.001} />
        <mesh name="particle049" geometry={nodes.particle049.geometry} material={materials.Red} position={[-1.971, 1.456, -0.102]} rotation={[1.286, 1.084, -2.077]} scale={0.001} />
        <mesh name="particle050" geometry={nodes.particle050.geometry} material={materials.Red} position={[-2.077, 1.55, -0.081]} rotation={[-1.304, 1.436, 1.384]} scale={0.001} />
        <mesh name="particle051" geometry={nodes.particle051.geometry} material={materials.Red} position={[-2.224, 1.47, 0.151]} rotation={[3.043, -0.283, 2.386]} scale={0.001} />
        <mesh name="particle052" geometry={nodes.particle052.geometry} material={materials.Red} position={[-2.234, 1.641, 0.151]} rotation={[-Math.PI, -1.178, -1.909]} scale={0.001} />
        <mesh name="particle053" geometry={nodes.particle053.geometry} material={materials.Red} position={[-2.158, 1.6, 0.187]} rotation={[0, -Math.PI / 8, 0.591]} scale={0.001} />
        <mesh name="particle054" geometry={nodes.particle054.geometry} material={materials.Red} position={[-1.884, 1.485, -0.162]} rotation={[-1.183, 0.963, 1.26]} scale={0.001} />
        <mesh name="particle055" geometry={nodes.particle055.geometry} material={materials.Red} position={[-1.944, 1.498, 0.1]} rotation={[0.137, -0.773, -0.071]} scale={0.001} />
        <mesh name="particle056" geometry={nodes.particle056.geometry} material={materials.Red} position={[-2.161, 1.457, 0.115]} rotation={[-2.955, -0.99, 2.961]} scale={0.001} />
        <mesh name="particle057" geometry={nodes.particle057.geometry} material={materials.Red} position={[-2.196, 1.4, 0.117]} rotation={[0.03, 0.36, -1.194]} scale={0.001} />
        <mesh name="particle058" geometry={nodes.particle058.geometry} material={materials.Red} position={[-2.335, 1.506, 0.171]} rotation={[Math.PI, -Math.PI / 8, Math.PI]} scale={0.001} />
        <mesh name="particle059" geometry={nodes.particle059.geometry} material={materials.Red} position={[-1.8, 1.504, 0.004]} rotation={[-0.561, -0.639, 0.247]} scale={0.001} />
        <mesh name="particle060" geometry={nodes.particle060.geometry} material={materials.Red} position={[-1.938, 1.635, -0.006]} rotation={[-0.172, -0.077, 1.295]} scale={0.001} />
        <mesh name="particle061" geometry={nodes.particle061.geometry} material={materials.Red} position={[-2.193, 1.472, -0.002]} rotation={[-2.563, 1.229, 1.884]} scale={0.001} />
        <mesh name="particle062" geometry={nodes.particle062.geometry} material={materials.Red} position={[-2.152, 1.616, 0.132]} rotation={[0, Math.PI / 8, 0.591]} scale={0.001} />
        <mesh name="particle063" geometry={nodes.particle063.geometry} material={materials.Red} position={[-2.117, 1.531, 0.118]} rotation={[0, Math.PI / 8, 0]} scale={0.001} />
        <mesh name="particle064" geometry={nodes.particle064.geometry} material={materials.Red} position={[-2.092, 1.443, -0.018]} rotation={[-2.991, -0.064, 1.906]} scale={0.001} />
        <mesh name="particle065" geometry={nodes.particle065.geometry} material={materials.Red} position={[-2.242, 1.574, 0.046]} rotation={[3.078, 0.23, -2.978]} scale={0.001} />
        <mesh name="particle066" geometry={nodes.particle066.geometry} material={materials.Red} position={[-2.212, 1.399, 0.14]} rotation={[0, -Math.PI / 8, -1.233]} scale={0.001} />
        <mesh name="particle067" geometry={nodes.particle067.geometry} material={materials.Red} position={[-2.109, 1.551, 0.14]} rotation={[0, -Math.PI / 8, 0]} scale={0.001} />
        <mesh name="particle068" geometry={nodes.particle068.geometry} material={materials.Red} position={[-2.079, 1.433, -0.009]} rotation={[2.817, 0.672, 2.316]} scale={0.001} />
        <mesh name="particle069" geometry={nodes.particle069.geometry} material={materials.Red} position={[-2.253, 1.523, 0.057]} rotation={[-2.953, 0.476, 2.986]} scale={0.001} />
        <mesh name="particle070" geometry={nodes.particle070.geometry} material={materials.Red} position={[-2.255, 1.599, 0.218]} rotation={[Math.PI, -1.178, -2.55]} scale={0.001} />
        <mesh name="particle071" geometry={nodes.particle071.geometry} material={materials.Red} position={[-2.192, 1.631, 0.107]} rotation={[0, Math.PI / 8, 1.233]} scale={0.001} />
        <mesh name="particle072" geometry={nodes.particle072.geometry} material={materials.Red} position={[-2.122, 1.568, 0.19]} rotation={[0.274, -0.98, 0.29]} scale={0.001} />
        <mesh name="particle073" geometry={nodes.particle073.geometry} material={materials.Red} position={[-2.132, 1.458, 0.121]} rotation={[0, Math.PI / 8, -0.591]} scale={0.001} />
        <mesh name="particle074" geometry={nodes.particle074.geometry} material={materials.Red} position={[-2.277, 1.631, 0.139]} rotation={[-Math.PI, -Math.PI / 8, -1.909]} scale={0.001} />
        <mesh name="particle075" geometry={nodes.particle075.geometry} material={materials.Red} position={[-2.091, 1.483, 0.146]} rotation={[-0.057, -0.342, -0.626]} scale={0.001} />
        <mesh name="particle076" geometry={nodes.particle076.geometry} material={materials.Red} position={[-2.12, 1.574, 0.136]} rotation={[0, Math.PI / 8, 0.591]} scale={0.001} />
        <mesh name="particle077" geometry={nodes.particle077.geometry} material={materials.Red} position={[-2.227, 1.475, 0.023]} rotation={[0, 1.178, -0.591]} scale={0.001} />
        <mesh name="particle078" geometry={nodes.particle078.geometry} material={materials.Red} position={[-2.322, 1.579, 0.167]} rotation={[-Math.PI, -Math.PI / 8, -2.55]} scale={0.001} />
        <mesh name="particle079" geometry={nodes.particle079.geometry} material={materials.Red} position={[-2.168, 1.507, 0.233]} rotation={[0, -1.178, 0]} scale={0.001} />
        <mesh name="particle080" geometry={nodes.particle080.geometry} material={materials.Red} position={[-1.002, 1.381, -0.156]} rotation={[-1.944, 0.769, 1.717]} scale={0.001} />
        <mesh name="particle081" geometry={nodes.particle081.geometry} material={materials.Red} position={[-1.168, 1.267, -0.102]} rotation={[-0.756, -0.325, 2.881]} scale={0.001} />
        <mesh name="particle082" geometry={nodes.particle082.geometry} material={materials.Red} position={[-1.209, 1.472, -0.206]} rotation={[1.751, 0.589, 1.833]} scale={0.001} />
        <mesh name="particle083" geometry={nodes.particle083.geometry} material={materials.Red} position={[-1.412, 1.447, -0.071]} rotation={[2.551, -0.29, -2.92]} scale={0.001} />
        <mesh name="particle084" geometry={nodes.particle084.geometry} material={materials.Red} position={[-1.427, 1.375, -0.142]} rotation={[-1.422, 0.585, 1.825]} scale={0.001} />
        <mesh name="particle085" geometry={nodes.particle085.geometry} material={materials.Red} position={[-1.555, 1.569, -0.166]} rotation={[-0.076, 0.224, 0.331]} scale={0.001} />
        <mesh name="particle086" geometry={nodes.particle086.geometry} material={materials.Red} position={[-1.711, 1.404, -0.129]} rotation={[-0.611, 0.755, 0.867]} scale={0.001} />
        <mesh name="particle087" geometry={nodes.particle087.geometry} material={materials.Red} position={[-1.929, 1.567, -0.155]} rotation={[2.56, 1.061, 2.899]} scale={0.001} />
        <mesh name="particle088" geometry={nodes.particle088.geometry} material={materials.Red} position={[-2.099, 1.543, 0.019]} rotation={[-3.094, -0.935, -2.975]} scale={0.001} />
        <mesh name="particle089" geometry={nodes.particle089.geometry} material={materials.Red} position={[-2.178, 1.462, 0.102]} rotation={[-2.971, -0.311, 2.856]} scale={0.001} />
        <mesh name="particle090" geometry={nodes.particle090.geometry} material={materials.Red} position={[-2.243, 1.412, 0.094]} rotation={[-3.089, 0.393, 1.899]} scale={0.001} />
        <mesh name="particle091" geometry={nodes.particle091.geometry} material={materials.Red} position={[-2.29, 1.596, 0.07]} rotation={[-Math.PI, 1.178, -2.55]} scale={0.001} />
        <mesh name="particle092" geometry={nodes.particle092.geometry} material={materials.Red} position={[-1.914, 1.565, 0.087]} rotation={[0.141, -0.174, 0.516]} scale={0.001} />
        <mesh name="particle093" geometry={nodes.particle093.geometry} material={materials.Red} position={[-2.04, 1.543, -0.028]} rotation={[0.035, 1.359, -0.254]} scale={0.001} />
        <mesh name="particle094" geometry={nodes.particle094.geometry} material={materials.Red} position={[-2.314, 1.484, 0.076]} rotation={[3.141, 0.416, -3.123]} scale={0.001} />
        <mesh name="particle095" geometry={nodes.particle095.geometry} material={materials.Red} position={[-2.172, 1.556, 0.235]} rotation={[0, -1.178, 0]} scale={0.001} />
        <mesh name="particle096" geometry={nodes.particle096.geometry} material={materials.Red} position={[-1.924, 1.535, -0.004]} rotation={[0.877, -1.043, 1.371]} scale={0.001} />
        <mesh name="particle097" geometry={nodes.particle097.geometry} material={materials.Red} position={[-1.957, 1.414, -0.016]} rotation={[-0.185, 0.023, -1.72]} scale={0.001} />
        <mesh name="particle098" geometry={nodes.particle098.geometry} material={materials.Red} position={[-1.982, 1.449, 0.019]} rotation={[0.169, 0.516, -0.304]} scale={0.001} />
        <mesh name="particle099" geometry={nodes.particle099.geometry} material={materials.Red} position={[-2.274, 1.518, 0.071]} rotation={[3.027, 0.508, -3.095]} scale={0.001} />
        <mesh name="particle100" geometry={nodes.particle100.geometry} material={materials.Red} position={[-2.255, 1.599, 0.218]} rotation={[Math.PI, -1.178, -2.55]} scale={0.001} />
        <mesh name="particle101" geometry={nodes.particle101.geometry} material={materials.Red} position={[-2.297, 1.596, 0.199]} rotation={[-Math.PI, -Math.PI / 8, -2.55]} scale={0.001} />
        <mesh name="particle102" geometry={nodes.particle102.geometry} material={materials.Red} position={[-1.937, 1.425, -0.035]} rotation={[-0.556, 0.765, -0.922]} scale={0.001} />
        <mesh name="particle103" geometry={nodes.particle103.geometry} material={materials.Red} position={[-1.998, 1.545, 0.121]} rotation={[-0.158, -0.675, -0.202]} scale={0.001} />
        <mesh name="particle104" geometry={nodes.particle104.geometry} material={materials.Red} position={[-2.255, 1.423, 0.083]} rotation={[-3.098, 0.333, 1.858]} scale={0.001} />
        <mesh name="particle105" geometry={nodes.particle105.geometry} material={materials.Red} position={[-2.172, 1.556, 0.235]} rotation={[0, -1.178, 0]} scale={0.001} />
        <mesh name="particle106" geometry={nodes.particle106.geometry} material={materials.Red} position={[-1.993, 1.465, -0.051]} rotation={[-2.747, -0.558, 2.064]} scale={0.001} />
        <mesh name="particle107" geometry={nodes.particle107.geometry} material={materials.Red} position={[-2.062, 1.652, -0.007]} rotation={[2.838, -0.023, -1.924]} scale={0.001} />
        <mesh name="particle108" geometry={nodes.particle108.geometry} material={materials.Red} position={[-2.083, 1.452, -0.001]} rotation={[0.717, 1.277, -1.324]} scale={0.001} />
        <mesh name="particle109" geometry={nodes.particle109.geometry} material={materials.Red} position={[-2.28, 1.58, 0.054]} rotation={[3.138, 1.181, -2.543]} scale={0.001} />
        <mesh name="particle110" geometry={nodes.particle110.geometry} material={materials.Red} position={[-2.129, 1.531, 0.088]} rotation={[0, Math.PI / 8, 0]} scale={0.001} />
        <mesh name="particle111" geometry={nodes.particle111.geometry} material={materials.Red} position={[-2.106, 1.42, 0.034]} rotation={[-0.316, 0.966, -1.096]} scale={0.001} />
        <mesh name="particle112" geometry={nodes.particle112.geometry} material={materials.Red} position={[-2.136, 1.553, 0.039]} rotation={[-0.087, 1.202, 0.079]} scale={0.001} />
        <mesh name="particle113" geometry={nodes.particle113.geometry} material={materials.Red} position={[-2.208, 1.531, 0.25]} rotation={[0, -1.178, 0]} scale={0.001} />
        <mesh name="particle114" geometry={nodes.particle114.geometry} material={materials.Red} position={[-2.181, 1.582, -0.009]} rotation={[-2.835, 0.582, -2.695]} scale={0.001} />
        <mesh name="particle115" geometry={nodes.particle115.geometry} material={materials.Red} position={[-2.294, 1.562, 0.174]} rotation={[3.086, -0.425, 3.075]} scale={0.001} />
        <mesh name="particle116" geometry={nodes.particle116.geometry} material={materials.Red} position={[-2.216, 1.399, 0.127]} rotation={[0, Math.PI / 8, -1.233]} scale={0.001} />
        <mesh name="particle117" geometry={nodes.particle117.geometry} material={materials.Red} position={[-2.007, 1.628, -0.01]} rotation={[0.049, 0.206, 0.887]} scale={0.001} />
        <mesh name="particle118" geometry={nodes.particle118.geometry} material={materials.Red} position={[-2.215, 1.632, 0.164]} rotation={[2.929, -1.138, -2.047]} scale={0.001} />
        <mesh name="particle119" geometry={nodes.particle119.geometry} material={materials.Red} position={[-2.324, 1.507, 0.199]} rotation={[Math.PI, -Math.PI / 8, Math.PI]} scale={0.001} />
        <mesh name="particle120" geometry={nodes.particle120.geometry} material={materials.Red} position={[-2.248, 1.624, 0.075]} rotation={[Math.PI, 1.178, -1.909]} scale={0.001} />
        <mesh name="particle121" geometry={nodes.particle121.geometry} material={materials.Red} position={[-2.155, 1.455, 0.072]} rotation={[0, Math.PI / 8, -0.591]} scale={0.001} />
        <mesh name="particle122" geometry={nodes.particle122.geometry} material={materials.Red} position={[-2.117, 1.474, 0.13]} rotation={[0, Math.PI / 8, -0.591]} scale={0.001} />
        <mesh name="particle123" geometry={nodes.particle123.geometry} material={materials.Red} position={[-2.192, 1.632, 0.119]} rotation={[0, Math.PI / 8, 1.233]} scale={0.001} />
        <mesh name="particle124" geometry={nodes.particle124.geometry} material={materials.Red} position={[-2.282, 1.56, 0.235]} rotation={[Math.PI, -1.178, -2.55]} scale={0.001} />
        <mesh name="particle125" geometry={nodes.particle125.geometry} material={materials.Red} position={[-2.16, 1.62, 0.156]} rotation={[0, -Math.PI / 8, 0.591]} scale={0.001} />
        <mesh name="particle126" geometry={nodes.particle126.geometry} material={materials.Red} position={[-2.227, 1.433, 0.222]} rotation={[0, -1.178, -0.591]} scale={0.001} />
        <mesh name="particle127" geometry={nodes.particle127.geometry} material={materials.Red} position={[-2.146, 1.475, 0.058]} rotation={[0, Math.PI / 8, -0.591]} scale={0.001} />
        <mesh name="particle128" geometry={nodes.particle128.geometry} material={materials.Red} position={[-2.315, 1.579, 0.092]} rotation={[Math.PI, Math.PI / 8, -2.55]} scale={0.001} />
        <mesh name="particle129" geometry={nodes.particle129.geometry} material={materials.Red} position={[-2.325, 1.58, 0.117]} rotation={[Math.PI, Math.PI / 8, -2.55]} scale={0.001} />
        <mesh name="particle130" geometry={nodes.particle130.geometry} material={materials.Red} position={[-2.248, 1.624, 0.075]} rotation={[Math.PI, 1.178, -1.909]} scale={0.001} />
        <mesh name="particle131" geometry={nodes.particle131.geometry} material={materials.Red} position={[-2.307, 1.527, 0.05]} rotation={[-Math.PI, 1.178, -Math.PI]} scale={0.001} />
        <mesh name="particle132" geometry={nodes.particle132.geometry} material={materials.Red} position={[-2.17, 1.616, 0.188]} rotation={[0, -Math.PI / 8, 0.591]} scale={0.001} />
        <mesh name="particle133" geometry={nodes.particle133.geometry} material={materials.Red} position={[-2.158, 1.6, 0.187]} rotation={[0, -Math.PI / 8, 0.591]} scale={0.001} />
        <mesh name="particle134" geometry={nodes.particle134.geometry} material={materials.Red} position={[-2.198, 1.482, 0.245]} rotation={[0, -1.178, 0]} scale={0.001} />
        <mesh name="particle135" geometry={nodes.particle135.geometry} material={materials.Red} position={[-2.257, 1.556, 0.247]} rotation={[Math.PI, -1.178, Math.PI]} scale={0.001} />
        <mesh name="particle136" geometry={nodes.particle136.geometry} material={materials.Red} position={[-2.311, 1.499, 0.224]} rotation={[Math.PI, -1.178, Math.PI]} scale={0.001} />
        <mesh name="particle137" geometry={nodes.particle137.geometry} material={materials.Red} position={[-2.109, 1.551, 0.14]} rotation={[0, -Math.PI / 8, 0]} scale={0.001} />
        <mesh name="particle205" geometry={nodes.particle205.geometry} material={materials.Red} position={[2.22, -1.111, -0.278]} rotation={[0.255, 0.302, 1.163]} scale={0.065} />
        <mesh name="particle206" geometry={nodes.particle206.geometry} material={materials.Red} position={[2.126, -0.895, -0.193]} rotation={[-2.697, -1.063, 1.492]} scale={0.065} />
        <mesh name="particle207" geometry={nodes.particle207.geometry} material={materials.Red} position={[2.012, -0.974, -0.045]} rotation={[-1.251, -0.012, 1.512]} scale={0.065} />
        <mesh name="particle208" geometry={nodes.particle208.geometry} material={materials.Red} position={[1.781, -1.007, -0.226]} rotation={[2.317, -1.2, 0.768]} scale={0.065} />
        <mesh name="particle209" geometry={nodes.particle209.geometry} material={materials.Red} position={[1.825, -0.913, -0.136]} rotation={[-2.773, -0.05, -2.001]} scale={0.065} />
        <mesh name="particle210" geometry={nodes.particle210.geometry} material={materials.Red} position={[1.551, -1.03, -0.19]} rotation={[-1.867, -0.934, 1.485]} scale={0.065} />
        <mesh name="particle211" geometry={nodes.particle211.geometry} material={materials.Red} position={[1.516, -1.02, -0.022]} rotation={[-1.332, -0.96, -0.031]} scale={0.065} />
        <mesh name="particle212" geometry={nodes.particle212.geometry} material={materials.Red} position={[1.405, -0.905, -0.008]} rotation={[-0.001, -0.025, -1.551]} scale={0.065} />
        <mesh name="particle213" geometry={nodes.particle213.geometry} material={materials.Red} position={[1.151, -0.896, -0.11]} rotation={[-1.068, -0.826, -1.37]} scale={0.065} />
        <mesh name="particle214" geometry={nodes.particle214.geometry} material={materials.Red} position={[1.125, -0.98, -0.236]} rotation={[2.765, 0.103, -2.656]} scale={0.065} />
        <mesh name="particle215" geometry={nodes.particle215.geometry} material={materials.Red} position={[1.007, -0.891, -0.099]} rotation={[-1.681, -0.669, -3.072]} scale={0.065} />
        <mesh name="particle216" geometry={nodes.particle216.geometry} material={materials.Red} position={[1.043, -0.845, -0.248]} rotation={[0.78, 0.462, 0.116]} scale={0.065} />
        <mesh name="particle217" geometry={nodes.particle217.geometry} material={materials.Red} position={[0.7, -0.847, -0.2]} rotation={[3.025, 0.968, 2.611]} scale={0.065} />
        <mesh name="particle218" geometry={nodes.particle218.geometry} material={materials.Red} position={[0.67, -0.693, -0.286]} rotation={[-0.925, 1.29, 1.568]} scale={0.065} />
        <mesh name="particle219" geometry={nodes.particle219.geometry} material={materials.Red} position={[0.668, -0.849, -0.157]} rotation={[-0.152, -1.149, -0.704]} scale={0.065} />
        <mesh name="particle220" geometry={nodes.particle220.geometry} material={materials.Red} position={[0.449, -0.781, -0.006]} rotation={[2.967, -0.313, 3.063]} scale={0.065} />
        <mesh name="particle221" geometry={nodes.particle221.geometry} material={materials.Red} position={[0.472, -0.769, 0.034]} rotation={[1.849, -1.282, 2.048]} scale={0.065} />
        <mesh name="particle222" geometry={nodes.particle222.geometry} material={materials.Red} position={[0.168, -0.767, 0.053]} rotation={[2.48, 0.389, -2.547]} scale={0.065} />
        <mesh name="particle223" geometry={nodes.particle223.geometry} material={materials.Red} position={[0.188, -0.675, 0.149]} rotation={[-2.832, -0.633, -2.422]} scale={0.065} />
        <mesh name="particle224" geometry={nodes.particle224.geometry} material={materials.Red} position={[0.133, -0.869, 0.079]} rotation={[-0.428, -0.427, 0.207]} scale={0.065} />
        <mesh name="particle225" geometry={nodes.particle225.geometry} material={materials.Red} position={[-0.077, -0.772, 0.306]} rotation={[1.883, 0.361, 2.864]} scale={0.065} />
        <mesh name="particle226" geometry={nodes.particle226.geometry} material={materials.Red} position={[-0.148, -0.676, 0.195]} rotation={[-2.104, 0.673, 2.946]} scale={0.065} />
        <mesh name="particle227" geometry={nodes.particle227.geometry} material={materials.Red} position={[-0.341, -0.712, 0.318]} rotation={[2.659, -0.852, -1.097]} scale={0.065} />
        <mesh name="particle228" geometry={nodes.particle228.geometry} material={materials.Red} position={[-0.44, -0.887, 0.29]} rotation={[0.25, 0.821, 0.38]} scale={0.065} />
        <mesh name="particle229" geometry={nodes.particle229.geometry} material={materials.Red} position={[-0.469, -0.808, 0.429]} rotation={[1.464, 0.428, 0.238]} scale={0.065} />
        <mesh name="particle230" geometry={nodes.particle230.geometry} material={materials.Red} position={[-0.636, -0.69, 0.397]} rotation={[-1.382, 0.234, 1.792]} scale={0.065} />
        <mesh name="particle231" geometry={nodes.particle231.geometry} material={materials.Red} position={[-0.694, -0.665, 0.325]} rotation={[-0.599, -0.545, -2.027]} scale={0.065} />
        <mesh name="particle232" geometry={nodes.particle232.geometry} material={materials.Red} position={[-0.867, -0.649, 0.315]} rotation={[-0.761, 0.049, -0.683]} scale={0.065} />
        <mesh name="particle233" geometry={nodes.particle233.geometry} material={materials.Red} position={[-0.999, -0.646, 0.283]} rotation={[-1.123, -1.327, -1.368]} scale={0.065} />
        <mesh name="particle234" geometry={nodes.particle234.geometry} material={materials.Red} position={[-1.185, -0.786, 0.343]} rotation={[-1.576, -0.875, 0.324]} scale={0.065} />
        <mesh name="particle235" geometry={nodes.particle235.geometry} material={materials.Red} position={[-1.258, -0.619, 0.291]} rotation={[-1.248, 0.643, -1.052]} scale={0.065} />
        <mesh name="particle236" geometry={nodes.particle236.geometry} material={materials.Red} position={[-1.327, -0.62, 0.178]} rotation={[1.758, 0.795, 0.867]} scale={0.065} />
        <mesh name="particle237" geometry={nodes.particle237.geometry} material={materials.Red} position={[-1.426, -0.814, 0.244]} rotation={[0.335, 0.568, -1.138]} scale={0.065} />
        <mesh name="particle238" geometry={nodes.particle238.geometry} material={materials.Red} position={[-1.519, -0.752, 0.293]} rotation={[-2.003, -0.255, -2.551]} scale={0.065} />
        <mesh name="particle239" geometry={nodes.particle239.geometry} material={materials.Red} position={[-1.648, -0.539, 0.228]} rotation={[0.974, -0.236, 1.394]} scale={0.065} />
        <mesh name="particle240" geometry={nodes.particle240.geometry} material={materials.Red} position={[-1.751, -0.692, 0.071]} rotation={[0.275, 0.553, -1.589]} scale={0.065} />
        <mesh name="particle241" geometry={nodes.particle241.geometry} material={materials.Red} position={[-1.803, -0.533, 0.138]} rotation={[0.753, -0.823, 1.141]} scale={0.065} />
        <mesh name="particle242" geometry={nodes.particle242.geometry} material={materials.Red} position={[-2.018, -0.558, -0.011]} rotation={[-2.051, 1.221, 1.802]} scale={0.065} />
        <mesh name="particle243" geometry={nodes.particle243.geometry} material={materials.Red} position={[-2.082, -0.454, 0.087]} rotation={[-0.119, -0.495, 1.364]} scale={0.065} />
        <mesh name="particle244" geometry={nodes.particle244.geometry} material={materials.Red} position={[-2.118, -0.584, 0.015]} rotation={[0, Math.PI / 8, 0]} scale={0.001} />
        <mesh name="particle245" geometry={nodes.particle245.geometry} material={materials.Red} position={[-2.191, -0.437, 0.008]} rotation={[0, 1.178, 1.233]} scale={0.001} />
        <mesh name="particle246" geometry={nodes.particle246.geometry} material={materials.Red} position={[2.228, -1.102, -0.13]} rotation={[2.564, 0.465, -0.427]} scale={0.001} />
        <mesh name="particle247" geometry={nodes.particle247.geometry} material={materials.Red} position={[2.266, -1.048, -0.157]} rotation={[-2.514, -0.747, -0.321]} scale={0.001} />
        <mesh name="particle248" geometry={nodes.particle248.geometry} material={materials.Red} position={[2.19, -1.132, -0.19]} rotation={[-0.222, 1.035, 0.526]} scale={0.001} />
        <mesh name="particle249" geometry={nodes.particle249.geometry} material={materials.Red} position={[2.131, -1.101, -0.25]} rotation={[-1.172, -0.979, 2.979]} scale={0.001} />
        <mesh name="particle250" geometry={nodes.particle250.geometry} material={materials.Red} position={[2.077, -1.008, -0.26]} rotation={[1.431, -1.213, 2.026]} scale={0.001} />
        <mesh name="particle251" geometry={nodes.particle251.geometry} material={materials.Red} position={[2.208, -1.094, -0.123]} rotation={[-1.715, 0.344, -1.366]} scale={0.001} />
        <mesh name="particle252" geometry={nodes.particle252.geometry} material={materials.Red} position={[2.196, -0.897, -0.179]} rotation={[-0.708, 0.003, -2.035]} scale={0.001} />
        <mesh name="particle253" geometry={nodes.particle253.geometry} material={materials.Red} position={[2.259, -0.926, -0.18]} rotation={[2.825, 0.779, -1.048]} scale={0.001} />
        <mesh name="particle254" geometry={nodes.particle254.geometry} material={materials.Red} position={[2.087, -1.053, -0.278]} rotation={[1.418, -1.354, 2.934]} scale={0.001} />
        <mesh name="particle255" geometry={nodes.particle255.geometry} material={materials.Red} position={[2.324, -1.051, -0.152]} rotation={[-1.499, -0.01, 2.208]} scale={0.001} />
        <mesh name="particle256" geometry={nodes.particle256.geometry} material={materials.Red} position={[2.187, -1.111, -0.129]} rotation={[1.946, -0.076, -0.827]} scale={0.001} />
        <mesh name="particle257" geometry={nodes.particle257.geometry} material={materials.Red} position={[2.193, -1.136, -0.213]} rotation={[1.827, 0.966, 1.078]} scale={0.001} />
        <mesh name="particle258" geometry={nodes.particle258.geometry} material={materials.Red} position={[2.072, -1.043, -0.115]} rotation={[-0.841, 0.804, -2.05]} scale={0.001} />
        <mesh name="particle259" geometry={nodes.particle259.geometry} material={materials.Red} position={[2.326, -1.013, -0.235]} rotation={[1.973, -0.784, -0.973]} scale={0.001} />
        <mesh name="particle260" geometry={nodes.particle260.geometry} material={materials.Red} position={[2.225, -0.903, -0.236]} rotation={[2.851, 0.011, -1.202]} scale={0.001} />
        <mesh name="particle261" geometry={nodes.particle261.geometry} material={materials.Red} position={[2.082, -1.086, -0.236]} rotation={[-2.916, -0.819, -1.462]} scale={0.001} />
        <mesh name="particle262" geometry={nodes.particle262.geometry} material={materials.Red} position={[2.285, -0.911, -0.241]} rotation={[2.507, -0.623, 0.714]} scale={0.001} />
        <mesh name="particle263" geometry={nodes.particle263.geometry} material={materials.Red} position={[2.295, -0.988, -0.271]} rotation={[2.508, 1.269, 0.085]} scale={0.001} />
        <mesh name="particle264" geometry={nodes.particle264.geometry} material={materials.Red} position={[2.127, -1.124, -0.209]} rotation={[0.057, 0.068, -1.861]} scale={0.001} />
        <mesh name="particle265" geometry={nodes.particle265.geometry} material={materials.Red} position={[2.044, -0.993, -0.166]} rotation={[-1.49, -0.175, 0.371]} scale={0.001} />
        <mesh name="particle266" geometry={nodes.particle266.geometry} material={materials.Red} position={[2.253, -1.133, -0.223]} rotation={[-0.989, -0.8, 0.703]} scale={0.001} />
        <mesh name="particle267" geometry={nodes.particle267.geometry} material={materials.Red} position={[2.3, -0.967, -0.251]} rotation={[-2.843, -0.013, -1.491]} scale={0.001} />
        <mesh name="particle268" geometry={nodes.particle268.geometry} material={materials.Red} position={[2.139, -1.128, -0.217]} rotation={[1.415, -1.042, -1.34]} scale={0.001} />
        <mesh name="particle269" geometry={nodes.particle269.geometry} material={materials.Red} position={[2.041, -1.041, -0.164]} rotation={[-0.115, -1.236, 1.992]} scale={0.001} />
        <mesh name="particle270" geometry={nodes.particle270.geometry} material={materials.Red} position={[2.218, -0.943, -0.115]} rotation={[-0.56, 0.036, -2.424]} scale={0.001} />
        <mesh name="particle271" geometry={nodes.particle271.geometry} material={materials.Red} position={[2.193, -0.9, -0.234]} rotation={[-2.872, 0.271, -1.014]} scale={0.001} />
        <mesh name="particle272" geometry={nodes.particle272.geometry} material={materials.Red} position={[2.221, -0.984, -0.091]} rotation={[-2.18, 0.861, -2.535]} scale={0.001} />
        <mesh name="particle273" geometry={nodes.particle273.geometry} material={materials.Red} position={[2.315, -1.063, -0.273]} rotation={[-1.51, 0.905, 2.923]} scale={0.001} />
        <mesh name="particle274" geometry={nodes.particle274.geometry} material={materials.Red} position={[2.149, -0.913, -0.171]} rotation={[1.733, -0.538, -0.122]} scale={0.001} />
        <mesh name="particle275" geometry={nodes.particle275.geometry} material={materials.Red} position={[2.292, -1.04, -0.224]} rotation={[2.535, 0.291, 1.097]} scale={0.001} />
        <mesh name="particle276" geometry={nodes.particle276.geometry} material={materials.Red} position={[2.243, -0.944, -0.238]} rotation={[-2.017, -0.559, 2.594]} scale={0.001} />
        <mesh name="particle277" geometry={nodes.particle277.geometry} material={materials.Red} position={[2.191, -1.059, -0.317]} rotation={[0.047, 0.531, 3.12]} scale={0.001} />
        <mesh name="particle278" geometry={nodes.particle278.geometry} material={materials.Red} position={[2.16, -0.973, -0.137]} rotation={[0.105, -0.537, -0.957]} scale={0.001} />
        <mesh name="particle279" geometry={nodes.particle279.geometry} material={materials.Red} position={[2.336, -1.023, -0.154]} rotation={[-2.253, 0.707, -2.454]} scale={0.001} />
        <mesh name="particle280" geometry={nodes.particle280.geometry} material={materials.Red} position={[2.27, -0.913, -0.154]} rotation={[3.06, 0.421, 2.826]} scale={0.001} />
        <mesh name="particle281" geometry={nodes.particle281.geometry} material={materials.Red} position={[2.337, -1.073, -0.18]} rotation={[-0.099, -0.159, 1.818]} scale={0.001} />
        <mesh name="particle282" geometry={nodes.particle282.geometry} material={materials.Red} position={[2.231, -0.895, -0.211]} rotation={[-2.699, 0.991, 1.476]} scale={0.001} />
        <mesh name="particle283" geometry={nodes.particle283.geometry} material={materials.Red} position={[2.305, -1.005, -0.119]} rotation={[1.149, 0.753, -1.439]} scale={0.001} />
        <mesh name="particle284" geometry={nodes.particle284.geometry} material={materials.Red} position={[2.322, -1.038, -0.289]} rotation={[-1.374, -1.011, -2.825]} scale={0.001} />
        <mesh name="particle285" geometry={nodes.particle285.geometry} material={materials.Red} position={[2.237, -0.903, -0.25]} rotation={[-1.61, -0.013, -1.537]} scale={0.001} />
        <mesh name="particle286" geometry={nodes.particle286.geometry} material={materials.Red} position={[2.271, -1.094, -0.298]} rotation={[0.405, 0.179, 2.924]} scale={0.001} />
        <mesh name="particle287" geometry={nodes.particle287.geometry} material={materials.Red} position={[2.121, -0.997, -0.246]} rotation={[0.509, 1.264, 1.991]} scale={0.001} />
        <mesh name="particle288" geometry={nodes.particle288.geometry} material={materials.Red} position={[2.16, -1.047, -0.134]} rotation={[-0.728, 0.872, 0.48]} scale={0.001} />
        <mesh name="particle289" geometry={nodes.particle289.geometry} material={materials.Red} position={[2.205, -1.109, -0.145]} rotation={[2.383, 0.572, 0.192]} scale={0.001} />
        <mesh name="particle290" geometry={nodes.particle290.geometry} material={materials.Red} position={[2.206, -1.131, -0.231]} rotation={[0.567, 0.038, 1.991]} scale={0.001} />
        <mesh name="particle291" geometry={nodes.particle291.geometry} material={materials.Red} position={[2.143, -0.949, -0.236]} rotation={[-1.98, -1.117, -1.447]} scale={0.001} />
        <mesh name="particle292" geometry={nodes.particle292.geometry} material={materials.Red} position={[2.346, -0.975, -0.18]} rotation={[-0.816, 0.136, -2.605]} scale={0.001} />
        <mesh name="particle293" geometry={nodes.particle293.geometry} material={materials.Red} position={[2.249, -0.995, -0.321]} rotation={[1.2, 0.127, 1.513]} scale={0.001} />
        <mesh name="particle294" geometry={nodes.particle294.geometry} material={materials.Red} position={[2.131, -1.068, -0.217]} rotation={[1.622, -0.469, 0.81]} scale={0.001} />
        <mesh name="particle295" geometry={nodes.particle295.geometry} material={materials.Red} position={[2.327, -0.975, -0.147]} rotation={[-2.075, 0.737, 0.091]} scale={0.001} />
        <mesh name="particle296" geometry={nodes.particle296.geometry} material={materials.Red} position={[2.206, -1.051, -0.098]} rotation={[-1.221, 0.447, 2.51]} scale={0.001} />
        <mesh name="particle297" geometry={nodes.particle297.geometry} material={materials.Red} position={[2.255, -1.139, -0.226]} rotation={[-1.498, 0.633, 2.046]} scale={0.001} />
        <mesh name="particle298" geometry={nodes.particle298.geometry} material={materials.Red} position={[2.305, -1.086, -0.274]} rotation={[-1.079, 0.793, -2.425]} scale={0.001} />
        <mesh name="particle299" geometry={nodes.particle299.geometry} material={materials.Red} position={[2.018, -1.04, -0.16]} rotation={[-0.3, -0.598, -1.558]} scale={0.001} />
        <mesh name="particle300" geometry={nodes.particle300.geometry} material={materials.Red} position={[2.009, -0.931, -0.074]} rotation={[-2.561, 0.63, 0.725]} scale={0.001} />
        <mesh name="particle301" geometry={nodes.particle301.geometry} material={materials.Red} position={[1.844, -0.93, -0.057]} rotation={[0.201, 0.316, -2.35]} scale={0.001} />
        <mesh name="particle302" geometry={nodes.particle302.geometry} material={materials.Red} position={[1.811, -1.083, -0.192]} rotation={[-2.858, -0.055, 0.46]} scale={0.001} />
        <mesh name="particle303" geometry={nodes.particle303.geometry} material={materials.Red} position={[1.761, -0.956, -0.087]} rotation={[-2.273, -0.121, -2.573]} scale={0.001} />
        <mesh name="particle304" geometry={nodes.particle304.geometry} material={materials.Red} position={[1.473, -1.062, -0.137]} rotation={[2.482, -1.427, -0.058]} scale={0.001} />
        <mesh name="particle305" geometry={nodes.particle305.geometry} material={materials.Red} position={[1.49, -0.904, -0.035]} rotation={[-2.508, -0.04, -1.518]} scale={0.001} />
        <mesh name="particle306" geometry={nodes.particle306.geometry} material={materials.Red} position={[1.215, -1.004, -0.124]} rotation={[-2.387, -0.935, 1.512]} scale={0.001} />
        <mesh name="particle307" geometry={nodes.particle307.geometry} material={materials.Red} position={[1.123, -0.784, -0.156]} rotation={[2.135, -0.662, -2.317]} scale={0.001} />
        <mesh name="particle308" geometry={nodes.particle308.geometry} material={materials.Red} position={[1.112, -0.944, -0.265]} rotation={[1.977, 0.615, -2.643]} scale={0.001} />
        <mesh name="particle309" geometry={nodes.particle309.geometry} material={materials.Red} position={[0.907, -0.766, -0.299]} rotation={[1.518, 1.171, -0.271]} scale={0.001} />
        <mesh name="particle310" geometry={nodes.particle310.geometry} material={materials.Red} position={[0.932, -0.791, -0.307]} rotation={[0.286, 0.229, 0.501]} scale={0.001} />
        <mesh name="particle311" geometry={nodes.particle311.geometry} material={materials.Red} position={[0.727, -0.9, -0.259]} rotation={[-0.404, 0.879, -1.082]} scale={0.001} />
        <mesh name="particle312" geometry={nodes.particle312.geometry} material={materials.Red} position={[0.623, -0.729, -0.3]} rotation={[-0.401, 1.252, 0.368]} scale={0.001} />
        <mesh name="particle313" geometry={nodes.particle313.geometry} material={materials.Red} position={[0.604, -0.759, -0.069]} rotation={[0.209, -1.146, 0.15]} scale={0.001} />
        <mesh name="particle314" geometry={nodes.particle314.geometry} material={materials.Red} position={[0.307, -0.753, -0.015]} rotation={[2.865, 0.159, -2.475]} scale={0.001} />
        <mesh name="particle315" geometry={nodes.particle315.geometry} material={materials.Red} position={[0.3, -0.764, 0.123]} rotation={[-2.806, -0.035, -2.696]} scale={0.001} />
        <mesh name="particle316" geometry={nodes.particle316.geometry} material={materials.Red} position={[0.239, -0.894, 0.037]} rotation={[0.402, 1.046, -1.015]} scale={0.001} />
        <mesh name="particle317" geometry={nodes.particle317.geometry} material={materials.Red} position={[0.105, -0.677, 0.071]} rotation={[0.337, 0.898, -0.596]} scale={0.001} />
        <mesh name="particle318" geometry={nodes.particle318.geometry} material={materials.Red} position={[0, -0.692, 0.261]} rotation={[-0.99, -0.672, -0.728]} scale={0.001} />
        <mesh name="particle319" geometry={nodes.particle319.geometry} material={materials.Red} position={[-0.144, -0.821, 0.328]} rotation={[-1.51, -0.04, -2.422]} scale={0.001} />
        <mesh name="particle320" geometry={nodes.particle320.geometry} material={materials.Red} position={[-0.284, -0.693, 0.228]} rotation={[-2.479, 0.651, -0.656]} scale={0.001} />
        <mesh name="particle321" geometry={nodes.particle321.geometry} material={materials.Red} position={[-0.289, -0.841, 0.194]} rotation={[2.536, -1.457, 1.094]} scale={0.001} />
        <mesh name="particle322" geometry={nodes.particle322.geometry} material={materials.Red} position={[-0.346, -0.816, 0.258]} rotation={[1.889, -0.871, 1.725]} scale={0.001} />
        <mesh name="particle323" geometry={nodes.particle323.geometry} material={materials.Red} position={[-0.558, -0.674, 0.302]} rotation={[-0.953, -0.828, -2.857]} scale={0.001} />
        <mesh name="particle324" geometry={nodes.particle324.geometry} material={materials.Red} position={[-0.721, -0.75, 0.439]} rotation={[-1.221, -0.156, 1.84]} scale={0.001} />
        <mesh name="particle325" geometry={nodes.particle325.geometry} material={materials.Red} position={[-0.747, -0.667, 0.332]} rotation={[-0.94, 0.101, -2.721]} scale={0.001} />
        <mesh name="particle326" geometry={nodes.particle326.geometry} material={materials.Red} position={[-0.904, -0.848, 0.399]} rotation={[-3.129, -0.198, -1.004]} scale={0.001} />
        <mesh name="particle327" geometry={nodes.particle327.geometry} material={materials.Red} position={[-0.972, -0.786, 0.213]} rotation={[2.204, -0.449, 1.31]} scale={0.001} />
        <mesh name="particle328" geometry={nodes.particle328.geometry} material={materials.Red} position={[-1.257, -0.676, 0.253]} rotation={[-1.693, 0.336, 0.994]} scale={0.001} />
        <mesh name="particle329" geometry={nodes.particle329.geometry} material={materials.Red} position={[-1.38, -0.658, 0.257]} rotation={[2.084, 0.487, 2.262]} scale={0.001} />
        <mesh name="particle330" geometry={nodes.particle330.geometry} material={materials.Red} position={[-1.423, -0.593, 0.187]} rotation={[0.091, 0.365, 0.053]} scale={0.001} />
        <mesh name="particle331" geometry={nodes.particle331.geometry} material={materials.Red} position={[-1.595, -0.672, 0.141]} rotation={[-1.664, -0.065, 2.086]} scale={0.001} />
        <mesh name="particle332" geometry={nodes.particle332.geometry} material={materials.Red} position={[-1.568, -0.561, 0.246]} rotation={[-1.571, -0.775, -0.08]} scale={0.001} />
        <mesh name="particle333" geometry={nodes.particle333.geometry} material={materials.Red} position={[-1.671, -0.557, 0.219]} rotation={[0.13, 0.49, 1.225]} scale={0.001} />
        <mesh name="particle334" geometry={nodes.particle334.geometry} material={materials.Red} position={[-1.822, -0.655, 0.251]} rotation={[-1.604, -0.882, -1.194]} scale={0.001} />
        <mesh name="particle335" geometry={nodes.particle335.geometry} material={materials.Red} position={[-1.997, -0.56, 0.224]} rotation={[-3.037, -0.9, 2.73]} scale={0.001} />
        <mesh name="particle336" geometry={nodes.particle336.geometry} material={materials.Red} position={[-2.166, -0.595, 0.172]} rotation={[2.34, -1.145, 2.464]} scale={0.001} />
        <mesh name="particle337" geometry={nodes.particle337.geometry} material={materials.Red} position={[-2.078, -0.52, 0.057]} rotation={[-0.041, -0.34, -0.01]} scale={0.001} />
      </group>
    </group>
  )
}

useGLTF.preload('./models/sangelesilimfa.glb')

export default MODEL_Sange
