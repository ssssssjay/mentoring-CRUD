type FetchMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type CustomError = {
  message: string;
  name: string;
};

const verifiedFetch = async (
  url: string,
  method: FetchMethod,
  token: string,
  rest: any
): Promise<Response | CustomError> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_ADDRESS}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      ...rest,
    });

    return response;
  } catch (err) {
    if (err instanceof Error) {
      return {
        message: err.message,
        name: err.name,
      };
    }
    return {
      message: "원인불명의 오류",
      name: "unknown error",
    };
  }
};

const verifiedPost = async (url: string, token: string, body: any): Promise<Response | CustomError> => {
  try {
    const response = await verifiedFetch(url, "POST", token, { body });
    return response;
  } catch (err) {
    if (err instanceof Error) {
      return {
        message: err.message,
        name: err.name,
      };
    }
    return {
      message: "원인불명의 오류",
      name: "unknown error",
    };
  }
};

const verifiedGet = async (url: string, token: string): Promise<Response | CustomError> => {
  try {
    const response = await verifiedFetch(url, "GET", token, {});
    return response;
  } catch (err) {
    if (err instanceof Error) {
      return {
        message: err.message,
        name: err.name,
      };
    }
    return {
      message: "원인불명의 오류",
      name: "unknown error",
    };
  }
};

const verifiedPatch = async (url: string, token: string, body: any): Promise<Response | CustomError> => {
  try {
    const response = await verifiedFetch(url, "PATCH", token, { body: JSON.stringify(body) });
    return response;
  } catch (err) {
    if (err instanceof Error) {
      return {
        message: err.message,
        name: err.name,
      };
    }
    return {
      message: "원인불명의 오류",
      name: "unknown error",
    };
  }
};

const verifiedDelete = async (url: string, token: string): Promise<Response | CustomError> => {
  try {
    const response = await verifiedFetch(url, "DELETE", token, {});
    return response;
  } catch (err) {
    if (err instanceof Error) {
      return {
        message: err.message,
        name: err.name,
      };
    }
    return {
      message: "원인불명의 오류",
      name: "unknown error",
    };
  }
};

const unLoginPost = async (url: string, body: any): Promise<Response | CustomError> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_ADDRESS}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    return response;
  } catch (err) {
    if (err instanceof Error) {
      return {
        message: err.message,
        name: err.name,
      };
    }
    return {
      message: "원인불명의 오류",
      name: "unknown error",
    };
  }
};

const unLoginGet = async (url: string): Promise<Response | CustomError> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_ADDRESS}${url}`, {
      method: "GET",
    });
    return response;
  } catch (err) {
    if (err instanceof Error) {
      return {
        message: err.message,
        name: err.name,
      };
    }
    return {
      message: "원인불명의 오류",
      name: "unknown error",
    };
  }
};

export { verifiedPost, verifiedGet, verifiedPatch, verifiedDelete, unLoginPost, unLoginGet };
