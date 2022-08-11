import { useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import Modal from "../components/Modal";
import useCategory from "../hooks/useCategory";
import { ICategory } from "../types/ITransaction";

const Categories = () => {
  const { categories, deleteCategory } = useCategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );

  return (
    <Container>
      <div className="flex justify-between mb-5">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link
          to="/categories/new"
          className="btn btn-success normal-case gap-2"
        >
          <FaPlus />
          <span>New Category</span>
        </Link>
      </div>
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
                <Link
                  to={`/categories/${category.id}`}
                  className="btn btn-ghost btn-square"
                >
                  <FaEdit />
                </Link>

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
