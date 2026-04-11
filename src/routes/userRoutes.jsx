import { Navigate, Route } from 'react-router-dom';
import { Layout } from '../components/layout';
import Home from '../pages/home/Home';
import Licenses from '../pages/licenses/Licenses';
import TssRenewLicenses from '../pages/tss/TssRenewLicenses';
import TssSingleRenewal from '../pages/tss/TssSingleRenewal';
import TssMultiRenewal from '../pages/tss/TssMultiRenewal';
import Products from '../pages/products/Products';
import ProductDetail from '../pages/products/ProductDetail';
import TdlSecurityControl from '../pages/tdl/TdlSecurityControl';
import TdlProductivity from '../pages/tdl/TdlProductivity';
import TdlMisReporting from '../pages/tdl/TdlMisReporting';
import TdlInvoice from '../pages/tdl/TdlInvoice';
import TdlBusinessSpecific from '../pages/tdl/TdlBusinessSpecific';
import TdlBanking from '../pages/tdl/TdlBanking';
import Services from '../pages/services/Services';
import ServiceDetail from '../pages/services/ServiceDetail';
import IntegrationExcelImport from '../pages/integration/IntegrationExcelImport';
import IntegrationThirdParty from '../pages/integration/IntegrationThirdParty';
import IntegrationWhatsapp from '../pages/integration/IntegrationWhatsapp';
import IntegrationSmsApi from '../pages/integration/IntegrationSmsApi';
import TallyAmc from '../pages/services/TallyAmc';
import TallyBusinessSolutions from '../pages/businessSolutions/TallyBusinessSolutions';
import WebAppDevelopment from '../pages/services/WebAppDevelopment';
import Technologies from '../pages/technologies/Technologies';
import TechnologyDetail from '../pages/technologies/TechnologyDetail';
import Projects from '../pages/projects/Projects';
import ProjectDetail from '../pages/projects/ProjectDetail';
import CloudHosting from '../pages/cloudHosting/CloudHosting';
import TallyOnCloud from '../pages/cloudHosting/TallyOnCloud';
import DedicatedVpsServer from '../pages/cloudHosting/DedicatedVpsServer';
import Contact from '../pages/contact/Contact';
import Blog from '../pages/blog/Blog';
import BlogPost from '../pages/blog/BlogPost';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from './PrivateRoute';

export function getUserRoutes() {
  return (
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="licenses" element={<Licenses />} />
      <Route path="tss-renew" element={<TssRenewLicenses />} />
      <Route path="tss-renewal-single-user" element={<TssSingleRenewal />} />
      <Route path="tss-renewal-multi-user" element={<TssMultiRenewal />} />
      <Route path="products" element={<Products />} />
      <Route path="products/tdl-security-control" element={<TdlSecurityControl />} />
      <Route path="products/tdl-productivity" element={<TdlProductivity />} />
      <Route path="products/tdl-mis-reporting" element={<TdlMisReporting />} />
      <Route path="products/tdl-invoice" element={<TdlInvoice />} />
      <Route path="products/tdl-business-specific" element={<TdlBusinessSpecific />} />
      <Route path="products/tdl-banking" element={<TdlBanking />} />
      <Route path="integration-excel-import" element={<IntegrationExcelImport />} />
      <Route path="integration-third-party" element={<IntegrationThirdParty />} />
      <Route path="integration-whatsapp" element={<IntegrationWhatsapp />} />
      <Route path="integration-sms-api" element={<IntegrationSmsApi />} />
      <Route path="tally-amc" element={<TallyAmc />} />
      <Route path="tally-business-solutions" element={<TallyBusinessSolutions />} />
      <Route path="web-app-development" element={<WebAppDevelopment />} />
      <Route path="products/:slug" element={<ProductDetail />} />
      <Route path="services" element={<Services />} />
      <Route path="services/:slug" element={<ServiceDetail />} />
      <Route path="technologies" element={<Technologies />} />
      <Route path="technologies/:slug" element={<TechnologyDetail />} />
      <Route path="projects" element={<Projects />} />
      <Route path="projects/:slug" element={<ProjectDetail />} />
      <Route path="cloud-hosting" element={<CloudHosting />} />
      <Route path="tally-on-cloud" element={<TallyOnCloud />} />
      <Route path="dedicated-vps-server" element={<DedicatedVpsServer />} />
      <Route path="contact" element={<Contact />} />
      <Route path="blog" element={<Blog />} />
      <Route path="blog/:slug" element={<BlogPost />} />
      <Route path="profile" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="dashboard" element={<Navigate to="/profile" replace />} />
    </Route>
  );
}
