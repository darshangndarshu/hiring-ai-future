
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  TrendingUp, 
  Users, 
  UserCheck, 
  Clock, 
  DollarSign, 
  BarChart4,
  Building,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Prediction {
  percentile: number;
  performanceScore: number;
  retentionProbability: number;
  teamFit: number;
  projectSuccessRate: number;
  timeToProductivity: number;
  averageSalary: number;
}

type JobRole = 'frontend' | 'backend' | 'fullstack' | 'devops' | 'data';

const jobRoles = {
  frontend: {
    title: 'Frontend Developer',
    skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML']
  },
  backend: {
    title: 'Backend Developer',
    skills: ['Node.js', 'Python', 'Java', 'Databases', 'API Design']
  },
  fullstack: {
    title: 'Full Stack Developer',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express']
  },
  devops: {
    title: 'DevOps Engineer',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux']
  },
  data: {
    title: 'Data Engineer',
    skills: ['Python', 'SQL', 'ETL', 'Data Pipelines', 'Spark']
  }
};

const PredictiveHiring = () => {
  const [jobRole, setJobRole] = useState<JobRole>('frontend');
  const [yearsExperience, setYearsExperience] = useState(3);
  const [education, setEducation] = useState('bachelors');
  const [previousCompanies, setPreviousCompanies] = useState(2);
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  const handleSliderChange = (value: number[]) => {
    setYearsExperience(value[0]);
  };

  const generatePrediction = () => {
    setIsPredicting(true);
    
    // Simulate prediction calculation
    setTimeout(() => {
      // Generate realistic prediction data based on inputs
      const expModifier = (yearsExperience / 10) * 30; // 0-30 points
      const eduModifier = education === 'phd' ? 25 : education === 'masters' ? 20 : 15; // 15-25 points
      const compModifier = (previousCompanies / 5) * 15; // 0-15 points
      const baseScore = 60; // Base score
      
      // Calculate prediction with some randomness
      const randomFactor = (Math.random() * 10) - 5; // -5 to 5 range
      const performanceScore = Math.min(95, Math.max(60, baseScore + expModifier + eduModifier + compModifier / 3 + randomFactor));
      
      // Calculate other metrics
      const retentionProbability = Math.min(95, Math.max(50, baseScore + (expModifier / 2) - (compModifier * 1.5) + eduModifier / 2 + randomFactor));
      const teamFit = Math.min(95, Math.max(60, baseScore + expModifier / 3 + eduModifier / 3 + compModifier / 3 + randomFactor));
      const projectSuccessRate = Math.min(95, Math.max(60, performanceScore * 0.8 + teamFit * 0.2));
      const timeToProductivity = Math.max(1, 6 - (yearsExperience / 5 * 4) - (eduModifier / 25));
      
      // Salary prediction based on role and experience
      const roleBaseSalary = {
        frontend: 85000,
        backend: 90000,
        fullstack: 100000,
        devops: 110000,
        data: 105000
      };
      
      const averageSalary = roleBaseSalary[jobRole] + (yearsExperience * 5000) + 
        (education === 'phd' ? 20000 : education === 'masters' ? 12000 : 0);
        
      // Calculate percentile among similar candidates
      const percentile = Math.min(99, Math.max(50, performanceScore + randomFactor));
      
      setPrediction({
        percentile: Math.round(percentile),
        performanceScore: Math.round(performanceScore),
        retentionProbability: Math.round(retentionProbability),
        teamFit: Math.round(teamFit),
        projectSuccessRate: Math.round(projectSuccessRate),
        timeToProductivity: Number(timeToProductivity.toFixed(1)),
        averageSalary: Math.round(averageSalary / 1000) * 1000 // Round to nearest thousand
      });
      
      setIsPredicting(false);
    }, 2000);
  };

  const resetPrediction = () => {
    setPrediction(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Predictive Hiring Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!prediction ? (
          <div className="space-y-6">
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Candidate Profile</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enter candidate details to generate AI-powered career and performance predictions.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="job-role" className="block text-sm font-medium mb-1">
                    Job Role
                  </label>
                  <Select
                    value={jobRole}
                    onValueChange={(value: JobRole) => setJobRole(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">Frontend Developer</SelectItem>
                      <SelectItem value="backend">Backend Developer</SelectItem>
                      <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                      <SelectItem value="devops">DevOps Engineer</SelectItem>
                      <SelectItem value="data">Data Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Years of Experience: {yearsExperience}
                  </label>
                  <div className="px-1">
                    <Slider
                      value={[yearsExperience]}
                      min={0}
                      max={15}
                      step={1}
                      onValueChange={handleSliderChange}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Entry Level</span>
                      <span>Experienced</span>
                      <span>Senior</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="education" className="block text-sm font-medium mb-1">
                    Highest Education
                  </label>
                  <Select
                    value={education}
                    onValueChange={setEducation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highschool">High School</SelectItem>
                      <SelectItem value="associate">Associate Degree</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="previous-companies" className="block text-sm font-medium mb-1">
                    Previous Companies
                  </label>
                  <Input
                    id="previous-companies"
                    type="number"
                    min={0}
                    max={10}
                    value={previousCompanies}
                    onChange={(e) => setPreviousCompanies(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
              
            <Button 
              className="w-full" 
              disabled={isPredicting}
              onClick={generatePrediction}
            >
              {isPredicting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Generating Predictions...
                </>
              ) : (
                'Generate Predictions'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-muted/10 rounded-lg p-6">
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium">{jobRoles[jobRole].title}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {jobRoles[jobRole].skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center">
                  <div className="bg-primary/10 rounded-full p-2.5">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-2">
                    <div className="text-xs text-muted-foreground">Candidate Percentile</div>
                    <div className="text-2xl font-bold">{prediction.percentile}%</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-muted/30 rounded-lg p-4 flex flex-col">
                  <div className="flex items-center mb-2">
                    <BarChart4 className="h-5 w-5 mr-2 text-emerald-600" />
                    <h4 className="font-medium">Performance</h4>
                  </div>
                  <div className="text-3xl font-bold">{prediction.performanceScore}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Predicted work performance</p>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4 flex flex-col">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    <h4 className="font-medium">Team Fit</h4>
                  </div>
                  <div className="text-3xl font-bold">{prediction.teamFit}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Cultural & team alignment</p>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4 flex flex-col">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 mr-2 text-amber-600" />
                    <h4 className="font-medium">Time to Productivity</h4>
                  </div>
                  <div className="text-3xl font-bold">{prediction.timeToProductivity}</div>
                  <p className="text-xs text-muted-foreground mt-1">Months to reach full capacity</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Performance Insights</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span>Project Success Rate</span>
                      <span className="font-medium">{prediction.projectSuccessRate}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Retention Probability</span>
                      <span className="font-medium">{prediction.retentionProbability}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Market Salary Range</span>
                      <span className="font-medium">${(prediction.averageSalary/1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Candidate Snapshot</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{yearsExperience} years of experience</span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{education === 'phd' ? 'PhD' : education === 'masters' ? "Master's Degree" : education === 'bachelors' ? "Bachelor's Degree" : education === 'associate' ? "Associate Degree" : "High School"}</span>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{previousCompanies} previous employer{previousCompanies !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={resetPrediction}
              >
                New Prediction
              </Button>
              <Button className="flex-1">
                Generate Interview Questions
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictiveHiring;
