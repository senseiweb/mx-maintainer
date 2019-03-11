
// declare module 'odata' {
   
//     type BodyType = Blob | BufferSource | FormData | URLSearchParams | string | object;
    

//     export interface OdataBatchConfig {
//         endpoint?: string;
//         headers?: Headers;
//         boundaryPrefix?: string;
//         useChangset: boolean;
//         changsetBoundaryPrefix?: string;
//       }
      
//     export class OBatch {
//         constructor(resources: ORequest[], config: OdataConfig, query?: OdataQuery);
//         fetch(url: URL): any;
//         parseResponse(responseData: string, contentTypeHeader: string): any;
//         checkForChangset(resources: ORequest[], query: OdataQuery): ORequest[];
//     }

//     export type OdataConfig = RequestInit & {
//         /**
//          * The URL to request data from
//          */
//         rootUrl: URL;
  
//         /**
//          * An default query
//          */
//         query?: URLSearchParams;
  
//         /**
//          * The fragment to parse data from 
//          * Default is: value
//          */
//         fragment: string;
  
//         /**
//          * Batch configuration (experimental)
//          */
//         batch?: OdataBatchConfig;
  
//         /**
//          * Set to true to disable auto polyfilling
//          */
//         disablePolyfill: boolean;
//     };
     
//     export interface OdataQuery {
//         $filter?: string;
//         $orderby?: string;
//         $expand?: string;
//         $select?: string;
      
//         $skip?: number;
//         $top?: number;
//         $count?: boolean;
//         $search?: string;
//         $format?: string;
//         $compute?: string;
//         $index?: number;
//         [key: string]: any;
//       }
    
//     export function o(rootUrl: string | URL, config?: OdataConfig): OHandler;

//     export class ORequest {
//         public url: URL;
      
//         constructor(url: URL | string, config: RequestInit)

//         public fetch(): Promise<Response>;
      
//         public applyQuery(query?: OdataQuery);
//     }

//     export class OHandler {
//         pending: number;
//         constructor(config: OdataConfig);
//         query(query?: OdataQuery): Promise<any>;
//         fetch(query?: OdataQuery): Response;
//         batch(query?: OdataQuery): Promise<any>;
//         get(resource?: string): OHandler;
//         post(resource: string, body: BodyType): OHandler;
//         put(resource: string, body: BodyType): OHandler;
//         patch(resource: string, body: BodyType): OHandler;
//         delete(resource: string): OHandler;
//         request(req: ORequest): void;
//         getUrl(resource: string): URL;
//         getFetch(query: OdataQuery): Promise<any>
//         getBody(body: BodyType): Promise<Response[]>;
//     }
// }