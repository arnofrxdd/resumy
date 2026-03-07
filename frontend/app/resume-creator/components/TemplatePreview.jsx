import React, { useRef, useState, useEffect } from "react";
import ResumeRenderer from "../templates/ResumeRenderer";

const TemplatePreview = React.memo(({ templateId, data, forceDefault = false, designSettings = null, isFormPanel = false, currentStep = 1 }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        // A4 Paper dimensions in px at 96 DPI: 794 x 1123
        const A4_WIDTH = 794;
        const A4_HEIGHT = 1123;

        // Calculate scale to fit within the container while maintaining aspect ratio
        const scaleX = clientWidth / A4_WIDTH;
        const scaleY = clientHeight / A4_HEIGHT;

        // Use the smaller scale to ensure it fits completely
        const newScale = Math.min(scaleX, scaleY);
        setScale(newScale);
      }
    };

    calculateScale();
    const observer = new ResizeObserver(() => calculateScale());
    if (containerRef.current) observer.observe(containerRef.current);

    // Also trigger on window resize for safety
    window.addEventListener('resize', calculateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calculateScale);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="template-preview-wrapper"
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        className="template-preview-inner"
        style={{
          width: "794px",
          height: "1123px",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          flexShrink: 0,
          backgroundColor: "#fff",
          pointerEvents: "none",
          boxShadow: "0 0 20px rgba(0,0,0,0.05)",
          display: "block"
        }}
      >
        <ResumeRenderer
          templateId={templateId}
          data={data}
          forceDefault={forceDefault}
          designSettings={designSettings}
          isFormPanel={isFormPanel}
          currentStep={currentStep}
          scale={scale}
        />
      </div>
    </div>
  );
});

TemplatePreview.displayName = 'TemplatePreview';

export default TemplatePreview;