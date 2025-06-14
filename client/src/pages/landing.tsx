import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun, Home, TrendingUp, CheckCircle, Twitter, Linkedin, Facebook } from "lucide-react";
import Navigation from "@/components/navigation";

export default function Landing() {
  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="bg-slate-50 font-inter">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Invest in Solar,<br />
                <span className="text-accent">Earn for 20 Years</span>
              </h1>
              <p className="text-xl mb-8 text-slate-100">
                Connect site owners with investors through our two-sided marketplace. 
                Get free solar installation or invest in sustainable energy projects with guaranteed returns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-white text-primary px-8 py-4 text-lg font-semibold hover:bg-slate-100"
                  onClick={handleGetStarted}
                >
                  <Home className="mr-2 h-5 w-5" />
                  I Own Property
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-primary"
                  onClick={handleGetStarted}
                >
                  <TrendingUp className="mr-2 h-5 w-5" />
                  I Want to Invest
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-emerald-200 to-blue-200 rounded-2xl flex items-center justify-center">
                <div className="text-slate-600 text-lg">Modern Solar Installation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">How SolarInvestors Works</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our platform connects property owners who want free solar installations with investors seeking sustainable returns
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Site Owners */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 solar-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-primary text-white p-3 rounded-full mr-4">
                    <Home className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">For Site Owners</h3>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="text-primary mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>Free Installation:</strong> No upfront costs for solar panel installation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-primary mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>20% Discount:</strong> Get electricity at 20% below market rates
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-primary mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>Full Coverage:</strong> Free maintenance and insurance included
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-primary mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>Buyout Option:</strong> Purchase installation at depreciated value anytime
                    </span>
                  </li>
                </ul>
                <Button className="w-full" onClick={handleGetStarted}>
                  Submit Your Site
                </Button>
              </CardContent>
            </Card>

            {/* Investors */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 solar-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-secondary text-white p-3 rounded-full mr-4">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">For Investors</h3>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="text-secondary mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>SIP Investments:</strong> Flexible investment amounts with lock-in periods
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-secondary mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>20-Year Returns:</strong> Steady income from electricity generation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-secondary mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>Transparent Tracking:</strong> Monitor your investments and earnings
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-secondary mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>Green Impact:</strong> Support sustainable energy while earning
                    </span>
                  </li>
                </ul>
                <Button className="w-full bg-secondary hover:bg-secondary/90" onClick={handleGetStarted}>
                  Start Investing
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Forms */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Get Started Today</h2>
            <p className="text-xl text-slate-600">Choose your role to begin your solar journey</p>
          </div>

          <Card className="shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Site Owner Registration Preview */}
              <div className="p-8 border-r border-slate-200">
                <div className="text-center mb-6">
                  <div className="bg-primary text-white p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Home className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Site Owner Registration</h3>
                  <p className="text-slate-600 mt-2">Get free solar installation for your property</p>
                </div>
                
                <Button className="w-full" onClick={handleGetStarted}>
                  Register as Site Owner
                </Button>
              </div>

              {/* Investor Registration Preview */}
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-secondary text-white p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Investor Registration</h3>
                  <p className="text-slate-600 mt-2">Start earning from solar investments</p>
                </div>
                
                <Button className="w-full bg-secondary hover:bg-secondary/90" onClick={handleGetStarted}>
                  Register as Investor
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <Sun className="text-primary text-2xl mr-3" />
                <span className="text-xl font-bold">SolarInvestors</span>
              </div>
              <p className="text-slate-300 mb-6 max-w-md">
                Connecting property owners with investors to accelerate the adoption of sustainable solar energy across communities.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-2">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-2">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-2">
                  <Facebook className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Site Owners</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto">Submit Your Site</Button></li>
                <li><Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto">How It Works</Button></li>
                <li><Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto">Benefits</Button></li>
                <li><Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto">Site Requirements</Button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Investors</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto">Browse Projects</Button></li>
                <li><Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto">Investment Guide</Button></li>
                <li><Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto">Returns Calculator</Button></li>
                <li><Button variant="link" className="text-slate-300 hover:text-white p-0 h-auto">Risk Disclosure</Button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 SolarInvestors. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
