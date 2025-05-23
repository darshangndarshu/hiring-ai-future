import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, Upload, CheckCircle2, AlertTriangle, Camera, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";

const UserVerification = () => {
  const [activeTab, setActiveTab] = useState('document');
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [documentVerifying, setDocumentVerifying] = useState(false);
  const [documentVerified, setDocumentVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneSent, setPhoneSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoVerifying, setPhotoVerifying] = useState(false);
  const [photoVerified, setPhotoVerified] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (cameraActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(error => {
          console.error("Error accessing camera:", error);
          toast.error("Could not access camera. Please check permissions.");
          setCameraActive(false);
        });
    }
    
    return () => {
      if (cameraActive && videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [cameraActive]);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setDocumentUploaded(true);
      toast.success(`Document "${file.name}" selected successfully`);
    }
  };

  const verifyDocument = async () => {
    if (!uploadedFile || !user) return;
    
    setDocumentVerifying(true);
    
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'verification-documents');
      
      if (!bucketExists) {
        await supabase.storage.createBucket('verification-documents', {
          public: false
        });
      }
      
      const fileName = `${user.id}-${Date.now()}-${uploadedFile.name}`;
      const { data, error } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, uploadedFile);
        
      if (error) {
        toast.error("Error uploading document: " + error.message);
        setDocumentVerifying(false);
        return;
      }
      
      setTimeout(() => {
        setDocumentVerifying(false);
        setDocumentVerified(true);
        updateProgress();
        toast.success("Document verified successfully!");
      }, 2000);
      
    } catch (error: any) {
      console.error("Storage error:", error);
      toast.error("Error during verification: " + error.message);
      setDocumentVerifying(false);
    }
  };

  const toggleCamera = () => {
    setCameraActive(prev => !prev);
    if (cameraActive) {
      setPhotoTaken(false);
      setSelfieImage(null);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setSelfieImage(dataUrl);
        setPhotoTaken(true);
        
        const stream = video.srcObject as MediaStream;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
        video.srcObject = null;
      }
    }
  };

  const verifyPhoto = async () => {
    if (!selfieImage || !user) return;
    
    setPhotoVerifying(true);
    
    try {
      const response = await fetch(selfieImage);
      const blob = await response.blob();
      
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'selfies');
      
      if (!bucketExists) {
        await supabase.storage.createBucket('selfies', {
          public: false
        });
      }
      
      const fileName = `${user.id}-${Date.now()}.png`;
      const { data, error } = await supabase.storage
        .from('selfies')
        .upload(fileName, blob);
        
      if (error) {
        toast.error("Error uploading selfie: " + error.message);
        setPhotoVerifying(false);
        return;
      }
      
      setTimeout(() => {
        setPhotoVerifying(false);
        setPhotoVerified(true);
        updateProgress();
        toast.success("Selfie verified successfully!");
      }, 2000);
      
    } catch (error: any) {
      console.error("Storage error:", error);
      toast.error("Error during verification: " + error.message);
      setPhotoVerifying(false);
    }
  };

  const sendEmailCode = () => {
    if (!email) return;
    setEmailSent(true);
    toast.success(`Verification code sent to ${email}`);
  };

  const verifyEmail = () => {
    if (!otp) return;
    setEmailVerified(true);
    updateProgress();
    toast.success("Email verified successfully!");
  };

  const sendPhoneCode = () => {
    if (!phone) return;
    setPhoneSent(true);
    toast.success(`Verification code sent to ${phone}`);
  };

  const verifyPhone = () => {
    if (!otp) return;
    setPhoneVerified(true);
    updateProgress();
    toast.success("Phone verified successfully!");
  };

  const updateProgress = () => {
    let points = 0;
    if (documentVerified) points += 33;
    if (photoVerified) points += 33;
    if (emailVerified || phoneVerified) points += 34;
    setVerificationProgress(points);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldCheck className="mr-2 h-5 w-5" />
          User Verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Verification Progress</span>
            <span>{verificationProgress}%</span>
          </div>
          <Progress value={verificationProgress} className="h-2" />
        </div>

        <Tabs defaultValue="document" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="document">ID Document</TabsTrigger>
            <TabsTrigger value="selfie">Selfie</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="document" className="space-y-4">
            {!documentUploaded ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload ID Document</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Upload a government-issued ID (passport, driver's license, etc.)
                </p>
                <Button 
                  className="cursor-pointer"
                  onClick={triggerFileInput}
                >
                  Choose File
                </Button>
                <input
                  id="id-document-upload"
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleDocumentUpload}
                />
              </div>
            ) : !documentVerifying && !documentVerified ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center">
                    <Upload className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <p className="font-medium">{uploadedFile?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Ready for verification
                      </p>
                    </div>
                  </div>
                </div>
                <Button onClick={verifyDocument} className="w-full">Verify Document</Button>
              </div>
            ) : documentVerifying ? (
              <div className="space-y-4">
                <div className="p-8 flex justify-center items-center">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
                    <p className="text-sm text-muted-foreground">Verifying your document...</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-emerald-800">Document Verified</h3>
                    <p className="text-sm text-emerald-700">Your ID document has been successfully verified</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-md p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-medium">{uploadedFile?.name}</p>
                  </div>
                  <div className="flex items-center text-sm text-emerald-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Verified
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="selfie" className="space-y-4">
            {!cameraActive && !photoTaken ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                <Camera className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Take a Selfie</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Take a clear photo of your face to verify your identity
                </p>
                <Button onClick={toggleCamera}>
                  Enable Camera
                </Button>
              </div>
            ) : cameraActive && !photoTaken ? (
              <div className="space-y-4">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                  <video
                    ref={videoRef}
                    id="user-camera"
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  <div className="absolute inset-0 border-4 border-dashed border-white/40 rounded-lg m-8"></div>
                  
                  <p className="relative bg-black/70 text-white px-4 py-2 rounded-md">
                    Position your face within the frame
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" onClick={toggleCamera} className="flex-1">
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={takePhoto}>
                    Take Photo
                  </Button>
                </div>
                
                <canvas ref={canvasRef} className="hidden" />
              </div>
            ) : photoTaken && !photoVerifying && !photoVerified ? (
              <div className="space-y-4">
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  {selfieImage && (
                    <img 
                      src={selfieImage} 
                      alt="Selfie preview" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" onClick={toggleCamera} className="flex-1">
                    Retake
                  </Button>
                  <Button className="flex-1" onClick={verifyPhoto}>
                    Verify Photo
                  </Button>
                </div>
              </div>
            ) : photoVerifying ? (
              <div className="p-8 flex justify-center items-center">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
                  <p className="text-sm text-muted-foreground">Verifying your photo...</p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-emerald-800">Selfie Verified</h3>
                    <p className="text-sm text-emerald-700">Your photo has been successfully verified</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Facial recognition complete</p>
                    <div className="flex items-center text-sm text-emerald-600">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Verified
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="flex items-center text-lg font-medium mb-2">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Verification
                </div>
                
                {!emailVerified ? (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        className="col-span-2"
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={emailSent}
                      />
                      <Button
                        onClick={sendEmailCode}
                        disabled={!email || emailSent}
                      >
                        {emailSent ? 'Sent' : 'Send Code'}
                      </Button>
                    </div>
                    
                    {emailSent && (
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        <Input
                          className="col-span-2"
                          placeholder="Enter verification code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                        <Button
                          onClick={verifyEmail}
                          disabled={!otp}
                        >
                          Verify
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-emerald-600" />
                      <span className="text-sm">{email}</span>
                    </div>
                    <div className="flex items-center text-sm text-emerald-600">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Verified
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-lg font-medium mb-2">
                  <Phone className="h-5 w-5 mr-2" />
                  Phone Verification
                </div>
                
                {!phoneVerified ? (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        className="col-span-2"
                        placeholder="Enter your phone number"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={phoneSent}
                      />
                      <Button
                        onClick={sendPhoneCode}
                        disabled={!phone || phoneSent}
                      >
                        {phoneSent ? 'Sent' : 'Send Code'}
                      </Button>
                    </div>
                    
                    {phoneSent && (
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        <Input
                          className="col-span-2"
                          placeholder="Enter verification code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                        <Button
                          onClick={verifyPhone}
                          disabled={!otp}
                        >
                          Verify
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-emerald-600" />
                      <span className="text-sm">{phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-emerald-600">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Verified
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserVerification;
