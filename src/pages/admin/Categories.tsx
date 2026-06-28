import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from
"../../components/dashboard/DashboardLayout";

import AdminSidebar from
"../../components/dashboard/AdminSidebar";

import CategoriesTable from
"../../components/admin/CategoriesTable";

import CategoryModal from
"../../components/admin/CategoryModal";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
}
from "../../services/categoryService";

import {
  toast
} from "react-toastify";

declare const bootstrap: {
  Modal: {
    new (element: HTMLElement): {
      show: () => void;
    };
    getInstance: (
      element: HTMLElement | null
    ) => { hide: () => void } | null;
  };
};

interface Category {
  id: number;
  name: string;
}

const Categories = () => {

  const [categories,
    setCategories] = useState<Category[]>([]);

  const [selectedCategory,
    setSelectedCategory] =
    useState<Category | null>(null);

  const [search,
    setSearch] =
    useState("");

  async function fetchCategories() {

    const data =
      await getCategories();

    setCategories(data);
  }

  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories();
    };

    void loadCategories();
  }, []);

  const handleSave =
  async (formData: FormData) => {

    try {

      if (
        selectedCategory
      ) {

        await updateCategory(
          selectedCategory.id,
          formData
        );

        toast.success(
          "Catégorie modifiée"
        );

      } else {

        await createCategory(
          formData
        );

        toast.success(
          "Catégorie créée"
        );
      }

      fetchCategories();

      const categoryModalElement =
        document.getElementById(
          "categoryModal"
        );

      bootstrap.Modal
        .getInstance(
          categoryModalElement
        )
        ?.hide();

      setSelectedCategory(
        null
      );

    } catch {

      toast.error(
        "Erreur"
      );
    }
  };

  const handleDelete =
  async (id:number) => {

    if (
      !window.confirm(
        "Supprimer cette catégorie ?"
      )
    ) {
      return;
    }

    await deleteCategory(id);

    toast.success(
      "Catégorie supprimée"
    );

    fetchCategories();
  };

  const filteredCategories =
    categories.filter(
      (category: Category) =>
        category.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (

    <DashboardLayout
      sidebar={<AdminSidebar />}
    >

      <div
        className="d-flex
        justify-content-between
        align-items-center
        mb-4"
      >

        <h2>
          Gestion Catégories
        </h2>

        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#categoryModal"
          onClick={() =>
            setSelectedCategory(
              null
            )
          }
        >
          Ajouter
        </button>

      </div>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Rechercher..."
        value={search}
        onChange={(e)=>
          setSearch(
            e.target.value
          )
        }
      />

      <CategoriesTable
        categories={
          filteredCategories
        }
        onEdit={(category)=>{

          setSelectedCategory(
            category
          );

          const categoryModalElement =
            document.getElementById(
              "categoryModal"
            );

          if (categoryModalElement) {
            new bootstrap.Modal(
              categoryModalElement
            ).show();
          }

        }}
        onDelete={
          handleDelete
        }
      />

      <CategoryModal
        category={
          selectedCategory
        }
        onSave={
          handleSave
        }
      />

    </DashboardLayout>
  );
};

export default Categories;