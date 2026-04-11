/**
 * Public header nav — single export `PUBLIC_NAV` (paths + order + built `items` + header UI).
 * Edit `paths` (single routes, parent `children`, nested `children`) and `order` only.
 * Paths align with src/routes/userRoutes.jsx.
 */

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
    return item;
  });
}

function buildNavItems(paths, order, header) {
  return order.map((key) => {
    const node = paths[key];
    if (!node) return null;

    if (node.useDynamicLevelItems) {
      return {
        type: 'level',
        key,
        to: node.path,
        label: node.label,
        end: node.end,
        levelItems: [],
        desktopMinWidth: node.levelUi?.desktopMinWidth ?? 'min-w-[100px]',
        triggerClassName: node.levelUi?.triggerClassName ?? header.levelTriggerClass,
      };
    }

    const childKeys = node.children && typeof node.children === 'object'
      ? Object.keys(node.children)
      : [];
    if (childKeys.length > 0) {
      return {
        type: 'level',
        key,
        to: node.path,
        label: node.label,
        end: node.end,
        levelItems: childrenObjectToLevelItems(node.children),
        desktopMinWidth: node.levelUi?.desktopMinWidth ?? 'min-w-[100px]',
        triggerClassName: node.levelUi?.triggerClassName ?? header.levelTriggerClass,
      };
    }

    if (node.navKind === 'dropdown') {
      return {
        type: 'dropdown',
        key,
        to: node.path,
        label: node.label,
        end: node.end,
      };
    }

    return {
      type: 'link',
      key,
      to: node.path,
      label: node.label,
      end: node.end,
    };
  }).filter(Boolean);
}

const header = {
  /** Anchored under trigger (same containing block as Technologies mega-menu). */
  levelContentClass:
    '!absolute !left-0 !top-full !z-50 !ml-0 !mt-1 w-max min-w-[min(100%,12rem)] max-w-[min(100vw-1.5rem,24rem)] rounded-xl border border-slate-200 bg-slate-100 p-2 shadow-lg backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800',
  levelTriggerClass:
    '!justify-between !gap-2 !px-3 !py-2.5 !text-[0.9375rem] !font-medium !normal-case !tracking-normal !text-gray-700 dark:!text-gray-300 hover:!text-primary dark:hover:!text-secondary hover:!bg-primary/5 dark:hover:!bg-secondary/15',
  get levelTriggerClassTally() {
    return `!capitalize ${this.levelTriggerClass}`;
  },
};

const order = [
  'home',
  'services',
  'tally',
  'tdlShop',
  'technologies',
  'resources',
];

const paths = {
  home: { path: '/', label: 'Home', end: true },

  services: { path: '/services', label: 'Services' },

  tally: {
    path: '/licenses',
    label: 'Tally',
    levelUi: {
      desktopMinWidth: 'min-w-[70px]',
      get triggerClassName() {
        return header.levelTriggerClassTally;
      },
    },
    children: {
      licenses: { path: '/licenses', label: 'Tally Licenses', navEnd: true },
      tss: { path: '/tss-renew', label: 'TSS Renewal', navEnd: true },
      cloud: {
        label: 'Tally on Cloud',
        children: {
          hosting: { path: '/cloud-hosting', label: 'Cloud Hosting' },
          tallyCloud: { path: '/tally-on-cloud', label: 'Tally on Cloud' },
          vps: { path: '/dedicated-vps-server', label: 'Dedicated VPS Server' },
        },
      },
      integration: {
        label: 'Tally Integration',
        children: {
          excel: { path: '/integration-excel-import', label: 'Excel Import' },
          thirdParty: { path: '/integration-third-party', label: 'Third-Party Integration' },
          whatsapp: { path: '/integration-whatsapp', label: 'Tally to WhatsApp' },
          sms: { path: '/integration-sms-api', label: 'SMS API Integration' },
        },
      },
      amc: { path: '/tally-amc', label: 'Tally AMC' },
      businessSolutions: { path: '/tally-business-solutions', label: 'Tally Business Solutions' },
    },
  },

  tdlShop: {
    path: '/products',
    label: 'TDL Shop',
    levelUi: {
      desktopMinWidth: 'min-w-[100px]',
      triggerClassName: header.levelTriggerClass,
    },
    children: {
      all: { path: '/products', label: 'All TDL Products', navEnd: true },
      security: { path: '/products/tdl-security-control', label: 'Security Control TDL' },
      productivity: { path: '/products/tdl-productivity', label: 'Productivity TDL' },
      mis: { path: '/products/tdl-mis-reporting', label: 'MIS Reporting TDL' },
      invoice: { path: '/products/tdl-invoice', label: 'Invoice TDL' },
      businessSpecific: { path: '/products/tdl-business-specific', label: 'Business-Specific TDL' },
      banking: { path: '/products/tdl-banking', label: 'Banking TDL' },
    },
  },

  technologies: {
    path: '/technologies',
    label: 'Technologies',
    navKind: 'dropdown',
  },

  resources: {
    path: '/web-app-development',
    label: 'Resources',
    levelUi: {
      desktopMinWidth: 'min-w-[100px]',
      triggerClassName: header.levelTriggerClass,
    },
    children: {
      webApps: { path: '/web-app-development', label: 'Web Apps', navEnd: true },
      blogs: { path: '/blog', label: 'Blogs' },
      projects: { path: '/projects', label: 'Projects' },
    },
  },
};

/**
 * All public nav data for this site. Header: `PUBLIC_NAV.items`, `PUBLIC_NAV.header.levelContentClass`, `PUBLIC_NAV.paths` to read/edit tree.
 */
export const PUBLIC_NAV = Object.freeze({
  paths: Object.freeze(paths),
  order: Object.freeze([...order]),
  header: Object.freeze(header),
  items: Object.freeze(buildNavItems(paths, order, header)),
});

/**
 * @param {Array} items LevelItem-style tree (optional children)
 * @param {() => void} closeMenu
 */
export function withCloseMenu(items, closeMenu) {
  if (!items?.length) return items;
  return items.map((item) => {
    const next = { ...item };
    if (Array.isArray(item.children) && item.children.length > 0) {
      next.children = withCloseMenu(item.children, closeMenu);
    } else if (item.to != null || item.href != null) {
      next.onClick = closeMenu;
    }
    return next;
  });
}
