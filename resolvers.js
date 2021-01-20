const { db } = require("./cnn")
const RopaResolver = {
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
    }, Mutation: {
        async createProducto(root, { producto }) {
            if (producto === undefined) return null
            const query = `INSERT INTO producto(id_genero,id_tipo,id_talla,nombre_producto,
                                cantidad,precio,descripcion,imagen)Values($1,$2,$3,$4,$5,$6,$7,$8) returning *;`
            let result = await db.one(query, [producto.id_genero, producto.id_tipo, producto.id_talla,
            producto.nombre_producto, producto.cantidad, producto.precio, producto.descripcion, producto.imagen])
            return result
        }, async updateProducto(root, { producto }) {
            if (producto === undefined) return null
            const query = `UPDATE producto SET id_genero=$2, id_tipo=$3,id_talla=$4,nombre_producto=$5,
            cantidad=$6,precio=$7,descripcion=$8,imagen=$9 where id_producto=$1 returning *;`
            let result = await db.one(query, [producto.id_producto, producto.id_genero, producto.id_tipo, producto.id_talla,
            producto.nombre_producto, producto.cantidad, producto.precio, producto.descripcion, producto.imagen])
            return result
        }, async deleteProducto(root, { id }) {
            const query = `DELETE FROM producto  where id_producto=$1 returning *;`
            let result = await db.one(query, [id])
            return result
        },async createGenero(root, { genero }) {
            if (genero === undefined) return null
            const query = `INSERT INTO genero(nombre_genero) Values($1) returning *;`
            let result = await db.one(query, [Genero.nombre_genero])
            return result
        }, async updateGenero(root, { genero }) {
            if (genero === undefined) return null
            const query = `UPDATE genero SET nombre_genero=$2 where id_genero=$1 returning *;`
            let result = await db.one(query, [genero.id_genero,genero.nombre_genero])
            return result
        }, async deleteGenero(root, { id }) {
            const query = `DELETE FROM genero  where id_genero=$1 returning *;`
            let result = await db.one(query, [id])
            return result
        },async createTipo_producto(root, { tipo_producto }) {
            if (tipo_producto === undefined) return null
            const query = `INSERT INTO tipo_producto(nombre_tipo,descuento_tipo) Values($1,$2) returning *;`
            let result = await db.one(query, [tipo_producto.nombre_tipo,tipo_producto.descuento_tipo])
            return result
        }, async updateTipo_producto(root, { tipo_producto }) {
            if (tipo_producto === undefined) return null
            const query = `UPDATE tipo_producto SET nombre_tipo=$2,descuento_tipo=$3 where id_tipo=$1 returning *;`
            let result = await db.one(query, [tipo_producto.id_tipo,tipo_producto.nombre_tipo,tipo_producto.descuento_tipo])
            return result
        }, async deleteTipo_producto(root, { id }) {
            const query = `DELETE FROM tipo_producto  where id_tipo=$1 returning *;`
            let result = await db.one(query, [id])
            return result
        },async createTalla(root, { talla }) {
            if (talla === undefined) return null
            const query = `INSERT INTO talla(nombre_talla)Values($1) returning *;`
            let result = await db.one(query, [talla.nombre_talla])
            return result
        }, async updateTalla(root, { talla }) {
            if (talla === undefined) return null
            const query = `UPDATE talla SET nombre_talla=$2 where id_talla=$1 returning *;`
            let result = await db.one(query, [talla.id_talla,talla,])
            return result
        }, async deleteTalla(root, { id }) {
            const query = `DELETE FROM talla  where id_talla=$1 returning *;`
            let result = await db.one(query, [id])
            return result
        }
    }
}

module.exports = RopaResolver