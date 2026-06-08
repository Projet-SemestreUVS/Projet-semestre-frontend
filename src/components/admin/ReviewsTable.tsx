interface Props {

  reviews:any[];

  onView:(review:any)=>void;

  onDelete:(id:number)=>void;
}

const ReviewsTable = ({
  reviews,
  onView,
  onDelete,
}:Props) => {

  return (

    <div className="table-responsive">

      <table className="table table-hover">

        <thead>

          <tr>

            <th>ID</th>

            <th>Auteur</th>

            <th>Service</th>

            <th>Note</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {reviews.map(
            (review:any)=>(
            <tr
              key={review.id}
            >

              <td>
                {review.id}
              </td>

              <td>
                {review.user?.nom}
              </td>

              <td>
                {review.service?.titre}
              </td>

              <td>

                <span
                  className="badge bg-warning text-dark"
                >
                  ⭐ {review.note}
                </span>

              </td>

              <td>

                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() =>
                    onView(review)
                  }
                >
                  Voir
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    onDelete(
                      review.id
                    )
                  }
                >
                  Supprimer
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default ReviewsTable;