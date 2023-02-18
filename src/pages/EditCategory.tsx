import { useQuery } from "@tanstack/react-query";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import CategoryForm from "../components/CategoryForm";
import Container from "../components/Container";
import useCategory from "../hooks/useCategory";
import api from "../lib/axios";

const EditCategory = () => {
  const navigate = useNavigate();
  const { updateCategory } = useCategory();
  const { id } = useParams();
  const { data: category, isLoading } = useQuery(
    ["category", id],
    async () => {
      try {
        const { data } = await api.get(`/categories/${id}`);
        return data;
      } catch (error: any) {
        console.log(error);
        if (error.response.status === 403) {
          navigate("/categories");
        }
      }
    },
    {
      retry: false,
    }
  );

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
