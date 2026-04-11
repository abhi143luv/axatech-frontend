/**
 * Reusable section header: label (with side lines) + title + optional subtitle.
 * Same structure and classes used across Home, Services, Licenses, Blog, Projects, Technologies.
 *
 * @param {string} label - Small uppercase label (e.g. "About Us", "Pricing")
 * @param {React.ReactNode} title - Main heading content
 * @param {React.ReactNode} [subtitle] - Optional description below title
 * @param {'left'|'center'|'right'} [position='center'] - Alignment of label, title, and subtitle
 * @param {boolean} [centered] - Deprecated: use position="center" or position="left". If set, overrides position.
 * @param {'h1'|'h2'} [as='h2'] - Heading level for title
 * @param {string} [className] - Wrapper div class
 * @param {string} [labelClassName] - Label (p) class
 * @param {string} [titleClassName] - Title class
 * @param {string} [subtitleClassName] - Subtitle class
 * @param {boolean} [inverse=false] - Use white text/lines for dark or gradient backgrounds
 * @param {string} [dataAos] - Optional data-aos value for all elements
 */
export default function SectionHeader({
  label,
  title,
  subtitle,
  position: positionProp = 'center',
  centered,
  as: TitleTag = 'h2',
  className = '',
  labelClassName = '',
  titleClassName = '',
  subtitleClassName = '',
  inverse = false,
  dataAos,
}) {
  const position = centered === true ? 'center' : centered === false ? 'left' : positionProp;

  const positionClasses = {
    left: {
      label: 'inline-flex justify-start',
      text: 'text-left',
      subtitle: 'mr-auto',
    },
    center: {
      label: 'flex justify-center',
      text: 'text-center',
      subtitle: 'mx-auto text-center',
    },
    right: {
      label: 'inline-flex justify-end',
      text: 'text-right',
      subtitle: 'ml-auto text-right',
    },
  };

  const pos = positionClasses[position] || positionClasses.center;

  const labelTone = inverse ? 'text-white/90 dark:text-white/90' : 'text-secondary dark:text-accent';
  const titleTone = inverse ? 'text-white dark:text-white' : 'text-gray-900 dark:text-white';
  const subtitleTone = inverse ? 'text-white/90 dark:text-white/90' : 'text-gray-600 dark:text-gray-400';
  const lineTone = inverse ? 'bg-white/60 dark:bg-white/60' : 'bg-secondary/60 dark:bg-accent/60';

  const labelClasses = `items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase mb-4 ${labelTone} ${pos.label} ${labelClassName}`.trim();
  const titleClasses = `text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-3 ${titleTone} ${pos.text} ${titleClassName}`.trim();
  const subtitleClasses = `text-base md:text-lg max-w-2xl leading-relaxed ${subtitleTone} ${pos.subtitle} ${subtitleClassName}`.trim();

  const aosAttr = dataAos ? { 'data-aos': dataAos } : {};

  return (
    <div className={className}>
      {label != null && label !== '' && (
        <p className={labelClasses} {...aosAttr}>
          <span className={`w-8 h-px ${lineTone}`} aria-hidden />
          {label}
          <span className={`w-8 h-px ${lineTone}`} aria-hidden />
        </p>
      )}
      {title != null && title !== '' && (
        <TitleTag className={titleClasses} {...aosAttr}>
          {title}
        </TitleTag>
      )}
      {subtitle != null && subtitle !== '' && (
        <p className={subtitleClasses} {...aosAttr}>
          {subtitle}
        </p>
      )}
    </div>
  );
}