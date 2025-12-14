import cn from 'classnames';
import {
  cloneElement,
  memo,
  type ReactElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import type { Placement, TooltipProps } from '../../types';
import styles from '../assets/Tooltip.module.scss';

/**
 * Position coordinates for tooltip placement
 */
interface Position {
  top: number;
  left: number;
}

/**
 * Calculates the position of the tooltip relative to the trigger element
 */
const calculatePosition = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  placement: Placement,
): Position => {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const gap = 8; // Gap between trigger and tooltip

  switch (placement) {
    case 'top':
      return {
        top: triggerRect.top + scrollY - tooltipRect.height - gap,
        left: triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2,
      };
    case 'bottom':
      return {
        top: triggerRect.bottom + scrollY + gap,
        left: triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2,
      };
    case 'left':
      return {
        top: triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2,
        left: triggerRect.left + scrollX - tooltipRect.width - gap,
      };
    case 'right':
      return {
        top: triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2,
        left: triggerRect.right + scrollX + gap,
      };
    default:
      return { top: 0, left: 0 };
  }
};

/**
 * Adjusts placement if tooltip would overflow viewport
 */
const getAdjustedPlacement = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  placement: Placement,
): Placement => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const gap = 8;

  const wouldOverflow = {
    top: triggerRect.top - tooltipRect.height - gap < 0,
    bottom: triggerRect.bottom + tooltipRect.height + gap > viewportHeight,
    left: triggerRect.left - tooltipRect.width - gap < 0,
    right: triggerRect.right + tooltipRect.width + gap > viewportWidth,
  };

  // Try to find a placement that doesn't overflow
  switch (placement) {
    case 'top':
      if (wouldOverflow.top && !wouldOverflow.bottom) return 'bottom';
      break;
    case 'bottom':
      if (wouldOverflow.bottom && !wouldOverflow.top) return 'top';
      break;
    case 'left':
      if (wouldOverflow.left && !wouldOverflow.right) return 'right';
      break;
    case 'right':
      if (wouldOverflow.right && !wouldOverflow.left) return 'left';
      break;
  }

  return placement;
};

/**
 * Clamps position to keep tooltip within viewport
 */
const clampPosition = (position: Position, tooltipRect: DOMRect): Position => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const padding = 8;

  return {
    top: Math.max(
      padding + window.scrollY,
      Math.min(position.top, viewportHeight - tooltipRect.height - padding + window.scrollY),
    ),
    left: Math.max(
      padding + window.scrollX,
      Math.min(position.left, viewportWidth - tooltipRect.width - padding + window.scrollX),
    ),
  };
};

/**
 * Tooltip Component
 *
 * Displays contextual information on hover or focus. Supports multiple
 * placements with automatic collision detection.
 *
 * @example
 * ```tsx
 * <Tooltip content="Helpful information" placement="top">
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 */
const Tooltip = memo(function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 200,
  'aria-label': ariaLabel,
}: TooltipProps) {
  const tooltipId = useId();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] = useState<Placement>(placement);

  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update position when tooltip becomes visible
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    // Check for collision and adjust placement if needed
    const adjustedPlacement = getAdjustedPlacement(triggerRect, tooltipRect, placement);
    setActualPlacement(adjustedPlacement);

    // Calculate position based on adjusted placement
    const newPosition = calculatePosition(triggerRect, tooltipRect, adjustedPlacement);

    // Clamp position to viewport
    const clampedPosition = clampPosition(newPosition, tooltipRect);
    setPosition(clampedPosition);
  }, [placement]);

  // Show tooltip with delay
  const showTooltip = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [delay]);

  // Hide tooltip with short delay
  const hideTooltip = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  }, []);

  // Handle Escape key to hide tooltip
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    },
    [isVisible],
  );

  // Update position when visible
  useEffect(() => {
    if (isVisible) {
      // Use requestAnimationFrame to ensure tooltip is rendered before measuring
      requestAnimationFrame(() => {
        updatePosition();
      });
    }
  }, [isVisible, updatePosition]);

  // Add keyboard listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Memoize tooltip position styles to prevent re-renders
  const tooltipStyles = useMemo(
    () => ({
      top: position.top,
      left: position.left,
    }),
    [position.top, position.left],
  );

  // Clone child element and add event handlers
  const childElement = children as ReactElement<any>;
  const trigger = cloneElement(childElement, {
    ref: triggerRef,
    onMouseEnter: (e: React.MouseEvent) => {
      showTooltip();
      // Call original handler if exists
      const originalHandler = childElement.props?.onMouseEnter;
      if (originalHandler) originalHandler(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hideTooltip();
      const originalHandler = childElement.props?.onMouseLeave;
      if (originalHandler) originalHandler(e);
    },
    onFocus: (e: React.FocusEvent) => {
      showTooltip();
      const originalHandler = childElement.props?.onFocus;
      if (originalHandler) originalHandler(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hideTooltip();
      const originalHandler = childElement.props?.onBlur;
      if (originalHandler) originalHandler(e);
    },
    'aria-describedby': isVisible ? tooltipId : undefined,
  });

  const tooltipContent = isVisible ? (
    <div
      ref={tooltipRef}
      id={tooltipId}
      role="tooltip"
      aria-label={ariaLabel}
      className={cn(styles.tooltip, styles[`tooltip--${actualPlacement}`])}
      style={tooltipStyles}
      data-testid="tooltip"
      data-placement={actualPlacement}
    >
      {content}
    </div>
  ) : null;

  return (
    <>
      {trigger}
      {tooltipContent && createPortal(tooltipContent, document.body)}
    </>
  );
});

Tooltip.displayName = 'Tooltip';

export default Tooltip;
