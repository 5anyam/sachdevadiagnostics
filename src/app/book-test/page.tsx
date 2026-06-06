'use client';

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Home, Building } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import { Button } from '../../../components/ui/button';
import { Calendar } from '../../../components/ui/calendar';
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage, FormDescription,
} from '../../../components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '../../../components/ui/select';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Badge } from '../../../components/ui/badge';
import { toast } from '../../../components/ui/sonner';
import { cn } from '../../../lib/utils';
import { createOrder, getSlotCountsForDate } from '../../../services/createorder';

/* --------------------------------------------------
   Constants
---------------------------------------------------*/
const CONTROL_BASE =
  'w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 ' +
  'px-4 py-2 leading-tight transition focus:outline-none focus:ring-2 focus:ring-blue-500';
const INPUT_STYLES = CONTROL_BASE;
const TRIGGER_STYLES = `${CONTROL_BASE} flex justify-between items-center`;

// Ultrasound slots: Mon–Sat 9:30 AM–3:00 PM, Evenings (Mon/Tue/Wed/Fri) 6–7 PM, Sun 11 AM–12 PM
const TIMES = [
  '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
  '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
  '18:00', '18:30',
] as const;

type TimeValue = typeof TIMES[number];

const MAX_PER_SLOT = 2;
const BASE_PRICE = 100;

function formatTime(t: string): string {
  const [hStr, mStr] = t.split(':');
  const h = parseInt(hStr, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${mStr} ${period}`;
}

// Categories allowed for home collection (blood/lab tests only)
const HOME_CATEGORIES = [
  { value: 'blood-test',          label: 'Blood Test' },
  { value: 'urine-test',          label: 'Urine Analysis' },
  { value: 'health-checkup',      label: 'Health Checkup Package' },
  { value: 'diabetes-panel',      label: 'Diabetes Panel' },
  { value: 'thyroid-test',        label: 'Thyroid Function Test' },
  { value: 'liver-function',      label: 'Liver Function Test' },
  { value: 'kidney-function',     label: 'Kidney Function Test' },
  { value: 'cancer-screening',    label: 'Cancer Screening' },
  { value: 'hormone-test',        label: 'Hormone Tests' },
  { value: 'infection-screening', label: 'Infection Screening' },
  { value: 'other-lab',           label: 'Other Lab Test' },
];

// Additional categories only available at center
const CENTER_ONLY_CATEGORIES = [
  { value: 'cardiac-profile',     label: 'Cardiac Profile' },
  { value: 'ultrasound',          label: 'Ultrasound' },
  { value: 'x-ray',               label: 'X-Ray / Digital X-Ray / OPG' },
  { value: 'ecg',                 label: 'ECG / Fibro Scan' },
  { value: 'bone-densitometry',   label: 'Bone Densitometry (Dexa)' },
  { value: '3d-4d-ultrasound',    label: '3D/4D Ultrasound' },
  { value: 'other',               label: 'Other' },
];

const ALL_CATEGORIES = [...HOME_CATEGORIES, ...CENTER_ONLY_CATEGORIES];

const HOME_CATEGORY_VALUES = new Set(HOME_CATEGORIES.map(c => c.value));

/* --------------------------------------------------
   Zod schema
---------------------------------------------------*/
const formSchema = z.object({
  name:            z.string().min(2, 'Name must be at least 2 characters.'),
  email:           z.string().email('Please enter a valid email address.'),
  phone:           z.string().min(10, 'Phone number must be at least 10 digits.'),
  whatsapp:        z.string().min(10, 'WhatsApp number must be at least 10 digits.'),
  age:             z.string().min(1, 'Please enter age.'),
  gender:          z.string({ required_error: 'Please select gender.' }),
  testType:        z.string({ required_error: 'Please select a test category.' }),
  product:         z.string().optional(),
  collectionType:  z.enum(['home', 'center'], { required_error: 'Please select collection type.' }),
  date:            z.date({ required_error: 'Please select a date.' }),
  time:            z.enum(TIMES, { required_error: 'Please select a time slot.' }),
  address:         z.string().optional(),
  requirements:    z.string().optional(),
  emergencyContact:z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

/* --------------------------------------------------
   URL params helper
---------------------------------------------------*/
function useSearchParamsSafe() {
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, []);
  return searchParams;
}

/* --------------------------------------------------
   Main form component
---------------------------------------------------*/
function TestBookingFormContent() {
  const router = useRouter();
  const searchParams = useSearchParamsSafe();

  const testParam  = searchParams?.get('test') ?? '';
  const dateParam  = searchParams?.get('date');
  const timeParam  = searchParams?.get('time') ?? '';

  const initialDate = useMemo(() => {
    if (!dateParam) return undefined;
    const d = new Date(dateParam);
    return isNaN(d.getTime()) ? undefined : d;
  }, [dateParam]);

  const isValidTime = (t: string): t is TimeValue => TIMES.includes(t as TimeValue);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '', email: '', phone: '', whatsapp: '',
      age: '', gender: '', testType: '', product: testParam,
      collectionType: 'center',
      date: initialDate,
      time: isValidTime(timeParam) ? timeParam : undefined,
      address: '', requirements: '', emergencyContact: '',
    },
    mode: 'onBlur',
  });

  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [slotCounts,    setSlotCounts]    = useState<Record<string, number>>({});
  const [loadingSlots,  setLoadingSlots]  = useState(false);

  const watchCollectionType = form.watch('collectionType');
  const watchDate           = form.watch('date');
  const watchTime           = form.watch('time');

  // Sync URL params on mount
  useEffect(() => {
    if (initialDate)               form.setValue('date', initialDate);
    if (isValidTime(timeParam))    form.setValue('time', timeParam);
  }, [initialDate, timeParam]); // eslint-disable-line react-hooks/exhaustive-deps

  // When switching to home collection, clear incompatible test category
  useEffect(() => {
    if (watchCollectionType === 'home') {
      const current = form.getValues('testType');
      if (current && !HOME_CATEGORY_VALUES.has(current)) {
        form.setValue('testType', '');
      }
    }
  }, [watchCollectionType]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch slot counts whenever selected date changes
  useEffect(() => {
    if (!watchDate) return;
    const dateStr = format(watchDate, 'yyyy-MM-dd');
    setLoadingSlots(true);
    getSlotCountsForDate(dateStr)
      .then(setSlotCounts)
      .finally(() => setLoadingSlots(false));
  }, [watchDate]);

  const isSlotFull = (t: string) => (slotCounts[t] ?? 0) >= MAX_PER_SLOT;

  const availableCategories =
    watchCollectionType === 'home' ? HOME_CATEGORIES : ALL_CATEGORIES;

  /* ----------------------------------------------
     Submit
  ------------------------------------------------*/
  const onSubmit = async (values: FormValues) => {
    // Double-check slot before submitting
    if (isSlotFull(values.time)) {
      toast.error('This time slot is full', {
        description: 'Please select a different time slot.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const [firstName, ...rest] = values.name.trim().split(' ');
      const lastName  = rest.join(' ') || 'N/A';
      const testSku   = `TEST_${Date.now()}`;
      const dateStr   = format(values.date, 'yyyy-MM-dd');

      const orderData = {
        billing: {
          first_name: firstName, last_name: lastName,
          email: values.email, phone: values.phone,
          address_1: values.address || 'Sachdeva Diagnostics Center',
          city: 'Delhi', state: 'Delhi', postcode: '110034', country: 'IN',
        },
        shipping: {
          first_name: firstName, last_name: lastName,
          address_1: values.address || 'Sachdeva Diagnostics Center',
          city: 'Delhi', state: 'Delhi', postcode: '110034', country: 'IN',
        },
        line_items: [{
          sku: testSku,
          name: values.product || values.testType || 'Diagnostic Test Booking',
          quantity: 1,
          price: BASE_PRICE.toString(),
          subtotal: BASE_PRICE.toString(),
          total: BASE_PRICE.toString(),
          tax_class: '',
          meta_data: [
            { key: 'service_type',     value: 'diagnostic_test' },
            { key: 'booking_id',       value: testSku },
            { key: 'collection_type',  value: values.collectionType },
          ],
        }],
        meta_data: [
          { key: 'test_type',          value: values.testType },
          { key: 'patient_age',        value: values.age },
          { key: 'patient_gender',     value: values.gender },
          { key: 'collection_type',    value: values.collectionType },
          { key: 'appointment_date',   value: dateStr },
          { key: 'appointment_time',   value: values.time },
          { key: 'collection_address', value: values.address || 'Center Visit' },
          { key: 'whatsapp_number',    value: values.whatsapp },
          { key: 'emergency_contact',  value: values.emergencyContact || '' },
          { key: 'special_requirements', value: values.requirements || '' },
          { key: 'booking_type',       value: 'diagnostic_test' },
          { key: 'submitted_at',       value: new Date().toISOString() },
          { key: 'patient_name',       value: values.name },
          { key: 'patient_email',      value: values.email },
          { key: 'patient_phone',      value: values.phone },
        ],
        currency: 'INR',
        status: 'pending',
        payment_method: 'test_booking',
        payment_method_title: 'Test Booking Request',
        set_paid: false,
        customer_note: values.requirements || '',
        shipping_total: '0.00',
        shipping_tax: '0.00',
        fee_lines: [],
        coupon_lines: [],
        refunds: [],
      };

      const order = await createOrder(orderData);

      toast.success('Booking confirmed!', {
        description: `Order #${order.id} created. ${
          values.collectionType === 'home'
            ? 'Our phlebotomist will call to confirm distance charges before visit.'
            : 'Please visit our center at the scheduled time.'
        }`,
      });

      form.reset();
      setTimeout(() => router.push('/'), 3000);
    } catch (err) {
      console.error('Booking error:', err);
      toast.error('Booking failed', {
        description: 'Please try again or call us at +91 9911-380288.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        [data-radix-select-content] {
          background-color: white !important; color: black !important;
          border: 1px solid #d1d5db !important; border-radius: 8px !important;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,.1) !important; z-index: 50 !important;
        }
        [data-radix-select-item] {
          color: black !important; background-color: white !important;
          padding: 8px 12px !important; cursor: pointer !important;
          font-size: 14px !important;
        }
        [data-radix-select-item]:hover,
        [data-radix-select-item][data-highlighted] {
          background-color: #f3f4f6 !important; color: #194b8c !important;
        }
        [data-radix-select-item][data-state="checked"] {
          background-color: #e0f2fe !important; color: #194b8c !important; font-weight: 500 !important;
        }
        [data-radix-popover-content] {
          background-color: white !important; color: black !important;
          border: 1px solid #d1d5db !important; border-radius: 8px !important;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,.1) !important; z-index: 50 !important;
        }
        .rdp { background-color: white !important; color: black !important; }
        .rdp-button { color: black !important; }
        .rdp-button:hover { background-color: #f3f4f6 !important; color: #194b8c !important; }
      `}</style>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[#194b8c]">
              Book Home Sample Collection
            </h1>
            <p className="text-gray-600 mb-4">
              Sachdeva Diagnostics - Professional blood sample collection at your Doorstep.
            </p>
            <div className="inline-flex flex-col sm:flex-row gap-3 bg-blue-50 border border-blue-200 rounded-xl px-6 py-3 text-sm text-[#194b8c]">
              <span className="hidden sm:block text-blue-300">|</span>
              <span>Home collection: ₹100 + distance charges</span>
              <span className="hidden sm:block text-blue-300">|</span>
              <span>Slots: 7:30 AM – 10:00 AM</span>
            </div>
            {testParam && (
              <div className="mt-3 inline-block bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-800">
                Selected Test: <span className="font-semibold">{testParam}</span>
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-xl p-6 md:p-8 shadow-md border border-blue-100">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">

                {/* Patient Information */}
                <div className="bg-white rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#194b8c] mb-4">Patient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-medium">Full Name</FormLabel>
                        <FormControl>
                          <Input className={INPUT_STYLES} placeholder="Patient's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="age" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-medium">Age</FormLabel>
                        <FormControl>
                          <Input className={INPUT_STYLES} placeholder="Age" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-medium">Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={`${TRIGGER_STYLES} bg-white text-black`}>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border border-gray-300 shadow-lg">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-medium">Phone Number</FormLabel>
                        <FormControl>
                          <Input className={INPUT_STYLES} placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="whatsapp" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-medium">WhatsApp Number</FormLabel>
                        <FormControl>
                          <Input className={INPUT_STYLES} placeholder="WhatsApp number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-medium">Email</FormLabel>
                        <FormControl>
                          <Input className={INPUT_STYLES} placeholder="Email address" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                  </div>
                </div>

                {/* Collection Type */}
                <div className="bg-white rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#194b8c] mb-4">Collection Preference</h3>

                  <FormField control={form.control} name="collectionType" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          <div className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${field.value === 'center' ? 'border-[#194b8c] bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                            <RadioGroupItem value="center" id="center" />
                            <label htmlFor="center" className="flex items-center cursor-pointer flex-1">
                              <Building className="h-5 w-5 text-[#194b8c] mr-3 flex-shrink-0" />
                              <div>
                                <div className="font-semibold text-gray-900">Visit Center</div>
                                <div className="text-xs text-gray-500">All tests available • ₹100 booking fee</div>
                              </div>
                            </label>
                          </div>
                          <div className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${field.value === 'home' ? 'border-[#194b8c] bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                            <RadioGroupItem value="home" id="home" />
                            <label htmlFor="home" className="flex items-center cursor-pointer flex-1">
                              <Home className="h-5 w-5 text-[#194b8c] mr-3 flex-shrink-0" />
                              <div>
                                <div className="font-semibold text-gray-900">Home Collection</div>
                                <div className="text-xs text-gray-500">Blood/lab tests only • ₹100 + distance charges</div>
                              </div>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {watchCollectionType === 'home' && (
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                      Home collection is available only for blood tests and lab tests. Our phlebotomist will call you to confirm the distance charges before visiting.
                    </div>
                  )}

                  {/* Address for home collection */}
                  {watchCollectionType === 'home' && (
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel className="text-gray-800 font-medium">
                          Home Address <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className={`min-h-20 ${INPUT_STYLES}`}
                            placeholder="Complete address with landmarks for sample collection"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Include flat/house number, street, sector, and nearest landmark</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                </div>

                {/* Test Information */}
                <div className="bg-white rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#194b8c] mb-4">Test Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <FormField control={form.control} name="testType" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-medium">
                          Test Category
                          {watchCollectionType === 'home' && (
                            <span className="ml-2 text-xs text-amber-600 font-normal">(Home-eligible only)</span>
                          )}
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className={`${TRIGGER_STYLES} bg-white text-black`}>
                              <SelectValue placeholder="Select test category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-64 overflow-y-auto bg-white border border-gray-300 shadow-lg">
                            {availableCategories.map(cat => (
                              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {testParam && (
                      <FormField control={form.control} name="product" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800 font-medium">Selected Test</FormLabel>
                          <FormControl>
                            <Input className="bg-gray-100 text-gray-800" readOnly {...field} />
                          </FormControl>
                        </FormItem>
                      )} />
                    )}

                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-white rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#194b8c] mb-1">Schedule Appointment</h3>
                  <p className="text-xs text-gray-500 mb-1">Mon–Sat: 9:30 AM – 3:00 PM · Eves (Mon/Tue/Wed/Fri): 6:00–7:00 PM · Sun: 11:00 AM–12:00 PM</p>
                  <p className="text-xs text-[#194b8c] font-medium mb-4">Appointment preferred · Max 2 bookings per slot</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Date */}
                    <FormField control={form.control} name="date" render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-gray-800 font-medium">Appointment Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  `${TRIGGER_STYLES} pl-3 text-left font-normal bg-white text-black`,
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-white border border-gray-300 shadow-lg" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                              initialFocus
                              className="p-3 pointer-events-auto bg-white"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Time */}
                    <FormField control={form.control} name="time" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-medium">
                          Time Slot
                          {loadingSlots && <span className="ml-2 text-xs text-blue-500">Checking availability…</span>}
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className={`${TRIGGER_STYLES} bg-white text-black`}>
                              <SelectValue placeholder="Select time slot" />
                              <Clock className="h-4 w-4 opacity-50 ml-1" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border border-gray-300 shadow-lg">
                            {TIMES.map((t) => {
                              const full = isSlotFull(t);
                              const count = slotCounts[t] ?? 0;
                              return (
                                <SelectItem
                                  key={t}
                                  value={t}
                                  disabled={full}
                                  className={cn(
                                    'flex items-center justify-between',
                                    full ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                  )}
                                >
                                  <span>{formatTime(t)}</span>
                                  {full ? (
                                    <Badge className="ml-2 bg-red-100 text-red-700 text-[10px] border-0">Full</Badge>
                                  ) : count === 1 ? (
                                    <Badge className="ml-2 bg-amber-100 text-amber-700 text-[10px] border-0">1 left</Badge>
                                  ) : null}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-white rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#194b8c] mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                    <FormField control={form.control} name="emergencyContact" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-medium">Emergency Contact (Optional)</FormLabel>
                        <FormControl>
                          <Input className={INPUT_STYLES} placeholder="Emergency contact number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="requirements" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Special Requirements / Medical History</FormLabel>
                      <FormControl>
                        <Textarea
                          className={`min-h-24 ${INPUT_STYLES}`}
                          placeholder="Any medical conditions, medications, fasting requirements, or special notes"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Price Summary */}
                <div className="bg-gradient-to-r from-[#194b8c] to-blue-600 text-white rounded-xl p-5">
                  <h3 className="font-semibold mb-3">Price Summary</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold">
                        {watchCollectionType === 'home' ? 'Home Collection' : 'Center Visit'}
                      </div>
                      {watchCollectionType === 'home' ? (
                        <div className="text-sm opacity-80 mt-0.5">₹100 booking fee + distance charges (confirmed by phlebotomist)</div>
                      ) : (
                        <div className="text-sm opacity-80 mt-0.5">Booking fee only — test charges payable at center</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold">₹{BASE_PRICE}</div>
                      {watchCollectionType === 'home' && (
                        <div className="text-xs opacity-70">+ distance</div>
                      )}
                    </div>
                  </div>
                  {watchTime && watchDate && (
                    <div className="mt-3 pt-3 border-t border-white/20 text-sm opacity-90">
                      {format(watchDate, 'dd MMM yyyy')} at {formatTime(watchTime)}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || (!!watchTime && isSlotFull(watchTime))}
                  className="w-full bg-[#194b8c] hover:bg-blue-700 text-white py-4 text-lg font-semibold"
                >
                  {isSubmitting
                    ? 'Booking…'
                    : watchTime && isSlotFull(watchTime)
                    ? 'Slot Full — Choose Another Time'
                    : `Confirm Booking — ₹${BASE_PRICE}`}
                </Button>

              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

/* --------------------------------------------------
   Loading skeleton
---------------------------------------------------*/
function TestBookingPageLoading() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-200 rounded w-80 mx-auto mb-3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-56 mx-auto animate-pulse" />
        </div>
        <div className="bg-blue-50 rounded-xl p-8 space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6">
              <div className="h-5 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    <div className="h-10 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const DynamicBookingForm = dynamic(() => Promise.resolve(TestBookingFormContent), {
  ssr: false,
  loading: () => <TestBookingPageLoading />,
});

export default function TestBookingPage() {
  return (
    <div className="min-h-screen bg-blue-50">
      <DynamicBookingForm />
    </div>
  );
}
