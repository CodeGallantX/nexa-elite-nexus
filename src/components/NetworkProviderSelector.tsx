import React from 'react';
import { MultiSelect, OptionType } from '@/components/ui/multi-select';

const providers: OptionType[] = [
  { value: 'mtn', label: 'MTN', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/New_MTN_Logo.svg' },
  { value: 'glo', label: 'Glo', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Glo_logo.svg' },
  { value: 'airtel', label: 'Airtel', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Airtel_logo.svg' },
  { value: '9mobile', label: '9mobile', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/9mobile_logo.svg' },
];

interface NetworkProviderSelectorProps {
  selectedProviders: string[];
  onSelectProviders: React.Dispatch<React.SetStateAction<string[]>>;
}

const NetworkProviderSelector: React.FC<NetworkProviderSelectorProps> = ({ selectedProviders, onSelectProviders }) => {
  return (
    <MultiSelect
      options={providers}
      selected={selectedProviders}
      onChange={onSelectProviders}
      className="w-full"
    />
  );
};

export default NetworkProviderSelector;