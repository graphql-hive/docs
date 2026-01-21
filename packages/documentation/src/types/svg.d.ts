declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.svg?svgr' {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}
