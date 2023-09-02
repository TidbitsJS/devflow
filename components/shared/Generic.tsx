import Link from "next/link";
import Image from "next/image";

interface MetricProps {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles: string;
}

export const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
}: MetricProps) => {
  const metricContent = (
    <>
      <Image src={imgUrl} width={16} height={16} alt={alt} />

      <p className={textStyles}>
        {value}
        <span className='small-regular'> {title}</span>
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className='flex-center gap-1'>
        {metricContent}
      </Link>
    );
  }

  return <div className='flex-center gap-1'>{metricContent}</div>;
};
