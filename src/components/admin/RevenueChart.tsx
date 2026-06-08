import {
  Line
} from "react-chartjs-2";

interface Props {
  data:any[];
}

export const RevenueChart = ({
  data
}:Props) => {

  const chartData = {

    labels: data.map(
      item => `M${item.mois}`
    ),

    datasets: [
      {
        label:
          "Revenus",

        data: data.map(
          item => item.total
        )
      }
    ]
  };

  return (

    <Line
      data={chartData}
    />

  );
};

export default RevenueChart;