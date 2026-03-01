import React, { useEffect, useRef, useState } from "react";

export default function HandCursor({ isBypassed }: { isBypassed: boolean }) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isEnabled, setIsEnabled] = useState(false); 
  const [isFaceVerified, setIsFaceVerified] = useState(isBypassed);
  const myFaceRatio = useRef<number | null>(null); 
  const coords = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isProcessing = useRef(false);
  const isPinching = useRef(false); // Clickni bir marta ushlash uchun
  const scrollVelocity = useRef(0);

  // Click tovushi uchun optimallashgan funksiya
  const playClickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  };

  useEffect(() => {
    if (!isEnabled) return;
    let isDestroyed = false;
    let camera: any = null;

    // @ts-ignore
    const hands = new window.Hands({ locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}` });
    // @ts-ignore
    const faceMesh = new window.FaceMesh({ locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}` });

    hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.7, minTrackingConfidence: 0.7 });
    faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.7 });

    faceMesh.onResults((results: any) => {
      if (isBypassed) { setIsFaceVerified(true); return; }
      if (results.multiFaceLandmarks?.[0]) {
        const lm = results.multiFaceLandmarks[0];
        const ratio = Math.hypot(lm[1].x - lm[152].x, lm[1].y - lm[152].y) / Math.hypot(lm[33].x - lm[263].x, lm[33].y - lm[263].y);
        if (myFaceRatio.current === null) myFaceRatio.current = ratio;
        setIsFaceVerified(Math.abs(ratio - myFaceRatio.current) < 0.15);
      } else { setIsFaceVerified(false); }
    });

    hands.onResults((results: any) => {
      if (!isFaceVerified || !results.multiHandLandmarks?.[0]) return;
      
      const hand = results.multiHandLandmarks[0];
      const index = hand[8]; 
      const thumb = hand[4]; 
      const middle = hand[12];

      // 1. Kursorni markazlashtirish (Silliq harakat)
      coords.current.targetX = (1 - index.x) * window.innerWidth;
      coords.current.targetY = index.y * window.innerHeight;

      // 2. CLICK MANTIQI (ZUR ISHLAYDIGAN VERSIYA)
      const pinchDist = Math.hypot(index.x - thumb.x, index.y - thumb.y);
      
      // Agar barmoqlar yopishsa va biz hali "click" rejimida bo'lmasak
      if (pinchDist < 0.038) { 
        if (!isPinching.current) {
          isPinching.current = true;
          
          // Kursor ostidagi elementni topish (Kursorning o'zini chetlab o'tish)
          if (cursorRef.current) cursorRef.current.style.pointerEvents = 'none';
          const el = document.elementFromPoint(coords.current.x, coords.current.y) as HTMLElement;
          const clickable = el?.closest('a, button, [role="button"], input, .clickable') as HTMLElement;

          if (clickable) {
            clickable.click();
            playClickSound();
            // Animatsiya
            if (rippleRef.current) {
              rippleRef.current.style.opacity = "1";
              rippleRef.current.style.transform = "scale(3)";
              setTimeout(() => {
                if (rippleRef.current) {
                  rippleRef.current.style.opacity = "0";
                  rippleRef.current.style.transform = "scale(1)";
                }
              }, 200);
            }
          }
        }
      } else if (pinchDist > 0.05) {
        // Barmoqlar ochilganda keyingi click'ga ruxsat beramiz
        isPinching.current = false;
      }

      // 3. SCROLL MANTIQI
      const scrollDist = Math.hypot(index.x - middle.x, index.y - middle.y);
      if (scrollDist < 0.04) {
        scrollVelocity.current = (index.y - 0.5) * 60;
      } else {
        scrollVelocity.current *= 0.8;
      }
    });

    const video = videoRef.current;
    if (video) {
      // @ts-ignore
      camera = new window.Camera(video, {
        onFrame: async () => {
          if (isDestroyed || video.readyState < 2 || isProcessing.current) return;
          try {
            isProcessing.current = true;
            if (!isBypassed) await faceMesh.send({ image: video });
            await hands.send({ image: video });
          } finally { isProcessing.current = false; }
        }, width: 640, height: 480
      });
      camera.start();
    }

    const loop = () => {
      if (isDestroyed) return;
      // Kursor silliqligi (Lerp)
      coords.current.x += (coords.current.targetX - coords.current.x) * 0.25;
      coords.current.y += (coords.current.targetY - coords.current.y) * 0.25;
      
      if (Math.abs(scrollVelocity.current) > 1) window.scrollBy(0, scrollVelocity.current);
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${coords.current.x}px, ${coords.current.y}px, 0)`;
        cursorRef.current.style.backgroundColor = isPinching.current ? "rgba(0, 242, 255, 0.5)" : "transparent";
      }
      requestAnimationFrame(loop);
    };
    const animId = requestAnimationFrame(loop);

    return () => { isDestroyed = true; cancelAnimationFrame(animId); if (camera) camera.stop(); hands.close(); faceMesh.close(); };
  }, [isEnabled, isFaceVerified, isBypassed]);

  return (
    <>
      <button 
        onClick={() => setIsEnabled(!isEnabled)}
        style={{
          position: "fixed", bottom: "30px", left: "30px", zIndex: 9999999,
          padding: "12px 25px", borderRadius: "50px", border: "2px solid #fff",
          background: isEnabled ? "linear-gradient(45deg, #ff4b2b, #ff416c)" : "linear-gradient(45deg, #00f2fe, #4facfe)",
          color: "#fff", fontWeight: "bold", cursor: "pointer", boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease"
        }}
      >
        {isEnabled ? "TERMINATE AI" : "INITIALIZE AI"}
      </button>

      {isEnabled && (
        <>
          <div ref={cursorRef} style={{
            position: "fixed", width: "30px", height: "30px", border: "3px solid #fff",
            borderRadius: "50%", pointerEvents: "none", zIndex: 10000000, left: -15, top: -15,
            boxShadow: "0 0 20px #00f2ff", display: "flex", alignItems: "center", justifyContent: "center",
            opacity: isFaceVerified ? 1 : 0.2, transition: "background-color 0.1s, opacity 0.3s"
          }}>
            <div style={{ width: "4px", height: "4px", backgroundColor: "#fff", borderRadius: "50%" }} />
            <div ref={rippleRef} style={{ width: "100%", height: "100%", borderRadius: "50%", border: "2px solid #00f2ff", opacity: 0, transition: "all 0.2s ease-out", position: "absolute" }} />
          </div>
          <video ref={videoRef} style={{ display: "none" }} autoPlay muted playsInline />
        </>
      )}
    </>
  );
}