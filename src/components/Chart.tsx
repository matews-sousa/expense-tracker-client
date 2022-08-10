import "chart.js/auto";
import { Chart as ChartJS } from "react-chartjs-2";
import type { ChartType } from "chart.js";

interface Props {
  type: ChartType;
  data: any;
}

const Chart = ({ type, data }: Props) => {
  return <ChartJS type={type} data={data} />;
};

export default Chart;
