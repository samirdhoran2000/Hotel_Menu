import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import { Download, Camera } from "lucide-react";
import { useParams } from "react-router-dom";

const QrCode = () => {
  
    const params = useParams();
  const cardRef = useRef(null);

  /**
   * Captures the content of the cardRef element using html2canvas and
   * triggers a download of the resulting image.
   */
  const downloadCard = async () => {
    if (!cardRef.current) {
      console.error("Card element not found.");
      return;
    }

    try {
      // Use the imported html2canvas library directly.
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null, // Set to null to capture transparency and gradients.
        scale: 3, // Increase scale for a higher-resolution image.
        useCORS: true, // Needed if the QR code or other assets are from another origin.
        allowTaint: true,
        // Explicitly set width and height to prevent potential cropping issues.
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });

      // Create a temporary link element to trigger the file download.
      const link = document.createElement("a");
      link.download = "qr-code-menu-card.png";
      link.href = canvas.toDataURL("image/png", 1.0); // Convert canvas to a high-quality PNG.

      // Trigger the download and clean up the link element.
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating image:", error);
      // As a fallback, try to download just the QR code if the full card fails.
      downloadQRCodeOnly();
    }
  };

  /**
   * A fallback function to download only the QR code canvas.
   * This is useful if html2canvas fails for any reason.
   */
  const downloadQRCodeOnly = () => {
    if (!cardRef.current) return;

    // Find the <canvas> element rendered by QRCodeCanvas within the card.
    const qrCanvas = cardRef.current.querySelector("canvas");

    if (qrCanvas) {
      // create a new canvas with padding
      const padding = 10;
      const padded = document.createElement("canvas");
      padded.width = qrCanvas.width + padding * 2;
      padded.height = qrCanvas.height + padding * 2;
      const ctx = padded.getContext("2d");
      // fill background (white)
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, padded.width, padded.height);
      // draw original QR in the center
      ctx.drawImage(qrCanvas, padding, padding);
      // download padded canvas
      const link = document.createElement("a");
      link.download = "qr-code-only.png";
      link.href = padded.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("QR Code canvas element not found.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Animated background gradient blobs */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 md:w-64 h-32 md:h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-32 md:w-64 h-32 md:h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Download buttons - Responsive Position */}
      <div className="fixed bottom-6 right-6 lg:top-28 lg:right-16 lg:bottom-auto z-50 flex lg:flex-col gap-3">
        <button
          onClick={downloadCard}
          className="group bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 lg:p-3 hover:bg-slate-700 transition-all shadow-2xl hover:scale-110 active:scale-95"
          title="Download Full Card"
        >
          <div className="flex items-center gap-2 text-white">
            <Download className="w-6 h-6 lg:w-5 lg:h-5 group-hover:text-purple-400 transition-colors" />
            <span className="hidden lg:inline text-sm font-medium">Card</span>
          </div>
        </button>

        <button
          onClick={downloadQRCodeOnly}
          className="group bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 lg:p-3 hover:bg-slate-700 transition-all shadow-2xl hover:scale-110 active:scale-95"
          title="Download QR Code Only"
        >
          <div className="flex items-center gap-2 text-white">
            <Camera className="w-6 h-6 lg:w-5 lg:h-5 group-hover:text-cyan-400 transition-colors" />
            <span className="hidden lg:inline text-sm font-medium">QR</span>
          </div>
        </button>
      </div>

      {/* Main card container with a glowing border effect on hover */}
      <div className="relative w-full max-w-md group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

        {/* This is the element that will be captured for download */}
        <div
          ref={cardRef}
          className="relative bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>

          <div className="relative z-10 p-8 flex flex-col items-center text-center">
            {/* Animated decorative corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-purple-400 rounded-tl-lg opacity-60 animate-pulse"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-blue-400 rounded-tr-lg opacity-60 animate-pulse delay-300"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-pink-400 rounded-bl-lg opacity-60 animate-pulse delay-700"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400 rounded-br-lg opacity-60 animate-pulse delay-1000"></div>

            {/* Fixed text styling - using solid colors instead of gradient clipping */}
            <h1 className="text-4xl md:text-6xl font-bold text-purple-300 mb-1 tracking-tight leading-tight drop-shadow-lg">
              DIGITAL
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-cyan-300 mb-6 md:mb-8 tracking-tight drop-shadow-lg">
              MENU
            </h2>

            <div className="mb-8">
              <p className="text-slate-300 text-lg font-medium mb-2 tracking-wide">
                SCAN TO ACCESS
              </p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
            </div>

            {/* QR Code container with its own glow and hover effects */}
            <div className="relative mb-6 md:mb-8 group/qr w-full flex justify-center">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-cyan-400/20 rounded-3xl blur-lg group-hover/qr:blur-xl transition-all duration-300"></div>
              <div className="relative bg-white/95 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-2xl border border-white/20 group-hover/qr:scale-105 transition-transform duration-300 max-w-full">
                <QRCodeCanvas
                  value={`${import.meta.env.VITE_DOMAIN_URL}/hotel/${params?.id}`} // The URL for the QR code
                  size={window.innerWidth < 640 ? 160 : 200}
                  level="H" // High error correction level
                  className="rounded-xl w-full h-auto max-w-[160px] md:max-w-[200px]"
                  bgColor="#ffffff"
                  fgColor="#1e293b" // A dark slate color for the QR code pattern
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 text-slate-300">
              <p className="text-sm font-medium tracking-wider uppercase">
                Point Camera Here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCode;
