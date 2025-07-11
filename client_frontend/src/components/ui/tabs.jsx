import React, { useState, cloneElement, Children } from 'react';

export function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <div>
      {Children.map(children, child =>
        cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
}

export function TabsList({ children, activeTab, setActiveTab }) {
  return (
    <div className="flex space-x-2 border-b border-gray-300 mb-4">
      {Children.map(children, child =>
        cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
}

export function TabsTrigger({ value, activeTab, setActiveTab, children }) {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 text-sm font-medium border-b-2 ${
        isActive
          ? 'border-blue-600 text-blue-700'
          : 'border-transparent text-gray-500 hover:text-blue-600'
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, activeTab, children }) {
  if (value !== activeTab) return null;
  return <div className="mt-4">{children}</div>;
}
