import { FaDollarSign } from "react-icons/fa";
import useTransaction from "../hooks/useTransaction";

interface Props {
  title: string;
  type: "income" | "expense" | "balance";
}

const TransactionCard = ({ title, type }: Props) => {
  const { totalIncome, totalExpense, balance } = useTransaction();

  const color =
    type === "income"
      ? "text-green-500"
      : type === "expense"
      ? "text-red-500"
      : "text-blue-500";

  return (
    <div className="flex">
      <div className="bg-gray-700 px-6 flex items-center rounded-l-md">
        <FaDollarSign className={`w-12 h-12 ${color}`} />
      </div>
      <div className="bg-gray-800 flex flex-1 flex-col justify-center px-8 py-3 rounded-r-md">
        <h3>{title}</h3>
        <h1 className="text-3xl font-semibold text-white">
          $
          {type === "income"
            ? totalIncome
            : type === "expense"
            ? totalExpense
            : balance}
        </h1>
      </div>
    </div>
  );
};

export default TransactionCard;
