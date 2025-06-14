import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const fundingPercentage = project.totalFunding 
    ? (parseFloat(project.currentFunding || "0") / parseFloat(project.totalFunding)) * 100
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "funding":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <Card className="bg-white border border-slate-200 hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center">
        <div className="text-slate-500 text-sm">Solar Project Image</div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-900">{project.title}</h3>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>
        
        <p className="text-slate-600 mb-4 line-clamp-2">
          {project.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-slate-500">System Size</p>
            <p className="font-semibold text-slate-900">{project.systemSize} kW</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Location</p>
            <p className="font-semibold text-slate-900">{project.location}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Min Investment</p>
            <p className="font-semibold text-slate-900">
              ${parseFloat(project.minInvestment).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Expected Return</p>
            <p className="font-semibold text-green-600">
              {project.expectedReturn}% APR
            </p>
          </div>
        </div>

        {project.status === "funding" && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Funding Progress</span>
              <span>
                ${parseFloat(project.currentFunding || "0").toLocaleString()} / 
                ${parseFloat(project.totalFunding).toLocaleString()}
              </span>
            </div>
            <Progress value={fundingPercentage} className="h-2" />
          </div>
        )}

        <Link href={`/invest/${project.id}`}>
          <Button className="w-full">
            {project.status === "funding" ? "View Details & Invest" : "View Details"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
