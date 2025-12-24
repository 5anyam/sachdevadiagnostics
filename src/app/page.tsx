import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  ArrowRight, CheckCircle, Clock, Phone, Shield, 
  Activity, Zap, Award, Users, Star, Calendar, Download, 
} from "lucide-react";
import CircularCategoriesCarousel from "../../components/CircularCategoriesCarousel";
import { 
  getProductsByCategory, 
  getProductCategories, 
  formatPrice,
  getProductMetaValue,
  Product,
  Category
} from "../../services/wordpress";

// Server Component - Direct data fetching
async function getRadiologyServices(): Promise<Product[]> {
  try {
    // Fetch categories first
    const categories = await getProductCategories({ per_page: 100 });
    
    // Find Ultrasound and X-Ray category IDs
    const ultrasoundCat = categories.find(cat => 
      cat.name.toLowerCase().includes('ultrasound')
    );
    const xrayCat = categories.find(cat => 
      cat.name.toLowerCase().includes('x-ray') || 
      cat.name.toLowerCase().includes('xray')
    );

    // Fetch products from both categories
    const [ultrasoundProducts, xrayProducts] = await Promise.all([
      ultrasoundCat ? getProductsByCategory(ultrasoundCat.id, { per_page: 3 }) : [],
      xrayCat ? getProductsByCategory(xrayCat.id, { per_page: 3 }) : []
    ]);

    // Combine and return
    return [...ultrasoundProducts, ...xrayProducts];
  } catch (error) {
    console.error('Error fetching radiology services:', error);
    return [];
  }
}

async function getFeaturedCategories(): Promise<Category[]> {
  try {
    const categories = await getProductCategories({ 
      per_page: 50,
      orderby: 'count',
      order: 'desc'
    });
    
    // Filter categories with products
    return categories.filter(cat => cat.count && cat.count > 0).slice(0, 8);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Index() {
  // Fetch data on server
  const [radiologyServices, categories] = await Promise.all([
    getRadiologyServices(),
    getFeaturedCategories()
  ]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Meta tags would go in layout.tsx or metadata export */}

      {/* 1. TRUST BAR */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-2.5 text-xs md:text-sm border-b border-blue-700">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex gap-6 flex-wrap justify-center">
            <span className="flex items-center gap-1.5 font-semibold">
              <Shield className="w-4 h-4 text-green-400" /> NABL Accredited Lab
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-yellow-400" /> 30+ Years Excellence
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-300" /> 50,000+ Happy Patients
            </span>
          </div>
          <a href="tel:+919990048085" className="font-bold hover:text-blue-200 transition-colors flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
            <Phone className="w-3.5 h-3.5" /> Emergency: +91 99900 48085
          </a>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-xs font-bold px-4 py-2 rounded-full">
                <Activity className="w-4 h-4" />
                <span>Same Day Reports Available</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                Advanced Ultrasound<br/>
                <span className="text-blue-700">& Digital X-Ray</span><br/>
                Services
              </h1>

              <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
                North West Delhi most trusted diagnostic center for radiology services. 
                <span className="font-semibold text-slate-900"> NABL certified</span> with latest equipment and expert radiologists.
              </p>

              <div className="grid grid-cols-3 gap-4 py-4">
                {[
                  { value: "6 Hrs", label: "Report Time" },
                  { value: "₹499", label: "Starting Price" },
                  { value: "4.9★", label: "Patient Rating" }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-blue-700">{stat.value}</div>
                    <div className="text-xs md:text-sm text-slate-500 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/tests">
                  <Button className="h-14 px-8 bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-700/30 hover:shadow-xl transition-all">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Radiology Test
                  </Button>
                </Link>
                <a href="tel:+919990048085">
                  <Button variant="outline" className="h-14 px-8 border-2 border-slate-300 hover:border-blue-700 hover:bg-blue-50 font-semibold text-lg rounded-xl">
                    <Phone className="mr-2 h-5 w-5" />
                    Talk to Expert
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Free Home Collection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Digital Reports via WhatsApp</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <div className="bg-gradient-to-br from-blue-100 to-slate-100 h-[450px] flex items-center justify-center text-slate-400 font-semibold">
                  [Ultrasound Machine / Radiologist Image Here]
                </div>

                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2.5 rounded-full">
                      <Shield className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase">Certified</p>
                      <p className="text-sm font-bold text-slate-900">NABL Accredited</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2.5 rounded-full">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase">Quick Turnaround</p>
                      <p className="text-lg font-bold text-slate-900">Reports in 6 Hours</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RADIOLOGY SERVICES - WooCommerce Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide">
              Most Booked Services
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Ultrasound & X-Ray Services
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              State-of-the-art radiology equipment with expert consultation. Same-day reports for most tests.
            </p>
          </div>

          {radiologyServices.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {radiologyServices.map((service) => {
                  const reportTat = getProductMetaValue(service, 'report_tat') || 'Same Day';
                  const isPopular = service.total_sales && parseInt(service.total_sales) > 50;
                  
                  return (
                    <div key={service.id} className="group relative">
                      <Link href={`/product/${service.slug}`} className="block h-full">
                        <div className="bg-white rounded-2xl border-2 border-slate-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                          
                          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-slate-50">
                            {service.images?.[0]?.src ? (
                              <img 
                                src={service.images[0].src} 
                                alt={service.images[0].alt || service.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <Activity className="w-16 h-16" />
                              </div>
                            )}
                            
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-white/95 text-blue-800 font-bold text-xs shadow-md">
                                {service.categories?.[0]?.name || 'Diagnostic Test'}
                              </Badge>
                            </div>
                            
                            {isPopular && (
                              <div className="absolute top-3 right-3">
                                <Badge className="bg-orange-500 text-white font-bold text-xs shadow-md flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-white" /> Popular
                                </Badge>
                              </div>
                            )}

                            <div className="absolute bottom-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                              <Clock className="w-3 h-3" /> {reportTat}
                            </div>
                          </div>

                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors leading-tight">
                              {service.name}
                            </h3>
                            <div 
                              className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1"
                              dangerouslySetInnerHTML={{ 
                                __html: service.short_description || service.description 
                              }}
                            />

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                              <div>
                                {service.regular_price && service.regular_price !== service.price && (
                                  <div className="text-slate-400 text-xs line-through">
                                    {formatPrice(service.regular_price)}
                                  </div>
                                )}
                                <div className="text-blue-700 font-bold text-2xl">
                                  {formatPrice(service.price)}
                                </div>
                              </div>
                              <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                                Book Now <ArrowRight className="ml-2 w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              <div className="text-center">
                <Link href="/tests">
                  <Button variant="outline" className="border-2 border-blue-700 text-blue-700 hover:bg-blue-50 font-bold px-8 py-6 text-lg rounded-xl">
                    View All Radiology Services
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">Loading radiology services...</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Why Sachdeva Diagnostics?</h2>
            <p className="text-slate-600">30+ years of delivering accurate diagnostic services</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "NABL Certified",
                desc: "Nationally accredited testing laboratory with ISO certification",
                color: "bg-blue-100 text-blue-700"
              },
              {
                icon: <Activity className="w-8 h-8" />,
                title: "Latest Equipment",
                desc: "High-resolution ultrasound & digital X-ray machines",
                color: "bg-green-100 text-green-700"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Fast Reports",
                desc: "Same-day reports for most tests. Digital delivery via WhatsApp",
                color: "bg-orange-100 text-orange-700"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Expert Team",
                desc: "Experienced radiologists & pathologists with 20+ years practice",
                color: "bg-purple-100 text-purple-700"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BROWSE BY CATEGORY */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Browse Tests by Category</h2>
            <p className="text-slate-600">Find the right diagnostic test for your health needs</p>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/category/${category.slug}`}
                  className="group"
                >
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all text-center">
                    {category.image?.src ? (
                      <img 
                        src={category.image.src} 
                        alt={category.name}
                        className="w-16 h-16 mx-auto mb-3 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="w-8 h-8 text-blue-700" />
                      </div>
                    )}
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {category.count} {category.count === 1 ? 'test' : 'tests'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <CircularCategoriesCarousel />
          )}
        </div>
      </section>

      {/* 6. PATIENT TESTIMONIALS */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">What Our Patients Say</h2>
            <div className="flex items-center justify-center gap-1 text-yellow-500 text-2xl">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-yellow-500" />)}
              <span className="text-slate-900 font-bold ml-2">4.9/5</span>
              <span className="text-slate-500 text-base ml-2">(2,500+ reviews)</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Rajesh Kumar", test: "Whole Abdomen Ultrasound", review: "Very professional service. Got my report within 6 hours. Dr. Sachdeva explained everything clearly.", rating: 5 },
              { name: "Priya Sharma", test: "TIFFA Scan", review: "Excellent experience during pregnancy scan. Staff was very caring and the report was detailed.", rating: 5 },
              { name: "Amit Singh", test: "Full Body Checkup", review: "Best diagnostic center in the area. Affordable prices and accurate reports. Highly recommended!", rating: 5 }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all">
                <div className="flex items-center gap-1 text-yellow-500 mb-3">
                  {[...Array(testimonial.rating)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-yellow-500" />)}
                </div>
                <p className="text-slate-700 mb-4 leading-relaxed">{testimonial.review}</p>
                <div className="border-t border-slate-200 pt-4">
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.test}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Need Help Choosing a Test?</h2>
              <p className="text-blue-200 text-lg">Our healthcare experts are available to guide you. Call now for free consultation.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+919990048085">
                <Button className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-7 text-lg font-bold rounded-xl shadow-2xl hover:shadow-white/20 transition-all">
                  <Phone className="mr-2 h-6 w-6" /> Call: +91 99900 48085
                </Button>
              </a>
              <Link href="/reports">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-7 text-lg font-bold rounded-xl">
                  <Download className="mr-2 h-6 w-6" /> Download Reports
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
