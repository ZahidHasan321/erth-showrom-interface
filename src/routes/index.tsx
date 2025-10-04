import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";

import ErthLogo from "../assets/Logo-03.svg"; // Import Erth Logo
import SakhtbaLogo from "../assets/vite.svg"; // Import Sakhtba Logo
import { BRAND_NAMES } from "@/lib/constants";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [{
      title: "Welcome",
    }]
  }),
});

function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-8">
      <div className="max-w-4xl w-full text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Welcome to Our Platform
        </h1>
        <p className="text-xl text-gray-600">
          Choose a section to proceed to its dedicated dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16"> {/* Increased gap */}
        {/* Erth Section */}
        <div className="flex flex-col items-center">
          <Link to="/$main" params={{ main: BRAND_NAMES.showroom }} className="block group relative -mb-12 z-10"> {/* Elevated Logo Link */}
            <div className="bg-white rounded-full p-6 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
              <img src={ErthLogo} alt="Erth Logo" className="w-32 h-32 object-contain" />
            </div>
          </Link>
          <Link to="/$main" params={{ main: BRAND_NAMES.showroom }} className="block group">
            <Card className="w-full max-w-sm mx-auto flex flex-col items-center pt-20 pb-8 px-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-200 rounded-xl cursor-pointer">
              <CardHeader className="flex flex-col items-center p-0 mb-6">
                <CardTitle className="text-3xl font-bold text-gray-800 mb-2">{BRAND_NAMES.showroom}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-center flex-grow">
                <CardDescription className="text-lg text-gray-600 mb-8">
                  Access the Showroom and comprehensive management tools.
                </CardDescription>
                <Button className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition-colors duration-200">
                  Enter Showroom
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Sakhtba Section */}
        <div className="flex flex-col items-center">
          <Link to="/$main" params={{ main: BRAND_NAMES.fromHome }} className="block group relative -mb-12 z-10"> {/* Elevated Logo Link */}
            <div className="bg-white rounded-full p-6 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
              <img src={SakhtbaLogo} alt="Sakhtba Logo" className="w-32 h-32 object-contain" />
            </div>
          </Link>
          <Link to="/$main" params={{ main: BRAND_NAMES.fromHome }} className="block group">
            <Card className="w-full max-w-sm mx-auto flex flex-col items-center pt-20 pb-8 px-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-200 rounded-xl cursor-pointer">
              <CardHeader className="flex flex-col items-center p-0 mb-6">
                <CardTitle className="text-3xl font-bold text-gray-800 mb-2">{BRAND_NAMES.fromHome}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-center flex-grow">
                <CardDescription className="text-lg text-gray-600 mb-8">
                  Explore the From Home and operational features.
                </CardDescription>
                <Button className="w-full py-3 text-lg bg-green-600 hover:bg-green-700 text-white rounded-md shadow-md transition-colors duration-200">
                  Enter From Home
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
