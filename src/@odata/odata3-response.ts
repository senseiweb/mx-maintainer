export class OData3Response {
    ResponseCode: string;
    ResponseText: string;
    Headers: OData3ResponseHeader[];
    Data: string;
    Success: boolean;
}
export class OData3ResponseHeader {
    Key: string;
    Value: string;
}
