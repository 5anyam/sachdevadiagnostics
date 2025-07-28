import { CalendarDays, MessageSquare, CheckCircle, PartyPopper, ArrowRight } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    id: 1,
    title: "Choose a Package",
    description: "Browse our decoration packages or customize according to your needs",
    icon: CheckCircle,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
    delay: "0ms"
  },
  {
    id: 2,
    title: "Book a Date",
    description: "Select your event date and time using our easy booking system",
    icon: CalendarDays,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
    delay: "100ms"
  },
  {
    id: 3,
    title: "Consultation",
    description: "Our team will contact you to discuss your requirements",
    icon: MessageSquare,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
    delay: "200ms"
  },
  {
    id: 4,
    title: "Enjoy Your Event",
    description: "We handle the setup and create a magical experience for you",
    icon: PartyPopper,
    color: "from-orange-500 to-red-600",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
    delay: "300ms"
  }
];

const HowItWorks = () => {
  const [hoveredStep, setHoveredStep] = useState(null);

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden">
      <div className="mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-4">
            <PartyPopper className="h-4 w-4" />
            Simple Process
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our seamless 4-step process transforms your vision into reality with zero stress
          </p>
        </div>
        
        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-200 via-pink-200 to-orange-200 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className="group relative"
                style={{ animationDelay: step.delay }}
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Connection Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ArrowRight className="h-6 w-6 text-gray-300 group-hover:text-purple-500 transition-colors duration-300" />
                  </div>
                )}
                
                {/* Step Card */}
                <div 
                  className={`
                    relative text-center p-8 rounded-3xl border-2 border-gray-100 
                    ${step.bgColor} backdrop-blur-sm
                    transform transition-all duration-500 ease-out
                    ${hoveredStep === step.id ? 'scale-105 shadow-2xl border-purple-200' : 'hover:scale-102 hover:shadow-xl'}
                    group cursor-pointer
                  `}
                >
                  {/* Floating Number */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {step.id}
                  </div>
                  
                  {/* Icon Container */}
                  <div className={`
                    inline-flex items-center justify-center w-16 h-16 
                    bg-gradient-to-br ${step.color} rounded-2xl mb-6 
                    transform transition-all duration-300 group-hover:rotate-6 group-hover:scale-110
                    shadow-lg
                  `}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-purple-900 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {step.description}
                  </p>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16">
          <button className="
            inline-flex items-center gap-3 px-8 py-4 
            bg-gradient-to-r from-purple-600 to-pink-600 
            text-white font-semibold rounded-full 
            hover:from-purple-700 hover:to-pink-700 
            transform hover:scale-105 transition-all duration-300 
            shadow-lg hover:shadow-xl
          ">
            <PartyPopper className="h-5 w-5" />
            Start Your Journey
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-xl"></div>
    </section>
  );
};

export default HowItWorks;