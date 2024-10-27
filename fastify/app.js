import Fastify from 'fastify';
import jwt from 'jsonwebtoken';
import fastifyCookie from 'fastify-cookie';

const fastify = Fastify();
const JWT_SECRET = "linux";

fastify.register(fastifyCookie);


fastify.addHook('preHandler', async (request, reply) => {
  if (request.routerPath === '/cookie') {
    return; 
  }

  try {
    const { accessToken } = request.cookies;

    if (!accessToken) {
      return reply.status(404).send({ error: "Missing accessToken" });
    }

    const parsedToken = jwt.verify(accessToken, JWT_SECRET);
    if (!parsedToken) {
      return reply.status(400).send({ error: "JWT token parsing failed" });
    }

    request.user = parsedToken;
  } catch (error) {
    return reply.status(400).send({ error: "Something went wrong while parsing the token" });
  }
});

fastify.get('/', (request, reply) => {
  const user = request.user;
  return reply.send(user);
});

fastify.get('/cookie', (request, reply) => {
  const user = {
    username: "pradeep",
    email: "pradeep@gmail.com",
  };

  
  const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: "1d" });

 
  const cookieOptions = {
    path: '/',
    httpOnly: true, 
    secure: false, 
    expires: new Date(Date.now() + 86400000), 
  };

  reply.setCookie('accessToken', accessToken, cookieOptions)

  reply.send({ msg: "Cookies have been set" });
});

fastify.listen(3000, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Server is running on http://localhost:3000");
});
