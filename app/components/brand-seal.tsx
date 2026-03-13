import Image from "next/image";

type BrandSealProps = {
  className?: string;
};

export function BrandSeal({ className }: BrandSealProps) {
  return (
    <Image
      src="/logo-clean.png"
      alt="Dhyan Yog Kendra Evam Prakratik Chikitsa Shodh Sansthan logo"
      width={320}
      height={320}
      className={className}
      priority
    />
  );
}
