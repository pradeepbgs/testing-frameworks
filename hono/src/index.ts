import { Hono } from 'hono';
import {
  getSignedCookie,
  setSignedCookie,
  deleteCookie,
} from 'hono/cookie';
import jwt from 'jsonwebtoken';

const app = new Hono();

const secret = 'linux';

app.use('*', async (c, next) => {
  const signedCookie = await getSignedCookie(c, secret, 'accessToken');

  if (!signedCookie) {
    return await next();
  }

  try {
    const user = jwt.verify(signedCookie, secret); 
    
    c.req.user = user; 
  } catch (error) {
    console.error('Invalid token', error);
  }

  await next();
});

app.get('/', (c) => {
  const user = c.req.user; 

  if (!user) {
    return c.json({
      success:false,
      msg: 'Hello Hono! You are not authenticated.'
    }, 401);
  }

  return c.json(user);
});

app.get('/cookie', async (c) => {
  const user = {
    username: "pradeep",
    email: "pradeep@gmail.com",
  };
  const token = jwt.sign(user, secret, { expiresIn: '1h' });

  
  await setSignedCookie(c, 'accessToken', token, secret, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
  });

  return c.json({ message: 'setted cookie' });
});


export default app;
