
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, Users, User, Clock } from "lucide-react";

interface Position {
  id: string;
  title: string;
  department: string;
  applicants: number;
  interviewed: number;
  targetDate: string;
  progress: number;
}

const positions: Position[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    applicants: 48,
    interviewed: 12,
    targetDate: '2025-05-15',
    progress: 60
  },
  {
    id: '2',
    title: 'UX Designer',
    department: 'Design',
    applicants: 36,
    interviewed: 8,
    targetDate: '2025-04-30',
    progress: 40
  },
  {
    id: '3',
    title: 'Product Manager',
    department: 'Product',
    applicants: 24,
    interviewed: 6,
    targetDate: '2025-05-10',
    progress: 30
  },
];

export function PositionOverview() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <Card className="col-span-3 lg:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="flex-1">
          <CardTitle>Open Positions</CardTitle>
          <p className="text-sm text-muted-foreground">
            {positions.length} active job openings
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Post Job
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {positions.map((position) => (
            <div 
              key={position.id}
              className="p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{position.title}</h3>
                  <p className="text-sm text-muted-foreground">{position.department}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{position.progress}% Complete</div>
                  <p className="text-xs text-muted-foreground">Target: {formatDate(position.targetDate)}</p>
                </div>
              </div>
              
              <Progress value={position.progress} className="h-2 mb-4" />
              
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{position.applicants} Applicants</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{position.interviewed} Interviewed</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>
                    {Math.ceil((new Date(position.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default PositionOverview;
