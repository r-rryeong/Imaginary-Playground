/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export function Model(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/Whale.gltf')
  const { actions } = useAnimations(animations, group)
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="WhaleArmature">
          <primitive object={nodes.Bone} />
          <primitive object={nodes.Bone001} />
          <primitive object={nodes.Bone006} />
          <primitive object={nodes.Bone007} />
          <primitive object={nodes.Bone010} />
          <primitive object={nodes.Bone011} />
          <skinnedMesh name="Whale" geometry={nodes.Whale.geometry} material={materials.Whale} skeleton={nodes.Whale.skeleton} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/Whale.gltf')
