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
    <td data-label="Seleccionar" style="padding: 10px;">
      <input type="checkbox" class="form-check-input pause-checkbox check" data-id="${producto.producto_id}">
    </td>
    <td data-label="Producto" style="padding: 10px;">
      <div class="contenido-celda d-flex align-items-center gap-2">
        <img src="${imagenUrl}" alt="Producto" style="max-width: 50px;"> 
        <span>${producto.nombre_producto || ""}</span>
      </div>
    </td>
    <td data-label="Precio" style="padding: 10px;">
      <div class="contenido-celda">${producto.precio ? "$ " + producto.precio : ""}</div>
    </td>
    <td data-label="Categoría" style="padding: 10px;">
      <div class="contenido-celda">${categoriaProducto}</div>
    </td>
    <td data-label="Variantes" colspan="2" style="padding: 10px;">
      <div class="contenido-celda" style="max-height: 80px; overflow-y: auto; font-family: monospace;">
        ${
          producto.productos_variantes.map(variacion => {
            const talle = variacion.talles?.insertar_talle || '';
            const color = variacion.colores?.insertar_color || '';
            const stock = variacion.stock || 0;
            return `
              <div class="d-flex justify-content-between gap-2">
                <div>${talle}</div>
                <div>${color}</div>
                <div class="text-end" style="min-width: 30px;">${stock}</div>
              </div>`;
          }).join('')
        }
      </div>
    </td>
    <td data-label="Acciones" class="celda-botones" style="padding: 10px;">
      <div class="d-flex justify-content-center align-items-center flex-wrap gap-2">
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
    <td data-label="Seleccionar">
      <input type="checkbox" class="form-check-input pause-checkbox check" data-id="${producto.producto_id}">
    </td>
    <td data-label="Producto">
      <div class="contenido-celda">
        <img src="${imagenUrl}" alt="Producto" style="max-width: 50px;"> ${producto.nombre_producto || ""}
      </div>
    </td>
    <td data-label="Precio">
      <div class="contenido-celda">${producto.precio ? "$ " + producto.precio : ""}</div>
    </td>
    <td data-label="Categoría">
      <div class="contenido-celda">${categoriaSeleccionada}</div>
    </td>
    <td data-label="Variantes" colspan="2">
      <div style="
        max-height: 80px;
        overflow-y: auto;
        font-family: monospace;
        padding: 5px;
        box-sizing: border-box;
      ">
        ${
          producto.productos_variantes.map(variacion => {
            const talle = variacion.talles?.insertar_talle || '';
            const color = variacion.colores?.insertar_color || '';
            const stock = variacion.stock || 0;
            return `
              <div style="display: flex; gap: 20px; justify-content: space-between;">
                <div>${talle}</div>
                <div>${color}</div>
                <div style="text-align: right;">${stock}</div>
              </div>`;
          }).join('')
        }
      </div>
    </td>
    <td data-label="Acciones" class="celda-botones">
      <div style="display: flex; justify-content: center; align-items: center; gap: 5px;">
        <button class="btn btn-primary btn-sm btn-editar"
          data-id="${producto.producto_id}"
          data-talle-id="${talleIds}"
          data-color-id="${colorIds}"
          data-bs-toggle="modal"
          data-bs-target="#editProductModal">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn btn-danger btn-sm btn-eliminar"
          data-id="${producto.producto_id}"
          data-talle-id="${talleIds}"
          data-color-id="${colorIds}"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal">
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
