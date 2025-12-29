import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useResponsiveContext } from '../../hooks/useResponsiveContext';
import { Button } from '../atoms/Button';

/**
 * Responsive modal component that adapts to device type
 * - Mobile: Full-screen modal or bottom sheet (swipeable)
 * - Desktop: Centered dialog with backdrop
 */
export const ResponsiveModal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  variant = 'auto', // 'auto' | 'dialog' | 'bottom-sheet' | 'fullscreen'
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = ''
}) => {
  const { isMobile, isTablet } = useResponsiveContext();
  const modalRef = useRef(null);

  // Determine modal variant based on device
  const resolvedVariant = variant === 'auto'
    ? (isMobile ? 'bottom-sheet' : 'dialog')
    : variant;

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap (basic implementation)
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Desktop: Centered dialog
  if (resolvedVariant === 'dialog') {
    return (
      <div
        className="fixed z-[9999]"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={closeOnBackdrop ? onClose : undefined}
        />

        {/* Modal */}
        <div
          ref={modalRef}
          className={`relative rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border-2 border-gray-800 ${className}`}
          style={{ backgroundColor: '#ffffff' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <h2 id="modal-title" className="text-xl font-semibold text-gray-800">
              {title}
            </h2>
            {showCloseButton && (
              <Button
                icon={X}
                onClick={onClose}
                variant="default"
                size="sm"
                title="Close"
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-white">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mobile: Bottom sheet
  if (resolvedVariant === 'bottom-sheet') {
    return (
      <div className="fixed inset-0 z-50 flex items-end">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={closeOnBackdrop ? onClose : undefined}
        />

        {/* Bottom Sheet */}
        <div
          ref={modalRef}
          className={`relative bg-white rounded-t-3xl shadow-2xl w-full max-h-[85vh] flex flex-col animate-slide-up ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-800">
              {title}
            </h2>
            {showCloseButton && (
              <Button
                icon={X}
                onClick={onClose}
                variant="default"
                size="md"
                title="Close"
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mobile: Fullscreen
  if (resolvedVariant === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-800">
            {title}
          </h2>
          {showCloseButton && (
            <Button
              icon={X}
              onClick={onClose}
              variant="default"
              size="md"
              title="Close"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-4 py-4 border-t border-gray-200 bg-white">
            {footer}
          </div>
        )}
      </div>
    );
  }

  return null;
};
