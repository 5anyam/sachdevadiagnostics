"use client";
import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle, TestTube, Shield, Award, Clock } from "lucide-react";
import Image from "next/image";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.845L.057 23.547a.5.5 0 0 0 .609.61l5.78-1.514A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.947 9.947 0 0 1-5.112-1.408l-.367-.216-3.795.994.998-3.72-.234-.381A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
  </svg>
);

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com/sachdevadiagnostics",
    icon: FacebookIcon,
    bg: "bg-[#1877f2] hover:bg-[#1464d8]",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/sachdevadiagnostics",
    icon: InstagramIcon,
    bg: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@sachdevadiagnostics",
    icon: YoutubeIcon,
    bg: "bg-[#ff0000] hover:bg-[#cc0000]",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/919811582086",
    icon: WhatsAppIcon,
    bg: "bg-[#25d366] hover:bg-[#1ebe5d]",
    external: true,
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* ── FLOATING BUTTONS ── */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a
          href="https://wa.me/919811582086"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
          aria-label="WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
        <a
          href="tel:+919911380288"
          className="bg-sky-600 hover:bg-sky-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
          aria-label="Call Now"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>

      <footer className="bg-slate-900 text-white">
        {/* Accent top line */}
        <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600" />

        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

            {/* ── Brand ── */}
            <div>
              <div className="mb-4">
                <Image
                  src="/sachdeva-diagnostics-logo.png"
                  alt="Sachdeva Diagnostics Logo"
                  width={150}
                  height={78}
                  className="object-contain"
                />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                Providing accurate and reliable diagnostic services for over 30 years. NABL accredited lab with state-of-the-art technology.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="flex items-center gap-1.5 bg-sky-700/60 text-sky-200 px-3 py-1.5 rounded-lg text-xs font-medium">
                  <Award className="w-3.5 h-3.5" /> NABL Accredited
                </span>
              </div>

              {/* Social icons */}
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Follow Us</p>
                <div className="flex gap-2.5">
                  {SOCIAL_LINKS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className={`${s.bg} text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg`}
                    >
                      <s.icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Quick Links ── */}
            <div>
              <h3 className="text-base font-bold mb-5 text-white">Quick Links</h3>
              <ul className="space-y-2.5">
                {[
                  { name: "Home", href: "/" },
                  { name: "All Tests", href: "/tests" },
                  { name: "Health Packages", href: "/category/health-packages" },
                  { name: "Book a Test", href: "/book-test" },
                  { name: "About Us", href: "/about" },
                  { name: "Contact Us", href: "/contact" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-slate-400 hover:text-white hover:pl-1.5 transition-all duration-200 text-sm flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Services ── */}
            <div>
              <h3 className="text-base font-bold mb-5 text-white">Our Services</h3>
              <ul className="space-y-2.5">
                {[
                  { name: "3D/4D Ultrasound", href: "/category/3d-4d-ultrasound" },
                  { name: "Fetal Echo & Color Doppler", href: "/category/color-doppler-ultrasound" },
                  { name: "Pregnancy Ultrasound", href: "/category/pregnancy-ultrasound" },
                  { name: "Digital X-Ray & OPG", href: "/category/x-ray-test" },
                  { name: "ECG & FibroScan", href: "/tests" },
                  { name: "Pathology Lab", href: "/category/lab-tests" },
                  { name: "Bone Densitometry (DEXA)", href: "/tests" },
                  { name: "Home Sample Collection", href: "/book-test" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-slate-400 hover:text-white hover:pl-1.5 transition-all duration-200 text-sm flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Contact ── */}
            <div>
              <h3 className="text-base font-bold mb-5 text-white">Contact Info</h3>

              <div className="mb-5 p-4 bg-slate-800 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold text-white">Working Hours</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Mon – Sat: 8:00 AM – 8:00 PM<br />
                  Sunday: 8:30 AM – 1:00 PM
                </p>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                  <a
                    href="https://maps.google.com/?q=E-991,+Saraswati+Vihar,+Delhi+110034"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors text-sm leading-relaxed"
                  >
                    E-991, Saraswati Vihar,<br />Delhi – 110034
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    {["+91 9911-380288", "+91 9811-582086"].map((n) => (
                      <a key={n} href={`tel:${n.replace(/[\s\-]/g, "")}`} className="block text-slate-400 hover:text-white transition-colors text-sm">
                        {n}
                      </a>
                    ))}
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <a href="mailto:sachdevadiagnostics@gmail.com" className="text-slate-400 hover:text-white transition-colors text-xs break-all">
                    sachdevadiagnostics@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div className="border-t border-slate-800 mt-12 pt-8 space-y-4">
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> NABL Accredited</span>
              <span className="text-slate-700">|</span>
              <span className="flex items-center gap-1.5"><Award className="w-3 h-3" /> ISO Certified</span>
              <span className="text-slate-700">|</span>
              <span className="flex items-center gap-1.5"><TestTube className="w-3 h-3" /> Quality Assured</span>
              <span className="text-slate-700">|</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Saraswati Vihar, Delhi</span>
            </div>

            <p className="text-center text-xs text-slate-500">
              &copy; {currentYear}{" "}
              <span className="text-slate-300 font-semibold">Sachdeva Diagnostics</span>
              {" "}— Trusted Healthcare Partner Since 1993
            </p>

            <p className="text-center text-xs text-slate-600">
              Developed with ❤️ by{" "}
              <Link href="https://www.proshala.com" target="_blank" className="text-sky-500 hover:text-sky-400 transition-colors font-medium">
                Proshala
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
