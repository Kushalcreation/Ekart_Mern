const Verify = () => {
  return (
    <div className="relative w-fil h-[760px] overflow-hidden">
      <div className="min-h-screen flex items-center justify-center bg-pink-100 px-4">
        <div className="bg-white p-5 rounded-2xl shadow-lg w-full max-w-md text-center ">
          <h2 className="text-2xl font-semibold mb-4 text-green-500">
            ✅ Check Your Email
          </h2>
          <p className="text-sm text-gray-500">
            We've sent ypu an email to verify your account, Please check your
            email and click on the link to verify{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
