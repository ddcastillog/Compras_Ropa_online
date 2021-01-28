const { db } = require("./cnn")
const RopaResolver = {
    Query: {
        async productos(root, { id_producto }) {
            if (id_producto === undefined)
                return await db.any("select*from producto")
            else
                return await db.any("select*from producto where id_producto=$1", [id_producto])
        }, async generos(root, { nombre_genero }) {
            if (nombre_genero === undefined)
                return await db.any("select*from genero")
            else
                return await db.any("select*from genero where id_genero=$1", [nombre_genero])
        }, async tipo_productos(root, { tipo_producto }) {
            if (tipo_producto === undefined)
                return await db.any("select*from tipo_producto")
            else
                return await db.any("select*from tipo_producto where id_tipo=$1", [tipo_producto])
        }, async tallas(root, { nombre_talla }) {
            if (nombre_talla === undefined)
                return await db.any("select*from talla")
            else
                return await db.any("select*from talla where id_talla=$1", [nombre_talla])
        },
        async factura(root, { id_factura }) {
            if (id_factura === undefined)
                return await db.any("select*from factura")
            else
                return await db.any("select*from factura where id_factura=$1", [id_factura])
        }
    }, Producto: {
        async id_genero(producto) {
            return await db.one(`select*from genero where id_genero=$1 `, [producto.id_genero])
        },
        async id_tipo(producto) {
            return await db.one(`select*from tipo_producto where id_tipo=$1 `, [producto.id_tipo])
        },
        async id_talla(producto) {
            return await db.one(`select*from talla where id_talla=$1 `, [producto.id_talla])
        }
    }, Factura: {
        async Productos(factura) {
            return await db.any(`select p.id_producto,p.id_genero,p.id_tipo,p.id_talla,p.nombre_producto,
            df.cantidad_detalle,p.precio,p.descripcion,p.imagen
            from producto p,detalle_factura df 
            where df.id_producto=p.id_producto and df.id_factura=$1`, [factura.id_factura])
        }
    },
    Mutation: {
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
        }, async createGenero(root, { genero }) {
            if (genero === undefined) return null
            const query = `INSERT INTO genero(nombre_genero) Values($1) returning *;`
            let result = await db.one(query, [Genero.nombre_genero])
            return result
        }, async updateGenero(root, { genero }) {
            if (genero === undefined) return null
            const query = `UPDATE genero SET nombre_genero=$2 where id_genero=$1 returning *;`
            let result = await db.one(query, [genero.id_genero, genero.nombre_genero])
            return result
        }, async deleteGenero(root, { id }) {
            const query = `DELETE FROM genero  where id_genero=$1 returning *;`
            let result = await db.one(query, [id])
            return result
        }, async createTipo_producto(root, { tipo_producto }) {
            if (tipo_producto === undefined) return null
            const query = `INSERT INTO tipo_producto(nombre_tipo,descuento_tipo) Values($1,$2) returning *;`
            let result = await db.one(query, [tipo_producto.nombre_tipo, tipo_producto.descuento_tipo])
            return result
        }, async updateTipo_producto(root, { tipo_producto }) {
            if (tipo_producto === undefined) return null
            const query = `UPDATE tipo_producto SET nombre_tipo=$2,descuento_tipo=$3 where id_tipo=$1 returning *;`
            let result = await db.one(query, [tipo_producto.id_tipo, tipo_producto.nombre_tipo, tipo_producto.descuento_tipo])
            return result
        }, async deleteTipo_producto(root, { id }) {
            const query = `DELETE FROM tipo_producto  where id_tipo=$1 returning *;`
            let result = await db.one(query, [id])
            return result
        }, async createTalla(root, { talla }) {
            if (talla === undefined) return null
            const query = `INSERT INTO talla(nombre_talla)Values($1) returning *;`
            let result = await db.one(query, [talla.nombre_talla])
            return result
        }, async updateTalla(root, { talla }) {
            if (talla === undefined) return null
            const query = `UPDATE talla SET nombre_talla=$2 where id_talla=$1 returning *;`
            let result = await db.one(query, [talla.id_talla, talla.nombre_talla])
            return result
        }, async deleteTalla(root, { id }) {
            const query = `DELETE FROM talla  where id_talla=$1 returning *;`
            let result = await db.one(query, [id])
            return result
        }, async createFactura(root, { factura }) {
            if (factura === undefined) return null
            let cantidad = []
            let aux = 0;
            if (factura.productosIDs && factura.productosIDs.length > 0) {
                for (let element of factura.productosIDs) {                   
                    let producto = await db.any("select*from producto where id_producto=$1", [element])                                       
                    cantidad[aux] = parseInt(producto[0].cantidad) - factura.cantidadDetalle[aux]
                    if (cantidad[aux] < 0) {
                        return null
                    }
                    aux++
                }
            }           
            let facturaU = await db.one(`select count(*) from factura`).catch(err => { console.log(err) })            
            let id_factura = "0001"
            if (facturaU !== undefined) {
                id_factura = "000" + (parseInt(facturaU.count) + 1)
            }
            const query = `INSERT INTO factura
                                    Values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning *;`
            let result = await db.one(query, [id_factura, 12, factura.subtotal, factura.total, new Date(), factura.cedula,
                factura.nombre, factura.correo, factura.celular, factura.direccion])
            if (factura.productosIDs && factura.productosIDs.length > 0) {
                aux = 0;
                for (let element of factura.productosIDs) {
                    let result2 = await db.one(`Insert into detalle_factura(id_producto,id_factura,cantidad_detalle) Values($1,$2,$3) returning*;
                                        `, [element, result.id_factura, factura.cantidadDetalle[aux]]).catch(err => { console.log(err) })
                    let result3 = await db.one(`UPDATE producto SET cantidad=$2 where id_producto=$1 
                                                returning *;`, [element, cantidad[aux]])
                    aux++;
                }
            }

            return result
        }

    }
}
export default RopaResolver;
