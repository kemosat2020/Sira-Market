
import React from 'react';
import { Variant } from '../types.ts';
import { useTranslation } from '../i18n/index.tsx';

interface InlineVariantSelectorProps {
  variants: Variant[];
  selectedVariant: Variant;
  onSelectVariant: (variant: Variant) => void;
}

const InlineVariantSelector: React.FC<InlineVariantSelectorProps> = ({ variants, selectedVariant, onSelectVariant }) => {
  const { locale } = useTranslation();
  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
      {variants.map(variant => (
        <button
          key={variant.id}
          onClick={() => onSelectVariant(variant)}
          className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
            selectedVariant.id === variant.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {variant.name[locale]}
        </button>
      ))}
    </div>
  );
};

export default InlineVariantSelector;