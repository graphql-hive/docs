export function ReactLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-11.5 -10.23174 23 20.46348" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect
        fill="url(#react_paint0_linear)"
        height={20.463_48}
        mask="url(#react_logo_mask)"
        width={23}
        x={-11.5}
        y={-10.231_74}
      />
      <defs>
        <g id="react_logo_icon">
          <circle fill="#fff" r={2.05} />
          <g fill="none" stroke="#fff" strokeWidth={1}>
            <ellipse rx={11} ry={4.2} />
            <ellipse rx={11} ry={4.2} transform="rotate(60)" />
            <ellipse rx={11} ry={4.2} transform="rotate(120)" />
          </g>
        </g>
        <mask
          height={20.463_48}
          id="react_logo_mask"
          maskContentUnits="userSpaceOnUse"
          maskUnits="userSpaceOnUse"
          width={23}
          x={-11.5}
          y={-10.231_74}
        >
          <use href="#react_logo_icon" />
        </mask>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="react_paint0_linear"
          x1={-11.5}
          x2={11.5}
          y1={-10.231_74}
          y2={10.231_74}
        >
          <stop stopColor="#8CBEB3" />
          <stop offset={1} stopColor="#68A8B6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
