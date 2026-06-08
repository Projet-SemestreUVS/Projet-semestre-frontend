interface Props {
  title: string;
  value: number;
  icon: string;
}

const StatCard = ({
  title,
  value,
  icon,
}: Props) => {
  return (
    <div
      className="card border-0 shadow-sm h-100"
      style={{
        borderRadius: "15px",
      }}
    >
      <div className="card-body">

        <div className="d-flex justify-content-between">

          <div>

            <h6 className="text-muted">
              {title}
            </h6>

            <h2 className="fw-bold">
              {value}
            </h2>

          </div>

          <div
            style={{
              fontSize: "2rem",
            }}
          >
            {icon}
          </div>

        </div>

      </div>
    </div>
  );
};

export default StatCard;