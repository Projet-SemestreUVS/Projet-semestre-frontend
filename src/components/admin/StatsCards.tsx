interface Props {

  data:any;
}

export const StatsCards = ({
  data
}:Props) => {

  return (

    <div className="row g-4">

      <div className="col-md-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3>{data.users}</h3>
            <p>Utilisateurs</p>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3>{data.prestataires}</h3>
            <p>Prestataires</p>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3>{data.demandeurs}</h3>
            <p>Demandeurs</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StatsCards;