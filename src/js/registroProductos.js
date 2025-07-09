import { validarFormularioProducto,validarFormularioVariantes } from "./validacionAdmin.js"; 
import { obtenerCategorys} from "./api/productos.js";






const selectorNombre= document.getElementById("selectProduct-nombre"); 


const apiUrl=import.meta.env.VITE_BACKEND_URL
let producto_id = null; // Variable para almacenar el ID del producto seleccionado
 
  


    console.log(selectorNombre); // Verifica si el elemento existe 
    let productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];

    if (selectorNombre) {
      selectorNombre.innerHTML = ""; // Limpia el select 

       // Crea la opción "Seleccione un producto" desactivada y seleccionada por defecto
      let optionDefault = document.createElement("option");
      optionDefault.value = "";  // Valor vacío para la opción por defecto
      optionDefault.textContent = "Seleccione un producto";
      optionDefault.disabled = true;
      optionDefault.selected = true;
      selectorNombre.appendChild(optionDefault); 

      productosGuardados.forEach((producto) => {
        let option = document.createElement("option");
        option.value = "seleccione un producto";
        option.value = producto.nombre_producto;
        option.textContent = producto.nombre_producto;
        selectorNombre.appendChild(option);
      });
      
    }
  

  

   if(selectorNombre){ 

    selectorNombre.addEventListener("change", () => {
      let producto_nombre = selectorNombre.value; 
    if(producto_nombre){
      const productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];
      const producto = productosGuardados.find((producto) => producto.nombre_producto === producto_nombre);
      producto_id = producto.producto_id;
    }
     
  });

   }

  

const manageBtn = document.getElementById("manageAttributes");

if (manageBtn) {  // Verifica que el elemento existe antes de agregar el evento
  manageBtn.addEventListener("click", function () {
    const modalElement = document.getElementById("attributesModal");

    if (modalElement) {  // Verifica que el modal existe antes de usarlo
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  });
} 


const formulario = document.getElementById("formulario-productos"); 
console.log(formulario) 
const selector = document.getElementById("productCategory");
console.log(selector); // Verifica si el elemento existe


const categoriasInsetar=async()=>{
  

 let categorias = await obtenerCategorys(); 

 let categoriasFiltradas=categorias.filter(categoria=>categoria.activo!=false)

categoriasFiltradas.forEach((categoria) => { 
    if(selector){
      selector.innerHTML += `<option value="${categoria.nombre_categoria}">${categoria.nombre_categoria}</option>`;
    }

  });


} 

categoriasInsetar() 


let categoriaID=null 

if(selector){ 
  selector.addEventListener("change",async()=>{ 
    const categoriaValor=selector.value
    const categorias = await obtenerCategorys(); 
    categorias.forEach((categoria) => { 
      if(categoria.nombre_categoria===categoriaValor){ 
        categoriaID=categoria.categoria_id
      }
    }); 
  }
  
  )


}



 async function downloadProduct(e) { 
  
  if (!validarFormularioProducto()) {
    return;
  } 


  
 console.log('entro a la funcion') 
 console.log(e.target)
 console.log(categoriaID) 

  try {
    // Capturar elementos
    const nombreProducto = document.getElementById("productName").value;
    const precio = document.getElementById("productPrice").value;
    const detalleNombre = document.getElementById("detailName").value;
    const detalleDescripcion = document.getElementById("detailDescription").value;
    const inputFile = document.getElementById("productImage");
    const imagenes = Array.from(inputFile.files); // Obtiene los archivos
  

    if (!nombreProducto || !precio ||  !detalleNombre || !detalleDescripcion) {
      throw new Error("⚠️ Faltan campos obligatorios. Por favor, asegúrese de llenar todos los campos.");
    } 

    console.log(nombreProducto,precio,categoriaID,detalleNombre,detalleDescripcion)
     
    const formData = new FormData(); 

    formData.append("nombre_producto", nombreProducto);
    formData.append("precio", precio);  
    formData.append("categorias", categoriaID);
    formData.append("detalles", detalleNombre);
    formData.append("descripcion", detalleDescripcion);
    imagenes.forEach((imagen) => formData.append("images", imagen)); 

    console.log([...formData]); 
    
   

    const response = await fetch(`${apiUrl}/subir-productos`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText || "Error al subir el producto"}`);
    } 


      let data=await response.json()
      let nombreSelect=data.nombre  
      let dataID=data.id
    
      let productosGuardados = JSON.parse(localStorage.getItem('productos')) || [];

      // Agregar el nuevo producto al array
      productosGuardados.push({
        producto_id: dataID,
        nombre_producto: nombreSelect
      });
    
      // Guardar el array actualizado en localStorage
      localStorage.setItem('productos', JSON.stringify(productosGuardados));
    
      // Obtener el elemento select
    
    
      // Limpiar el select antes de actualizarlo
     

    e.target.reset();
    if (typeof previewContainer !== "undefined") {
      previewContainer.innerHTML = "";
    } 

    Swal.fire({
      title: "Éxito",
      text: "Producto guardado correctamente",
      icon: "success",
      confirmButtonText: "OK",
    }); 

    setTimeout(() => {
      window.location.reload();
      
    }, 1000);
  }
  
  
  
  
  catch (err) {
    console.error("Error:", err);
    Swal.fire({
      title: "Error",
      text: err.message,
      icon: "error",
      confirmButtonText: "Intenta de nuevo",
    });
    const errorImagen = document.getElementById("error-imagen");
    if (errorImagen) errorImagen.textContent = err.message;
  }
}

if (formulario) {
  formulario.addEventListener("submit", async (e) => { 
    
    e.preventDefault();
    await downloadProduct(e);
  });
} 


let tallesSet = new Set();
let coloresSet = new Set();
let stockSet = []; 

let inputSize = null;
let inputColor = null;
let inputStock = null;

let selectedTalle = null;
let selectedColor = null;
let selectedStock = null;

// Función para actualizar el select con las opciones del Set
const updateSelect = (selectElement, valuesSet) => {
    selectElement.innerHTML = "";
    valuesSet.forEach(value => {
        let option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        selectElement.appendChild(option);
    });
};
let seleccionarTamaño=document.getElementById("productSizeSelect") 


if(seleccionarTamaño){
  seleccionarTamaño.addEventListener("change", (e) => {
    selectedTalle = e.target.value;
});

}
 
let seleccionarColor=document.getElementById("productColorSelect")

if(seleccionarColor){
  seleccionarColor.addEventListener("change", (e) => {
    selectedColor = e.target.value;
});
} 

let seleccionarStock=document.getElementById("productStockSelect") 

if(seleccionarStock){
  seleccionarStock.addEventListener("change", (e) => {
    selectedStock = Number(e.target.value);
});


}


// Función para agregar talles
const addSize = () => {
    inputSize = document.getElementById("productSize").value.trim();
    if (inputSize) {
        inputSize.split(" ").forEach(size => tallesSet.add(size));
        document.getElementById("productSize").value = "";
        updateSelect(document.getElementById("productSizeSelect"), tallesSet);
    }
};

// Función para agregar colores
const addColor = () => {
     inputColor = document.getElementById("productColor").value.trim();
    if (inputColor) {
        inputColor.split(" ").forEach(color => coloresSet.add(color));
        document.getElementById("productColor").value = "";
        updateSelect(document.getElementById("productColorSelect"), coloresSet);
    }
};

// Función para agregar stock
const addStock = () => {
     inputStock = document.getElementById("productStock").value.trim();
    if (inputStock) {
        inputStock.split(" ").forEach(stock => stockSet.push(stock));
        document.getElementById("productStock").value = "";
        updateSelect(document.getElementById("productStockSelect"), stockSet);
    }
};

// Event Listeners para agregar valores
document.getElementById("addSize")?.addEventListener("click", addSize);
document.getElementById("addColor")?.addEventListener("click", addColor);
document.getElementById("addStock")?.addEventListener("click", addStock);

// Función para manejar el botón de enviar
document.getElementById("submitBtn")?.addEventListener("click", () => {  

  const selectTalle = inputSize !== "" ? inputSize : selectedTalle;
  const selectColor = inputColor !== "" ? inputColor :selectedColor;
  const selecStock= inputStock !== "" ? inputStock : selectedStock;
 
  
  if (!validarFormularioVariantes(selectTalle,selectColor,selecStock)) return; 

  
    console.log("Talle seleccionado:", selectedTalle);
    console.log("Color seleccionado:", selectedColor);
    console.log("Stock seleccionado:", selectedStock);

    subirCaracteristicasYStock(selectedTalle, selectedColor, selectedStock);
});

// Función de envío de datos
async function subirCaracteristicasYStock(insertar_talle, insertar_color, stock) {  
  console.log("Talle seleccionado:", inputSize);
  console.log("Color seleccionado:", inputColor);
  console.log("Stock seleccionado:", inputStock); 

  insertar_talle = inputSize !== "" ? inputSize : insertar_talle;
  insertar_color = inputColor !== "" ? inputColor : insertar_color;
  stock = inputStock !== "" ? inputStock : stock;



    if (!producto_id) {
        Swal.fire({
            title: "Error",
            text: "Producto no encontrado. Debe guardar el producto primero.",
            icon: "error",
            confirmButtonText: "OK",
        });
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/insertar-caracteristicas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ producto_id, insertar_talle, insertar_color, stock }),
        });

        if (response.ok) {
            Swal.fire({
                title: "Éxito",
                text: "Características y stock insertados correctamente",
                icon: "success",
                confirmButtonText: "OK",
            });

            setTimeout(() => window.location.reload(), 1500); 
          

        } else { 
            throw new Error("Error al insertar las características");
        }
    } catch (err) {
        Swal.fire({
            title: "Error",
            text: err.message,
            icon: "error",
            confirmButtonText: "Intenta de nuevo",
        });
    }
}





   // Desactivar productos lógicamente
  export function desactivadoLogicoProductos(check) {
    const estadosGuardados = JSON.parse(localStorage.getItem("productosEstado")) || {};

    console.log(estadosGuardados,'lo voy a descubrir')
  
    check.forEach((ck) => {
      const dataID = ck.getAttribute("data-id");
      
      const filaProducto = ck.closest("tr");
    

      const celdasContenido = filaProducto?.querySelectorAll(".contenido-celda") || [];
     const botonesAccion = filaProducto?.querySelectorAll(".btn-editar, .btn-eliminar") || [];

  
      // Restaurar estado desde localStorage
      if (estadosGuardados[dataID] === "desactivado") {
        ck.checked = true;
        filaProducto.classList.add("desactivado");
        celdasContenido.forEach((celda) => (celda.style.opacity = "0.4"));
        botonesAccion.forEach((boton) => (boton.style.opacity = "0.4")); // Botones sin opacidad
      } else {
        ck.checked = false;
        filaProducto.classList.remove("desactivado");
        celdasContenido.forEach((celda) => (celda.style.opacity = "1"));
        botonesAccion.forEach((boton) => (boton.style.opacity = "1")); // Botones sin opacidad
      }
  
      ck.addEventListener("change", async (e) => {
        const desactivado = e.target.checked;
  
        try {
          const response = await fetch(`${apiUrl}/desactivar-productos/${dataID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activo: !desactivado }),
          });
  
          if (!response.ok) throw new Error("Error al actualizar el producto");
  
          if (desactivado) {
            filaProducto.classList.add("desactivado");
            celdasContenido.forEach((celda) => (celda.style.opacity = "0.4"));
            botonesAccion.forEach((boton) => (boton.style.opacity = desactivado ? "0.4" : "1"));
            estadosGuardados[dataID] = "desactivado"; 
            console.log(estadosGuardados,'if')
            localStorage.setItem("productosEstado", JSON.stringify(estadosGuardados));
  
          } else { 
           
            filaProducto.classList.remove("desactivado");
            celdasContenido.forEach((celda) => (celda.style.opacity = "1"));
            delete estadosGuardados[dataID]; 
            botonesAccion.forEach((boton) => (boton.style.opacity = "1"));
            console.log(estadosGuardados,"else")
            localStorage.setItem("productosEstado", JSON.stringify(estadosGuardados));
  
          }
  
      
          Swal.fire({
            title: desactivado
              ? "Producto desactivado correctamente"
              : "Producto activado correctamente",
            icon: "success",
            confirmButtonText: "Entendido",
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo actualizar el estado del producto.",
            icon: "error",
            confirmButtonText: "Intentar nuevamente",
          });
          e.target.checked = !desactivado; // Restaurar estado visual
        }
      });
    });
  }
  


  



  

  









