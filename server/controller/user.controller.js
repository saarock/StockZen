/**
 * sends mail to the user to confrim the email
 */
export const sendMailToTheUser = asyncHandler(async (req, res) => {
  console.log("request came");
  const { email } = req.body;
  console.log(email);
  if (!email) {
    throw new ApiError(400, "Mail is required");
  }
  const generateOtp = mailOtpStore.generateOtp();
  const storedOtp = mailOtpStore.storeOtp(email, generateOtp);
  if (!storedOtp) {
    throw new Error("Failed to generate or stored otp");
  }
  await nodeMailer.send(
    "saarock200@gmail.com",
    email,
    "verify",
    `<b>${storedOtp}</b>`
  );
  res.status(200).json(new ApiResponse(200, null, "Mail send successfully"));
});

export const verifyUserMail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const isCorrectOpt = mailOtpStore.verifyOtp(email, otp);
  if (!isCorrectOpt) {
    throw new ApiError(400, "Wrong otp");
  }
  res.status(200).json(new ApiResponse(200, null, "Otp verifyed"));
});

export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { fullName, userName, phoneNumber, email, password, role } = req.body;

    if (!fullName || !email || !phoneNumber || !password) {
      throw new ApiError(400, "All field are required");
    }

    const existedUser = await User.findOne({
      $or: [{ email }, { phoneNumber }, { userName }],
    });

    if (existedUser) {
      throw new ApiError(400, "User already exist.");
    }

    const user = await User.create({
      fullName,
      email,
      userName,
      phoneNumber,
      password,
      role,
    });

    console.log(user);

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "Register Successfull"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while login"
    );
  }
});
