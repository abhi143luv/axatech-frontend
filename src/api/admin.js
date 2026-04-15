import { request } from './core';
import adminHomeApi from './home/admin';
import adminLicensesApi from './licenses/admin';
import adminTssApi from './tss/admin';
import adminTssContentApi from './tssContent/admin';
import adminCategoriesApi from './categories/admin';
import adminProductsApi from './products/admin';
import adminServicesApi from './service/admin';
import adminCloudApi from './cloud/admin';
import adminEnquiryApi from './enquiry/admin';
import adminBlogsApi from './blogs/admin';
import adminProjectsApi from './projects/admin';
import adminTechnologiesApi from './technologies/admin';
import adminHomeLogoLoopApi from './homeLogoLoop/admin';
import adminTallyOnCloudContentApi from './tallyOnCloudContent/admin';
import adminDedicatedVpsServerContentApi from './dedicatedVpsServerContent/admin';
import adminIntegrationExcelImportContentApi from './integrationExcelImportContent/admin';
import adminIntegrationThirdPartyContentApi from './integrationThirdPartyContent/admin';
import adminIntegrationWhatsappContentApi from './integrationWhatsappContent/admin';
import adminIntegrationSmsApiContentApi from './integrationSmsApiContent/admin';
import adminTallyAmcContentApi from './tallyAmcContent/admin';
import adminTallyBusinessSolutionsContentApi from './tallyBusinessSolutionsContent/admin';
import adminTdlSecurityControlContentApi from './tdlSecurityControlContent/admin';
import adminTdlProductivityContentApi from './tdlProductivityContent/admin';
import adminTdlMisReportingContentApi from './tdlMisReportingContent/admin';
import adminTdlInvoiceContentApi from './tdlInvoiceContent/admin';
import adminTdlBusinessSpecificContentApi from './tdlBusinessSpecificContent/admin';
import adminTdlBankingContentApi from './tdlBankingContent/admin';
import adminWebAppDevelopmentContentApi from './webAppDevelopmentContent/admin';
// Note: other admin modules (upload, etc.) can be added similarly later.

export function createAdminApi() {
  return {
    home: adminHomeApi,
    licenses: adminLicensesApi,
    tss: adminTssApi,
    tssContent: adminTssContentApi,
    tallyOnCloudContent: adminTallyOnCloudContentApi,
    dedicatedVpsServerContent: adminDedicatedVpsServerContentApi,
    integrationExcelImportContent: adminIntegrationExcelImportContentApi,
    integrationThirdPartyContent: adminIntegrationThirdPartyContentApi,
    integrationWhatsappContent: adminIntegrationWhatsappContentApi,
    integrationSmsApiContent: adminIntegrationSmsApiContentApi,
    tallyAmcContent: adminTallyAmcContentApi,
    tallyBusinessSolutionsContent: adminTallyBusinessSolutionsContentApi,
    tdlSecurityControlContent: adminTdlSecurityControlContentApi,
    tdlProductivityContent: adminTdlProductivityContentApi,
    tdlMisReportingContent: adminTdlMisReportingContentApi,
    tdlInvoiceContent: adminTdlInvoiceContentApi,
    tdlBusinessSpecificContent: adminTdlBusinessSpecificContentApi,
    tdlBankingContent: adminTdlBankingContentApi,
    webAppDevelopmentContent: adminWebAppDevelopmentContentApi,
    categories: adminCategoriesApi,
    products: adminProductsApi,
    services: adminServicesApi,
    cloud: adminCloudApi,
    enquiries: adminEnquiryApi,
    blogs: adminBlogsApi,
    projects: adminProjectsApi,
    technologies: adminTechnologiesApi,
    homeLogoLoop: adminHomeLogoLoopApi,
  };
}

