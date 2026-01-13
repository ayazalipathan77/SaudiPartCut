import React, { useState } from 'react';
import Breadcrumb from '../common/Breadcrumb';
import MaterialCard from '../common/MaterialCard';
import { MaterialDef, MaterialType } from '../../../types';

interface StepMaterialSelectionProps {
  materials: MaterialDef[];
  onMaterialSelect: (material: MaterialDef) => void;
}

const StepMaterialSelection: React.FC<StepMaterialSelectionProps> = ({
  materials,
  onMaterialSelect,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');

  const categories = [
    {
      id: 'metals',
      name: 'Metals',
      description: 'Mild Steel, Stainless, Copper, Titanium...',
      materials: materials.filter((m) =>
        ['mild_steel', 'stainless_304', 'stainless_316'].includes(m.id)
      ),
    },
    {
      id: 'composites',
      name: 'Composites',
      description: 'Carbon fiber, G10, ACM...',
      materials: [],
    },
    {
      id: 'plastics',
      name: 'Plastics',
      description: 'Acrylic, Delrin, ABS...',
      materials: [],
    },
    {
      id: 'wood',
      name: 'Wood And MDF',
      description: 'Birch plywood, MDF, hardboard...',
      materials: [],
    },
    {
      id: 'rubber',
      name: 'Rubber And Gasket',
      description: 'Sealing, flexible materials — Buna-N, Nitrile, Garlock...',
      materials: [],
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleMaterialClick = (material: MaterialDef) => {
    setSelectedMaterial(material.id);
    onMaterialSelect(material);
  };

  const handleBackToCategories = () => {
    setSelectedCategory('');
    setSelectedMaterial('');
  };

  // Show categories
  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center mb-8">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 uppercase tracking-wide">
            ☰ LIST VIEW
          </button>
        </div>

        <div className="space-y-3">
          {categories.map((category) => (
            <MaterialCard
              key={category.id}
              name={category.name}
              description={category.description}
              onClick={() => handleCategoryClick(category.id)}
              hasInfo={false}
            />
          ))}
        </div>

        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-2">Don't see what you're looking for?</p>
          <button className="text-blue-600 hover:text-blue-700 font-medium uppercase text-sm tracking-wide">
            SUGGEST A MATERIAL •
          </button>
        </div>
      </div>
    );
  }

  // Show materials in selected category
  const selectedCat = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'CATEGORIES', onClick: handleBackToCategories },
          { label: selectedCat?.name.toUpperCase() || '' },
        ]}
      />

      <div className="space-y-3">
        {selectedCat?.materials.map((material) => (
          <MaterialCard
            key={material.id}
            name={material.name}
            description={`${material.nameAr} • ${material.density} g/cm³`}
            onClick={() => handleMaterialClick(material)}
            selected={selectedMaterial === material.id}
            hasInfo={true}
          />
        ))}

        {selectedCat?.materials.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No materials available in this category yet.</p>
            <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
              Suggest a Material
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepMaterialSelection;
