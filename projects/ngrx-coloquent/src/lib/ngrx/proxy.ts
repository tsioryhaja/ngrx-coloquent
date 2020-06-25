export class ProxyOneData {
    constructor(private id: string | number, private baseType: string) {
    }

    getData(state) {
        return state[this.baseType].entities[this.id]
    }
}


export class ProxyManyData {
    private data: ProxyOneData[] = [];
    constructor(data: any){
        for(let d of data) {
            this.data.push(new ProxyOneData(d.getApiId(), d.getJsonApiBaseType()));
        }
    }

    getData(state) {
        let returned_data = []
        for (let data of this.data) {
            returned_data.push(data.getData(state))
        }
        return returned_data
    }
}