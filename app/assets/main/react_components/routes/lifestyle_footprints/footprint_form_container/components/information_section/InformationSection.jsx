import React from 'react';
import MoneyUsageList from '../common/MoneyUsageList.jsx';
import LatestProjectsList from '../common/LatestProjectsList.jsx';
import FAQ from './components/faq/FAQ.jsx';
import { useVersion } from '../../../contexts/VersionContext.js';

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
