import React, { useState } from 'react';

interface FAQPageProps {
  onContactClick: () => void;
}

const FAQ_CATEGORIES = [
  { id: 'popular', name: 'Most Asked', icon: '⭐' },
  { id: 'ordering', name: 'Orders & Pricing', icon: '🛒' },
  { id: 'materials', name: 'Materials', icon: '🔩' },
  { id: 'services', name: 'Services', icon: '⚙️' },
  { id: 'files', name: 'File Setup', icon: '📁' },
  { id: 'shipping', name: 'Shipping', icon: '🚚' },
  { id: 'quality', name: 'Quality & Tolerances', icon: '📏' },
];

const FAQ_DATA = [
  // Most Asked
  {
    id: 1,
    category: 'popular',
    question: 'How do I get a quote for my custom parts?',
    answer: 'Getting a quote is easy! Simply use our online configurator to select a shape template or upload your own design file (DXF, DWG, AI, EPS). Choose your material, thickness, and any additional services. You\'ll see instant pricing as you configure your part. Add to cart when ready to proceed.',
  },
  {
    id: 2,
    category: 'popular',
    question: 'What is the typical lead time for orders?',
    answer: 'Standard lead times are 5-7 business days for most orders. Express shipping options are available for 2-3 business day delivery. Complex orders with multiple secondary operations may take longer. You\'ll see the estimated delivery date during checkout.',
  },
  {
    id: 3,
    category: 'popular',
    question: 'What file formats do you accept?',
    answer: 'We accept DXF, DWG, AI (Adobe Illustrator), EPS, and STEP/STP files. For best results, submit vector files with proper layer organization. All paths should be closed, and dimensions should be in millimeters.',
  },
  {
    id: 4,
    category: 'popular',
    question: 'Is there a minimum order quantity?',
    answer: 'No! We have no minimum order quantity. You can order a single part or thousands - we offer volume discounts of up to 70% on larger quantities. Bulk pricing is automatically applied at checkout.',
  },

  // Orders & Pricing
  {
    id: 5,
    category: 'ordering',
    question: 'How is pricing calculated?',
    answer: 'Pricing is based on several factors: material type and thickness, part size and complexity, cutting perimeter, and any additional services (bending, finishing, etc.). Our online system calculates pricing in real-time as you configure your part.',
  },
  {
    id: 6,
    category: 'ordering',
    question: 'Do you offer bulk discounts?',
    answer: 'Yes! We offer significant volume discounts. Pricing drops as quantity increases: 2-9 units (~20% off), 10-49 units (~40% off), 50-99 units (~55% off), 100+ units (~65% off). Note that parts must be identical to qualify for quantity pricing.',
  },
  {
    id: 7,
    category: 'ordering',
    question: 'What payment methods do you accept?',
    answer: 'We accept credit/debit cards (Visa, Mastercard, Mada), bank transfers, and cash on delivery for local orders. Business accounts can apply for NET 30 payment terms.',
  },
  {
    id: 8,
    category: 'ordering',
    question: 'Can I cancel or modify my order?',
    answer: 'Orders can be modified or cancelled within 2 hours of placement, provided production hasn\'t started. Contact our support team immediately if you need to make changes. Once production begins, modifications are not possible.',
  },

  // Materials
  {
    id: 9,
    category: 'materials',
    question: 'What materials do you stock?',
    answer: 'We stock 50+ materials including: Metals (mild steel, stainless 304/316, aluminum alloys, brass, copper, titanium), Composites (carbon fiber, G-10), Plastics (acrylic, polycarbonate, delrin, HDPE), and more. Check our Materials Library for the full list.',
  },
  {
    id: 10,
    category: 'materials',
    question: 'What thicknesses are available?',
    answer: 'Thickness options vary by material. Most metals are available from 1mm to 12mm. Plastics range from 2mm to 25mm. See individual material pages for exact thickness options and pricing.',
  },
  {
    id: 11,
    category: 'materials',
    question: 'Can you source materials not listed?',
    answer: 'Yes! If you need a material not in our standard inventory, contact us with your requirements. We can often source specialty materials for custom projects. Lead times may be longer for non-stock materials.',
  },

  // Services
  {
    id: 12,
    category: 'services',
    question: 'What bending tolerances can you achieve?',
    answer: 'We guarantee bending accuracy within ±1 degree. Minimum inside bend radius varies by material and thickness - typically 1x material thickness for aluminum and 1.5x for steel. Our bend calculator can help you plan your design.',
  },
  {
    id: 13,
    category: 'services',
    question: 'What anodizing colors are available?',
    answer: 'We offer Type II anodizing in 5 standard colors: Clear (natural), Black, Red, Blue, and Gold. Anodizing is available only for aluminum parts. Custom colors may be available for larger orders.',
  },
  {
    id: 14,
    category: 'services',
    question: 'Do you offer powder coating?',
    answer: 'Yes! We offer powder coating in 10+ standard colors with gloss, matte, and textured finishes. Powder coating provides excellent durability and is available for steel, aluminum, and suitable substrates.',
  },

  // File Setup
  {
    id: 15,
    category: 'files',
    question: 'What are the file requirements?',
    answer: 'Files should be vector-based (not raster/bitmap). All paths must be closed and non-overlapping. Use millimeters for dimensions. Remove duplicate lines and construction geometry. Layer separation helps but isn\'t required.',
  },
  {
    id: 16,
    category: 'files',
    question: 'What is the minimum feature size?',
    answer: 'Minimum feature size depends on material and thickness. Generally: holes should be at least 1x material thickness in diameter, minimum slot width is 1.5x thickness, and minimum distance between features is 2x thickness.',
  },
  {
    id: 17,
    category: 'files',
    question: 'How do I indicate bend lines?',
    answer: 'Place bend lines on a separate layer labeled "BEND". Use a different color (red recommended) for bend lines. Include bend direction arrows and angle annotations. Our system will detect and quote bends automatically.',
  },

  // Shipping
  {
    id: 18,
    category: 'shipping',
    question: 'Do you ship internationally?',
    answer: 'Currently, we ship within Saudi Arabia and to GCC countries (UAE, Kuwait, Qatar, Bahrain, Oman). International shipping to other countries is available for larger orders - contact us for a quote.',
  },
  {
    id: 19,
    category: 'shipping',
    question: 'Is shipping free?',
    answer: 'Shipping is free for orders over SAR 150 within Saudi Arabia. Orders under this amount incur a flat SAR 50 shipping fee. Express and freight shipping have additional charges.',
  },
  {
    id: 20,
    category: 'shipping',
    question: 'How are parts packaged?',
    answer: 'Parts are carefully packaged to prevent damage during shipping. Small parts are wrapped individually, and larger orders use custom foam inserts. Finished parts (anodized, powder coated) receive extra protection.',
  },

  // Quality
  {
    id: 21,
    category: 'quality',
    question: 'What are your cutting tolerances?',
    answer: 'Laser cutting: ±0.1mm. Waterjet: ±0.15mm. Plasma: ±0.5mm. CNC Routing: ±0.1mm. Actual tolerances may vary slightly based on material and part geometry. Contact us for precision-critical applications.',
  },
  {
    id: 22,
    category: 'quality',
    question: 'Do you provide material certifications?',
    answer: 'Yes, material test certificates (MTCs) are available upon request for metal materials. These certify the material grade, composition, and mechanical properties. There may be an additional fee for documentation.',
  },
  {
    id: 23,
    category: 'quality',
    question: 'What if I receive defective parts?',
    answer: 'We stand behind our quality. If you receive parts that don\'t meet specifications, contact us within 7 days with photos. We\'ll either remake the parts at no charge or provide a full refund. See our refund policy for details.',
  },
];

const FAQPage: React.FC<FAQPageProps> = ({ onContactClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesCategory = selectedCategory === 'popular'
      ? faq.category === 'popular'
      : faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return (searchQuery ? matchesSearch : matchesCategory);
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Find answers to common questions about our services, materials, and ordering process.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-4">
              <h3 className="font-semibold text-slate-900 mb-4">Categories</h3>
              <nav className="space-y-1">
                {FAQ_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                      selectedCategory === cat.id && !searchQuery
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="flex-1">
            {searchQuery && (
              <p className="mb-6 text-slate-600">
                Showing {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for "<span className="font-semibold">{searchQuery}</span>"
              </p>
            )}

            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <h3 className="text-lg font-semibold text-slate-900 pr-4">{faq.question}</h3>
                    <svg
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                        expandedId === faq.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedId === faq.id && (
                    <div className="px-6 pb-6">
                      <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No results found</h3>
                <p className="text-slate-600 mb-4">Try a different search term or browse by category</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-white rounded-xl border border-slate-200 p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Still have questions?</h3>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <button
            onClick={onContactClick}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
