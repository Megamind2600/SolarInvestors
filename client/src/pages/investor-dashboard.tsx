import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import DashboardStats from "@/components/dashboard-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Plus } from "lucide-react";

export default function InvestorDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/my-stats"],
    retry: false,
  });

  const { data: investments, isLoading: investmentsLoading } = useQuery({
    queryKey: ["/api/my-investments"],
    retry: false,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          {/* Dashboard Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Welcome, {user.firstName} {user.lastName}
              </h3>
              <p className="text-slate-600">Your sustainable investment portfolio</p>
            </div>
            
            <Link href="/projects">
              <Button className="mt-4 lg:mt-0 bg-secondary hover:bg-secondary/90">
                <Plus className="mr-2 h-4 w-4" />
                New Investment
              </Button>
            </Link>
          </div>

          {/* Investment Stats */}
          {!statsLoading && stats && (
            <DashboardStats stats={stats} role="investor" />
          )}

          {/* Portfolio Performance & Investment Breakdown */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-slate-50">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <div className="text-slate-600 text-sm">Portfolio Chart Placeholder</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-50">
              <CardHeader>
                <CardTitle>Investment Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Residential Solar</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-slate-200 rounded-full h-2 mr-3">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <span className="text-slate-900 font-medium">65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Commercial Solar</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-slate-200 rounded-full h-2 mr-3">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                    <span className="text-slate-900 font-medium">35%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Investments */}
          <Card className="bg-slate-50">
            <CardHeader>
              <CardTitle>Active Investments</CardTitle>
            </CardHeader>
            <CardContent>
              {investmentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : investments && investments.length > 0 ? (
                <div className="space-y-4">
                  {investments.map((investment: any) => (
                    <div key={investment.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <div className="text-xs text-slate-600">Solar</div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-900">{investment.project?.title || "Solar Project"}</h5>
                          <p className="text-sm text-slate-600">
                            ${parseFloat(investment.amount).toLocaleString()} invested • 
                            {investment.lockInPeriod}-year lock-in
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          +${parseFloat(investment.totalEarnings || "0").toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-600">
                          {investment.expectedReturn}% return
                        </p>
                        <Badge className={getStatusColor(investment.status)}>
                          {investment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">No investments yet.</p>
                  <p className="text-sm text-slate-400 mt-2">Browse available projects to start investing!</p>
                  <Link href="/projects">
                    <Button className="mt-4">Browse Projects</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
