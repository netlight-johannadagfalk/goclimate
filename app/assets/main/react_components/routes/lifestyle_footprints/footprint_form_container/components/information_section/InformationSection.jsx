import React from 'react';
import MoneyUsageList from '../common/MoneyUsageList.jsx';
import LatestProjectsList from '../common/latest_projects_list/LatestProjectsList.jsx';
import FAQ from './components/faq/FAQ.jsx';
import { useVersion } from '../../../contexts/VersionContext.js';

const InformationSection = () => {
  const version = useVersion();
  return (
    <div className="text-left">
      {version === 'v1' && (
        <>
          <MoneyUsageList />
          <LatestProjectsList />
        </>
      )}
      <div className="mt-24">
        <FAQ />
      </div>
    </div>
  );
};

export default InformationSection;
