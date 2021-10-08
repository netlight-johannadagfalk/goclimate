import React from 'react';
import { useVersion } from '../../../contexts/VersionContext.js';
import LatestProjectsListV1 from '../common/latest_projects_list/LatestProjectsListV1.jsx';
import WhereDoesTheMoneyGo from '../common/WhereDoesTheMoneyGo.jsx';
import FAQ from './components/faq/FAQ.jsx';

const InformationSection = () => {
  const version = useVersion();

  return (
    <div className="text-left space-y-14 pb-40">
      {version === 'v1' && (
        <>
          <WhereDoesTheMoneyGo />
          <LatestProjectsListV1 />
        </>
      )}
      <FAQ />
    </div>
  );
};

export default InformationSection;
