// Hand-drawn packaging as inline SVG so the lineup is self-contained
// and every label stays on the site's own type system.

const LABEL_BG = '#221a14'
const BONE = '#f1e9dc'
const SMOKE = '#a39a8f'

function LabelText({ x, y, size, fill, weight = 700, spacing = 1, family = 'Big Shoulders', children }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontFamily={family}
      fontWeight={weight}
      fontSize={size}
      letterSpacing={spacing}
      fill={fill}
    >
      {children}
    </text>
  )
}

export function Tin({ num, name, sub, accent, id }) {
  const grad = `tin-shade-${id}`
  return (
    <svg viewBox="0 0 200 250" role="img" aria-label={`${name} ${sub} tin`}>
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.42" />
          <stop offset="0.18" stopColor="#000" stopOpacity="0" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.8" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={`${grad}-lid`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6b625a" />
          <stop offset="0.5" stopColor="#c8bfb4" />
          <stop offset="1" stopColor="#5c544d" />
        </linearGradient>
        <linearGradient id={`${grad}-rim`} x1="0" y1="1" x2="0.35" y2="0">
          <stop offset="0" stopColor="#ff5a1f" stopOpacity="0.35" />
          <stop offset="0.35" stopColor="#ff5a1f" stopOpacity="0.08" />
          <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* body */}
      <rect x="18" y="28" width="164" height="210" rx="10" fill={LABEL_BG} />
      {/* lid */}
      <ellipse cx="100" cy="28" rx="82" ry="14" fill={`url(#${grad}-lid)`} />
      <ellipse cx="100" cy="26" rx="74" ry="11" fill="#8d857b" />
      <ellipse cx="100" cy="25" rx="60" ry="8" fill="#a29a90" opacity="0.75" />
      <path d="M 44 23 A 64 8 0 0 1 156 23" stroke="#e8e2d8" strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* label frame */}
      <rect x="27" y="38" width="146" height="192" rx="6" fill="none" stroke="rgba(241,233,220,0.14)" />
      {/* label content */}
      <LabelText x="100" y="62" size="11" fill={SMOKE} family="IBM Plex Mono" weight={500} spacing={2.5}>
        EMBER &amp; OAK
      </LabelText>
      <line x1="44" y1="72" x2="156" y2="72" stroke={accent} strokeWidth="1.5" />
      <LabelText x="100" y="118" size="46" fill={BONE} spacing={1}>
        {`Nº ${num}`}
      </LabelText>
      <LabelText x="100" y="152" size="27" fill={accent} spacing={2}>
        {name}
      </LabelText>
      <LabelText x="100" y="174" size="13" fill={SMOKE} family="IBM Plex Mono" weight={400} spacing={3}>
        {sub}
      </LabelText>
      <line x1="44" y1="192" x2="156" y2="192" stroke={accent} strokeWidth="1.5" />
      <LabelText x="100" y="214" size="9.5" fill={SMOKE} family="IBM Plex Mono" weight={400} spacing={1.5}>
        NET WT 4 OZ
      </LabelText>
      {/* cylinder shading + ember rim light from below */}
      <rect x="18" y="28" width="164" height="210" rx="10" fill={`url(#${grad})`} />
      <rect x="18" y="28" width="164" height="210" rx="10" fill={`url(#${grad}-rim)`} />
    </svg>
  )
}

export function Bottle({ num, name, sub, accent, id }) {
  const grad = `bottle-shade-${id}`
  return (
    <svg viewBox="0 0 200 290" role="img" aria-label={`${name} ${sub} bottle`}>
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.45" />
          <stop offset="0.2" stopColor="#000" stopOpacity="0" />
          <stop offset="0.48" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="0.82" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* cap */}
      <rect x="78" y="8" width="44" height="30" rx="4" fill="#111" />
      <rect x="78" y="14" width="44" height="3" fill="#333" />
      <rect x="78" y="21" width="44" height="3" fill="#333" />
      {/* neck + shoulders + body */}
      <path
        d="M82 38 h36 v22 c0 8 34 14 34 34 v176 c0 8 -6 12 -14 12 H62 c-8 0 -14 -4 -14 -12 V94 c0 -20 34 -26 34 -34 Z"
        fill="#2b1006"
      />
      {/* label */}
      <rect x="48" y="118" width="104" height="132" rx="4" fill={LABEL_BG} />
      <LabelText x="100" y="140" size="9.5" fill={SMOKE} family="IBM Plex Mono" weight={500} spacing={2}>
        EMBER &amp; OAK
      </LabelText>
      <line x1="62" y1="148" x2="138" y2="148" stroke={accent} strokeWidth="1.5" />
      <LabelText x="100" y="184" size="36" fill={BONE}>
        {`Nº ${num}`}
      </LabelText>
      <LabelText x="100" y="211" size="16" fill={accent} spacing={1}>
        {name}
      </LabelText>
      <LabelText x="100" y="228" size="8.5" fill={SMOKE} family="IBM Plex Mono" weight={400} spacing={1}>
        {sub}
      </LabelText>
      <line x1="62" y1="238" x2="138" y2="238" stroke={accent} strokeWidth="1.5" />
      {/* glass shading */}
      <path
        d="M82 38 h36 v22 c0 8 34 14 34 34 v176 c0 8 -6 12 -14 12 H62 c-8 0 -14 -4 -14 -12 V94 c0 -20 34 -26 34 -34 Z"
        fill={`url(#${grad})`}
      />
    </svg>
  )
}
