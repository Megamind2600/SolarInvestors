import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import DashboardStats from "@/components/dashboard-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema } from "@shared/schema";
import { z } from "zod";

const projectFormSchema = insertProjectSchema.extend({
  systemSize: z.number().min(1, "System size must be at least 1 kW"),
  totalFunding: z.number().min(1000, "Total funding must be at least $1,000"),
  expectedReturn: z.number().min(5, "Expected return must be at least 5%"),
  minInvestment: z.number().min(500, "Minimum investment must be at least $500"),
});

export default function SiteOwnerDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      systemSize: 0,
      totalFunding: 0,
      expectedReturn: 0,
      minInvestment: 0,
      monthlyElectricityBill: 0,
      roofDetails: "",
      energyNeeds: "",
    },
  });

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

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/my-projects"],
    retry: false,
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: z.infer<typeof projectFormSchema>) => {
      await apiRequest("POST", "/api/projects", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project submitted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-projects"] });
      form.reset();
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
        description: "Failed to submit project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof projectFormSchema>) => {
    createProjectMutation.mutate(data);
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-50 rounded-2xl p-8 shadow-xl">
          {/* Dashboard Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Welcome, {user.firstName} {user.lastName}
              </h3>
              <p className="text-slate-600">Track your solar installation progress and savings</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 lg:mt-0">
                  <Plus className="mr-2 h-4 w-4" />
                  Submit New Site
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Submit New Solar Project</DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Title</FormLabel>
                            <FormControl>
                              <Input placeholder="My Solar Project" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="City, State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe your solar project..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="systemSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>System Size (kW)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="15" 
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="totalFunding"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Funding Needed ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="25000" 
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="expectedReturn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected Return (%)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="12.5" 
                                step="0.1"
                                {...field}
                                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="minInvestment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Investment ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="1000" 
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="monthlyElectricityBill"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Electricity Bill ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="150" 
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="roofDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Roof Details</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Roof type, condition, age..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="energyNeeds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Energy Needs</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Current usage, future plans..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={createProjectMutation.isPending}
                    >
                      {createProjectMutation.isPending ? "Submitting..." : "Submit Project"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          {!statsLoading && stats && (
            <DashboardStats stats={stats} role="site_owner" />
          )}

          {/* Project Status */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Your Solar Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : projects && projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((project: any) => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <div className="text-xs text-slate-600">Solar</div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-900">{project.title}</h5>
                          <p className="text-sm text-slate-600">{project.systemSize} kW System</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        {project.installationDate && (
                          <p className="text-sm text-slate-600 mt-1">
                            Installed: {new Date(project.installationDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">No projects submitted yet.</p>
                  <p className="text-sm text-slate-400 mt-2">Submit your first solar project to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
