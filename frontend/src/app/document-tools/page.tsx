"use client";

import { useState, useRef, useEffect } from "react";
import { 
  FileImage, FileText, Scissors, Minimize2, Keyboard, 
  Upload, Download, RefreshCw, CheckCircle2, ShieldCheck, 
  Sliders, Printer, Sparkles, ArrowRight 
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { telSupportUrl, whatsAppUrl } from "@/lib/utils";

type ActiveTool = "compress" | "resize" | "jpg2pdf" | "biodata" | "typing";

export default function DocumentToolsPage() {
  const { lang } = useLanguage();
  const [activeTool, setActiveTool] = useState<ActiveTool>("compress");

  // State: Image Compressor
  const [compressFile, setCompressFile] = useState<File | null>(null);
  const [compressPreview, setCompressPreview] = useState<string | null>(null);
  const [targetKB, setTargetKB] = useState<number>(50);
  const [compressedBlob, setCompressedBlob] = useState<{ url: string; sizeKB: number } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // State: Passport Photo & Signature Resizer
  const [resizeFile, setResizeFile] = useState<File | null>(null);
  const [resizePreview, setResizePreview] = useState<string | null>(null);
  const [preset, setPreset] = useState<string>("mpesb_photo");
  const [customWidth, setCustomWidth] = useState<number>(200);
  const [customHeight, setCustomHeight] = useState<number>(230);
  const [resizedBlob, setResizedBlob] = useState<{ url: string; sizeKB: number } | null>(null);

  // State: JPG to PDF
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [pdfLoading, setPdfLoading] = useState(false);

  // State: Biodata Generator
  const [biodata, setBiodata] = useState({
    name: "Ravi Kumar",
    fatherName: "Shri Ramesh Kumar",
    dob: "2000-08-15",
    gender: "Male",
    qualification: "Bachelor of Science (B.Sc Computer Science)",
    category: "OBC",
    phone: "9294899787",
    email: "applicant@example.com",
    address: "Village & Post Rehti, Tehsil Rehti, District Sehore (M.P.)",
    skills: "Hindi-English Typing (CPCT Qualified), MS Office, Internet Operations"
  });

  // State: Typing Test
  const sampleHindiText = "मध्य प्रदेश शासन द्वारा नागरिक कल्याण एवं डिजिटल सेवाओं के विस्तार हेतु लोक सेवा गारंटी अधिनियम लागू किया गया है। प्रत्येक नागरिक को समयबद्ध डिजिटल सेवाएं प्राप्त करने का अधिकार है।";
  const sampleEnglishText = "Pradhan Digital Services provides fast and reliable citizen assistance for government recruitment, certificates, scholarship schemes and digital documentation.";
  const [typingLang, setTypingLang] = useState<"en" | "hi">("en");
  const [typingInput, setTypingInput] = useState("");
  const [typingStarted, setTypingStarted] = useState(false);
  const [typingTimeLeft, setTypingTimeLeft] = useState(60);
  const [typingWpm, setTypingWpm] = useState(0);

  // Timer for Typing Test
  useEffect(() => {
    let timer: any = null;
    if (typingStarted && typingTimeLeft > 0) {
      timer = setInterval(() => {
        setTypingTimeLeft((t) => t - 1);
      }, 1000);
    } else if (typingTimeLeft === 0 && typingStarted) {
      setTypingStarted(false);
      const words = typingInput.trim().split(/\s+/).filter(Boolean).length;
      setTypingWpm(words);
    }
    return () => clearInterval(timer);
  }, [typingStarted, typingTimeLeft, typingInput]);

  // Handle Image Compression
  const handleCompress = (file: File, target: number) => {
    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        // Binary search compression quality
        let minQuality = 0.05;
        let maxQuality = 0.95;
        let bestBlob: Blob | null = null;

        const attempt = (q: number): Promise<Blob> =>
          new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", q));

        (async () => {
          for (let i = 0; i < 6; i++) {
            const mid = (minQuality + maxQuality) / 2;
            const b = await attempt(mid);
            bestBlob = b;
            const size = b.size / 1024;
            if (size > target) {
              maxQuality = mid;
            } else {
              minQuality = mid;
            }
          }
          if (bestBlob) {
            setCompressedBlob({
              url: URL.createObjectURL(bestBlob),
              sizeKB: Math.round(bestBlob.size / 1024)
            });
          }
          setIsCompressing(false);
        })();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle Preset Change
  const applyPreset = (p: string) => {
    setPreset(p);
    if (p === "mpesb_photo") {
      setCustomWidth(200);
      setCustomHeight(230);
    } else if (p === "mpesb_sign") {
      setCustomWidth(140);
      setCustomHeight(60);
    } else if (p === "ssc_photo") {
      setCustomWidth(350);
      setCustomHeight(450);
    } else if (p === "ssc_sign") {
      setCustomWidth(400);
      setCustomHeight(200);
    }
  };

  // Handle Resize
  const handleResize = (file: File, w: number, h: number) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, w, h);

        canvas.toBlob((blob) => {
          if (blob) {
            setResizedBlob({
              url: URL.createObjectURL(blob),
              sizeKB: Math.round(blob.size / 1024)
            });
          }
        }, "image/jpeg", 0.9);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Client-Side Image to PDF Converter
  const convertImagesToPdf = async () => {
    if (pdfFiles.length === 0) return;
    setPdfLoading(true);

    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) throw new Error("Popup blocked");

      const imagesHtml = await Promise.all(
        pdfFiles.map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => {
                resolve(`<div style="page-break-after: always; display:flex; justify-content:center; align-items:center; height:100vh;">
                  <img src="${reader.result}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                </div>`);
              };
              reader.readAsDataURL(file);
            })
        )
      );

      printWindow.document.write(`
        <html>
          <head>
            <title>PDS Converted Document - PDF</title>
            <style>
              body { margin: 0; padding: 0; background: #fff; }
              @media print {
                body { margin: 0; }
                div { page-break-after: always; }
              }
            </style>
          </head>
          <body>
            ${imagesHtml.join("")}
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch {
      alert("Please allow popups to generate and print PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-saffron-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === "hi" ? "100% फ्री एवं सुरक्षित डिजिटल टूल्स" : "100% Free & In-Browser Working Tools"}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            {lang === "hi" ? "डिजिटल दस्तावेज़ टूल्स" : "Document Tools Suite"}
          </h1>
          <p className="text-saffron-200/90 text-sm md:text-base max-w-2xl mx-auto">
            {lang === "hi" 
              ? "व्यापम (MPESB), SSC, UPSC एवं पुलिस भर्ती हेतु फोटो-साइन रिसाइज, KB कंप्रेसर, JPG से PDF एवं बायोडाटा मेकर।" 
              : "Client-side image compressor, passport photo cropper, JPG to PDF converter, and professional biodata maker."}
          </p>
        </div>

        {/* Tool Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-8">
          {[
            { id: "compress" as ActiveTool, label: lang === "hi" ? "फोटो / इमेज कंप्रेसर (KB सेटर)" : "KB Compressor", icon: Minimize2 },
            { id: "resize" as ActiveTool, label: lang === "hi" ? "पासपोर्ट फोटो व साइन रिसाइजर" : "Photo & Sign Crop", icon: Scissors },
            { id: "jpg2pdf" as ActiveTool, label: lang === "hi" ? "JPG / PNG से PDF बनाएं" : "JPG to PDF", icon: FileImage },
            { id: "biodata" as ActiveTool, label: lang === "hi" ? "बायोडाटा / रिज्यूमे मेकर" : "Biodata Maker", icon: FileText },
            { id: "typing" as ActiveTool, label: lang === "hi" ? "टाइपिंग स्पीड टेस्ट (हिंदी/अंग्रेजी)" : "Typing Test", icon: Keyboard },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-semibold border transition flex items-center gap-2 ${
                activeTool === t.id
                  ? "bg-saffron-500 text-navy-950 border-saffron-400 font-bold shadow-lg"
                  : "bg-navy-900 border-white/10 text-white hover:border-saffron-400"
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* TOOL 1: COMPRESSOR */}
          {activeTool === "compress" && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 bg-navy-900/90 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Minimize2 className="w-5 h-5 text-saffron-400" />
                {lang === "hi" ? "फोटो / दस्तावेज़ KB कंप्रेसर (सरकारी फॉर्म साइज सेटर)" : "Target KB Image Compressor"}
              </h2>
              <p className="text-xs text-saffron-200/80 mb-6">
                {lang === "hi" ? "MPESB, SSC या बैंक फॉर्म के लिए सटीक 20KB, 50KB या 100KB साइज में फोटो बनाएं।" : "Compress photos to exact required KB sizes for government applications without losing clarity."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center hover:border-saffron-400 transition bg-navy-950/50">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setCompressFile(f);
                          setCompressPreview(URL.createObjectURL(f));
                          handleCompress(f, targetKB);
                        }
                      }}
                      className="hidden"
                      id="compress-input"
                    />
                    <label htmlFor="compress-input" className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-10 h-10 text-saffron-400 mb-2" />
                      <span className="text-sm font-semibold text-white">
                        {compressFile ? compressFile.name : (lang === "hi" ? "कंप्रेस करने के लिए फोटो चुनें" : "Select Photo to Compress")}
                      </span>
                      {compressFile && (
                        <span className="text-xs text-saffron-300 mt-1">
                          {lang === "hi" ? "मूल आकार:" : "Original Size:"} {Math.round(compressFile.size / 1024)} KB
                        </span>
                      )}
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-saffron-200 mb-2">
                      {lang === "hi" ? `लक्षित फाइल साइज: ${targetKB} KB` : `Target Size: ${targetKB} KB`}
                    </label>
                    <div className="flex gap-2 mb-2">
                      {[20, 50, 100, 200].map((kb) => (
                        <button
                          key={kb}
                          type="button"
                          onClick={() => {
                            setTargetKB(kb);
                            if (compressFile) handleCompress(compressFile, kb);
                          }}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                            targetKB === kb ? "bg-saffron-500 text-navy-950 border-saffron-400" : "bg-navy-950 border-white/10 text-white"
                          }`}
                        >
                          {kb} KB
                        </button>
                      ))}
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      value={targetKB}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setTargetKB(val);
                        if (compressFile) handleCompress(compressFile, val);
                      }}
                      className="w-full accent-saffron-500"
                    />
                  </div>
                </div>

                <div className="border border-white/10 rounded-2xl p-4 bg-navy-950/70 flex flex-col items-center justify-center min-h-[220px]">
                  {compressedBlob ? (
                    <div className="text-center w-full">
                      <img src={compressedBlob.url} alt="Compressed" className="max-h-48 mx-auto rounded-lg shadow-md mb-3 object-contain" />
                      <div className="flex items-center justify-between px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-3">
                        <span className="text-xs font-semibold text-emerald-300">
                          {lang === "hi" ? "तैयार फाइल साइज:" : "Output Size:"} {compressedBlob.sizeKB} KB
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <a
                        href={compressedBlob.url}
                        download={`pds_compressed_${targetKB}kb.jpg`}
                        className="inline-flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition"
                      >
                        <Download className="w-4 h-4" />
                        {lang === "hi" ? "कंप्रेस फोटो डाउनलोड करें" : "Download Compressed Photo"}
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-white/50 text-center">
                      {lang === "hi" ? "फोटो अपलोड करने पर परिणाम यहां दिखेगा।" : "Upload a photo to see compressed output."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TOOL 2: PASSPORT PHOTO & SIGNATURE RESIZER */}
          {activeTool === "resize" && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 bg-navy-900/90 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-saffron-400" />
                {lang === "hi" ? "पासपोर्ट फोटो एवं हस्ताक्षर रिसाइजर" : "Passport Photo & Signature Cropper"}
              </h2>
              <p className="text-xs text-saffron-200/80 mb-6">
                {lang === "hi" ? "व्यापम प्रोफाइल, SSC, UPSC एवं पुलिस परीक्षा के नियमों अनुसार सटीक पिक्सल साइज में बदलें।" : "Resize to exact pixel dimensions as specified in official recruitment guidelines."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center hover:border-saffron-400 transition bg-navy-950/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setResizeFile(f);
                          handleResize(f, customWidth, customHeight);
                        }
                      }}
                      className="hidden"
                      id="resize-input"
                    />
                    <label htmlFor="resize-input" className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-10 h-10 text-saffron-400 mb-2" />
                      <span className="text-sm font-semibold text-white">
                        {resizeFile ? resizeFile.name : (lang === "hi" ? "फोटो या हस्ताक्षर अपलोड करें" : "Upload Photo or Signature")}
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-saffron-200 mb-2">
                      {lang === "hi" ? "भर्ती नियम प्रीसेट चुनें" : "Select Recruitment Preset"}
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {[
                        { id: "mpesb_photo", label: "MPESB Photo (200x230)" },
                        { id: "mpesb_sign", label: "MPESB Sign (140x60)" },
                        { id: "ssc_photo", label: "SSC CGL Photo (350x450)" },
                        { id: "ssc_sign", label: "SSC Sign (400x200)" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            applyPreset(item.id);
                            if (resizeFile) {
                              if (item.id === "mpesb_photo") handleResize(resizeFile, 200, 230);
                              else if (item.id === "mpesb_sign") handleResize(resizeFile, 140, 60);
                              else if (item.id === "ssc_photo") handleResize(resizeFile, 350, 450);
                              else if (item.id === "ssc_sign") handleResize(resizeFile, 400, 200);
                            }
                          }}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-left ${
                            preset === item.id ? "bg-saffron-500 text-navy-950 border-saffron-400 font-bold" : "bg-navy-950 border-white/10 text-white"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-white/70 mb-1">{lang === "hi" ? "चौड़ाई (Width px)" : "Width (px)"}</label>
                        <input
                          type="number"
                          value={customWidth}
                          onChange={(e) => {
                            const w = Number(e.target.value);
                            setCustomWidth(w);
                            if (resizeFile) handleResize(resizeFile, w, customHeight);
                          }}
                          className="w-full px-3 py-2 bg-navy-950 border border-white/10 rounded-xl text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-white/70 mb-1">{lang === "hi" ? "ऊंचाई (Height px)" : "Height (px)"}</label>
                        <input
                          type="number"
                          value={customHeight}
                          onChange={(e) => {
                            const h = Number(e.target.value);
                            setCustomHeight(h);
                            if (resizeFile) handleResize(resizeFile, customWidth, h);
                          }}
                          className="w-full px-3 py-2 bg-navy-950 border border-white/10 rounded-xl text-sm font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-white/10 rounded-2xl p-4 bg-navy-950/70 flex flex-col items-center justify-center min-h-[220px]">
                  {resizedBlob ? (
                    <div className="text-center w-full">
                      <img src={resizedBlob.url} alt="Resized" className="max-h-44 mx-auto rounded-lg shadow-md mb-3 object-contain border border-white/10" />
                      <p className="text-xs text-saffron-300 mb-3">
                        {customWidth} x {customHeight} px • {resizedBlob.sizeKB} KB
                      </p>
                      <a
                        href={resizedBlob.url}
                        download={`pds_${customWidth}x${customHeight}.jpg`}
                        className="inline-flex items-center justify-center gap-2 w-full py-3 bg-saffron-600 hover:bg-saffron-500 text-white font-bold rounded-xl text-sm transition"
                      >
                        <Download className="w-4 h-4" />
                        {lang === "hi" ? "रिसाइज इमेज डाउनलोड करें" : "Download Resized Image"}
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-white/50 text-center">
                      {lang === "hi" ? "फोटो या हस्ताक्षर अपलोड करें।" : "Upload image to preview resized output."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TOOL 3: JPG TO PDF */}
          {activeTool === "jpg2pdf" && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 bg-navy-900/90 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <FileImage className="w-5 h-5 text-saffron-400" />
                {lang === "hi" ? "JPG / PNG से PDF कनवर्टर" : "JPG / PNG to PDF Converter"}
              </h2>
              <p className="text-xs text-saffron-200/80 mb-6">
                {lang === "hi" ? "अपनी अंकसूची, आधार कार्ड या प्रमाणपत्र फोटो को सिंगल या मल्टी-पेज PDF में बदलें।" : "Convert your marksheets, Aadhaar card or certificates into a single clean PDF document."}
              </p>

              <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-saffron-400 transition bg-navy-950/50 mb-6">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    if (e.target.files) {
                      setPdfFiles(Array.from(e.target.files));
                    }
                  }}
                  className="hidden"
                  id="pdf-images"
                />
                <label htmlFor="pdf-images" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-12 h-12 text-saffron-400 mb-2" />
                  <span className="text-base font-bold text-white">
                    {pdfFiles.length > 0 
                      ? `${pdfFiles.length} ${lang === "hi" ? "फोटो चुनी गईं" : "Images Selected"}`
                      : (lang === "hi" ? "फोटो चुनें (एक या एक से अधिक)" : "Select Images (Single or Multiple)")}
                  </span>
                  <span className="text-xs text-white/50 mt-1">
                    {lang === "hi" ? "JPG, PNG फाइल्स समर्थित हैं" : "JPG, PNG formats supported"}
                  </span>
                </label>
              </div>

              {pdfFiles.length > 0 && (
                <div className="mb-6 space-y-2">
                  <div className="text-xs font-semibold text-saffron-300">
                    {lang === "hi" ? "चयनित फाइल्स:" : "Selected Files:"}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {pdfFiles.map((f, i) => (
                      <div key={i} className="p-2 rounded-xl bg-navy-950/80 border border-white/10 text-xs truncate">
                        📄 {f.name} ({Math.round(f.size / 1024)} KB)
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={convertImagesToPdf}
                disabled={pdfFiles.length === 0 || pdfLoading}
                className="w-full py-4 bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-500 hover:to-saffron-400 text-white font-bold rounded-2xl shadow-xl transition disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {pdfLoading ? (
                  <span>{lang === "hi" ? "PDF तैयार हो रहा है..." : "Generating PDF..."}</span>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>{lang === "hi" ? "PDF बनाएं एवं डाउनलोड करें" : "Generate & Print PDF"}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TOOL 4: BIODATA MAKER */}
          {activeTool === "biodata" && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 bg-navy-900/90 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-saffron-400" />
                {lang === "hi" ? "सरकारी नौकरी / विवाह बायोडाटा मेकर" : "Fast Biodata / Resume Maker"}
              </h2>
              <p className="text-xs text-saffron-200/80 mb-6">
                {lang === "hi" ? "अपनी जानकारी भरें और तुरंत साफ-सुथरा पेशेवर बायोडाटा प्रिंट या PDF सेव करें।" : "Fill in your details and instantly print or save a clean, professional Hindi/English biodata."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs">
                <div>
                  <label className="block text-white/70 mb-1">{lang === "hi" ? "पूरा नाम" : "Full Name"}</label>
                  <input
                    type="text"
                    value={biodata.name}
                    onChange={(e) => setBiodata({ ...biodata, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">{lang === "hi" ? "पिता का नाम" : "Father's Name"}</label>
                  <input
                    type="text"
                    value={biodata.fatherName}
                    onChange={(e) => setBiodata({ ...biodata, fatherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">{lang === "hi" ? "जन्म तिथि" : "Date of Birth"}</label>
                  <input
                    type="date"
                    value={biodata.dob}
                    onChange={(e) => setBiodata({ ...biodata, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">{lang === "hi" ? "वर्ग / श्रेणी" : "Category"}</label>
                  <input
                    type="text"
                    value={biodata.category}
                    onChange={(e) => setBiodata({ ...biodata, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">{lang === "hi" ? "मोबाइल नंबर" : "Phone"}</label>
                  <input
                    type="text"
                    value={biodata.phone}
                    onChange={(e) => setBiodata({ ...biodata, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1">{lang === "hi" ? "शैक्षणिक योग्यता" : "Qualification"}</label>
                  <input
                    type="text"
                    value={biodata.qualification}
                    onChange={(e) => setBiodata({ ...biodata, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white/70 mb-1">{lang === "hi" ? "स्थाई पता" : "Permanent Address"}</label>
                  <input
                    type="text"
                    value={biodata.address}
                    onChange={(e) => setBiodata({ ...biodata, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white text-sm"
                  />
                </div>
              </div>

              {/* Biodata Live Print Preview */}
              <div id="biodata-print-area" className="p-6 bg-white text-navy-950 rounded-2xl shadow-xl border-4 border-navy-900 mb-6">
                <div className="text-center pb-3 border-b-2 border-navy-900 mb-4">
                  <h3 className="text-2xl font-black tracking-wide text-navy-950 uppercase">
                    CURRICULUM VITAE / बायोडाटा
                  </h3>
                  <p className="text-xs text-navy-600 font-bold">PRADHAN DIGITAL SERVICES ASSISTED FORMAT</p>
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="grid grid-cols-3 py-1 border-b border-navy-100">
                    <span className="font-bold text-navy-800">नाम (Name):</span>
                    <span className="col-span-2 font-semibold text-navy-950">{biodata.name}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-navy-100">
                    <span className="font-bold text-navy-800">पिता का नाम (Father's Name):</span>
                    <span className="col-span-2 font-semibold text-navy-950">{biodata.fatherName}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-navy-100">
                    <span className="font-bold text-navy-800">जन्म तिथि (DOB):</span>
                    <span className="col-span-2 font-semibold text-navy-950">{biodata.dob}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-navy-100">
                    <span className="font-bold text-navy-800">श्रेणी (Category):</span>
                    <span className="col-span-2 font-semibold text-navy-950">{biodata.category}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-navy-100">
                    <span className="font-bold text-navy-800">योग्यता (Qualification):</span>
                    <span className="col-span-2 font-semibold text-navy-950">{biodata.qualification}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-navy-100">
                    <span className="font-bold text-navy-800">मोबाइल (Contact):</span>
                    <span className="col-span-2 font-semibold text-navy-950">{biodata.phone}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1">
                    <span className="font-bold text-navy-800">पता (Address):</span>
                    <span className="col-span-2 font-semibold text-navy-950">{biodata.address}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-4 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-5 h-5 text-saffron-400" />
                <span>{lang === "hi" ? "बायोडाटा प्रिंट / PDF सेव करें" : "Print / Save Biodata as PDF"}</span>
              </button>
            </div>
          )}

          {/* TOOL 5: TYPING TEST */}
          {activeTool === "typing" && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 bg-navy-900/90 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-saffron-400" />
                {lang === "hi" ? "CPCT व सरकारी भर्ती टाइपिंग स्पीड टेस्ट" : "Typing Speed Test (Hindi & English)"}
              </h2>
              <p className="text-xs text-saffron-200/80 mb-6">
                {lang === "hi" ? "मध्य प्रदेश CPCT, हाईकोर्ट एवं व्यापम ग्रुप-4 परीक्षा की तैयारी हेतु 1-मिनट ऑनलाइन टाइपिंग टेस्ट।" : "Practice 1-minute timed typing tests for CPCT, High Court and Group-4 clerical exams."}
              </p>

              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setTypingLang("en");
                    setTypingInput("");
                    setTypingStarted(false);
                    setTypingTimeLeft(60);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                    typingLang === "en" ? "bg-saffron-500 text-navy-950 border-saffron-400" : "bg-navy-950 border-white/10 text-white"
                  }`}
                >
                  English Typing Test
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTypingLang("hi");
                    setTypingInput("");
                    setTypingStarted(false);
                    setTypingTimeLeft(60);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                    typingLang === "hi" ? "bg-saffron-500 text-navy-950 border-saffron-400" : "bg-navy-950 border-white/10 text-white"
                  }`}
                >
                  हिंदी टाइपिंग टेस्ट (Hindi)
                </button>
              </div>

              <div className="p-4 bg-navy-950/80 border border-white/15 rounded-2xl mb-4 text-sm leading-relaxed text-saffron-100 font-mono select-none">
                {typingLang === "en" ? sampleEnglishText : sampleHindiText}
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white/70">
                  {lang === "hi" ? "समय शेष:" : "Time Left:"} <strong className="text-saffron-400">{typingTimeLeft}s</strong>
                </span>
                {typingWpm > 0 && (
                  <span className="text-xs font-bold text-emerald-400 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    {lang === "hi" ? "गति:" : "Speed:"} {typingWpm} WPM
                  </span>
                )}
              </div>

              <textarea
                value={typingInput}
                onChange={(e) => {
                  if (!typingStarted && typingTimeLeft > 0) {
                    setTypingStarted(true);
                  }
                  if (typingTimeLeft > 0) {
                    setTypingInput(e.target.value);
                  }
                }}
                placeholder={lang === "hi" ? "टाइप करना शुरू करें..." : "Start typing here..."}
                disabled={typingTimeLeft === 0}
                rows={4}
                className="w-full p-4 rounded-2xl bg-navy-950 border border-white/20 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-saffron-500 mb-4"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTypingInput("");
                    setTypingStarted(false);
                    setTypingTimeLeft(60);
                    setTypingWpm(0);
                  }}
                  className="py-3 px-6 bg-navy-900 border border-white/10 hover:bg-navy-800 text-white font-semibold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{lang === "hi" ? "रीसेट करें" : "Reset Test"}</span>
                </button>
                <a
                  href={whatsAppUrl("नमस्ते, मुझे CPCT / टाइपिंग टेस्ट एवं फॉर्म भरने में सहायता चाहिए।")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition flex items-center gap-1.5 ml-auto"
                >
                  <span>{lang === "hi" ? "WhatsApp पर टाइपिंग मार्गदर्शन" : "WhatsApp Guidance"}</span>
                </a>
              </div>
            </div>
          )}

          {/* Quick Help Strip */}
          <div className="mt-8 p-6 bg-navy-900/40 border border-white/10 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-white text-sm">
                {lang === "hi" ? "दस्तावेज़ बनाने या रिसाइज करने में समस्या आ रही है?" : "Need Assistance with Document Formatting?"}
              </h4>
              <p className="text-xs text-saffron-200/80 mt-0.5">
                {lang === "hi" ? "प्रधान डिजिटल सर्विसेज हेल्पडेस्क से तुरंत सहायता प्राप्त करें।" : "Contact Pradhan Digital Services direct helpdesk for manual support."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={whatsAppUrl("Hi, I need assistance with document preparation at Pradhan Digital Services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition"
              >
                WhatsApp Desk
              </a>
              <a
                href={telSupportUrl()}
                className="py-2.5 px-4 bg-saffron-600 hover:bg-saffron-500 text-white font-bold rounded-xl text-xs transition"
              >
                Call: 9294899787
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
