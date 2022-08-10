import Container from "../components/Container";
import { useAuth } from "../context/AuthProvider";
import TransactionCard from "../components/TransactionCard";
import useTransaction from "../hooks/useTransaction";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { ICategory } from "../types/ITransaction";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import stringToColor from "string-to-color";
import getTotalPerMonth from "../utils/getTotalPerMonth";
import Chart from "../components/Chart";

dayjs.extend(localeData);

const Home = () => {
  const { currentUser } = useAuth();
  const { transactions, income, expense } = useTransaction();
  const { data: categories } = useQuery<ICategory[]>(
    ["categories"],
    async () => {
      const { data } = await api.get(`/categories`);
      return data;
    }
  );

  // sort by date
  const sortedTransactions = transactions?.sort((a, b) => {
    return dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1;
  });

  // count the number of transactions per category
  const categoryCount = categories?.map((category) => {
    return transactions?.filter((transaction) => {
      return transaction.category.id === category.id;
    }).length;
  });

  const pieData = {
    labels: categories?.map((category) => category.name),
    datasets: [
      {
        label: "Transactions per category",
        data: categoryCount,
        backgroundColor: categories?.map((category) =>
          stringToColor(category.name)
        ),
        hoverOffset: 4,
      },
    ],
  };

  const lineData = {
    labels: dayjs.months(),
    datasets: [
      {
        label: "Incomes",
        data: getTotalPerMonth(income),
        fill: false,
        borderColor: "rgb(115, 224, 124)",
        tension: 0.1,
      },
      {
        label: "Expenses",
        data: getTotalPerMonth(expense),
        fill: false,
        borderColor: "rgb(243, 84, 84)",
        tension: 0.1,
      },
    ],
  };

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-5">Welcome, {currentUser?.name}!</h1>
      <div className="grid grid-cols-3 gap-4">
        <TransactionCard title="Total Income" type="income" />
        <TransactionCard title="Total Expense" type="expense" />
        <TransactionCard title="Balance" type="balance" />
        <div className="col-span-1">
          <div className="w-full bg-gray-800 rounded-md p-4">
            <h2 className="text-2xl font-semibold mb-4">
              Transactions per category
            </h2>
            <Chart type="doughnut" data={pieData} />
          </div>
          <div className="w-full bg-gray-800 rounded-md p-4 mt-4">
            <h2 className="text-2xl font-semibold mb-4">Recent transactions</h2>
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions
                  ?.slice(0, sortedTransactions.length - 1)
                  .map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.category.name}</td>
                      <td>{dayjs(transaction.date).format("DD/MM/YYYY")}</td>
                      <td>
                        {transaction.category.type === "INCOME" ? "+" : "-"}{" "}
                        {transaction.amount}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-span-2">
          <div className="w-full bg-gray-800 rounded-md p-4">
            <h2 className="text-2xl font-semibold mb-4">
              Incomes and Expenses per month
            </h2>
            <Chart type="line" data={lineData} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Home;
