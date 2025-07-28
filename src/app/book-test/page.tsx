'use client';

/* --------------------------------------------------
   Test Booking form – Sachdeva Diagnostics
---------------------------------------------------*/
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '../../../components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { toast } from '../../../components/ui/sonner';
import { cn } from '../../../lib/utils';
import { createOrder } from '../../../services/createorder';

/* --------------------------------------------------
   Constants & Helpers
---------------------------------------------------*/
const CONTROL_BASE =
  'w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 ' +
  'px-4 py-2 leading-tight transition focus:outline-none focus:ring-2 focus:ring-blue-500';

const INPUT_STYLES = CONTROL_BASE;
const TRIGGER_STYLES = `${CONTROL_BASE} flex justify-between items-center`;

const TIMES = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
] as const;

type TimeValue = typeof TIMES[number];

/* --------------------------------------------------
   Zod schema for test booking
---------------------------------------------------*/
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  whatsapp: z.string().min(10, 'WhatsApp number must be at least 10 digits.'),
  age: z.string().min(1, 'Please enter age.'),
  gender: z.string({ required_error: 'Please select gender.' }),
  testType: z.string({ required_error: 'Please select a test type.' }),
  product: z.string().optional(),
  collectionType: z.enum(['home', 'center'], { required_error: 'Please select collection type.' }),
  date: z.date({ required_error: 'Please select a date.' }),
  time: z.enum(TIMES, { required_error: 'Please select a time.' }),
  address: z.string().optional(),
  requirements: z.string().optional(),
  emergencyContact: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

/* --------------------------------------------------
   Order Data Types (same as before)
---------------------------------------------------*/
interface OrderResponse {
  id: number;
  status: string;
  [key: string]: unknown;
}

interface MetaData {
  key: string;
  value: string;
}

interface LineItem {
  product_id?: number;
  variation_id?: number;
  sku?: string;
  name: string;
  quantity: number;
  price: string;
  subtotal: string;
  total: string;
  tax_class?: string;
  meta_data?: MetaData[];
}

interface BillingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

interface FeeLine {
  id?: number;
  name: string;
  tax_class?: string;
  tax_status?: string;
  amount: string;
  total: string;
  meta_data?: MetaData[];
}

interface CouponLine {
  id?: number;
  code: string;
  discount: string;
  discount_tax?: string;
  meta_data?: MetaData[];
}

interface RefundLine {
  id?: number;
  reason?: string;
  amount: string;
  refunded_by?: number;
  date_created?: string;
  meta_data?: MetaData[];
}

interface OrderData {
  billing: BillingAddress;
  shipping: ShippingAddress;
  line_items: LineItem[];
  meta_data: MetaData[];
  currency: string;
  status: string;
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  customer_note?: string;
  shipping_total?: string;
  shipping_tax?: string;
  fee_lines?: FeeLine[];
  coupon_lines?: CouponLine[];
  refunds?: RefundLine[];
}

/* --------------------------------------------------
   Hook to get search params safely
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
   Test Booking Form Component
---------------------------------------------------*/
function TestBookingFormContent() {
  const router = useRouter();
  const searchParams = useSearchParamsSafe();

  /* ----------------------------------------------
     URL params ➜ form defaults
  ------------------------------------------------*/
  const testParam = searchParams?.get('test') ?? '';
  const dateParam = searchParams?.get('date');
  const timeParam = searchParams?.get('time') ?? '';

  const initialDate = useMemo(() => {
    if (!dateParam) return undefined;
    const d = new Date(dateParam);
    return isNaN(d.getTime()) ? undefined : d;
  }, [dateParam]);

  const isValidTime = (time: string): time is TimeValue => {
    return TIMES.includes(time as TimeValue);
  };

  /* ----------------------------------------------
     React‑Hook‑Form setup
  ------------------------------------------------*/
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      whatsapp: '',
      age: '',
      gender: '',
      testType: '',
      product: testParam,
      collectionType: 'center',
      date: initialDate,
      time: isValidTime(timeParam) ? timeParam : undefined,
      address: '',
      requirements: '',
      emergencyContact: '',
    },
    mode: 'onBlur',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const watchCollectionType = form.watch('collectionType');

  /* ----------------------------------------------
     Sync date/time from URL when component mounts
  ------------------------------------------------*/
  useEffect(() => {
    if (initialDate) {
      form.setValue('date', initialDate);
    }
    if (timeParam && isValidTime(timeParam)) {
      form.setValue('time', timeParam);
    }
  }, [initialDate, timeParam, form]);

  /* ----------------------------------------------
     Calculate pricing based on collection type
  ------------------------------------------------*/
  const getServicePrice = (collectionType: string) => {
    const basePrice = 300; // Base test price
    const homeCollectionFee = 200; // Home collection fee
    const minHomeCollection = 500; // Minimum for home collection
    
    if (collectionType === 'home') {
      return Math.max(basePrice + homeCollectionFee, minHomeCollection);
    }
    return basePrice;
  };

  /* ----------------------------------------------
     Submit handler
  ------------------------------------------------*/
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const [firstName, ...rest] = values.name.trim().split(' ');
      const lastName = rest.join(' ') || 'N/A';
      const testSku = `TEST_${Date.now()}`;
      const servicePrice = getServicePrice(values.collectionType);

      const orderData: OrderData = {
        billing: {
          first_name: firstName,
          last_name: lastName,
          email: values.email,
          phone: values.phone,
          address_1: values.address || 'Sachdeva Diagnostics Center',
          city: 'Delhi',
          state: 'Delhi',
          postcode: '110001',
          country: 'IN',
        },
        shipping: {
          first_name: firstName,
          last_name: lastName,
          address_1: values.address || 'Sachdeva Diagnostics Center',
          city: 'Delhi',
          state: 'Delhi',
          postcode: '110001',
          country: 'IN',
        },
        line_items: [
          {
            sku: testSku,
            name: values.product || values.testType || 'Diagnostic Test Booking',
            quantity: 1,
            price: servicePrice.toString(),
            subtotal: servicePrice.toString(),
            total: servicePrice.toString(),
            tax_class: '',
            meta_data: [
              { key: 'service_type', value: 'diagnostic_test' },
              { key: 'booking_id', value: testSku },
              { key: 'collection_type', value: values.collectionType },
            ],
          },
        ],
        meta_data: [
          { key: 'test_type', value: values.testType },
          { key: 'patient_age', value: values.age },
          { key: 'patient_gender', value: values.gender },
          { key: 'collection_type', value: values.collectionType },
          { key: 'appointment_date', value: format(values.date, 'yyyy-MM-dd') },
          { key: 'appointment_time', value: values.time },
          { key: 'collection_address', value: values.address || 'Center Visit' },
          { key: 'whatsapp_number', value: values.whatsapp },
          { key: 'emergency_contact', value: values.emergencyContact || '' },
          { key: 'special_requirements', value: values.requirements || '' },
          { key: 'booking_type', value: 'diagnostic_test' },
          { key: 'submitted_at', value: new Date().toISOString() },
          { key: 'test_sku', value: testSku },
          { key: 'patient_name', value: values.name },
          { key: 'patient_email', value: values.email },
          { key: 'patient_phone', value: values.phone },
          { key: 'service_price', value: servicePrice.toString() },
        ],
        currency: 'INR',
        status: 'pending',
        payment_method: 'test_booking',
        payment_method_title: 'Test Booking Request',
        set_paid: false,
        customer_note: values.requirements || '',
        shipping_total: values.collectionType === 'home' ? '200.00' : '0.00',
        shipping_tax: '0.00',
        fee_lines: values.collectionType === 'home' ? [{
          name: 'Home Collection Fee',
          amount: '200.00',
          total: '200.00',
          meta_data: [
            { key: 'fee_type', value: 'home_collection' }
          ]
        }] : [],
        coupon_lines: [],
        refunds: [],
      };

      const order: OrderResponse = await createOrder(orderData);

      toast.success('Test booking submitted successfully!', {
        description: `Your test booking has been confirmed with order ID: ${order.id}. ${
          values.collectionType === 'home' 
            ? 'Our phlebotomist will visit your location at the scheduled time.' 
            : 'Please visit our center at the scheduled time.'
        }`,
      });

      form.reset();
      setTimeout(() => router.push('/'), 3000);
    } catch (error) {
      console.error('Test booking error:', error);
      toast.error('Failed to submit test booking', {
        description: 'There was an error submitting your booking. Please try again or contact us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Global styles for dropdown visibility */}
      <style jsx global>{`
        /* Select dropdown styling - Force black text and white background */
        [data-radix-select-content] {
          background-color: white !important;
          color: black !important;
          border: 1px solid #d1d5db !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
          z-index: 50 !important;
        }
        
        [data-radix-select-item] {
          color: black !important;
          background-color: white !important;
          padding: 8px 12px !important;
          cursor: pointer !important;
          font-size: 14px !important;
          font-weight: 400 !important;
        }
        
        [data-radix-select-item]:hover,
        [data-radix-select-item][data-highlighted] {
          background-color: #f3f4f6 !important;
          color: #194b8c !important;
        }
        
        [data-radix-select-item][data-state="checked"] {
          background-color: #e0f2fe !important;
          color: #194b8c !important;
          font-weight: 500 !important;
        }
        
        /* Popover content styling */
        [data-radix-popover-content] {
          background-color: white !important;
          color: black !important;
          border: 1px solid #d1d5db !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
          z-index: 50 !important;
        }
        
        /* Calendar styling */
        .rdp {
          background-color: white !important;
          color: black !important;
        }
        
        .rdp-button {
          color: black !important;
        }
        
        .rdp-button:hover {
          background-color: #f3f4f6 !important;
          color: #194b8c !important;
        }
        
        /* General dropdown/submenu styling */
        .dropdown-menu,
        .submenu,
        .select-content {
          background-color: white !important;
          color: black !important;
          border: 1px solid #d1d5db !important;
          border-radius: 8px !important;
        }
        
        .dropdown-item,
        .submenu-item,
        .select-item {
          color: black !important;
          background-color: white !important;
          padding: 8px 12px !important;
        }
        
        .dropdown-item:hover,
        .submenu-item:hover,
        .select-item:hover {
          background-color: #f3f4f6 !important;
          color: #194b8c !important;
        }
      `}</style>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Heading block */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#194b8c]">
              Book Your Diagnostic Test
            </h1>
            <p className="text-gray-600">
              Schedule your test with Sachdeva Diagnostics - trusted healthcare for 30+ years
            </p>
            <div className="mt-4 p-4 bg-blue-100 rounded-lg inline-block shadow-sm">
              <p className="text-[#194b8c] text-lg font-semibold">
                Center Visit: ₹300 | Home Collection: ₹500 (minimum)
              </p>
              <p className="text-sm text-[#194b8c]/80">
                Home collection includes ₹200 service fee
              </p>
            </div>
            {testParam && (
              <div className="mt-4 p-2 bg-green-100 rounded-md inline-block">
                <p className="text-[#194b8c]">
                  Selected Test: <span className="font-medium">{testParam}</span>
                </p>
              </div>
            )}
          </div>

          {/* Form card */}
          <div className="bg-blue-50 rounded-xl p-8 shadow-md hover:shadow-lg transition border border-blue-100">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                autoComplete="off"
              >
                {/* Patient Information Section */}
                <div className="bg-white rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-[#194b8c] mb-4">Patient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800 font-medium">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              className={INPUT_STYLES}
                              placeholder="Enter patient's full name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Age */}
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800 font-medium">
                            Age
                          </FormLabel>
                          <FormControl>
                            <Input
                              className={INPUT_STYLES}
                              placeholder="Enter age"
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Gender */}
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800 font-medium">
                            Gender
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className={`${TRIGGER_STYLES} bg-white text-black`}>
                                <SelectValue placeholder="Select gender" className="text-black" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border border-gray-300 shadow-lg">
                              <SelectItem value="male" className="text-black hover:bg-gray-100 cursor-pointer">Male</SelectItem>
                              <SelectItem value="female" className="text-black hover:bg-gray-100 cursor-pointer">Female</SelectItem>
                              <SelectItem value="other" className="text-black hover:bg-gray-100 cursor-pointer">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800 font-medium">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              className={INPUT_STYLES}
                              placeholder="Enter email address"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800 font-medium">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              className={INPUT_STYLES}
                              placeholder="Enter phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* WhatsApp */}
                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800 font-medium">
                            WhatsApp Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              className={INPUT_STYLES}
                              placeholder="Enter WhatsApp number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Test Information Section */}
                <div className="bg-white rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-[#194b8c] mb-4">Test Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Test Type */}
                    <FormField
                      control={form.control}
                      name="testType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800 font-medium">
                            Test Category
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className={`${TRIGGER_STYLES} bg-white text-black`}>
                                <SelectValue placeholder="Select test category" className="text-black" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-60 overflow-y-auto bg-white border border-gray-300 shadow-lg">
                              <SelectItem value="blood-test" className="text-black hover:bg-gray-100 cursor-pointer">Blood Test</SelectItem>
                              <SelectItem value="urine-test" className="text-black hover:bg-gray-100 cursor-pointer">Urine Analysis</SelectItem>
                              <SelectItem value="health-checkup" className="text-black hover:bg-gray-100 cursor-pointer">Health Checkup Package</SelectItem>
                              <SelectItem value="cardiac-profile" className="text-black hover:bg-gray-100 cursor-pointer">Cardiac Profile</SelectItem>
                              <SelectItem value="diabetes-panel" className="text-black hover:bg-gray-100 cursor-pointer">Diabetes Panel</SelectItem>
                              <SelectItem value="thyroid-test" className="text-black hover:bg-gray-100 cursor-pointer">Thyroid Function Test</SelectItem>
                              <SelectItem value="liver-function" className="text-black hover:bg-gray-100 cursor-pointer">Liver Function Test</SelectItem>
                              <SelectItem value="kidney-function" className="text-black hover:bg-gray-100 cursor-pointer">Kidney Function Test</SelectItem>
                              <SelectItem value="cancer-screening" className="text-black hover:bg-gray-100 cursor-pointer">Cancer Screening</SelectItem>
                              <SelectItem value="hormone-test" className="text-black hover:bg-gray-100 cursor-pointer">Hormone Tests</SelectItem>
                              <SelectItem value="infection-screening" className="text-black hover:bg-gray-100 cursor-pointer">Infection Screening</SelectItem>
                              <SelectItem value="other" className="text-black hover:bg-gray-100 cursor-pointer">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Product (if from URL) */}
                    {testParam && (
                      <FormField
                        control={form.control}
                        name="product"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-800 font-medium">
                              Selected Test
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="bg-gray-100 text-gray-800"
                                readOnly
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>

                {/* Collection Type Section */}
                <div className="bg-white rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-[#194b8c] mb-4">Collection Preference</h3>
                  
                  <FormField
                    control={form.control}
                    name="collectionType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <div className="flex items-center space-x-2 p-4 border-2 border-gray-200 rounded-lg hover:border-[#194b8c] transition-colors">
                              <RadioGroupItem value="center" id="center" />
                              <label htmlFor="center" className="flex items-center cursor-pointer flex-1">
                                <Building className="h-5 w-5 text-[#194b8c] mr-3" />
                                <div>
                                  <div className="font-medium text-gray-900">Visit Center</div>
                                  <div className="text-sm text-gray-500">₹300 - Visit our diagnostic center</div>
                                </div>
                              </label>
                            </div>
                            <div className="flex items-center space-x-2 p-4 border-2 border-gray-200 rounded-lg hover:border-[#194b8c] transition-colors">
                              <RadioGroupItem value="home" id="home" />
                              <label htmlFor="home" className="flex items-center cursor-pointer flex-1">
                                <Home className="h-5 w-5 text-[#194b8c] mr-3" />
                                <div>
                                  <div className="font-medium text-gray-900">Home Collection</div>
                                  <div className="text-sm text-gray-500">₹500 minimum (includes ₹200 collection fee)</div>
                                </div>
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address field (only show if home collection is selected) */}
                  {watchCollectionType === 'home' && (
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel className="text-gray-800 font-medium">
                            Home Address <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className={`min-h-20 ${INPUT_STYLES}`}
                              placeholder="Enter complete address for sample collection"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Please provide complete address including landmarks for easy location
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Schedule Section */}
                <div className="bg-white rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-[#194b8c] mb-4">Schedule Appointment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date */}
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-gray-800 font-medium">
                            Appointment Date
                          </FormLabel>
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
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white border border-gray-300 shadow-lg" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className="p-3 pointer-events-auto bg-white"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Time */}
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800 font-medium">
                            Appointment Time
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className={`${TRIGGER_STYLES} bg-white text-black`}>
                                <SelectValue placeholder="Select a time" className="text-black" />
                                <Clock className="h-4 w-4 opacity-50" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-60 overflow-y-auto bg-white border border-gray-300 shadow-lg">
                              {TIMES.map((t) => (
                                <SelectItem key={t} value={t} className="text-black hover:bg-gray-100 cursor-pointer">
                                  {`${parseInt(t, 10) % 12 || 12}:00 ${parseInt(t, 10) >= 12 ? 'PM' : 'AM'}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-white rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-[#194b8c] mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Emergency Contact */}
                    <FormField
                      control={form.control}
                      name="emergencyContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-800 font-medium">
                            Emergency Contact (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              className={INPUT_STYLES}
                              placeholder="Emergency contact number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Special Requirements */}
                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel className="text-gray-800 font-medium">
                          Special Requirements / Medical History
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className={`min-h-32 ${INPUT_STYLES}`}
                            placeholder="Please mention any medical conditions, medications, or special requirements"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include any relevant medical history, current medications, or fasting requirements
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Price Summary */}
                <div className="bg-gradient-to-r from-[#194b8c] to-blue-600 text-white rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-2">Price Summary</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">
                      {watchCollectionType === 'home' ? 'Home Collection Service' : 'Center Visit'}
                    </span>
                    <span className="text-2xl font-bold">
                      ₹{getServicePrice(watchCollectionType)}
                    </span>
                  </div>
                  {watchCollectionType === 'home' && (
                    <p className="text-sm mt-2 opacity-90">
                      Includes ₹200 home collection fee. Minimum booking amount: ₹500
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#194b8c] hover:bg-blue-700 text-white py-4 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Booking...' : `Book Test - ₹${getServicePrice(watchCollectionType)}`}
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
   Loading component
---------------------------------------------------*/
function TestBookingPageLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="h-8 bg-gray-200 rounded-md w-96 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-md w-64 mx-auto animate-pulse"></div>
        </div>
        <div className="bg-blue-50 rounded-xl p-8 shadow-md">
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   Dynamic import with no SSR
---------------------------------------------------*/
const DynamicTestBookingForm = dynamic(() => Promise.resolve(TestBookingFormContent), {
  ssr: false,
  loading: () => <TestBookingPageLoading />,
});

/* --------------------------------------------------
   Main component
---------------------------------------------------*/
export default function TestBookingPage() {
  return (
    <div className="min-h-screen bg-blue-50">
      <DynamicTestBookingForm />
    </div>
  );
}
