import { ChevronDownIcon } from '../icons';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';

/** Vertical spine per <ul>: only between direct sibling rows (not nested subtrees). */
function measureLevelTreeGuides(rootEl) {
  if (!rootEl) return;
  const uls = rootEl.querySelectorAll('ul.level-tree-ul');
  uls.forEach((ul) => {
    const heads = [];
    for (const li of ul.children) {
      if (li.tagName !== 'LI') continue;
      const head = li.querySelector(':scope > .level-tree-node-head');
      if (head) heads.push(head);
    }
    if (heads.length === 0) {
      ul.style.setProperty('--tree-guide-top', '0px');
      ul.style.setProperty('--tree-guide-height', '0px');
      return;
    }
    if (heads.length === 1) {
      ul.style.setProperty('--tree-guide-top', '0px');
      ul.style.setProperty('--tree-guide-height', '22px');
      return;
    }
    const ulRect = ul.getBoundingClientRect();
    const first = heads[0].getBoundingClientRect();
    const last = heads[heads.length - 1].getBoundingClientRect();
    const topPx = first.top - ulRect.top + first.height * 0.5;
    const bottomPx = last.top - ulRect.top + last.height * 0.5;
    const minusPx = -10;
    const heightPx = Math.max(0, bottomPx + minusPx);
    ul.style.setProperty('--tree-guide-top', `${topPx}px`);
    ul.style.setProperty('--tree-guide-height', `${heightPx}px`);
  });
}

/** Submenu <ul> paths that are open in expanded vertical mode (for fixed + portal placement). */
function collectOpenExpandedFlyoutPaths(list, openNodesMap, pathPrefix = 'root') {
  const paths = [];
  if (!Array.isArray(list) || list.length === 0) return paths;
  list.forEach((item, index) => {
    const nodePath = `${pathPrefix}-${index}`;
    if (Array.isArray(item.children) && item.children.length > 0 && openNodesMap[nodePath]) {
      paths.push(nodePath);
      paths.push(...collectOpenExpandedFlyoutPaths(item.children, openNodesMap, nodePath));
    }
  });
  return paths;
}

const SIDEBAR_BG_IMAGE =
  'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfNDQ2NF81NTMzOCkiIGZpbGwtb3BhY2l0eT0iMC4xIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfNDQ2NF81NTMzOCIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMjAgMS44MTgxMmUtMDUpIHJvdGF0ZSgtNDUpIHNjYWxlKDEyMy4yNSkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBCOEQ5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwQjhEOSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfNDQ2NF81NTMzNykiIGZpbGwtb3BhY2l0eT0iMC4xIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfNDQ2NF81NTMzNyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEyMCkgcm90YXRlKDEzNSkgc2NhbGUoMTIzLjI1KSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjU2MzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1NjMwIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)';

const sidebarBgStyle = {
  backgroundImage: SIDEBAR_BG_IMAGE,
  backgroundSize: '50%, 50%',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right top, left bottom',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: '40px 40px 80px -8px rgba(0,0,0,0.24)',
};
const LEVEL_TREE_STYLES = `
  .level-tree-wrapper {
    position: relative;
    align-self: flex-start;
    width: 100%;
    max-width: 100%;
  }

  /* Admin / mobile vertical tree only — do not style horizontal header flyouts */
  .level-tree-vertical ul.level-tree-ul {
    position: relative;
    padding-left: 2rem;
    width: 100%;
    box-sizing: border-box;
    height: fit-content;
    min-height: 0;
  }

  .level-tree-vertical ul.level-tree-ul::before {
    content: "";
    position: absolute;
    left: 14px;
    width: 2px;
    top: 0px;
    height: var(--tree-guide-height, 0px);
    bottom: auto;
    background-color: #CBCBCB;
  }

  .dark .level-tree-vertical ul.level-tree-ul::before,
  [data-theme="dark"] .level-tree-vertical ul.level-tree-ul::before {
    background-color: #282F37;
  }

  .level-tree-vertical li {
    position: relative;
  }

  .level-tree-vertical li::before {
    content: "";
    position: absolute;
    top: 0;
    left: -2px;
    width: 15px;
    height: 15px;
    background-color: #CBCBCB;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' viewBox='0 0 14 14'%3E%3Cpath d='M1 1v4a8 8 0 0 0 8 8h4' stroke='%23efefef' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") 50% 50% / 100% no-repeat;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' viewBox='0 0 14 14'%3E%3Cpath d='M1 1v4a8 8 0 0 0 8 8h4' stroke='%23efefef' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") 50% 50% / 100% no-repeat;
    transform: translate(calc(16px * -1), 8px);
  }

  .dark .level-tree-vertical li::before,
  [data-theme="dark"] .level-tree-vertical li::before {
    background-color: #282F37;
  }
`;

export default function LevelItem({
  id,
  label,
  labelIcon: LabelIcon,
  labelText,
  isOpen,
  defaultOpen = false,
  onToggle,
  children,
  items,
  className = '',
  triggerClassName = '',
  contentClassName = '',
  floating = false,
  collapsed = false,
  vertical = false,
  /** Desktop header: open panel on hover (matches public site); still allows click to toggle when hover is awkward. */
  openOnHover = false,
  /** Vertical nav in drawer/mobile: keep nested <ul> in the scroll area with tree guides (no body portal). Admin sidebar uses portal when false. */
  inFlowNestedVertical = false,
}) {
  const { pathname } = useLocation();

  const normalizePath = (path) => {
    if (!path || typeof path !== 'string') return '';
    const noQuery = path.split('?')[0].split('#')[0];
    return noQuery.replace(/\/+$/, '') || '/';
  };

  const isPathActive = (to, end = false) => {
    const target = normalizePath(to);
    const current = normalizePath(pathname);
    if (!target) return false;
    if (end) return current === target;
    return current === target || current.startsWith(`${target}/`);
  };

  const hasActiveDescendant = (list = []) => {
    for (const item of list) {
      if (item?.to && isPathActive(item.to, item.navEnd === true)) return true;
      if (Array.isArray(item?.children) && hasActiveDescendant(item.children)) return true;
    }
    return false;
  };

  const topHasActiveDescendant = useMemo(
    () => hasActiveDescendant(items || []),
    [items, pathname]
  );

  /** One top-level link with no subtree: no chevron/panel — navigate directly. */
  const singleRootLeaf = useMemo(() => {
    const list = items;
    if (!Array.isArray(list) || list.length !== 1) return null;
    const only = list[0];
    if (only == null || only.content != null) return null;
    if (Array.isArray(only.children) && only.children.length > 0) return null;
    if (only.to != null && only.to !== '') return only;
    if (only.href != null && only.href !== '') return only;
    return null;
  }, [items]);

  const getInitialOpenNodes = (list = [], path = 'root', shouldOpen = false) => {
    const map = {};
    list.forEach((item, index) => {
      const nodePath = `${path}-${index}`;
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;
      if (!hasChildren) return;
      map[nodePath] = shouldOpen;
      Object.assign(map, getInitialOpenNodes(item.children, nodePath, shouldOpen));
    });
    return map;
  };

  const initialNodes = useMemo(
    () => getInitialOpenNodes(items || [], 'root', !!defaultOpen),
    [items, defaultOpen]
  );

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [openNodes, setOpenNodes] = useState(initialNodes);
  const [hoverOpen, setHoverOpen] = useState(false);
  const [hoverPath, setHoverPath] = useState('');
  const [menuPlacement, setMenuPlacement] = useState({});
  /** Fixed viewport positions for expanded (non-collapsed) flyout <ul>s so they are not clipped by scrolling <nav>. */
  const [expandedFlyoutStyle, setExpandedFlyoutStyle] = useState({});
  const [navScrollRev, setNavScrollRev] = useState(0);
  const isControlled = typeof isOpen === 'boolean';
  const open = isControlled ? isOpen : internalOpen;
  const panelOpen = collapsed ? hoverOpen : openOnHover ? hoverOpen : open;
  /** Collapsed rail or desktop header: subtree open state follows hover trail (flyouts to the side). */
  const useHoverTree = collapsed || (openOnHover && !vertical && !collapsed);
  const resolvedLabel = LabelIcon || labelText ? (
    <span className={`inline-flex items-center ${collapsed ? 'flex-col gap-1' : 'gap-2'}`}>
      {LabelIcon ? <LabelIcon className="text-[1.1rem] shrink-0" /> : null}
      <span className={collapsed ? 'text-[10px] leading-none' : ''}>{labelText ?? label}</span>
    </span>
  ) : (
    label
  );

  useEffect(() => {
    setOpenNodes(initialNodes);
  }, [initialNodes]);

  const handleToggle = () => {
    if (!isControlled) {
      setInternalOpen((prev) => !prev);
    }
    onToggle?.();
  };

  const toggleNode = (path) => {
    setOpenNodes((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const treeWrapperRef = useRef(null);
  const rootTriggerRef = useRef(null);
  const menuRefs = useRef({});
  const parentTriggerRefs = useRef({});
  const closeDelayTimeoutRef = useRef(null);

  const holdHoverOpen = useCallback(() => {
    if (closeDelayTimeoutRef.current) {
      clearTimeout(closeDelayTimeoutRef.current);
      closeDelayTimeoutRef.current = null;
    }
    setHoverOpen(true);
  }, []);

  const releaseHoverOpen = useCallback(() => {
    if (closeDelayTimeoutRef.current) clearTimeout(closeDelayTimeoutRef.current);
    const delayMs = openOnHover ? 200 : 100;
    closeDelayTimeoutRef.current = setTimeout(() => {
      setHoverOpen(false);
      setHoverPath('');
      closeDelayTimeoutRef.current = null;
    }, delayMs);
  }, [openOnHover]);

  const updateTreeGuides = useCallback(() => {
    requestAnimationFrame(() => measureLevelTreeGuides(treeWrapperRef.current));
  }, []);

  useLayoutEffect(() => {
    if (collapsed) return;
    if (!open) return;
    updateTreeGuides();
    const el = treeWrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => updateTreeGuides());
    ro.observe(el);
    window.addEventListener('resize', updateTreeGuides);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateTreeGuides);
    };
  }, [open, openNodes, items, updateTreeGuides]);

  useLayoutEffect(() => {
    if (!collapsed || !panelOpen) return;

    const visiblePaths = ['root'];
    if (hoverPath) {
      const parts = hoverPath.split('-');
      for (let i = 2; i <= parts.length; i += 1) {
        visiblePaths.push(parts.slice(0, i).join('-'));
      }
    }

    const nextPlacement = {};
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const pad = 12;
    const gap = 8;

    for (const path of visiblePaths) {
      const menuEl = menuRefs.current[path];
      const triggerEl = path === 'root' ? rootTriggerRef.current : parentTriggerRefs.current[path];
      if (!menuEl || !triggerEl) continue;

      const menuRect = menuEl.getBoundingClientRect();
      const triggerRect = triggerEl.getBoundingClientRect();

      let top = triggerRect.top;
      if (triggerRect.top + menuRect.height > viewportHeight - pad) {
        top = Math.max(pad, viewportHeight - pad - menuRect.height);
      }
      let left = triggerRect.right + gap;
      if (left + menuRect.width > viewportWidth - pad) {
        const leftPreferred = triggerRect.left - gap - menuRect.width;
        if (leftPreferred >= pad) {
          left = leftPreferred;
        } else {
          left = Math.max(pad, viewportWidth - pad - menuRect.width);
        }
      }

      nextPlacement[path] = {
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        right: 'auto',
        bottom: 'auto',
        maxHeight: `${viewportHeight - 24}px`,
        overflowY: 'auto',
        zIndex: 200,
      };
    }

    setMenuPlacement(nextPlacement);
  }, [collapsed, panelOpen, hoverPath, navScrollRev]);

  useLayoutEffect(() => {
    if (collapsed || !vertical || !open || !panelOpen || inFlowNestedVertical) {
      setExpandedFlyoutStyle({});
      return;
    }

    const paths = collectOpenExpandedFlyoutPaths(items || [], openNodes);
    const next = {};
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const pad = 12;
    const gap = 8;

    for (const path of paths) {
      const menuEl = menuRefs.current[path];
      const triggerEl = parentTriggerRefs.current[path];
      if (!menuEl || !triggerEl) continue;

      const menuRect = menuEl.getBoundingClientRect();
      const triggerRect = triggerEl.getBoundingClientRect();

      let top = triggerRect.top;
      if (triggerRect.top + menuRect.height > viewportHeight - pad) {
        top = Math.max(pad, viewportHeight - pad - menuRect.height);
      }
      let left = triggerRect.right + gap;
      if (left + menuRect.width > viewportWidth - pad) {
        const leftPreferred = triggerRect.left - gap - menuRect.width;
        if (leftPreferred >= pad) {
          left = leftPreferred;
        } else {
          left = Math.max(pad, viewportWidth - pad - menuRect.width);
        }
      }

      next[path] = {
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        right: 'auto',
        bottom: 'auto',
        maxHeight: `${viewportHeight - 24}px`,
        overflowY: 'auto',
        zIndex: 200,
      };
    }

    setExpandedFlyoutStyle(next);
  }, [collapsed, vertical, open, panelOpen, openNodes, items, navScrollRev, inFlowNestedVertical]);

  useEffect(() => {
    if (!panelOpen) return;
    const scrollRoot = rootTriggerRef.current?.closest('[data-admin-nav-scroll]');
    const bump = () => setNavScrollRev((n) => n + 1);
    scrollRoot?.addEventListener('scroll', bump, { passive: true });
    window.addEventListener('resize', bump);
    return () => {
      scrollRoot?.removeEventListener('scroll', bump);
      window.removeEventListener('resize', bump);
    };
  }, [panelOpen]);

  useEffect(() => {
    return () => {
      if (closeDelayTimeoutRef.current) {
        clearTimeout(closeDelayTimeoutRef.current);
      }
    };
  }, []);

  const rowClass = `cursor-pointer mt-1 flex w-full items-center rounded-lg text-left font-medium text-slate-700 transition-colors duration-200 hover:bg-gray-300 dark:text-gray-200 dark:hover:bg-gray-600/50 ${
    collapsed ? 'justify-center gap-1 px-1 py-2 text-[10px]' : 'justify-between px-3 py-3 text-sm'
  }`;
  const nestedRowClass = collapsed
    ? 'cursor-pointer flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700/50'
    : rowClass;

  /** Match mobile sidebar NavLink in Header.jsx (active when URL matches). */
  const navLeafClassName = ({ isActive }, item) =>
    [
      collapsed
        ? 'flex w-full items-center rounded-md px-3 py-2 text-sm font-medium no-underline transition-all duration-200'
        : 'mt-1 flex w-full items-center rounded-lg py-2.5 px-3 text-[0.925rem] font-medium no-underline transition-all duration-200',
      item.image || item.Icon ? 'gap-2.5' : '',
      isActive
        ? 'bg-gray-200 text-secondary dark:bg-secondary/10 dark:text-secondary'
        : 'text-gray-700  dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600/50 hover:text-primary dark:hover:text-secondary',
    ]
      .filter(Boolean)
      .join(' ');

  const leafRowClass = (item) =>
    `${
      collapsed
        ? 'flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700/50'
        : rowClass
    } no-underline ${item.image || item.Icon ? 'justify-start gap-2.5' : ''}`.trim();

  const renderLeafInner = (item) => {
    const labelWrap = collapsed ? 'min-w-0 flex-1 whitespace-normal wrap-break-word' : 'min-w-0 flex-1 truncate';
    if (item.Icon) {
      const LeafIcon = item.Icon;
      return (
        <>
          <LeafIcon className="nav-icon text-[1.35rem] shrink-0" />
          <span className={labelWrap}>{item.label}</span>
        </>
      );
    }
    if (item.image) {
      return (
        <>
          <img src={item.image} alt="" className="h-7 w-7 shrink-0 object-contain rounded" />
          <span className={labelWrap}>{item.label}</span>
        </>
      );
    }
    return item.label;
  };

  const renderItems = (list = [], path = 'root', depth = 0) => {
    const listContent = list.map((item, index) => {
        const nodePath = `${path}-${index}`;
        const hasChildren = Array.isArray(item.children) && item.children.length > 0;
        const soleChild =
          hasChildren && item.children.length === 1 ? item.children[0] : null;
        const soleChildIsNavLeaf =
          soleChild &&
          soleChild.content == null &&
          !(Array.isArray(soleChild.children) && soleChild.children.length > 0) &&
          ((soleChild.to != null && soleChild.to !== '') ||
            (soleChild.href != null && soleChild.href !== ''));
        const nodeOpen = useHoverTree
          ? hoverPath === nodePath || hoverPath.startsWith(`${nodePath}-`)
          : !!openNodes[nodePath];
        const nodeHasActiveDescendant = hasChildren ? hasActiveDescendant(item.children) : false;
        const needsHorizontalFlyoutLi = !vertical && !collapsed && hasChildren && !soleChildIsNavLeaf;
        const sideChevron = collapsed || needsHorizontalFlyoutLi;

        return (
          <li
            key={nodePath}
            className={needsHorizontalFlyoutLi ? 'relative' : undefined}
            onMouseEnter={
              useHoverTree
                ? () => {
                    if (hasChildren && !soleChildIsNavLeaf) {
                      setHoverPath(nodePath);
                    } else if (path === 'root') {
                      setHoverPath('');
                    } else {
                      setHoverPath(path);
                    }
                  }
                : undefined
            }
          >
            {soleChildIsNavLeaf ? (
              <div className="level-tree-node-head w-full min-w-0">
                {soleChild.to != null && soleChild.to !== '' ? (
                  <NavLink
                    to={soleChild.to}
                    end={soleChild.navEnd === true}
                    onClick={soleChild.onClick}
                    className={(state) => navLeafClassName(state, soleChild)}
                  >
                    {renderLeafInner(soleChild)}
                  </NavLink>
                ) : (
                  <a
                    href={soleChild.href}
                    className={`block ${leafRowClass(soleChild)}`}
                    onClick={soleChild.onClick}
                    target={soleChild.external ? '_blank' : undefined}
                    rel={soleChild.external ? 'noopener noreferrer' : undefined}
                  >
                    {renderLeafInner(soleChild)}
                  </a>
                )}
              </div>
            ) : hasChildren ? (
              <>
                <div className="level-tree-node-head">
                  <button
                    ref={(el) => {
                      if (hasChildren && !soleChildIsNavLeaf) {
                        if (el) parentTriggerRefs.current[nodePath] = el;
                        else delete parentTriggerRefs.current[nodePath];
                      }
                    }}
                    type="button"
                    onClick={() => {
                      if (collapsed) {
                        setHoverPath(nodePath);
                        return;
                      }
                      if (openOnHover && !vertical) {
                        if (hasChildren && !soleChildIsNavLeaf) setHoverPath(nodePath);
                        return;
                      }
                      toggleNode(nodePath);
                    }}
                    aria-expanded={nodeOpen}
                    aria-controls={`${id}-${nodePath}-content`}
                    id={`${id}-${nodePath}-trigger`}
                    className={`${nestedRowClass} ${
                      // nodeHasActiveDescendant
                      //   ? 'bg-info-lighter text-info-dark dark:bg-info/20 dark:text-info-light'
                      //   : 
                      nodeHasActiveDescendant
                        ? 'bg-gray-200 text-secondary! dark:bg-info/20 dark:text-info-light'
                        : 
                        nodeOpen
                          ? 'bg-gray-200 dark:bg-gray-700/50'
                          : ''
                    }`.trim()}
                  >
                    {collapsed ? (
                      <span className="min-w-0 flex-1 whitespace-normal wrap-break-word text-left">
                        {item.label}
                      </span>
                    ) : (
                      item.label
                    )}
                    <ChevronDownIcon
                      className={`shrink-0 text-base transition-transform duration-200 ${
                        sideChevron ? '-rotate-90' : nodeOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden
                    />
                  </button>
                </div>
                {nodeOpen &&
                  (collapsed ? (
                    <div
                      id={`${id}-${nodePath}-content`}
                      role="region"
                      aria-labelledby={`${id}-${nodePath}-trigger`}
                      className="relative"
                    >
                      {renderItems(item.children, nodePath, depth + 1)}
                    </div>
                  ) : vertical && inFlowNestedVertical ? (
                    <div
                      id={`${id}-${nodePath}-content`}
                      role="region"
                      aria-labelledby={`${id}-${nodePath}-trigger`}
                      className="relative min-w-0"
                    >
                      {renderItems(item.children, nodePath, depth + 1)}
                    </div>
                  ) : vertical ? (
                    renderItems(item.children, nodePath, depth + 1)
                  ) : (
                    <div
                      id={`${id}-${nodePath}-content`}
                      role="region"
                      aria-labelledby={`${id}-${nodePath}-trigger`}
                      className="absolute left-full top-0 ml-3 mt-0 min-w-[12rem] w-max max-w-[calc(100vw-2rem)] space-y-1 rounded-xl border border-slate-200 bg-slate-100 p-2 dark:border-gray-600 dark:bg-gray-800"
                      style={{ ...sidebarBgStyle, zIndex: 50 + depth * 6 }}
                    >
                      {renderItems(item.children, nodePath, depth + 1)}
                    </div>
                  ))}
              </>
            ) : (
              <div className="level-tree-node-head w-full min-w-0">
                {item.content != null ? (
                  item.content
                ) : item.to != null && item.to !== '' ? (
                  <NavLink
                    to={item.to}
                    end={item.navEnd === true}
                    onClick={item.onClick}
                    className={(state) => navLeafClassName(state, item)}
                  >
                    {renderLeafInner(item)}
                  </NavLink>
                ) : item.href != null && item.href !== '' ? (
                  <a
                    href={item.href}
                    className={`block ${leafRowClass(item)}`}
                    onClick={item.onClick}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                  >
                    {renderLeafInner(item)}
                  </a>
                ) : (
                  <span className={`block ${leafRowClass(item)}`}>{renderLeafInner(item)}</span>
                )}
              </div>
            )}
          </li>
        );
      });

    const collapsedNestedPortal = collapsed && depth > 0 && typeof document !== 'undefined';

    if (collapsedNestedPortal) {
      return createPortal(
        <ul
          ref={(el) => {
            if (el) menuRefs.current[path] = el;
            else delete menuRefs.current[path];
          }}
          id={`${id}-${path}-flyout`}
          style={{
            ...sidebarBgStyle,
            ...(menuPlacement[path] || {}),
          }}
          className="level-tree-ul list-none w-max min-w-[min(100%,16rem)] max-w-[calc(100vw-24px)] space-y-1 rounded-xl border border-slate-200 bg-slate-100 p-2 shadow-lg backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {listContent}
        </ul>,
        document.body
      );
    }

    const expandedFlyoutToBody =
      !collapsed &&
      vertical &&
      depth > 0 &&
      !inFlowNestedVertical &&
      typeof document !== 'undefined';

    if (expandedFlyoutToBody) {
      return createPortal(
        <ul
          ref={(el) => {
            if (el) menuRefs.current[path] = el;
            else delete menuRefs.current[path];
          }}
          id={`${id}-${path}-flyout`}
          style={expandedFlyoutStyle[path]}
          className="level-tree-ul list-none w-max min-w-[min(100%,16rem)] max-w-[calc(100vw-24px)] space-y-1 rounded-xl border border-slate-200 bg-slate-100 p-2 shadow-lg dark:border-gray-600 dark:bg-gray-800 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {listContent}
        </ul>,
        document.body
      );
    }

    return (
      <ul
        ref={(el) => {
          if (el) menuRefs.current[path] = el;
          else delete menuRefs.current[path];
        }}
        style={
          collapsed
            ? {
                ...sidebarBgStyle,
                ...(path !== 'root' ? menuPlacement[path] || {} : {}),
              }
            : undefined
        }
        className={
          collapsed
            ? 'list-none w-max min-w-[min(100%,16rem)] max-w-[calc(100vw-24px)] space-y-1 rounded-xl border border-slate-200 bg-slate-100 p-2 shadow-lg backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800 relative z-70'
            : `level-tree-ul list-none pl-0 ${vertical ? '' : '[&_ul]:list-none'}`.trim()
        }
      >
        {listContent}
      </ul>
    );
  };

  const rootLinkBaseClass =
    'cursor-pointer flex w-full items-center justify-start rounded-lg text-left font-semibold capitalize text-[0.8375rem] text-gray-500 no-underline transition-colors duration-200 dark:text-gray-200 hover:bg-gray-200 hover:dark:bg-gray-700/50';

  if (singleRootLeaf) {
    const leafActive =
      singleRootLeaf.to != null &&
      isPathActive(singleRootLeaf.to, singleRootLeaf.navEnd === true);
    const activeCls = 'bg-info-lighter text-info-dark dark:bg-info/20 dark:text-info-light';
    const layoutClass = collapsed
      ? 'relative justify-start gap-1 px-1 py-2 text-[10px] normal-case tracking-normal'
      : 'justify-start gap-2 px-3 py-2.5 text-[0.7rem]';

    return (
      <div className={className}>
        {singleRootLeaf.to != null && singleRootLeaf.to !== '' ? (
          <NavLink
            to={singleRootLeaf.to}
            end={singleRootLeaf.navEnd === true}
            onClick={singleRootLeaf.onClick}
            className={({ isActive }) =>
              `${rootLinkBaseClass} ${layoutClass} ${isActive || leafActive ? activeCls : ''} ${triggerClassName}`.trim()
            }
          >
            {resolvedLabel}
          </NavLink>
        ) : (
          <a
            href={singleRootLeaf.href}
            className={`${rootLinkBaseClass} ${layoutClass} ${triggerClassName}`.trim()}
            onClick={singleRootLeaf.onClick}
            target={singleRootLeaf.external ? '_blank' : undefined}
            rel={singleRootLeaf.external ? 'noopener noreferrer' : undefined}
          >
            {resolvedLabel}
          </a>
        )}
      </div>
    );
  }

  const collapsedFlyoutPortal =
    collapsed &&
    panelOpen &&
    typeof document !== 'undefined' &&
    createPortal(
      <div
        style={menuPlacement.root}
        onMouseEnter={holdHoverOpen}
        onMouseLeave={releaseHoverOpen}
        className="z-200 w-max min-w-0 max-w-[calc(100vw-24px)] overflow-x-visible overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          ref={treeWrapperRef}
          className="level-tree-wrapper-collapsed h-fit min-h-0 w-max max-w-full self-start"
        >
          {items ? renderItems(items, 'root', 0) : children}
        </div>
      </div>,
      document.body
    );

  const rootHoverHandlers =
    collapsed || openOnHover
      ? { onMouseEnter: holdHoverOpen, onMouseLeave: releaseHoverOpen }
      : {};

  const handleRootClick = () => {
    if (collapsed) return;
    if (openOnHover) {
      if (!isControlled) setHoverOpen((p) => !p);
      return;
    }
    handleToggle();
  };

  return (
    <div className={className} {...rootHoverHandlers}>
      <button
        ref={rootTriggerRef}
        type="button"
        onClick={collapsed ? undefined : handleRootClick}
        aria-expanded={panelOpen}
        aria-controls={`${id}-content`}
        id={`${id}-trigger`}
        className={`cursor-pointer flex w-full items-center rounded-lg text-left font-semibold capitalize text-[0.8375rem] text-gray-500 transition-colors duration-200 dark:text-gray-200 hover:bg-gray-200 hover:dark:bg-gray-700/50 ${
          collapsed
            ? 'relative justify-center gap-1 px-1 py-2 text-[10px] normal-case tracking-normal'
            : 'justify-between gap-2 px-3 py-2.5 text-[0.7rem]'
        } ${
          topHasActiveDescendant
            ? 'bg-info-lighter text-info-dark dark:bg-info/20 dark:text-info-light'
            : panelOpen
              ? 'bg-gray-200 dark:bg-gray-700/50'
              : ''
        } ${triggerClassName}`.trim()}
      >
        {resolvedLabel}
        <ChevronDownIcon
          className={`shrink-0 transition-transform duration-200 ${
            collapsed
              ? `absolute right-1 top-1/2 -translate-y-1/2 text-sm ${panelOpen ? 'rotate-180' : ''}`
              : `text-base ${panelOpen ? 'rotate-180' : ''}`
          }`}
          aria-hidden
        />
      </button>
      {collapsed ? (
        <>
          <div
            id={`${id}-content`}
            role="region"
            aria-labelledby={`${id}-trigger`}
            className={
              panelOpen
                ? 'pointer-events-none h-0 w-0 overflow-hidden p-0'
                : 'invisible h-0 w-0 overflow-hidden p-0'
            }
          />
          {collapsedFlyoutPortal}
        </>
      ) : (
        <div
          id={`${id}-content`}
          role="region"
          aria-labelledby={`${id}-trigger`}
          onMouseEnter={openOnHover ? holdHoverOpen : undefined}
          onMouseLeave={openOnHover ? releaseHoverOpen : undefined}
          style={!vertical ? { ...sidebarBgStyle } : undefined}
          className={`${
            panelOpen ? 'overflow-visible' : 'overflow-hidden'
          } transition-[height] duration-200 ease-out ${
            vertical
              ? '[&_ul]:space-y-1 [&_ul]:pl-4 [&_ul]:pt-2 [&_ul]:text-sm [&_ul]:text-slate-700 dark:[&_ul]:text-gray-200 [&_li]:leading-6'
              : ''
          } ${panelOpen ? 'visible' : 'invisible h-0'} ${contentClassName}`.trim()}
        >
          {panelOpen && (
            <>
              {vertical && <style>{LEVEL_TREE_STYLES}</style>}
              <div
                ref={treeWrapperRef}
                className={`level-tree-wrapper h-fit min-h-0 w-full max-w-full self-start ${vertical ? 'level-tree-vertical' : ''}`.trim()}
              >
                {items ? renderItems(items, 'root', 0) : children}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
