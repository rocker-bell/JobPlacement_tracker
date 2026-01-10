import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const StatChart = ({ title, value, color }) => {
  const data = {
    labels: [title],
    datasets: [
      {
        label: title,
        data: [value],
        backgroundColor: color,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="statistique_card">
      <h3 className="statisque_card_title">{title}</h3>
      <Bar data={data} options={options} />
      <p className="statistique_card_mesure">{value}</p>
    </div>
  );
};

export default StatChart;
