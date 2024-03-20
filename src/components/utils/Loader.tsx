/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useLoading, Grid } from "@agney/react-loading";

interface LoaderProps {}

export const Loader: React.FC<LoaderProps> = () => {
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Grid width="50" className="text-purple-400" />,
  });
  return (
    <div className="flex h-56  flex-col items-center justify-center">
      <span {...containerProps}>{indicatorEl}</span>
    </div>
  );
};