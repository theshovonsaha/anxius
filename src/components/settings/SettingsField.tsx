import React from 'react';

interface SettingsFieldProps {
  label: string;
  children: React.ReactNode;
  description?: string;
}

export const SettingsField: React.FC<SettingsFieldProps> = ({
  label,
  children,
  description,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
};