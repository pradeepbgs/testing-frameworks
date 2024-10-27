import { Diesel, type ContextType, type CookieOptions } from "diesel-core";
import jwt from "jsonwebtoken";

const app = new Diesel();
const secret = "linux";

async function authJwt(ctx:ContextType) {
  const token = await ctx.getCookie("accessToken");
  if (!token) {
    return ctx.status(401).json({ message: "Authentication token missing" });
  }
  try {
    const user = jwt.verify(token, secret); 
    ctx.setUser(user);
  } catch (error) {
    return ctx.status(403).json({ message: "Invalid token" });
  }
}

app
.filter()
.routeMatcher("/api/user/register", "/api/user/login", "/test/:id", "/cookie")
.permitAll()
.require(authJwt);

app.get("/", async (xl) => {
  const user = xl.getUser();
  return xl.json(user);
});

app.get("/cookie", async (xl) => {
  const user = {
    username: "pradeep",
    email: "pradeep@gmail.com",
  };

  const accessToken = jwt.sign(user, secret, { expiresIn: "1d" });
  const options : CookieOptions = {
    httpOnly: true, 
    secure: true, 
    maxAge: 24 * 60 * 60 * 1000, 
    sameSite: "Strict", 
    path: "/",
  };
  return xl
    .cookie("accessToken", accessToken, options)
    .json({ msg: "setted cookie" });
});

app.listen(3000);
