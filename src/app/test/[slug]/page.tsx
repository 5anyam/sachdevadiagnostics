'use client';

/* 
  TestDetailPage.jsx - HOD.care style with darker text
  ----------------------------------------------------
  ✅  Medical test detail page matching HOD.care design
  ✅  Dynamic data fetching from WordPress
  ✅  All text made darker and more readable
*/

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';
import {
  CalendarIcon,
  TestTube,
  MapPin,
  Clock,
  Phone,
  Home,
  Building,
  Shield,
  Award,
  Info,
  CheckCircle,
  Users,
  Timer,
  FileText,
  Download,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

// UI Components
import { Button } from '../../../../components/ui/button';
import { Calendar } from '../../../../components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Input } from '../../../../components/ui/input';
import { toast } from '../../../../components/ui/use-toast';
import { Badge } from '../../../../components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../../../../components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';

import DOMPurify from 'dompurify';

import { createOrder } from '../../../../services/createorder';
import {
  getProductBySlug,
  getRelatedProducts,
} from '../../../../services/wordpress';

// -----------------------------------------------------------------------------
// 🔧  Utilities
// -----------------------------------------------------------------------------

const formatTimeLabel = (hour) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:00 ${period}`;
};

// Medical time slots (7 AM to 8 PM)
const MEDICAL_HOURS = Array.from({ length: 14 }, (_, i) => 7 + i);

// -----------------------------------------------------------------------------
// 🧩  MAIN COMPONENT
// -----------------------------------------------------------------------------
export default function TestDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  // ----------------------  DATA  ---------------------- //
  const [test, setTest] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [error, setError] = useState(null);

  // ----------------------  FORM  ---------------------- //
  const [form, setForm] = useState({
    selectedImage: '',
    date: null,
    time: '',
    patientName: '',
    phoneNumber: '',
    age: '',
    gender: '',
    collectionType: 'center', // 'center' or 'home'
    address: '',
  });

  const isFormValid = useMemo(
    () => form.date && form.time && form.patientName && form.phoneNumber && form.age && form.gender && (form.collectionType === 'center' || form.address),
    [form],
  );

  // Price calculation
  const getTestPrice = useMemo(() => {
    const basePrice = test?.price ? Number(test.price) : 300;
    const homeCollectionFee = 200;
    const minHomeCollection = 500;
    
    if (form.collectionType === 'home') {
      return Math.max(basePrice + homeCollectionFee, minHomeCollection);
    }
    return basePrice;
  }, [test?.price, form.collectionType]);

  // Parse test data from WordPress custom fields
  const testData = useMemo(() => {
    if (!test) return {};
    
    // Extract custom fields/meta data
    const meta = test.meta_data || [];
    const getMetaValue = (key) => {
      const metaItem = meta.find(item => item.key === key);
      return metaItem ? metaItem.value : '';
    };

    return {
      alsoKnownAs: getMetaValue('also_known_as') || '',
      preparationInstructions: getMetaValue('preparation_instructions') || '',
      fastingRequired: getMetaValue('fasting_required') || '',
      reportTat: getMetaValue('report_tat') || 'Same Day',
      testType: getMetaValue('test_type') || 'Diagnostic Test',
      includedTests: getMetaValue('included_tests') ? JSON.parse(getMetaValue('included_tests')) : [],
      sampleType: getMetaValue('sample_type') || 'Blood',
      testComponents: getMetaValue('test_components') ? JSON.parse(getMetaValue('test_components')) : [],
      normalRange: getMetaValue('normal_range') || '',
      clinicalSignificance: getMetaValue('clinical_significance') || '',
    };
  }, [test]);

  // ----------------------  EFFECTS  ---------------------- //
  // 1️⃣  Fetch test
  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        setLoading(true);
        const testData = await getProductBySlug(slug);
        if (!testData) throw new Error('Test not found');
        setTest(testData);
        setForm((f) => ({
          ...f,
          selectedImage: testData.images?.[0]?.src || '/test-placeholder.jpg',
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  // 2️⃣  Fetch related tests
  useEffect(() => {
    if (!test?.categories?.length) return;

    (async () => {
      try {
        setRelatedLoading(true);
        const categoryId = test.categories[0].id;
        const data = await getRelatedProducts(categoryId, test.id);
        setRelated(data || []);
      } catch (err) {
        console.error('[Related tests]', err);
      } finally {
        setRelatedLoading(false);
      }
    })();
  }, [test]);

  // ----------------------  HANDLERS  ---------------------- //
  const handleField = (field) => (e) => {
    const value = e?.target?.value ?? e;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookNow = async () => {
    if (!isFormValid || !test) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const testSku = `TEST_${Date.now()}`;
    const orderData = {
      billing: {
        first_name: form.patientName.split(' ')[0] || 'Patient',
        last_name: form.patientName.split(' ').slice(1).join(' ') || 'Name',
        email: 'info@sachdevadiagnostics.com',
        phone: form.phoneNumber,
        address_1: form.collectionType === 'home' ? form.address : 'Sachdeva Diagnostics Center',
      },
      shipping: { 
        first_name: form.patientName.split(' ')[0] || 'Patient',
        last_name: form.patientName.split(' ').slice(1).join(' ') || 'Name',
        address_1: form.collectionType === 'home' ? form.address : 'Sachdeva Diagnostics Center',
      },
      line_items: [
        {
          sku: testSku,
          name: test.name,
          quantity: 1,
          price: getTestPrice.toString(),
          subtotal: getTestPrice.toString(),
          total: getTestPrice.toString(),
        },
      ],
      currency: 'INR',
      meta_data: [
        { key: 'appointment_date', value: format(form.date, 'yyyy-MM-dd') },
        { key: 'appointment_time', value: form.time },
        { key: 'patient_name', value: form.patientName },
        { key: 'patient_age', value: form.age },
        { key: 'patient_gender', value: form.gender },
        { key: 'phone_number', value: form.phoneNumber },
        { key: 'collection_type', value: form.collectionType },
        { key: 'collection_address', value: form.address || 'Center Visit' },
        { key: 'booking_type', value: 'test_booking' },
        { key: 'test_sku', value: testSku },
        { key: 'test_price', value: getTestPrice.toString() },
        { key: 'test_slug', value: slug },
      ],
      status: 'pending',
      payment_method: 'test_booking',
      payment_method_title: 'Test Booking Request',
      set_paid: false,
      shipping_total: form.collectionType === 'home' ? '200.00' : '0.00',
      fee_lines: form.collectionType === 'home' ? [{
        name: 'Home Collection Fee',
        amount: '200.00',
        total: '200.00',
      }] : [],
    };

    try {
      const order = await createOrder(orderData);
      toast({
        title: "Test Booked Successfully!",
        description: `Your test has been booked! Order ID: ${order.id}`,
      });

      router.push(
        `/booking?test=${encodeURIComponent(test.name)}&date=${format(
          form.date,
          'yyyy-MM-dd',
        )}&time=${form.time}&patient=${encodeURIComponent(form.patientName)}&phone=${
          form.phoneNumber
        }&order_id=${order.id}&collection=${form.collectionType}`
      );
    } catch (err) {
      console.error('[createOrder]', err);
      toast({
        title: "Error",
        description: "Failed to book test",
        variant: "destructive",
      });
    }
  };

  // ---------------------------------------------------------------------------
  // 🖼  UI STATES
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Test Not Found</h2>
          <p className="text-gray-800 font-medium mb-6">{error}</p>
          <Button onClick={() => router.push('/tests')} className="bg-[#194b8c] hover:bg-blue-700">
            Browse All Tests
          </Button>
        </div>
      </div>
    );
  }

  if (!test) return null;

  // ---------------------------------------------------------------------------
  // 🎨  PAGE CONTENT - HOD.care Style with Darker Text
  // ---------------------------------------------------------------------------
  return (
    <>
      <Head>
        <title>{`${test.name} in Delhi | Cost ₹${getTestPrice} Onwards | Sachdeva Diagnostics`}</title>
        <meta
          name="description"
          content={
            test.short_description?.replace(/<[^>]*>/g, '') || `Book ${test.name} at Sachdeva Diagnostics. Trusted diagnostic services for 30+ years.`
          }
        />
        <meta name="keywords" content={`${test.name}, diagnostic test, pathology, Delhi, Sachdeva Diagnostics`} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#194b8c] to-blue-600 text-white py-4">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm font-medium">
              Experience Home Collections in as early as 45 minutes* when you book with us online. *Subject to slot availability
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ------------------------------------------------------------------ */}
            {/* 🅰  MAIN CONTENT - Left Side (2/3 width)                          */}
            {/* ------------------------------------------------------------------ */}
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <div className="text-sm text-gray-800 font-medium mb-4">
                <span>Home</span> / <span>Tests</span> / 
                {test.categories?.length > 0 && (
                  <> <span>{test.categories[0].name}</span> / </>
                )}
                <span className="text-[#194b8c] font-bold">{test.name}</span>
              </div>

              {/* Test Title */}
              <h1 className="text-3xl font-bold text-black mb-4">
                {test.name}
              </h1>

              {/* Also Known As */}
              {testData.alsoKnownAs && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-black mb-2">Also Known As:</h3>
                  <p className="text-gray-800 font-medium">{testData.alsoKnownAs}</p>
                </div>
              )}

              {/* Test Information Tabs */}
              <Tabs defaultValue="overview" className="mb-8">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-[#194b8c] data-[state=active]:text-white font-semibold text-black">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="preparation" className="data-[state=active]:bg-[#194b8c] data-[state=active]:text-white font-semibold text-black">
                    Preparation
                  </TabsTrigger>
                  <TabsTrigger value="included" className="data-[state=active]:bg-[#194b8c] data-[state=active]:text-white font-semibold text-black">
                    Included Tests
                  </TabsTrigger>
                  <TabsTrigger value="reports" className="data-[state=active]:bg-[#194b8c] data-[state=active]:text-white font-semibold text-black">
                    Reports
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-black">
                        <Info className="w-5 h-5 text-[#194b8c]" />
                        Test Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Short Description */}
                      {test.short_description && (
                        <div className="mb-6">
                          <div
                            className="prose prose-gray max-w-none [&_p]:text-gray-800 [&_p]:font-medium [&_li]:text-gray-800 [&_li]:font-medium [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black [&_h4]:text-black [&_h5]:text-black [&_h6]:text-black [&_strong]:text-black [&_b]:text-black"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(test.short_description),
                            }}
                          />
                        </div>
                      )}

                      {/* Long Description */}
                      {test.description && (
                        <div className="mb-6">
                          <h4 className="text-lg font-bold mb-3 text-black">Detailed Information</h4>
                          <div
                            className="prose prose-gray max-w-none [&_p]:text-gray-800 [&_p]:font-medium [&_li]:text-gray-800 [&_li]:font-medium [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black [&_h4]:text-black [&_h5]:text-black [&_h6]:text-black [&_strong]:text-black [&_b]:text-black"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(test.description),
                            }}
                          />
                        </div>
                      )}

                      {/* Clinical Significance */}
                      {testData.clinicalSignificance && (
                        <div className="mb-6">
                          <h4 className="text-lg font-bold mb-3 text-black">Clinical Significance</h4>
                          <p className="text-gray-800 font-medium">{testData.clinicalSignificance}</p>
                        </div>
                      )}

                      {/* Test Specifications */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold mb-2 text-black">Test Type</h4>
                          <p className="text-gray-800 font-medium">{testData.testType}</p>
                        </div>
                        <div>
                          <h4 className="font-bold mb-2 text-black">Sample Type</h4>
                          <p className="text-gray-800 font-medium">{testData.sampleType}</p>
                        </div>
                        <div>
                          <h4 className="font-bold mb-2 text-black">Report TAT</h4>
                          <p className="text-gray-800 font-medium">{testData.reportTat}</p>
                        </div>
                        {testData.normalRange && (
                          <div>
                            <h4 className="font-bold mb-2 text-black">Normal Range</h4>
                            <p className="text-gray-800 font-medium">{testData.normalRange}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preparation" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-black">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                        Test Preparation Instructions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {testData.preparationInstructions ? (
                        <div className="space-y-4">
                          <div
                            className="prose prose-gray max-w-none [&_p]:text-gray-800 [&_p]:font-medium [&_li]:text-gray-800 [&_li]:font-medium [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black [&_h4]:text-black [&_h5]:text-black [&_h6]:text-black [&_strong]:text-black [&_b]:text-black"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(testData.preparationInstructions),
                            }}
                          />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-blue-50 border-l-4 border-[#194b8c] p-4">
                            <h4 className="font-bold text-[#194b8c] mb-2">General Instructions:</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-800 font-medium">
                              <li>No special preparation required for most tests</li>
                              <li>Fasting may be required for certain tests</li>
                              <li>Inform about medications you are taking</li>
                              <li>Carry previous reports if available</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {testData.fastingRequired && (
                        <div className="mt-4 bg-orange-50 border-l-4 border-orange-500 p-4">
                          <h4 className="font-bold text-orange-700 mb-2">Fasting Required:</h4>
                          <p className="text-orange-800 font-medium">{testData.fastingRequired}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="included" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-black">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Included Tests & Components
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {testData.includedTests?.length > 0 ? (
                        <div className="space-y-4">
                          <h4 className="font-bold text-black">This package includes:</h4>
                          <div className="grid gap-2">
                            {testData.includedTests.map((includedTest, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-gray-800 font-medium">{includedTest}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-800 font-medium">Individual test - No sub-components</p>
                        </div>
                      )}

                      {testData.testComponents?.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-bold mb-3 text-black">Test Components:</h4>
                          <div className="grid gap-2">
                            {testData.testComponents.map((component, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                                <TestTube className="w-4 h-4 text-[#194b8c]" />
                                <span className="text-gray-800 font-medium">{component}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reports" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-black">
                        <FileText className="w-5 h-5 text-[#194b8c]" />
                        Report Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Timer className="w-5 h-5 text-[#194b8c]" />
                              <h4 className="font-bold text-black">Report TAT</h4>
                            </div>
                            <p className="text-2xl font-bold text-[#194b8c]">{testData.reportTat}</p>
                            <p className="text-sm text-gray-800 font-medium">*Available online and via email</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Download className="w-5 h-5 text-green-600" />
                              <h4 className="font-bold text-black">Digital Reports</h4>
                            </div>
                            <p className="text-sm text-gray-800 font-medium">Download reports anytime from our portal</p>
                            <Button className="mt-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold">
                              Access Portal
                            </Button>
                          </div>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-[#194b8c] p-4">
                          <h4 className="font-bold text-[#194b8c] mb-2">Report Features:</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-800 font-medium">
                            <li>NABL accredited lab reports</li>
                            <li>Digital signature and verification</li>
                            <li>Reference ranges included</li>
                            <li>Doctor consultation available</li>
                            <li>Secure online access</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Categories and Tags */}
              <div className="mb-8">
                {test.categories?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2 text-black">Categories:</h3>
                    <div className="flex flex-wrap gap-2">
                      {test.categories.map((category) => (
                        <Badge key={category.id} className="bg-[#194b8c] text-white font-semibold">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {test.tags?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-black">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {test.tags.map((tag) => (
                        <Badge key={tag.id} variant="outline" className="border-gray-400 text-gray-800 font-medium">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ------------------------------------------------------------------ */}
            {/* 🅱  BOOKING SIDEBAR - Right Side (1/3 width)                      */}
            {/* ------------------------------------------------------------------ */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Price Card */}
                <Card className="mb-6 border-2 border-[#194b8c] shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-[#194b8c] to-blue-600 text-white rounded-t-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">₹{getTestPrice.toLocaleString('en-IN')}</p>
                        <p className="text-sm opacity-90 font-medium">
                          {form.collectionType === 'home' ? 'Home Collection' : 'Center Visit'}
                        </p>
                      </div>
                      <div className="text-right">
                        <Award className="w-8 h-8 mb-1" />
                        <p className="text-xs font-medium">NABL Certified</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Key Features */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-800 font-medium">Report TAT: {testData.reportTat}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-800 font-medium">{testData.testType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-800 font-medium">{testData.includedTests?.length || 1} Test{testData.includedTests?.length > 1 ? 's' : ''} Included</span>
                      </div>
                    </div>

                    {/* Booking Form */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-black flex items-center gap-2">
                        <TestTube className="w-5 h-5 text-[#194b8c]" /> Book Your Test
                      </h3>

                      {/* Patient Name */}
                      <Input
                        placeholder="Patient Name"
                        value={form.patientName}
                        onChange={handleField('patientName')}
                        required
                        className="border-gray-300 focus:border-[#194b8c] text-black font-medium placeholder:text-gray-600"
                      />

                      {/* Age and Gender */}
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Age"
                          value={form.age}
                          onChange={handleField('age')}
                          type="number"
                          required
                          className="border-gray-300 focus:border-[#194b8c] text-black font-medium placeholder:text-gray-600"
                        />
                        <Select onValueChange={handleField('gender')} value={form.gender}>
                          <SelectTrigger className="border-gray-300 focus:border-[#194b8c] bg-white text-black font-medium">
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-300 shadow-lg">
                            <SelectItem value="male" className="text-black hover:bg-gray-100 font-medium">Male</SelectItem>
                            <SelectItem value="female" className="text-black hover:bg-gray-100 font-medium">Female</SelectItem>
                            <SelectItem value="other" className="text-black hover:bg-gray-100 font-medium">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Phone */}
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-[#194b8c]" />
                        <Input
                          placeholder="Phone Number"
                          value={form.phoneNumber}
                          onChange={handleField('phoneNumber')}
                          type="tel"
                          required
                          className="pl-10 border-gray-300 focus:border-[#194b8c] text-black font-medium placeholder:text-gray-600"
                        />
                      </div>

                      {/* Collection Type */}
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-black">Collection Type</label>
                        <RadioGroup
                          value={form.collectionType}
                          onValueChange={handleField('collectionType')}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-3 border-2 border-gray-200 rounded-lg hover:border-[#194b8c] transition-colors">
                            <RadioGroupItem value="center" id="center-sidebar" />
                            <label htmlFor="center-sidebar" className="flex items-center cursor-pointer flex-1">
                              <Building className="h-4 w-4 text-[#194b8c] mr-2" />
                              <div className="text-sm">
                                <div className="font-bold text-black">Visit Center</div>
                                <div className="text-gray-700 font-medium">₹{Number(test?.price || 300).toLocaleString('en-IN')}</div>
                              </div>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border-2 border-gray-200 rounded-lg hover:border-[#194b8c] transition-colors">
                            <RadioGroupItem value="home" id="home-sidebar" />
                            <label htmlFor="home-sidebar" className="flex items-center cursor-pointer flex-1">
                              <Home className="h-4 w-4 text-[#194b8c] mr-2" />
                              <div className="text-sm">
                                <div className="font-bold text-black">Home Collection</div>
                                <div className="text-gray-700 font-medium">₹{Math.max((Number(test?.price || 300) + 200), 500).toLocaleString('en-IN')}</div>
                              </div>
                            </label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Address (if home collection) */}
                      {form.collectionType === 'home' && (
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#194b8c]" />
                          <Input
                            placeholder="Complete Address"
                            value={form.address}
                            onChange={handleField('address')}
                            required
                            className="pl-10 border-gray-300 focus:border-[#194b8c] text-black font-medium placeholder:text-gray-600"
                          />
                        </div>
                      )}

                      {/* Date */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start border-gray-300 hover:border-[#194b8c] bg-white text-black font-medium"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-[#194b8c]" />
                            {form.date ? format(form.date, 'PPP') : 'Select appointment date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white border border-gray-300 shadow-lg">
                          <Calendar
                            mode="single"
                            selected={form.date}
                            onSelect={handleField('date')}
                            disabled={(d) => d < new Date()}
                            initialFocus
                            className="bg-white"
                          />
                        </PopoverContent>
                      </Popover>

                      {/* Time */}
                      <Select onValueChange={handleField('time')} value={form.time}>
                        <SelectTrigger className="border-gray-300 focus:border-[#194b8c] bg-white text-black font-medium">
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-[#194b8c]" />
                            <SelectValue placeholder="Select preferred time" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-300 shadow-lg">
                          {MEDICAL_HOURS.map((hour) => (
                            <SelectItem key={hour} value={`${hour}:00`} className="text-black hover:bg-gray-100 font-medium">
                              {formatTimeLabel(hour)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Book Button */}
                      <Button
                        onClick={handleBookNow}
                        disabled={!isFormValid}
                        className="w-full bg-gradient-to-r from-[#194b8c] to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-bold py-3 transform hover:scale-105 transition-all duration-200 disabled:hover:scale-100 disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <TestTube className="w-4 h-4" /> 
                            Book Test - ₹{getTestPrice.toLocaleString('en-IN')}
                          </div>
                        )}
                      </Button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <Shield className="w-6 h-6 text-green-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-800 font-medium">NABL Accredited</p>
                      </div>
                      <div className="text-center">
                        <Users className="w-6 h-6 text-[#194b8c] mx-auto mb-1" />
                        <p className="text-xs text-gray-800 font-medium">30+ Years Trust</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Contact */}
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-3 text-black">Need Help?</h3>
                    <div className="space-y-2">
                      <a href="tel:+919990048085" className="flex items-center gap-2 text-[#194b8c] hover:underline">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm font-medium">+91 99900 48085</span>
                      </a>
                      <div className="flex items-center gap-2 text-gray-800">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Mon-Sat: 7 AM - 9 PM</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 🅲  RELATED TESTS                                                  */}
          {/* ------------------------------------------------------------------ */}
          {!relatedLoading && related.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6 text-black">Related Tests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.slice(0, 4).map((rt) => (
                  <Card key={rt.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => router.push(`/test/${rt.slug}`)}>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-sm mb-2 line-clamp-2 text-black">{rt.name}</h3>
                      <p className="text-[#194b8c] font-bold mb-2">
                        ₹{Number(rt.price).toLocaleString('en-IN')}
                      </p>
                      <Button
                        size="sm"
                        className="w-full bg-[#194b8c] hover:bg-blue-700 text-white font-semibold"
                      >
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Global styles for dropdown visibility and text darkness */}
      <style jsx global>{`
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
          font-weight: 500 !important;
        }
        
        [data-radix-select-item]:hover,
        [data-radix-select-item][data-highlighted] {
          background-color: #f3f4f6 !important;
          color: #194b8c !important;
        }
        
        [data-radix-popover-content] {
          background-color: white !important;
          color: black !important;
          border: 1px solid #d1d5db !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
          z-index: 50 !important;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Force darker text for all content */
        .prose p, .prose li, .prose div {
          color: #374151 !important;
          font-weight: 500 !important;
        }
        
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: #000000 !important;
          font-weight: 700 !important;
        }
        
        .prose strong, .prose b {
          color: #000000 !important;
          font-weight: 700 !important;
        }
      `}</style>
    </>
  );
}
