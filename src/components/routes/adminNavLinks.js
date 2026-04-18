/**
 * Admin sidebar nav — single export `ADMIN_NAV` (paths + order + built `items` + sidebar UI).
 * Same shape as `PUBLIC_NAV` in publicNavLinks.js: edit `paths` and `order`; optional `children` for nested LevelItem rows.
 * Paths align with src/routes/adminRoutes.jsx.
 */
import {
  DashboardIcon,
  HomeContentIcon,
  HomeLogoLoopIcon,
  LicensesIcon,
  CategoriesIcon,
  ProductsIcon,
  ProjectsIcon,
  AppsIcon,
  ServicesIcon,
  CloudPlansIcon,
  EnquiriesIcon,
  BlogsIcon,
} from '../icons';

function childrenObjectToLevelItems(children) {
  if (!children || typeof children !== 'object') return [];
  return Object.values(children).map((node) => {
    const nested =
      node.children &&
      typeof node.children === 'object' &&
      Object.keys(node.children).length > 0;
    if (nested) {
      return {
        label: node.label,
        children: childrenObjectToLevelItems(node.children),
      };
    }
    const item = { label: node.label, to: node.path };
    if (node.navEnd) item.navEnd = true;
    if (node.Icon) item.Icon = node.Icon;
    return item;
  });
}

function buildAdminNavItems(paths, order, sidebar) {
  return order
    .map((key) => {
      const node = paths[key];
      if (!node) return null;

      const childKeys =
        node.children && typeof node.children === 'object' ? Object.keys(node.children) : [];
      if (childKeys.length > 0) {
        return {
          type: 'level',
          key,
          to: node.path,
          label: node.label,
          end: node.end,
          labelIcon: node.Icon,
          levelItems: childrenObjectToLevelItems(node.children),
          desktopMinWidth: node.levelUi?.desktopMinWidth ?? 'min-w-0',
          triggerClassName: node.levelUi?.triggerClassName ?? sidebar.levelTriggerClass,
        };
      }

      return {
        type: 'link',
        key,
        to: node.path,
        label: node.label,
        end: node.end,
        Icon: node.Icon,
      };
    })
    .filter(Boolean);
}

const sidebar = {
  // For expanded sidebar: dropdown opens just below the trigger
  levelContentClass: '!left-0 !top-full !ml-0 !mt-1',
  // Collapsed flyout is portaled with position:fixed + inline coords in LevelItem — do not add !left/!top here (they override JS and hide the menu).
  levelContentCollapsedClass: '',
  /** Horizontal align is set in AdminSidebar from `effectiveCollapsed` (`!justify-center` vs `!justify-start`). */
  levelTriggerClass:
    '!gap-2 !rounded-lg !py-2.5 !px-2 !text-[0.925rem] !font-medium !normal-case !tracking-normal !text-gray-700 dark:!text-gray-300 hover:!bg-gray-100 dark:hover:!bg-gray-700/50 !w-full',
};

const order = [
  'dashboard',
  'home',
  'homeLogoLoop',
  'adminHeroBanners',
  'licenses',
  'tss',
  'categories',
  'products',
  'projects',
  'technologies',
  'services',
  'tdl',
  'integration',
  'cloud',
  'enquiries',
  'blogs',
];

const paths = {
  dashboard: { path: '/admin', label: 'Dashboard', end: true, Icon: DashboardIcon },
  home: { path: '/admin/home', label: 'Home Content', Icon: HomeContentIcon },
  homeLogoLoop: { path: '/admin/home-logo-loop', label: 'Home Logo', Icon: HomeLogoLoopIcon },
  adminHeroBanners: {
    path: '/admin/admin-hero-banners',
    label: 'Hero banners',
    Icon: LicensesIcon,
  },
  licenses: {
    path: '/admin/licenses',
    label: 'Tally',
    Icon: LicensesIcon,
    children: {
      tallyLicenses: {
        path: '/admin/licenses',
        label: 'Tally Licenses',
        navEnd: true,
      },
      tallyAmcContent: {
        path: '/admin/tally-amc-content',
        label: 'Tally AMC Content',
        navEnd: true,
      },
      tallyBusinessSolutionsContent: {
        path: '/admin/tally-business-solutions-content',
        label: 'Tally Business Solutions Content',
        navEnd: true,
      },
    },
  },
  // TSS level with two child links
  tss: {
    path: '/admin/renew-tss',
    label: 'TSS',
    Icon: LicensesIcon,
    children: {
      renewTss: { path: '/admin/renew-tss', label: 'Renew TSS' },
      tssSingle: { path: '/admin/tss-single', label: 'TSS Single Content' },
    },
  },
  categories: { path: '/admin/categories', label: 'Categories', Icon: CategoriesIcon },
  products: { path: '/admin/products', label: 'Products', Icon: ProductsIcon },
  projects: { path: '/admin/projects', label: 'Projects', Icon: ProjectsIcon },
  technologies: { path: '/admin/technologies', label: 'Technologies', Icon: AppsIcon },
  services: {
    path: '/admin/services',
    label: 'Services',
    Icon: ServicesIcon,
    children: {
      servicesList: {
        path: '/admin/services',
        label: 'Services',
        navEnd: true,
      },
      webAppDevelopmentContent: {
        path: '/admin/web-app-development-content',
        label: 'Web App Development Content',
        navEnd: true,
      },
    },
  },
  tdl: {
    path: '/admin/tdl',
    label: 'TDL',
    Icon: ServicesIcon,
    children: {
      tdlSecurityControlContent: {
        path: '/admin/tdl-security-control-content',
        label: 'Security Control TDL Content',
        navEnd: true,
      },
      tdlProductivityContent: {
        path: '/admin/tdl-productivity-content',
        label: 'Productivity TDL Content',
        navEnd: true,
      },
      tdlMisReportingContent: {
        path: '/admin/tdl-mis-reporting-content',
        label: 'MIS Reporting TDL Content',
        navEnd: true,
      },
      tdlInvoiceContent: {
        path: '/admin/tdl-invoice-content',
        label: 'Invoice TDL Content',
        navEnd: true,
      },
      tdlBusinessSpecificContent: {
        path: '/admin/tdl-business-specific-content',
        label: 'Business-Specific TDL Content',
        navEnd: true,
      },
      tdlBankingContent: {
        path: '/admin/tdl-banking-content',
        label: 'Banking TDL Content',
        navEnd: true,
      },
    },
  },
  integration: {
    path: '/admin/integration',
    label: 'Integrations',
    Icon: ServicesIcon,
    children: {
      integrationExcelImportContent: {
        path: '/admin/integration-excel-import-content',
        label: 'Excel Import Content',
        navEnd: true,
      },
      integrationThirdPartyContent: {
        path: '/admin/integration-third-party-content',
        label: 'Third Party Content',
        navEnd: true,
      },
      integrationWhatsappContent: {
        path: '/admin/integration-whatsapp-content',
        label: 'WhatsApp Content',
        navEnd: true,
      },
      integrationSmsApiContent: {
        path: '/admin/integration-sms-api-content',
        label: 'SMS API Content',
        navEnd: true,
      },
    },
  },
  cloud: {
    path: '/admin/cloud',
    label: 'Cloud Plans',
    Icon: CloudPlansIcon,
    children: {
      plans: { path: '/admin/cloud', label: 'Cloud Plans', navEnd: true },
      tallyOnCloudContent: {
        path: '/admin/tally-on-cloud-content',
        label: 'Tally on Cloud Content',
        navEnd: true,
      },
      dedicatedVpsServerContent: {
        path: '/admin/dedicated-vps-server-content',
        label: 'Dedicated VPS Server Content',
        navEnd: true,
      },
    },
  },
  enquiries: { path: '/admin/enquiries', label: 'Enquiries', Icon: EnquiriesIcon },
  blogs: { path: '/admin/blogs', label: 'Blogs', Icon: BlogsIcon },
};

/**
 * All admin sidebar data: `ADMIN_NAV.items`, `ADMIN_NAV.sidebar.levelContentClass`, `ADMIN_NAV.paths` to read/edit tree.
 */
export const ADMIN_NAV = Object.freeze({
  paths: Object.freeze(paths),
  order: Object.freeze([...order]),
  sidebar: Object.freeze(sidebar),
  items: Object.freeze(buildAdminNavItems(paths, order, sidebar)),
});

/** @deprecated Use `ADMIN_NAV.items` */
export const ADMIN_NAV_LINKS = ADMIN_NAV.items;
