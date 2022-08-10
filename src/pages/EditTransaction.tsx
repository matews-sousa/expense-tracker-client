import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Container from "../components/Container";
import TransactionForm from "../components/TransactionForm";
import useTransaction from "../hooks/useTransaction";
import api from "../lib/api";

const EditTransaction = () => {
  const { editTransaction } = useTransaction();
  const { id } = useParams();
  const { data: transaction, isLoading } = useQuery(
    ["transaction", id],
    async () => {
      const { data } = await api.get(`/transactions/${id}`);
      return data;
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-5">Edit Transaction</h1>
      <TransactionForm
        initialValues={{
          transactionId: transaction.id,
          categoryId: transaction.category.id,
          amount: transaction.amount,
          date: transaction.date,
          description: transaction.description,
        }}
        mutation={editTransaction}
      />
    </Container>
  );
};

export default EditTransaction;
