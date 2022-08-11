import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import Modal from "../components/Modal";
import useTransaction from "../hooks/useTransaction";
import { ITransaction } from "../types/ITransaction";
import dayjs from "dayjs";
import useAxios from "../hooks/useAxios";

const Transactions = () => {
  const api = useAxios();
  const { transactions, refetch } = useTransaction();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);
  const deleteTransaction = useMutation(
    (id: number) => {
      return api.delete(`/transactions/${id}`);
    },
    {
      onSuccess: () => {
        refetch();
        setIsModalOpen(false);
      },
    }
  );

  return (
    <Container>
      <div className="flex justify-between mb-5">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Link
          to="/transactions/new"
          className="btn btn-success normal-case gap-2"
        >
          <FaPlus />
          <span>New Transaction</span>
        </Link>
      </div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.category.name}</td>
              <td>
                <span
                  className={`${
                    transaction.category.type === "INCOME"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }  py-1 px-2 rounded-full text-white font-semibold`}
                >
                  {transaction.category.type}
                </span>
              </td>
              <td>
                {transaction.category.type === "INCOME" ? "+" : "-"}{" "}
                {transaction.amount}
              </td>
              <td>{dayjs(transaction.date).format("DD/MM/YYYY")}</td>
              <td>
                <Link
                  to={`/transactions/${transaction.id}`}
                  className="btn btn-ghost btn-square"
                >
                  <FaEdit />
                </Link>

                <button
                  className="btn btn-ghost btn-square text-red-400"
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedTransaction(transaction);
                  }}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedTransaction && (
        <Modal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          title="Delete Transaction"
        >
          <p className="my-2">
            Are you sure you want to delete the transaction{" "}
            <span className="text-red-400">
              {selectedTransaction?.category.name}
            </span>
            ?
          </p>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              className="btn btn-ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-error"
              onClick={() => deleteTransaction.mutate(selectedTransaction.id)}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </Container>
  );
};

export default Transactions;
