
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, StarHalf, MessageSquare, FileCheck, Plus } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  position: string;
  score: number;
  status: 'Pending' | 'Interviewed' | 'Shortlisted' | 'Offered' | 'Rejected';
  image?: string;
}

const candidates: Candidate[] = [
  {
    id: '1',
    name: 'Alex Morgan',
    position: 'Frontend Developer',
    score: 92,
    status: 'Shortlisted',
    image: ''
  },
  {
    id: '2',
    name: 'Sarah Chen',
    position: 'UX Designer',
    score: 88,
    status: 'Interviewed',
    image: ''
  },
  {
    id: '3',
    name: 'Michael Brown',
    position: 'Product Manager',
    score: 85,
    status: 'Pending',
    image: ''
  },
  {
    id: '4',
    name: 'James Wilson',
    position: 'DevOps Engineer',
    score: 78,
    status: 'Interviewed',
    image: ''
  },
  {
    id: '5',
    name: 'Emma Davis',
    position: 'Backend Developer',
    score: 95,
    status: 'Offered',
    image: ''
  }
];

const statusColors = {
  Pending: 'bg-amber-100 text-amber-800',
  Interviewed: 'bg-blue-100 text-blue-800',
  Shortlisted: 'bg-emerald-100 text-emerald-800',
  Offered: 'bg-purple-100 text-purple-800',
  Rejected: 'bg-rose-100 text-rose-800'
};

export function CandidatesList() {
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center">
        <div className="flex-1">
          <CardTitle>Recent Candidates</CardTitle>
          <p className="text-sm text-muted-foreground">
            {candidates.length} candidates in the pipeline
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Candidate
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <div 
              key={candidate.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={candidate.image} alt={candidate.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{candidate.name}</p>
                  <p className="text-sm text-muted-foreground">{candidate.position}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="hidden md:block w-32">
                  <div className="flex items-center space-x-1 text-sm">
                    <span>Match Score:</span>
                    <span className="font-semibold">{candidate.score}%</span>
                  </div>
                  <Progress value={candidate.score} className="h-2" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={statusColors[candidate.status]}>
                    {candidate.status}
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <FileCheck className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CandidatesList;
