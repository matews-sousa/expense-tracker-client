import Container from "../components/Container";
import { useAuth } from "../context/AuthProvider";
import TransactionCard from "../components/TransactionCard";
import useTransaction from "../hooks/useTransaction";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import stringToColor from "string-to-color";
import getTotalPerMonth from "../utils/getTotalPerMonth";
import Chart from "../components/Chart";
import useCategory from "../hooks/useCategory";
import { Link } from "react-router-dom";

dayjs.extend(localeData);

const Home = () => {
  const { currentUser } = useAuth();
  const { transactions, income, expense } = useTransaction();
  const { categories } = useCategory();

  // sort by date
  const sortedTransactions = transactions?.sort((a, b) => {
    return dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1;
  });
  // get last 5 transactions
  const lastFiveTransactions = sortedTransactions?.slice(0, 5);

  // count the total price of transactions per category
  const totalPerCategory = categories?.map((category) => {
    return transactions?.reduce((acc, transaction) => {
      if (transaction.category.id === category.id) {
        return acc + Number(transaction.amount);
      } else {
        return acc;
      }
    }, 0);
  });
  console.log(totalPerCategory);

  const pieData = {
    labels: categories?.map((category) => category.name),
    datasets: [
      {
        label: "Transactions per category",
        data: totalPerCategory,
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

  const renderMessages = () => {
    if (categories?.length === 0) {
      return (
        <div className="text-center">
          <p className="text-lg">
            You have no categories yet. Let's add some categories. <br />
            <Link
              to="/categories/new"
              className="btn btn-success normal-case mt-4"
            >
              New Category
            </Link>
          </p>
        </div>
      );
    } else if (transactions?.length === 0) {
      return (
        <div className="text-center">
          <p className="text-lg">
            You have no transactions yet. <br />
            Let's start by adding some transactions.
          </p>
          <Link
            to="/transactions/new"
            className="btn btn-success normal-case mt-4"
          >
            New Transaction
          </Link>
        </div>
      );
    }
  };

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-5">Welcome, {currentUser?.name}!</h1>
      {renderMessages()}
      {transactions && transactions?.length > 0 && (
        <>
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <TransactionCard title="Total Income" type="income" />
            <TransactionCard title="Total Expense" type="expense" />
            <TransactionCard title="Balance" type="balance" />
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4 mt-4">
            <div className="col-span-1 mb-4 lg:mb-0">
              <div className="w-full h-full bg-gray-800 rounded-md p-4">
                <h2 className="text-lg lg:text-2xl font-semibold mb-4">
                  Total per category
                </h2>
                <Chart type="doughnut" data={pieData} />
              </div>
            </div>
            <div className="col-span-2">
              <div className="w-full bg-gray-800 rounded-md p-4">
                <h2 className="text-lg lg:text-2xl font-semibold mb-4">
                  Incomes and Expenses per month
                </h2>
                <Chart type="line" data={lineData} />
              </div>
            </div>
          </section>
          <section className="w-full bg-gray-800 rounded-md p-4 mt-4">
            <h2 className="text-lg lg:text-2xl font-semibold mb-4">
              Recent transactions
            </h2>
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {lastFiveTransactions?.map((transaction) => (
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
          </section>
        </>
      )}
    </Container>
  );
};

export default Home;
