
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Resume from "./pages/Resume";
import Interview from "./pages/Interview";
import Features from "./pages/Features";
import Candidates from "./pages/Candidates";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Auth from "./pages/Auth";
import AddCandidate from "./pages/AddCandidate";
import PostJob from "./pages/PostJob";
import CandidateDetail from "@/components/candidates/CandidateDetail";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/interview" element={<Interview />} />
              <Route path="/features" element={<Features />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/add-candidate" element={<AddCandidate />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/candidates/:id" element={<CandidateDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
