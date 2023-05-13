const ErrorBoundaryComponent = ({ root }: { root?: boolean }) => {
  return (
    <div className="flex h-[calc(100vh-74px)] w-full items-center justify-center">
      <div className={`${!root && "mb-14"}`}>
        <div className="mb-3 w-fit rounded-xl bg-red-100 px-2 py-1 text-lg">
          Error 500
        </div>
        <div className="mb-3 text-2xl">
          Something went wrong on our side.
          <br />
          <span>
            Please, contact support:{" "}
            <a
              className="text-blue-500 underline underline-offset-[5px]"
              href="https://t.me/DifferentMarketplace"
            >
              @DifferentMarketplace
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundaryComponent;
