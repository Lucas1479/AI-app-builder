import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  SparklesIcon, 
  BoltIcon, 
  CogIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const exampleRef = useRef(null);

  useEffect(() => {
    // 初始动画：延迟显示内容
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    // 滚动监听
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Analysis',
      description: 'Our AI analyzes your app description and extracts structured requirements automatically.',
    },
    {
      icon: BoltIcon,
      title: 'Dynamic UI Generation',
      description: 'Generate interactive forms and interfaces based on your requirements.',
    },
    {
      icon: CogIcon,
      title: 'Customizable Components',
      description: 'Easily modify and extend your generated app with modern UI components.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Describe Your App',
      description: 'Tell us what kind of app you want to build in plain English.',
    },
    {
      number: '2',
      title: 'AI Analysis',
      description: 'Our AI extracts entities, roles, and features from your description.',
    },
    {
      number: '3',
      title: 'Generate UI',
      description: 'Get a fully functional mock UI with forms and navigation.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Screen */}
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
        <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Build Apps with
            <span className="text-primary-600"> AI Power</span>
          </h1>
          <p className={`text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Describe your app idea in plain English, and our AI will analyze your requirements 
            and generate a complete mock UI with forms, navigation, and components.
          </p>
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center transition-all duration-1000 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link
              to="/builder"
              className="btn-primary px-6 sm:px-8 py-3 text-base sm:text-lg flex items-center justify-center space-x-2 hover:scale-105 transition-transform duration-200"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>Start Building</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <button
              onClick={() => {
                if (exampleRef.current) {
                  exampleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
              }}
              className="btn-secondary px-6 sm:px-8 py-3 text-base sm:text-lg hover:scale-105 transition-transform duration-200"
            >
              View Examples
            </button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-500 z-50 ${isScrolled ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="flex flex-col items-center space-y-2 text-gray-500">
            <span className="text-sm font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-500 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections - Appear on scroll */}
      <div className={`transition-all duration-1000 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="space-y-12 px-4 pb-12">

          {/* Features Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-md transition-all duration-300 hover:scale-105">
                <div className="flex justify-center mb-3">
                  <div className="p-2.5 bg-primary-100 rounded-lg">
                    <feature.icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* How It Works Section */}
          <div className="card">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                How It Works
              </h2>
              <p className="text-base text-gray-600">
                Get from idea to mock app in just three simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-600 text-white rounded-full flex items-center justify-center text-base md:text-lg font-bold">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Example Section */}
          <div className="card" ref={exampleRef}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Example: Course Management App
              </h2>
              <p className="text-base text-gray-600">
                See how our AI transforms a simple description into a complete app
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Input Description</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700 italic">
                    "I want an app to manage student courses and grades. Teachers add courses, 
                    students enroll, and admins manage reports."
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Generated Output</h3>
                <div className="space-y-2">
                  <div className="bg-primary-50 p-2.5 rounded-lg">
                    <span className="text-sm font-medium text-primary-900">App Name:</span>
                    <span className="ml-2 text-sm text-primary-700">Course Manager</span>
                  </div>
                  <div className="bg-green-50 p-2.5 rounded-lg">
                    <span className="text-sm font-medium text-green-900">Entities:</span>
                    <span className="ml-2 text-sm text-green-700">Student, Course, Grade</span>
                  </div>
                  <div className="bg-blue-50 p-2.5 rounded-lg">
                    <span className="text-sm font-medium text-blue-900">Roles:</span>
                    <span className="ml-2 text-sm text-blue-700">Teacher, Student, Admin</span>
                  </div>
                  <div className="bg-purple-50 p-2.5 rounded-lg">
                    <span className="text-sm font-medium text-purple-900">Features:</span>
                    <span className="ml-2 text-sm text-purple-700">Add course, Enroll students, View reports</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="card text-center bg-primary-50 border-primary-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Build Your App?
            </h2>
            <p className="text-base text-gray-600 mb-4">
              Start describing your app idea and see the magic happen
            </p>
            <Link
              to="/builder"
              className="btn-primary px-6 py-2.5 text-base inline-flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>Get Started Now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
