import jwt, { JwtPayload } from "jsonwebtoken";
import { NextApiRequest } from "next";

export function createToken(address: string) {
  const token = jwt.sign({ address }, process.env.ENCRYPTION_KEY, {
    expiresIn: "30d",
  });

  return token;
}

export function decodeJWT(req: NextApiRequest) {
  try {
    const { authorization } = req.headers;
    const decoded = jwt.verify(
      String(authorization),
      process.env.ENCRYPTION_KEY
    ) as JwtPayload;

    return decoded.address as string;
  } catch (err) {
    return false;
  }
}
