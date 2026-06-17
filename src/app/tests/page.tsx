'use client';

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search, X, TestTube, Clock, Shield, Award, Users, Calendar,
  TrendingUp, Zap, Grid3x3, List,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Skeleton } from '../../../components/ui/skeleton';

import { getAllProducts, formatPrice, Product } from '../../../services/wordpress';

const NO_HOME_COLLECTION_SLUGS = [
  '3d-4d-ultrasound',
  'pregnancy-ultrasound',
  'color-doppler-ultrasound',
  'routine-ultrasound',
  'special-ultrasound',
  'x-ray-test',
];

function isNoHomeCollection(test: Product): boolean {
  return test.categories?.some(cat => NO_HOME_COLLECTION_SLUGS.includes(cat.slug)) ?? false;
}

// ── Card — Grid view ──────────────────────────────────────────────────────────

function TestCardGrid({ test }: { test: Product }) {
  const isPopular = test.total_sales && parseInt(test.total_sales) > 50;
  const hasDiscount = test.regular_price && test.regular_price !== test.price;
  const hideHomeCollection = isNoHomeCollection(test);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:-translate-y-0.5">
      <Link href={`/test/${test.slug}`} className="flex-1 flex flex-col p-5">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 font-semibold text-[10px]">
            {test.categories[0]?.name || "Diagnostic"}
          </Badge>
          <Badge className="bg-green-50 text-green-700 border-0 font-bold text-[10px] shadow-none">
            <Award className="h-2.5 w-2.5 mr-0.5" /> NABL
          </Badge>
          {isPopular && (
            <Badge className="bg-orange-50 text-orange-700 border-0 font-bold text-[10px] shadow-none">
              <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> Popular
            </Badge>
          )}
        </div>

        {/* Name */}
        <h3 className="font-bold text-sm sm:text-base text-slate-800 group-hover:text-sky-600 transition-colors mb-2 line-clamp-2 min-h-[2.5rem] leading-snug">
          {test.name}
        </h3>

        {/* Description */}
        <div
          className="text-xs text-slate-500 mb-3 flex-1 leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-0.5 [&_p]:mb-1 [&_strong]:font-semibold [&_br]:block"
          dangerouslySetInnerHTML={{ __html: test.description || test.short_description || "Professional diagnostic test with accurate results." }}
        />

        {/* Report + Trust */}
        <div className="flex gap-3 mb-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <div className="bg-sky-100 p-1 rounded"><Clock className="h-3 w-3 text-sky-600" /></div>
            <span className="font-semibold">Same Day Report</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <div className="bg-green-100 p-1 rounded"><Shield className="h-3 w-3 text-green-600" /></div>
            <span className="font-semibold">Trusted</span>
          </div>
        </div>

        {/* Price */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-end justify-between mb-2">
            <div>
              {hasDiscount && (
                <p className="text-slate-400 text-[10px] line-through">{formatPrice(test.regular_price)}</p>
              )}
              <p className="text-sky-600 font-bold text-lg sm:text-xl">{formatPrice(test.price)}</p>
              {!hideHomeCollection && (
                <p className="text-[10px] text-slate-400">+ Free Home Collection</p>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Booking button */}
      <div className="px-5 pb-5 pt-0">
        <Link href={`/book-test?test=${encodeURIComponent(test.name)}`}>
          <Button className="w-full h-10 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-sm transition-all">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ── Card — List view ──────────────────────────────────────────────────────────

function TestCardList({ test }: { test: Product }) {
  const isPopular = test.total_sales && parseInt(test.total_sales) > 50;
  const hasDiscount = test.regular_price && test.regular_price !== test.price;

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all duration-200 flex items-center gap-0 overflow-hidden">
      {/* Color accent bar */}
      <div className="w-1 self-stretch bg-sky-400 group-hover:bg-sky-500 flex-shrink-0 transition-colors" />

      {/* Main content */}
      <Link href={`/test/${test.slug}`} className="flex-1 flex items-start gap-4 p-4 min-w-0">
        {/* Icon */}
        <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <TestTube className="w-5 h-5 text-sky-600" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 font-semibold text-[10px]">
              {test.categories[0]?.name || "Diagnostic"}
            </Badge>
            {isPopular && (
              <Badge className="bg-orange-50 text-orange-700 border-0 font-bold text-[10px] shadow-none">
                <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> Popular
              </Badge>
            )}
          </div>
          <h3 className="font-bold text-sm text-slate-800 group-hover:text-sky-600 transition-colors leading-snug line-clamp-1">
            {test.name}
          </h3>
          <div
            className="text-xs text-slate-400 mt-0.5 leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:mb-0.5 [&_p]:mb-1 [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: test.description || test.short_description || "Accurate results with same-day reports." }}
          />
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-sky-500" /> Same Day</span>
          </div>
        </div>
      </Link>

      {/* Price + Book */}
      <div className="flex items-center gap-4 px-4 py-4 flex-shrink-0 border-l border-slate-100">
        <div className="text-right hidden sm:block">
          {hasDiscount && <p className="text-slate-400 text-[10px] line-through">{formatPrice(test.regular_price)}</p>}
          <p className="text-sky-600 font-bold text-base">{formatPrice(test.price)}</p>
        </div>
        <Link href={`/book-test?test=${encodeURIComponent(test.name)}`}>
          <Button className="bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs px-4 h-9 whitespace-nowrap">
            <Calendar className="h-3 w-3 mr-1.5" /> Book
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function renderSkeleton(viewMode: 'grid' | 'list') {
  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {Array(8).fill(null).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 flex items-center gap-4 p-4 overflow-hidden">
            <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-9 w-20 rounded-xl flex-shrink-0" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array(12).fill(null).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <div className="flex gap-2"><Skeleton className="h-5 w-20 rounded-full" /><Skeleton className="h-5 w-14 rounded-full" /></div>
          <Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-10 w-full rounded-xl mt-2" />
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function TestsPageContent() {
  const searchParams = useSearchParams();

  const [tests, setTests] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const testsData = await getAllProducts({ per_page: 100, status: 'publish', type: 'simple' });
        setTests(testsData || []);
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  const filteredTests = useMemo(() => {
    let filtered = [...tests];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.short_description?.toLowerCase().includes(q) ||
        t.categories?.some(c => c.name.toLowerCase().includes(q))
      );
    }

    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    return filtered;
  }, [tests, searchQuery]);

  const paginatedTests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filteredTests.slice(start, start + itemsPerPage);
    setTotalPages(Math.ceil(filteredTests.length / itemsPerPage));
    return paginated;
  }, [filteredTests, currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { setSearchQuery(e.target.value); setCurrentPage(1); };
  const handlePageChange = (page: number) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const paginationButtons = useMemo(() => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── HERO ── */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400 text-white py-10 sm:py-14">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4 text-sm font-semibold">
            <Zap className="h-4 w-4 text-yellow-300" />
            Most Trusted Diagnostic Centre in North Delhi
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3">
            Diagnostic Tests & Health Packages
          </h1>
          <p className="text-sky-100 text-sm sm:text-base mb-7">
            NABL certified lab · Same-day reports · 30+ years of excellence
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {[
              { icon: Award, text: "NABL Accredited" },
              { icon: Clock, text: "Same Day Reports" },
              { icon: Shield, text: "100% Accurate" },
              { icon: Users, text: "5 Lakh+ Patients" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl">
                <item.icon className="h-4 w-4 text-sky-200" />
                <span className="font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">

        {/* ── SEARCH ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search by test name, condition, or health concern..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-11 h-12 border-slate-300 focus:border-sky-500 rounded-xl text-sm"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── RESULTS ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {loading ? 'Loading…' : (
                <><span className="text-sky-600">{filteredTests.length}</span> Tests Available</>
              )}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {searchQuery ? `Results for "${searchQuery}"` : 'Showing all diagnostic tests'}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(['grid', 'list'] as const).map((mode) => (
              <Button key={mode} variant={viewMode === mode ? 'default' : 'ghost'} size="sm"
                onClick={() => setViewMode(mode)}
                className={`rounded-md ${viewMode === mode ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500'}`}>
                {mode === 'grid' ? <Grid3x3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </Button>
            ))}
          </div>
        </div>

        {/* Tests */}
        {loading ? renderSkeleton(viewMode) : filteredTests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TestTube className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Tests Found</h3>
            <p className="text-slate-500 text-sm mb-5 max-w-sm mx-auto">
              No tests match your search. Try a different keyword.
            </p>
            <Button onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
              className="bg-sky-500 hover:bg-sky-600 text-white px-7 font-bold rounded-xl">
              <X className="mr-2 h-4 w-4" /> Clear Search
            </Button>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 mb-8"
              : "space-y-3 mb-8"
            }>
              {paginatedTests.map((test) =>
                viewMode === 'grid'
                  ? <TestCardGrid key={test.id} test={test} />
                  : <TestCardList key={test.id} test={test} />
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">
                  Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredTests.length)} of {filteredTests.length}
                </p>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1} className="border-slate-200 font-semibold text-xs h-8">
                    Previous
                  </Button>
                  {paginationButtons.map(page => (
                    <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm"
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[32px] h-8 text-xs font-bold ${currentPage === page ? 'bg-sky-500 hover:bg-sky-600 text-white border-0' : 'border-slate-200 text-slate-600'}`}>
                      {page}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages} className="border-slate-200 font-semibold text-xs h-8">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── BOTTOM CTA ── */}
        <div className="mt-10 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-2xl p-7 sm:p-10 text-center shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Not Sure Which Test You Need?</h2>
          <p className="text-sky-100 text-sm mb-5">
            Call our experts Mon–Sat 7 AM–8 PM for a free consultation. Ultrasound: 9:30 AM–3 PM (evenings Mon/Tue/Wed/Fri 6–7 PM).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+919811582086">
              <Button className="bg-white text-sky-700 hover:bg-sky-50 font-bold px-7 py-2.5 rounded-xl shadow">
                Call +91 9811-582086
              </Button>
            </a>
            <Link href="/book-test">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-sky-700 font-bold px-7 py-2.5 rounded-xl">
                <Calendar className="h-4 w-4 mr-2" /> Book a Test
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-sky-500 mx-auto mb-4" />
          <p className="text-base font-semibold text-slate-600">Loading tests…</p>
        </div>
      </div>
    }>
      <TestsPageContent />
    </Suspense>
  );
}
