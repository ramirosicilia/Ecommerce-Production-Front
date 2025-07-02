

export function validarFormularioProducto() {
  let errores = {
    nombre: "",
    precio: "",
    categoria: "",
    imagen: "",
    tamaño: "",
    color: "",
    detalles: "",
    detalleNombre: ""
  };

  // Obtener los valores de los campos del formulario
  const nombre = document.getElementById("productName").value;
  const precio = document.getElementById("productPrice").value;
  const categoria = document.getElementById("productCategory").value;
  const imagen = document.getElementById("productImage");
  const detalles = document.getElementById("detailDescription").value;



  const nombreDetalle = document.getElementById("detailName").value

  // Expresiones regulares para validación
  const nombreValidado = /^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9\s\-\']+$/;
  const precioValidado = /^\d+(\.\d{1,2})?$/;
  const detalleNombreValidado = /^[\p{L}\p{N}\s.,\-_'"/()!¡¿?&%$#@*+°|\\[\]{}<>…♥❤★☆•ºª~´`^=;:∞✓✔🖤💖💫✨👛👜🎀👠]*$/u;

  const categoriaValidado = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

  // Validaciones
  if (!nombre || !nombreValidado.test(nombre)) {
    errores.nombre = "El nombre solo debe contener letras y espacios.";
  }
  if (!precio || !precioValidado.test(precio)) {
    errores.precio = "El precio debe ser un número válido.";
  }
  if (!imagen || !imagen.files.length) {
    errores.imagen = "Debe subir una imagen.";
  }
  
  if (!detalles.trim() ) {
    errores.detalles = "Ingrese una descripción de producto válida.";
  }
 
  if (!nombreDetalle || !detalleNombreValidado.test(nombreDetalle)) {
    errores.detalleNombre = "Ingrese un nombre válido para el detalle.";
  } 

  if (!categoria || !categoriaValidado.test(categoria)) {
    errores.categoria = "Selecciona una categoría válida.";
}

  // Mostrar los errores en el DOM
  document.getElementById("error-nombre").textContent = errores.nombre;
  document.getElementById("error-precio").textContent = errores.precio;
  document.getElementById("error-categoria").textContent = errores.categoria;
  document.getElementById("error-imagen").textContent = errores.imagen;
  document.getElementById("error-detalle-nombre").textContent = errores.tamaño;
  document.getElementById("error-detalles").textContent = errores.detalles;


  // Retornar true si no hay errores
  return !Object.values(errores).some((error) => error !== "");
}





export function validarFormularioVariantes(talle,color,stock) {  


  let errores = {
    talla: "",
    color: "",
    stock: "",
  };

 
    const tallaValidada=/^[A-Za-zÁÉÍÓÚáéíóúñÑ\d\s\/\.\-½¾¼]+$/;

   
    const colorValidado = /^(?!\s*$)[a-zA-Z\s]+$/;
    const stockValidado = /^[0-9]+$/;



  function mostrarError(id, mensaje) {
    document.getElementById(id).textContent = mensaje;
  }

  // Limpiar mensajes de error anteriores
  mostrarError("error-talla", "");
  mostrarError("error-color", "");
  mostrarError("error-stock", "");

  // Validaciones
  if (!talle) {
    errores.talla = "La talla es obligatoria";
  } else if (!tallaValidada.test(talle)) {
    errores.talla = "Talla inválida";
  }
  if (!color) {
    errores.color = "El color es obligatorio";
  } else if (!colorValidado.test(color)) {
    errores.color = "Color inválido";
  }
  if (!stock) {
    errores.stock = "El stock es obligatorio";
  } else if (!stockValidado.test(stock)) {
    errores.stock = "Stock inválido";
  }

  // Mostrar errores en el modal
  mostrarError("error-talla", errores.talla);
  mostrarError("error-color", errores.color);
  mostrarError("error-stock", errores.stock);

  return !Object.values(errores).some(error => error);
}





  