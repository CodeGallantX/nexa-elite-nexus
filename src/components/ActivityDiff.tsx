import React from 'react';

interface ActivityDiffProps {
  oldValue: any;
  newValue: any;
}

const formatValue = (value: any) => {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
};

const getChangedFields = (oldValue: any, newValue: any) => {
  const changes: { key: string; from: any; to: any }[] = [];

  if (!oldValue || !newValue) {
    return changes;
  }

  const allKeys = Array.from(new Set([...Object.keys(oldValue), ...Object.keys(newValue)]));

  for (const key of allKeys) {
    if (oldValue[key] !== newValue[key]) {
      changes.push({
        key,
        from: oldValue[key],
        to: newValue[key],
      });
    }
  }

  return changes;
};

export const ActivityDiff: React.FC<ActivityDiffProps> = ({ oldValue, newValue }) => {
  const changes = getChangedFields(oldValue, newValue);

  if (changes.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 text-xs">
      <ul className="space-y-1">
        {changes.map(({ key, from, to }) => (
          <li key={key} className="flex items-center">
            <span className="font-semibold text-gray-300 capitalize">{key.replace(/_/g, ' ')}:</span>
            <span className="ml-2 text-red-400">{formatValue(from)}</span>
            <span className="mx-2 text-gray-400">→</span>
            <span className="text-green-400">{formatValue(to)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};