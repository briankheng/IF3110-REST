import axios from 'axios';
import converter from 'xml-js';

type Header = {
    [key: string]: string | undefined;
};

class SoapCaller {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    public async call(method: string, params?: Record<string, any>) {
        const headers: Header = {
            'Content-Type': 'text/xml',
            'api-key': process.env.SOAP_API_KEY,
        };

        // const updatedUrl = this.url.replace('localhost', '127.0.0.1');
        const updatedUrl = this.url.replace('localhost', 'host.docker.internal');

        console.log('Request Headers:', headers);

        const xml = this.buildXMLRequest(method, params);
        console.log('SOAP Request XML:', xml);
        console.log('SOAP Service URL:', updatedUrl);
        console.log('SOAP_API_KEY:', process.env.SOAP_API_KEY);

        try {
            const response = await axios.post(updatedUrl, xml, { headers });

            console.log('SOAP Response Status:', response.status);
            console.log('SOAP Response Headers:', response.headers);
            console.log('SOAP Response Data:', response.data);

            const data = response.data;

            // Parse the XML
            const json = JSON.parse(converter.xml2json(data, { compact: true, spaces: 4 }));
            const returnVal = json['S:Envelope']['S:Body']['ns2:' + method + 'Response']['return'];

            if (!returnVal) {
                return null;
            }

            console.log('Retval:', returnVal);
            console.log('JSON Resp:', this.buildResponseJSON(returnVal));

            return this.buildResponseJSON(returnVal);
        } catch (error) {
            console.error('SOAP Request Error:', error);
            throw error; // Rethrow the error for the calling code to handle if needed
        }
    }

    private buildResponseJSON(json: JSON) {
        if (Array.isArray(json)) {
            return json.map((item) => this.flatten(item));
        }

        return this.flatten(json);
    }

    private flatten(json: JSON): JSON {
        const response: any = {};

        Object.keys(json).forEach((key) => {
            const value = json[key as keyof typeof json];
            response[key] = value['_text' as keyof typeof value];
        });

        return response;
    }

    private buildXMLRequest(method: string, params?: Object) {
        const strParams = this.buildXMLParams(params);

        return `
        <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
            <Body>
                <${method} xmlns="http://webservices/">
                    ${strParams}
                </${method}>
            </Body>
        </Envelope>`;
    }

    private buildXMLParams(params?: Object) {
        if (!params) {
            return '';
        }

        const keyValue = Object.keys(params).map((key) => {
            return `<${key} xmlns="">${params[key as keyof typeof params]}</${key}>`;
        });

        return keyValue.join('');
    }
}

export default SoapCaller;
