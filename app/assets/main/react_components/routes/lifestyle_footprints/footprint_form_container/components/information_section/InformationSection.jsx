import React from 'react';
import { useVersion } from '../../../contexts/VersionContext.js';
import LatestProjectsListV1 from '../common/latest_projects_list/LatestProjectsListV1.jsx';
import MoneyUsageList from '../common/MoneyUsageList.jsx';
import FAQ from './components/faq/FAQ.jsx';

const InformationSection = () => {
  const version = useVersion();
  return (
    <div className="text-left">
      {version === 'v1' && (
        <>
          <MoneyUsageList />
          <LatestProjectsListV1 />
        </>
      )}
      <div className="mt-14">
        <FAQ />
      </div>
    </div>
  );
};

export default InformationSection;
