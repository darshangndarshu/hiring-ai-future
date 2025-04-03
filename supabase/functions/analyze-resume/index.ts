
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type AnalysisRequest = {
  resumeUrl: string;
  userId: string;
}

type AnalysisResponse = {
  name: string;
  email: string;
  phone: string;
  skillMatch: number;
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  skills: string[];
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse request
    const { resumeUrl, userId } = await req.json() as AnalysisRequest;

    if (!resumeUrl || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // In a real implementation, you would process the resume here
    // For now, we'll return mock analysis data
    const mockAnalysis: AnalysisResponse = {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
      skillMatch: 85,
      education: [
        { degree: "Bachelor of Computer Science", institution: "Stanford University", year: "2020" },
        { degree: "Master of Software Engineering", institution: "MIT", year: "2022" }
      ],
      experience: [
        { 
          title: "Software Engineer", 
          company: "TechCorp", 
          duration: "2022-2024",
          description: "Developed scalable web applications using React and Node.js" 
        },
        { 
          title: "Frontend Developer", 
          company: "WebSolutions", 
          duration: "2020-2022",
          description: "Created responsive user interfaces and optimized website performance" 
        }
      ],
      skills: ["JavaScript", "TypeScript", "React", "Node.js", "GraphQL", "AWS", "CI/CD", "Agile"],
      analysis: {
        strengths: [
          "Strong technical skill set in modern web technologies",
          "Experience with full-stack development",
          "Education from prestigious institutions"
        ],
        weaknesses: [
          "Limited management experience",
          "Missing some advanced backend skills",
          "Could use more certifications"
        ],
        recommendations: [
          "Consider obtaining cloud certifications",
          "Gain more experience with backend frameworks",
          "Highlight specific project achievements"
        ]
      }
    };

    // Log analysis completion
    console.log(`Resume analysis completed for user ${userId}`);

    // Return the analysis results
    return new Response(
      JSON.stringify(mockAnalysis),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
