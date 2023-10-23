export const GenerateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let expiry = new Date();

  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, phone: number) => {
  const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  const responce = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: "+16268697974",
    to: `+92${phone}`,
  });

  return responce;
};
