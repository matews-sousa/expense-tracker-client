import CategoryForm from "../components/CategoryForm";
import Container from "../components/Container";
import useCategory from "../hooks/useCategory";

const NewCategory = () => {
  const { newCategory } = useCategory();

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-5">New Category</h1>
      <CategoryForm
        initialValues={{
          name: "",
          type: "EXPENSE",
        }}
        mutation={newCategory}
      />
    </Container>
  );
};

export default NewCategory;
