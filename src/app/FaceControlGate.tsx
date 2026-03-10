import React, { useEffect, useRef, useState } from "react";

// Tizimni yoqish/o'chirish uchun global sozlama (ixtiyoriy)
export const USE_BIOMETRIC_LOCK = false;

export default function FaceControlGate({ onAccessGranted }: { onAccessGranted: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState("Tizim yuklanmoqda...");
  const [progress, setProgress] = useState(0);
  
  // Egasining yuz o'lchami nisbati (Local Storage yoki Ref da saqlash mumkin)
  const masterRatio = useRef<number | null>(null);

  useEffect(() => {
    let isDestroyed = false;
    let counter = 0;

    // @ts-ignore
    const faceMesh = new window.FaceMesh({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.8,
    });

    faceMesh.onResults((results: any) => {
      if (isDestroyed) return;

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const lm = results.multiFaceLandmarks[0];
        
        // BIOMETRIK HISOBLASH
        // Ko'zlar orasidagi masofa va burun-iyak masofasini solishtiramiz
        const eyeDist = Math.hypot(lm[33].x - lm[263].x, lm[33].y - lm[263].y);
        const noseToChin = Math.hypot(lm[1].x - lm[152].x, lm[1].y - lm[152].y);
        const currentRatio = noseToChin / eyeDist;

        // Birinchi marta skaner qilayotgan odamni "Ega" sifatida qabul qiladi
        if (masterRatio.current === null) {
          masterRatio.current = currentRatio;
        }

        // Agar kadrda turgan yuzning nisbati Master (Ega) nishatiga mos kelsa
        const diff = Math.abs(currentRatio - masterRatio.current);
        
        if (diff < 0.12) { // 0.12 - aniqlik chegarasi
          counter++;
          const p = Math.min((counter / 50) * 100, 100);
          setProgress(p);
          setStatus(`Identifikatsiya: ${Math.round(p)}%`);

          if (counter >= 50) {
            setStatus("Ega tasdiqlandi. Xush kelibsiz!");
            setTimeout(() => onAccessGranted(), 800);
          }
        } else {
          // Boshqa odam bo'lsa to'xtaydi
          if (counter > 0) counter--;
          setProgress((counter / 50) * 100);
          setStatus("Xatolik: Begona shaxs aniqlandi!");
        }
      } else {
        if (counter > 0) counter -= 1;
        setProgress((counter / 50) * 100);
        setStatus("Skanerlash kutilmoqda...");
      }
    });

    const startCamera = async () => {
      const video = videoRef.current;
      if (!video) return;

      // @ts-ignore
      const camera = new window.Camera(video, {
        onFrame: async () => {
          if (!isDestroyed && video.readyState >= 2) {
            await faceMesh.send({ image: video });
          }
        },
        width: 640,
        height: 480,
      });
      camera.start();

      return camera;
    };

    const camPromise = startCamera();

    return () => {
      isDestroyed = true;
      camPromise.then(c => c?.stop());
      faceMesh.close();
    };
  }, [onAccessGranted]);

  return (
    <div style={{
      position: "fixed", inset: 0, backgroundColor: "#020202", zIndex: 9999999,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      color: "#00f2ff", fontFamily: "'Orbitron', sans-serif"
    }}>
      {/* Skaner doirasi */}
      <div style={{
        width: "280px", height: "280px", borderRadius: "50%", 
        border: `3px solid ${progress === 100 ? "#00ff00" : "#00f2ff"}`,
        position: "relative", overflow: "hidden", 
        boxShadow: `0 0 30px ${progress === 100 ? "rgba(0,255,0,0.3)" : "rgba(0,242,255,0.3)"}`,
        transition: "all 0.5s ease"
      }}>
        <video 
          ref={videoRef} 
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} 
          autoPlay muted playsInline 
        />
        
        {/* Scanning Laser Line */}
        <div style={{
          position: "absolute", top: `${progress}%`, left: 0, width: "100%", height: "4px",
          background: "linear-gradient(to right, transparent, #00f2ff, transparent)",
          boxShadow: "0 0 15px #00f2ff", transition: "top 0.1s linear"
        }} />
      </div>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h3 style={{ textTransform: "uppercase", letterSpacing: "3px", margin: 0, fontSize: "18px" }}>
            {status}
        </h3>
        <p style={{ color: "#444", fontSize: "12px", marginTop: "15px", fontWeight: "bold" }}>
            SECURE BIOMETRIC ACCESS SYSTEM v2.0
        </p>
      </div>
    </div>
  );
}