import Link from "next/link";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  ArrowRight, Clock, Phone, Shield, 
  Activity, Zap, Users, Star, Download, 
  ChevronRight, TestTube, Microscope, TrendingUp
} from "lucide-react";
import CircularCategoriesCarousel from "../../components/CircularCategoriesCarousel";
import HeroCarousel from "../../components/HeroCarousel";
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

// Fetch ONLY FEATURED products for a category group (limit to 4)
async function getCategoryGroupProducts(slugs: string[]): Promise<Product[]> {
  try {
    const categories = await getProductCategories({ per_page: 100 });
    
    const categoryProducts = await Promise.all(
      slugs.map(async (slug) => {
        const category = categories.find(cat => cat.slug === slug);
        if (!category) return [];
        
        // Fetch more products initially since we'll filter
        const products = await getProductsByCategory(category.id, { 
          per_page: 20  // Fetch more to ensure we get 4 featured ones
        });
        
        // Filter for featured products only
        return products.filter(product => product.featured === true);
      })
    );
    
    // Flatten, ensure featured, and limit to 4
    return categoryProducts
      .flat()
      .filter(product => product.featured === true)
      .slice(0, 4);
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

// Product Card Component - WITHOUT IMAGES
function ProductCard({ product }: { product: Product }) {
  const reportTat = getProductMetaValue(product, 'report_tat') || 'Same Day';
  const isPopular = product.total_sales && parseInt(product.total_sales) > 50;
  const hasDiscount = product.regular_price && product.regular_price !== product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((Number(product.regular_price) - Number(product.price)) / Number(product.regular_price)) * 100)
    : 0;
  
  return (
    <div className="group relative">
      <Link href={`/test/${product.slug}`} className="block h-full">
        <div className="bg-white rounded-2xl border-2 border-slate-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col group-hover:-translate-y-1">
          
          {/* Card Content - No Image Section */}
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            
            {/* Badges Row at Top */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {/* Category Badge */}
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold text-[10px] sm:text-xs">
                {product.categories?.[0]?.name || 'Diagnostic Test'}
              </Badge>
              
              {/* Featured Badge - Since all are featured */}
              <Badge className="bg-yellow-100 text-yellow-700 border-0 font-bold text-[10px] sm:text-xs shadow-none">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 fill-yellow-600" />
                Featured
              </Badge>

              {/* Popular Badge */}
              {isPopular && (
                <Badge className="bg-orange-100 text-orange-700 border-0 font-bold text-[10px] sm:text-xs shadow-none">
                  <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                  Popular
                </Badge>
              )}

              {/* Discount Badge */}
              {hasDiscount && (
                <Badge className="ml-auto bg-red-100 text-red-700 border-0 font-bold text-[10px] sm:text-xs shadow-none">
                  {discountPercent}% OFF
                </Badge>
              )}
            </div>

            {/* Test Name */}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-blue-700 transition-colors leading-tight line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
              {product.name}
            </h3>

            {/* Test Description */}
            <div 
              className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 flex-1 min-h-[2.5rem]"
              dangerouslySetInnerHTML={{ 
                __html: product.short_description || product.description 
              }}
            />

            {/* Features */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <div className="bg-green-100 p-1.5 rounded">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-700" />
                </div>
                <span className="font-semibold">Report: {reportTat}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <div className="bg-blue-100 p-1.5 rounded">
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-700" />
                </div>
                <span className="font-semibold">NABL Certified Lab</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  {hasDiscount && (
                    <div className="text-slate-400 text-[10px] sm:text-xs line-through mb-0.5">
                      {formatPrice(product.regular_price)}
                    </div>
                  )}
                  <div className="text-blue-700 font-bold text-xl sm:text-2xl">
                    {formatPrice(product.price)}
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium">+ Free Home Collection</span>
                </div>
                <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg shadow-md hover:shadow-lg transition-all">
                  Book <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
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
              <div className={`bg-gradient-to-r ${gradient} p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg`}>
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
            <Button variant="outline" className="border-2 border-blue-700 text-blue-700 hover:bg-blue-50 font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl flex items-center text-sm sm:text-base shadow-sm hover:shadow-md transition-all">
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
      
      {/* 2. HERO SECTION */}
      <HeroCarousel/>

      {/* 3. CATEGORY SECTIONS - Only Featured Tests */}
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
