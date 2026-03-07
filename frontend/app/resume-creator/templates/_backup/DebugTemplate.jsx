import React from 'react';

const DebugTemplate = ({ data }) => {
  return (
    <div className="p-10 bg-white h-full text-black overflow-y-auto">
      <h1 className="text-3xl font-bold text-green-600">✓ IT WORKS!</h1>
      <p className="mb-4">The Onboarding Wizard is connected correctly.</p>
      <hr className="my-4"/>
      <div className="space-y-2">
        <p><strong>Name:</strong> {data?.personal?.name || "No Name"}</p>
        <p><strong>Role:</strong> {data?.personal?.profession}</p>
        <p><strong>Experience:</strong> {data?.experience?.[0]?.company}</p>
      </div>
      
      <div className="mt-6 p-4 bg-red-50 text-red-700 rounded border border-red-200 text-sm">
        <strong>Debug Note:</strong> If you are seeing this card, your "ClassicTemplate.jsx" file has a crash/error in it (likely an icon import issue).
      </div>
    </div>
  );
};

export default DebugTemplate;