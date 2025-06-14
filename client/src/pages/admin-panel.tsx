import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  Users, 
  Zap, 
  DollarSign, 
  TrendingUp, 
  Leaf,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings
} from "lucide-react";

export default function AdminPanel() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if not authenticated or not admin
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
    
    if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive",
      });
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: adminStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    retry: false,
    enabled: user?.role === 'admin',
  });

  const { data: allProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    retry: false,
    enabled: user?.role === 'admin',
  });

  const updateProjectStatusMutation = useMutation({
    mutationFn: async ({ projectId, status }: { projectId: number; status: string }) => {
      await apiRequest("PATCH", `/api/admin/projects/${projectId}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project status updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update project status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (projectId: number, status: string) => {
    updateProjectStatusMutation.mutate({ projectId, status });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "funding":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
              <p className="text-slate-600">You don't have permission to access the admin panel.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-xl overflow-hidden">
          {/* Admin Navigation Header */}
          <div className="bg-slate-800 text-white px-8 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Admin Dashboard</h3>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-slate-300">Welcome, {user.firstName} {user.lastName}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-300 hover:text-white"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-slate-50 p-6 border-r border-slate-200">
              <nav className="space-y-2">
                <Button variant="default" className="w-full justify-start">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Overview
                </Button>
                <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-100">
                  <Zap className="w-5 h-5 mr-3" />
                  Projects
                </Button>
                <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-100">
                  <Users className="w-5 h-5 mr-3" />
                  Users
                </Button>
                <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-100">
                  <DollarSign className="w-5 h-5 mr-3" />
                  Payments
                </Button>
                <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-100">
                  <Settings className="w-5 h-5 mr-3" />
                  Settings
                </Button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              {/* Overview Stats */}
              {!statsLoading && adminStats && (
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm font-medium">Total Projects</p>
                          <p className="text-3xl font-bold">{adminStats.totalProjects || 0}</p>
                          <p className="text-blue-100 text-sm">
                            {adminStats.activeProjects || 0} active
                          </p>
                        </div>
                        <div className="bg-blue-400 p-3 rounded-full">
                          <Zap className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-emerald-100 text-sm font-medium">Total Users</p>
                          <p className="text-3xl font-bold">{adminStats.totalUsers || 0}</p>
                          <p className="text-emerald-100 text-sm">
                            {adminStats.investors || 0} investors, {adminStats.siteOwners || 0} owners
                          </p>
                        </div>
                        <div className="bg-emerald-400 p-3 rounded-full">
                          <Users className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-amber-100 text-sm font-medium">Total Investment</p>
                          <p className="text-3xl font-bold">
                            ${(adminStats.totalInvestment || 0).toLocaleString()}
                          </p>
                          <p className="text-amber-100 text-sm">
                            {adminStats.activeInvestments || 0} active investments
                          </p>
                        </div>
                        <div className="bg-amber-400 p-3 rounded-full">
                          <DollarSign className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm font-medium">Energy Generated</p>
                          <p className="text-3xl font-bold">{adminStats.energyGenerated || 0} MWh</p>
                          <p className="text-purple-100 text-sm">This month</p>
                        </div>
                        <div className="bg-purple-400 p-3 rounded-full">
                          <Leaf className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Projects */}
                <Card className="bg-slate-50">
                  <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {projectsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                      </div>
                    ) : allProjects && allProjects.length > 0 ? (
                      <div className="space-y-3">
                        {allProjects.slice(0, 5).map((project: any) => (
                          <div key={project.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{project.title}</p>
                              <p className="text-sm text-slate-600">
                                {project.systemSize}kW • ${parseFloat(project.totalFunding || "0").toLocaleString()} funding
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(project.status)}>
                                {project.status}
                              </Badge>
                              <Select 
                                value={project.status} 
                                onValueChange={(value) => handleStatusUpdate(project.id, value)}
                                disabled={updateProjectStatusMutation.isPending}
                              >
                                <SelectTrigger className="w-24 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="funding">Funding</SelectItem>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-slate-500">No projects found.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card className="bg-slate-50">
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Payment Processing</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-600 text-sm font-medium">Operational</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">API Services</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-600 text-sm font-medium">Operational</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Email Notifications</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-yellow-600 text-sm font-medium">Delayed</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Database</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-600 text-sm font-medium">Operational</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Authentication</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-600 text-sm font-medium">Operational</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
