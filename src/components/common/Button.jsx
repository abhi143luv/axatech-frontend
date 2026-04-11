/**
 * Reusable button with optional loading state and variants.
 * When `to` is passed, renders as React Router Link (no need to pass as={Link} or import Link).
 * @param {React.ReactNode} [children] - Button label
 * @param {React.ElementType} [as] - Render as this component when not a link (e.g. 'a'). Omit when using `to`.
 * @param {string} [to] - React Router path; when set, button renders as Link automatically
 * @param {boolean} [fullWidth=true] - When false, do not add w-full (use with className e.g. w-[120px])
 * @param {'button'|'submit'|'reset'} [type='button'] - Button type (only when as is button)
 * @param {boolean} [disabled] - Disabled state
 * @param {boolean} [loading] - Shows loading label and disables (only when as is button)
 * @param {string} [loadingLabel] - Text when loading (default "Please wait...")
 * @param {string} [variant='primary'] - 'primary' | 'secondary' | 'outline' | 'error' | 'ghost' | 'inverse'
 * @param {'sm'|'md'|'lg'|'xl'} [size='md'] - Button size
 * @param {React.ReactNode} [icon] - Optional icon element
 * @param {'left'|'right'} [iconPosition='left'] - Icon side when icon is set
 * @param {string} [className] - Extra classes
 * @param {object} [props] - Rest passed to the element (e.g. state for Link; href for anchor)
 */
import { Link } from 'react-router-dom';

export default function Button({
  children,
  as: Component = 'button',
  to,
  fullWidth = true,
  type = 'button',
  disabled = false,
  loading = false,
  loadingLabel = 'Please wait...',
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) {
  const ResolvedComponent = Component !== 'button' ? Component : (to != null ? Link : 'button');
  const isButton = ResolvedComponent === 'button';
  // sm = Small, md = Medium, lg = Large, xl = Extra Large — fixed heights so sizes look distinct
  const sizeClass =
    size === 'sm'
      ? 'h-8 px-3 text-sm rounded-md'
      : size === 'lg'
        ? 'h-12 px-6 text-lg rounded-xl'
        : size === 'xl'
          ? 'h-14 px-8 text-xl rounded-xl'
          : 'h-10 px-5 text-base rounded-lg';
  const baseClass = `inline-flex items-center justify-center font-semibold cursor-pointer transition-colors ${sizeClass} ${
    variant === 'secondary'
      ? 'text-white bg-secondary hover:opacity-90 dark:text-white dark:bg-secondary dark:hover:opacity-90'
      : variant === 'outline'
        ? 'text-primary border-2 border-primary bg-transparent hover:bg-primary/5 dark:text-secondary dark:border-secondary dark:bg-transparent dark:hover:bg-secondary/10 dark:hover:border-secondary'
        : variant === 'error'
          ? 'text-white bg-error border-0 hover:bg-error-dark dark:bg-error dark:hover:bg-error-dark'
          : variant === 'ghost'
            ? 'bg-transparent border-0 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
            : variant === 'inverse'
              ? 'bg-white text-primary border-0 hover:bg-white/90 dark:bg-white dark:text-primary dark:hover:bg-white/90'
              : 'text-white bg-primary hover:bg-primary-hover dark:text-white dark:bg-primary dark:hover:bg-primary-hover'
  }`;
  const widthClass = isButton && fullWidth ? 'w-full ' : '';
  const fullClass = `${widthClass}${baseClass} ${isButton ? 'border-0 disabled:opacity-60 disabled:cursor-not-allowed' : ''} ${className}`.trim();

  const content =
    loading && isButton ? (
      loadingLabel
    ) : icon ? (
      <span className="inline-flex items-center gap-2">
        {iconPosition === 'right' ? (
          <>
            {children}
            {icon}
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </span>
    ) : (
      children
    );

  return (
    <ResolvedComponent
      type={isButton ? type : undefined}
      disabled={isButton ? (disabled || loading) : undefined}
      className={fullClass}
      {...(ResolvedComponent === Link ? { to, ...props } : props)}
    >
      {content}
    </ResolvedComponent>
  );
}
