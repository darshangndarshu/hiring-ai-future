
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface CandidatePerformance {
  name: string;
  position: string;
  interviewScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  cultureFitScore: number;
  leadershipScore: number;
  performanceByQuestion: {
    question: string;
    score: number;
  }[];
  skillsAssessment: {
    skill: string;
    level: number;
  }[];
}

const sampleData: CandidatePerformance = {
  name: "Sarah Chen",
  position: "UX Designer",
  interviewScore: 88,
  technicalScore: 85,
  communicationScore: 92,
  problemSolvingScore: 90,
  cultureFitScore: 94,
  leadershipScore: 82,
  performanceByQuestion: [
    { question: "Work Experience", score: 90 },
    { question: "Technical Skills", score: 85 },
    { question: "Design Process", score: 92 },
    { question: "Collaboration", score: 88 },
    { question: "Problem Solving", score: 90 },
    { question: "User Research", score: 94 },
    { question: "Project Management", score: 80 }
  ],
  skillsAssessment: [
    { skill: "Figma", level: 95 },
    { skill: "User Research", level: 90 },
    { skill: "Wireframing", level: 88 },
    { skill: "UI Design", level: 85 },
    { skill: "Prototyping", level: 92 },
    { skill: "Usability Testing", level: 86 }
  ]
};

const compareData = [
  { name: "Sarah Chen", score: 88 },
  { name: "Alex Morgan", score: 92 },
  { name: "Emma Davis", score: 95 },
  { name: "Michael Brown", score: 85 },
  { name: "James Wilson", score: 78 }
];

const progressData = [
  { month: "Apr", score: 65 },
  { month: "May", score: 72 },
  { month: "Jun", score: 78 },
  { month: "Jul", score: 81 },
  { month: "Aug", score: 85 },
  { month: "Sep", score: 88 }
];

const PerformanceGraph = () => {
  const [selectedCandidate, setSelectedCandidate] = useState("sarah-chen");

  const radarData = [
    { subject: 'Technical', A: sampleData.technicalScore },
    { subject: 'Communication', A: sampleData.communicationScore },
    { subject: 'Problem Solving', A: sampleData.problemSolvingScore },
    { subject: 'Culture Fit', A: sampleData.cultureFitScore },
    { subject: 'Leadership', A: sampleData.leadershipScore },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Candidate Performance</CardTitle>
        <Select defaultValue={selectedCandidate} onValueChange={setSelectedCandidate}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select candidate" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sarah-chen">Sarah Chen</SelectItem>
            <SelectItem value="alex-morgan">Alex Morgan</SelectItem>
            <SelectItem value="emma-davis">Emma Davis</SelectItem>
            <SelectItem value="michael-brown">Michael Brown</SelectItem>
            <SelectItem value="james-wilson">James Wilson</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Performance" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-[300px] mt-6">
              <h3 className="font-medium mb-3">Performance by Question</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleData.performanceByQuestion} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="question" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#0d9488" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="compare">
            <div className="h-[300px]">
              <h3 className="font-medium mb-3">Comparison with Other Candidates</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compareData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h3 className="font-medium mb-2">Key Insights</h3>
              <ul className="space-y-2 text-sm">
                <li>• Sarah ranks 3rd among 5 candidates for this position</li>
                <li>• Score is 7% above the average for this position</li>
                <li>• Shows strongest performance in Culture Fit and Communication</li>
                <li>• Has most competitive technical skills in Figma and Prototyping</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="progress">
            <div className="h-[300px]">
              <h3 className="font-medium mb-3">Performance Progress Over Time</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#0d9488" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h3 className="font-medium mb-2">Progress Insights</h3>
              <ul className="space-y-2 text-sm">
                <li>• Consistent improvement over the past 6 months</li>
                <li>• 35% improvement in overall performance scores</li>
                <li>• Most significant improvement in Technical Skills (+40%)</li>
                <li>• Coaching recommendation: Focus on Project Management</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceGraph;
