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
import type { Placement, PopoverProps } from '../../types';
import styles from '../assets/Popover.module.scss';

/**
 * Position coordinates for popover placement
 */
interface Position {
  top: number;
  left: number;
}

/**
 * Calculates the position of the popover relative to the trigger element
 */
const calculatePosition = (
  triggerRect: DOMRect,
  popoverRect: DOMRect,
  placement: Placement,
): Position => {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const gap = 8;

  switch (placement) {
    case 'top':
      return {
        top: triggerRect.top + scrollY - popoverRect.height - gap,
        left: triggerRect.left + scrollX + (triggerRect.width - popoverRect.width) / 2,
      };
    case 'bottom':
      return {
        top: triggerRect.bottom + scrollY + gap,
        left: triggerRect.left + scrollX + (triggerRect.width - popoverRect.width) / 2,
      };
    case 'left':
      return {
        top: triggerRect.top + scrollY + (triggerRect.height - popoverRect.height) / 2,
        left: triggerRect.left + scrollX - popoverRect.width - gap,
      };
    case 'right':
      return {
        top: triggerRect.top + scrollY + (triggerRect.height - popoverRect.height) / 2,
        left: triggerRect.right + scrollX + gap,
      };
    default:
      return { top: 0, left: 0 };
  }
};

/**
 * Adjusts placement if popover would overflow viewport
 */
const getAdjustedPlacement = (
  triggerRect: DOMRect,
  popoverRect: DOMRect,
  placement: Placement,
): Placement => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const gap = 8;

  const wouldOverflow = {
    top: triggerRect.top - popoverRect.height - gap < 0,
    bottom: triggerRect.bottom + popoverRect.height + gap > viewportHeight,
    left: triggerRect.left - popoverRect.width - gap < 0,
    right: triggerRect.right + popoverRect.width + gap > viewportWidth,
  };

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
 * Clamps position to keep popover within viewport
 */
const clampPosition = (position: Position, popoverRect: DOMRect): Position => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const padding = 8;

  return {
    top: Math.max(
      padding + window.scrollY,
      Math.min(position.top, viewportHeight - popoverRect.height - padding + window.scrollY),
    ),
    left: Math.max(
      padding + window.scrollX,
      Math.min(position.left, viewportWidth - popoverRect.width - padding + window.scrollX),
    ),
  };
};

/**
 * Popover Component
 *
 * Displays rich content on hover or click. Supports controlled and uncontrolled
 * modes with automatic collision detection.
 *
 * @example
 * ```tsx
 * <Popover content={<div>Rich content here</div>} trigger="click">
 *   <button>Click me</button>
 * </Popover>
 * ```
 */
const Popover = memo(function Popover({
  content,
  children,
  placement = 'bottom',
  trigger = 'click',
  closeOnClickOutside = true,
  isOpen: controlledIsOpen,
  onOpenChange,
}: PopoverProps) {
  const popoverId = useId();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] = useState<Placement>(placement);

  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Determine if controlled or uncontrolled
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  // Update open state
  const setIsOpen = useCallback(
    (open: boolean) => {
      if (isControlled) {
        onOpenChange?.(open);
      } else {
        setInternalIsOpen(open);
      }
    },
    [isControlled, onOpenChange],
  );

  // Update position when popover becomes visible
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();

    const adjustedPlacement = getAdjustedPlacement(triggerRect, popoverRect, placement);
    setActualPlacement(adjustedPlacement);

    const newPosition = calculatePosition(triggerRect, popoverRect, adjustedPlacement);
    const clampedPosition = clampPosition(newPosition, popoverRect);
    setPosition(clampedPosition);
  }, [placement]);

  // Show popover
  const showPopover = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (trigger === 'hover') {
      showTimeoutRef.current = setTimeout(() => {
        setIsOpen(true);
      }, 200);
    } else {
      setIsOpen(true);
    }
  }, [trigger, setIsOpen]);

  // Hide popover
  const hidePopover = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    if (trigger === 'hover') {
      hideTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 100);
    } else {
      setIsOpen(false);
    }
  }, [trigger, setIsOpen]);

  // Toggle popover (for click trigger)
  const togglePopover = useCallback(() => {
    if (isOpen) {
      hidePopover();
    } else {
      showPopover();
    }
  }, [isOpen, showPopover, hidePopover]);

  // Handle click outside
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (!closeOnClickOutside || !isOpen) return;

      const target = event.target as Node;
      const isOutsideTrigger = triggerRef.current && !triggerRef.current.contains(target);
      const isOutsidePopover = popoverRef.current && !popoverRef.current.contains(target);

      if (isOutsideTrigger && isOutsidePopover) {
        setIsOpen(false);
      }
    },
    [closeOnClickOutside, isOpen, setIsOpen],
  );

  // Handle Escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    },
    [isOpen, setIsOpen],
  );

  // Update position when visible
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        updatePosition();
      });
    }
  }, [isOpen, updatePosition]);

  // Add event listeners
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Build event handlers based on trigger type
  const triggerHandlers: Record<string, (e: React.SyntheticEvent) => void> = {};

  // Memoize popover position styles to prevent re-renders
  const popoverStyles = useMemo(
    () => ({
      top: position.top,
      left: position.left,
    }),
    [position.top, position.left],
  );

  const childElement = children as ReactElement<Record<string, unknown>>;

  if (trigger === 'click') {
    triggerHandlers.onClick = (e: React.SyntheticEvent) => {
      togglePopover();
      const originalHandler = childElement.props?.onClick;
      if (originalHandler) originalHandler(e);
    };
  } else if (trigger === 'hover') {
    triggerHandlers.onMouseEnter = (e: React.SyntheticEvent) => {
      showPopover();
      const originalHandler = childElement.props?.onMouseEnter;
      if (originalHandler) originalHandler(e);
    };
    triggerHandlers.onMouseLeave = (e: React.SyntheticEvent) => {
      hidePopover();
      const originalHandler = childElement.props?.onMouseLeave;
      if (originalHandler) originalHandler(e);
    };
  }

  // Clone child element and add event handlers
  const triggerElement = cloneElement(childElement, {
    ref: triggerRef,
    ...triggerHandlers,
    'aria-expanded': isOpen,
    'aria-haspopup': 'dialog',
    'aria-controls': isOpen ? popoverId : undefined,
  });

  const popoverContent = isOpen ? (
    <div
      ref={popoverRef}
      id={popoverId}
      role="dialog"
      className={cn(styles.popover, styles[`popover--${actualPlacement}`])}
      style={popoverStyles}
      data-testid="popover"
      data-placement={actualPlacement}
      onMouseEnter={trigger === 'hover' ? showPopover : undefined}
      onMouseLeave={trigger === 'hover' ? hidePopover : undefined}
    >
      {content}
    </div>
  ) : null;

  return (
    <>
      {triggerElement}
      {popoverContent && createPortal(popoverContent, document.body)}
    </>
  );
});

Popover.displayName = 'Popover';

export default Popover;
