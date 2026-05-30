import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  ArrowRight, Clock, Phone, Shield,
  Activity, Zap, Users, Star, Download,
  ChevronRight, TestTube, Microscope, Building2, Home,
  Heart, MapPin, Calendar, Award,
  Stethoscope, Mail
} from "lucide-react";
import HeroCarousel from "../../components/HeroCarousel";
import CircularCategoriesCarousel from "../../components/CircularCategoriesCarousel";
import {
  getProductsByCategory,
  getProductCategories,
  formatPrice,
  getProductMetaValue,
  Product,
  Category
} from "../../services/wordpress";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_GROUPS = [
  {
    title: "Health Packages",
    description: "Comprehensive diagnostic and health screening packages",
    slugs: ["health-packages", "special-ultrasound"],
    icon: TestTube,
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    title: "Ultrasound Services",
    description: "Advanced 3D/4D ultrasound imaging with expert radiologists",
    slugs: ["3d-4d-ultrasound", "pregnancy-ultrasound", "color-doppler-ultrasound", "routine-ultrasound"],
    icon: Activity,
    gradient: "from-sky-500 to-blue-500"
  },
  {
    title: "X-Ray Services",
    description: "Digital X-ray imaging with same-day reports",
    slugs: ["x-ray-test"],
    icon: Zap,
    gradient: "from-violet-500 to-purple-500"
  },
  {
    title: "Lab Tests",
    description: "Complete blood tests and pathology services",
    slugs: ["lab-tests", "blood-tests", "pathology"],
    icon: Microscope,
    gradient: "from-orange-500 to-amber-500"
  }
];

const NO_HOME_COLLECTION_SLUGS = [
  "3d-4d-ultrasound",
  "pregnancy-ultrasound",
  "color-doppler-ultrasound",
  "routine-ultrasound",
  "special-ultrasound",
  "x-ray-test",
];

// Services matching the brochure exactly
const BROCHURE_SERVICES = [
  { name: "3D/4D Ultrasound",          icon: Activity,     href: "/category/3d-4d-ultrasound",          iconBg: "bg-sky-100",    iconColor: "text-sky-600",    border: "hover:border-sky-400"    },
  { name: "Fetal Echo & Color Doppler", icon: Heart,        href: "/category/color-doppler-ultrasound",  iconBg: "bg-red-100",    iconColor: "text-red-600",    border: "hover:border-red-400"    },
  { name: "Thyroid & Breast Ultrasound",icon: Stethoscope,  href: "/category/routine-ultrasound",        iconBg: "bg-purple-100", iconColor: "text-purple-600", border: "hover:border-purple-400" },
  { name: "MSK / Joint / Muscle",       icon: Zap,          href: "/tests",                              iconBg: "bg-orange-100", iconColor: "text-orange-600", border: "hover:border-orange-400" },
  { name: "Adult Echo",                 icon: Heart,        href: "/tests",                              iconBg: "bg-pink-100",   iconColor: "text-pink-600",   border: "hover:border-pink-400"   },
  { name: "Bone Densitometry (Dexa)",   icon: Shield,       href: "/tests",                              iconBg: "bg-green-100",  iconColor: "text-green-600",  border: "hover:border-green-400"  },
  { name: "Digital X-Ray & OPG",        icon: Zap,          href: "/category/x-ray-test",                iconBg: "bg-cyan-100",   iconColor: "text-cyan-600",   border: "hover:border-cyan-400"   },
  { name: "ECG & Fibro Scan",           icon: Activity,     href: "/tests",                              iconBg: "bg-yellow-100", iconColor: "text-yellow-700", border: "hover:border-yellow-400" },
  { name: "Pathology Lab (mfine)",      icon: TestTube,     href: "/category/lab-tests",                 iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "hover:border-indigo-400" },
  { name: "Home Sample Collection",     icon: Home,         href: "/book-test",                          iconBg: "bg-teal-100",   iconColor: "text-teal-600",   border: "hover:border-teal-400"   },
];

// ─── Data fetching ─────────────────────────────────────────────────────────────

function isNoHomeCollection(product: Product): boolean {
  return product.categories?.some(cat =>
    NO_HOME_COLLECTION_SLUGS.includes(cat.slug)
  ) ?? false;
}

async function getCategoryGroupProducts(slugs: string[]): Promise<Product[]> {
  try {
    const categories = await getProductCategories({ per_page: 100 });
    const categoryProducts = await Promise.all(
      slugs.map(async (slug) => {
        const category = categories.find(cat => cat.slug === slug);
        if (!category) return [];
        const products = await getProductsByCategory(category.id, { per_page: 20 });
        return products.filter(p => p.featured === true);
      })
    );
    return categoryProducts.flat().filter(p => p.featured).slice(0, 4);
  } catch {
    return [];
  }
}

async function getFeaturedCategories(): Promise<Category[]> {
  try {
    const categories = await getProductCategories({ per_page: 50, orderby: 'count', order: 'desc' });
    return categories.filter(cat => cat.count && cat.count > 0).slice(0, 8);
  } catch {
    return [];
  }
}

function getCategorySlug(products: Product[]): string {
  const slug = products[0]?.categories?.[0]?.slug;
  return slug ? `/category/${slug}` : "/tests";
}

function getCategoryTitle(products: Product[]): string {
  return products[0]?.categories?.[0]?.name || "";
}

// ─── Components ───────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const reportTat = getProductMetaValue(product, 'report_tat') || 'Same Day';
  const hasDiscount = product.regular_price && product.regular_price !== product.price;
  const hideHomeCollection = isNoHomeCollection(product);

  return (
    <Link href={`/test/${product.slug}`} className="group block h-full">
      <div className="bg-white rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col group-hover:-translate-y-0.5">
        <div className="p-4 sm:p-5 flex-1 flex flex-col">

          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 font-semibold text-[10px] sm:text-xs">
              {product.categories?.[0]?.name || 'Diagnostic'}
            </Badge>
            <Badge className="bg-amber-50 text-amber-700 border-0 font-bold text-[10px] sm:text-xs shadow-none">
              <Star className="w-2.5 h-2.5 mr-0.5 fill-amber-600" />
              Featured
            </Badge>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          <div
            className="text-slate-500 text-xs mb-3 line-clamp-2 flex-1"
            dangerouslySetInnerHTML={{ __html: product.short_description || product.description }}
          />

          <div className="flex gap-3 mb-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <div className="bg-green-100 p-1 rounded">
                <Clock className="w-3 h-3 text-green-700" />
              </div>
              <span className="font-medium">{reportTat}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                {hasDiscount && (
                  <div className="text-slate-400 text-[10px] line-through">
                    {formatPrice(product.regular_price)}
                  </div>
                )}
                <div className="text-sky-600 font-bold text-lg sm:text-xl">
                  {formatPrice(product.price)}
                </div>
                {!hideHomeCollection && (
                  <span className="text-[10px] text-slate-400">+ Free Home Collection</span>
                )}
              </div>
              <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white text-xs px-4 py-2 rounded-lg shadow-sm">
                Book <ArrowRight className="ml-1 w-3 h-3" />
              </Button>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 flex items-center justify-center gap-1 bg-sky-50 px-2 py-1.5 rounded-lg border border-sky-100">
                <Building2 className="w-3 h-3 text-sky-600" />
                <span className="text-[10px] text-sky-700 font-semibold">Center Visit</span>
              </div>
              {!hideHomeCollection && (
                <div className="flex-1 flex items-center justify-center gap-1 bg-green-50 px-2 py-1.5 rounded-lg border border-green-100">
                  <Home className="w-3 h-3 text-green-600" />
                  <span className="text-[10px] text-green-700 font-semibold">Home</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}

function CategorySection({
  title, description, products
}: {
  title: string;
  description: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  const label = getCategoryTitle(products) || title;
  const href = getCategorySlug(products);

  return (
    <section className="py-10 sm:py-14 border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">{label}</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">{description}</p>
          </div>
          <Link href={href} className="flex-shrink-0">
            <Button variant="outline" className="border border-sky-300 text-sky-600 hover:bg-sky-50 font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-1 transition-all">
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Index() {
  const [allGroupProducts, categories] = await Promise.all([
    Promise.all(CATEGORY_GROUPS.map(group => getCategoryGroupProducts(group.slugs))),
    getFeaturedCategories()
  ]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* ── FULL-WIDTH BANNER CAROUSEL ── */}
      <HeroCarousel />

      {/* ── TRUST STRIP ── */}
      <div className="bg-sky-500 text-white">
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs sm:text-sm font-medium">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-yellow-300 flex-shrink-0" />
              NABL Certified Lab
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-sky-200">|</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-yellow-300 flex-shrink-0" />
              Same Day Reports
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-sky-200">|</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-yellow-300 flex-shrink-0" />
              30+ Years of Trust
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-sky-200">|</span>
            <a href="tel:+919811582086" className="flex items-center gap-1.5 underline underline-offset-2 hover:text-yellow-200 transition-colors">
              <Phone className="w-3.5 h-3.5 text-yellow-300 flex-shrink-0" />
              +91 9811-582086
            </a>
          </div>
        </div>
      </div>

      {/* ── OUR SERVICES ── */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="container mx-auto px-4">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <p className="text-sky-600 text-sm font-semibold tracking-wide uppercase mb-1">What We Offer</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Our Services</h2>
            </div>
            <Link href="/tests">
              <Button variant="outline" className="border border-sky-300 text-sky-600 hover:bg-sky-50 font-semibold px-5 py-2 rounded-lg text-sm flex items-center gap-1">
                All Tests <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {BROCHURE_SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <Link key={i} href={svc.href}>
                  <div className={`group bg-white rounded-xl border border-slate-200 ${svc.border} hover:shadow-md transition-all duration-200 p-4 text-center h-full flex flex-col items-center hover:-translate-y-0.5`}>
                    <div className={`${svc.iconBg} w-11 h-11 rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform`}>
                      <Icon className={`w-5 h-5 ${svc.iconColor}`} />
                    </div>
                    <p className="font-semibold text-slate-700 text-xs leading-snug group-hover:text-sky-600 transition-colors">
                      {svc.name}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED TESTS FROM BACKEND ── */}
      <div className="bg-slate-50">
        {CATEGORY_GROUPS.map((group, index) => (
          <CategorySection
            key={group.title}
            title={group.title}
            description={group.description}
            products={allGroupProducts[index]}
          />
        ))}
      </div>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8 sm:mb-10">
            <p className="text-sky-600 text-sm font-semibold tracking-wide uppercase mb-1">Why Us</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Why Sachdeva Diagnostics?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              { icon: Award,       color: "bg-sky-50 text-sky-600",     title: "NABL Certified",      desc: "Nationally accredited testing laboratory with international quality standards." },
              { icon: Activity,    color: "bg-emerald-50 text-emerald-600", title: "Latest Equipment", desc: "High-resolution 3D/4D ultrasound machines & digital X-ray technology." },
              { icon: Clock,       color: "bg-amber-50 text-amber-600",  title: "Same Day Reports",    desc: "Fast turnaround — digital reports delivered the same day." },
              { icon: Users,       color: "bg-violet-50 text-violet-600",title: "Expert Radiologists", desc: "Experienced radiologists & pathologists with 20+ years of expertise." },
              { icon: Home,        color: "bg-teal-50 text-teal-600",    title: "Home Collection",     desc: "Convenient home sample collection facility for all lab tests." },
              { icon: Shield,      color: "bg-rose-50 text-rose-600",    title: "30 Years of Trust",   desc: "Trusted by 5 lakh+ patients — a healthcare landmark in Delhi since 1993." },
            ].map((f, i) => (
              <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200 hover:border-sky-200 hover:shadow-lg transition-all duration-300 group">
                <div className={`${f.color} w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1 text-sm sm:text-base">{f.title}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY ── */}
      <section className="py-10 sm:py-14 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <p className="text-sky-600 text-sm font-semibold tracking-wide uppercase mb-1">Browse</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Find Tests by Category</h2>
          </div>
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {categories.map(cat => (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="group">
                  <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all text-center hover:-translate-y-0.5">
                    <h3 className="font-semibold text-slate-800 mb-0.5 group-hover:text-sky-600 transition-colors text-xs sm:text-sm leading-snug">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-400">
                      {cat.count} {cat.count === 1 ? 'test' : 'tests'}
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

      {/* ── HOME COLLECTION BANNER ── */}
      <section className="bg-gradient-to-r from-sky-500 to-sky-600 text-white py-10 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-white/20 rounded-2xl p-4">
                <Home className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1">Home Sample Collection Available</h2>
                <p className="text-sky-100 text-sm">We come to your doorstep — book online or give us a call</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/book-test">
                <Button className="bg-white text-sky-600 hover:bg-sky-50 font-bold px-6 py-2.5 rounded-xl shadow">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Collection
                </Button>
              </Link>
              <a href="tel:+919911380288">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-sky-600 font-bold px-6 py-2.5 rounded-xl">
                  <Phone className="w-4 h-4 mr-2" />
                  +91 9911-380288
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-sky-600 text-sm font-semibold tracking-wide uppercase mb-1">Reviews</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">What Our Patients Say</h2>
            </div>
            <div className="flex items-center gap-1 text-amber-400 flex-shrink-0">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              <span className="text-slate-700 font-bold ml-1.5 text-sm">4.9</span>
              <span className="text-slate-400 text-xs ml-1">(2,500+)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {[
              { name: "Rajesh Kumar",  test: "Whole Abdomen Ultrasound",   review: "Very professional service. Got my report within 6 hours. The doctor explained everything clearly. Highly recommended!", rating: 5 },
              { name: "Priya Sharma",  test: "TIFFA Scan (Anomaly Scan)",   review: "Excellent experience during my pregnancy scan. Staff was very caring and the report was very detailed. Best centre in area.", rating: 5 },
              { name: "Amit Singh",    test: "Full Body Health Checkup",    review: "Best diagnostic center in North Delhi. Affordable prices, accurate reports, and very courteous staff. Will visit again!", rating: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 hover:border-sky-200 hover:shadow-lg transition-all">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 italic">&ldquo;{t.review}&rdquo;</p>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                  <div className="w-9 h-9 bg-sky-100 rounded-full flex items-center justify-center font-bold text-sky-700 text-sm flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.test}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT INFO ── */}
      <section className="py-10 sm:py-14 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <p className="text-sky-600 text-sm font-semibold tracking-wide uppercase mb-1">Find Us</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Visit Sachdeva Diagnostics</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Details */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="space-y-5">
                {[
                  {
                    Icon: MapPin, bg: "bg-sky-100", color: "text-sky-600",
                    label: "Address",
                    content: <a href="https://maps.google.com/?q=E-991,+Saraswati+Vihar,+Delhi+110034" target="_blank" rel="noopener noreferrer" className="text-slate-600 text-sm hover:text-sky-600 transition-colors">E-991, Saraswati Vihar, Delhi – 110034</a>
                  },
                  {
                    Icon: Phone, bg: "bg-green-100", color: "text-green-600",
                    label: "Phone & Mobile",
                    content: (
                      <div className="space-y-0.5">
                        {["+91 9911-380288", "+91 9811-582086", "011 4572 5538", "011 2701 4326"].map(n => (
                          <a key={n} href={`tel:${n.replace(/\s|-/g, '')}`} className="block text-slate-600 text-sm hover:text-sky-600 transition-colors">{n}</a>
                        ))}
                      </div>
                    )
                  },
                  {
                    Icon: Mail, bg: "bg-amber-100", color: "text-amber-600",
                    label: "Email",
                    content: <a href="mailto:sachdevadiagnostics@gmail.com" className="text-slate-600 text-sm hover:text-sky-600 transition-colors break-all">sachdevadiagnostics@gmail.com</a>
                  },
                  {
                    Icon: Clock, bg: "bg-purple-100", color: "text-purple-600",
                    label: "Working Hours",
                    content: <p className="text-slate-600 text-sm">Mon – Sat: 7:00 AM – 8:00 PM<br />Sunday: 8:00 AM – 2:00 PM</p>
                  },
                ].map(({ Icon, bg, color, label, content }, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`${bg} p-2.5 rounded-xl flex-shrink-0 h-fit`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm mb-0.5">{label}</p>
                      {content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map button */}
            <a
              href="https://maps.google.com/?q=E-991,+Saraswati+Vihar,+Delhi+110034"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-xl transition-all flex flex-col items-center justify-center p-8 text-center min-h-[240px]"
            >
              <div className="bg-sky-500 group-hover:bg-sky-600 rounded-2xl p-5 mb-4 transition-colors shadow-lg">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1.5">Get Directions</h3>
              <p className="text-slate-500 text-sm mb-4">E-991, Saraswati Vihar<br />Delhi – 110034</p>
              <span className="inline-flex items-center gap-2 bg-sky-500 group-hover:bg-sky-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                Open in Google Maps <ArrowRight className="w-4 h-4" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-sky-600 text-white py-10 sm:py-14">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1.5">Need Help Choosing a Test?</h2>
              <p className="text-sky-100 text-sm sm:text-base">
                Call us Mon–Sat 7AM–8PM for a free consultation by our healthcare experts.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <a href="tel:+919811582086">
                <Button className="w-full sm:w-auto bg-white text-sky-700 hover:bg-sky-50 px-7 py-5 text-base font-bold rounded-xl shadow-lg transition-all">
                  <Phone className="mr-2 h-5 w-5" /> Call: +91 9811-582086
                </Button>
              </a>
              <Link href="/reports">
                <Button variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 px-7 py-5 text-base font-bold rounded-xl">
                  <Download className="mr-2 h-5 w-5" /> Download Reports
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
