import {
  Bar
} from "react-chartjs-2";

interface Props {
  data:any[];
}

const ReservationsChart = ({
  data
}:Props) => {

  const chartData = {

    labels: data.map(
      item => `M${item.mois}`
    ),

    datasets: [
      {
        label:
          "Réservations",

        data: data.map(
          item => item.total
        )
      }
    ]
  };

  return (

    <Bar
      data={chartData}
    />

  );
};

export default ReservationsChart;