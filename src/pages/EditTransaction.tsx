import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../components/Container";
import TransactionForm from "../components/TransactionForm";
import useTransaction from "../hooks/useTransaction";
import api from "../lib/axios";

const EditTransaction = () => {
  const navigate = useNavigate();
  const { editTransaction } = useTransaction();
  const { id } = useParams();
  const { data: transaction, isLoading } = useQuery(
    ["transaction", id],
    async () => {
      try {
        const { data } = await api.get(`/transactions/${id}`);
        return data;
      } catch (error: any) {
        console.log(error);
        if (error.response.status === 403) {
          navigate("/transactions");
        }
      }
    }
  );

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-5">Edit Transaction</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <TransactionForm
          initialValues={{
            transactionId: transaction.id,
            category_id: transaction.category.id,
            amount: transaction.amount,
            date: transaction.date,
            description: transaction.description,
          }}
          mutation={editTransaction}
        />
      )}
    </Container>
  );
};

export default EditTransaction;
