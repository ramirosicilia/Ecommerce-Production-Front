import {desactivadoLogicoProductos} from "./registroProductos.js";
import { activarBotones } from "./mostrarProductosAdmin.js";
import { obtenerProductos } from "./api/productos.js";
import { obtenerCategorys } from "./api/productos.js";



const selector=document.getElementById("categoria-select-products"); 

let productosFiltrados=[]

console.log(selector) 

let productos
let categorias

export async function filtrarProductos(){ 

    const [producto, categoria] = await Promise.all([
    obtenerProductos(),
    obtenerCategorys()
  ]); 

     productos=producto
     categorias=categoria

    selector.innerHTML=''

  
    console.log(categorias) 

    selector.innerHTML=`<option value="" selected>Todas</option>  ` 

    let categoryFiltradas=categorias.filter(dataCategory=>dataCategory.activo===true)

    if(categoryFiltradas.length>0){
        categoryFiltradas.forEach(categoria=>{
            selector.innerHTML+= `<option value="${categoria.nombre_categoria}">${categoria.nombre_categoria}</option>`
        })
    } 


     productosFiltrados = productos.filter(product => product.activacion === true);
    console.log(productosFiltrados)



}  

(async()=>{ 

    await filtrarProductos() 

})()




const tbody = document.querySelector("#cuerpo-productos");


selector.addEventListener("change", async (e) => {
    const categoriaSeleccionada = e.target.value;
   

    let productosActivos = productos.filter(producto => producto?.activacion === true);
    let categoriasActivas = categorias.filter(cat => cat?.activo === true);
    console.log(categoriasActivas)

    let productosFiltrados = productosActivos.filter(producto =>
        categoriasActivas.some(cat => cat.categoria_id === producto.categoria_id)
    );

    if (!tbody) return;

    if (categoriaSeleccionada === "") {
        tbody.innerHTML = "";

        productosFiltrados.forEach((producto) => {
            let categoriaProducto = categoriasActivas.find(c => c.categoria_id === producto.categoria_id)?.nombre_categoria;

            let imagenUrl = producto.imagenes[0]?.urls?.[0];

            let talles = producto.productos_variantes
                .map(v => v.talles ? v.talles.insertar_talle : null)
                .filter(Boolean)
                .join(", ") || "";

            let colores = producto.productos_variantes
                .map(v => v.colores ? v.colores.insertar_color : null)
                .filter(Boolean)
                .join(", ") || "";

            let colorIds = producto.productos_variantes?.[0]?.colores?.color_id || "N/A";
            let talleIds = producto.productos_variantes?.[0]?.talles?.talle_id || "N/A";

            let tallesArray = talles.split(", ");
            let coloresArray = colores.split(", ");

            console.log(tallesArray);
            console.log(coloresArray);

            let tallesYColores = {};

            for (let i = 0; i < tallesArray.length; i++) {
                let talle = tallesArray[i];
                let color = coloresArray[i];
                tallesYColores[talle] = color;
            }

            console.log(tallesYColores);

            tbody.innerHTML += `
                <tr>
                    <td>
                        <input type="checkbox" class="form-check-input pause-checkbox check" data-id="${producto.producto_id}">
                    </td>
                    <td><div class="contenido-celda"><img src="${imagenUrl}" alt="Producto" style="max-width: 50px;"> ${producto.nombre_producto || ""}</div></td>
                    <td><div class="contenido-celda">${producto.precio ? "$ " + producto.precio : ""}</div></td>
                    <td><div class="contenido-celda">${categoriaProducto}</div></td>
                    <td colspan="2">
                        <div style="
                            max-height: 80px; 
                            overflow-y: auto; 
                            font-family: monospace;
                        ">
                            ${
                                producto.productos_variantes.map(variacion => {
                                    const talle = variacion.talles?.insertar_talle || '';
                                    const color = variacion.colores?.insertar_color || '';
                                    const stock = variacion.stock || 0;
                                    return `<div style="display: flex; gap: 20px;">
                                                <div>${talle}</div>
                                                <div>${color}</div>
                                                <div style="margin-left:auto; position: relative; right: 2rem">${stock}</div>
                                            </div>`;
                                }).join('')
                            }
                        </div>
                    </td>
                    <td class="celda-botones">
                        <div style="display: flex; justify-content:center; align-items: center;">
                            <button class="btn btn-primary btn-sm btn-editar" data-id="${producto.producto_id}" data-talle-id="${talleIds}" data-color-id="${colorIds}" data-bs-toggle="modal" data-bs-target="#editProductModal">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${producto.producto_id}" data-talle-id="${talleIds}" data-color-id="${colorIds}" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        const botonesEditar = [...document.querySelectorAll(".btn-editar")];
        const botonesEliminar = [...document.querySelectorAll(".btn-eliminar")];
        const checkBox = [...document.querySelectorAll(".check")];

        activarBotones(botonesEditar, botonesEliminar);
        desactivadoLogicoProductos(checkBox);
        return;
    }

    tbody.innerHTML = "";

    const categoriaObj = categoriasActivas.find(cat => cat.nombre_categoria === categoriaSeleccionada);

    if (categoriaObj) {
        let productosCategoria = productosFiltrados.filter(prod => prod.categoria_id === categoriaObj.categoria_id);

        productosCategoria.forEach((producto) => {
            let imagenUrl = producto.imagenes[0]?.urls?.[0];

           
            let colorIds = producto.productos_variantes?.[0]?.colores?.color_id || "N/A";
            let talleIds = producto.productos_variantes?.[0]?.talles?.talle_id || "N/A";

       

            tbody.innerHTML += `
                <tr>
                    <td>
                        <input type="checkbox" class="form-check-input pause-checkbox check" data-id="${producto.producto_id}">
                    </td>
                    <td><div class="contenido-celda"><img src="${imagenUrl}" alt="Producto" style="max-width: 50px;"> ${producto.nombre_producto || ""}</div></td>
                    <td><div class="contenido-celda">${producto.precio ? "$ " + producto.precio : ""}</div></td>
                    <td><div class="contenido-celda">${categoriaSeleccionada}</div></td>
                    <td colspan="2">
                        <div style="
                            max-height: 80px; 
                            overflow-y: auto; 
                            font-family: monospace;
                        ">
                            ${
                                producto.productos_variantes.map(variacion => {
                                    const talle = variacion.talles?.insertar_talle || '';
                                    const color = variacion.colores?.insertar_color || '';
                                    const stock = variacion.stock || 0;
                                    return `<div style="display: flex; gap: 20px;">
                                                <div>${talle}</div>
                                                <div>${color}</div>
                                                <div style="margin-left:auto; position: relative; right: 2rem">${stock}</div>
                                            </div>`;
                                }).join('')
                            }
                        </div>
                    </td>
                    <td class="celda-botones">
                        <div style="display: flex; justify-content:center; align-items: center;">
                            <button class="btn btn-primary btn-sm btn-editar" data-id="${producto.producto_id}" data-talle-id="${talleIds}" data-color-id="${colorIds}" data-bs-toggle="modal" data-bs-target="#editProductModal">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${producto.producto_id}" data-talle-id="${talleIds}" data-color-id="${colorIds}" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        const botonesEditar = [...document.querySelectorAll(".btn-editar")];
        const botonesEliminar = [...document.querySelectorAll(".btn-eliminar")];
        const checkBox = [...document.querySelectorAll(".check")];

        activarBotones(botonesEditar, botonesEliminar,productos);
        desactivadoLogicoProductos(checkBox);
    }
});
