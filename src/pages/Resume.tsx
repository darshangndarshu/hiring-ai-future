
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import ResumeAnalysis from "@/components/resume/ResumeAnalysis";
import ResumeScanner from "@/components/resume/ResumeScanner";
import AIAssistant from "@/components/ai/AIAssistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Scan, Bot } from "lucide-react";

const Resume = () => {
  const [activeTab, setActiveTab] = useState("scanner");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Resume Tools</h1>
            <p className="mt-1 text-sm text-gray-500">
              AI-powered resume scanning, verification and analysis
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="scanner" className="flex items-center gap-2">
                <Scan className="h-4 w-4" />
                <span>Scanner</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="assistant" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <span>AI Assistant</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="scanner">
              <ResumeScanner />
            </TabsContent>
            
            <TabsContent value="analysis">
              <ResumeAnalysis />
            </TabsContent>
            
            <TabsContent value="assistant">
              <AIAssistant />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Resume;
