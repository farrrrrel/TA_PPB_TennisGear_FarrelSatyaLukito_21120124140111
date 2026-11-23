import React from 'react';

export default function ProductArt({ category = 'rackets', accent = '#b9e16d', variant = '', hero = false }) {
  const seed = Array.from(String(variant)).reduce((a, c) => a + c.charCodeAt(0), 0);
  const rotate = (seed % 12) - 6;
  const rack = category === 'rackets';
  const shoe = category === 'shoes';
  const bag = category === 'bags';
  const accessory = category === 'accessories';
  const uid = `art-${String(variant).replace(/[^a-z0-9]/gi, '').slice(0, 16)}-${category}`;
  return (
    <svg className={`product-art ${hero ? 'product-art--hero' : ''}`} viewBox="0 0 440 370" role="img" aria-label={`Illustration of tennis ${category.slice(0,-1) || category}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${uid}-surface`} x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor={accent}/><stop offset=".66" stopColor={accent}/><stop offset="1" stopColor="#283d39"/></linearGradient>
        <linearGradient id={`${uid}-shade`} x1="0" x2="1"><stop offset="0" stopColor="#182822"/><stop offset=".53" stopColor="#354d43"/><stop offset="1" stopColor="#0c1919"/></linearGradient>
        <filter id={`${uid}-blur`}><feGaussianBlur stdDeviation="15"/></filter>
      </defs>
      <ellipse cx="220" cy="324" rx="118" ry="12" fill="#1b2822" opacity=".12" filter={`url(#${uid}-blur)`}/>
      {rack && (
        <g transform={`translate(220 173) rotate(${-28 + rotate})`}>
          <rect x="-12" y="74" width="24" height="151" rx="9" fill={`url(#${uid}-shade)`}/>
          <rect x="-11" y="157" width="22" height="68" rx="5" fill="#132421"/>
          {Array.from({length:8},(_,i)=><path key={`g${i}`} d={`M-10 ${164+i*8} L10 ${170+i*8}`} stroke="#879b90" strokeWidth="2" opacity=".62"/>)}
          <rect x="-16" y="221" width="32" height="8" rx="3" fill="#111b1b"/>
          <path d="M-43 54 L-14 119 L-8 132 M43 54 L14 119 L8 132" stroke={`url(#${uid}-shade)`} strokeWidth="9" strokeLinecap="round" fill="none"/>
          <ellipse cx="0" cy="-41" rx="79" ry="112" fill="none" stroke="#1a302b" strokeWidth="18"/>
          <ellipse cx="0" cy="-41" rx="79" ry="112" fill="none" stroke={accent} strokeWidth="8"/>
          <ellipse cx="0" cy="-41" rx="65" ry="98" fill="#f0f4ec" fillOpacity=".18" stroke="#1a302b" strokeWidth="3"/>
          {Array.from({length:11},(_,i)=>{
            const x=-54+i*10.8, h=98*Math.sqrt(Math.max(0,1-(x*x)/(65*65)));
            return <line key={`v${i}`} x1={x} x2={x} y1={-41-h} y2={-41+h} stroke="#72847e" opacity=".52" strokeWidth="1.5"/>;
          })}
          {Array.from({length:15},(_,i)=>{
            const y=-126+i*12, w=65*Math.sqrt(Math.max(0,1-((y+41)*(y+41))/(98*98)));
            return <line key={`h${i}`} x1={-w} x2={w} y1={y} y2={y} stroke="#667b71" opacity=".5" strokeWidth="1.5"/>;
          })}
          <path d="M-58 -99 C-47 -119 -20 -131 -2 -133" stroke="#fff" strokeWidth="3" opacity=".5" fill="none"/>
          <path d="M-24 92 H24" stroke={accent} strokeWidth="6" strokeLinecap="round"/>
        </g>
      )}
      {shoe && (
        <g transform={`translate(29 10) rotate(${rotate/2} 210 210)`}>
          <path d="M53 258 C73 244 113 223 136 182 C157 146 178 133 195 145 L244 170 C258 179 260 214 283 227 C311 240 353 249 370 259 C378 264 380 279 371 287 C357 297 313 298 273 298 L100 298 C69 298 51 290 53 258Z" fill={`url(#${uid}-surface)`} stroke="#24352d" strokeWidth="5"/>
          <path d="M128 219 Q171 196 201 169 L250 196 Q249 218 276 239 Q235 253 184 250 Q146 246 128 219Z" fill={`url(#${uid}-shade)`} opacity=".88"/>
          <path d="M60 265 C89 273 108 269 134 271 C198 276 255 276 310 274 Q352 270 378 274 L375 291 Q360 314 306 315 L91 315 Q56 313 47 296 Q45 281 60 265Z" fill="#f7f8f2" stroke="#32463a" strokeWidth="4"/>
          <path d="M61 302 Q107 317 144 311 M223 311 Q296 325 364 302" stroke="#b6bbb3" strokeWidth="5" fill="none"/>
          <path d="M134 220 L232 251 M150 205 L248 236 M166 191 L256 218" stroke="#f4f7f1" strokeWidth="5" strokeLinecap="round"/>
          <path d="M276 238 Q300 248 357 259" stroke="#f7f8f2" strokeWidth="10" opacity=".82" fill="none"/>
          <path d="M84 267 C116 253 132 246 145 218" fill="none" stroke="#253d30" strokeWidth="10" opacity=".65"/>
          <circle cx="332" cy="291" r="5" fill={accent}/>
        </g>
      )}
      {bag && (
        <g transform={`translate(15 4) rotate(${rotate/3} 220 210)`}>
          <path d="M130 146 Q161 109 231 119 Q277 120 304 149" fill="none" stroke="#58695f" strokeWidth="19" strokeLinecap="round"/>
          <path d="M70 165 Q80 144 117 144 L317 140 Q353 146 362 176 L379 260 Q380 283 351 295 L88 293 Q58 290 54 270Z" fill={`url(#${uid}-shade)`} stroke="#24382e" strokeWidth="5"/>
          <path d="M95 161 L319 158 Q345 161 351 184 L362 258 Q362 275 344 282 L95 283 Q75 278 73 258Z" fill={accent} opacity=".85"/>
          <path d="M142 156 L148 280 M283 158 L290 280" stroke="#243d32" strokeWidth="10" opacity=".8"/>
          <path d="M105 190 Q212 204 333 186" stroke="#fff" strokeWidth="3" opacity=".47" fill="none"/>
          <rect x="171" y="213" width="94" height="26" rx="13" fill="#182e29"/>
          <path d="M181 225 H257" stroke="#e7efdc" strokeWidth="2.5" opacity=".7"/>
          <rect x="103" y="140" width="36" height="35" rx="6" fill="#1a302a"/>
          <rect x="290" y="139" width="36" height="35" rx="6" fill="#1a302a"/>
          <path d="M61 270 L379 270" stroke="#172d25" strokeWidth="9" opacity=".65"/>
        </g>
      )}
      {accessory && (
        <g transform={`translate(220 179) rotate(${rotate})`}>
          {variant.includes('grip') || variant.includes('string') || variant.includes('lynx') || variant.includes('alu') ? (
            <>
              <ellipse cx="0" cy="22" rx="101" ry="101" fill={`url(#${uid}-shade)`} stroke={accent} strokeWidth="17"/>
              <ellipse cx="0" cy="22" rx="61" ry="61" fill="#f5f6f2" stroke="#d4ddd3" strokeWidth="8"/>
              <ellipse cx="0" cy="22" rx="32" ry="32" fill="#b7c4b4"/>
              <path d="M-74 -50 C-14 -108 92 -49 100 28" fill="none" stroke="#fff" strokeWidth="6" opacity=".34"/>
            </>
          ) : (
            <>
              <circle cx="0" cy="20" r="102" fill={accent} stroke="#d6e8a8" strokeWidth="3"/>
              <path d="M-81 -40 C-38 -39 -12 -6 -5 26 C2 69 34 83 80 74" fill="none" stroke="#f7f8de" strokeWidth="13"/>
              <path d="M80 -40 C33 -43 9 -9 4 26 C-6 72 -38 82 -80 72" fill="none" stroke="#f7f8de" strokeWidth="13"/>
              <circle cx="-24" cy="-29" r="33" fill="#fff" opacity=".12"/>
            </>
          )}
        </g>
      )}
    </svg>
  );
}
