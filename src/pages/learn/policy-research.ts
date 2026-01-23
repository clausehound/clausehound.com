import { createElement as h } from 'react';
import Layout from '@utils/layout';
import SEO from '@utils/seo';
import LearnHeader from '@molecules/policyResearchHeader';

const PolicyResearch = () => {
  return h(Layout, null, h(SEO, { title: 'Clausehound - Learn: Policy Research' }), h(LearnHeader));
};

export default PolicyResearch;
