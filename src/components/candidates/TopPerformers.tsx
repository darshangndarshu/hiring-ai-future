
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, Award, Star, ArrowRight, Download, Calendar, Clock, ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Candidate {
  id: string;
  name: string;
  position: string;
  matchScore: number;
  strengths: string[];
  status: 'Ready to Hire' | 'Shortlisted' | 'Interviewing';
  image?: string;
  interviewDate?: string;
}

const topCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Emma Davis',
    position: 'Backend Developer',
    matchScore: 95,
    strengths: ['System Architecture', 'API Design', 'Database Optimization'],
    status: 'Ready to Hire',
    interviewDate: '2025-03-28'
  },
  {
    id: '2',
    name: 'Alex Morgan',
    position: 'Frontend Developer',
    matchScore: 92,
    strengths: ['React.js Expert', 'UI/UX Skills', 'Performance Optimization'],
    status: 'Ready to Hire',
    interviewDate: '2025-03-25'
  },
  {
    id: '3',
    name: 'Sarah Chen',
    position: 'UX Designer',
    matchScore: 88,
    strengths: ['User Research', 'Prototyping', 'Design Systems'],
    status: 'Shortlisted',
    interviewDate: '2025-03-29'
  }
];

const shortlistedCandidates: Candidate[] = [
  {
    id: '4',
    name: 'James Wilson',
    position: 'DevOps Engineer',
    matchScore: 78,
    strengths: ['CI/CD Pipelines', 'Cloud Infrastructure', 'Monitoring'],
    status: 'Interviewing',
    interviewDate: '2025-04-05'
  },
  {
    id: '5',
    name: 'Michael Brown',
    position: 'Product Manager',
    matchScore: 85,
    strengths: ['Market Research', 'Roadmap Planning', 'User Stories'],
    status: 'Shortlisted',
    interviewDate: '2025-04-10'
  }
];

const TopPerformers = () => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Award className="mr-2 h-5 w-5 text-amber-500" />
          Top Performing Candidates
        </CardTitle>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="top">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="top">Ready to Hire</TabsTrigger>
            <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
          </TabsList>
          
          <TabsContent value="top" className="space-y-4">
            {topCandidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </TabsContent>
          
          <TabsContent value="shortlisted" className="space-y-4">
            {shortlistedCandidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const CandidateCard = ({ candidate }: { candidate: Candidate }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };
  
  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'Ready to Hire':
        return 'bg-emerald-100 text-emerald-800';
      case 'Shortlisted':
        return 'bg-blue-100 text-blue-800';
      case 'Interviewing':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="border rounded-lg overflow-hidden transition-all">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={candidate.image} alt={candidate.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium flex items-center">
                {candidate.name}
                {candidate.matchScore >= 90 && (
                  <Star className="ml-1 h-4 w-4 fill-amber-400 text-amber-400" />
                )}
              </h3>
              <p className="text-sm text-muted-foreground">{candidate.position}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-semibold">
                {candidate.matchScore}% Match
              </div>
              <Badge className={getStatusColor(candidate.status)}>
                {candidate.status}
              </Badge>
            </div>
            <ChevronDown className={`h-5 w-5 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>
      
      {showDetails && (
        <div className="px-4 pb-4 pt-2 animate-fade-in">
          <div className="pl-16 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Key Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.strengths.map((strength, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/5">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
            
            {candidate.interviewDate && (
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Interviewed on {formatDate(candidate.interviewDate)}</span>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              <Button size="sm">
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Send Offer
              </Button>
              
              <Button size="sm" variant="outline">
                View Full Profile
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline">
                    Schedule Meeting
                    <Clock className="ml-1 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h3 className="font-medium">Schedule a Meeting</h3>
                    <p className="text-sm text-muted-foreground">Select a date and time to meet with {candidate.name}</p>
                    <div className="grid gap-2">
                      <Button size="sm">Tomorrow, 10:00 AM</Button>
                      <Button size="sm" variant="outline">Thursday, 2:00 PM</Button>
                      <Button size="sm" variant="outline">Friday, 11:30 AM</Button>
                      <Button size="sm" variant="ghost">Custom Time...</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopPerformers;
