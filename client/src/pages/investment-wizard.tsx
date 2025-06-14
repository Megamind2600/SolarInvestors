import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import InvestmentCalculator from "@/components/investment-calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function InvestmentWizard() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState(1);
  const [investmentData, setInvestmentData] = useState({
    amount: 0,
    lockInPeriod: 5,
    projectedReturn: 0,
    monthlyAvg: 0,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
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
  }, [isAuthenticated, authLoading, toast]);

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: [`/api/projects/${projectId}`],
    retry: false,
    enabled: !!projectId,
  });

  const createInvestmentMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/investments", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Investment created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-investments"] });
      setStep(4); // Success step
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
        description: "Failed to create investment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInvestmentCalculation = (data: any) => {
    setInvestmentData(data);
  };

  const handleCreateInvestment = () => {
    if (!project || !user) return;

    createInvestmentMutation.mutate({
      projectId: parseInt(projectId!),
      amount: investmentData.amount.toString(),
      lockInPeriod: investmentData.lockInPeriod,
      expectedReturn: project.expectedReturn,
      status: "active",
    });
  };

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < step) return "completed";
    if (stepNumber === step) return "current";
    return "upcoming";
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">Project not found.</p>
            <Link href="/projects">
              <Button className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fundingPercentage = (parseFloat(project.currentFunding || "0") / parseFloat(project.totalFunding)) * 100;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Investment Wizard</h2>
          <p className="text-xl text-slate-600">Complete your solar investment in simple steps</p>
        </div>

        <Card className="shadow-xl overflow-hidden">
          {/* Progress Steps */}
          <div className="bg-slate-50 px-8 py-6">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    getStepStatus(stepNumber) === "completed" 
                      ? "bg-green-500 text-white"
                      : getStepStatus(stepNumber) === "current"
                      ? "bg-primary text-white"
                      : "bg-slate-300 text-slate-600"
                  }`}>
                    {getStepStatus(stepNumber) === "completed" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${
                    getStepStatus(stepNumber) === "current" ? "text-slate-900" : "text-slate-600"
                  }`}>
                    {stepNumber === 1 && "Project Details"}
                    {stepNumber === 2 && "Investment Amount"}
                    {stepNumber === 3 && "Confirmation"}
                  </span>
                  {stepNumber < 3 && <div className="w-12 h-px bg-slate-300 mx-4" />}
                </div>
              ))}
            </div>
          </div>

          <CardContent className="p-8">
            {step === 1 && (
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Project Details</h3>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <div className="aspect-video bg-gradient-to-br from-emerald-200 to-blue-200 rounded-xl flex items-center justify-center mb-6">
                      <div className="text-slate-600 text-lg">Solar Project Image</div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Project Type</span>
                        <span className="font-semibold text-slate-900">Solar Installation</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">System Size</span>
                        <span className="font-semibold text-slate-900">{project.systemSize} kW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Expected Return</span>
                        <span className="font-semibold text-green-600">{project.expectedReturn}% APR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Location</span>
                        <span className="font-semibold text-slate-900">{project.location}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-slate-900 mb-4">{project.title}</h4>
                    <p className="text-slate-600 mb-6">{project.description}</p>
                    
                    <div className="bg-slate-50 p-4 rounded-lg mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-green-100 text-green-800">{project.status}</Badge>
                        <span className="text-sm text-slate-600">
                          ${parseFloat(project.currentFunding || "0").toLocaleString()} / 
                          ${parseFloat(project.totalFunding).toLocaleString()}
                        </span>
                      </div>
                      <Progress value={fundingPercentage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Min Investment</p>
                        <p className="text-lg font-semibold text-slate-900">
                          ${parseFloat(project.minInvestment).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Total Funding</p>
                        <p className="text-lg font-semibold text-slate-900">
                          ${parseFloat(project.totalFunding).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Link href="/projects">
                    <Button variant="outline">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Projects
                    </Button>
                  </Link>
                  <Button onClick={() => setStep(2)}>
                    Continue to Investment
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Investment Amount</h3>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <InvestmentCalculator
                    minInvestment={parseFloat(project.minInvestment)}
                    expectedReturn={parseFloat(project.expectedReturn)}
                    onCalculationChange={handleInvestmentCalculation}
                  />
                  
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Projected Returns</h4>
                    <div className="h-48 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-slate-600 text-sm">Returns Chart Placeholder</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          ${investmentData.projectedReturn.toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-600">Total Return</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          ${investmentData.monthlyAvg.toFixed(0)}
                        </p>
                        <p className="text-sm text-slate-600">Monthly Avg</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} disabled={investmentData.amount < parseFloat(project.minInvestment)}>
                    Continue to Confirmation
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Confirm Investment</h3>
                
                <div className="bg-slate-50 p-6 rounded-lg mb-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Investment Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Project</span>
                      <span className="font-semibold text-slate-900">{project.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Investment Amount</span>
                      <span className="font-semibold text-slate-900">${investmentData.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Lock-in Period</span>
                      <span className="font-semibold text-slate-900">{investmentData.lockInPeriod} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Expected Return</span>
                      <span className="font-semibold text-green-600">{project.expectedReturn}% APR</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-3">
                      <span className="text-slate-600">Total Projected Return</span>
                      <span className="font-bold text-green-600">${investmentData.projectedReturn.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Important:</strong> This is a long-term investment with a {investmentData.lockInPeriod}-year lock-in period. 
                    Returns are projected based on solar energy generation and may vary based on actual performance.
                  </p>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleCreateInvestment}
                    disabled={createInvestmentMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {createInvestmentMutation.isPending ? "Processing..." : "Confirm Investment"}
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                <div className="mb-6">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Investment Successful!</h3>
                  <p className="text-slate-600">Your investment has been confirmed and is now active.</p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg mb-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">What's Next?</h4>
                  <ul className="text-left space-y-2 text-slate-600">
                    <li>• Track your investment performance in your dashboard</li>
                    <li>• Receive monthly payout notifications</li>
                    <li>• Get project updates as installation progresses</li>
                  </ul>
                </div>

                <div className="flex justify-center space-x-4">
                  <Link href="/dashboard">
                    <Button>View Dashboard</Button>
                  </Link>
                  <Link href="/projects">
                    <Button variant="outline">Browse More Projects</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
