import Container from "../components/Container";
import TransactionForm from "../components/TransactionForm";
import useTransaction from "../hooks/useTransaction";

const NewTransaction = () => {
  const { newTransaction } = useTransaction();

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-5">New Transaction</h1>
      <TransactionForm
        initialValues={{
          categoryId: "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
          description: "",
        }}
        mutation={newTransaction}
      />
    </Container>
  );
};

export default NewTransaction;
