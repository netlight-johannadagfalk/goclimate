import React from 'react';
import MoneyUsageList from '../footprint_result/MoneyUsageList.jsx';
import LatestProjectsList from '../footprint_result/LatestProjectsList.jsx';
import FAQ from '../footprint_result/FAQ.jsx';

const InformationSection = () => {
  return (
    <div className="text-left space-y-6">
      <MoneyUsageList />
      <LatestProjectsList />
      <FAQ />
    </div>
  );
};

export default InformationSection;
