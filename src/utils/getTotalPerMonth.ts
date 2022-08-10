import dayjs from "dayjs";
import { ITransaction } from "../types/ITransaction";

const getTotalPerMonth = (transactions?: ITransaction[]) => {
  const months = dayjs.months();

  const totalPerMonth = months.map((month) => {
    return transactions
      ?.filter((inc) => {
        const m = dayjs(inc.date).format("MMMM");
        return m === month;
      })
      .reduce((acc, curr) => {
        return acc + Number(curr.amount);
      }, 0);
  });

  return totalPerMonth;
};

export default getTotalPerMonth;
