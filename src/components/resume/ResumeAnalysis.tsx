
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, CheckCircle2, AlertTriangle, ListChecks, TrendingUp } from "lucide-react";

const ResumeAnalysis = () => {
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedResume(e.target.files[0]);
    }
  };

  const analyzeResume = () => {
    setIsAnalyzing(true);
    // Simulate analysis time
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalysisComplete(true);
    }, 2500);
  };

  const resetAnalysis = () => {
    setUploadedResume(null);
    setIsAnalysisComplete(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Resume Analysis & Verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!uploadedResume && !isAnalysisComplete && (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Resume</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Drag and drop your resume file or click to browse
            </p>
            <label htmlFor="resume-upload">
              <Button as="span">
                Choose File
              </Button>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleResumeUpload}
              />
            </label>
          </div>
        )}

        {uploadedResume && !isAnalysisComplete && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="font-medium">{uploadedResume.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedResume.size / 1024).toFixed(1)} KB - {uploadedResume.type}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={resetAnalysis}>
                Remove
              </Button>
            </div>

            <Button 
              className="w-full" 
              disabled={isAnalyzing}
              onClick={analyzeResume}
            >
              {isAnalyzing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Analyzing Resume...
                </>
              ) : (
                'Start Analysis'
              )}
            </Button>

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyzing resume contents...</span>
                  <span>70%</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
            )}
          </div>
        )}

        {isAnalysisComplete && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-primary mr-2" />
                <div>
                  <p className="font-medium">John_Smith_Resume.pdf</p>
                  <p className="text-sm text-muted-foreground">
                    Analysis completed
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 flex items-center">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            </div>

            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Overall Match Score</h3>
                  <div className="flex items-center space-x-2">
                    <Progress value={85} className="h-2 flex-grow" />
                    <span className="font-bold">85%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Key Findings</h3>
                  <div className="space-y-2">
                    <div className="flex items-start p-3 rounded-md bg-muted/30">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">5+ years of relevant experience</p>
                        <p className="text-sm text-muted-foreground">Experience aligns well with job requirements</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 rounded-md bg-muted/30">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Strong educational background</p>
                        <p className="text-sm text-muted-foreground">BS in Computer Science from a recognized university</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 rounded-md bg-muted/30">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Leadership experience gap</p>
                        <p className="text-sm text-muted-foreground">Limited project leadership experience mentioned</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="skills" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2 border-emerald-200">
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm flex items-center text-emerald-700">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Matching Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>React.js</span>
                            <span className="font-medium">95%</span>
                          </div>
                          <Progress value={95} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>JavaScript</span>
                            <span className="font-medium">90%</span>
                          </div>
                          <Progress value={90} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>TypeScript</span>
                            <span className="font-medium">85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Responsive Design</span>
                            <span className="font-medium">80%</span>
                          </div>
                          <Progress value={80} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-amber-200">
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm flex items-center text-amber-700">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Missing Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>GraphQL</span>
                            <span className="font-medium">Not Found</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>React Native</span>
                            <span className="font-medium">30%</span>
                          </div>
                          <Progress value={30} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>CI/CD Experience</span>
                            <span className="font-medium">25%</span>
                          </div>
                          <Progress value={25} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-medium flex items-center mb-3">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Skill Development Recommendations
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                      <span>Consider pursuing GraphQL certification to fill the knowledge gap</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                      <span>Strengthen React Native experience with personal projects</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                      <span>Participate in team projects to develop leadership skills</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="verification" className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-medium flex items-center mb-3">
                    <ListChecks className="mr-2 h-4 w-4" />
                    Verification Results
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Education Verified</p>
                        <p className="text-sm text-muted-foreground">BS in Computer Science from Stanford University (2018-2022)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Previous Employment Verified</p>
                        <p className="text-sm text-muted-foreground">Software Engineer at TechCorp (2022-2024)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Certifications Verified</p>
                        <p className="text-sm text-muted-foreground">AWS Certified Developer (2023)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Project Experience Needs Verification</p>
                        <p className="text-sm text-muted-foreground">Further verification needed on claimed project achievements</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">AI Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 text-sm space-y-2">
                    <p>✓ This candidate has a valid and verified resume</p>
                    <p>✓ Educational and employment history matches our records</p>
                    <p>✓ Skills claimed appear consistent with work history</p>
                    <p>→ Suggested follow-up: Request portfolio links or code samples to verify project claims</p>
                  </CardContent>
                </Card>
                
                <div className="flex space-x-3">
                  <Button className="flex-1" variant="outline">
                    Request Additional Info
                  </Button>
                  <Button className="flex-1">
                    Schedule Interview
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={resetAnalysis}
            >
              Upload Different Resume
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeAnalysis;
