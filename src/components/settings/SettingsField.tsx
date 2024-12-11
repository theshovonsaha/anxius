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
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
};