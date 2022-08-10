import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import CategoryForm from "../components/CategoryForm";
import Container from "../components/Container";
import Modal from "../components/Modal";
import api from "../lib/api";
import { ICategory } from "../types/ITransaction";

const Categories = () => {
  const { data: categories, refetch } = useQuery<ICategory[]>(
    ["categories"],
    async () => {
      const { data } = await api.get("/categories");
      return data;
    }
  );
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const newCategory = useMutation(
    (data: { name: string; type: "INCOME" | "EXPENSE" }) => {
      return api.post("/categories", data);
    },
    {
      onSuccess: () => {
        refetch();
        setIsNewCategoryModalOpen(false);
      },
    }
  );
  const updateCategory = useMutation(
    (data: { name: string; type: "INCOME" | "EXPENSE" }) => {
      return api.put(`/categories/${selectedCategory?.id}`, data);
    },
    {
      onSuccess: () => {
        refetch();
        setIsEditCategoryModalOpen(false);
      },
    }
  );
  const deleteCategory = useMutation(
    (id: number) => {
      return api.delete(`/categories/${id}`);
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
        <h1 className="text-3xl font-bold">Categories</h1>
        <button
          onClick={() => setIsNewCategoryModalOpen(true)}
          className="btn btn-success normal-case gap-2"
        >
          <FaPlus />
          <span>New Category</span>
        </button>
      </div>
      <Modal
        title="New Category"
        isOpen={isNewCategoryModalOpen}
        setIsOpen={setIsNewCategoryModalOpen}
      >
        <CategoryForm
          initialValues={{ name: "", type: "EXPENSE" }}
          mutation={newCategory}
        />
      </Modal>
      {selectedCategory && (
        <Modal
          title={`Edit category ${selectedCategory?.name}`}
          isOpen={isEditCategoryModalOpen}
          setIsOpen={setIsEditCategoryModalOpen}
        >
          <CategoryForm
            initialValues={{
              name: selectedCategory.name,
              type: selectedCategory.type,
            }}
            mutation={updateCategory}
          />
        </Modal>
      )}
      <table className="table w-full">
        <thead>
          <tr>
            <th>Category</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>
                <span
                  className={`${
                    category.type === "INCOME" ? "bg-green-500" : "bg-red-500"
                  }  py-1 px-2 rounded-full text-white font-semibold`}
                >
                  {category.type}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-ghost btn-square"
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsEditCategoryModalOpen(true);
                  }}
                >
                  <FaEdit />
                </button>

                <button
                  className="btn btn-ghost btn-square text-red-400"
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedCategory(category);
                  }}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedCategory && (
        <Modal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          title="Delete Category"
        >
          <p className="my-2">
            Are you sure you want to delete the category{" "}
            <span className="text-red-400">{selectedCategory?.name}</span>?
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
              onClick={() => deleteCategory.mutate(selectedCategory.id)}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </Container>
  );
};

export default Categories;
