import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import CategoryForm from "../components/CategoryForm";
import Container from "../components/Container";
import useAxios from "../hooks/useAxios";
import useCategory from "../hooks/useCategory";

const EditCategory = () => {
  const api = useAxios();
  const { updateCategory } = useCategory();
  const { id } = useParams();
  const { data: category, isLoading } = useQuery(["category", id], async () => {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  });

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-5">Edit Category</h1>
      {!category ? (
        <div>Loading...</div>
      ) : (
        <CategoryForm
          initialValues={{
            id: category.id,
            name: category.name,
            type: category.type,
          }}
          mutation={updateCategory}
        />
      )}
    </Container>
  );
};

export default EditCategory;
