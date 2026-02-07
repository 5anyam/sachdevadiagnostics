import Link from "next/link";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  ArrowRight, CheckCircle, Clock, Phone, Shield, 
  Activity, Zap, Award, Users, Star, Calendar, Download, 
  ChevronRight, TestTube, Microscope
} from "lucide-react";
import CircularCategoriesCarousel from "../../components/CircularCategoriesCarousel";
import HeroImageSlider from "../../components/HeroImageSlider";
import { 
  getProductsByCategory, 
  getProductCategories, 
  formatPrice,
  getProductMetaValue,
  Product,
  Category
} from "../../services/wordpress";

// Define category groups for organized display
const CATEGORY_GROUPS = [
  {
    title: "Ultrasound Services",
    description: "Advanced 3D/4D ultrasound imaging with expert radiologists",
    slugs: ["3d-4d-ultrasound", "pregnancy-ultrasound", "color-doppler-ultrasound", "routine-ultrasound"],
    icon: Activity,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "X-Ray Services", 
    description: "Digital X-ray imaging with same-day reports",
    slugs: ["x-ray-test"],
    icon: Zap,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Health Packages",
    description: "Comprehensive diagnostic and health screening packages",
    slugs: ["health-packages", "special-ultrasound"],
    icon: TestTube,
    gradient: "from-green-500 to-emerald-500"
  },
  {
    title: "Lab Tests",
    description: "Complete blood tests and pathology services",
    slugs: ["lab-tests", "blood-tests", "pathology"],
    icon: Microscope,
    gradient: "from-orange-500 to-red-500"
  }
];

// Fetch products for a category group (limit to 4)
async function getCategoryGroupProducts(slugs: string[]): Promise<Product[]> {
  try {
    const categories = await getProductCategories({ per_page: 100 });
    
    const categoryProducts = await Promise.all(
      slugs.map(async (slug) => {
        const category = categories.find(cat => cat.slug === slug);
        if (!category) return [];
        
        const products = await getProductsByCategory(category.id, { per_page: 4 });
        return products;
      })
    );
    
    return categoryProducts.flat().slice(0, 4);
  } catch (error) {
    console.error('Error fetching category group products:', error);
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
    
    return categories.filter(cat => cat.count && cat.count > 0).slice(0, 8);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Get proper category title from actual products
function getCategoryTitle(products: Product[]): string {
  if (products.length === 0) return "";
  
  const categoryName = products[0].categories?.[0]?.name;
  if (!categoryName) return "";
  
  return categoryName;
}

// Get category slug for view all link
function getCategorySlug(products: Product[]): string {
  if (products.length === 0) return "/tests";
  
  const categorySlug = products[0].categories?.[0]?.slug;
  if (!categorySlug) return "/tests";
  
  return `/category/${categorySlug}`;
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  const reportTat = getProductMetaValue(product, 'report_tat') || 'Same Day';
  const isPopular = product.total_sales && parseInt(product.total_sales) > 50;
  const hasDiscount = product.regular_price && product.regular_price !== product.price;
  
  return (
    <div className="group relative">
      <Link href={`/test/${product.slug}`} className="block h-full">
        <div className="bg-white rounded-2xl border-2 border-slate-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
          
          <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-slate-50">
            {product.images?.[0]?.src ? (
              <Image 
                src={product.images[0].src} 
                alt={product.images[0].alt || product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <Activity className="w-12 h-12 sm:w-16 sm:h-16" />
              </div>
            )}
            
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
              <Badge className="bg-white/95 text-blue-800 font-bold text-[10px] sm:text-xs shadow-md">
                {product.categories?.[0]?.name || 'Diagnostic Test'}
              </Badge>
            </div>
            
            {isPopular && (
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                <Badge className="bg-orange-500 text-white font-bold text-[10px] sm:text-xs shadow-md flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white" /> Popular
                </Badge>
              </div>
            )}

            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-green-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 shadow-lg">
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {reportTat}
            </div>
          </div>

          <div className="p-3 sm:p-5 flex-1 flex flex-col">
            <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2 group-hover:text-blue-700 transition-colors leading-tight line-clamp-2">
              {product.name}
            </h3>
            <div 
              className="text-slate-600 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2 flex-1"
              dangerouslySetInnerHTML={{ 
                __html: product.short_description || product.description 
              }}
            />

            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-100">
              <div>
                {hasDiscount && (
                  <div className="text-slate-400 text-[10px] sm:text-xs line-through">
                    {formatPrice(product.regular_price)}
                  </div>
                )}
                <div className="text-blue-700 font-bold text-lg sm:text-2xl">
                  {formatPrice(product.price)}
                </div>
              </div>
              <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg shadow-md hover:shadow-lg transition-all">
                Book <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Category Section Component
function CategorySection({ 
  title, 
  description, 
  products, 
  icon: Icon,
  gradient 
}: { 
  title: string;
  description: string;
  products: Product[];
  icon: React.ElementType;
  gradient: string;
}) {
  if (products.length === 0) return null;

  const actualCategoryName = getCategoryTitle(products) || title;
  const categoryLink = getCategorySlug(products);

  return (
    <section className="py-8 sm:py-16 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-10 gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className={`bg-gradient-to-r ${gradient} p-2 sm:p-3 rounded-lg sm:rounded-xl`}>
                <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                  {actualCategoryName}
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1">{description}</p>
              </div>
            </div>
          </div>
          
          <Link href={categoryLink}>
            <Button variant="outline" className="border-2 border-blue-700 text-blue-700 hover:bg-blue-50 font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl flex items-center text-sm sm:text-base">
              View All
              <ChevronRight className="ml-1 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function Index() {
  const [ultrasoundProducts, xrayProducts, healthPackages, labTests, categories] = await Promise.all([
    getCategoryGroupProducts(CATEGORY_GROUPS[0].slugs),
    getCategoryGroupProducts(CATEGORY_GROUPS[1].slugs),
    getCategoryGroupProducts(CATEGORY_GROUPS[2].slugs),
    getCategoryGroupProducts(CATEGORY_GROUPS[3].slugs),
    getFeaturedCategories()
  ]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* 1. TRUST BAR */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-2 sm:py-2.5 text-[10px] sm:text-xs md:text-sm border-b border-blue-700">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex gap-3 sm:gap-6 flex-wrap justify-center text-center">
            <span className="flex items-center gap-1 sm:gap-1.5 font-semibold">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" /> NABL Accredited
            </span>
            <span className="flex items-center gap-1 sm:gap-1.5">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" /> 30+ Years
            </span>
            <span className="flex items-center gap-1 sm:gap-1.5">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300" /> 50,000+ Patients
            </span>
          </div>
          <a href="tel:+919811582086" className="font-bold hover:text-blue-200 transition-colors flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1 rounded-full">
            <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> +91 98115 82086
          </a>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-white py-6 sm:py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-green-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-green-50 border border-green-200 text-green-800 text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Same Day Reports Available</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                Advanced Ultrasound<br/>
                <span className="text-blue-700">& Digital X-Ray</span><br/>
                Services
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
                North West Delhi&apos;s most trusted diagnostic center. 
                <span className="font-semibold text-slate-900"> NABL certified</span> with latest equipment.
              </p>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 py-3 sm:py-4">
                {[
                  { value: "6 Hrs", label: "Report Time" },
                  { value: "₹499", label: "Starting Price" },
                  { value: "4.9★", label: "Patient Rating" }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-slate-500 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/tests" className="flex-1 sm:flex-initial">
                  <Button className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 bg-blue-700 hover:bg-blue-800 text-white font-bold text-base sm:text-lg rounded-xl shadow-lg shadow-blue-700/30 hover:shadow-xl transition-all">
                    <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Book Test Now
                  </Button>
                </Link>
                <a href="tel:+919811582086" className="flex-1 sm:flex-initial">
                  <Button variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 border-2 border-slate-300 hover:border-blue-700 hover:bg-blue-50 font-semibold text-base sm:text-lg rounded-xl">
                    <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Call Expert
                  </Button>
                </a>
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-6 pt-3 sm:pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="font-medium">Free Home Collection</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="font-medium">Digital Reports via WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Right Image Slider */}
            <HeroImageSlider />
          </div>
        </div>
      </section>

      {/* 3. CATEGORY SECTIONS */}
      <CategorySection 
        title={CATEGORY_GROUPS[0].title}
        description={CATEGORY_GROUPS[0].description}
        products={ultrasoundProducts}
        icon={CATEGORY_GROUPS[0].icon}
        gradient={CATEGORY_GROUPS[0].gradient}
      />

      <CategorySection 
        title={CATEGORY_GROUPS[1].title}
        description={CATEGORY_GROUPS[1].description}
        products={xrayProducts}
        icon={CATEGORY_GROUPS[1].icon}
        gradient={CATEGORY_GROUPS[1].gradient}
      />

      <CategorySection 
        title={CATEGORY_GROUPS[2].title}
        description={CATEGORY_GROUPS[2].description}
        products={healthPackages}
        icon={CATEGORY_GROUPS[2].icon}
        gradient={CATEGORY_GROUPS[2].gradient}
      />

      <CategorySection 
        title={CATEGORY_GROUPS[3].title}
        description={CATEGORY_GROUPS[3].description}
        products={labTests}
        icon={CATEGORY_GROUPS[3].icon}
        gradient={CATEGORY_GROUPS[3].gradient}
      />

      {/* 4. WHY CHOOSE US */}
      <section className="py-8 sm:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3">Why Sachdeva Diagnostics?</h2>
            <p className="text-slate-600 text-sm sm:text-base">30+ years of delivering accurate diagnostic services</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "NABL Certified",
                desc: "Nationally accredited testing laboratory",
                color: "bg-blue-100 text-blue-700"
              },
              {
                icon: <Activity className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Latest Equipment",
                desc: "High-resolution ultrasound & digital X-ray",
                color: "bg-green-100 text-green-700"
              },
              {
                icon: <Clock className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Fast Reports",
                desc: "Same-day reports. Digital delivery",
                color: "bg-orange-100 text-orange-700"
              },
              {
                icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Expert Team",
                desc: "Experienced radiologists with 20+ years",
                color: "bg-purple-100 text-purple-700"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`${feature.color} w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BROWSE BY CATEGORY */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3">Browse Tests by Category</h2>
            <p className="text-slate-600 text-sm sm:text-base">Find the right diagnostic test for your health needs</p>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/category/${category.slug}`}
                  className="group"
                >
                  <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all text-center">
                    {category.image?.src ? (
                      <Image 
                        src={category.image.src} 
                        alt={category.name}
                        width={64}
                        height={64}
                        className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-700" />
                      </div>
                    )}
                    <h3 className="font-bold text-slate-900 mb-0.5 sm:mb-1 group-hover:text-blue-700 transition-colors text-xs sm:text-sm leading-tight">
                      {category.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-500">
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
      <section className="py-8 sm:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3">What Our Patients Say</h2>
            <div className="flex items-center justify-center gap-1 text-yellow-500 text-lg sm:text-2xl">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 sm:w-6 sm:h-6 fill-yellow-500" />)}
              <span className="text-slate-900 font-bold ml-2 text-base sm:text-xl">4.9/5</span>
              <span className="text-slate-500 text-xs sm:text-base ml-2">(2,500+ reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { name: "Rajesh Kumar", test: "Whole Abdomen Ultrasound", review: "Very professional service. Got my report within 6 hours. Dr. Sachdeva explained everything clearly.", rating: 5 },
              { name: "Priya Sharma", test: "TIFFA Scan", review: "Excellent experience during pregnancy scan. Staff was very caring and the report was detailed.", rating: 5 },
              { name: "Amit Singh", test: "Full Body Checkup", review: "Best diagnostic center in the area. Affordable prices and accurate reports. Highly recommended!", rating: 5 }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 hover:shadow-xl transition-all">
                <div className="flex items-center gap-0.5 sm:gap-1 text-yellow-500 mb-2 sm:mb-3">
                  {[...Array(testimonial.rating)].map((_, idx) => <Star key={idx} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-500" />)}
                </div>
                <p className="text-slate-700 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{testimonial.review}</p>
                <div className="border-t border-slate-200 pt-3 sm:pt-4">
                  <p className="font-bold text-slate-900 text-sm sm:text-base">{testimonial.name}</p>
                  <p className="text-xs sm:text-sm text-slate-500">{testimonial.test}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-8 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 text-center md:text-left">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">Need Help Choosing a Test?</h2>
              <p className="text-blue-200 text-sm sm:text-base md:text-lg">Our healthcare experts are available. Call now for free consultation.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
              <a href="tel:+919811582086" className="flex-1 sm:flex-initial">
                <Button className="w-full bg-white text-blue-900 hover:bg-blue-50 px-6 sm:px-8 py-5 sm:py-7 text-base sm:text-lg font-bold rounded-xl shadow-2xl hover:shadow-white/20 transition-all">
                  <Phone className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Call: +91 98115 82086
                </Button>
              </a>
              <Link href="/reports" className="flex-1 sm:flex-initial">
                <Button variant="outline" className="w-full border-2 border-white text-white hover:bg-white/10 px-6 sm:px-8 py-5 sm:py-7 text-base sm:text-lg font-bold rounded-xl">
                  <Download className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Download Reports
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
