interface Props {
  review:any;
}

const ReviewDetailsModal = ({
  review
}:Props) => {

  if(!review) return null;

  return (

    <div
      className="modal fade"
      id="reviewDetailsModal"
      tabIndex={-1}
    >

      <div className="modal-dialog">

        <div className="modal-content">

          <div className="modal-header">

            <h5>
              Détails Avis
            </h5>

            <button
              className="btn-close"
              data-bs-dismiss="modal"
            />

          </div>

          <div className="modal-body">

            <p>
              <strong>
                Auteur :
              </strong>
              {" "}
              {review.user?.nom}
            </p>

            <p>
              <strong>
                Service :
              </strong>
              {" "}
              {review.service?.titre}
            </p>

            <p>
              <strong>
                Note :
              </strong>
              {" "}
              ⭐ {review.note}/5
            </p>

            <p>
              <strong>
                Commentaire :
              </strong>
            </p>

            <div
              className="alert alert-light"
            >
              {review.commentaire}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ReviewDetailsModal;