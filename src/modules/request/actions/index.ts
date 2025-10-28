"use server";

import db from "@/lib/db";

import axios, { AxiosRequestConfig } from "axios";

export type Request= {
  name: string;
  method: any;
  url: string;
  body?: string;
  headers?: string;
  parameters?: string;
};


export const addRequestToCollection = async (collectionId:string , value:Request)=>{
  const request = await db.request.create({
    data:{
        collectionId,
        name: value.name,
        method: value.method,
        url: value.url,
        body: value.body,
        headers: value.headers,
        parameters: value.parameters,
    }
  });

  return request;
}



export const saveRequest = async (id:string, value:Request)=>{

  console.log(value , id);
const request =  await db.request.update({
    where: {
      id: id
    },
    data: {
      name: value.name,
      method: value.method,
      url: value.url,
      body: value.body,
      headers: value.headers,
      parameters: value.parameters,
    },
  });

  return request;
}

// Quick update for URL and method changes
export const updateRequestQuick = async (
  id: string,
  data: {
    method?: any;
    url?: string;
    headers?: any;
    parameters?: any;
    body?: any;
  }
) => {
  const request = await db.request.update({
    where: { id },
    data: {
      ...(data.method && { method: data.method }),
      ...(data.url && { url: data.url }),
      ...(data.headers && { headers: data.headers }),
      ...(data.parameters && { parameters: data.parameters }),
      ...(data.body && { body: data.body }),
      updatedAt: new Date()
    },
  });

  return request;
}

export const getAllRequestFromCollection = async (collectionId:string)=>{
  const requests = await db.request.findMany({
    where: {
      collectionId,
    },
  });
  return requests;
}



export async function sendRequest(req: {
  method: string;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: any;
}) {
  const config: AxiosRequestConfig = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    params: req.params,
    data: req.body,
    validateStatus: () => true, // ✅ capture errors too
  };

  const start = performance.now();
  try {
    const res = await axios(config);
    const end = performance.now();

    const duration = end - start;
    const size =
      res.headers["content-length"] ||
      new TextEncoder().encode(JSON.stringify(res.data)).length;

    console.log(res.data);
    
    return {
      status: res.status,        
      statusText: res.statusText, 
        headers: Object.fromEntries(Object.entries(res.headers)),      
      data: res.data,            
      duration: Math.round(duration),
      size,
    };
  } catch (error: any) {
    const end = performance.now();
    return {
      error: error.message,
      duration: Math.round(end - start),
    };
  }
}


export async function run(requestId: string) {
  try {
    const request = await db.request.findUnique({
      where: { id: requestId }
    });

    if (!request) {
      throw new Error(`Request with id ${requestId} not found`);
    }

    // Parse body properly - it's stored as Json type in Prisma
    let parsedBody = undefined;
    if (request.body) {
      try {
        // If body is a string, parse it as JSON
        if (typeof request.body === 'string') {
          parsedBody = JSON.parse(request.body);
        } else {
          // Already an object
          parsedBody = request.body;
        }
      } catch (e) {
        // If parsing fails, send as string
        parsedBody = request.body;
      }
    }

    // Parse headers properly
    let parsedHeaders = undefined;
    if (request.headers) {
      try {
        if (typeof request.headers === 'string') {
          parsedHeaders = JSON.parse(request.headers);
        } else {
          parsedHeaders = request.headers as Record<string, string>;
        }
      } catch (e) {
        parsedHeaders = undefined;
      }
    }

    // Parse parameters properly
    let parsedParams = undefined;
    if (request.parameters) {
      try {
        if (typeof request.parameters === 'string') {
          parsedParams = JSON.parse(request.parameters);
        } else {
          parsedParams = request.parameters as Record<string, any>;
        }
      } catch (e) {
        parsedParams = undefined;
      }
    }
   
    const requestConfig = {
      method: request.method,
      url: request.url,
      headers: parsedHeaders,
      params: parsedParams,
      body: parsedBody
    };

    console.log('Request config being sent:', JSON.stringify(requestConfig, null, 2));

    const result = await sendRequest(requestConfig);

   
    const requestRun = await db.requestRun.create({
      data: {
        requestId: request.id,
        status: result.status || 0,
        statusText: result.statusText || (result.error ? 'Error' : null),
        headers: result.headers || "",
        body: result.data ? (typeof result.data === 'string' ? result.data : JSON.stringify(result.data)) : null,
        durationMs: result.duration || 0
      }
    });

  
    if (result.data && !result.error) {
      await db.request.update({
        where: { id: request.id },
        data: {
          response: result.data,
          updatedAt: new Date()
        }
      });
    }

    return {
      success: true,
      requestRun,
      result
    };

  } catch (error: any) {
    try {
      const failedRun = await db.requestRun.create({
        data: {
          requestId,
          status: 0,
          statusText: 'Failed',
          headers: "",
          body: error.message,
          durationMs: 0
        }
      });

      return {
        success: false,
        error: error.message,
        requestRun: failedRun
      };
    } catch (dbError) {
      return {
        success: false,
        error: `Request failed: ${error.message}. DB save failed: ${(dbError as Error).message}`
      };
    }
  }
}


export async function runDirect(requestData: {
  id: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  parameters?: Record<string, any>;
  body?: any;
}) {
  try {
    const requestConfig = {
      method: requestData.method,
      url: requestData.url,
      headers: requestData.headers,
      params: requestData.parameters,
      body: requestData.body
    };

    const result = await sendRequest(requestConfig);

    const requestRun = await db.requestRun.create({
      data: {
        requestId: requestData.id,
        status: result.status || 0,
        statusText: result.statusText || (result.error ? 'Error' : null),
        headers: result.headers || "",
        body: result.data ? (typeof result.data === 'string' ? result.data : JSON.stringify(result.data)) : null,
        durationMs: result.duration || 0
      }
    });

    // Update request with latest response if successful
    if (result.data && !result.error) {
      await db.request.update({
        where: { id: requestData.id },
        data: {
          response: result.data,
          updatedAt: new Date()
        }
      });
    }

    return {
      success: true,
      requestRun,
      result
    };

  } catch (error: any) {
    const failedRun = await db.requestRun.create({
      data: {
        requestId: requestData.id,
        status: 0,
        statusText: 'Failed',
        headers: "",
        body: error.message,
        durationMs: 0
      }
    });

    return {
      success: false,
      error: error.message,
      requestRun: failedRun
    };
  }
}