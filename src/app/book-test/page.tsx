'use client';

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Home, Building, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Skeleton } from '../../../components/ui/skeleton';
import { toast } from '../../../components/ui/sonner';
import { cn } from '../../../lib/utils';
import { createOrder, getSlotCountsForDate } from '../../../services/createorder';
import {
  getProductCategories, getProductsByCategory,
  formatPrice, Product, Category,
} from '../../../services/wordpress';
import { submitToGoogleSheet } from '../../../services/googlesheet';
import BookingConfirmationModal, { BookingConfirmationDetails } from '../../../components/BookingConfirmationModal';

/* --------------------------------------------------
   Constants
---------------------------------------------------*/
const CONTROL_BASE =
  'w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 ' +
  'px-4 py-2 leading-tight transition focus:outline-none focus:ring-2 focus:ring-blue-500';
const INPUT_STYLES = CONTROL_BASE;
const TRIGGER_STYLES = `${CONTROL_BASE} flex justify-between items-center`;

const TIMES = [
  '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
  '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
  '18:00', '18:30',
] as const;

type TimeValue = typeof TIMES[number];

const MAX_PER_SLOT = 2;
const BASE_PRICE = 100;

// These categories require center visit (no home collection)
const CENTER_ONLY_SLUGS = new Set([
  'ultrasound', 'x-ray', 'ecg-fibroscan', 'bone-densitometry-dexa',
  '3d-4d-ultrasound', 'color-doppler-ultrasound', 'echo',
  'routine-ultrasound', 'special-ultrasound', 'cardiac-profile',
]);

function formatTime(t: string): string {
  const [hStr, mStr] = t.split(':');
  const h = parseInt(hStr, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${mStr} ${period}`;
}

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
  const searchParams = useSearchParamsSafe();

  const testParam = searchParams?.get('test') ?? '';
  const dateParam = searchParams?.get('date');
  const timeParam = searchParams?.get('time') ?? '';

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
  const [confirmation,  setConfirmation]  = useState<BookingConfirmationDetails | null>(null);

  // WordPress categories + tests
  const [wpCategories,  setWpCategories]  = useState<Category[]>([]);
  const [categoryTests, setCategoryTests] = useState<Product[]>([]);
  const [loadingTests,  setLoadingTests]  = useState(false);
  const [selectedTest,  setSelectedTest]  = useState<Product | null>(null);

  const watchCollectionType = form.watch('collectionType');
  const watchDate           = form.watch('date');
  const watchTime           = form.watch('time');
  const watchTestType       = form.watch('testType');

  // Fetch all WordPress categories on mount
  useEffect(() => {
    getProductCategories({ per_page: 100, orderby: 'count', order: 'desc' })
      .then(cats => setWpCategories(cats.filter(c => (c.count ?? 0) > 0)))
      .catch(console.error);
  }, []);

  // Sync URL params
  useEffect(() => {
    if (initialDate)             form.setValue('date', initialDate);
    if (isValidTime(timeParam))  form.setValue('time', timeParam);
  }, [initialDate, timeParam]); // eslint-disable-line react-hooks/exhaustive-deps

  // When collection type switches to home, clear incompatible category
  useEffect(() => {
    if (watchCollectionType === 'home') {
      const current = form.getValues('testType');
      if (current && CENTER_ONLY_SLUGS.has(current)) {
        form.setValue('testType', '');
        setCategoryTests([]);
        setSelectedTest(null);
        form.setValue('product', '');
      }
    }
  }, [watchCollectionType]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch tests when category changes
  useEffect(() => {
    if (!watchTestType) { setCategoryTests([]); setSelectedTest(null); return; }
    const cat = wpCategories.find(c => c.slug === watchTestType);
    if (!cat) return;
    setLoadingTests(true);
    setSelectedTest(null);
    form.setValue('product', testParam || '');
    getProductsByCategory(cat.id, { per_page: 50 })
      .then(products => {
        const sorted = [...products].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        setCategoryTests(sorted);
      })
      .catch(console.error)
      .finally(() => setLoadingTests(false));
  }, [watchTestType, wpCategories]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch slot counts when date changes
  useEffect(() => {
    if (!watchDate) return;
    const dateStr = format(watchDate, 'yyyy-MM-dd');
    setLoadingSlots(true);
    getSlotCountsForDate(dateStr)
      .then(setSlotCounts)
      .finally(() => setLoadingSlots(false));
  }, [watchDate]);

  const isSlotFull = (t: string) => (slotCounts[t] ?? 0) >= MAX_PER_SLOT;

  const availableCategories = useMemo(() => {
    if (watchCollectionType === 'home') {
      return wpCategories.filter(c => !CENTER_ONLY_SLUGS.has(c.slug));
    }
    return wpCategories;
  }, [watchCollectionType, wpCategories]);

  const handleSelectTest = (test: Product) => {
    setSelectedTest(test);
    form.setValue('product', test.name);
  };

  /* ----------------------------------------------
     Submit
  ------------------------------------------------*/
  const onSubmit = async (values: FormValues) => {
    if (isSlotFull(values.time)) {
      toast.error('This time slot is full', { description: 'Please select a different time slot.' });
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
            { key: 'service_type',    value: 'diagnostic_test' },
            { key: 'booking_id',      value: testSku },
            { key: 'collection_type', value: values.collectionType },
          ],
        }],
        meta_data: [
          { key: 'test_type',           value: values.testType },
          { key: 'patient_age',         value: values.age },
          { key: 'patient_gender',      value: values.gender },
          { key: 'collection_type',     value: values.collectionType },
          { key: 'appointment_date',    value: dateStr },
          { key: 'appointment_time',    value: values.time },
          { key: 'collection_address',  value: values.address || 'Center Visit' },
          { key: 'whatsapp_number',     value: values.whatsapp },
          { key: 'emergency_contact',   value: values.emergencyContact || '' },
          { key: 'special_requirements',value: values.requirements || '' },
          { key: 'booking_type',        value: 'diagnostic_test' },
          { key: 'submitted_at',        value: new Date().toISOString() },
          { key: 'patient_name',        value: values.name },
          { key: 'patient_email',       value: values.email },
          { key: 'patient_phone',       value: values.phone },
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

      // Send to Google Sheet
      await submitToGoogleSheet({
        timestamp:       new Date().toISOString(),
        source:          'book-test-page',
        name:            values.name,
        age:             values.age,
        gender:          values.gender,
        phone:           values.phone,
        whatsapp:        values.whatsapp,
        email:           values.email,
        testCategory:    values.testType,
        testName:        values.product || values.testType || 'Diagnostic Test',
        collectionType:  values.collectionType,
        date:            dateStr,
        time:            values.time,
        address:         values.address || '',
        requirements:    values.requirements || '',
        emergencyContact:values.emergencyContact || '',
      });

      setConfirmation({
        orderId:        order.id,
        patientName:    values.name,
        testName:       values.product || values.testType || 'Diagnostic Test',
        date:           format(values.date, 'dd MMM yyyy'),
        time:           formatTime(values.time),
        collectionType: values.collectionType,
        phone:          values.phone,
      });

      form.reset();
      setSelectedTest(null);
    } catch (err) {
      console.error('Booking error:', err);
      toast.error('Booking failed', { description: 'Please try again or call us at +91 9911-380288.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {confirmation && (
        <BookingConfirmationModal
          details={confirmation}
          onClose={() => setConfirmation(null)}
        />
      )}

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
              Book Your Test
            </h1>
            <p className="text-gray-600 mb-4">
              Sachdeva Diagnostics — Select your test and fill in your details below.
            </p>
            <div className="inline-flex flex-col sm:flex-row gap-3 bg-blue-50 border border-blue-200 rounded-xl px-6 py-3 text-sm text-[#194b8c]">
              <span>Home collection: ₹100 + distance charges</span>
              <span className="hidden sm:block text-blue-300">|</span>
              <span>Slots: 9:30 AM – 3:00 PM & 6:00 PM – 7:00 PM</span>
            </div>
            {testParam && (
              <div className="mt-3 inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Selected Test: <span className="font-semibold">{testParam}</span>
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-xl p-6 md:p-8 shadow-md border border-blue-100">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">

                {/* ── Patient Information ── */}
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

                {/* ── Collection Type ── */}
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
                                <div className="text-xs text-gray-500">All tests available · ₹100 booking fee (adjusted later)</div>
                              </div>
                            </label>
                          </div>
                          <div className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${field.value === 'home' ? 'border-[#194b8c] bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                            <RadioGroupItem value="home" id="home" />
                            <label htmlFor="home" className="flex items-center cursor-pointer flex-1">
                              <Home className="h-5 w-5 text-[#194b8c] mr-3 flex-shrink-0" />
                              <div>
                                <div className="font-semibold text-gray-900">Home Collection</div>
                                <div className="text-xs text-gray-500">Blood/lab tests only · ₹100 + distance charges</div>
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
                      Home collection is available only for blood/lab tests. Our phlebotomist will call to confirm distance charges before visiting.
                    </div>
                  )}

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

                {/* ── Test Selection ── */}
                <div className="bg-white rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#194b8c] mb-4">
                    Select Test
                    {watchCollectionType === 'home' && (
                      <span className="ml-2 text-xs font-normal text-amber-600">(Home-eligible only)</span>
                    )}
                  </h3>

                  {/* Step 1: Category */}
                  <FormField control={form.control} name="testType" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">
                        Step 1 — Choose Category
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={`${TRIGGER_STYLES} bg-white text-black`}>
                            <SelectValue placeholder={wpCategories.length === 0 ? 'Loading categories…' : 'Select a test category'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-64 overflow-y-auto bg-white border border-gray-300 shadow-lg">
                          {availableCategories.map(cat => (
                            <SelectItem key={cat.id} value={cat.slug}>
                              {cat.name}
                              {cat.count ? <span className="text-gray-400 ml-1">({cat.count})</span> : null}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Step 2: Test list (only if no URL testParam) */}
                  {watchTestType && !testParam && (
                    <div className="mt-5">
                      <p className="text-sm font-medium text-gray-700 mb-3">
                        Step 2 — Choose a Test
                        {selectedTest && (
                          <span className="ml-2 text-green-600 font-semibold">
                            ✓ {selectedTest.name}
                          </span>
                        )}
                      </p>

                      {loadingTests ? (
                        <div className="space-y-2">
                          {Array(4).fill(null).map((_, i) => (
                            <Skeleton key={i} className="h-14 w-full rounded-lg" />
                          ))}
                        </div>
                      ) : categoryTests.length === 0 ? (
                        <p className="text-sm text-gray-500 py-4 text-center">No tests found in this category.</p>
                      ) : (
                        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                          {categoryTests.map(test => {
                            const isSelected = selectedTest?.id === test.id;
                            return (
                              <button
                                key={test.id}
                                type="button"
                                onClick={() => handleSelectTest(test)}
                                className={cn(
                                  'w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 text-left transition-all',
                                  isSelected
                                    ? 'border-[#194b8c] bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-slate-50'
                                )}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={cn(
                                    'w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors',
                                    isSelected ? 'border-[#194b8c] bg-[#194b8c]' : 'border-gray-300'
                                  )} />
                                  <span className={cn(
                                    'text-sm font-medium truncate',
                                    isSelected ? 'text-[#194b8c]' : 'text-gray-800'
                                  )}>
                                    {test.name}
                                    {test.featured && (
                                      <Badge className="ml-2 bg-amber-100 text-amber-700 text-[10px] border-0">Featured</Badge>
                                    )}
                                  </span>
                                </div>
                                <span className={cn(
                                  'text-sm font-bold flex-shrink-0 ml-3',
                                  isSelected ? 'text-[#194b8c]' : 'text-gray-600'
                                )}>
                                  {formatPrice(test.price)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* URL pre-filled test */}
                  {testParam && (
                    <div className="mt-4 flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-green-700 font-medium">Test Selected</p>
                        <p className="text-sm font-bold text-green-800">{testParam}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Schedule ── */}
                <div className="bg-white rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#194b8c] mb-1">Schedule Appointment</h3>
                  <p className="text-xs text-gray-500 mb-1">Mon–Sat: 9:30 AM – 3:00 PM · Eves (Mon/Tue/Wed/Fri): 6:00–7:00 PM · Sun: 11:00 AM–12:00 PM</p>
                  <p className="text-xs text-[#194b8c] font-medium mb-4">Appointment preferred · Max 2 bookings per slot</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

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
                              const full  = isSlotFull(t);
                              const count = slotCounts[t] ?? 0;
                              return (
                                <SelectItem
                                  key={t} value={t} disabled={full}
                                  className={cn('flex items-center justify-between', full ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')}
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

                {/* ── Additional Info ── */}
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

                {/* ── Price Summary ── */}
                <div className="bg-gradient-to-r from-[#194b8c] to-blue-600 text-white rounded-xl p-5">
                  <h3 className="font-semibold mb-3">Booking Summary</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold">
                        {watchCollectionType === 'home' ? 'Home Collection' : 'Center Visit'}
                      </div>
                      {selectedTest && (
                        <div className="text-sm opacity-90 mt-0.5 font-medium">{selectedTest.name}</div>
                      )}
                      {testParam && (
                        <div className="text-sm opacity-90 mt-0.5 font-medium">{testParam}</div>
                      )}
                      {watchCollectionType === 'home' ? (
                        <div className="text-xs opacity-75 mt-1">₹100 booking fee + distance charges (confirmed by phlebotomist)</div>
                      ) : (
                        <div className="text-xs opacity-75 mt-1">Booking fee only (adjusted later) — test charges payable at center</div>
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

                {/* ── Submit ── */}
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
