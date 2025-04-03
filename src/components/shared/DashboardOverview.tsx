
import { Card, CardContent } from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard";
import CandidatesList from "@/components/dashboard/CandidatesList";
import RecentActivities from "@/components/dashboard/RecentActivities";
import PositionOverview from "@/components/dashboard/PositionOverview";
import { Users, CheckCircle2, Clock, FileCheck } from "lucide-react";

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Candidates" 
          value="108"
          description="12 new this month" 
          icon={<Users className="h-4 w-4" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard 
          title="Interviewed" 
          value="42"
          description="39% of total applicants" 
          icon={<CheckCircle2 className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Time to Hire" 
          value="14 days"
          description="Industry avg: 22 days" 
          icon={<Clock className="h-4 w-4" />}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard 
          title="Resume Verified" 
          value="95"
          description="88% verification rate" 
          icon={<FileCheck className="h-4 w-4" />}
          trend={{ value: 5, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CandidatesList />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PositionOverview />
        <Card className="col-span-3 lg:col-span-1">
          <CardContent className="p-0">
            <RecentActivities />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
