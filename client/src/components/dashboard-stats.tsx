import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Zap, Leaf, DollarSign } from "lucide-react";

interface StatsProps {
  stats: {
    totalInvested?: number;
    totalEarnings?: number;
    monthlyIncome?: number;
    activeInvestments?: number;
    totalSavings?: number;
    energyGenerated?: number;
    co2Avoided?: number;
    totalProjects?: number;
    activeProjects?: number;
    totalFunding?: number;
  };
  role: string;
}

export default function DashboardStats({ stats, role }: StatsProps) {
  if (role === "investor") {
    return (
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total Invested</p>
                <p className="text-2xl font-bold">
                  ${stats.totalInvested?.toLocaleString() || 0}
                </p>
                <p className="text-emerald-100 text-sm mt-1">
                  {stats.activeInvestments || 0} projects
                </p>
              </div>
              <div className="bg-emerald-400 p-3 rounded-full">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Earnings</p>
                <p className="text-2xl font-bold">
                  ${stats.totalEarnings?.toLocaleString() || 0}
                </p>
                <p className="text-blue-100 text-sm mt-1">
                  +{((stats.totalEarnings || 0) / (stats.totalInvested || 1) * 100).toFixed(1)}% return
                </p>
              </div>
              <div className="bg-blue-400 p-3 rounded-full">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Monthly Income</p>
                <p className="text-2xl font-bold">
                  ${stats.monthlyIncome?.toLocaleString() || 0}
                </p>
                <p className="text-amber-100 text-sm mt-1">Last 30 days</p>
              </div>
              <div className="bg-amber-400 p-3 rounded-full">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Carbon Offset</p>
                <p className="text-2xl font-bold">2.1 tons</p>
                <p className="text-purple-100 text-sm mt-1">CO2 avoided</p>
              </div>
              <div className="bg-purple-400 p-3 rounded-full">
                <Leaf className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (role === "site_owner") {
    return (
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Savings</p>
                <p className="text-2xl font-bold text-slate-900">
                  ${stats.totalSavings?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="text-green-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Energy Generated</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.energyGenerated?.toLocaleString() || 0} kWh
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Zap className="text-yellow-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">CO2 Avoided</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.co2Avoided?.toLocaleString() || 0} lbs
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <Leaf className="text-emerald-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
