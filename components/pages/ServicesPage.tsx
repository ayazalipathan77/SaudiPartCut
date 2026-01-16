import React from 'react';

interface ServicesPageProps {
  onStartQuote: () => void;
}

const CUTTING_SERVICES = [
  {
    id: 'laser',
    name: 'Laser Cutting',
    description: 'High-precision cutting with clean edges and tight tolerances. Ideal for intricate designs and detailed work.',
    features: ['Tolerances to ±0.1mm', 'Clean, burr-free edges', 'Intricate detail capability', 'Fast turnaround'],
    materials: ['Steel', 'Stainless Steel', 'Aluminum', 'Brass', 'Copper', 'Acrylic', 'Wood'],
    icon: '🔆',
  },
  {
    id: 'waterjet',
    name: 'Waterjet Cutting',
    description: 'Versatile cutting using high-pressure water and abrasive. No heat-affected zones, perfect for sensitive materials.',
    features: ['No heat distortion', 'Any material thickness', 'Complex shapes', 'Stack cutting capable'],
    materials: ['Titanium', 'Carbon Fiber', 'Glass', 'Stone', 'Rubber', 'Composites'],
    icon: '💧',
  },
  {
    id: 'plasma',
    name: 'Plasma Cutting',
    description: 'Cost-effective cutting for thicker metals. Fast processing for large-scale projects.',
    features: ['Thick material capable', 'Fast cutting speed', 'Cost-effective', 'Large format'],
    materials: ['Mild Steel', 'Stainless Steel', 'Aluminum'],
    icon: '⚡',
  },
  {
    id: 'cnc',
    name: 'CNC Routing',
    description: 'Precision routing for plastics, wood, and composites. Perfect for complex 2.5D shapes.',
    features: ['2.5D machining', 'Smooth edges', 'Pocket milling', 'Engraving capable'],
    materials: ['Plastics', 'Wood', 'Composites', 'Foam', 'ACM'],
    icon: '🔧',
  },
];

const SECONDARY_OPERATIONS = [
  {
    id: 'bending',
    name: 'Bending & Forming',
    description: 'Precision bends within 1 degree accuracy. Create complex 3D parts from flat sheets.',
    pricing: 'From SAR 2.50/bend',
    icon: '📐',
  },
  {
    id: 'countersinking',
    name: 'Countersinking',
    description: 'Create countersunk holes for flush-mounted fasteners. Multiple angles available.',
    pricing: 'From SAR 1.00/hole',
    icon: '🔩',
  },
  {
    id: 'tapping',
    name: 'Tapping',
    description: 'Add internal threads to holes. Wide range of metric and imperial sizes.',
    pricing: 'From SAR 1.50/hole',
    icon: '🔗',
  },
  {
    id: 'hardware',
    name: 'Hardware Insertion',
    description: 'Press-fit PEM hardware including nuts, studs, and standoffs.',
    pricing: 'From SAR 2.00/piece',
    icon: '🔨',
  },
  {
    id: 'dimple',
    name: 'Dimple Forming',
    description: 'Add dimples for aesthetics or to strengthen panel areas.',
    pricing: 'From SAR 1.00/dimple',
    icon: '⚫',
  },
];

const FINISHING_SERVICES = [
  {
    id: 'anodizing',
    name: 'Anodizing',
    description: 'Type II anodizing for aluminum parts. Provides corrosion resistance and color options.',
    colors: ['Clear', 'Black', 'Red', 'Blue', 'Gold'],
    pricing: 'From SAR 15/part',
    icon: '🎨',
  },
  {
    id: 'powder',
    name: 'Powder Coating',
    description: 'Durable, long-lasting finish available in multiple colors and textures.',
    colors: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Silver', 'Bronze', 'Custom'],
    pricing: 'From SAR 20/part',
    icon: '🌈',
  },
  {
    id: 'plating',
    name: 'Plating',
    description: 'Zinc and nickel plating for rust prevention and enhanced appearance.',
    colors: ['Zinc Clear', 'Zinc Yellow', 'Nickel'],
    pricing: 'From SAR 10/part',
    icon: '✨',
  },
  {
    id: 'tumbling',
    name: 'Tumbling',
    description: 'Remove surface blemishes and achieve a consistent finish across all parts.',
    pricing: 'From SAR 3/part',
    icon: '🔄',
  },
  {
    id: 'deburring',
    name: 'Deburring',
    description: 'Remove sharp edges and burrs for safe handling and better appearance.',
    pricing: 'From SAR 2/part',
    icon: '🪒',
  },
];

const ServicesPage: React.FC<ServicesPageProps> = ({ onStartQuote }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-blue-200 max-w-2xl">
            From cutting to finishing, we offer a complete range of manufacturing services to bring your designs to life.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Cutting Services */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Cutting Services</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose from multiple cutting technologies to match your material and precision requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CUTTING_SERVICES.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{service.name}</h3>
                    <p className="text-slate-600 mb-4">{service.description}</p>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Key Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Compatible Materials</h4>
                      <p className="text-sm text-slate-600">{service.materials.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Secondary Operations */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Secondary Operations</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Add value to your parts with our range of secondary manufacturing operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECONDARY_OPERATIONS.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{service.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{service.description}</p>
                <p className="text-sm font-semibold text-blue-600">{service.pricing}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Finishing Services */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Finishing Services</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Complete your parts with professional finishing for enhanced appearance and durability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FINISHING_SERVICES.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{service.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{service.description}</p>

                {'colors' in service && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Available Colors</h4>
                    <div className="flex flex-wrap gap-1">
                      {service.colors.map((color, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-sm font-semibold text-blue-600">{service.pricing}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Upload your design or use our shape templates to get an instant quote for your custom parts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartQuote}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
            >
              Get Instant Quote
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors">
              Contact Sales
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServicesPage;
