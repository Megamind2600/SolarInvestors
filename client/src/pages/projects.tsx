import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import ProjectCard from "@/components/project-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Projects() {
  const [filters, setFilters] = useState({
    status: "",
    location: "",
    minInvestment: "",
    maxInvestment: "",
  });

  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/projects", filters],
    retry: false,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      location: "",
      minInvestment: "",
      maxInvestment: "",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Available Solar Projects</h2>
          <p className="text-xl text-slate-600">Invest in verified solar installations with guaranteed returns</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="location"
                    placeholder="Search location..."
                    value={filters.location}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="funding">Funding</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="minInvestment">Min Investment</Label>
                <Select value={filters.minInvestment} onValueChange={(value) => handleFilterChange("minInvestment", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Amount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Amount</SelectItem>
                    <SelectItem value="1000">$1,000+</SelectItem>
                    <SelectItem value="5000">$5,000+</SelectItem>
                    <SelectItem value="10000">$10,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="expectedReturn">Expected Return</Label>
                <Select value={filters.maxInvestment} onValueChange={(value) => handleFilterChange("maxInvestment", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Return" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Return</SelectItem>
                    <SelectItem value="8">8%+</SelectItem>
                    <SelectItem value="12">12%+</SelectItem>
                    <SelectItem value="16">16%+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {projects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No projects found matching your criteria.</p>
            <p className="text-slate-400 mt-2">Try adjusting your filters or check back later for new projects.</p>
            <Button onClick={clearFilters} className="mt-4">
              View All Projects
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
