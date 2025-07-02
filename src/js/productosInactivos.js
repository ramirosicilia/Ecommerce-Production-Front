import { desactivadoLogicoProductos } from "./registroProductos.js"; 
import { obtenerProductos } from "./api/productos.js";
import { obtenerCategorys } from "./api/productos.js";
import {mostrarProductosAdmin,activarBotones} from "./mostrarProductosAdmin.js";

const btnInactivar=document.getElementById("mostrarInactivosBtn") 


console.log(btnInactivar) 

btnInactivar.addEventListener('click',productosInactivos) 


const tbody=document.getElementById("cuerpo-productos") 

   let entrada=true
   
async function productosInactivos() { 

    btnInactivar
 
  const [productos, categorias] = await Promise.all([
    obtenerProductos(),
    obtenerCategorys()
  ]); 



    let productosInactivos = productos.filter(producto => producto?.activacion === false);
    let categoriasActivas = categorias.filter(cat => cat?.activo === true);

    let productosFiltrados = productosInactivos.filter(producto =>{ 
     let categoriaFiltrada=categoriasActivas.some(cat => cat.categoria_id === producto.categoria_id)  
     return categoriaFiltrada

    }
       
    );

    if (!tbody) return;

    tbody.innerHTML = "";

   if(entrada){ 

    btnInactivar.textContent="Mostrar Activos"
     for (let i = 0; i < productosFiltrados.length; i++) {
        const producto = productosFiltrados[i];

        let categoriaProducto = categoriasActivas.find(c => c.categoria_id === producto.categoria_id)?.nombre_categoria;
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
         
    } 
      const botonesEditar = [...document.querySelectorAll(".btn-editar")];
         const botonesEliminar = [...document.querySelectorAll(".btn-eliminar")];
      const checkBox = [...document.querySelectorAll(".check")];
            checkBox.forEach((check) => {
                check.addEventListener("change", (e) => {
                    if (!e.target.checked) {
                        const fila = e.target.closest("tr");
                        if (fila) fila.remove();
                    }
                });
            });
            desactivadoLogicoProductos(checkBox); 

      activarBotones(botonesEditar, botonesEliminar);
      
    

   } 

   else{
    entrada=false  
      btnInactivar.textContent="Mostrar Inactivos"
   await mostrarProductosAdmin()
   }
   
    entrada=!entrada
}



