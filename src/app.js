import express from "express";
import mongoose from "mongoose";
import _ from "lodash";
import axios from "axios";
import AuditTrail from "./audit-trail/audit.model";

const app = express();
app.use(express.json());


mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
  });




const globalRoutingFunction = async (req, res, next) => {
  const method = req.method.toLowerCase();
  const currentRouteObj = _.find(
    routes,
    (route) => route.api === req.route.path && route.methods.includes(method)
  );

  if (currentRouteObj) {
    let url = `${currentRouteObj.microserviceUrl}`;

    if (req.params) {
      Object.keys(req.params).forEach((key) => {
        url = url.replace(`:${key}`, req.params[key]);
      });
    }

    try {
      const response = await sendAxiosRequest(
        url,
        method,
        req.headers.authorization,
        req.body,
        req.query
      );

      const logAuditTrail = async () => {
        const auditTrail = new AuditTrail({
          timestamp: new Date(),
          microservice: currentRouteObj.microserviceName,
          url: req.url,
          method: req.method,
          statusCode: response.status,
          userId: (req.user && req.user.id) || "public",
          userAgent: req.headers["user-agent"],
          success: response.status >= 200 && response.status < 300,
          headers: req.headers,
          result: response.data,
          params: req.params,
          body: req.body,
        });

        await auditTrail.save();
      };

      await logAuditTrail();
      res.status(response.status).send(response.data);
    } catch (err) {
      const logAuditTrail = async () => {
        const auditTrail = new AuditTrail({
          timestamp: new Date(),
          microservice: currentRouteObj.microserviceName,
          url: req.url,
          method: req.method,
          statusCode: err.statusCode,
          userId: (req.user && req.user.id) || "public",
          userAgent: req.headers["user-agent"],
          success: false,
          headers: req.headers,
          result: err.messages,
          params: req.params,
          body: req.body,
        });

        await auditTrail.save();
      };

      await logAuditTrail();
      next(err);
    }
  }
};


export const authenticateFunctionMiddleware = async (req, res, next) => {
  const idpUrl = process.env.IDP_URL;
  try {
    const response = await axios.get(`${idpUrl}/user/profile`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    req.user = response.data;
    next();
  } catch (err) {
    next(authError.notAuthenticated);
  }
};


routes.forEach((route) => {
  if (route.isAuthenticated) {
    app.use(route.api, authenticateFunctionMiddleware);
  }

  const router = app.route(route.api);

  route.methods.forEach((method) => {
    switch (method) {
      case "get":
        router.get(globalRoutingFunction);
        break;
      case "post":
        router.post(globalRoutingFunction);
        break;
      case "delete":
        router.delete(globalRoutingFunction);
        break;
      case "put":
        router.put(globalRoutingFunction);
        break;
    }
  });
});


app.use((error, req, res, next) => {
  const status = error.statusCode || error.status || 500;
  const messages = error.messages ? error.messages : [error.messages];
  res.status(status).send({ messages });
});


const port = process.env.PORT ;
app.listen(port, () => {
  console.log(`Gateway microservice is running on port ${port}`);
});

async function sendAxiosRequest(url, method, authorization, body, query) {
    const axiosConfig = {
      method: method,
      url: url,
    };
  
    if (authorization) {
      axiosConfig.headers = {
        Authorization: authorization,
      };
    }
  
    if (body) {
      axiosConfig.data = body;
    }
    if (query) {
      axiosConfig.params = query;
    }
  
    try {
      const response = await axios(axiosConfig);
      return response;
    } catch (err) {
      throw {
        messages: err.response.data.messages || err.response.data.message,
        statusCode: err.response.status,
      };
    }
  }
  