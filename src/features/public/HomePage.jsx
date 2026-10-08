import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, BarChart, PenTool, MonitorSmartphone, Target, Users, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components';
import { Input } from '@/components';

const CATEGORIES = [
  { name: 'Engineering', icon: Code, count: '1,200+' },
  { name: 'Marketing', icon: Target, count: '850+' },
  { name: 'Finance', icon: BarChart, count: '430+' },
  { name: 'Design', icon: PenTool, count: '620+' },
  { name: 'Sales', icon: Zap, count: '1,500+' },
  { name: 'HR', icon: Users, count: '320+' },
  { name: 'Operations', icon: Briefcase, count: '780+' },
  { name: 'IT & Data', icon: MonitorSmartphone, count: '940+' }
];

function Code(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('search', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/jobs?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-indigo-900 to-purple-800 py-24 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Find Your Dream Job
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-2xl mx-auto">
            Discover opportunities that match your skills, passion, and career goals with top companies worldwide.
          </p>

          <form onSubmit={handleSearch} className="mt-8 bg-white p-2 rounded-xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto shadow-xl">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Job title, keyword, or company..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-10 w-full border-0 focus:ring-0 text-gray-900 shadow-none h-12"
              />
            </div>
            <div className="hidden md:block w-px bg-gray-200 mx-2"></div>
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="City, state, or 'Remote'"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 w-full border-0 focus:ring-0 text-gray-900 shadow-none h-12"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8 text-lg w-full md:w-auto">
              Search Jobs
            </Button>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-24">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">10,000+</p>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">Jobs</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">500+</p>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">Companies</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">50,000+</p>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">Candidates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
            <p className="mt-4 text-gray-600">Find the role that fits your expertise perfectly.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all text-left flex flex-col items-start group"
                >
                  <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{cat.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{cat.count} open positions</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-gray-600">Your journey to your next great opportunity starts here.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. Create Profile</h3>
              <p className="text-gray-600">Build your digital resume, highlight your skills, and let companies find you.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-6">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">2. Search Jobs</h3>
              <p className="text-gray-600">Use our advanced filters to find the perfect job that matches your criteria.</p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-6">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">3. Apply & Get Hired</h3>
              <p className="text-gray-600">Apply to multiple jobs with one click and track your applications easily.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
