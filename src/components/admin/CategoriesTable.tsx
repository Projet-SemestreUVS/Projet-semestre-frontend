interface Props {

  categories: any[];

  onEdit: (category:any) => void;

  onDelete: (id:number) => void;
}

const CategoriesTable = ({
  categories,
  onEdit,
  onDelete,
}: Props) => {

  return (

    <div className="table-responsive">

      <table
        className="table table-hover"
      >

        <thead>

          <tr>

            <th>ID</th>

            <th>Nom</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {categories.map(
            (category) => (

            <tr
              key={category.id}
            >

              <td>
                {category.id}
              </td>

              <td>
                {category.name}
              </td>

              <td>

                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() =>
                    onEdit(category)
                  }
                >
                  Modifier
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    onDelete(
                      category.id
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

export default CategoriesTable;