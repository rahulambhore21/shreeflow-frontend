const WaveDecoration = ({ className = "", flip = false }: { className?: string; flip?: boolean }) => {
  return (
    <div className={`absolute left-0 right-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Main waves with blue water colors */}
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={`relative block w-full h-16 md:h-20 ${flip ? "rotate-180" : ""}`}
        fill="url(#waveGradient1)"
      >
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.15 }} />
            <stop offset="50%" style={{ stopColor: '#0ea5e9', stopOpacity: 0.12 }} />
            <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.1 }} />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#0ea5e9', stopOpacity: 0.08 }} />
            <stop offset="50%" style={{ stopColor: '#0891b2', stopOpacity: 0.06 }} />
            <stop offset="100%" style={{ stopColor: '#0284c7', stopOpacity: 0.05 }} />
          </linearGradient>
        </defs>
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" />
        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" />
        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
      </svg>
      
      {/* Secondary wave layer */}
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={`absolute top-0 left-0 w-full h-16 md:h-20 ${flip ? "rotate-180" : ""}`}
        fill="url(#waveGradient2)"
      >
        <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
      </svg>
    </div>
  );
};

export default WaveDecoration;
