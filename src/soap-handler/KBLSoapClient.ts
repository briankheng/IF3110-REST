import { SoapCaller } from '../utils'
import { ISubscription } from '../interfaces'

class KBLSoapClient {
    private soapCaller: SoapCaller

    constructor(url: string) {
        this.soapCaller = new SoapCaller(url)
    }

    public async getSubscriptions() {
        return await this.soapCaller.call('getSubscriptions')
    }

    public async acceptSubscription(userId: number, albumId: number) {
        const args = {
            arg0: userId,
            arg1: albumId,
        }

        return await this.soapCaller.call('acceptSubscription', args)
    }

    public async rejectSubscription(userId: number, albumId: number) {
        const args = {
            arg0: userId,
            arg1: albumId,
        }

        return await this.soapCaller.call('rejectSubscription', args)
    }

    public async checkStatus(userId: string, albumId: string) {
        const args = {
            arg0: userId,
            arg1: albumId,
        }

        return this.soapCaller.call('checkStatus', args) as unknown as ISubscription
    }
}

const url = process.env.SOAP_URL;
export default new KBLSoapClient(url ? url : "");