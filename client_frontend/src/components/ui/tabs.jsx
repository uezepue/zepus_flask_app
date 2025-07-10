import React, { useState } from 'react';

export function Tabs({ defaultValue, children, className }) {
  const [active, setActive] = useState(defaultValue);
  const triggers = [];
  const contents = [];

  React.Children.forEach(children, child => {
    if (child.type.displayName === 'TabsTrigger') {
      triggers.push(React.cloneElement(child, { active, setActive }));
    } else if (child.type.displayName === 'TabsContent') {
      contents.push(React.cloneElement(child, { active }));
    }
  });

  return (
    <div className={className}>
      <div className="flex gap-2 border-b mb-4">{triggers}</div>
      <div>{contents}</div>
    </div>
  );
}

export function TabsTrigger({ value, children, active, setActive }) {
  const isActive = active === value;
  return (
    <button
      onClick={() => setActive(value)}
      className={`px-4 py-2 rounded-t font-medium ${
        isActive ? 'bg-white border border-b-0 text-blue-600' : 'bg-gray-200 text-gray-700'
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, active, children }) {
  if (value !== active) return null;
  return <div className="bg-white border p-4 rounded-b shadow">{children}</div>;
}

Tabs.displayName = 'Tabs';
TabsTrigger.displayName = 'TabsTrigger';
TabsContent.displayName = 'TabsContent';
