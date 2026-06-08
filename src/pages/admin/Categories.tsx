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

declare var bootstrap: any;

const Categories = () => {

  const [categories,
    setCategories] = useState([]);

  const [selectedCategory,
    setSelectedCategory] =
    useState<any>(null);

  const [search,
    setSearch] =
    useState("");

  useEffect(() => {

    fetchCategories();

  }, []);

  const fetchCategories =
  async () => {

    const data =
      await getCategories();

    setCategories(data);
  };

  const handleSave =
  async (formData:any) => {

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

      bootstrap.Modal
      .getInstance(
        document.getElementById(
          "categoryModal"
        )
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
      (category:any) =>
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

          new bootstrap.Modal(
            document.getElementById(
              "categoryModal"
            )
          ).show();

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