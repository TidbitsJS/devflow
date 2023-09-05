import Link from "next/link";
import Image from "next/image";

interface MetricProps {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles: string;
  isAuthor?: boolean;
}

export const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  isAuthor,
}: MetricProps) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={`object-contain ${href ? "rounded-full" : ""}`}
      />

      <p className={`${textStyles} flex gap-1 max-sm:items-center`}>
        {value}
        <span className='small-regular line-clamp-1'> {title}</span>
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`flex-center gap-1`}>
        {metricContent}
      </Link>
    );
  }

  return <div className='flex-center flex-wrap gap-1'>{metricContent}</div>;
};
