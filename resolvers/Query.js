const { db } = require("../cnn")
const Query = {
    Query: {
        productos(root, { id_producto }) {
            if (id_producto === undefined)
                return db.any("select*from producto")
            else
                return db.any("select*from producto where id_producto=$1", [id_producto])
        }, generos(root, { nombre_genero }) {
            if (nombre_genero === undefined)
                return db.any("select*from genero")
            else
                return db.any("select*from genero where id_genero=$1", [nombre_genero])
        }, tipo_productos(root, { tipo_producto }) {
            if (tipo_producto === undefined)
                return db.any("select*from tipo_producto")
            else
                return db.any("select*from tipo_producto where id_tipo=$1", [tipo_producto])
        }, tallas(root, { nombre_talla }) {
            if (nombre_talla === undefined)
                return db.any("select*from talla")
            else
                return db.any("select*from talla where id_talla=$1", [nombre_talla])
        }
    }, Producto: {
        id_genero(producto) {
            return db.any(`select*from genero where id_genero=$1 `, [producto.id_genero])
        },
        id_tipo(producto) {
            return db.any(`select*from tipo_producto where id_tipo=$1 `, [producto.id_tipo])
        },
        id_talla(producto) {
            return db.any(`select*from talla where id_talla=$1 `, [producto.id_talla])
        }
    }
}


module.exports = Query
