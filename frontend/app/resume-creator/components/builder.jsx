import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Download, ArrowLeft } from "lucide-react";
import FormPanel from "./FormPanel";
import ClassicTemplate from "../templates/classic/classicTemplate";

export default function Builder({ data, setData, layout, setLayout, onBack }) {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${data.personal.name}_Resume`,
  });

  return (
    <div className="app-container">
      {/* Left: Interactive Dashboard */}
      <div style={{ width: "50%", height: "100%", position: "relative", zIndex: 10, borderRight: "1px solid rgba(255,255,255,0.05)" }}>
        {/* Back Button */}
        <button 
            onClick={onBack}
            style={{
                position: 'absolute', top: '15px', right: '15px', zIndex: 50,
                background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', 
                color: '#fff', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px'
            }}
        >
            <ArrowLeft size={14} /> Back
        </button>

        <FormPanel data={data} setData={setData} layout={layout} setLayout={setLayout} />
      </div>

      {/* Right: Live Preview */}
      <div style={{ flex: 1, background: "#121212", height: "100%", overflowY: "auto", position: "relative", display: "block" }}>
        
        <div style={{ position: 'sticky', top: '20px', display: 'flex', justifyContent: 'flex-end', paddingRight: '30px', zIndex: 100, pointerEvents: 'none' }}>
          <button 
            onClick={() => handlePrint()}
            style={{ pointerEvents: 'auto', padding: '12px 24px', background: '#fff', color: '#000', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
          >
            <Download size={18}/> Export PDF
          </button>
        </div>

        <div style={{ padding: "40px 0 100px 0", display: "flex", justifyContent: "center", minHeight: "100%" }}>
          <div style={{ transform: "scale(0.7)", transformOrigin: "top center", height: "100%" }}>
            <div ref={componentRef} style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
              <ClassicTemplate data={data} layout={layout} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}