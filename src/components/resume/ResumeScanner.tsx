import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Upload, CheckCircle2, AlertTriangle, Scan } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ExtractedData {
  name: string;
  email: string;
  phone: string;
  education: { degree: string; institution: string; year: string }[];
  experience: { title: string; company: string; duration: string; description: string }[];
  skills: string[];
}

const ResumeScanner = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cameraActive) {
      const videoElement = document.getElementById('user-camera') as HTMLVideoElement;
      if (videoElement) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            videoElement.srcObject = stream;
          })
          .catch(err => {
            console.error("Error accessing camera:", err);
            setCameraActive(false);
            toast.error("Could not access camera. Please check permissions.");
          });
      }
    }
  }, [cameraActive]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(selectedFile.type)) {
        setErrorMessage('Please upload a PDF or Word document');
        setFile(null);
        return;
      }
      
      // Check file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrorMessage('File size exceeds 5MB limit');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setErrorMessage(null);
    }
  };

  const scanResume = () => {
    if (!file) return;
    
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setScanComplete(true);
            // Mock extracted data
            setExtractedData({
              name: "John Smith",
              email: "john.smith@example.com",
              phone: "(555) 123-4567",
              education: [
                { degree: "Bachelor of Computer Science", institution: "Stanford University", year: "2020" },
                { degree: "Master of Software Engineering", institution: "MIT", year: "2022" }
              ],
              experience: [
                { 
                  title: "Software Engineer", 
                  company: "TechCorp", 
                  duration: "2022-2024",
                  description: "Developed scalable web applications using React and Node.js" 
                },
                { 
                  title: "Frontend Developer", 
                  company: "WebSolutions", 
                  duration: "2020-2022",
                  description: "Created responsive user interfaces and optimized website performance" 
                }
              ],
              skills: ["JavaScript", "TypeScript", "React", "Node.js", "GraphQL", "AWS", "CI/CD", "Agile"]
            });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const saveToSupabase = async () => {
    if (!extractedData) return;
    
    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert([
          { 
            name: extractedData.name,
            email: extractedData.email,
            phone: extractedData.phone,
            education: extractedData.education,
            experience: extractedData.experience,
            skills: extractedData.skills,
            status: 'new'
          }
        ]);
      
      if (error) throw error;
      
      toast.success("Resume saved to database successfully!");
    } catch (error) {
      console.error("Error saving to database:", error);
      toast.error("Failed to save resume to database. Please try again.");
    }
  };

  const resetScanner = () => {
    setFile(null);
    setScanComplete(false);
    setExtractedData(null);
    setScanProgress(0);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Scan className="mr-2 h-5 w-5" />
          Resume Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {errorMessage}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {!file && !scanComplete && (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Resume</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Upload your resume in PDF or Word format (max 5MB)
            </p>
            <label htmlFor="resume-upload">
              <Button className="cursor-pointer">
                Select File
              </Button>
              <input
                ref={fileInputRef}
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}

        {file && !scanComplete && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB - {file.type}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={resetScanner}>
                Remove
              </Button>
            </div>

            <Button 
              className="w-full" 
              disabled={isScanning}
              onClick={scanResume}
            >
              {isScanning ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Scanning Resume...
                </>
              ) : (
                'Start Scanning'
              )}
            </Button>

            {isScanning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing resume contents...</span>
                  <span>{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2" />
              </div>
            )}
          </div>
        )}

        {scanComplete && extractedData && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-primary mr-2" />
                <div>
                  <p className="font-medium">{file?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Scan completed
                  </p>
                </div>
              </div>
              <div className="bg-emerald-100 text-emerald-800 py-1 px-2 rounded-full text-xs flex items-center">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Processed
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">{extractedData.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Email:</span> {extractedData.email}
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Phone:</span> {extractedData.phone}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-base mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {extractedData.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-muted px-2 py-1 rounded-md text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-base mb-2">Experience</h3>
                <div className="space-y-3">
                  {extractedData.experience.map((exp, index) => (
                    <div key={index} className="bg-muted/30 rounded-lg p-3">
                      <p className="font-medium">{exp.title}</p>
                      <p className="text-sm">{exp.company} | {exp.duration}</p>
                      <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-base mb-2">Education</h3>
                <div className="space-y-3">
                  {extractedData.education.map((edu, index) => (
                    <div key={index} className="bg-muted/30 rounded-lg p-3">
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-sm">{edu.institution} | {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="flex-1" onClick={saveToSupabase}>
                Save to Database
              </Button>
              <Button variant="outline" onClick={resetScanner} className="flex-1">
                Scan Another Resume
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeScanner;
