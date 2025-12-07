import { useResponsiveContext } from '../../hooks/useResponsiveContext';
import { DesktopSidebar } from './DesktopSidebar';
import { CollapsibleSidebar } from './CollapsibleSidebar';
import { FloatingToolbar } from './FloatingToolbar';

/**
 * Responsive toolbar wrapper that switches between variants based on breakpoint
 * - Mobile (xs, sm): FloatingToolbar (bottom sheet)
 * - Tablet (md, lg): CollapsibleSidebar (expandable side panel)
 * - Desktop (xl, 2xl): DesktopSidebar (fixed side panel)
 */
export const ResponsiveToolbar = ({
  selectedTool,
  onToolSelect
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsiveContext();

  // Render appropriate variant based on device
  if (isMobile) {
    return (
      <FloatingToolbar
        selectedTool={selectedTool}
        onToolSelect={onToolSelect}
      />
    );
  }

  if (isTablet) {
    return (
      <CollapsibleSidebar
        selectedTool={selectedTool}
        onToolSelect={onToolSelect}
      />
    );
  }

  // Desktop default
  return (
    <DesktopSidebar
      selectedTool={selectedTool}
      onToolSelect={onToolSelect}
    />
  );
};
