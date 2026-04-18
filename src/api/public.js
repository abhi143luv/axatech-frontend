import { formRequest, toCleanParams, request } from './core';
import authApi from './auth';
import { home } from './home/public';
import { categories } from './categories/public';
import { licenses } from './licenses/public';
import { tss } from './tss/public';
import { tssContent } from './tssContent/public';
import tallyOnCloudContentPublicApi from './tallyOnCloudContent/public';
import dedicatedVpsServerContentPublicApi from './dedicatedVpsServerContent/public';
import integrationExcelImportContentPublicApi from './integrationExcelImportContent/public';
import integrationThirdPartyContentPublicApi from './integrationThirdPartyContent/public';
import integrationWhatsappContentPublicApi from './integrationWhatsappContent/public';
import integrationSmsApiContentPublicApi from './integrationSmsApiContent/public';
import tallyAmcContentPublicApi from './tallyAmcContent/public';
import tallyBusinessSolutionsContentPublicApi from './tallyBusinessSolutionsContent/public';
import tdlSecurityControlContentPublicApi from './tdlSecurityControlContent/public';
import tdlProductivityContentPublicApi from './tdlProductivityContent/public';
import tdlMisReportingContentPublicApi from './tdlMisReportingContent/public';
import tdlInvoiceContentPublicApi from './tdlInvoiceContent/public';
import tdlBusinessSpecificContentPublicApi from './tdlBusinessSpecificContent/public';
import tdlBankingContentPublicApi from './tdlBankingContent/public';
import webAppDevelopmentContentPublicApi from './webAppDevelopmentContent/public';
import { products, product } from './products/public';
import { services, service } from './service/public';
import { cloud } from './cloud/public';
import { enquiry } from './enquiry/public';
import { technologies, technology } from './technologies/public';
import { homeLogoLoop } from './homeLogoLoop/public';
import { adminHeroBanners } from './adminHero/public';
import { projects, project } from './projects/public';
import { blogs, blog } from './blogs/public';
import {
  upload,
  uploadAdminHeroImage,
  uploadHomeLogoImage,
  uploadProjectImage,
  uploadTechnologyImage,
} from './upload/public';

export function createPublicApi() {
  return {
    auth: authApi,
    home,
    categories,
    product,
    service,
    cloud,
    enquiry,
    licenses,
    tss,
    tssContent,
    tallyOnCloudContent: tallyOnCloudContentPublicApi,
    dedicatedVpsServerContent: dedicatedVpsServerContentPublicApi,
    integrationExcelImportContent: integrationExcelImportContentPublicApi,
    integrationThirdPartyContent: integrationThirdPartyContentPublicApi,
    integrationWhatsappContent: integrationWhatsappContentPublicApi,
    integrationSmsApiContent: integrationSmsApiContentPublicApi,
    tallyAmcContent: tallyAmcContentPublicApi,
    tallyBusinessSolutionsContent: tallyBusinessSolutionsContentPublicApi,
    tdlSecurityControlContent: tdlSecurityControlContentPublicApi,
    tdlProductivityContent: tdlProductivityContentPublicApi,
    tdlMisReportingContent: tdlMisReportingContentPublicApi,
    tdlInvoiceContent: tdlInvoiceContentPublicApi,
    tdlBusinessSpecificContent: tdlBusinessSpecificContentPublicApi,
    tdlBankingContent: tdlBankingContentPublicApi,
    webAppDevelopmentContent: webAppDevelopmentContentPublicApi,
    products,
    services,
    technologies,
    technology,
    homeLogoLoop,
    adminHeroBanners,
    projects,
    project,
    blogs,
    blog,
    upload,
    uploadProjectImage,
    uploadTechnologyImage,
    uploadHomeLogoImage,
    uploadAdminHeroImage,
  };
}

