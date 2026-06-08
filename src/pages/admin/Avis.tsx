import {
  useEffect,
  useState
} from "react";

import DashboardLayout from
"../../components/dashboard/DashboardLayout";

import AdminSidebar from
"../../components/dashboard/AdminSidebar";

import ReviewsTable from
"../../components/admin/ReviewsTable";

import ReviewDetailsModal from
"../../components/admin/ReviewDetailsModal";

import {
  getReviews,
  deleteReview
}
from "../../services/reviewAdminService";

import {
  toast
} from "react-toastify";

declare var bootstrap:any;

export const Avis = () => {

  const [reviews,
    setReviews] =
    useState([]);

  const [selectedReview,
    setSelectedReview] =
    useState<any>(null);

  const [search,
    setSearch] =
    useState("");

  const [rating,
    setRating] =
    useState("all");

  useEffect(() => {

    fetchReviews();

  }, []);

  const fetchReviews =
  async () => {

    const data =
      await getReviews();

    setReviews(data);
  };

  const handleDelete =
  async (id:number) => {

    if(
      !window.confirm(
        "Supprimer cet avis ?"
      )
    ) return;

    await deleteReview(id);

    toast.success(
      "Avis supprimé"
    );

    fetchReviews();
  };

  const filteredReviews =
    reviews.filter(
      (review:any)=>{

        const matchSearch =
          review.user?.nom
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchRating =
          rating === "all"
          ? true
          : review.note ===
            parseInt(rating);

        return (
          matchSearch &&
          matchRating
        );
      }
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
          Gestion des Avis
        </h2>

      </div>

      <div className="row mb-4">

        <div className="col-md-6">

          <input
            type="text"
            className="form-control"
            placeholder="Rechercher un auteur..."
            value={search}
            onChange={(e)=>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <div className="col-md-3">

          <select
            className="form-select"
            value={rating}
            onChange={(e)=>
              setRating(
                e.target.value
              )
            }
          >

            <option value="all">
              Toutes les notes
            </option>

            <option value="5">
              ⭐⭐⭐⭐⭐
            </option>

            <option value="4">
              ⭐⭐⭐⭐
            </option>

            <option value="3">
              ⭐⭐⭐
            </option>

            <option value="2">
              ⭐⭐
            </option>

            <option value="1">
              ⭐
            </option>

          </select>

        </div>

      </div>

      <ReviewsTable
        reviews={
          filteredReviews
        }
        onView={(review)=>{

          setSelectedReview(
            review
          );

          new bootstrap.Modal(
            document.getElementById(
              "reviewDetailsModal"
            )
          ).show();

        }}
        onDelete={
          handleDelete
        }
      />

      <ReviewDetailsModal
        review={
          selectedReview
        }
      />

    </DashboardLayout>
  );
};

export default Avis;