import { Route } from 'react-router-dom';
import { AdminLayout } from '../components/layout';
import AdminDashboard from '../pages/admin/dashboard/AdminDashboard';
import AdminHome from '../pages/admin/home/AdminHome';
import AdminHomeLogoLoop from '../pages/admin/homeLogoLoop/AdminHomeLogoLoop';
import AdminLicenses from '../pages/admin/licenses/AdminLicenses';
import AdminTssSingleContent from '../pages/admin/tss/AdminTssSingleContent';
import AdminTss from '../pages/admin/tss/AdminTss';
import AdminCategories from '../pages/admin/categories/AdminCategories';
import AdminProducts from '../pages/admin/products/AdminProducts';
import AdminProjects from '../pages/admin/projects/AdminProjects';
import AdminTechnologies from '../pages/admin/technologies/AdminTechnologies';
import AdminServices from '../pages/admin/services/AdminServices';
import AdminTallyAmcContent from '../pages/admin/services/AdminTallyAmcContent';
import AdminTallyBusinessSolutionsContent from '../pages/admin/services/AdminTallyBusinessSolutionsContent';
import AdminWebAppDevelopmentContent from '../pages/admin/services/AdminWebAppDevelopmentContent';
import AdminCloud from '../pages/admin/cloud/AdminCloud';
import AdminTallyOnCloudContent from '../pages/admin/cloud/AdminTallyOnCloudContent';
import AdminDedicatedVpsServerContent from '../pages/admin/cloud/AdminDedicatedVpsServerContent';
import AdminTdlSecurityControlContent from '../pages/admin/tdl/AdminTdlSecurityControlContent';
import AdminTdlProductivityContent from '../pages/admin/tdl/AdminTdlProductivityContent';
import AdminTdlMisReportingContent from '../pages/admin/tdl/AdminTdlMisReportingContent';
import AdminTdlInvoiceContent from '../pages/admin/tdl/AdminTdlInvoiceContent';
import AdminTdlBusinessSpecificContent from '../pages/admin/tdl/AdminTdlBusinessSpecificContent';
import AdminTdlBankingContent from '../pages/admin/tdl/AdminTdlBankingContent';
import AdminIntegrationExcelImportContent from '../pages/admin/integration/AdminIntegrationExcelImportContent';
import AdminIntegrations from '../pages/admin/integration/AdminIntegrations';
import AdminIntegrationThirdPartyContent from '../pages/admin/integration/AdminIntegrationThirdPartyContent';
import AdminIntegrationWhatsappContent from '../pages/admin/integration/AdminIntegrationWhatsappContent';
import AdminIntegrationSmsApiContent from '../pages/admin/integration/AdminIntegrationSmsApiContent';
import AdminEnquiries from '../pages/admin/enquiries/AdminEnquiries';
import AdminBlogs from '../pages/admin/blogs/AdminBlogs';
import PrivateRoute from './PrivateRoute';

export function getAdminRoutes() {
  return (
    <Route path="/admin" element={<PrivateRoute adminOnly><AdminLayout /></PrivateRoute>}>
      <Route index element={<AdminDashboard />} />
      <Route path="home" element={<AdminHome />} />
      <Route path="home-logo-loop" element={<AdminHomeLogoLoop />} />
      <Route path="licenses" element={<AdminLicenses />} />
      <Route path="tss-single" element={<AdminTssSingleContent />} />
      <Route path="renew-tss" element={<AdminTss />} />
      <Route path="categories" element={<AdminCategories />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="projects" element={<AdminProjects />} />
      <Route path="technologies" element={<AdminTechnologies />} />
      <Route path="services" element={<AdminServices />} />
      <Route path="web-app-development-content" element={<AdminWebAppDevelopmentContent />} />
      <Route path="tally-amc-content" element={<AdminTallyAmcContent />} />
      <Route path="tally-business-solutions-content" element={<AdminTallyBusinessSolutionsContent />} />
      <Route path="tdl-security-control-content" element={<AdminTdlSecurityControlContent />} />
      <Route path="tdl-productivity-content" element={<AdminTdlProductivityContent />} />
      <Route path="tdl-mis-reporting-content" element={<AdminTdlMisReportingContent />} />
      <Route path="tdl-invoice-content" element={<AdminTdlInvoiceContent />} />
      <Route path="tdl-business-specific-content" element={<AdminTdlBusinessSpecificContent />} />
      <Route path="tdl-banking-content" element={<AdminTdlBankingContent />} />
      <Route path="integration" element={<AdminIntegrations />} />
      <Route path="cloud" element={<AdminCloud />} />
      <Route path="tally-on-cloud-content" element={<AdminTallyOnCloudContent />} />
      <Route path="dedicated-vps-server-content" element={<AdminDedicatedVpsServerContent />} />
      <Route path="integration-excel-import-content" element={<AdminIntegrationExcelImportContent />} />
      <Route path="integration-third-party-content" element={<AdminIntegrationThirdPartyContent />} />
      <Route path="integration-whatsapp-content" element={<AdminIntegrationWhatsappContent />} />
      <Route path="integration-sms-api-content" element={<AdminIntegrationSmsApiContent />} />
      <Route path="enquiries" element={<AdminEnquiries />} />
      <Route path="blogs" element={<AdminBlogs />} />
    </Route>
  );
}
