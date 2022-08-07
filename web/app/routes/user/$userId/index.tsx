import { Link } from "@remix-run/react";

const UserIdIndexRoute = () => {
  const items = [
    {
      imageKey:
        "https://gentlyusedbucket.s3.eu-central-1.amazonaws.com/Hwg2HZKzRoyGXprTxhv69w-3EE5AC22E27AC4B7D9EDB00D2AB99F27E.webp",
      designer: "BAPE",
      description: "Bape bapesta hoodie black&grey",
      price: "250$",
    },
    {
      imageKey:
        "https://gentlyusedbucket.s3.eu-central-1.amazonaws.com/AbT8RJUiSIC70bJ7i2BAuQ-1.jpg",
      designer: "BAPE",
      description: "Bape bapesta hoodie black&grey",
      price: "250$",
    },
    {
      imageKey:
        "https://gentlyusedbucket.s3.amazonaws.com/NQ5zAxGzTAWWfnTtynSlnQ-0.jpeg",
      designer: "BAPE",
      description: "Bape bapesta hoodie black&grey",
      price: "250$",
    },
    {
      imageKey:
        "https://gentlyusedbucket.s3.eu-central-1.amazonaws.com/Hwg2HZKzRoyGXprTxhv69w-3EE5AC22E27AC4B7D9EDB00D2AB99F27E.webp",
      designer: "BAPE",
      description: "Bape bapesta hoodie black&grey",
      price: "250$",
    },
    {
      imageKey:
        "https://gentlyusedbucket.s3.eu-central-1.amazonaws.com/Hwg2HZKzRoyGXprTxhv69w-3EE5AC22E27AC4B7D9EDB00D2AB99F27E.webp",
      designer: "BAPE",
      description: "Bape bapesta hoodie black&grey",
      price: "250$",
    },
    {
      imageKey:
        "https://gentlyusedbucket.s3.eu-central-1.amazonaws.com/Hwg2HZKzRoyGXprTxhv69w-3EE5AC22E27AC4B7D9EDB00D2AB99F27E.webp",
      designer: "BAPE",
      description: "Bape bapesta hoodie black&grey",
      price: "250$",
    },
    {
      imageKey:
        "https://gentlyusedbucket.s3.eu-central-1.amazonaws.com/Hwg2HZKzRoyGXprTxhv69w-3EE5AC22E27AC4B7D9EDB00D2AB99F27E.webp",
      designer: "BAPE",
      description: "Bape bapesta hoodie black&grey",
      price: "250$",
    },
    {
      imageKey:
        "https://gentlyusedbucket.s3.eu-central-1.amazonaws.com/Hwg2HZKzRoyGXprTxhv69w-3EE5AC22E27AC4B7D9EDB00D2AB99F27E.webp",
      designer: "BAPE",
      description: "Bape bapesta hoodie black&grey",
      price: "250$",
    },
    {
      imageKey:
        "https://gentlyusedbucket.s3.eu-central-1.amazonaws.com/Hwg2HZKzRoyGXprTxhv69w-3EE5AC22E27AC4B7D9EDB00D2AB99F27E.webp",
      designer: "BAPE",
      description: "Bape bapesta hoodie black&grey",
      price: "250$",
    },
  ];

  return (
    <div className="px-32 py-14">
      <div className="w-full flex flex-wrap justify-between">
        {items.map((item, index) => (
          <Link to="/sell/2" key={index}>
            <div
              className="h-fit mt-6 w-80 border rounded-md border-transparent hover:border-main"
              key={index}
            >
              <img
                className="max-w-full w-full h-96 rounded-t-md"
                src={`${item.imageKey}`}
                alt="item"
              />
              <div className="px-2 w-full max-w-full">
                <div className="text-xs font-bold mt-3">BAPE</div>
                <div className="text-xs mt-3">
                  Bape bapesta hoodie black&grey Bape bapesta hoodie black&grey
                </div>
                <div className="text-xs font-bold my-3">250$</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserIdIndexRoute;
