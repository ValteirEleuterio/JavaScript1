class NegociacaoDao {

    constructor(connection) {
        this._connection = connection
        this._store = 'negociacoes'
    }

    async adiciona(negociacao) {
        
        let request = this._connection
            .transaction([this._store], 'readwrite')
            .objectStore(this._store)
            .add(negociacao)


        request.onsuccess = () => {
            return
        }

        request.onerror = e => {
            throw new Error('Não foi possível adicionar a negociação')
        }          
    }
    
    listaTodos(){
        return new Promise((resolve, reject) => {
            let cursor = this._connection
            .transaction(['negociacoes'], 'readwrite')
            .objectStore('negociacoes')
            .openCursor();

            let negociacoes = [];

            cursor.onsuccess = e => {
                let atual = e.target.result;

                if(atual) {
                    let dado = atual.value;

                    negociacoes.push(new Negociacao(dado._data, dado._quantidade, dado._valor))
                    
                    atual.continue();
                } else {
                    resolve(negociacoes);
                }
            }

            cursor.onerror = e => {
                console.error(e.target.error)
                reject('Não foi possível listar as negociações')
            }
        })
    }
}