import { Duration } from "luxon";
import { type CSSProperties, useEffect, useState } from "react";

type Props = Readonly<{
  startDate: Date;
  currentDate?: Date;
  format?: string;
  interval?: number;
  style?: CSSProperties;
  className?: string;
}>;

export const RealtimeDuration = ({
  startDate,
  currentDate,
  format = "mm:ss",
  interval = 1000,
  style,
  className,
}: Props) => {
  const [duration, setDuration] = useState(
    Duration.fromMillis((currentDate ?? new Date()).getTime() - startDate.getTime()),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(Duration.fromMillis((currentDate ?? new Date()).getTime() - startDate.getTime()));
    }, interval);

    return () => clearInterval(timer);
  }, [startDate, currentDate, interval]);

  return (
    <time dateTime={duration.toISO()} style={style} className={className}>
      {duration.toFormat(format)}
    </time>
  );
};
