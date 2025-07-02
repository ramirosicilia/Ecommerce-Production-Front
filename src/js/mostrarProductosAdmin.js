
import { obtenerProductos } from "./api/productos.js";
import { obtenerCategorys} from "./api/productos.js"; 
import {desactivadoLogicoProductos} from "./registroProductos.js";
import { renderImages } from "./gestionarImagenes.js";




  
const apiUrl=import.meta.env.VITE_BACKEND_URL 

let productos

let categorias

export async function mostrarProductosAdmin() { 
  
 const [producto, categoria] = await Promise.all([
    obtenerProductos(),
    obtenerCategorys()
  ]); 

  productos=producto 
  categorias=categoria


  const selectCategorias = document.getElementById("categoria-select-products");  
  const tbody = document.querySelector("#cuerpo-productos");  
  let stocker=[]

 
  console.log(selectCategorias); // Verifica si el elemento existe en la consola  

  let productosActivos = productos.filter(producto => producto?.activacion === true);  
  let categoriasFiltradas = categorias.filter(categorys => categorys?.activo === true);  

  let productosActivosFiltrados = productosActivos.filter(producto =>  
    categoriasFiltradas.some(categoria => categoria.categoria_id === producto.categoria_id)  
  );  

  console.log(selectCategorias);  

  // Limpiar y agregar solo una vez la lista de categorías  
  if (selectCategorias?.options.length <= 1) {  
    selectCategorias.innerHTML = `<option value="">Selecciona una categoría</option>`;  
    categoriasFiltradas.forEach(categoria => {  
        let option = document.createElement("option");  
        option.value = categoria.nombre_categoria;  
        option.textContent = categoria.nombre_categoria;  
        selectCategorias.appendChild(option);  
    });  
  }  
   if(tbody){ 
    if (productosActivosFiltrados.length > 0) {  
      tbody.innerHTML = ""; // Limpiar antes de renderizar nuevos productos  
  
      productosActivosFiltrados.forEach((producto) => {  
          let categoriaProducto = categoriasFiltradas.find(c => c.categoria_id === producto.categoria_id)?.nombre_categoria;  
    
      
          // Calcular stock sumando todas las variantes  
    
    
          // Obtener la primera imagen del array de imágenes  
          let imagenUrl = producto.imagenes[0]?.urls?.[0];  
  
          
  
              let colorIds = producto.productos_variantes?.[0]?.colores?.color_id || "";
              let talleIds = producto.productos_variantes?.[0]?.talles?.talle_id || ""; 
              let stock=producto.productos_variantes.map(variante=>variante?.stock)??0
            
              if(stock.length>0){ 
              stocker.push(stock)

              }
      
            
              tbody.innerHTML += `  
              <tr class="tabla" >    
                  <td>
                      <input type="checkbox" class="form-check-input pause-checkbox check" data-id="${producto.producto_id}">
                  </td>
                  <td><div class="contenido-celda"><img src="${imagenUrl}" alt="Producto" style="max-width: 50px;"> ${producto.nombre_producto || ""}</div></td>
                 <td><div class="contenido-celda">${producto.precio != null ? "$ " + producto.precio.toFixed(2) : ""}</div></td>
     

                  <td><div class="contenido-celda">${categoriaProducto}</div></td>
            
                  <!-- ✅ Celda combinada con estilos flex y scroll -->
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
                              const stock = variacion.stock ?? 0;
                              return `<div style="display: flex; gap: 20px;">
                                        <div data-size="${producto.producto_id}">${talle}</div>
                                        <div data-colour="${producto.producto_id}">${color}</div>
                                        <div class="stocker"data-stocker="${producto.producto_id}" style="margin-left:auto; position: relative; right: 2rem">${stock}</div>
                                      </div>`;
                            }).join('')
                          }
                      </div>
                  </td>
            
                <td class="celda-botones">
                         <div style="display: flex; justify-content:center; align-items: center; ">
                          <button class="btn btn-primary btn-sm btn-editar" style="margin-left: 20px" data-id="${producto.producto_id}" data-talle-id="${talleIds}" data-color-id="${colorIds}" data-bs-toggle="modal" data-bs-target="#editProductModal"><i class="fas fa-edit"></i> Editar</button>
                          <button class="btn btn-danger btn-sm btn-eliminar" data-id="${producto.producto_id}" data-talle-id="${talleIds}" data-color-id="${colorIds}" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fas fa-trash"></i> Eliminar</button>
                         </div>
                </td>

              </tr>
            `;  

            stockerFuncion(producto.producto_id)

           
      
      });  

      function stockerFuncion(id) {
        const stockAgotadoList = document.querySelectorAll(`[data-stocker="${id}"]`);
           // Obtiene todos los divs con data-* igual al id del producto
              const talleAgotadoList = document.querySelectorAll(`[data-size="${id}"]`);
              const colorAgotadoList = document.querySelectorAll(`[data-colour="${id}"]`);

              // Lee los productos agotados del localStorage
              let productosAgotados = JSON.parse(localStorage.getItem("productosAgotados")) || [];

              stockAgotadoList.forEach((stockEl, index) => {
                const stock = parseInt(stockEl.textContent.trim(), 10);
              
                if (stock === 0) {
                  if (productosAgotados.includes(id)) {
                    stockEl.style.opacity = "0.4";
                  
                    // También aplicar opacidad al talle y color correspondientes
                    if (talleAgotadoList[index]) {
                      talleAgotadoList[index].style.opacity = "0.2";
                    }
                  
                    if (colorAgotadoList[index]) {
                      colorAgotadoList[index].style.opacity = "0.2";
                    }
                  }
                }
              });
      }




      
      const checkBox = [...document.querySelectorAll(".check")];  
      const botonesEdit=document.querySelectorAll('.btn-editar')
      const botonesElim=document.querySelectorAll('.btn-eliminar')
      
  
      desactivadoLogicoProductos(checkBox);  
       activarBotones(botonesEdit,botonesElim,productos);
       actualizarSelectUpdate()
   
  
      return;
  }  
  else {  
        console.log("No hay productos activos para mostrar.");  
    }  

   }
  
}   

 (async()=>{ 
  await  mostrarProductosAdmin();

 })()

 
  

//Update productos  

document.getElementById("openImageModal")?.addEventListener("click", function () {
  let myModal = new bootstrap.Modal(document.getElementById("imageModal-update-modal"));
  myModal.show(); 

});


export let productoID=null  

export  function activarBotones(botonesEdit, botonesElim,producto) { 
 
  botonesEdit.forEach((boton) => {
    boton.addEventListener('click', async (e) => {
      productoID = boton.getAttribute("data-id");
      let dataColorID = boton.getAttribute("data-color-id");
      let dataTalleID = boton.getAttribute("data-talle-id");

      localStorage.setItem("id", JSON.stringify(productoID));
      localStorage.setItem("color-id", JSON.stringify(dataColorID));
      localStorage.setItem("talle-id", JSON.stringify(dataTalleID));

          renderImages();
    
      // ✅ Volver a cargar select de colores y talles después de cambiar el ID
       seleccionarColor(producto);     // <---
       seleccionartalles(producto);   // <--- 
       renderizarCombinacionesStock(producto);
    
    });
  });

  botonesElim.forEach((boton) => {
    boton.addEventListener('click', async (e) => {
      const productoID = boton.getAttribute("data-id");
      let dataColorID = boton.getAttribute("data-color-id");
      let dataTalleID = boton.getAttribute("data-talle-id");
       eliminarProductoSinVentas(productoID, dataColorID, dataTalleID);
    });
  });
}



// Capturar cada input en una variable distinta

const actualizarNombre = document.getElementById("update-ProductName");
const actualizarPrecio = document.getElementById("update-ProductPrice");
const actualizarDescripcion = document.getElementById("updateDetailDescription");
const actualizarStock = document.getElementById("updateProductStock");
const actualizarTalle = document.getElementById("update-productSize");
const actualizarColor = document.getElementById("update-product-Colors");
const actualizarCategoria = document.getElementById("productCategory-update");
const actualizarNombreDetalle = document.getElementById("update-productNameDetail"); 
const selectorColores=document.getElementById("select-productColors-update-2")
const selectorTalles=document.getElementById("select-productSizes-update")



 function actualizarSelectUpdate(){  
  
  const selectCategorias = document.getElementById("productCategory-update"); 

  if(selectCategorias){
    selectCategorias.innerHTML = `<option value="">Selecciona una categoría</option>`;


    console.log(categorias);
    let categoriasFiltras= categorias.filter(categorys => categorys?.activo != false);
  
    categoriasFiltras.forEach((categoria) => { 
          selectCategorias.innerHTML += `<option value="${categoria.nombre_categoria}">${categoria.nombre_categoria}</option>`;
        });
      }
  
  }    


 

   function seleccionarColor(productos) {
 
    const productoIDSeleccionado = JSON.parse(localStorage.getItem("id"));


  
    // Limpiar opciones anteriores
   if(selectorColores){ 
    selectorColores.innerHTML = '<option value="">Seleccioná un color existente</option>';
  
    // Buscar el producto que coincide con el ID seleccionado
    const productoEncontrado = productos?.find(producto => producto.producto_id === productoIDSeleccionado); 
  

 
    if (!productoEncontrado) {
      console.warn("No se encontró el producto con ID:", productoIDSeleccionado);
      return;
    }

  
    // Recorrer solo las variantes del producto encontrado
    productoEncontrado.productos_variantes?.forEach((variante) => {
      const color = variante?.colores;
      const stock = variante?.stock;
      const talla=variante?.talles?.insertar_talle
    
      if (color) {
        const nombreColor = color.insertar_color;
        const idColor = color.color_id;
    
        if (nombreColor && idColor) {
          const option = document.createElement("option");
          option.value = nombreColor;
          option.textContent = `${nombreColor} ${talla} (Stock: ${stock})`;
          selectorColores.appendChild(option);
        }
      }
    });

   }
    
    
  }
  
  

 
 let idColorEncontrado=null
 let idTalleEncontrado =null 
 let colorNombreSeleccionado=null
 let TalleNombreSeleccionado=null

  
 selectorColores?.addEventListener("change", async (e) => {
  console.log("Evento change disparado"); 

  

  console.log("Productos obtenidos:", productos);

  const productoIDSeleccionado = JSON.parse(localStorage.getItem("id"));
  console.log("ID del producto seleccionado:", productoIDSeleccionado);

     colorNombreSeleccionado = e.target.value;
  console.log("Nombre del color seleccionado:", colorNombreSeleccionado); 
  

  const productoEncontrado = productos.find(producto => producto.producto_id === productoIDSeleccionado);

  if (!productoEncontrado) {
    console.warn("Producto no encontrado con ID:", productoIDSeleccionado);
    return;
  }

  console.log("Producto encontrado:", productoEncontrado);
  console.log("Variantes del producto:", productoEncontrado.productos_variantes);

  // Buscar la variante con el nombre del color seleccionado
  const varianteEncontrada = productoEncontrado.productos_variantes.find(variante => 
    variante.colores?.insertar_color === colorNombreSeleccionado
  );

  if (varianteEncontrada) {
     idColorEncontrado = varianteEncontrada.colores.color_id;
    console.log("Variante encontrada:", varianteEncontrada);
    console.log("ID del color correspondiente:", idColorEncontrado);

    // Podés guardar el ID si lo necesitás más adelante 
  

  
  } else {
    console.warn("No se encontró una variante con el color:", colorNombreSeleccionado);
  }
});  




 function seleccionartalles(productos) {

  const productoIDSeleccionado = JSON.parse(localStorage.getItem("id"));


  if(selectorTalles){ 
    
  // Limpiar opciones anteriores
  selectorTalles.innerHTML = '<option value="">Seleccioná un color existente</option>';

  // Buscar el producto que coincide con el ID seleccionado
  const productoEncontrado = productos?.find(producto => producto.producto_id === productoIDSeleccionado); 



  if (!productoEncontrado) {
    console.warn("No se encontró el producto con ID:", productoIDSeleccionado);
    return;
  }
   

  // Recorrer solo las variantes del producto encontrado
  productoEncontrado.productos_variantes?.forEach((variante) => {
    const talle = variante?.talles;
    const stock = variante?.stock;
    const color=variante.colores?.insertar_color
  
    if (talle) {
      const nombreTalle = talle?.insertar_talle;
      const idTalle = talle?.talle_id;
  
      if (nombreTalle && idTalle) {
        const option = document.createElement("option");
        option.value = nombreTalle;
        option.textContent = `${nombreTalle} ${color} (Stock: ${stock})`;
        selectorTalles.appendChild(option);
      }
    }
  });

  }


}





selectorTalles?.addEventListener("change",(e)=>{ 
  console.log("Evento change disparado"); 

  

  console.log("Productos obtenidos:", productos);

  const productoIDSeleccionado = JSON.parse(localStorage.getItem("id"));
  console.log("ID del producto seleccionado:", productoIDSeleccionado);

    TalleNombreSeleccionado = e.target.value;
  console.log("Nombre del color seleccionado:", TalleNombreSeleccionado);

  const productoEncontrado = productos.find(producto => producto.producto_id === productoIDSeleccionado);

  if (!productoEncontrado) {
    console.warn("Producto no encontrado con ID:", productoIDSeleccionado);
    return;
  }

  console.log("Producto encontrado:", productoEncontrado);
  console.log("Variantes del producto:", productoEncontrado.productos_variantes);

  // Buscar la variante con el nombre del color seleccionado
  const varianteEncontrada = productoEncontrado.productos_variantes.find(variante => 
    variante.talles?.insertar_talle === TalleNombreSeleccionado
  );

  if (varianteEncontrada) {
     idTalleEncontrado = varianteEncontrada.talles.talle_id;
    console.log("Variante encontrada:", varianteEncontrada);
    console.log("ID del talle correspondiente:", idTalleEncontrado);

    // Podés guardar el ID si lo necesitás más adelante
    localStorage.setItem("talle-id", JSON.stringify(idTalleEncontrado));
  } else {
    console.warn("No se encontró una variante con el color:", TalleNombreSeleccionado);
  }

}) 


let stock = null; 
let stockId = null; // ← para guardar el ID del stock


const selectCombinaciones = document.getElementById("select-stock-combinaciones");

// Este objeto nos servirá para mapear cada combinación a su stock
const combinacionesStock = {};

function renderizarCombinacionesStock(productos) {

  const productoIDSeleccionado = JSON.parse(localStorage.getItem("id"));

   if(selectCombinaciones){ 

     // Limpiar el select antes de agregar nuevas opciones
  selectCombinaciones.innerHTML = '<option disabled selected>Seleccioná una combinación</option>';

  const producto = productos?.find(p => p.producto_id === productoIDSeleccionado); 



  if (!producto || !producto.productos_variantes) {
    console.warn("Producto no encontrado o sin variantes.");
    return;
  }

  producto.productos_variantes.forEach(variacion => {
    const talle = variacion?.talles?.insertar_talle;
    const color = variacion?.colores?.insertar_color;
    const stockVariante = variacion?.stock;
    const stockVarianteId = variacion?.variante_id;

    if (talle && color) {
      const clave = `${talle}-${color}`;

      // Guardamos el stock en el mapa
      combinacionesStock[clave] = {
        stock: stockVariante,
        stock_id: stockVarianteId
      }; 


      const option = document.createElement("option");
      option.value = clave;
      option.textContent = `${talle} - ${color} (Stock: ${stockVariante})`;
      selectCombinaciones?.appendChild(option);
    }
  });

   }
 
}



// 🎯 Evento cuando cambia el select
selectCombinaciones?.addEventListener("change",() => { 
  
 
  const valorSeleccionado = selectCombinaciones.value; // Ej: "S-rojo"
  console.log(valorSeleccionado)


  if (combinacionesStock[valorSeleccionado] !== undefined) {
    stock = combinacionesStock[valorSeleccionado];
    stockId = combinacionesStock[valorSeleccionado]?.stock_id;
    console.log("Stock para la combinación seleccionada:", stock);
    console.log("Stock ID:");
    // Acá podés mostrarlo en el DOM o hacer lo que necesites 

    localStorage.setItem("stock-id", JSON.stringify(stockId)); 

  } else {
    stock = null;
    console.warn("No se encontró el stock para la combinación seleccionada.");
  }
});




  actualizarNombre?.addEventListener("click",()=>{  
    const id = JSON.parse(localStorage.getItem("id"));
  
     updateNombreProducto(id) 
   
   
    }) 
   
    actualizarPrecio?.addEventListener("click",()=>{ 
      const id = JSON.parse(localStorage.getItem("id"));
      updatePrecioProducto(id)
    }) 

   
     actualizarDescripcion?.addEventListener("click",()=>{ 
      const id = JSON.parse(localStorage.getItem("id"));
       updateDescripcionProducto(id)
      }) 
   
      actualizarStock?.addEventListener("click",()=>{ 
   
        const productoID=JSON.parse(localStorage.getItem("id"));
        const stockID=JSON.parse(localStorage.getItem("stock-id"))
      
         
         
       updateStockProducto(productoID,stockID)
   
      })  
   
   
      actualizarColor?.addEventListener("click",()=>{ 
        
        const productoID=JSON.parse(localStorage.getItem("id"));
      
  
        if (!idColorEncontrado || !productoID ) {
          console.error("Faltan los IDs necesarios.");
          return;
        } 

        updateColorProducto(productoID)
      })   




      actualizarTalle?.addEventListener("click",()=>{ 
        const talleID = JSON.parse(localStorage.getItem("talle-id"));
             
        const productoID=JSON.parse(localStorage.getItem("id"));
        updateTalleProducto(talleID,productoID)
      })  




   
      actualizarNombreDetalle?.addEventListener("click",()=>{ 
        const id = JSON.parse(localStorage.getItem("id"));


        updateDetallesProducto(id)
       
      }) 
   
      actualizarCategoria?.addEventListener("change",(e)=>{ 
        const id = JSON.parse(localStorage.getItem("id"));
        updateCategoriaProducto(id,e.target.value)
   
      })

    async function updateNombreProducto(id) {
      try {  
         const input= document.getElementById("productName-update")
        const nombre_producto = document.getElementById("productName-update").value.trim();

        if (nombre_producto === "" || /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s\-]+$/.test(nombre_producto) === false) {
        
          document.getElementById("error-nombre-update").textContent = 'El nombre del producto no puede contener números ni caracteres no permitidos.';
          return;
      }

          const response = await fetch(`${apiUrl}/update-nombre-producto/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nombre_producto })
          });
      let data= await response.json(); 

         input.value="" 

        
        localStorage.removeItem("id");
        localStorage.removeItem("color-id");
        localStorage.removeItem("talle-id"); 

         setTimeout(() => {
          window.location.reload()
          
        }, 400);
        
        

      } catch (error) {
          console.error("Error al actualizar el nombre del producto:", error);
      } 


    } 



async function updatePrecioProducto(id) {
    try {  
      const input=document.getElementById("productPrice-update")
      const precio=document.getElementById("productPrice-update").value.trim(); 

      if(precio===""){ 
        
        document.getElementById("error-nombre-update").textContent = 'El precio tiene que ser un numero valido';
   
        return
      } 

        const response = await fetch(`${apiUrl}/update-precio-producto/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ precio })
        }); 

        let data= await response.json(); 
        input.value="" 

       

        localStorage.removeItem("id");
        localStorage.removeItem("color-id");
        localStorage.removeItem("talle-id"); 

         setTimeout(() => {
          window.location.reload()
          
        }, 400);
        
      
    } catch (error) {
        console.error("Error al actualizar el precio del producto:", error);
    }
}

async function updateDetallesProducto(id) {
    try {   
       const input=document.getElementById("detailName-update")
      const detalles =document.getElementById("detailName-update").value.trim(); 

      if (detalles === "" || /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s\-]+$/.test(detalles) === false) {
        // Mostrar el mensaje de error en lugar de un alert
        document.getElementById("error-detalles-update").textContent = 'El detalle del producto no puede contener números ni caracteres no permitidos.';
        return;
    }
       
        const response = await fetch(`${apiUrl}/update-producto-detalles/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ detalles})
        }); 

        let data= await response.json(); 
        input.value="" 
      

        localStorage.removeItem("id");
        localStorage.removeItem("color-id");
        localStorage.removeItem("talle-id");

         setTimeout(() => {
          window.location.reload()
          
        }, 400);
      


      
    } catch (error) {
        console.error("Error al actualizar los detalles del producto:", error);
    }
}

async function updateCategoriaProducto(id,nombre_categoria) { 
   
   let select=document.getElementById("productCategory-update")
    try {
        const response = await fetch(`${apiUrl}/update-producto-categoria/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre_categoria })
        }); 

        let data= await response.json(); 
         select.value=nombre_categoria

      

         localStorage.removeItem("id");
         localStorage.removeItem("color-id");
         localStorage.removeItem("talle-id");
         
          setTimeout(() => {
          window.location.reload()
          
        }, 400);


    } catch (error) {
        console.error("Error al actualizar la categoría del producto:", error);
    }
}

async function updateDescripcionProducto(id) { 

    try { 
       const input=document.getElementById("detailDescription-update")
      const descripcion = document.getElementById("detailDescription-update").value.trim();  

      if (descripcion === "" || /[\s\S]{3,}/.test(descripcion) === false) {

        // Mostrar el mensaje de error en lugar de un alert
        document.getElementById("error-descripcion-update").textContent = 'La descripción no puede contener números ni caracteres no permitidos.';
        return;
    }

        const response = await fetch(`${apiUrl}/update-precio-descripcion/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descripcion })
        });

        let data= await response.json(); 
        input.value="" 

        

        localStorage.removeItem("id");
        localStorage.removeItem("color-id");
        localStorage.removeItem("talle-id");

         setTimeout(() => {
          window.location.reload()
          
        }, 400);

      
    } catch (error) {
        console.error("Error al actualizar la descripción del producto:", error);
    }
} 




async function updateColorProducto(producto_id) {  


    console.log(producto_id)
   
  
  const input=document.getElementById("update-productColor")
  const insertar_color=document.getElementById("update-productColor").value.trim(); 

  if (insertar_color === "" || /^(?!\s*$)[a-zA-Z\s]+$/.test(insertar_color) === false) {
     
            // Mostrar el mensaje de error en lugar de un alert
            document.getElementById("error-color-update").textContent = 'El color no puede contener números ni caracteres no permitidos.';
            return;
        }

    try {
        const response = await fetch(`${apiUrl}/update-color-producto/${idColorEncontrado}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({insertar_color,producto_id})
        }); 

        let data= await response.json(); 
        input.value="" 

      
         localStorage.removeItem("id");
         localStorage.removeItem("color-id");
         localStorage.removeItem("talle-id");
        
        setTimeout(() => {
          window.location.reload()
          
        }, 400);


    } catch (error) {
        console.error("Error al actualizar el color del producto:", error);
    }

    
}

async function updateTalleProducto(talle_id,producto_id) { 

 
    try {  
        
       const input=document.getElementById("update-productSizes")
       const insertar_talle=document.getElementById("update-productSizes").value.trim(); 

       if (insertar_talle === "" || /^[A-Za-zÁÉÍÓÚáéíóúñÑ\d\s\/\.½¾¼-]+$/ .test(insertar_talle) === false) {
        document.getElementById("error-talle-update").textContent = 'El talle no puede estar vacío ni contener caracteres no permitidos.';
        return;
    } 

        const response = await fetch(`${apiUrl}/update-talle-producto/${talle_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ insertar_talle,producto_id})
        }); 

        let data= await response.json(); 
        input.value="" 

        
         localStorage.removeItem("id");
         localStorage.removeItem("color-id");
         localStorage.removeItem("talle-id"); 

          setTimeout(() => {
          window.location.reload()
          
        }, 400);


    } catch (error) {
        console.error("Error al actualizar el talle del producto:", error);
    }
}



async function updateStockProducto(producto_id,stockAnterior) { 

     const input=document.getElementById("productStock-update")
     const stockInput=document.getElementById("productStock-update").value.trim(); 
     let stock=Number(stockInput) 
     let variante_id=stockAnterior
    
     console.log(stockAnterior) 


      if (stockInput === "" || !/^\d+$/.test(stockInput)) {
            // Mostrar el mensaje de error si el campo está vacío o no es un número entero
            document.getElementById("error-stock-update").textContent = 'El stock debe ser un número entero positivo.';
            return;
        }


    try {
        const response = await fetch(`${apiUrl}/update-stock-producto/${variante_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({stock,producto_id})
        }); 

         let data= await response.json(); 
         input.value="" 

        
         localStorage.removeItem("id");
         localStorage.removeItem("color-id");
         localStorage.removeItem("talle-id"); 

          setTimeout(() => {
          window.location.reload()
          
        }, 400);

    } catch (error) {
        console.error("Error al actualizar el stock del producto:", error);
    }
}

  function mostrarModal() {
    const modalElement = document.getElementById("confirmModal");
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }  


  const imageInput = document.getElementById("productImage"); 

  
console.log(imageInput)
const previewContainer = document.getElementById("imagePreview");

let imagenes = []; // Array para almacenar archivos seleccionados

// Evento para manejar la selección de imágenes
if(imageInput){ 
  imageInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files);
    imagenes = [...imagenes, ...files]; // Agrega las nuevas imágenes al array existente

    previewContainer.innerHTML = ""; // Limpiar previsualización

    imagenes.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.style.width = "100px";
            img.style.margin = "5px";

            // Botón para eliminar imagen seleccionada
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "X";
            removeBtn.style.marginLeft = "5px";
            removeBtn.onclick = () => {
                imagenes.splice(index, 1); // Eliminar del array
                updatePreview(); // Actualizar la vista
            };

            const imgWrapper = document.createElement("div");
            imgWrapper.appendChild(img);
            imgWrapper.appendChild(removeBtn);

            previewContainer.appendChild(imgWrapper);
        };
        reader.readAsDataURL(file);
    });
});

}

// Función para actualizar la previsualización cuando se elimina una imagen
function updatePreview() {
    previewContainer.innerHTML = "";
    imagenes.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.style.width = "100px";
            img.style.margin = "5px";

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "X";
            removeBtn.style.marginLeft = "5px";
            removeBtn.onclick = () => {
                imagenes.splice(index, 1);
                updatePreview();
            };

            const imgWrapper = document.createElement("div");
            imgWrapper.appendChild(img);
            imgWrapper.appendChild(removeBtn);

            previewContainer.appendChild(imgWrapper);
        };
        reader.readAsDataURL(file);
    });
}   

  



export  function  eliminarProductoSinVentas(id,color_id,talle_id) {  
   
  mostrarModal()


 const botonConfirmacion=document.getElementById("boton-confirmacion-borrar") 
 console.log(botonConfirmacion) 
 console.log('se confirmooo el:', id)  
 console.log(talle_id,'talle id')
 console.log(color_id,' color id')


     botonConfirmacion.addEventListener('click',async()=>{   
    
      let productosGuardados = JSON.parse(localStorage.getItem('productos'));
       console.log('se confirmooo el:', id)  
       console.log(talle_id,'talle id')
       console.log(color_id,' color id')

       try {  


        const response = await fetch(`${apiUrl}/borrar-productos/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ color_id, talle_id })
        });
     
         console.log(response)
     
         if (!response.ok) {
           throw new Error("Error al enviar los datos");
         } 

         localStorage.removeItem("productos");
        
   
         Swal.fire({
           title: "Éxito",
           text: "Producto eliminado correctamente",
           icon: "success",
           confirmButtonText: "OK",
         }).then(() => {
           // Cerrar el modal después del mensaje de éxito
           const modalElement = document.getElementById("confirmModal");
           const modalInstance = bootstrap.Modal.getInstance(modalElement);
           modalInstance.hide();
         });

        
 
          const datos=response.json() 
          console.log(datos.data) 

 
         
        

        setTimeout(() => { 
          window.location.reload()
          
        }, 1000); 

        
           console.log(datos.eliminado) 
       } catch (err) {
         Swal.fire({
           title: "Error",
           text: err.message,
           icon: "error",
           confirmButtonText: "Intenta de nuevo",
         });
       }  
   

     })

}   




const botonEliminarNombre=document.querySelector(".boton__eliminar-nombre")
console.log(botonEliminarNombre)
const botonEliminarPrecio=document.querySelector(".boton__eliminar-precio")
const botonEliminarDescripcion = document.querySelector(".boton__eliminar-descripcion");
const botonEliminarStock = document.querySelector(".boton__eliminar-stock");
const botonEliminarTalle = document.querySelector(".boton__eliminar-talle");
const botonEliminarColor = document.querySelector(".boton__eliminar-color");
const botonEliminarNombreDetalle = document.querySelector(".boton__eliminar-nombre-detalle"); 


botonEliminarNombre?.addEventListener("click",  () => { 

  const confirmar = confirm("¿Estás seguro de que querés eliminar el nombre del producto?");
  if (!confirmar) return; // Si el usuario cancela, no hace nada

  const id = JSON.parse(localStorage.getItem("id"));
   eliminarNombreProducto(id);

  
});

botonEliminarPrecio?.addEventListener("click",()=>{ 

  const confirmar = confirm("¿Estás seguro de que querés eliminar el precio del producto?");
  if (!confirmar) return; // Si el usuario cancela, no hace nada 

  const id = JSON.parse(localStorage.getItem("id"));
 
  eliminarPrecioProducto(id)  

 

})


botonEliminarDescripcion?.addEventListener("click",()=>{ 

  const confirmar = confirm("¿Estás seguro de que querés eliminar la descripcion del producto?");
  if (!confirmar) return; // Si el usuario cancela, no hace nada 

  
  const id = JSON.parse(localStorage.getItem("id"));

   eliminarDescripcionProducto(id) 

 
  }) 



botonEliminarColor?.addEventListener("click",()=>{  


  let productoID=JSON.parse(localStorage.getItem('id'))

  const confirmar = confirm("¿Estás seguro de que querés eliminar el color del producto?");

   if(!colorNombreSeleccionado){
    return
   } 

   if (!confirmar) return; // Si el usuario cancela, no hace nada 
 

   eliminarColorProducto(productoID) 

  

}) 


botonEliminarTalle?.addEventListener("click",()=>{  

  let productoID=JSON.parse(localStorage.getItem('id'))

  const confirmar = confirm("¿Estás seguro de que querés eliminar el talle del producto?"); 
  
   if(!TalleNombreSeleccionado){

    return
   } 

   
  if (!confirmar) return; // Si el usuario cancela, no hace nada 

   eliminarTalleProducto(productoID) 

})
 
botonEliminarStock?.addEventListener("click",()=>{ 

  let productoID=JSON.parse(localStorage.getItem('id'))
   
  const confirmar = confirm("¿Estás seguro de que querés eliminar el stock del producto?");
  if (!confirmar) return; // Si el usuario cancela, no hace nada 


  const id = JSON.parse(localStorage.getItem("id"));
   eliminarStockProducto(productoID) 


} 


)

botonEliminarNombreDetalle?.addEventListener("click",()=>{ 

  const confirmar = confirm("¿Estás seguro de que querés eliminar el detalle del producto?");
  if (!confirmar) return; // Si el usuario cancela, no hace nada 


  const id = JSON.parse(localStorage.getItem("id"));

   eliminarDetallesProducto(id) 

 
})



async function eliminarNombreProducto(id) { 

  try {  
  
    const response = await fetch(`${apiUrl}/delete-nombre-producto/${id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
   
    });

    let data= await response.json(); 

  
        setTimeout(() => { 
          window.location.reload()
          
        },300); 

      localStorage.removeItem("id");
      localStorage.removeItem("color-id");
      localStorage.removeItem("talle-id"); 
  }
  catch (error) {
      console.error("Error al eliminar el nombre del producto:", error);
  }
} 

async function eliminarPrecioProducto(id) { 
  try {  
    const response = await fetch(`${apiUrl}/delete-precio-producto/${id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
   
    }); 

    let data= await response.json(); 

    localStorage.removeItem("id");
    localStorage.removeItem("color-id");
    localStorage.removeItem("talle-id"); 
} catch (error) {
      console.error("Error al eliminar el precio del producto:", error);
  }
}
async function eliminarDetallesProducto(id) { 

 
  try {  
    const response = await fetch(`${apiUrl}/delete-producto-detalles/${id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
   
    }); 

    let data= await response.json(); 

    localStorage.removeItem("id");
    localStorage.removeItem("color-id");
    localStorage.removeItem("talle-id");  

     setTimeout(() => {
          window.location.reload()
          
        }, 400); 


} catch (error) {
      console.error("Error al eliminar los detalles del producto:", error);
  }
} 

async function eliminarColorProducto(producto_id) {  
  console.log(producto_id)
  console.log(idColorEncontrado,'color')
  try {  
    const response = await fetch(`${apiUrl}/delete-color-producto/${idColorEncontrado}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({producto_id})
   
    }); 

    let data= await response.json(); 
 
    localStorage.removeItem("id");
    localStorage.removeItem("color-id");
    localStorage.removeItem("talle-id");  

     setTimeout(() => {
          window.location.reload()
          
        }, 400); 


} catch (error) {
      console.error("Error al eliminar el color del producto:", error);
  }
} 

async function eliminarTalleProducto(producto_id) { 
  console.log(producto_id)
  
  try {  
    const response = await fetch(`${apiUrl}/delete-talle-producto/${idTalleEncontrado}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({producto_id})
   
    }); 

    let data= await response.json(); 


  
    localStorage.removeItem("id");
    localStorage.removeItem("color-id");
    localStorage.removeItem("talle-id");  

    setTimeout(() => { 
      window.location.reload()
      
    },300);   

} catch (error) {
      console.error("Error al eliminar el talle del producto:", error);
  }
} 

async function eliminarDescripcionProducto(id) { 

  try {  
    const response = await fetch(`${apiUrl}/delete-producto-descripcion/${id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
   
    }); 

    let data= await response.json(); 


     

    localStorage.removeItem("id");
    localStorage.removeItem("color-id");
    localStorage.removeItem("talle-id");  

    setTimeout(() => { 
      window.location.reload()
      
    },300); 

} catch (error) {
      console.error("Error al eliminar la descripción del producto:", error);
  }
} 

async function eliminarStockProducto(producto_id) { 

  try {  
    const response = await fetch(`${apiUrl}/delete-stock-producto/${stockId}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({producto_id})
   
    }); 

    console.log(stockId,'33')

    let data= await response.json(); 
  
  
    localStorage.removeItem("id");
    localStorage.removeItem("color-id");
    localStorage.removeItem("talle-id");  

    setTimeout(() => { 
      window.location.reload()
      
    },300); 

} catch (error) {
      console.error("Error al eliminar el stock del producto:", error);
  }
}  



















