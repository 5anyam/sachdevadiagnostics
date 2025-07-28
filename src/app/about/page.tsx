'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  TestTube, 
  Shield, 
  Award, 
  Clock, 
  Users, 
  Heart, 
  CheckCircle, 
  MapPin,
  Phone,
  Mail,
  Calendar,
  Microscope,
  Building,
  Target,
  Eye,
  Stethoscope,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

const AboutUsPage = () => {
  const [counters, setCounters] = useState({
    years: 0,
    patients: 0,
    tests: 0,
    branches: 0
  });

  // Animated counters
  useEffect(() => {
    const targetValues = {
      years: 30,
      patients: 500000,
      tests: 1000000,
      branches: 5
    };

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;

    const increment = {
      years: targetValues.years / steps,
      patients: targetValues.patients / steps,
      tests: targetValues.tests / steps,
      branches: targetValues.branches / steps
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      if (currentStep < steps) {
        setCounters({
          years: Math.floor(increment.years * currentStep),
          patients: Math.floor(increment.patients * currentStep),
          tests: Math.floor(increment.tests * currentStep),
          branches: Math.floor(increment.branches * currentStep)
        });
        currentStep++;
      } else {
        setCounters(targetValues);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  const achievements = [
    {
      icon: Award,
      title: "NABL Accredited",
      description: "National Accreditation Board for Testing and Calibration Laboratories certified",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Shield,
      title: "ISO 15189:2012 Certified",
      description: "International standard for quality and competence in medical laboratories",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: TestTube,
      title: "Advanced Technology",
      description: "State-of-the-art equipment and latest diagnostic techniques",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Clock,
      title: "Same Day Reports",
      description: "Fast and accurate results with quick turnaround time",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const team = [
    {
      name: "Dr. Rajesh Sachdeva",
      position: "Chief Pathologist & Founder",
      image: "/team/dr-rajesh-sachdeva.jpg",
      qualifications: "MD Pathology, MBBS",
      experience: "30+ Years Experience"
    },
    {
      name: "Dr. Priya Sharma",
      position: "Senior Pathologist",
      image: "/team/dr-priya-sharma.jpg",
      qualifications: "MD Pathology, DCP",
      experience: "15+ Years Experience"
    },
    {
      name: "Dr. Amit Kumar",
      position: "Clinical Biochemist",
      image: "/team/dr-amit-kumar.jpg",
      qualifications: "PhD Biochemistry, MSc",
      experience: "12+ Years Experience"
    },
    {
      name: "Ms. Sunita Verma",
      position: "Lab Manager",
      image: "/team/sunita-verma.jpg",
      qualifications: "MSc MLT, BMLT",
      experience: "20+ Years Experience"
    }
  ];

  const milestones = [
    {
      year: "1993",
      title: "Foundation",
      description: "Sachdeva Diagnostics established with a vision to provide quality healthcare"
    },
    {
      year: "2000",
      title: "First Expansion",
      description: "Opened second branch and introduced advanced testing equipment"
    },
    {
      year: "2010",
      title: "NABL Accreditation",
      description: "Achieved NABL accreditation for quality and reliability"
    },
    {
      year: "2015",
      title: "Digital Revolution",
      description: "Launched online reports and digital health records system"
    },
    {
      year: "2020",
      title: "Home Collection",
      description: "Expanded services with home collection facility during pandemic"
    },
    {
      year: "2023",
      title: "Modern Technology",
      description: "Upgraded to latest diagnostic equipment and AI-assisted reporting"
    }
  ];

  const services = [
    {
      icon: Activity,
      title: "Clinical Pathology",
      description: "Complete blood count, blood chemistry, coagulation studies"
    },
    {
      icon: Microscope,
      title: "Microbiology",
      description: "Culture sensitivity, viral studies, infection screening"
    },
    {
      icon: Heart,
      title: "Cardiology Tests",
      description: "ECG, Echo, stress tests, cardiac markers"
    },
    {
      icon: TestTube,
      title: "Biochemistry",
      description: "Liver function, kidney function, lipid profile, diabetes panel"
    },
    {
      icon: Users,
      title: "Health Packages",
      description: "Comprehensive health checkups for all age groups"
    },
    {
      icon: Building,
      title: "Corporate Wellness",
      description: "Employee health programs and corporate tie-ups"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#194b8c] to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white p-2">
                  <Image 
                    src="/sachdeva-diagnostics-logo.png" 
                    alt="Sachdeva Diagnostics Logo" 
                    width={80} 
                    height={80} 
                    className="object-contain rounded-full"
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Sachdeva Diagnostics</h1>
                  <p className="text-xl opacity-90">30+ Years of Trusted Healthcare</p>
                </div>
              </div>
              
              <p className="text-lg leading-relaxed mb-8">
                Established in 1993, Sachdeva Diagnostics has been at the forefront of providing 
                accurate, reliable, and affordable diagnostic services to the community. With our 
                commitment to excellence and patient care, we have become a trusted name in healthcare.
              </p>

              <div className="flex flex-wrap gap-4">
                <Badge className="bg-green-500 text-white px-4 py-2">
                  <Award className="w-4 h-4 mr-2" />
                  NABL Accredited
                </Badge>
                <Badge className="bg-blue-500 text-white px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  ISO Certified
                </Badge>
                <Badge className="bg-purple-500 text-white px-4 py-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Same Day Reports
                </Badge>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-300">
                      {counters.years}+
                    </div>
                    <div className="text-sm opacity-90">Years of Service</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-300">
                      {(counters.patients / 1000).toFixed(0)}K+
                    </div>
                    <div className="text-sm opacity-90">Happy Patients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-300">
                      {(counters.tests / 1000).toFixed(0)}K+
                    </div>
                    <div className="text-sm opacity-90">Tests Conducted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-300">
                      {counters.branches}
                    </div>
                    <div className="text-sm opacity-90">Branches</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">Our Foundation</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built on strong values and unwavering commitment to healthcare excellence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission */}
            <Card className="border-2 border-[#194b8c]/20 hover:border-[#194b8c] transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#194b8c] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-black">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-center leading-relaxed">
                  To provide accurate, reliable, and timely diagnostic services that enable 
                  healthcare providers to make informed decisions for better patient outcomes. 
                  We are committed to making quality healthcare accessible to all.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="border-2 border-green-500/20 hover:border-green-500 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-black">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-center leading-relaxed">
                  To be the most trusted and preferred diagnostic partner in the region, 
                  known for our excellence in service, innovation in technology, and 
                  unwavering commitment to patient care and satisfaction.
                </p>
              </CardContent>
            </Card>

            {/* Values */}
            <Card className="border-2 border-purple-500/20 hover:border-purple-500 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-black">Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700 text-sm">Accuracy & Precision</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700 text-sm">Patient-Centric Care</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700 text-sm">Ethical Practices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700 text-sm">Continuous Innovation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700 text-sm">Quality Excellence</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">Our Achievements</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Recognized for excellence in healthcare and diagnostic services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${achievement.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <achievement.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2">{achievement.title}</h3>
                  <p className="text-gray-600 text-sm">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">Our Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three decades of growth, innovation, and service to the community
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#194b8c] to-green-500"></div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="border-2 border-gray-200 hover:border-[#194b8c] transition-colors">
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-[#194b8c] mb-2">{milestone.year}</div>
                        <h3 className="text-lg font-bold text-black mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#194b8c] rounded-full border-4 border-white shadow-lg"></div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive diagnostic solutions under one roof
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-gray-200 hover:border-[#194b8c]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#194b8c] to-blue-600 rounded-full flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-black">{service.title}</h3>
                  </div>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">Meet Our Expert Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experienced professionals dedicated to providing the best healthcare services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-[#194b8c] to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Stethoscope className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-black mb-1">{member.name}</h3>
                  <p className="text-[#194b8c] font-medium mb-2">{member.position}</p>
                  <p className="text-sm text-gray-600 mb-1">{member.qualifications}</p>
                  <p className="text-sm text-gray-500">{member.experience}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-20 bg-gradient-to-r from-[#194b8c] to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience Quality Healthcare</h2>
          <p className="text-xl mb-8 opacity-90">
            Trust Sachdeva Diagnostics for accurate results and compassionate care
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-[#194b8c] hover:bg-gray-100 font-semibold px-8 py-3"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Test Online
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[#194b8c] font-semibold px-8 py-3"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call +91 99900 48085
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="flex items-center justify-center gap-3">
              <MapPin className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Visit Our Center</div>
                <div className="text-sm opacity-90">Main Branch, Delhi</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Operating Hours</div>
                <div className="text-sm opacity-90">Mon-Sat: 7AM-9PM</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Mail className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Email Us</div>
                <div className="text-sm opacity-90">info@sachdevadiagnostics.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
