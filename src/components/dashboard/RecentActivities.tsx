
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, FileText, MessageSquare, Video } from "lucide-react";

interface Activity {
  id: string;
  type: 'resume' | 'interview' | 'message' | 'decision';
  title: string;
  description: string;
  time: string;
  user?: {
    name: string;
    image?: string;
  };
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'interview',
    title: 'AI Interview Completed',
    description: 'Emma Davis completed the AI interview with a score of 95%',
    time: '10 min ago',
    user: {
      name: 'Emma Davis'
    }
  },
  {
    id: '2',
    type: 'resume',
    title: 'Resume Verified',
    description: 'Alex Morgan\'s resume has been verified and scored',
    time: '1 hour ago',
    user: {
      name: 'Alex Morgan'
    }
  },
  {
    id: '3',
    type: 'decision',
    title: 'Candidate Shortlisted',
    description: 'Sarah Chen has been shortlisted for the UX Designer position',
    time: '3 hours ago',
    user: {
      name: 'Sarah Chen'
    }
  },
  {
    id: '4',
    type: 'message',
    title: 'AI Assistant Message',
    description: 'AI suggested follow-up questions for Michael Brown',
    time: '5 hours ago'
  }
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'resume':
      return <FileText className="h-4 w-4 text-blue-600" />;
    case 'interview':
      return <Video className="h-4 w-4 text-purple-600" />;
    case 'message':
      return <MessageSquare className="h-4 w-4 text-teal-600" />;
    case 'decision':
      return <Check className="h-4 w-4 text-emerald-600" />;
    default:
      return null;
  }
};

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {activities.map((activity) => (
            <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-border hover:bg-muted/20 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <div className="font-semibold text-sm">{activity.title}</div>
                  <time className="text-xs text-muted-foreground">{activity.time}</time>
                </div>
                
                <div className="text-sm">
                  {activity.description}
                </div>
                
                {activity.user && (
                  <div className="flex items-center mt-2">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={activity.user.image} alt={activity.user.name} />
                      <AvatarFallback className="text-xs">
                        {activity.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{activity.user.name}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentActivities;
