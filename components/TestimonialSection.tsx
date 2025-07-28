import { Card, CardContent } from "../components/ui/card";
import { Quote, Star, Heart, Sparkles, Users } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Nishtha Goel",
    role: "Birthday Celebration",
    text: "The balloon arrangements for my daughter's birthday were absolutely stunning! Everyone was amazed by the decorations. Highly recommended!",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5,
    event: "Princess Theme Birthday",
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-50 to-rose-50"
  },
  {
    id: 2,
    name: "Ajay & Mansi",
    role: "Wedding Couple",
    text: "Our wedding venue looked magical thanks to Decoration Cart. The attention to detail was incredible and matched our theme perfectly.",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    event: "Dream Wedding Setup",
    gradient: "from-purple-500 to-indigo-500",
    bgGradient: "from-purple-50 to-indigo-50"
  },
  {
    id: 3,
    name: "Kunal Bhardwaj",
    role: "Corporate Event Manager",
    text: "Professional service from start to finish. The team transformed our conference hall into an elegant space that impressed all attendees.",
    avatar: "https://i.pravatar.cc/150?img=68",
    rating: 5,
    event: "Corporate Excellence",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50"
  }
];

const TestimonialSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-6">
            <Heart className="h-4 w-4" />
            Client Love
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Do not just take our word for it - hear from our happy clients who experienced magic
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">500+</div>
              <div className="text-sm text-gray-500">Happy Clients</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">98%</div>
              <div className="text-sm text-gray-500">Satisfaction Rate</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">4.9★</div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
          </div>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group relative"
              style={{ animationDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredCard(testimonial.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className={`
                relative overflow-hidden border-0 shadow-lg backdrop-blur-sm
                bg-gradient-to-br ${testimonial.bgGradient}
                transform transition-all duration-500 ease-out
                ${hoveredCard === testimonial.id ? 'scale-105 shadow-2xl' : 'hover:scale-102 hover:shadow-xl'}
                group cursor-pointer
              `}>
                {/* Gradient Border */}
                <div className={`absolute inset-0 bg-gradient-to-r ${testimonial.gradient} p-0.5 rounded-lg`}>
                  <div className="bg-white rounded-lg h-full w-full"></div>
                </div>
                
                <CardContent className="relative p-8 z-10">
                  {/* Quote Icon */}
                  <div className={`
                    absolute -top-2 -left-2 w-12 h-12 
                    bg-gradient-to-br ${testimonial.gradient} 
                    rounded-full flex items-center justify-center
                    transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110
                    shadow-lg
                  `}>
                    <Quote className="h-5 w-5 text-white" />
                  </div>
                  
                  {/* Event Tag */}
                  <div className={`
                    inline-flex items-center gap-1 px-3 py-1 
                    bg-gradient-to-r ${testimonial.gradient} 
                    text-white text-xs font-medium rounded-full mb-4
                    shadow-sm
                  `}>
                    <Sparkles className="h-3 w-3" />
                    {testimonial.event}
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-pulse" 
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                  
                  {/* Testimonial Text */}
                  <blockquote className="text-gray-700 leading-relaxed mb-6 font-medium">
                    "{testimonial.text}"
                  </blockquote>
                  
                  {/* Profile */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="rounded-full h-14 w-14 object-cover border-2 border-white shadow-md"
                      />
                      <div className={`
                        absolute -bottom-1 -right-1 w-6 h-6 
                        bg-gradient-to-r ${testimonial.gradient} 
                        rounded-full flex items-center justify-center
                      `}>
                        <Heart className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${testimonial.gradient} 
                    opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg
                  `}></div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-gray-600 mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm">Join hundreds of satisfied customers</span>
            <Sparkles className="h-4 w-4" />
          </div>
          <button className="
            inline-flex items-center gap-3 px-8 py-4 
            bg-gradient-to-r from-purple-600 to-pink-600 
            text-white font-semibold rounded-full 
            hover:from-purple-700 hover:to-pink-700 
            transform hover:scale-105 transition-all duration-300 
            shadow-lg hover:shadow-xl
          ">
            <Heart className="h-5 w-5" />
            Share Your Experience
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;