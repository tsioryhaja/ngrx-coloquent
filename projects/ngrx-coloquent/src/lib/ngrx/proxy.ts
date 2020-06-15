export class ProxyOneData {
    constructor(private id: string | number) {
    }

    getData(state) {
        return state[this.id]
    }
}


export class ProxyManyData {
    constructor(private ids: any){}

    getData(state) {
        let data = []
        for (let id of this.ids) {
            data.push(state[id])
        }
        return data
    }
}