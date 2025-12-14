import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const RetroGridBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x100020); // Deep purple/black
    scene.fog = new THREE.FogExp2(0x100020, 0.15); // Fog to hide horizon

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;
    camera.position.y = 0.8; 
    camera.rotation.x = -0.2; 

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // Grid
    const gridSize = 100;
    const gridDivisions = 40;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0xff00ff, 0x440066); // Neon Pink center, Dark Purple lines
    scene.add(gridHelper);

    // Stars (Particles)
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const starPositions = new Float32Array(starCount * 3);
    
    for(let i=0; i<starCount * 3; i++) {
        starPositions[i] = (Math.random() - 0.5) * 100; // Spread stars
        if (i % 3 === 1) starPositions[i] = Math.abs(starPositions[i]) + 2; // Keep stars above ground (y > 0)
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Move grid towards camera
      const speed = 0.15;
      const gridCellSize = gridSize / gridDivisions;
      
      gridHelper.position.z += speed;
      if (gridHelper.position.z >= gridCellSize) {
        gridHelper.position.z = 0;
      }
      
      // Rotate stars slightly
      stars.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, width: '100%', height: '100%' }} />;
};

export default RetroGridBackground;
