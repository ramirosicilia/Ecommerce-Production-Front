import { enviarCompra } from "./comprar.js"; 




 
 let productosEncarrito = JSON.parse(localStorage.getItem("productos")) || [];


let summary=document.getElementById("summary") 

   


    function mostrarProductosCarrito() {  
  let stockGuardados = JSON.parse(localStorage.getItem('stocks')) || [];
  console.log(stockGuardados, "el stock");

  let cantidad = 0;
  let carritoItem = document?.getElementById("carrito-items");

  if (carritoItem) {
    carritoItem.innerHTML = "";
    summary.innerHTML = "";

    if (productosEncarrito.length > 0) {
      productosEncarrito.forEach(producto => {
        const productoID = producto.producto_id?.toString().trim();
        const color = producto.color?.toString().trim().toLowerCase();
        const talle = producto.talle?.toString().trim().toLowerCase();

        const stockVariante = stockGuardados.find(s =>
          s?.producto_id?.toString().trim() === productoID &&
          s?.color?.toString().trim().toLowerCase() === color &&
          s?.talle?.toString().trim().toLowerCase() === talle
        )?.stock ?? 0;

        carritoItem.innerHTML += ` 
          <div class="item">
            <img src="${producto.imagen}" alt="">
            <div class="info">
              <p class="name">${producto.nombre_producto}</p>
              <div class="actions">
                <span class="delete">Eliminar</span>
                <span class="buy-now">Agregar</span>
              </div>
              <div class="quantity">
                <button class="boton_eliminar" 
                    data-id="${productoID}" 
                    data-color="${color}" 
                    data-talle="${talle}">-</button>
                
                <span class="cantidad" 
                    data-id="${productoID}" 
                    data-color="${color}" 
                    data-talle="${talle}">
                    ${producto.cantidad}
                </span>

                <button class="boton_agregar" 
                    data-id="${productoID}" 
                    data-color="${color}" 
                    data-talle="${talle}" 
                    data-stock="${stockVariante}">+</button>
              </div>
              <div class="detalles">
                <p class="talle">Talle: ${producto.talle}</p>
                <p class="color">Color: ${producto.color}</p>
                <p class="stock cantidad-texto" 
                    data-id="${productoID}" 
                    data-color="${color}" 
                    data-talle="${talle}">
                    Cantidad: ${producto.cantidad}
                </p>
              </div>
              <span class="stock">máximo permitido: ${stockVariante} unidades</span>
              <span class="price">Precio: $${(producto.precio_producto ?? 0).toFixed(2)}</span>
            </div>
          </div>`; 
      });

      checkout();

      let botonesAgregar = [...document.querySelectorAll(".boton_agregar")]; 
      let botonesEliminar = [...document.querySelectorAll(".boton_eliminar")];

      console.log(botonesAgregar, botonesEliminar); 

      activarBotonAgregar(botonesAgregar);
      activarBotonEliminar(botonesEliminar);   
    } else {
      summary.innerHTML = ` 
        <h3>Resumen de compra</h3>
        <p>Productos (${cantidad})<span>$${cantidad}</span></p>
        <p class="shipping">Calcular costo de envío</p>
        <hr>
        <p>Total <span class="total-price"></span></p>
        <button class="checkout" id="comprar">Continuar compra</button>
        <p class="shipping-info">El envío gratis está sujeto al peso, precio y distancia.</p>
        <button type="button" class="boton_vaciar btn" id="boton-vaciado">Vaciar Carrito</button>`;
    }
  }
}






(async()=>{ 
     await mostrarProductosCarrito();
   

})() 




function activarBotonAgregar(botones) { 
    botones.forEach(boton => {
        boton.addEventListener('click', agregarProductoAlCarrito);
    });
}  

function checkout() {
  if (!Array.isArray(productosEncarrito)) return;

  let cantidadTotal = productosEncarrito.length;

  let total = productosEncarrito.reduce((acc, prod) => {
    if (
      prod &&
      typeof prod.cantidad === 'number' &&
      typeof prod.precio_producto === 'number'
    ) {
      return acc + (prod.cantidad * prod.precio_producto);
    }
    return acc;
  }, 0);

  let tieneRepetidos = productosEncarrito.some(prod => prod?.cantidad > 1);

  if (typeof summary !== 'undefined' && summary) {
    const button = document.createElement("button");
    button.id = "boton-vaciado";

    summary.innerHTML = ` 
      <h3>Resumen de compra</h3>
      <p>Productos totales (${cantidadTotal}) ${tieneRepetidos ? "" : ""} <span>$${(total ?? 0).toFixed(2)}</span></p>
      <p class="shipping">Calcular costo de envío</p>
      <hr> 
      <p>Total <span class="total-price">$${(total ?? 0).toFixed(2)}</span></p>
      <button class="checkout" id="comprar">Continuar compra</button>
      <p class="shipping-info">El envío gratis está sujeto al peso, precio y distancia.</p>
      <button type="button" class="boton_vaciar btn" 
      id="boton-vaciado">Vaciar Carrito</button>
    `;

    let botonVaciar = document.querySelector("#boton-vaciado");
    if (botonVaciar && typeof vaciarCarrito === 'function') {
      vaciarCarrito(botonVaciar);
    }
  } else {
    console.warn("Elemento 'summary' no encontrado o no definido.");
  }
}


 function vaciarCarrito(botonVaciar){
  
console.log(botonVaciar)


botonVaciar.addEventListener('click',() => { 
    
        
    if (productosEncarrito.length === 0) return;
     
    const confirmar = confirm('¿Estás seguro de que deseas vaciar el carrito?');


    if (confirmar) {
        localStorage.removeItem('productos'); // Borra solo 'productos' del localStorage
   
        productosEncarrito = []; // Vacía el array correctamente 
       
        Swal.fire({
            title: `Fue Vaciado con exicto el carrito`,
            showClass: {
              popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
              `
            },
            hideClass: {
              popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
              `
            }
          }); 

    } 

    setTimeout(() => { 
        window.location.reload()
        
    }, 1500);
})

 }



function iconoProductosSumados() {
  let iconCart = document.getElementById("cart-count");

  if (!iconCart) return;

  let totalCantidad = productosEncarrito?.reduce((acc, produc) => {
    if (produc && typeof produc.cantidad === 'number') {
      return acc + produc.cantidad;
    }
    return acc; // si no es válido, lo ignora
  }, 0);

  iconCart.innerHTML = isNaN(totalCantidad) ? 0 : totalCantidad;
}


function agregarProductoAlCarrito(e) { 
    const idBoton = e.target.dataset.id; 
    const color= e.target.dataset.color; 
    const talle= e.target.dataset.talle; 
     const stock= Number(e.target.dataset.stock); 
    console.log(idBoton)
      let primerProducto = productosEncarrito.find(producto =>
          producto.producto_id.toString().trim() === idBoton.toString().trim() &&
          producto.color.toString().trim() === color.toString().trim() &&
          producto.talle.toString().trim() === talle.toString().trim()
      );
     console.log(primerProducto,"agregar")
      
    if (primerProducto && primerProducto.cantidad < stock) {
        primerProducto.cantidad++; // Aumentamos la cantidad
        checkout()
        localStorage.setItem("productos", JSON.stringify(productosEncarrito)); // Guardamos el cambio
        localStorage.setItem("carritoActivo", "true");
        
        // Seleccionamos los elementos correctos dentro del producto modificado
        let cantidadActualizada = document.querySelector(
            `.cantidad[data-id="${idBoton}"][data-color="${color}"][data-talle="${talle}"]`
        );
       let cantidadTextoActualizada = document.querySelector(
            `.cantidad-texto[data-id="${idBoton}"][data-color="${color}"][data-talle="${talle}"]`
        );
        if (cantidadActualizada) cantidadActualizada.innerHTML = primerProducto.cantidad;
        if (cantidadTextoActualizada) cantidadTextoActualizada.innerHTML = `Cantidad: ${primerProducto.cantidad}`; 

        iconoProductosSumados()
    } 

    else{
      alert('no hay stock disponible')
    }
}
  iconoProductosSumados() 


  function activarBotonEliminar(boton){ 

    boton.forEach(boton=>{
      boton.addEventListener("click",()=>{
        let botonEliminadoID=boton.dataset.id 
         let colorEliminadoID=boton.dataset.color
          let talleEliminadoID=boton.dataset.talle 

        eliminarDelCarrito(botonEliminadoID,colorEliminadoID,talleEliminadoID)
      })
    })

  } 

 function eliminarDelCarrito(botonID, colorID, talleID) {
  // Buscar el producto en el carrito
  let primerProducto = productosEncarrito.find(producto =>
    producto?.producto_id.toString().trim() === botonID.toString().trim() &&
    producto?.color.toString().trim() === colorID.toString().trim() &&
    producto?.talle.toString().trim() === talleID.toString().trim()
  );

  if (primerProducto && typeof primerProducto.cantidad === 'number' && primerProducto.cantidad > 0) {
    primerProducto.cantidad--;

    if (typeof checkout === 'function') checkout();

    // Guardar carrito actualizado
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem("productos", JSON.stringify(productosEncarrito));
    
      } catch (e) {
        console.error("Error al guardar en localStorage", e);
      }
    }

    // Actualizar cantidad en DOM
    const cantidadActualizada = document.querySelector(`.cantidad[data-id="${botonID}"][data-color="${colorID}"][data-talle="${talleID}"]`);
    const cantidadTextoActualizada = document.querySelector(`.cantidad-texto[data-id="${botonID}"][data-color="${colorID}"][data-talle="${talleID}"]`);

    if (cantidadActualizada) cantidadActualizada.innerHTML = primerProducto.cantidad;
    if (cantidadTextoActualizada) cantidadTextoActualizada.innerHTML = `Cantidad: ${primerProducto.cantidad}`;

    console.log(primerProducto);

    // Si la cantidad es 0, eliminar el producto del carrito
    if (primerProducto.cantidad === 0) { 
 
      productosEncarrito = productosEncarrito.filter(producto =>
        !(producto?.producto_id.toString().trim() === botonID.toString().trim() &&
          producto?.color.toString().trim() === colorID.toString().trim() &&
          producto?.talle.toString().trim() === talleID.toString().trim())
      );

      // Buscar variante en productos para stock y alerta 
      
   let productoSeleccionado = productosEncarrito.find(p => p.producto_id === botonID);
    let varianteAgotada = productoSeleccionado?.productos_variantes?.find(v =>
        v?.colores?.color_id === colorID &&
        v?.talles?.talle_id === talleID
      );

      if (varianteAgotada?.stock === 0) {
        alert("Este talle con este color está agotado y se eliminó del carrito.");
      }

      // Guardar carrito actualizado después de eliminar producto
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem("productos", JSON.stringify(productosEncarrito));
         
        } catch (e) {
          console.error("Error al guardar en localStorage", e);
        }
      }

      // Actualizar carrito en pantalla
      if (typeof mostrarProductosCarrito === 'function') mostrarProductosCarrito();
    }

    // Actualizar icono del carrito si existe función
    if (typeof iconoProductosSumados === 'function') iconoProductosSumados();
  }
}


 const botonComprar=document.getElementById("comprar") 

 
 botonComprar.addEventListener("click",async(e)=>{ 
  e.target.style.opacity="0" 

  setTimeout(() => { 
      enviarCompra(e.target)
    
  }, 500);
  


 })




