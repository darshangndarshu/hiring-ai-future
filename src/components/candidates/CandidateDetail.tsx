
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, FileText, Calendar, MapPin, 
  Mail, Phone, Briefcase, GraduationCap, 
  Award, Send, Star, CheckCircle2, X
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface Candidate {
  candidate_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin_profile: string;
  portfolio_url: string;
  created_at: string;
}

interface Resume {
  resume_id: number;
  candidate_id: number;
  skills: string;
  experience: any[];
  education: any[];
  achievements: string;
  certifications: string;
}

const CandidateDetail = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [offerMessage, setOfferMessage] = useState('');
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        if (!id) return;
        
        setLoading(true);
        
        // Fetch candidate
        const { data: candidateData, error: candidateError } = await supabase
          .from('candidates')
          .select('*')
          .eq('candidate_id', id)
          .single();
        
        if (candidateError) throw candidateError;
        setCandidate(candidateData);
        
        // Fetch resume
        const { data: resumeData, error: resumeError } = await supabase
          .from('resumes')
          .select('*')
          .eq('candidate_id', id)
          .single();
        
        if (!resumeError) {
          setResume(resumeData);
        }
        
      } catch (err: any) {
        setError(err.message);
        toast.error("Failed to load candidate data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidateData();
  }, [id]);

  const sendOffer = async () => {
    try {
      if (!candidate) return;
      
      // In a real application, you'd send an email to the candidate
      // For demo purposes, we'll just show a success toast
      
      toast.success(`Offer sent to ${candidate.first_name} ${candidate.last_name}`);
      setShowOfferDialog(false);
    } catch (error: any) {
      toast.error("Failed to send offer");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Error Loading Candidate</h2>
        <p className="text-muted-foreground mb-4">{error || "Candidate not found"}</p>
        <Button onClick={() => navigate("/candidates")}>
          Go Back to Candidates
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/candidates')}>
          <X className="mr-2 h-4 w-4" />
          Close
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("Candidate added to favorites")}>
            <Star className="mr-2 h-4 w-4" />
            Favorite
          </Button>
          <Button onClick={() => setShowOfferDialog(true)}>
            <Send className="mr-2 h-4 w-4" />
            Send Offer
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Candidate Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mb-3">
                <User className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-xl font-bold">{candidate.first_name} {candidate.last_name}</h2>
              <Badge className="mt-1">{resume?.skills?.split(',')[0] || "Candidate"}</Badge>
              
              <div className="w-full mt-5">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Match Score</span>
                  <span>87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{candidate.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{candidate.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{candidate.location}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Applied</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(candidate.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Detailed Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="resume">
              <TabsList className="mb-6">
                <TabsTrigger value="resume">Resume</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="resume" className="space-y-6">
                {resume ? (
                  <>
                    <div>
                      <h3 className="text-lg font-medium flex items-center">
                        <Briefcase className="mr-2 h-5 w-5" />
                        Experience
                      </h3>
                      <div className="mt-4 space-y-4">
                        {resume.experience && (Array.isArray(resume.experience) ? resume.experience : []).map((exp, i) => (
                          <div key={i} className="border rounded-md p-4">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{exp.title || "Role"}</h4>
                              <p className="text-sm text-muted-foreground">{exp.duration || "N/A"}</p>
                            </div>
                            <p className="text-sm">{exp.company || "Company"}</p>
                            <p className="text-sm text-muted-foreground mt-2">{exp.description || "No description provided."}</p>
                          </div>
                        ))}
                        {(!resume.experience || !Array.isArray(resume.experience) || resume.experience.length === 0) && (
                          <p className="text-muted-foreground text-sm">No experience information available</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium flex items-center">
                        <GraduationCap className="mr-2 h-5 w-5" />
                        Education
                      </h3>
                      <div className="mt-4 space-y-4">
                        {resume.education && (Array.isArray(resume.education) ? resume.education : []).map((edu, i) => (
                          <div key={i} className="border rounded-md p-4">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{edu.degree || "Degree"}</h4>
                              <p className="text-sm text-muted-foreground">{edu.year || "N/A"}</p>
                            </div>
                            <p className="text-sm">{edu.institution || "Institution"}</p>
                          </div>
                        ))}
                        {(!resume.education || !Array.isArray(resume.education) || resume.education.length === 0) && (
                          <p className="text-muted-foreground text-sm">No education information available</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium flex items-center">
                        <Award className="mr-2 h-5 w-5" />
                        Achievements & Certifications
                      </h3>
                      <div className="mt-4 space-y-4">
                        {resume.achievements && (
                          <div className="border rounded-md p-4">
                            <h4 className="font-medium">Achievements</h4>
                            <p className="text-sm text-muted-foreground mt-2">{resume.achievements}</p>
                          </div>
                        )}
                        {resume.certifications && (
                          <div className="border rounded-md p-4">
                            <h4 className="font-medium">Certifications</h4>
                            <p className="text-sm text-muted-foreground mt-2">{resume.certifications}</p>
                          </div>
                        )}
                        {(!resume.achievements && !resume.certifications) && (
                          <p className="text-muted-foreground text-sm">No achievements or certifications information available</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No Resume Found</h3>
                    <p className="text-muted-foreground">This candidate hasn't uploaded a resume yet.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="skills">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Technical Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {resume?.skills?.split(',').map((skill, i) => (
                        <Badge key={i} variant="secondary" className="py-1.5">
                          {skill.trim()}
                        </Badge>
                      ))}
                      {(!resume?.skills) && (
                        <p className="text-muted-foreground text-sm">No skills information available</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Skill Assessment</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Technical Skills</span>
                          <span className="text-sm">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Communication</span>
                          <span className="text-sm">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Problem Solving</span>
                          <span className="text-sm">78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Team Collaboration</span>
                          <span className="text-sm">90%</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="assessment">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Technical Assessment</h3>
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Coding Challenge</h4>
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                          Completed
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Code Quality</span>
                            <span>8/10</span>
                          </div>
                          <Progress value={80} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Problem Solving</span>
                            <span>9/10</span>
                          </div>
                          <Progress value={90} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Efficiency</span>
                            <span>7/10</span>
                          </div>
                          <Progress value={70} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Interview Assessment</h3>
                    <div className="border rounded-md p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <span className="font-medium">Technical Interview Completed</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-sm font-medium mb-2">Feedback:</h5>
                          <p className="text-sm text-muted-foreground">The candidate demonstrated strong technical knowledge and was able to answer most questions correctly. They showed good problem-solving skills and were able to explain their thought process clearly.</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium mb-2">Strengths:</h5>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            <li>Strong understanding of core concepts</li>
                            <li>Good communication skills</li>
                            <li>Experience with relevant technologies</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium mb-2">Areas for Improvement:</h5>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            <li>Could benefit from more experience with system design</li>
                            <li>Needs more exposure to enterprise-level applications</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Offer to Candidate</DialogTitle>
            <DialogDescription>
              Compose an offer message to send to {candidate.first_name} {candidate.last_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="offer-message" className="text-sm font-medium">
                Offer Message
              </label>
              <Textarea 
                id="offer-message"
                placeholder="Enter your offer details here..."
                className="min-h-[150px]"
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setShowOfferDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={sendOffer} disabled={!offerMessage.trim()}>
              Send Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidateDetail;
