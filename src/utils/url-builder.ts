/**
 * urlBuilder
 *
 * @param  {object} params
 * @param  {string} params.base       the base url
 * @param  {array}  params.libraries  an array of the libraries to be requested
 * @param  {string} params.callback   the callback function
 *
 * @return {string}
 */
export const urlBuilder = (params: {
    apiKey?: any;
    base: any;
    callback: any;
    client?: any;
    language?: any;
    libraries?: any;
    integrity?: any;
    crossorigin?: any;
}) => {
    let builtUrl = params.base;

    builtUrl += "?";

    if (params.apiKey) {
        builtUrl += "key=" + params.apiKey + "&";
    }
    if (params.integrity) {
        builtUrl += "integrity=" + params.integrity + "&";
    }

    if (params.client) {
        builtUrl += "client=" + params.client + "&";
    }

    if (params.crossorigin) {
        builtUrl += "crossorigin=" + params.crossorigin + "&";
    }

    if (params.libraries && params.libraries.length > 0) {
        builtUrl += "libraries=";

        params.libraries.forEach(function (library: any, index: number) {
            builtUrl += library;

            if (index !== params.libraries.length - 1) {
                builtUrl += ",";
            }
        });

        builtUrl += "&";
    }

    if (params.language) {
        builtUrl += "language=" + params.language + "&";
    }

    if (params.callback) {
        builtUrl += "callback=" + params.callback + "&";
    }

    return builtUrl;
};
