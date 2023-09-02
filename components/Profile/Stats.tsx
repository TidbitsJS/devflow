import Image from "next/image";

import { formatNumber } from "@/lib/utils";

interface StatsCardProps {
  imgUrl: string;
  value: number;
  title: string;
}

const StatsCard = ({ imgUrl, value, title }: StatsCardProps) => {
  return (
    <div className='light-border card-wrapper2 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-stat-card'>
      <Image src={imgUrl} alt='gold medal icon' width={40} height={50} />
      <div>
        <p className='paragraph-semibold heading2-color'>{value}</p>
        <p className='body-medium body-color'>{title}</p>
      </div>
    </div>
  );
};

interface Props {
  totalQuestions: number;
  totalAnswers: number;
}

const Stats = ({ totalQuestions, totalAnswers }: Props) => {
  return (
    <div className='mt-10'>
      <h4 className='h3-semibold heading2-color'>Stats</h4>

      <div className='mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4'>
        <div className='light-border card-wrapper2 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-stat-card'>
          <div>
            <p className='paragraph-semibold heading2-color'>
              {formatNumber(totalQuestions)}
            </p>
            <p className='body-medium body-color'>Questions</p>
          </div>

          <div>
            <p className='paragraph-semibold heading2-color'>
              {formatNumber(totalAnswers)}
            </p>
            <p className='body-medium body-color'>Answers</p>
          </div>
        </div>

        <StatsCard
          imgUrl='/assets/icons/gold-medal.svg'
          value={50}
          title='Gold Badges'
        />

        <StatsCard
          imgUrl='/assets/icons/silver-medal.svg'
          value={50}
          title='Silver Badges'
        />

        <StatsCard
          imgUrl='/assets/icons/bronze-medal.svg'
          value={50}
          title='Bronze Badges'
        />
      </div>
    </div>
  );
};

export default Stats;
