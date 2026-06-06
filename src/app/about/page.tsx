'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  TestTube, Shield, Award, Clock, Users, Heart,
  CheckCircle, MapPin, Phone, Mail, Calendar,
  Microscope, Building, Target, Eye, Stethoscope,
  Activity, Zap, Home, Star, ArrowRight, MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

const milestones = [
  { year: "1993", title: "Foundation", description: "Sachdeva Diagnostics was established in Saraswati Vihar, Delhi with a vision to provide quality healthcare to the local community." },
  { year: "2000", title: "Expansion", description: "Expanded facilities and introduced advanced ultrasound imaging equipment to serve a growing patient base." },
  { year: "2005", title: "3D/4D Ultrasound", description: "Among the first centers in North Delhi to offer 3D/4D ultrasound — a major milestone in antenatal care." },
  { year: "2010", title: "NABL Accreditation", description: "Achieved prestigious NABL accreditation, validating our commitment to international quality standards in diagnostics." },
  { year: "2015", title: "Digital Reports", description: "Launched online report delivery and digital health records, making access to results faster and more convenient." },
  { year: "2020", title: "Home Collection", description: "Introduced free home sample collection for all lab tests — bringing diagnostics to patients' doorsteps." },
  { year: "2023", title: "AI-Assisted Reports", description: "Upgraded to latest diagnostic equipment and AI-assisted reporting for greater accuracy and speed." },
];

const achievements = [
  { icon: Award, title: "NABL Accredited", description: "Nationally accredited lab meeting international quality and reliability standards.", color: "from-sky-500 to-sky-600" },
  { icon: Shield, title: "ISO 15189:2012", description: "Certified for quality and competence in medical laboratory testing.", color: "from-green-500 to-green-600" },
  { icon: Clock, title: "Same Day Reports", description: "Fast turnaround — digital reports delivered the same day for most tests.", color: "from-amber-500 to-amber-600" },
  { icon: Users, title: "Expert Radiologists", description: "Experienced radiologists and pathologists with 20+ years of expertise.", color: "from-violet-500 to-violet-600" },
];

const services = [
  { icon: Activity, title: "3D/4D Ultrasound", description: "High-resolution 3D/4D fetal imaging for expectant mothers, with detailed anomaly and growth scans.", href: "/category/3d-4d-ultrasound" },
  { icon: Heart, title: "Color Doppler & Fetal Echo", description: "Advanced Doppler studies for fetal wellbeing, adult cardiac echo, and vascular assessments.", href: "/category/color-doppler-ultrasound" },
  { icon: Stethoscope, title: "Routine Ultrasound", description: "Thyroid, breast, abdomen, pelvic, and musculoskeletal ultrasound performed by experienced radiologists.", href: "/category/routine-ultrasound" },
  { icon: Zap, title: "Digital X-Ray & OPG", description: "High-resolution digital X-rays and dental OPG with same-day reports.", href: "/category/x-ray-test" },
  { icon: TestTube, title: "Pathology Lab", description: "Complete blood tests, biochemistry, culture & sensitivity, thyroid panels and over 500+ lab tests.", href: "/category/lab-tests" },
  { icon: Home, title: "Home Sample Collection", description: "Free home collection for all lab tests — our trained phlebotomists visit at your preferred time.", href: "/book-test" },
  { icon: Shield, title: "Bone Densitometry (DEXA)", description: "Accurate DEXA scan for bone mineral density to diagnose and monitor osteoporosis.", href: "/tests" },
  { icon: Microscope, title: "Health Packages", description: "Comprehensive full body health checkups, diabetes panels, cardiac risk profiles, and more.", href: "/category/health-packages" },
  { icon: Building, title: "Corporate Wellness", description: "Employee health programs, pre-employment medicals, and corporate tie-up packages available.", href: "/contact" },
];

const values = [
  "Accuracy & Precision in every result",
  "Patient-Centric Care at every step",
  "Ethical Practices and transparency",
  "Continuous Innovation in technology",
  "Affordability without compromising quality",
  "Compassion and respect for every patient",
];

const team = [
  { name: "Dr. Rajesh Sachdeva", position: "Chief Pathologist & Founder", qualifications: "MD Pathology, MBBS", experience: "30+ Years Experience" },
  { name: "Dr. Priya Sharma", position: "Senior Radiologist", qualifications: "MD Radiology, MBBS", experience: "15+ Years Experience" },
  { name: "Dr. Amit Kumar", position: "Clinical Biochemist", qualifications: "PhD Biochemistry, MSc", experience: "12+ Years Experience" },
  { name: "Ms. Sunita Verma", position: "Lab Manager", qualifications: "MSc MLT, BMLT", experience: "20+ Years Experience" },
];

export default function AboutUsPage() {
  const [counters, setCounters] = useState({ years: 0, patients: 0, tests: 0, rating: 0 });

  useEffect(() => {
    const target = { years: 30, patients: 500000, tests: 1000000, rating: 490 };
    const steps = 60;
    const stepDuration = 2000 / steps;
    let step = 0;

    const timer = setInterval(() => {
      if (step < steps) {
        step++;
        setCounters({
          years: Math.floor((target.years / steps) * step),
          patients: Math.floor((target.patients / steps) * step),
          tests: Math.floor((target.tests / steps) * step),
          rating: Math.floor((target.rating / steps) * step),
        });
      } else {
        setCounters(target);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* ── HERO ── */}
      <div className="bg-gradient-to-br from-[#194b8c] via-sky-700 to-sky-500 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white p-2 flex-shrink-0 shadow-lg">
                  <Image
                    src="/sachdeva-diagnostics-logo.png"
                    alt="Sachdeva Diagnostics Logo"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-sky-200 text-xs font-semibold tracking-widest uppercase mb-1">Since 1993</p>
                  <h1 className="text-3xl sm:text-4xl font-bold leading-tight">Sachdeva Diagnostics</h1>
                </div>
              </div>

              <p className="text-sky-100 text-base sm:text-lg leading-relaxed mb-6 max-w-lg">
                For over three decades, Sachdeva Diagnostics has been a trusted healthcare partner for
                families in Delhi. From our roots in Saraswati Vihar, we have grown to become one of
                North Delhi's most respected diagnostic centers — known for accuracy, compassion, and
                affordable care.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Badge className="bg-green-500/90 text-white px-4 py-2 text-sm">
                  <Award className="w-3.5 h-3.5 mr-1.5" />
                  NABL Accredited
                </Badge>
                <Badge className="bg-sky-500/90 text-white px-4 py-2 text-sm">
                  <Shield className="w-3.5 h-3.5 mr-1.5" />
                  ISO Certified
                </Badge>
                <Badge className="bg-amber-500/90 text-white px-4 py-2 text-sm">
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  Same Day Reports
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/book-test">
                  <Button className="bg-white text-[#194b8c] hover:bg-sky-50 font-bold px-6 py-2.5 rounded-xl shadow">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book a Test
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#194b8c] font-bold px-6 py-2.5 rounded-xl">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: `${counters.years}+`, label: "Years of Service", color: "text-green-300" },
                  { value: `5L+`, label: "Happy Patients", color: "text-sky-300" },
                  { value: `10L+`, label: "Tests Conducted", color: "text-purple-300" },
                  { value: `${(counters.rating / 100).toFixed(1)}`, label: "Google Rating ⭐", color: "text-amber-300" },
                ].map((stat, i) => (
                  <div key={i} className="text-center py-4">
                    <div className={`text-4xl sm:text-5xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/20 flex items-center justify-center gap-2 text-center">
                <MapPin className="w-4 h-4 text-sky-200" />
                <span className="text-white/80 text-sm">E-991, Saraswati Vihar, Delhi – 110034</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MISSION / VISION / VALUES ── */}
      <div className="py-16 sm:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sky-600 text-xs font-semibold tracking-widest uppercase mb-2">Our Foundation</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">What Drives Us</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Built on strong values and an unwavering commitment to healthcare excellence since 1993.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-[#194b8c]/20 hover:border-[#194b8c] hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-3">
                <div className="w-16 h-16 bg-gradient-to-r from-[#194b8c] to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-slate-800">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm text-center leading-relaxed">
                  To provide accurate, reliable, and timely diagnostic services that empower
                  healthcare providers to make informed decisions — and patients to take
                  control of their health. We are committed to making quality diagnostics
                  accessible and affordable for every family.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/20 hover:border-green-500 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-3">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-slate-800">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm text-center leading-relaxed">
                  To be the most trusted diagnostic partner in North Delhi — recognized for
                  clinical excellence, cutting-edge technology, and compassionate care. We
                  envision a future where preventive diagnostics help communities lead
                  healthier, longer lives.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-violet-500/20 hover:border-violet-500 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-3">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-slate-800">Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {values.map((v, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm">{v}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ── ACHIEVEMENTS ── */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sky-600 text-xs font-semibold tracking-widest uppercase mb-2">Recognition</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">Our Achievements</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Recognised for excellence in healthcare, diagnostic quality, and patient satisfaction.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {achievements.map((a, i) => (
              <div key={i} className="text-center bg-slate-50 rounded-2xl border border-slate-200 hover:border-sky-200 hover:shadow-lg p-6 transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-r ${a.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md`}>
                  <a.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{a.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICES ── */}
      <div className="py-16 sm:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sky-600 text-xs font-semibold tracking-widest uppercase mb-2">What We Do</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">Our Services</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Comprehensive diagnostic solutions under one roof — from pregnancy scans to full-body health packages.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc, i) => (
              <Link key={i} href={svc.href}>
                <div className="group bg-white rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-xl p-6 transition-all duration-300 h-full hover:-translate-y-0.5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 bg-sky-50 group-hover:bg-sky-100 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                      <svc.icon className="w-5 h-5 text-sky-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-colors leading-snug">{svc.title}</h3>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">{svc.description}</p>
                  <div className="flex items-center gap-1 mt-3 text-sky-500 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sky-600 text-xs font-semibold tracking-widest uppercase mb-2">Our History</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">30 Years of Growth</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Three decades of milestones, innovation, and service to the community of Delhi.
            </p>
          </div>

          {/* Mobile: vertical stack */}
          <div className="md:hidden max-w-lg mx-auto space-y-4">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#194b8c] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {m.year.slice(2)}
                  </div>
                  {i < milestones.length - 1 && <div className="w-0.5 flex-1 bg-sky-200 mt-2" />}
                </div>
                <div className="pb-4">
                  <div className="text-[#194b8c] font-bold text-sm mb-0.5">{m.year} — {m.title}</div>
                  <p className="text-slate-500 text-xs leading-relaxed">{m.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: alternating timeline */}
          <div className="hidden md:block max-w-4xl mx-auto relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#194b8c] to-sky-400" />
            {milestones.map((m, i) => (
              <div key={i} className={`flex items-start mb-10 gap-0 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${i % 2 === 0 ? 'pr-10 text-right' : 'pl-10 text-left'}`}>
                  <div className="bg-white border-2 border-slate-200 hover:border-[#194b8c] rounded-2xl p-5 transition-colors hover:shadow-lg">
                    <div className="text-xl font-bold text-[#194b8c] mb-1">{m.year}</div>
                    <h3 className="text-base font-bold text-slate-800 mb-1">{m.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{m.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#194b8c] rounded-full border-4 border-white shadow-lg" />
                <div className="w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TEAM ── */}
      <div className="py-16 sm:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sky-600 text-xs font-semibold tracking-widest uppercase mb-2">Our People</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">Meet Our Expert Team</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Experienced professionals dedicated to accuracy, care, and your wellbeing.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 hover:border-sky-200 hover:shadow-lg p-6 text-center transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-[#194b8c] to-sky-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-md">
                  <Stethoscope className="w-9 h-9 text-white" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">{member.name}</h3>
                <p className="text-sky-600 font-semibold text-xs mb-2">{member.position}</p>
                <p className="text-slate-400 text-xs mb-1">{member.qualifications}</p>
                <Badge variant="outline" className="text-[10px] border-sky-200 text-sky-700">{member.experience}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS STRIP ── */}
      <div className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sky-600 text-xs font-semibold tracking-widest uppercase mb-2">Patient Stories</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">What Our Patients Say</h2>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              <span className="text-slate-700 font-bold ml-2">4.9</span>
              <span className="text-slate-400 text-sm ml-1">(2,500+ reviews)</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "Rajesh Kumar", test: "Whole Abdomen Ultrasound", review: "Very professional service. Got my report within 6 hours. The doctor explained everything clearly. Highly recommended for anyone in Delhi!", rating: 5 },
              { name: "Priya Sharma", test: "TIFFA Scan (Anomaly Scan)", review: "Excellent experience during my pregnancy scan. Staff was very caring and the report was very detailed. Best centre in the area — felt in safe hands throughout.", rating: 5 },
              { name: "Amit Singh", test: "Full Body Health Checkup", review: "Best diagnostic center in North Delhi. Affordable prices, accurate reports, and very courteous staff. Will definitely visit again!", rating: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 hover:border-sky-200 hover:shadow-lg p-6 transition-all">
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
      </div>

      {/* ── CTA ── */}
      <div className="bg-gradient-to-r from-[#194b8c] to-sky-600 text-white py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Experience Quality Healthcare Today</h2>
          <p className="text-sky-100 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
            Trust Sachdeva Diagnostics for accurate results, compassionate care, and affordable pricing.
            Over 5 lakh patients have trusted us — we'd be honoured to serve you too.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/book-test">
              <Button size="lg" className="bg-white text-[#194b8c] hover:bg-sky-50 font-bold px-8 py-3 rounded-xl shadow-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Book Test Online
              </Button>
            </Link>
            <a href="tel:+919811582086">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#194b8c] font-bold px-8 py-3 rounded-xl">
                <Phone className="w-5 h-5 mr-2" />
                Call +91 9811-582086
              </Button>
            </a>
            <a href="https://wa.me/919911380288" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#194b8c] font-bold px-8 py-3 rounded-xl">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </Button>
            </a>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto border-t border-white/20 pt-10">
            <div className="flex items-center justify-center gap-3">
              <MapPin className="w-5 h-5 text-sky-200 flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold text-sm">Visit Our Centre</div>
                <div className="text-sky-200 text-xs">E-991, Saraswati Vihar, Delhi</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-5 h-5 text-sky-200 flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold text-sm">Working Hours</div>
                <div className="text-sky-200 text-xs">Mon–Sat 7AM–8PM | Sun 8AM–2PM</div>
                <div className="text-sky-300 text-[10px] mt-0.5">Ultrasound: Mon–Sat 9:30AM–3PM | Eves 6–7PM | Sun 11AM–12PM</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Mail className="w-5 h-5 text-sky-200 flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold text-sm">Email Us</div>
                <div className="text-sky-200 text-xs break-all">sachdevadiagnostics@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
