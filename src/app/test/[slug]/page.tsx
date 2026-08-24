'use client';

/*
  app/test/[slug]/page.tsx
  ------------------------------------------------------------------
  Test detail page — Sachdeva Diagnostics
  ✅ Fully typed — no `any` anywhere
  ✅ App Router safe (no next/head)
  ✅ Sample Type / Included Tests / Home Collection = blood & lab tests only
  ✅ Imaging tests (Ultrasound, X-Ray, ECG, Doppler, Dexa...) = center visit only
*/

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import DOMPurify from 'dompurify';

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

// Services
import { createOrder } from '../../../../services/createorder';
import { getProductBySlug, getRelatedProducts } from '../../../../services/wordpress';
import { submitToGoogleSheet } from '../../../../services/googlesheet';
import BookingConfirmationModal, {
  BookingConfirmationDetails,
} from '../../../../components/BookingConfirmationModal';

// -----------------------------------------------------------------------------
// 📐  Types
// -----------------------------------------------------------------------------

interface WooMeta {
  id?: number;
  key: string;
  value: unknown;
}

interface WooTerm {
  id: number;
  name: string;
  slug: string;
}

interface WooImage {
  id?: number;
  src: string;
  alt?: string;
}

interface WooProduct {
  id: number;
  name: string;
  slug: string;
  price?: string | number;
  regular_price?: string | number;
  short_description?: string;
  description?: string;
  images?: WooImage[];
  categories?: WooTerm[];
  tags?: WooTerm[];
  meta_data?: WooMeta[];
}

type CollectionType = 'center' | 'home';

interface BookingForm {
  date: Date | null;
  time: string;
  patientName: string;
  phoneNumber: string;
  age: string;
  gender: string;
  collectionType: CollectionType;
  address: string;
}

interface ParsedTestMeta {
  alsoKnownAs: string;
  preparationInstructions: string;
  fastingRequired: string;
  reportTat: string;
  testType: string;
  includedTests: string[];
  sampleType: string;
  testComponents: string[];
  normalRange: string;
  clinicalSignificance: string;
  isLabTest: string;
}

// -----------------------------------------------------------------------------
// 🔧  Constants
// -----------------------------------------------------------------------------

const HOME_COLLECTION_FEE = 200;
const MIN_HOME_COLLECTION = 500;
const DEFAULT_PRICE = 300;

const MEDICAL_HOURS: string[] = [
  '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
  '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
  '18:00', '18:30',
];

// Imaging / procedure categories — koi sample nahi liya jaata
const IMAGING_KEYWORDS: string[] = [
  'ultrasound', 'doppler', 'x-ray', 'xray', 'opg', 'echo', 'ecg', 'ekg',
  'fibroscan', 'dexa', 'densitometry', 'mri', 'ct-scan', 'ct scan',
  'radiology', 'sonography', 'tiffa', 'nt-scan', 'msk', 'mammography',
  'imaging', 'scan',
];

// Lab / pathology categories — sample + home collection inhi par
const LAB_KEYWORDS: string[] = [
  'blood', 'pathology', 'lab', 'lifecell', 'haematology', 'hematology',
  'biochemistry', 'serology', 'hormone', 'urine', 'immunology',
  'profile', 'package', 'culture', 'microbiology', 'vitamin',
  'health-checkup', 'health checkup', 'diabetes', 'thyroid-profile',
];

const SAMPLE_KEYWORDS: string[] = [
  'blood', 'serum', 'plasma', 'urine', 'stool', 'swab', 'saliva',
];

const EMPTY_META: ParsedTestMeta = {
  alsoKnownAs: '',
  preparationInstructions: '',
  fastingRequired: '',
  reportTat: 'Same Day',
  testType: 'Diagnostic Test',
  includedTests: [],
  sampleType: '',
  testComponents: [],
  normalRange: '',
  clinicalSignificance: '',
  isLabTest: '',
};

const PROSE_CLASS =
  'prose prose-gray max-w-none [&_p]:text-gray-800 [&_p]:font-medium [&_li]:text-gray-800 [&_li]:font-medium [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black [&_h4]:text-black [&_h5]:text-black [&_h6]:text-black [&_strong]:text-black [&_b]:text-black';

const TAB_TRIGGER_CLASS =
  'data-[state=active]:bg-[#194b8c] data-[state=active]:text-white font-semibold text-black';

const INPUT_CLASS =
  'border-gray-300 focus:border-[#194b8c] text-black font-medium placeholder:text-gray-600';

// -----------------------------------------------------------------------------
// 🔧  Helpers
// -----------------------------------------------------------------------------

const formatTimeLabel = (slot: string): string => {
  const [hStr, mStr] = slot.split(':');
  const h = parseInt(hStr, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${mStr} ${period}`;
};

const stripHtml = (html?: string): string => (html || '').replace(/<[^>]*>/g, '').trim();

// DOMPurify sirf browser me chalta hai
const sanitize = (html?: string): string => {
  if (!html) return '';
  if (typeof window === 'undefined') return '';
  return DOMPurify.sanitize(html);
};

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Something went wrong';
};

const parseMeta = (product: WooProduct | null): ParsedTestMeta => {
  if (!product) return EMPTY_META;

  const meta: WooMeta[] = Array.isArray(product.meta_data) ? product.meta_data : [];

  const getMetaValue = (key: string): string => {
    const item = meta.find((m) => m?.key === key);
    if (!item || item.value === null || item.value === undefined) return '';
    return String(item.value);
  };

  // JSON.parse crash-proof + comma-separated fallback
  const safeParse = (raw: string): string[] => {
    if (!raw) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map((v) => String(v));
      return [];
    } catch {
      return raw.includes(',')
        ? raw.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
    }
  };

  return {
    alsoKnownAs: getMetaValue('also_known_as'),
    preparationInstructions: getMetaValue('preparation_instructions'),
    fastingRequired: getMetaValue('fasting_required'),
    reportTat: getMetaValue('report_tat') || 'Same Day',
    testType: getMetaValue('test_type') || 'Diagnostic Test',
    includedTests: safeParse(getMetaValue('included_tests')),
    // ⚠️ 'Blood' default hata diya — warna har imaging test bhi blood dikhta tha
    sampleType: getMetaValue('sample_type'),
    testComponents: safeParse(getMetaValue('test_components')),
    normalRange: getMetaValue('normal_range'),
    clinicalSignificance: getMetaValue('clinical_significance'),
    isLabTest: getMetaValue('is_lab_test'),
  };
};

// -----------------------------------------------------------------------------
// 🧩  MAIN COMPONENT
// -----------------------------------------------------------------------------
export default function TestDetailPage() {
  const params = useParams();
  const router = useRouter();

  const rawSlug = params?.slug;
  const slug: string = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug ?? '';

  // ----------------------  STATE  ---------------------- //
  const [test, setTest] = useState<WooProduct | null>(null);
  const [related, setRelated] = useState<WooProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [relatedLoading, setRelatedLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmationDetails | null>(null);

  const [form, setForm] = useState<BookingForm>({
    date: null,
    time: '',
    patientName: '',
    phoneNumber: '',
    age: '',
    gender: '',
    collectionType: 'center',
    address: '',
  });

  const updateForm = <K extends keyof BookingForm>(key: K, value: BookingForm[K]): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ----------------------  DERIVED  ---------------------- //

  const testData: ParsedTestMeta = useMemo(() => parseMeta(test), [test]);

  // 🩸 Blood / lab sample wala test hai ya imaging
  const isBloodTest: boolean = useMemo(() => {
    if (!test) return false;

    // 1️⃣ WordPress explicit flag (sabse reliable)
    const flag = testData.isLabTest.toLowerCase().trim();
    if (flag === 'yes' || flag === 'true' || flag === '1') return true;
    if (flag === 'no' || flag === 'false' || flag === '0') return false;

    // 2️⃣ Category name + slug se
    const cats: string = (test.categories ?? [])
      .map((c) => `${c.name ?? ''} ${c.slug ?? ''}`.toLowerCase())
      .join(' ');

    if (IMAGING_KEYWORDS.some((k) => cats.includes(k))) return false;
    if (LAB_KEYWORDS.some((k) => cats.includes(k))) return true;

    // 3️⃣ sample_type meta fallback
    const sample = testData.sampleType.toLowerCase();
    return SAMPLE_KEYWORDS.some((k) => sample.includes(k));
  }, [test, testData.isLabTest, testData.sampleType]);

  const isHomeCollection: boolean = isBloodTest && form.collectionType === 'home';

  const basePrice: number = useMemo(() => {
    const raw = Number(test?.price);
    return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_PRICE;
  }, [test?.price]);

  const homePrice: number = useMemo(
    () => Math.max(basePrice + HOME_COLLECTION_FEE, MIN_HOME_COLLECTION),
    [basePrice],
  );

  const testPrice: number = isHomeCollection ? homePrice : basePrice;

  const isFormValid: boolean = useMemo(
    () =>
      Boolean(
        form.date &&
          form.time &&
          form.patientName.trim() &&
          form.phoneNumber.trim() &&
          form.age &&
          form.gender &&
          (!isHomeCollection || form.address.trim()),
      ),
    [form, isHomeCollection],
  );

  const hasCategories: boolean = (test?.categories?.length ?? 0) > 0;
  const hasTags: boolean = (test?.tags?.length ?? 0) > 0;

  // ----------------------  EFFECTS  ---------------------- //

  // 1️⃣ Fetch test
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const load = async (): Promise<void> => {
      try {
        setLoading(true);
        const data = (await getProductBySlug(slug)) as WooProduct | null;
        if (cancelled) return;
        if (!data) throw new Error('Test not found');
        setTest(data);
      } catch (err: unknown) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // 2️⃣ Fetch related tests
  useEffect(() => {
    const categoryId = test?.categories?.[0]?.id;
    if (!test || categoryId === undefined) return;

    let cancelled = false;

    const load = async (): Promise<void> => {
      try {
        setRelatedLoading(true);
        const data = (await getRelatedProducts(categoryId, test.id)) as WooProduct[] | null;
        if (!cancelled) setRelated(data ?? []);
      } catch (err: unknown) {
        console.error('[Related tests]', getErrorMessage(err));
      } finally {
        if (!cancelled) setRelatedLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [test]);

  // 3️⃣ Non-lab test → hamesha center visit
  useEffect(() => {
    if (isBloodTest) return;
    setForm((prev) =>
      prev.collectionType === 'center' && !prev.address
        ? prev
        : { ...prev, collectionType: 'center', address: '' },
    );
  }, [isBloodTest]);

  // 4️⃣ Page title & meta (app router me next/head allowed nahi hai)
  useEffect(() => {
    if (!test) return;

    document.title = `${test.name} in Delhi | Cost ₹${testPrice} Onwards | Sachdeva Diagnostics`;

    const description =
      stripHtml(test.short_description) ||
      `Book ${test.name} at Sachdeva Diagnostics. Trusted diagnostic services for 30+ years.`;

    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.appendChild(tag);
    }
    tag.content = description;
  }, [test, testPrice]);

  // ----------------------  BOOKING  ---------------------- //

  const handleBookNow = async (): Promise<void> => {
    if (!isFormValid || !test || !form.date) {
      toast({
        title: 'Missing details',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    const nameParts = form.patientName.trim().split(' ');
    const firstName = nameParts[0] || 'Patient';
    const lastName = nameParts.slice(1).join(' ') || 'Name';
    const addressLine = isHomeCollection ? form.address : 'Sachdeva Diagnostics Center';
    const testSku = `TEST_${Date.now()}`;
    const appointmentDate = format(form.date, 'yyyy-MM-dd');

    const orderData = {
      billing: {
        first_name: firstName,
        last_name: lastName,
        email: 'info@sachdevadiagnostics.com',
        phone: form.phoneNumber,
        address_1: addressLine,
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
        address_1: addressLine,
      },
      line_items: [
        {
          sku: testSku,
          name: test.name,
          quantity: 1,
          price: String(testPrice),
          subtotal: String(testPrice),
          total: String(testPrice),
        },
      ],
      currency: 'INR',
      meta_data: [
        { key: 'appointment_date', value: appointmentDate },
        { key: 'appointment_time', value: form.time },
        { key: 'patient_name', value: form.patientName },
        { key: 'patient_age', value: form.age },
        { key: 'patient_gender', value: form.gender },
        { key: 'phone_number', value: form.phoneNumber },
        { key: 'collection_type', value: isHomeCollection ? 'home' : 'center' },
        { key: 'collection_address', value: isHomeCollection ? form.address : 'Center Visit' },
        { key: 'booking_type', value: isBloodTest ? 'lab_test_booking' : 'imaging_booking' },
        { key: 'test_sku', value: testSku },
        { key: 'test_price', value: String(testPrice) },
        { key: 'test_slug', value: slug },
      ],
      status: 'pending',
      payment_method: 'test_booking',
      payment_method_title: 'Test Booking Request',
      set_paid: false,
      shipping_total: isHomeCollection ? '200.00' : '0.00',
      fee_lines: isHomeCollection
        ? [{ name: 'Home Collection Fee', amount: '200.00', total: '200.00' }]
        : [],
    };

    try {
      const order = (await createOrder(orderData)) as { id: number };

      // Google Sheet fail ho to booking fail nahi honi chahiye
      try {
        await submitToGoogleSheet({
          timestamp: new Date().toISOString(),
          source: 'test-detail-page',
          name: form.patientName,
          age: form.age,
          gender: form.gender,
          phone: form.phoneNumber,
          whatsapp: '',
          email: '',
          testCategory: test.categories?.[0]?.name ?? '',
          testName: test.name,
          collectionType: isHomeCollection ? 'home' : 'center',
          date: appointmentDate,
          time: form.time,
          address: isHomeCollection ? form.address : '',
          requirements: '',
          emergencyContact: '',
          homeCollectionCharge: isHomeCollection ? '₹100 + distance charges' : '',
        });
      } catch (sheetErr: unknown) {
        console.error('[Google Sheet]', getErrorMessage(sheetErr));
      }

      setConfirmation({
        orderId: order.id,
        patientName: form.patientName,
        testName: test.name,
        date: format(form.date, 'dd MMM yyyy'),
        time: form.time,
        collectionType: isHomeCollection ? 'home' : 'center',
        phone: form.phoneNumber,
      });
    } catch (err: unknown) {
      console.error('[createOrder]', getErrorMessage(err));
      toast({
        title: 'Booking failed',
        description: 'Could not book the test. Please try again or call us.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 🖼  LOADING / ERROR
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-64 bg-gray-200 rounded-lg" />
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 rounded w-4/6" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Test Not Found</h2>
          <p className="text-gray-800 font-medium mb-6">
            {error ?? 'This test is no longer available.'}
          </p>
          <Button onClick={() => router.push('/tests')} className="bg-[#194b8c] hover:bg-blue-700">
            Browse All Tests
          </Button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 🎨  PAGE
  // ---------------------------------------------------------------------------
  return (
    <>
      {confirmation && (
        <BookingConfirmationModal
          details={confirmation}
          onClose={() => setConfirmation(null)}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        {/* ── TOP BANNER ── */}
        <div className="bg-gradient-to-r from-[#194b8c] to-blue-600 text-white py-4">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm font-medium">
              {isBloodTest
                ? 'Experience Home Collections in as early as 45 minutes* when you book with us online. *Subject to slot availability'
                : 'Book your appointment online and skip the queue. Reports available the same day.* *Subject to slot availability'}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ============================================================ */}
            {/* 🅰  MAIN CONTENT                                             */}
            {/* ============================================================ */}
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <div className="text-sm text-gray-800 font-medium mb-4">
                <span>Home</span> / <span>Tests</span> /{' '}
                {hasCategories && (
                  <>
                    <span>{test.categories?.[0]?.name}</span> /{' '}
                  </>
                )}
                <span className="text-[#194b8c] font-bold">{test.name}</span>
              </div>

              <h1 className="text-3xl font-bold text-black mb-4">{test.name}</h1>

              {testData.alsoKnownAs && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-black mb-2">Also Known As:</h3>
                  <p className="text-gray-800 font-medium">{testData.alsoKnownAs}</p>
                </div>
              )}

              {/* ── TABS ── */}
              <Tabs defaultValue="overview" className="mb-8">
                <TabsList
                  className={`grid w-full ${isBloodTest ? 'grid-cols-4' : 'grid-cols-3'} bg-gray-100`}
                >
                  <TabsTrigger value="overview" className={TAB_TRIGGER_CLASS}>
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="preparation" className={TAB_TRIGGER_CLASS}>
                    Preparation
                  </TabsTrigger>
                  {isBloodTest && (
                    <TabsTrigger value="included" className={TAB_TRIGGER_CLASS}>
                      Included Tests
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="reports" className={TAB_TRIGGER_CLASS}>
                    Reports
                  </TabsTrigger>
                </TabsList>

                {/* ── OVERVIEW ── */}
                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-black">
                        <Info className="w-5 h-5 text-[#194b8c]" />
                        Test Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {test.short_description && (
                        <div
                          className={`mb-6 ${PROSE_CLASS}`}
                          dangerouslySetInnerHTML={{ __html: sanitize(test.short_description) }}
                        />
                      )}

                      {test.description && (
                        <div className="mb-6">
                          <h4 className="text-lg font-bold mb-3 text-black">Detailed Information</h4>
                          <div
                            className={PROSE_CLASS}
                            dangerouslySetInnerHTML={{ __html: sanitize(test.description) }}
                          />
                        </div>
                      )}

                      {testData.clinicalSignificance && (
                        <div className="mb-6">
                          <h4 className="text-lg font-bold mb-3 text-black">
                            Clinical Significance
                          </h4>
                          <p className="text-gray-800 font-medium">
                            {testData.clinicalSignificance}
                          </p>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold mb-2 text-black">Test Type</h4>
                          <p className="text-gray-800 font-medium">{testData.testType}</p>
                        </div>

                        {/* Sample Type sirf blood/lab tests par */}
                        {isBloodTest ? (
                          <div>
                            <h4 className="font-bold mb-2 text-black">Sample Type</h4>
                            <p className="text-gray-800 font-medium">
                              {testData.sampleType || 'Blood'}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-bold mb-2 text-black">Procedure Type</h4>
                            <p className="text-gray-800 font-medium">
                              In-clinic scan — no sample required
                            </p>
                          </div>
                        )}

                        <div>
                          <h4 className="font-bold mb-2 text-black">Report TAT</h4>
                          <p className="text-gray-800 font-medium">{testData.reportTat}</p>
                        </div>

                        {isBloodTest && testData.normalRange && (
                          <div>
                            <h4 className="font-bold mb-2 text-black">Normal Range</h4>
                            <p className="text-gray-800 font-medium">{testData.normalRange}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ── PREPARATION ── */}
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
                        <div
                          className={PROSE_CLASS}
                          dangerouslySetInnerHTML={{
                            __html: sanitize(testData.preparationInstructions),
                          }}
                        />
                      ) : (
                        <div className="bg-blue-50 border-l-4 border-[#194b8c] p-4">
                          <h4 className="font-bold text-[#194b8c] mb-2">General Instructions:</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-800 font-medium">
                            {isBloodTest ? (
                              <>
                                <li>No special preparation required for most tests</li>
                                <li>Fasting may be required for certain tests</li>
                                <li>Inform us about any medications you are taking</li>
                                <li>Carry previous reports if available</li>
                              </>
                            ) : (
                              <>
                                <li>Appointment preferred — arrive 10 minutes early</li>
                                <li>Wear loose, comfortable clothing</li>
                                <li>Carry your prescription and previous reports</li>
                                <li>Follow any instructions given at the time of booking</li>
                              </>
                            )}
                          </ul>
                        </div>
                      )}

                      {isBloodTest && testData.fastingRequired && (
                        <div className="mt-4 bg-orange-50 border-l-4 border-orange-500 p-4">
                          <h4 className="font-bold text-orange-700 mb-2">Fasting Required:</h4>
                          <p className="text-orange-800 font-medium">{testData.fastingRequired}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ── INCLUDED TESTS (lab only) ── */}
                {isBloodTest && (
                  <TabsContent value="included" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-black">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Included Tests &amp; Components
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {testData.includedTests.length > 0 ? (
                          <div className="space-y-4">
                            <h4 className="font-bold text-black">This package includes:</h4>
                            <div className="grid gap-2">
                              {testData.includedTests.map((item: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 p-2 bg-green-50 rounded"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  <span className="text-gray-800 font-medium">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-800 font-medium">
                              Individual test — no sub-components
                            </p>
                          </div>
                        )}

                        {testData.testComponents.length > 0 && (
                          <div className="mt-6">
                            <h4 className="font-bold mb-3 text-black">Test Components:</h4>
                            <div className="grid gap-2">
                              {testData.testComponents.map((component: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 p-2 bg-blue-50 rounded"
                                >
                                  <TestTube className="w-4 h-4 text-[#194b8c] flex-shrink-0" />
                                  <span className="text-gray-800 font-medium">{component}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                {/* ── REPORTS ── */}
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
                            <p className="text-2xl font-bold text-[#194b8c]">
                              {testData.reportTat}
                            </p>
                            <p className="text-sm text-gray-800 font-medium">
                              *Available online and via email
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Download className="w-5 h-5 text-green-600" />
                              <h4 className="font-bold text-black">Digital Reports</h4>
                            </div>
                            <p className="text-sm text-gray-800 font-medium">
                              Download reports anytime from our portal
                            </p>
                            <Button className="mt-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold">
                              Access Portal
                            </Button>
                          </div>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-[#194b8c] p-4">
                          <h4 className="font-bold text-[#194b8c] mb-2">Report Features:</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-800 font-medium">
                            {isBloodTest ? (
                              <>
                                <li>NABL accredited lab reports</li>
                                <li>Reference ranges included</li>
                              </>
                            ) : (
                              <>
                                <li>Reported by experienced radiologists</li>
                                <li>Images shared along with the report</li>
                              </>
                            )}
                            <li>Digital signature and verification</li>
                            <li>Doctor consultation available</li>
                            <li>Secure online access</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* ── CATEGORIES & TAGS ── */}
              <div className="mb-8">
                {hasCategories && (
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2 text-black">Categories:</h3>
                    <div className="flex flex-wrap gap-2">
                      {test.categories?.map((category: WooTerm) => (
                        <Badge key={category.id} className="bg-[#194b8c] text-white font-semibold">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {hasTags && (
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-black">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {test.tags?.map((tag: WooTerm) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="border-gray-400 text-gray-800 font-medium"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ============================================================ */}
            {/* 🅱  BOOKING SIDEBAR                                          */}
            {/* ============================================================ */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="mb-6 border-2 border-[#194b8c] shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-[#194b8c] to-blue-600 text-white rounded-t-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">₹{testPrice.toLocaleString('en-IN')}</p>
                        <p className="text-sm opacity-90 font-medium">
                          {isHomeCollection ? 'Home Collection' : 'Center Visit'}
                        </p>
                      </div>
                      <div className="text-right">
                        <Award className="w-8 h-8 mb-1" />
                        <p className="text-xs font-medium">NABL Certified</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* Key features */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-800 font-medium">
                          Report TAT: {testData.reportTat}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-800 font-medium">{testData.testType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-800 font-medium">
                          {isBloodTest
                            ? `${testData.includedTests.length || 1} Test${
                                testData.includedTests.length > 1 ? 's' : ''
                              } Included`
                            : 'Performed at our centre by expert radiologists'}
                        </span>
                      </div>
                    </div>

                    {/* Booking form */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-black flex items-center gap-2">
                        <TestTube className="w-5 h-5 text-[#194b8c]" /> Book Your Test
                      </h3>

                      <Input
                        placeholder="Patient Name"
                        value={form.patientName}
                        onChange={(e) => updateForm('patientName', e.target.value)}
                        className={INPUT_CLASS}
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Age"
                          type="number"
                          value={form.age}
                          onChange={(e) => updateForm('age', e.target.value)}
                          className={INPUT_CLASS}
                        />
                        <Select
                          value={form.gender}
                          onValueChange={(value: string) => updateForm('gender', value)}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-[#194b8c] bg-white text-black font-medium">
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-300 shadow-lg">
                            <SelectItem value="male" className="text-black font-medium">
                              Male
                            </SelectItem>
                            <SelectItem value="female" className="text-black font-medium">
                              Female
                            </SelectItem>
                            <SelectItem value="other" className="text-black font-medium">
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-[#194b8c]" />
                        <Input
                          placeholder="Phone Number"
                          type="tel"
                          value={form.phoneNumber}
                          onChange={(e) => updateForm('phoneNumber', e.target.value)}
                          className={`pl-10 ${INPUT_CLASS}`}
                        />
                      </div>

                      {/* ── COLLECTION TYPE: lab tests par choice, imaging par center only ── */}
                      {isBloodTest ? (
                        <div className="space-y-3">
                          <label className="text-sm font-bold text-black">Collection Type</label>
                          <RadioGroup
                            value={form.collectionType}
                            onValueChange={(value: string) =>
                              updateForm('collectionType', value === 'home' ? 'home' : 'center')
                            }
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2 p-3 border-2 border-gray-200 rounded-lg hover:border-[#194b8c] transition-colors">
                              <RadioGroupItem value="center" id="collection-center" />
                              <label
                                htmlFor="collection-center"
                                className="flex items-center cursor-pointer flex-1"
                              >
                                <Building className="h-4 w-4 text-[#194b8c] mr-2" />
                                <div className="text-sm">
                                  <div className="font-bold text-black">Visit Center</div>
                                  <div className="text-gray-700 font-medium">
                                    ₹{basePrice.toLocaleString('en-IN')}
                                  </div>
                                </div>
                              </label>
                            </div>

                            <div className="flex items-center space-x-2 p-3 border-2 border-gray-200 rounded-lg hover:border-[#194b8c] transition-colors">
                              <RadioGroupItem value="home" id="collection-home" />
                              <label
                                htmlFor="collection-home"
                                className="flex items-center cursor-pointer flex-1"
                              >
                                <Home className="h-4 w-4 text-[#194b8c] mr-2" />
                                <div className="text-sm">
                                  <div className="font-bold text-black">Home Collection</div>
                                  <div className="text-gray-700 font-medium">
                                    ₹{homePrice.toLocaleString('en-IN')}
                                  </div>
                                </div>
                              </label>
                            </div>
                          </RadioGroup>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                          <Building className="h-4 w-4 text-[#194b8c] mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <div className="font-bold text-black">Center Visit Only</div>
                            <div className="text-gray-700 font-medium text-xs">
                              This test is performed at our centre. Home collection is not available.
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Address — sirf home collection par */}
                      {isHomeCollection && (
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#194b8c]" />
                          <Input
                            placeholder="Complete Address"
                            value={form.address}
                            onChange={(e) => updateForm('address', e.target.value)}
                            className={`pl-10 ${INPUT_CLASS}`}
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
                            selected={form.date ?? undefined}
                            onSelect={(selected: Date | undefined) =>
                              updateForm('date', selected ?? null)
                            }
                            disabled={(day: Date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return day < today;
                            }}
                            initialFocus
                            className="bg-white"
                          />
                        </PopoverContent>
                      </Popover>

                      {/* Time */}
                      <Select
                        value={form.time}
                        onValueChange={(value: string) => updateForm('time', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-[#194b8c] bg-white text-black font-medium">
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-[#194b8c]" />
                            <SelectValue placeholder="Select preferred time" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-300 shadow-lg">
                          {MEDICAL_HOURS.map((slot: string) => (
                            <SelectItem key={slot} value={slot} className="text-black font-medium">
                              {formatTimeLabel(slot)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Submit */}
                      <Button
                        onClick={() => void handleBookNow()}
                        disabled={!isFormValid || submitting}
                        className="w-full bg-gradient-to-r from-[#194b8c] to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-bold py-3 transition-all duration-200 disabled:opacity-50"
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <TestTube className="w-4 h-4" />
                            Book Test — ₹{testPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </Button>
                    </div>

                    {/* Trust indicators */}
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

                {/* Quick contact */}
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-3 text-black">Need Help?</h3>
                    <div className="space-y-2 mb-4">
                      <a
                        href="tel:+919911380288"
                        className="flex items-center gap-2 text-[#194b8c] hover:underline"
                      >
                        <Phone className="w-4 h-4" />
                        <span className="text-sm font-medium">+91 9911-380288</span>
                      </a>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <p className="text-xs font-bold text-[#194b8c] mb-1.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {isBloodTest ? 'Lab Timings' : 'Ultrasound Timings'}
                      </p>

                      {isBloodTest ? (
                        <div className="text-xs text-gray-700 space-y-0.5">
                          <p>
                            <span className="font-semibold">Mon–Sat:</span> 8:00 AM – 8:00 PM
                          </p>
                          <p>
                            <span className="font-semibold">Sunday:</span> 8:30 AM – 1:00 PM
                          </p>
                          <p className="text-[#194b8c] font-medium pt-0.5">
                            Home collection available
                          </p>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-700 space-y-0.5">
                          <p>
                            <span className="font-semibold">Mon–Sat:</span> 9:30 AM – 3:00 PM
                          </p>
                          <p>
                            <span className="font-semibold">Eves (Mon/Tue/Wed/Fri):</span> 6:00 – 7:00 PM
                          </p>
                          <p>
                            <span className="font-semibold">Sunday:</span> 11:00 AM – 12:00 PM
                          </p>
                          <p className="text-[#194b8c] font-medium pt-0.5">Appointment preferred</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 🅲  RELATED TESTS                                            */}
          {/* ============================================================ */}
          {!relatedLoading && related.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6 text-black">Related Tests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.slice(0, 4).map((item: WooProduct) => (
                  <Card
                    key={item.id}
                    className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => router.push(`/test/${item.slug}`)}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-bold text-sm mb-2 line-clamp-2 text-black">
                        {item.name}
                      </h3>
                      <p className="text-[#194b8c] font-bold mb-2">
                        ₹{Number(item.price ?? 0).toLocaleString('en-IN')}
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

      {/* Global styles */}
      <style jsx global>{`
        [data-radix-select-content] {
          background-color: #ffffff !important;
          color: #000000 !important;
          border: 1px solid #d1d5db !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
          z-index: 50 !important;
        }

        [data-radix-select-item] {
          color: #000000 !important;
          background-color: #ffffff !important;
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
          background-color: #ffffff !important;
          color: #000000 !important;
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

        .prose p,
        .prose li,
        .prose div {
          color: #374151 !important;
          font-weight: 500 !important;
        }

        .prose h1,
        .prose h2,
        .prose h3,
        .prose h4,
        .prose h5,
        .prose h6 {
          color: #000000 !important;
          font-weight: 700 !important;
        }

        .prose strong,
        .prose b {
          color: #000000 !important;
          font-weight: 700 !important;
        }
      `}</style>
    </>
  );
}