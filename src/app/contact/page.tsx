'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import {
  MapPin, Phone, Mail, Clock, MessageCircle,
  ArrowRight, Calendar, CheckCircle, Building2,
  PhoneCall
} from "lucide-react";
import { toast } from "../../../components/ui/sonner";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal("")),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const QUICK_ACTIONS = [
  {
    icon: PhoneCall,
    label: "Call Now",
    desc: "Mon–Sat 8AM–8PM",
    href: "tel:+919911380288",
    value: "+91 9911-380288",
    bg: "bg-sky-500",
    hoverBg: "hover:bg-sky-600",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    desc: "Quick response",
    href: "https://wa.me/919811582086",
    value: "+91 9811-582086",
    bg: "bg-green-500",
    hoverBg: "hover:bg-green-600",
  },
  {
    icon: Mail,
    label: "Email Us",
    desc: "We reply within 24 hrs",
    href: "mailto:sachdevadiagnostics@gmail.com",
    value: "sachdevadiagnostics@gmail.com",
    bg: "bg-amber-500",
    hoverBg: "hover:bg-amber-600",
  },
];

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    bg: "bg-sky-100",
    color: "text-sky-600",
    label: "Our Address",
    content: (
      <a
        href="https://maps.google.com/?q=E-991,+Saraswati+Vihar,+Delhi+110034"
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-600 text-sm hover:text-sky-600 transition-colors leading-relaxed"
      >
        E-991, Saraswati Vihar<br />Delhi – 110034
      </a>
    ),
  },
  {
    icon: Phone,
    bg: "bg-green-100",
    color: "text-green-600",
    label: "Phone & Mobile",
    content: (
      <div className="space-y-1">
        {[
          "+91 9911-380288",
          "+91 9811-582086",
        ].map((n) => (
          <a
            key={n}
            href={`tel:${n.replace(/[\s\-]/g, "")}`}
            className="block text-slate-600 text-sm hover:text-sky-600 transition-colors"
          >
            {n}
          </a>
        ))}
      </div>
    ),
  },
  {
    icon: Mail,
    bg: "bg-amber-100",
    color: "text-amber-600",
    label: "Email",
    content: (
      <a
        href="mailto:sachdevadiagnostics@gmail.com"
        className="text-slate-600 text-sm hover:text-sky-600 transition-colors break-all"
      >
        sachdevadiagnostics@gmail.com
      </a>
    ),
  },
  {
    icon: Clock,
    bg: "bg-purple-100",
    color: "text-purple-600",
    label: "Working Hours",
    content: (
      <div className="text-slate-600 text-sm space-y-0.5">
        <p><span className="font-medium text-slate-700">Mon – Sat:</span> 8:00 AM – 8:00 PM</p>
        <p><span className="font-medium text-slate-700">Sunday:</span> 8:30 AM – 1:00 PM</p>
        <p className="text-sky-600 font-semibold text-xs pt-1">Ultrasound Timings:</p>
        <p><span className="font-medium text-slate-700">Mon – Sat:</span> 9:30 AM – 3:00 PM</p>
        <p><span className="font-medium text-slate-700">Evenings (Mon/Tue/Wed/Fri):</span> 6:00 – 7:00PM <span className="text-slate-400 text-[10px]">(Appt. preferred)</span></p>
        <p><span className="font-medium text-slate-700">Sunday:</span> 11:00 AM – 12:00 PM <span className="text-slate-400 text-[10px]">(Appt. preferred)</span></p>
      </div>
    ),
  },
];

const FAQS = [
  {
    q: "Do you have home sample collection?",
    a: "Yes! We offer free home sample collection for all lab tests. Call or book online to schedule a visit at your convenience.",
  },
  {
    q: "How soon do I get my reports?",
    a: "Most reports are available the same day. For complex tests, it may take up to 24 hours. Reports are delivered digitally.",
  },
  {
    q: "Do I need an appointment for ultrasound?",
    a: "Appointments are preferred for ultrasound. Timings — Mon–Sat: 9:30 AM–3:00 PM; Evenings (Mon/Tue/Wed/Fri): 6:00–7:00PM; Sunday: 11:00AM–12:00PM. Walk-ins are welcome but may experience a wait.",
  },
  {
    q: "When is the best time to do a 4D ultrasound in pregnancy?",
    a: "The best time is usually 24 to 32 weeks, especially 26 to 30 weeks. At this stage, the baby’s features are clearer, and there’s enough space and fluid for good images. Before 24 weeks, the face may look less developed; after 34 weeks, the view may be less clear.",
  },
];

export default function ContactPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Message sent successfully!", {
      description: "Our team will get back to you shortly.",
    });
    form.reset();
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* ── HERO ── */}
      <div className="bg-gradient-to-br from-sky-600 via-sky-500 to-sky-400 text-white py-14 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sky-200 text-sm font-semibold tracking-widest uppercase mb-2">Reach Out to Us</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Contact Sachdeva Diagnostics</h1>
          <p className="text-sky-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Have a question about tests, reports, or home collection? Our team is here to help — Mon to Sat, 8 AM to 8 PM.
          </p>

          {/* Quick action cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {QUICK_ACTIONS.map((action) => (
              <a
                key={action.label}
                href={action.href}
                target={action.href.startsWith("http") ? "_blank" : undefined}
                rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`${action.bg} ${action.hoverBg} text-white rounded-2xl p-5 flex flex-col items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-xl`}
              >
                <action.icon className="w-8 h-8" />
                <span className="font-extrabold text-xl">{action.label}</span>
                <span className="text-white/90 text-sm font-bold">{action.value}</span>
                <span className="text-white/70 text-xs font-bold">{action.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="container mx-auto px-4 py-14 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 max-w-6xl mx-auto">

          {/* Left — Contact Info + Map */}
          <div className="space-y-8">
            <div>
              <p className="text-sky-600 text-xs font-semibold tracking-widest uppercase mb-1">Get In Touch</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Visit or Call Us</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                We are located in Saraswati Vihar, Delhi. Walk-ins are welcome, or book an appointment online for a seamless experience.
              </p>
            </div>

            {/* Details card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-6">
              {CONTACT_DETAILS.map(({ icon: Icon, bg, color, label, content }) => (
                <div key={label} className="flex gap-4">
                  <div className={`${bg} p-2.5 rounded-xl flex-shrink-0 h-fit mt-0.5`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm mb-1">{label}</p>
                    {content}
                  </div>
                </div>
              ))}
            </div>

            {/* Map button */}
            <a
              href="https://maps.google.com/?q=E-991,+Saraswati+Vihar,+Delhi+110034"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between bg-white border border-slate-200 hover:border-sky-300 hover:shadow-lg rounded-2xl p-5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-sky-500 group-hover:bg-sky-600 rounded-xl p-3 transition-colors">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Open in Google Maps</p>
                  <p className="text-slate-400 text-xs">E-991, Saraswati Vihar, Delhi – 110034</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-sky-500 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Book test CTA */}
            <Link href="/book-test">
              <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow">
                <Calendar className="w-4 h-4" />
                Book a Test Online
              </Button>
            </Link>
          </div>

          {/* Right — Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Send Us a Message</h2>
              <p className="text-slate-500 text-sm">We typically reply within a few hours on working days.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold text-sm">Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" className="rounded-xl border-slate-200" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold text-sm">Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 98XXX XXXXX" className="rounded-xl border-slate-200" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold text-sm">Email Address (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" className="rounded-xl border-slate-200" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold text-sm">Subject *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Enquiry about ultrasound booking" className="rounded-xl border-slate-200" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold text-sm">Message *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us how we can help you..."
                          className="min-h-32 rounded-xl border-slate-200 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl text-sm transition-all shadow"
                >
                  Send Message
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="bg-slate-50 py-14 sm:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-sky-600 text-xs font-semibold tracking-widest uppercase mb-1">Help</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Frequently Asked Questions</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-sky-200 hover:shadow-md transition-all">
                <div className="flex items-start gap-3 mb-2">
                  <CheckCircle className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                  <h3 className="font-bold text-slate-800 text-sm leading-snug">{faq.q}</h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <div className="bg-sky-600 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <Building2 className="w-10 h-10 mx-auto mb-4 text-sky-200" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Sachdeva Diagnostics</h2>
          <p className="text-sky-100 text-sm mb-6">E-991, Saraswati Vihar, Delhi – 110034</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+919911380288">
              <Button className="bg-white text-sky-700 hover:bg-sky-50 font-bold px-7 py-2.5 rounded-xl shadow">
                <Phone className="w-4 h-4 mr-2" />
                +91 9911-380288
              </Button>
            </a>
            <a href="https://wa.me/919811582086" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-sky-700 font-bold px-7 py-2.5 rounded-xl">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
