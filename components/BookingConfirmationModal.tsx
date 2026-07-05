'use client';

import Link from 'next/link';
import { CheckCircle, Calendar, Clock, User, TestTube, Home, Building, Phone } from 'lucide-react';
import { Button } from './ui/button';

export interface BookingConfirmationDetails {
  orderId: string | number;
  patientName: string;
  testName: string;
  date: string;
  time: string;
  collectionType: 'home' | 'center';
  phone?: string;
}

interface Props {
  details: BookingConfirmationDetails;
  onClose: () => void;
}

export default function BookingConfirmationModal({ details, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-6 py-8 text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 rounded-full p-3">
              <CheckCircle className="w-14 h-14 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold mb-1">Booking Confirmed!</h2>
          <p className="text-green-100 text-sm">
            We have received your request. Our team will contact you shortly.
          </p>
          <div className="mt-3 inline-block bg-white/20 rounded-full px-4 py-1 text-xs font-bold tracking-wide">
            Order #{details.orderId}
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-5 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <User className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Patient</p>
              <p className="text-sm font-bold text-slate-800">{details.patientName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <TestTube className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Test</p>
              <p className="text-sm font-bold text-slate-800 line-clamp-2">{details.testName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <Calendar className="w-4 h-4 text-sky-600 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Date</p>
                <p className="text-sm font-bold text-slate-800">{details.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <Clock className="w-4 h-4 text-sky-600 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Time</p>
                <p className="text-sm font-bold text-slate-800">{details.time}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            {details.collectionType === 'home' ? (
              <Home className="w-4 h-4 text-sky-600 flex-shrink-0" />
            ) : (
              <Building className="w-4 h-4 text-sky-600 flex-shrink-0" />
            )}
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Collection</p>
              <p className="text-sm font-bold text-slate-800">
                {details.collectionType === 'home' ? 'Home Collection' : 'Visit Center — E-991, Saraswati Vihar, Delhi'}
              </p>
            </div>
          </div>

          {details.collectionType === 'home' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              Our phlebotomist will call you to confirm the visit time and distance charges.
            </div>
          )}

          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 flex items-center gap-2 text-xs text-sky-800">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            For any queries call us at <a href="tel:+919911380288" className="font-bold underline">+91 9911-380288</a>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1" onClick={onClose}>
            <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl">
              Go to Home
            </Button>
          </Link>
          <Link href="/book-test" className="flex-1" onClick={onClose}>
            <Button variant="outline" className="w-full border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50">
              Book Another Test
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
