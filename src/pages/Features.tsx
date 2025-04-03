
import Navbar from "@/components/layout/Navbar";
import UserVerification from "@/components/verification/UserVerification";
import SkillAssessment from "@/components/assessment/SkillAssessment";
import PredictiveHiring from "@/components/prediction/PredictiveHiring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, BrainCircuit, TrendingUp } from "lucide-react";
import { useState } from "react";

const Features = () => {
  const [activeTab, setActiveTab] = useState("verification");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Advanced Features</h1>
            <p className="mt-1 text-sm text-gray-500">
              AI-powered verification, assessment and predictive hiring tools
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="verification" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Verification</span>
              </TabsTrigger>
              <TabsTrigger value="assessment" className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4" />
                <span>Skill Assessment</span>
              </TabsTrigger>
              <TabsTrigger value="predictive" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Predictive Hiring</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="verification">
              <UserVerification />
            </TabsContent>
            
            <TabsContent value="assessment">
              <SkillAssessment />
            </TabsContent>
            
            <TabsContent value="predictive">
              <PredictiveHiring />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Features;
