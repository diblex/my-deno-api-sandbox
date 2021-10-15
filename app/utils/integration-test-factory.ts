import { assertEquals, Dictionary } from "../../deps.ts";

export enum  ResponseType {
  json = 'json',
  text = 'text'
}

/**
 * This class is to be used as a factory for different integration tests.
 * The API integration tests consist on requests to the API endpoints.
 */
export class IntegrationTestFactory {
  endpointUrl: string;
  headers: HeadersInit;
  method: string;

  constructor(params: {
    endpointUrl: string,
    headers: HeadersInit,
    method: string
  }) {
    this.endpointUrl = params.endpointUrl;
    this.headers = params.headers;
    this.method = params.method;
  }

  /**
   * Builds a validation test function for request that send a body.
   * @param params.responseType It's the response data type expected. Can be json or text.
   * @param params.paramId It's the URL param id to assign to the end of the endpoint URL
   */
  buildBodyValidationTest(params?: {
    paramId?: number,
    responseType?: ResponseType
  }) {
    return async (input: Dictionary<string|number|boolean>, expected: string) => {
      let url = this.endpointUrl;
      url += params?.paramId ? `/${params.paramId}` : '';
      const res = await fetch(url, {
        method: this.method,
        headers: this.headers,
        body: JSON.stringify(input),
      });
      assertEquals(res.status, 400);
      if (params?.responseType === ResponseType.json) {
        assertEquals(await res.json(), expected);
      } else {
        assertEquals(await res.text(), expected);  
      }
    };
  }

  /**
   * Builds a validation test function for request that send search query parameters.
   * @param params.responseType It's the response data type expected. Can be json or text.
   */
  buildSearchValidation(params?: {
    responseType?: ResponseType
  }) {
    return async (input: [string, string][], expected: string) => {
      let url = `${this.endpointUrl}?`;
      input.forEach(pair => {
        url += `${pair[0]}=${pair[1]}&`;
      });
      url = url.substr(0, url.length - 1);
      const res = await fetch(url, {method: this.method, headers: this.headers});
      assertEquals(res.status, 400);
      if (params?.responseType === ResponseType.json) {
        assertEquals(await res.json(), expected);
      } else {
        assertEquals(await res.text(), expected);  
      }
    };
  }
}

