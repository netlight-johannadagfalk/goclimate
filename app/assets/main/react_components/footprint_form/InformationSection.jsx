import React from 'react';
import MoneyUsageList from '../footprint_result/MoneyUsageList.jsx';
import LatestProjectsList from '../footprint_result/LatestProjectsList.jsx';
import FAQ from '../footprint_result/FAQ.jsx';
import { useVersion } from '../context/Footprint/VersionContext.js';

const InformationSection = () => {
  const version = useVersion();
  return (
    <div className="text-left space-y-6">
      {version === 'v1' && (
        <>
          <MoneyUsageList />
          <LatestProjectsList />
        </>
      )}
      <FAQ />
    </div>
  );
};

export default InformationSection;
