import { Injectable } from '@angular/core';
import { AjaxAdapter, HttpResponse, ServerError, MetadataStore, AbstractDataServiceAdapter } from 'breeze-client';
import { SaveErrorFromServer } from 'breeze-client/src/entity-manager';

@Injectable()
export class CustomDataServiceUtils {
    ajaxAdapter: AjaxAdapter;

    clientTypeNameToServer(clientTypeName: string): string {
        return `SP.Data.${clientTypeName}ListItem`;
    }

    createError(response: HttpResponse): ServerError {
        const err = new Error() as ServerError;
        err.httpResponse = response;
        err.status = response.status;
        let errObj = response.data;

        if (!errObj) {
            err.message = response.error && response.error.toString();
            return err;
        }

        // some ajax providers will convert errant result into an object (angularjs), others will not (jQuery)
        // if not do it here.
        if (typeof errObj === 'string') {
            try {
                errObj = JSON.parse(errObj);
            } catch (e) {
                // sometimes httpResponse.data is just the error message itself
                err.message = errObj;
                return err;
            }
        }

        const saveContext = response.saveContext;

        let tmp = errObj.Message || errObj.ExceptionMessage || errObj.EntityErrors || errObj.Errors;
        const isDotNet = !!tmp;
        let message: string, entityErrors: any[];
        if (!isDotNet) {
            message = errObj.message;
            entityErrors = errObj.errors || errObj.entityErrors;
        } else {
            tmp = errObj;
            do {
                // .NET exceptions can provide both ExceptionMessage and Message but ExceptionMethod if it
                // exists has a more detailed message.
                message = tmp.ExceptionMessage || tmp.Message;
                tmp = tmp.InnerException;
            } while (tmp);
            // .EntityErrors will only occur as a result of an EntityErrorsException being deliberately thrown on the server
            entityErrors = errObj.Errors || errObj.EntityErrors;
            entityErrors =
                entityErrors &&
                entityErrors.map(function(e) {
                    return {
                        errorName: e.ErrorName,
                        entityTypeName: MetadataStore.normalizeTypeName(e.EntityTypeName),
                        keyValues: e.KeyValues,
                        propertyName: e.PropertyName,
                        errorMessage: e.ErrorMessage
                    };
                });
        }

        if (saveContext && entityErrors) {
            const propNameFn = saveContext.entityManager.metadataStore.namingConvention.serverPropertyNameToClient;
            entityErrors.forEach(function(e) {
                e.propertyName = e.propertyName && propNameFn(e.propertyName);
            });
            (err as SaveErrorFromServer).entityErrors = entityErrors;
        }

        err.message =
            message ||
            `Server side errors encountered -
          see the entityErrors collection on this object for more detail`;
        return err;
    }

    handleHttpErrors(reject: (reason: any) => void, response: HttpResponse, messagePrefix?: string): ServerError {
        const err = this.createError(response);
        AbstractDataServiceAdapter._catchNoConnectionError(err);

        if (messagePrefix) {
            err.message = `${messagePrefix}; ${err.message}`;
        }
        reject(err);
    }

    serverTypeNameToClient(servertTypeName: string): string {
        const re = /^(SP\.Data.)(.*)(ListItem)$/;
        const typeName = serverTypeName.replace(re, '$2');
    }

    unwrapResponseData(response: any): any {
        const data = response.data && response.data.d;
        return data.results === undefined ? data : data.results;
    }
}
