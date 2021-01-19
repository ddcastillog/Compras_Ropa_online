const { db } = require("./cnn")
const RopaResolver = {
    Query: {
        async pizzas(root,{id_producto}){    
            if(name===undefined)    
                return await db.any("select*from producto")
            else
                return await db.any("select*from producto where id_producto=$1",[id_producto]) 
            }
    },Producto:{
        genero(producto){
            return db.any(`select from genero where id_genero=$1 `,[producto.id_genero])
        },
        tipo_producto(producto){
            return db.any(`select from tipo_producto where id_tipo=$1 `,[producto.id_tipo])
        },
        talla(producto){
            return db.any(`select from talla where id_talla=$1 `,[producto.id_talla])
        }
    }


}

module.exports = RopaResolver