
import Navbar from "@/components/layout/Navbar";
import TopPerformers from "@/components/candidates/TopPerformers";
import PerformanceGraph from "@/components/candidates/PerformanceGraph";

const Candidates = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Top Candidates</h1>
            <p className="mt-1 text-sm text-gray-500">
              Review and hire top performing candidates
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TopPerformers />
            <PerformanceGraph />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Candidates;
