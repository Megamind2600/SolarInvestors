import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InvestmentCalculatorProps {
  minInvestment: number;
  expectedReturn: number;
  onCalculationChange: (data: { amount: number; lockInPeriod: number; projectedReturn: number; monthlyAvg: number }) => void;
}

export default function InvestmentCalculator({ 
  minInvestment, 
  expectedReturn, 
  onCalculationChange 
}: InvestmentCalculatorProps) {
  const [amount, setAmount] = useState(minInvestment);
  const [lockInPeriod, setLockInPeriod] = useState(5);

  useEffect(() => {
    const calculateReturns = () => {
      const annualReturn = (amount * expectedReturn) / 100;
      const totalReturn = annualReturn * lockInPeriod;
      const monthlyAvg = totalReturn / (lockInPeriod * 12);
      
      onCalculationChange({
        amount,
        lockInPeriod,
        projectedReturn: totalReturn,
        monthlyAvg,
      });
    };

    calculateReturns();
  }, [amount, lockInPeriod, expectedReturn, onCalculationChange]);

  const getReturnRate = (period: number) => {
    // Longer lock-in periods get slightly better rates
    const baseRate = expectedReturn;
    const bonus = (period - 3) * 0.5; // 0.5% bonus per year beyond 3 years
    return Math.max(baseRate + bonus, baseRate).toFixed(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="amount">Investment Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-slate-500">$</span>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || minInvestment)}
              className="pl-8"
              min={minInvestment}
            />
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Minimum: ${minInvestment.toLocaleString()}
          </p>
        </div>
        
        <div>
          <Label htmlFor="lockInPeriod">Lock-in Period</Label>
          <Select value={lockInPeriod.toString()} onValueChange={(value) => setLockInPeriod(parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Years ({getReturnRate(3)}% APR)</SelectItem>
              <SelectItem value="5">5 Years ({getReturnRate(5)}% APR)</SelectItem>
              <SelectItem value="7">7 Years ({getReturnRate(7)}% APR)</SelectItem>
              <SelectItem value="10">10 Years ({getReturnRate(10)}% APR)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                ${((amount * getReturnRate(lockInPeriod) / 100) * lockInPeriod).toLocaleString()}
              </p>
              <p className="text-sm text-slate-600">Total Return</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                ${(((amount * getReturnRate(lockInPeriod) / 100) * lockInPeriod) / (lockInPeriod * 12)).toFixed(0)}
              </p>
              <p className="text-sm text-slate-600">Monthly Avg</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
