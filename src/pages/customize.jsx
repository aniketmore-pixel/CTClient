import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useNavigate } from 'react-router-dom';

const Customize = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const modelRef = useRef(null);
    const controlsRef = useRef(null); // Reference for orbit controls
    const fileInputRef = useRef(null); // Reference for file input
    const navigate = useNavigate();

    const [frontTexture, setFrontTexture] = useState(null);
    const [backTexture, setBackTexture] = useState(null);
    const [showArtCategories, setShowArtCategories] = useState(false);
    const [showDesigns, setShowDesigns] = useState(false);

    const [tshirtData, setTshirtData] = useState({
        front: { text: '', font: '', color: '', position: 0, imageSrc: '' },
        back: { text: '', font: '', color: '', position: 0, imageSrc: '' },
    });

    function handleBuy() {
        navigate("/buyCustom");
    }

    function redirectToSubmit() {
        navigate("/submit-design");
    }

    useEffect(() => {
        sceneRef.current = new THREE.Scene();

        try {
            rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
            rendererRef.current.setSize(window.innerWidth - 320, window.innerHeight);
            rendererRef.current.setClearColor(0xeeeeee);
            mountRef.current.appendChild(rendererRef.current.domElement);
        } catch (error) {
            console.error('Error creating WebGLRenderer:', error);
            return; // Exit if we can't create the renderer
        }

        cameraRef.current = new THREE.PerspectiveCamera(75, (window.innerWidth - 320) / window.innerHeight, 0.1, 1000);
        cameraRef.current.position.set(0, 8, 25);

        controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement); // Initialize orbit controls
        controlsRef.current.enableDamping = true; // Enable smooth damping
        controlsRef.current.dampingFactor = 0.25; // Set damping factor

        // Limit rotation to only x-axis
        controlsRef.current.maxPolarAngle = Math.PI / 4; // Limit max to 45 degrees
        controlsRef.current.minPolarAngle = Math.PI / 2.5; // Keep at 45 degrees to avoid going lower

        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        sceneRef.current.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(5, 10, 5);
        sceneRef.current.add(directionalLight);

        const loader = new GLTFLoader();
        loader.load(
            '/Tshirt_02_N.glb',
            (gltf) => {
                modelRef.current = gltf.scene;
                modelRef.current.scale.set(0.9, 0.9, 0.9);
                modelRef.current.position.set(0, -12, 0);
                sceneRef.current.add(modelRef.current);
            },
            undefined,
            (error) => console.error('Error loading model:', error)
        );

        const animate = () => {
            requestAnimationFrame(animate);
            controlsRef.current.update(); // Update controls in the animation loop
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };

        animate();

        return () => {
            mountRef.current?.removeChild(rendererRef.current.domElement);
            rendererRef.current.dispose();
        };
    }, []);

    const handleColorChange = (color) => {
        if (modelRef.current) {
            modelRef.current.traverse((child) => {
                if (child.isMesh) {
                    child.material.color.set(color);
                }
            });
        }
    };

    const handleAddText = (yOffset) => {
        const userText = document.getElementById('userText').value;
        const side = document.getElementById('textSideSelection').value;
        const selectedFont = document.getElementById('fontSelection').value;
        const selectedTextColor = '#000000';

        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 800;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = selectedTextColor;
        context.font = `bold 100px ${selectedFont}`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(userText, canvas.width / 2, canvas.height / yOffset);

        const textTexture = new THREE.CanvasTexture(canvas);
        textTexture.wrapS = THREE.ClampToEdgeWrapping;
        textTexture.wrapT = THREE.RepeatWrapping;

        if (side === 'front') {
            setFrontTexture(textTexture);
            applyTexture(textTexture, 'Front');
            setTshirtData(prev => ({ ...prev, front: { ...prev.front, text: userText, font: selectedFont, color: selectedTextColor, position: yOffset } }));
        } else {
            setBackTexture(textTexture);
            applyTexture(textTexture, 'Back');
            setTshirtData(prev => ({ ...prev, back: { ...prev.back, text: userText, font: selectedFont, color: selectedTextColor, position: yOffset } }));
        }
    };

    const applyTexture = (texture, side) => {
        if (modelRef.current) {
            modelRef.current.traverse((child) => {
                if (child.isMesh && child.material.name === side) {
                    child.material.map = texture;
                    child.material.needsUpdate = true;
                }
            });
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const side = document.getElementById('sideSelection').value;

        if (!file) return alert('Please select an image file');

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const texture = new THREE.Texture(img);
                texture.needsUpdate = true;
                if (side === 'front') {
                    setFrontTexture(texture);
                    applyTexture(texture, 'Front');
                    setTshirtData(prev => ({ ...prev, front: { ...prev.front, imageSrc: e.target.result } }));
                } else {
                    setBackTexture(texture);
                    applyTexture(texture, 'Back');
                    setTshirtData(prev => ({ ...prev, back: { ...prev.back, imageSrc: e.target.result } }));
                }
            };
        };
        reader.readAsDataURL(file);
    };

    // Function to trigger file input click
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Function to take a screenshot of the model
    const takeScreenshot = (view) => {
        if (!rendererRef.current) return;

        // Set camera position based on view
        if (view === 'front') {
            cameraRef.current.position.set(0, 0, 25); // Front view
        } else if (view === 'back') {
            cameraRef.current.position.set(0, -3, -25); // Back view
        }

        cameraRef.current.lookAt(0, 0, 20); // Look at the model
        rendererRef.current.render(sceneRef.current, cameraRef.current);

        const dataURL = rendererRef.current.domElement.toDataURL(); // Get the image data URL
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `${view}_view.png`; // Set the filename
        link.click(); // Trigger download


    };

    const handleAddToCart = () => {
        takeScreenshot('front');
        takeScreenshot('back');
    };


    return (
        <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
            <div style={{ width: '300px', backgroundColor: '#ffffff', padding: '20px', boxShadow: '2px 0 5px rgba(0,0,0,0.1)', overflowY: 'auto', position: 'absolute' }}>
                <h1
                    style={{
                        fontWeight: 'bold', // Makes the text bold
                        fontSize: '2.3rem', // Adjusts the size for readability
                        color: '#333', // Sets a dark gray color for better contrast
                        textAlign: 'center', // Centers the text
                        margin: '7px 0', // Adds some vertical spacing
                        lineHeight: '1.2' // Improves line height for readability
                    }}
                >
                    Create Your Design
                </h1>


                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontWeight: 'bold' }}>Color</h3>

                    <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                        {['#ff0000', '#964B00', '#ADD8E6', '#ffff00', '#5f5f5f'].map(color => (
                            <button key={color} onClick={() => handleColorChange(color)} style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: color, cursor: 'pointer' }} />
                        ))}
                    </div>
                    <button
                        onClick={() => handleColorChange('#ffffff')}
                        style={{
                            padding: '5px 10px', // Adjust padding as needed
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: '#ffffff', // White background
                            color: '#000000', // Black text
                            border: '1px solid #000000', // Black border
                            cursor: 'pointer'
                        }}
                    >
                        Reset to Default (WHITE)
                    </button>

                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontWeight: 'bold' }}>Add Text</h3>
                    <input type="text" id="userText" placeholder="Enter text here" style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px' }} />
                    <select
                        id="textSideSelection"
                        style={{
                            width: '40%',
                            padding: '8px',
                            marginBottom: '10px',
                            marginRight: '52px',
                            borderRadius: '12px',
                            border: '1px solid black' // Added black border
                        }}
                    >
                        <option value="front">Front</option>
                        <option value="back">Back</option>
                    </select>

                    <select
                        id="fontSelection"
                        style={{
                            width: '40%',
                            padding: '8px',
                            marginBottom: '10px',
                            borderRadius: '12px',
                            border: '1px solid black' // Added black border
                        }}
                    >
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Georgia">Georgia</option>
                    </select>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button
                            onClick={() => handleAddText(3)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '4px',
                                backgroundColor: '#ffffff',
                                color: '#000000',
                                border: '1px solid #000000',
                                cursor: 'pointer'
                            }}
                        >
                            Add to Chest
                        </button>


                        <button
                            onClick={() => handleAddText(2.1)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '4px',
                                backgroundColor: '#ffffff',
                                color: '#000000',
                                border: '1px solid #000000',
                                cursor: 'pointer'
                            }}
                        >
                            Add to Middle
                        </button>
                        <button
                            onClick={() => handleAddText(1.5)}
                            style={{
                                padding: '8px 16px', // Smaller padding for smaller buttons
                                borderRadius: '4px',
                                backgroundColor: '#ffffff', // White background
                                color: '#000000', // Black text
                                border: '1px solid #000000', // Black outline
                                cursor: 'pointer'
                            }}
                        >
                            Add to Stomach
                        </button>
                    </div>

                </div>

                <div style={{ marginBottom: '20px' }}>

                    <button onClick={triggerFileInput}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            backgroundColor: 'black',
                            marginBottom: '20px',
                            color: 'white',
                            fontWeight: 700,
                            border: '1px solid #000000',
                            cursor: 'pointer'
                        }}
                    >
                        Upload Image
                    </button>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} ref={fileInputRef} />
                    <select
                        id="sideSelection"
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginBottom: '3px',
                            borderRadius: '12px',
                            border: '1px solid black' // Added black border
                        }}
                    >
                        <option value="front">Front</option>
                        <option value="back">Back</option>
                    </select>

                </div>

                <div>
                    <button
                        onClick={() => {
                            handleAddToCart();
                            redirectToSubmit(); // Call the new function
                        }}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            backgroundColor: '#000000', // Changed to black
                            color: '#ffffff', // Text color remains white
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 700,
                        }}
                    >
                        Proceed to Submit
                    </button>

                </div>





                <div>
                    {showArtCategories && (
                        <div>
                            <button onClick={() => setShowDesigns(!showDesigns)}>Toggle Designs</button>
                            {showDesigns && <p>Designs shown here...</p>}
                        </div>
                    )}
                </div>
            </div>

            <div ref={mountRef} style={{ flex: 1, backgroundColor: '#e0e0e0', height: '100vh', marginLeft: '300px' }} />
        </div>
    );
};

export default Customize;