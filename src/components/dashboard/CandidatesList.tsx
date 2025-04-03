
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, StarHalf, MessageSquare, FileCheck, Plus, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Candidate {
  candidate_id: string;
  first_name: string;
  last_name: string;
  position: string;
  score: number;
  status: 'Pending' | 'Interviewed' | 'Shortlisted' | 'Offered' | 'Rejected';
  image?: string;
}

const statusColors = {
  Pending: 'bg-amber-100 text-amber-800',
  Interviewed: 'bg-blue-100 text-blue-800',
  Shortlisted: 'bg-emerald-100 text-emerald-800',
  Offered: 'bg-purple-100 text-purple-800',
  Rejected: 'bg-rose-100 text-rose-800'
};

export function CandidatesList() {
  const navigate = useNavigate();

  // Fetch candidates from Supabase
  const { data: candidates, isLoading, error } = useQuery({
    queryKey: ['candidates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      // Transform the data to include mock positions, scores and statuses
      return data.map(candidate => ({
        candidate_id: candidate.candidate_id,
        first_name: candidate.first_name,
        last_name: candidate.last_name,
        position: getRandomPosition(),
        score: Math.floor(Math.random() * 30) + 70, // Random score between 70-99
        status: getRandomStatus(),
        image: candidate.image
      }));
    }
  });

  function getRandomPosition() {
    const positions = [
      'Frontend Developer',
      'UX Designer',
      'Product Manager',
      'DevOps Engineer',
      'Backend Developer',
      'Full Stack Developer',
      'Data Scientist',
      'QA Engineer'
    ];
    return positions[Math.floor(Math.random() * positions.length)];
  }

  function getRandomStatus() {
    const statuses = [
      'Pending',
      'Interviewed',
      'Shortlisted',
      'Offered',
      'Rejected'
    ];
    return statuses[Math.floor(Math.random() * statuses.length)] as Candidate['status'];
  }

  const handleViewProfile = (id: string) => {
    navigate(`/candidates/${id}`);
  };

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center">
        <div className="flex-1">
          <CardTitle>Recent Candidates</CardTitle>
          <p className="text-sm text-muted-foreground">
            {candidates?.length || 0} candidates in the pipeline
          </p>
        </div>
        <Button size="sm" onClick={() => navigate("/add-candidate")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Candidate
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading candidates...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            <p>Error loading candidates. Please try again.</p>
          </div>
        ) : candidates?.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-1">No candidates yet</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first candidate</p>
            <Button onClick={() => navigate("/add-candidate")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Candidate
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {candidates?.map((candidate) => (
              <div 
                key={candidate.candidate_id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={candidate.image} alt={`${candidate.first_name} ${candidate.last_name}`} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {candidate.first_name?.[0]}{candidate.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{candidate.first_name} {candidate.last_name}</p>
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewProfile(candidate.candidate_id.toString())}
                    >
                      View Profile
                    </Button>
                    {candidate.status === 'Shortlisted' && (
                      <Button variant="default" size="sm">
                        Send Offer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CandidatesList;
