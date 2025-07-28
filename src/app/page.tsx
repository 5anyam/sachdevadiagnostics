'use client'
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { ArrowRight, CheckCircle, Clock, Users, Award, Phone, MapPin, Mail, Calendar } from "lucide-react";
import Head from "next/head";
// Import your existing components that fetch from WooCommerce
import CircularCategoriesCarousel from "../../components/CircularCategoriesCarousel";
import FeaturedProducts from "../../components/FeaturedProducts";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <Head>
        <title>Sachdeva Diagnostics - Trusted Diagnostic Services in North West Delhi | 30+ Years of Excellence</title>
        <meta name="description" content="Sachdeva Diagnostics - A trusted name in diagnostic services in North West Delhi for the past 30 years, proudly collaborates with LifeCell diagnostics to extend our commitment to comprehensive healthcare." />
        <meta name="keywords" content="diagnostic center, pathology lab, blood tests, health checkup, medical tests, radiology, North West Delhi, LifeCell diagnostics" />
        <link rel="canonical" href="/" />
      </Head>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(59,130,246,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_0%_100%,rgba(16,185,129,0.1),transparent)]"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-block p-2 bg-gradient-to-r from-blue-100 to-green-100 rounded-full mb-6">
              <span className="text-sm font-semibold text-blue-700 px-4">30+ Years of Trusted Healthcare</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-900 via-blue-700 to-green-600 bg-clip-text text-transparent">
                Sachdeva Diagnostics
              </span>
              <br />
              <span className="text-3xl md:text-4xl text-gray-700 font-medium">
                Your Health, Our Priority
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-4xl mx-auto">
              A trusted name in diagnostic services in North West Delhi for the past 30 years, 
              proudly collaborating with LifeCell diagnostics to extend our commitment to comprehensive healthcare.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              <Link href="/book-test">
                <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
                  <span className="relative flex items-center">
                    Book Test Online
                    <Calendar className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
              
              <Link href="/contact">
                <Button className="group relative overflow-hidden bg-transparent border-2 border-green-600 text-green-600 hover:text-white hover:bg-green-600 px-8 py-6 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
                  <span className="relative flex items-center">
                    Contact Us
                    <Phone className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { number: "30+", label: "Years Experience" },
                { number: "50,000+", label: "Happy Patients" },
                { number: "200+", label: "Test Types" },
                { number: "24/7", label: "Emergency Service" }
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-4 rounded-xl bg-white/70 backdrop-blur-sm shadow-lg">
                  <div className="text-2xl md:text-3xl font-bold text-blue-700 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-4">
        
        {/* Test Categories Section - Fetches from WooCommerce Categories */}
        <section className="py-16">
          <div className="text-center mb-12">
            <div className="inline-block p-2 bg-gradient-to-r from-blue-100 to-green-100 rounded-full mb-4">
              <span className="text-sm font-semibold text-blue-700 px-3">Test Categories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-900 via-blue-700 to-green-600 bg-clip-text text-transparent">
              Browse by Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Find the right diagnostic tests organized by medical specialties and health concerns
            </p>
          </div>
          <CircularCategoriesCarousel />
        </section>

        {/* Featured Tests/Packages Section - Fetches from WooCommerce Products */}
        <section className="py-16">
          <div className="text-center mb-12">
            <div className="inline-block p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-4">
              <span className="text-sm font-semibold text-green-700 px-3">Popular Tests & Packages</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-700 to-blue-900 bg-clip-text text-transparent">
              Most Booked Health Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive health checkup packages designed for different age groups and health requirements
            </p>
          </div>
          <FeaturedProducts />
        </section>

        {/* Services Overview Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl my-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block p-2 bg-gradient-to-r from-blue-100 to-green-100 rounded-full mb-4">
                <span className="text-sm font-semibold text-blue-700 px-3">Our Services</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-900 via-blue-700 to-green-600 bg-clip-text text-transparent">
                Comprehensive Diagnostic Solutions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                From routine health checkups to specialized diagnostic tests, we offer a complete range of medical testing services
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Pathology Lab",
                  description: "Complete blood analysis, biochemistry, microbiology, and specialized pathology tests",
                  icon: "🩸",
                  features: ["Blood Tests", "Urine Analysis", "Hormone Tests", "Infection Screening"]
                },
                {
                  title: "Radiology Services",
                  description: "Advanced imaging services including X-Ray, Ultrasound, CT Scan, and MRI",
                  icon: "🔬",
                  features: ["X-Ray", "Ultrasound", "CT Scan", "MRI"]
                },
                {
                  title: "Health Checkups",
                  description: "Comprehensive health packages for different age groups and requirements",
                  icon: "❤️",
                  features: ["Annual Checkup", "Cardiac Profile", "Diabetes Panel", "Senior Package"]
                },
                {
                  title: "Home Collection",
                  description: "Convenient home sample collection service with trained phlebotomists",
                  icon: "🏠",
                  features: ["Blood Collection", "Sample Pickup", "Report Delivery", "Emergency Service"]
                },
                {
                  title: "Corporate Wellness",
                  description: "Customized health packages for organizations and employee wellness programs",
                  icon: "🏢",
                  features: ["Employee Health", "Pre-employment", "Periodic Checkups", "Wellness Programs"]
                },
                {
                  title: "Specialized Tests",
                  description: "Advanced diagnostic tests for cancer screening and genetic testing",
                  icon: "🧬",
                  features: ["Cancer Markers", "Genetic Tests", "Allergy Panel", "Auto-immune Tests"]
                }
              ].map((service, idx) => (
                <Card key={idx} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl overflow-hidden hover:scale-105">
                  <CardContent className="p-8">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{service.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, featureIdx) => (
                        <div key={featureIdx} className="flex items-center text-sm text-gray-500">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-xl">
                      View Tests
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(59,130,246,0.1),transparent)]"></div>
          </div>
          
          <div className="relative container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block p-2 bg-gradient-to-r from-blue-100 to-green-100 rounded-full mb-4">
                <span className="text-sm font-semibold text-blue-700 px-3">Why Choose Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-900 via-blue-700 to-green-600 bg-clip-text text-transparent">
                Excellence in Healthcare
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Three decades of trusted service with cutting-edge technology and compassionate care
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "NABL Accredited Lab",
                  description: "Our laboratory is NABL accredited ensuring the highest standards of quality and accuracy in all test results",
                  icon: <Award className="h-10 w-10" />,
                  gradient: "from-blue-400 to-blue-600",
                  bgGradient: "from-blue-50 to-blue-100"
                },
                {
                  title: "Experienced Team",
                  description: "Our team of qualified pathologists and technicians with decades of experience ensure reliable diagnostics",
                  icon: <Users className="h-10 w-10" />,
                  gradient: "from-green-400 to-green-600",
                  bgGradient: "from-green-50 to-green-100"
                },
                {
                  title: "Fast & Accurate Reports",
                  description: "Quick turnaround time with precise results delivered through digital platforms for your convenience",
                  icon: <Clock className="h-10 w-10" />,
                  gradient: "from-purple-400 to-purple-600",
                  bgGradient: "from-purple-50 to-purple-100"
                }
              ].map((feature, idx) => (
                <div key={idx} className="group relative">
                  <Card className="relative border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden group-hover:bg-white/90 hover:scale-105">
                    <CardContent className="p-8 text-center relative">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact & Location Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block p-2 bg-gradient-to-r from-blue-100 to-green-100 rounded-full mb-4">
                  <span className="text-sm font-semibold text-blue-700 px-3">Visit Us</span>
                </div>
                <h2 className="text-4xl font-bold mb-6 text-gray-900">
                  Convenient Location in North West Delhi
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Easy to reach with ample parking facilities and a comfortable environment for all your diagnostic needs.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-600">North West Delhi, Near LifeCell Diagnostics</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-green-600 mr-4 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                      <p className="text-gray-600">+91 99900 48085</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-purple-600 mr-4 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-600">info@sachdevadiagnostics.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-6 w-6 text-orange-600 mr-4 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Hours</h4>
                      <p className="text-gray-600">Mon-Sat: 7:00 AM - 9:00 PM<br />Sun: 8:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg">Interactive Map Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Call to Action */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-green-700">
          <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(255,255,255,0.1),transparent)]"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block p-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <span className="text-sm font-semibold text-white px-4">Book Your Test Today</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Your Health Journey
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
                Starts Here
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
              Experience 30 years of trusted diagnostic excellence. Book your test online or visit our center for comprehensive healthcare solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
              <Link href="/book-test">
                <Button className="group relative overflow-hidden bg-white text-gray-900 hover:text-white px-8 py-6 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <span className="relative flex items-center">
                    Book Test Online
                    <Calendar className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
              
              <Link href="/packages">
                <Button className="group relative overflow-hidden bg-transparent border-2 border-white text-white hover:text-gray-900 px-8 py-6 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
                  <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <span className="relative flex items-center">
                    View Health Packages
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                NABL Accredited
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                Home Sample Collection
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                Digital Reports
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                24/7 Emergency Service
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
