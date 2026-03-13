type BrandSealProps = {
  className?: string;
};

export function BrandSeal({ className }: BrandSealProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="120" cy="120" r="114" className="seal-ring" />
      <circle cx="120" cy="120" r="98" className="seal-ring-inner" />
      <circle cx="120" cy="120" r="77" className="seal-core" />
      <path
        className="seal-glow"
        d="M120 55C88 55 63 78 56 109c18-16 41-26 64-26s46 10 64 26c-7-31-32-54-64-54Z"
      />
      <path
        className="seal-mountain"
        d="M58 146c12-17 24-30 34-30 8 0 13 10 20 10 9 0 16-15 27-15 11 0 17 16 28 16 10 0 16-12 23-12 10 0 20 12 32 31H58Z"
      />
      <path className="seal-water" d="M54 157c18 8 44 13 66 13 22 0 48-5 66-13v20H54v-20Z" />
      <path
        className="seal-lotus"
        d="M119 183c-8-13-12-22-12-30 8 5 12 10 12 14 0-4 4-9 12-14 0 8-4 17-12 30Z"
      />
      <path className="seal-lotus" d="M94 187c-9-7-15-15-18-24 10 1 18 4 24 10-1 5-3 10-6 14Z" />
      <path className="seal-lotus" d="M146 187c3-4 5-9 6-14 6-6 14-9 24-10-3 9-9 17-18 24Z" />
      <path
        className="seal-body"
        d="M120 101c10 0 18 8 18 18 0 8-5 14-10 19 8 4 15 12 19 24l-12 6c-4-14-9-22-15-22s-11 8-15 22l-12-6c4-12 11-20 19-24-5-5-10-11-10-19 0-10 8-18 18-18Z"
      />
      <path className="seal-body" d="M106 93c0-7 6-13 14-13s14 6 14 13-6 13-14 13-14-6-14-13Z" />
      <path
        className="seal-trunk"
        d="M120 82c9-14 14-29 14-43 12 16 13 34 6 47 12-11 26-17 42-18-13 15-28 24-43 25 15 5 27 13 36 24-18-4-33-12-44-24 4 18 2 35-7 50-9-15-11-32-7-50-11 12-26 20-44 24 9-11 21-19 36-24-15-1-30-10-43-25 16 1 30 7 42 18-7-13-6-31 6-47 0 14 5 29 14 43Z"
      />
      <g className="seal-leaves">
        <path d="M87 58c7 5 10 12 10 21-9-4-14-11-16-20 2-2 4-2 6-1Z" />
        <path d="M153 58c-7 5-10 12-10 21 9-4 14-11 16-20-2-2-4-2-6-1Z" />
        <path d="M70 74c9 2 15 8 19 16-9 0-17-4-22-12 0-2 1-3 3-4Z" />
        <path d="M170 74c-9 2-15 8-19 16 9 0 17-4 22-12 0-2-1-3-3-4Z" />
        <path d="M61 96c10 0 18 5 24 12-10 2-19-1-27-8-1-1 0-3 3-4Z" />
        <path d="M179 96c-10 0-18 5-24 12 10 2 19-1 27-8 1-1 0-3-3-4Z" />
        <path d="M93 45c5 6 7 13 5 21-7-4-11-10-12-18 2-2 4-3 7-3Z" />
        <path d="M147 45c-5 6-7 13-5 21 7-4 11-10 12-18-2-2-4-3-7-3Z" />
      </g>
    </svg>
  );
}
