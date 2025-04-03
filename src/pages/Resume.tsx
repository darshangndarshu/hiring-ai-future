
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import ResumeAnalysis from "@/components/resume/ResumeAnalysis";
import ResumeScanner from "@/components/resume/ResumeScanner";
import AIAssistant from "@/components/ai/AIAssistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Scan, Bot } from "lucide-react";

const Resume = () => {
  const [activeTab, setActiveTab] = useState("scanner");
  const animationContainerRef = useRef<HTMLDivElement>(null);

  // Initialize and animate 3D elements
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Dynamically import Three.js only on client side
      import('three').then((THREE) => {
        if (!animationContainerRef.current) return;
        
        // Create a scene
        const scene = new THREE.Scene();
        
        // Create a camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 350, 0.1, 1000);
        camera.position.z = 5;
        
        // Create a renderer with transparent background
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(350, 350);
        renderer.setClearColor(0x000000, 0);
        
        // Clear any existing canvas
        if (animationContainerRef.current.firstChild) {
          animationContainerRef.current.removeChild(animationContainerRef.current.firstChild);
        }
        
        animationContainerRef.current.appendChild(renderer.domElement);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Create document-like objects
        const documents = [];
        const colors = [0x4c7bfc, 0x38bdf8, 0x6366f1];
        
        for (let i = 0; i < 3; i++) {
          // Create a document mesh
          const docGeometry = new THREE.BoxGeometry(1.5, 2, 0.05);
          const docMaterial = new THREE.MeshPhongMaterial({ 
            color: colors[i % colors.length],
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
          });
          
          const document = new THREE.Mesh(docGeometry, docMaterial);
          
          // Position each document slightly offset
          document.position.x = (Math.random() - 0.5) * 2;
          document.position.y = (Math.random() - 0.5) * 2;
          document.position.z = i * 0.1;
          
          // Rotate slightly
          document.rotation.x = Math.random() * 0.2;
          document.rotation.y = Math.random() * 0.2;
          
          scene.add(document);
          documents.push({
            mesh: document,
            rotationSpeed: {
              x: (Math.random() - 0.5) * 0.01,
              y: (Math.random() - 0.5) * 0.01
            },
            floatSpeed: 0.005 + Math.random() * 0.005,
            floatOffset: Math.random() * Math.PI * 2
          });
        }
        
        // Animation function
        const animate = () => {
          requestAnimationFrame(animate);
          
          // Update each document
          const time = Date.now() * 0.001;
          
          documents.forEach(doc => {
            // Gentle floating motion
            doc.mesh.position.y += Math.sin(time * doc.floatSpeed + doc.floatOffset) * 0.003;
            
            // Slow rotation
            doc.mesh.rotation.x += doc.rotationSpeed.x;
            doc.mesh.rotation.y += doc.rotationSpeed.y;
          });
          
          renderer.render(scene, camera);
        };
        
        // Handle window resize
        const handleResize = () => {
          if (!animationContainerRef.current) return;
          
          camera.aspect = 350 / 350;
          camera.updateProjectionMatrix();
          renderer.setSize(350, 350);
        };
        
        window.addEventListener('resize', handleResize);
        animate();
        
        // Cleanup function
        return () => {
          window.removeEventListener('resize', handleResize);
          if (animationContainerRef.current) {
            if (animationContainerRef.current.contains(renderer.domElement)) {
              animationContainerRef.current.removeChild(renderer.domElement);
            }
          }
          
          // Dispose resources
          documents.forEach(doc => {
            doc.mesh.geometry.dispose();
            if (Array.isArray(doc.mesh.material)) {
              doc.mesh.material.forEach(material => material.dispose());
            } else {
              doc.mesh.material.dispose();
            }
          });
          
          renderer.dispose();
        };
      }).catch(error => {
        console.error("Error loading Three.js:", error);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Tools</h1>
              <p className="mt-1 text-sm text-gray-500">
                AI-powered resume scanning, verification and analysis
              </p>
            </div>
            
            {/* 3D Animation Container */}
            <div 
              ref={animationContainerRef} 
              className="w-[350px] h-[350px] mt-6 md:mt-0 flex items-center justify-center"
              style={{ transform: 'translateZ(0)' }}
            >
              {/* Three.js canvas will be inserted here */}
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="scanner" className="flex items-center gap-2">
                <Scan className="h-4 w-4" />
                <span>Scanner</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="assistant" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <span>AI Assistant</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="scanner" className="animate-in fade-in-50 zoom-in-95 duration-300">
              <ResumeScanner />
            </TabsContent>
            
            <TabsContent value="analysis" className="animate-in fade-in-50 zoom-in-95 duration-300">
              <ResumeAnalysis />
            </TabsContent>
            
            <TabsContent value="assistant" className="animate-in fade-in-50 zoom-in-95 duration-300">
              <AIAssistant />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Resume;
