/*
  lib/isLabTest.ts
  ------------------------------------------------------------------
  Ek hi jagah decide hota hai ki koi test blood/lab sample wala hai
  ya imaging (ultrasound, x-ray, ECG...). Dono pages yahi import karte hain.
*/

// Imaging / procedure categories — inme koi sample nahi liya jaata
export const IMAGING_KEYWORDS: string[] = [
    'ultrasound', 'doppler', 'x-ray', 'xray', 'opg', 'echo', 'ecg', 'ekg',
    'fibroscan', 'dexa', 'densitometry', 'mri', 'ct-scan', 'ct scan',
    'radiology', 'sonography', 'tiffa', 'nt-scan', 'msk', 'mammography',
    'imaging', 'scan',
  ];
  
  // Lab / pathology categories — sample + home collection inhi par
  export const LAB_KEYWORDS: string[] = [
    'blood', 'pathology', 'lab', 'lifecell', 'haematology', 'hematology',
    'biochemistry', 'serology', 'hormone', 'urine', 'immunology',
    'profile', 'package', 'culture', 'microbiology', 'vitamin',
    'health-checkup', 'health checkup', 'diabetes', 'thyroid-profile',
  ];
  
  const SAMPLE_KEYWORDS: string[] = [
    'blood', 'serum', 'plasma', 'urine', 'stool', 'swab', 'saliva',
  ];
  
  /** Minimal shape — WooProduct aur Product dono isse satisfy karte hain */
  export interface LabTestCandidate {
    meta_data?: Array<{ key: string; value: unknown }>;
    categories?: Array<{ name?: string; slug?: string }>;
  }
  
  const readMeta = (product: LabTestCandidate, key: string): string => {
    const meta = Array.isArray(product.meta_data) ? product.meta_data : [];
    const item = meta.find((m) => m?.key === key);
    if (!item || item.value === null || item.value === undefined) return '';
    return String(item.value).toLowerCase().trim();
  };
  
  /**
   * Sirf category ke naam/slug se check — jab poora product object na ho
   * (jaise category page ke hero ya About section me).
   */
  export const isLabCategory = (...labels: Array<string | undefined>): boolean => {
    const text = labels.filter(Boolean).join(' ').toLowerCase();
    if (!text) return false;
    if (IMAGING_KEYWORDS.some((k) => text.includes(k))) return false;
    return LAB_KEYWORDS.some((k) => text.includes(k));
  };
  
  /**
   * Poore product par check. Priority:
   *   1. WordPress ka `is_lab_test` meta (yes / no)  — sabse reliable
   *   2. Product ki categories (name + slug)
   *   3. Page ki current category (fallback, agar product par category na ho)
   *   4. `sample_type` meta field
   */
  export const isLabTest = (
    product: LabTestCandidate | null | undefined,
    fallbackCategory?: string,
  ): boolean => {
    if (!product) return false;
  
    // 1️⃣ Explicit flag
    const flag = readMeta(product, 'is_lab_test');
    if (flag === 'yes' || flag === 'true' || flag === '1') return true;
    if (flag === 'no' || flag === 'false' || flag === '0') return false;
  
    // 2️⃣ Product ki apni categories
    const cats = (product.categories ?? [])
      .map((c) => `${c?.name ?? ''} ${c?.slug ?? ''}`)
      .join(' ')
      .toLowerCase();
  
    if (cats) {
      if (IMAGING_KEYWORDS.some((k) => cats.includes(k))) return false;
      if (LAB_KEYWORDS.some((k) => cats.includes(k))) return true;
    }
  
    // 3️⃣ Page ki category
    if (fallbackCategory) {
      const fb = fallbackCategory.toLowerCase();
      if (IMAGING_KEYWORDS.some((k) => fb.includes(k))) return false;
      if (LAB_KEYWORDS.some((k) => fb.includes(k))) return true;
    }
  
    // 4️⃣ sample_type meta
    const sample = readMeta(product, 'sample_type');
    return SAMPLE_KEYWORDS.some((k) => sample.includes(k));
  };