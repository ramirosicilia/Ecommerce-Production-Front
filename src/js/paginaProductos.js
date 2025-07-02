import { adminApi } from "./api/administradorApi.js";
import { obtenerCategorys, obtenerProductos, obtenerUsuarios } from "./api/productos.js";

document.addEventListener("DOMContentLoaded", () => {
  const userIngresado = document.querySelector(".user__ingresado");
  if (userIngresado) userIngresado.style.visibility = "hidden";
});


let categoriasFiltrada = [];
let filtradoCategoryYProduct=[] 
let productos
let categorias 
let usuario
let administrador

 
const cierreSeccion=document.getElementById("cerrar-seccion") 

cierreSeccion?.addEventListener("click",()=>{ 
  const verificado=JSON.parse(localStorage.getItem("verificado")) 

  if(verificado==="desactivado"){ 
      window.location.href="./index.html" 
      return

  }

  const confirmacion=confirm("¿esta usted seguro que desea cerrar seccion?") 

  if(!confirmacion){
    return

  }

  localStorage.removeItem("usuario") 

  window.location.href="./index.html"
})

async function data(){ 
    const [producto,categoria]= await Promise.all([obtenerProductos(),obtenerCategorys()]) 
     productos=producto
     categorias=categoria


}
const selector = document.getElementById("categorySelector");
const listaProductos = document.getElementById("productos_lista");


  const usuarioActual=JSON.parse(localStorage.getItem('usuario'))||[]
      console.log(usuarioActual)  


      let ingreso=""
      
   async function usuarioIngresado() { 

    const [usuarios,administradores]= await Promise.all([obtenerUsuarios(),adminApi()]) 

     usuario=usuarios
     administrador=administradores
    
    
    console.log(usuario,"el usuarioo") 

    console.log(administrador)



    if(usuario.user || administrador){ 
        console.log(usuario.user,'USER')
       reendedizarUsuario(usuario?.user,administrador)
     
    }

   
   }   

  

 function reendedizarUsuario(listaUsuarios, admin) {  
  console.log(listaUsuarios);
  console.log(admin);

  const usuarioActual = JSON.parse(localStorage.getItem('usuario'));

  const userIngresado = document?.querySelector('.user__ingresado');

  // Si no hay contenedor, salimos
  if (!userIngresado) return;

    userIngresado.style.visibility = "hidden"; 
      userIngresado.innerHTML=""
  // Si no hay usuario en localStorage o está vacío
  if (!usuarioActual || usuarioActual?.length === 0) {
    userIngresado.innerHTML = `
      Ingreso: 
      <span style="
        margin-left: 10px;
        padding: 2px 6px;
       
        border-radius: 5px;
        font-weight: bold;
        font-size: 16px;
        display: inline-block;">
        
      </span>
    `;
     localStorage.setItem("verificado",JSON.stringify("desactivado")) 
      userIngresado.style.visibility = "visible"; // mostrar aunque esté vacío
     return
  }

  // Hay al menos un usuario en el array
     if(usuarioActual.length>0){ 
       const ultimoUsuario = usuarioActual[usuarioActual?.length - 1]; 
        const obtenerUser= listaUsuarios?.find(usuario => usuario.usuario === ultimoUsuario); 
 
        

       if (obtenerUser) {
    ingreso = obtenerUser.usuario;
    userIngresado.innerHTML = `
      Ingreso:
      <span style="
        margin-left: 10px;
        padding: 2px 6px;
        background-color: #e0f7fa;
        color: #00796b;
        border-radius: 5px;
        font-weight: bold;
        font-size: 16px;
        display: inline-block;">
        ${obtenerUser.usuario}
      </span>
    `; 
        userIngresado.style.visibility = "visible";
    return;
  }

  if (admin) {
    ingreso = admin
    userIngresado.innerHTML = `
      Ingreso:
      <span style="
        margin-left: 10px;
        padding: 2px 6px;
        background-color: #ffe0b2;
        color: #ef6c00;
        border-radius: 5px;
        font-weight: bold;
        font-size: 16px;
        display: inline-block;">
        ${admin}
      </span>
    `;
     userIngresado.style.visibility = "visible";
    return;
  }

  // Si no se encuentra ni en usuarios ni en administradores
  userIngresado.innerHTML = `
    Ingreso:
    <span style="
        margin-left: 10px;
        padding: 2px 6px;
        background-color: #ffe0b2;
        color: #ef6c00;
        border-radius: 5px;
        font-weight: bold;
        font-size: 16px;
        display: inline-block;">
         Ingresa tu usuario
      </span>
  `; 
   userIngresado.style.visibility = "visible";
  } 
  return
}





 (async () => { 

  await data() ,


   await  usuarioIngresado() 
      selectorCategorys()
   await mostrarProductosVenta(productos) 

   
  
  
})();



async function selectorCategorys() { 


  categoriasFiltrada = categorias.filter(category => category.activo === true);

  if(selector){
    // Asegurar que el selector tenga una opción "Todas"
  selector.innerHTML = `<option value="todas">Todas</option>`;
  console.log(categoriasFiltrada);

  if (categoriasFiltrada.length > 0) {
    categoriasFiltrada.forEach(categoria => {
      selector.innerHTML += `
        <option value="${categoria.nombre_categoria}">${categoria.nombre_categoria}</option>
      `;
    });
  } else {
    console.warn("No hay categorías activas disponibles.");
  }
}

 if(selector){
  selector.addEventListener("change", async (e) => {
    const categoriaSeleccionada = e.target.value;
    listaProductos.innerHTML = ""; // Limpiar lista
  

    let productosActivos = productos.filter(p => p.activacion === true);
  
    let productosMostrados = categoriaSeleccionada !== "todas"
      ? productosActivos.filter(producto =>
          categoriasFiltrada.some(cat =>
            cat.nombre_categoria === categoriaSeleccionada &&
            cat.categoria_id === producto.categoria_id
          )
        )
      : productosActivos;
  
    if (productosMostrados.length > 0) {
      listaProductos.innerHTML = productosMostrados.map(producto => {
      const imagen = Array.isArray(producto.imagenes?.[0]?.urls)
    ? producto.imagenes[0].urls[0]
    : producto.imagenes?.[0]?.urls || "img/default.png";
  
      
  
        return `
          <section class="col-md-3 product-card lista" data-productos="${producto.producto_id}">
            <div class="card">
              <img src="${imagen}"data-imagen-producto="${producto.producto_id}" class="card-img-top imagen-selector" alt="">
              <div class="card-body">
                <h5 class="card-title">${producto.nombre_producto ?? ""}</h5>
                <p class="card-text">$${(producto?.precio ?? 0).toFixed(2)}</p>
                <button class="btn btn-agregar btn-primary add-to-cart" data-img="${imagen}" data-productos="${producto.producto_id}">
                  Agregar al carrito
                </button>
              </div>
            </div>
          </section>
        `;
        
      }).join("");
          let imagenDom=document.querySelectorAll(".imagen-selector") 
       
          
           recuperarImagenes( imagenDom,productosMostrados) 

      productosMostrados.forEach(producto => { 
         let section = document.querySelector(`[data-productos="${producto.producto_id}"]`);
        let stock= producto.productos_variantes.map(variante=>variante?.stock)
    
        stockAgotado(section, producto.producto_id,filtradoCategoryYProduct);
      });  

      let botonesSelect=[...document.querySelectorAll(".btn-agregar")] 
       
      if(ingreso===administrador){  

     localStorage.setItem("admin", JSON.stringify(true)); // Guardamos true si es admin
 
        botonesSelect.forEach(boton=>{
          boton.style.display="none"
        })


      } 

      else{
     
           localStorage.removeItem("admin"); // O guarda false o quita la clave

      }

  
      agregarBotonesAlCarrito(botonesSelect);
     
    } else {
      listaProductos.innerHTML = `<p>No hay productos en esta categoría.</p>`;
    }
  });
  

 }


  }

  

  
  async function mostrarProductosVenta(productos) { 
    console.log(productos)

    const listaProductos = document.getElementById("productos_lista"); 

  
    if(listaProductos){
      listaProductos.innerHTML = ""; 
      
    const productosFiltrados = productos.filter(p => p.activacion === true); 
    console.log(productosFiltrados) 

      
    filtradoCategoryYProduct = productosFiltrados.filter(producto => 
     categoriasFiltrada.some(cat => cat.categoria_id === producto.categoria_id)
   );

   if (filtradoCategoryYProduct.length > 0) {
     filtradoCategoryYProduct.forEach(producto => {
       const imagen = producto.imagenes?.[0]?.urls?.[0] || "img/default.png";
       console.log(imagen)
      
       let stock=producto.productos_variantes.map(variante=>variante?.stock)

    
        console.log(stock)

          
      
       listaProductos.insertAdjacentHTML("beforeend", `
         <section class="col-md-3 product-card lista" data-productos="${producto.producto_id}">
           <div class="card">
             <img src="${imagen}"data-imagen-producto="${producto.producto_id}" " class="card-img-top imagen" alt="">
             <div class="card-body">
               <h5 class="card-title">${producto.nombre_producto}</h5>
               <p class="card-text">$${(producto?.precio ?? 0).toFixed(2)}</p>
               <button class="btn btn-agregar btn-primary add-to-cart" data-productos="${producto.producto_id}">
                 Agregar al carrito
               </button>
             </div>
           </div>
         </section>
       `);
       let imagenDom=document.querySelectorAll(".imagen")
       let section = document.querySelector(`[data-productos="${producto.producto_id}"]`);
     
 
    console.log('este es el admin',administrador)

     
       stockAgotado(section, producto.producto_id,filtradoCategoryYProduct);
       recuperarImagenes( imagenDom,filtradoCategoryYProduct) 
       

     }); 

      
       let botonesAgregar=[...document.querySelectorAll(".btn-agregar")] 

         console.log(botonesAgregar,'btn btn') 
       
         console.log('este es el ingreso',ingreso)
           
      if(ingreso===administrador){  

     localStorage.setItem("admin", JSON.stringify(true)); // Guardamos true si es admin
 
        botonesAgregar.forEach(boton=>{
          boton.style.display="none"
        })


      } 

      else{
     
           localStorage.removeItem("admin"); // O guarda false o quita la clave

      }

 
     agregarBotonesAlCarrito(botonesAgregar); 

   } 
     else {
     listaProductos.innerHTML = `<p>No hay productos disponibles para mostrar.</p>`;
   }
        

    }
  
   
    }
 
    


    function stockAgotado(lista, idAgotado, products) {
  const primerProducto = products.find(producto => producto.producto_id === idAgotado);

  if (!primerProducto || !Array.isArray(primerProducto.productos_variantes)) return;

  const agotadoTotal = primerProducto.productos_variantes.every(
    variante => Number(variante.stock) === 0
  );

  if (agotadoTotal) {
    const producto = document.querySelector(`[data-productos="${idAgotado}"]`);
    if (producto) {
      const botonAgregar = producto.querySelector(".btn-agregar");
      if (botonAgregar) botonAgregar.remove();

      lista.classList.add("agotado");

      console.log('🔥 Producto totalmente agotado:', producto);
    }

    let productosAgotados = JSON.parse(localStorage.getItem("productosAgotados")) || [];
    if (!productosAgotados.includes(idAgotado)) {
      productosAgotados.push(idAgotado);
      localStorage.setItem("productosAgotados", JSON.stringify(productosAgotados));
    }
  }
}



   function recuperarImagenes(imagen,productos) {  

    imagen.forEach((img) => {
      img.addEventListener('click', async (e) => { 
   
        let imagenId = e.currentTarget.getAttribute('data-imagen-producto') 

        let primerProducto=productos.find(product=>product.producto_id===imagenId) 

        let todasLasVariantes=primerProducto.productos_variantes.every(variante=>variante.stock===0)
     
       
        localStorage.setItem('id-imagen', JSON.stringify(imagenId)) 

        
        if(todasLasVariantes!=false){ 
          return

        }
       
        console.log(imagenId)  
      
  
        setTimeout(() => {
         
          window.location.href ="./descripcionProducto.html";
        }, 800);
       
      })
    })

  
   } 

   

  
// Llamar a la función al cargar la página

  /*restaurarCarrito();*/




 function agregarBotonesAlCarrito(botones){ 


  botones.forEach((btn)=>{ 


    btn.addEventListener('click',async()=>{ 
   
      let producto_ID=btn.getAttribute('data-productos') 
     

      opcionesProducto(producto_ID)
      

    })
  })

 } 

 let modal=document.querySelector('.modal')

   




 
 async function opcionesProducto(producto_ID) { 
  
  let carritoCompras=JSON.parse(localStorage.getItem('productos'))||[]

    let sizesTexto=""
    let colorTexto=""

    const usuario11= await obtenerUsuarios()

    console.log(usuario11.user,'recibimos usuario')
    console.log(productos); // Debería ser un array
    console.log( producto_ID); 
    let obtenerUSer 
   
     if(usuarioActual.length>0){ 
        obtenerUSer = usuario.user?.find(user=>user.usuario===usuarioActual[usuarioActual.length-1].toString())

      console.log(obtenerUSer,"USER")


     }


    console.log(filtradoCategoryYProduct) 

    let imagenSeleccionada;
    


    for (const producto of filtradoCategoryYProduct) { 
      imagenSeleccionada = producto.imagenes.find(imagen => imagen.producto_id === producto_ID);
      if (imagenSeleccionada) {
        break;  // Solo cuando ENCUENTRES la imagen cortas el bucle
      }
    } 

   // Buscar color en las variantes de productos

   
   const nombre=filtradoCategoryYProduct?.find(producto=>producto.producto_id===producto_ID)?.nombre_producto 
   const detalles=filtradoCategoryYProduct?.find(producto=>producto.producto_id===producto_ID)?.detalles
   const precio=filtradoCategoryYProduct?.find(producto=>producto.producto_id===producto_ID)?.precio 

  
   const imagenOpciones=imagenSeleccionada?.urls[0] 

    const varianteSeleccionada=filtradoCategoryYProduct?.find(variante=>variante.producto_id===producto_ID) 

     const talles = Array.isArray(varianteSeleccionada?.productos_variantes)
    ? varianteSeleccionada.productos_variantes
        .filter(talleObj => talleObj?.talles?.insertar_talle) // filtro valores nulos o indefinidos
        .map(talleObj => `
          <button class="sizes-box" style="padding: 10px 14px; border: 1px solid #ccc; background: white; border-radius: 6px; cursor: pointer; min-width: 50px; text-align: center;">
            ${talleObj.talles.insertar_talle}
          </button>
        `)
        .join("")
    : "";
        
  console.log(talles);
        
  const colores = Array.isArray(varianteSeleccionada?.productos_variantes)
    ? varianteSeleccionada.productos_variantes
        .filter(colorObj => colorObj?.colores?.insertar_color) // filtro valores nulos o indefinidos
        .map(colorObj => `
          <button class="colors-box" style="padding: 10px 14px; border: 1px solid #ccc; background: white; border-radius: 6px; cursor: pointer; min-width: 50px; text-align: center;">
            ${colorObj.colores.insertar_color}
          </button>
        `)
        .join("")
    : "";
        
  console.log(colores); 

  
        
        
   document.querySelector("#modal")?.remove()
        
        
   const div=document.createElement("div")
        
  div.innerHTML = `
  <div id="modal" style="
    position: fixed; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 90%; max-width: 500px;
    background: #fff;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    font-family: 'Segoe UI', sans-serif;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  ">
    <div class="modal-header" style="
      display: flex; justify-content: space-between; align-items: center;
      font-weight: 600; font-size: 18px; color: #333;
      border-bottom: 1px solid #eee; padding-bottom: 12px;
    ">
  <span style="color: #000; font-weight: bold; font-size: 15px; opacity: 1; background-color: #fff; padding: 10px; border-radius: 5px; display: inline-block;">
    Selecciona tus opciones para agregar el producto al carro
  </span>

      <span class="close" id="close" style="
        cursor: pointer; font-size: 24px; color: #000;opacity:1;
        transition: color 0.3s;
      " onmouseover="this.style.color='#e74c3c'" onmouseout="this.style.color='#000'">&times;</span>
    </div>

    <div class="product-info" style="
      display: flex; gap: 16px; align-items: center;
    ">
      <img src="${imagenOpciones}" alt="Producto" style="
        width: 100px; height: auto; border-radius: 8px; border: 1px solid #ddd;
      ">
      <div class="details" style="
        display: flex; flex-direction: column; gap: 6px; font-size: 14px; color: #444;
      ">
        <div><strong>Nombre:</strong> ${nombre}</div>
        <div><strong>Detalles:</strong> ${detalles}</div>
        <div class="price" style="
          font-size: 18px; font-weight: bold; color: #2c3e50;
        ">Precio: $${precio}</div>
      </div>
    </div>

    <div class="section" style="display: flex; flex-direction: column; gap: 8px;">
      <label for="talla" style="font-weight: 600;">Talla:</label>
      <div class="sizes" style="
        display: flex; flex-wrap: wrap; gap: 10px;
      ">
        ${talles}
      </div>
    </div>

    <div class="section" style="display: flex; flex-direction: column; gap: 8px;">
      <label for="color" style="font-weight: 600;">Color:</label>
      <div class="colors" style="
        display: flex; flex-wrap: wrap; gap: 10px;
      ">
        ${colores}
      </div>
    </div>

    <div class="footer" style="
      display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;
    ">
      <button class="close-btn btn-cerrar" style="
        padding: 10px 18px;
        border: none;
        border-radius: 8px;
        background: #f2f2f2;
        color: #333;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.3s;
      " onmouseover="this.style.background='#ddd'" onmouseout="this.style.background='#f2f2f2'">
        Cerrar
      </button>
      <button type="button" class="select-btn btn__opciones" style="
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        background:rgb(5, 41, 65);
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s;
      " onmouseover="this.style.background=' #0046be'" onmouseout="this.style.background=' #0046be'">
        Elige tus opciones
      </button>
    </div>
  </div>
`;


  
    console.log(div)
   document.body.append(div) 

   document.getElementById("close").addEventListener("click", () => {
    document.getElementById("modal").remove();
  });

  document.querySelector(".btn-cerrar").addEventListener("click", () => {
    document.getElementById("modal").remove();
  }); 


    const sizes=document.querySelectorAll('.sizes-box') 
    const colors=document.querySelectorAll('.colors-box') 
    const btnOpciones=document.querySelector(".btn__opciones") 
    btnOpciones.disabled=true


  sizes.forEach(size=>{
   
    size.addEventListener('click',(e)=>{  


      sizes.forEach(s => s.classList.remove("seleccion_opciones_talles"));

      size.classList.add("seleccion_opciones_talles") 

      if(size.classList.contains("seleccion_opciones_talles")){ 
        
      btnOpciones.textContent="Agregar al carro"
      btnOpciones.disabled=false
      sizesTexto=size.textContent  

       
      }
    
    })  

    
  }) 
 
 
   colors.forEach(color=>{
   
    color.addEventListener('click',(e)=>{   


      colors.forEach(c => c.classList.remove("seleccion_opciones_colores"));

      color.classList.add("seleccion_opciones_colores") 

      if(color.classList.contains("seleccion_opciones_colores")){ 
        
      btnOpciones.textContent="Agregar al Carrito"
      btnOpciones.disabled=false
      colorTexto=color.textContent 
    
      console.log(colorTexto)

      }
   
       
    }) 
    
  })  

  console.log(btnOpciones)



  btnOpciones.addEventListener("click", async () => {

  if (!sizes.length || !colors.length) {
    return;
  } 

   const verificacion=JSON.parse(localStorage.getItem("verificado"))
   if(verificacion==="desactivado"){ 

    alert("por favor debes loguearte para poder agregar productos") 
    window.location.href="./login.html" 
    return

   }

    
  let objectoStorage = {
    user: obtenerUSer.usuario,
    user_id: obtenerUSer.usuario_id,
    producto_id: producto_ID,
    nombre_producto: nombre,
    precio_producto: precio,
    cantidad: 1,
    detalles: detalles,
    imagen: imagenOpciones,
    color: colorTexto || "",
    talle: sizesTexto || "",
  };

  console.log(objectoStorage);
  console.log(varianteSeleccionada, "la varianteeeee");

  /* BUSCAMOS QUE LAS VARIANTES COINCIDAN CON LOS TALLES Y COLORES SELECCIONADOS GRACIAS A LAS VARIANTES */
  const combinacionExiste = varianteSeleccionada.productos_variantes.some(variacion => {
    const talle = variacion?.talles?.insertar_talle;
    const color = variacion?.colores?.insertar_color;

    // Validamos que ambos existan antes de comparar
    if (!talle || !color) return false;

    const resultadoComparacion =
      talle.toString().trim().toLowerCase() === sizesTexto.toString().trim().toLowerCase() &&
      color.toString().trim().toLowerCase() === colorTexto.toString().trim().toLowerCase();

    console.log('Comparando normalizados:');
    console.log('Talle:', talle, 'vs', sizesTexto);
    console.log('Color:', color, 'vs', colorTexto);
    console.log('¿Coincide esta variante?', resultadoComparacion);
    console.log('------------------------------');

    return resultadoComparacion;
  });

  console.log('¿Existe la combinación talle+color?', combinacionExiste);

  if (!combinacionExiste) {
    alert("Esta combinación de talle y color no está disponible, combinaciones unicas de talle abajo el color.");
    return; // No continúa
  }

  let primerProductoCarrito = carritoCompras.find(producto =>
    producto.producto_id === producto_ID &&
    (producto.color || "").trim().toLowerCase() === colorTexto.toLowerCase() &&
    (producto.talle || "").trim().toLowerCase() === sizesTexto.toLowerCase()
  );

  // --- PRIMERO calculamos el stock real ---
  let stock = null;
  
  const productoSeleccionado = productos.find(producto => producto.producto_id === producto_ID);
  if (!productoSeleccionado) {
    alert("Producto no encontrado.");
    return;
  }

  for (const element of productoSeleccionado?.productos_variantes) {
    const talle = element?.talles?.insertar_talle;
    const color = element?.colores?.insertar_color;
    const stockDisponible = element?.stock;

    // Aseguramos que talle, color y stock no sean nulos
    if (
      talle && color && stockDisponible !== null &&
      talle.toString().trim().toLowerCase() === sizesTexto.toString().trim().toLowerCase() &&
      color.toString().trim().toLowerCase() === colorTexto.toString().trim().toLowerCase()
    ) {
      stock = stockDisponible;
      console.log(stock, 'STOCKER');
      break;
    }
  }

  if (stock === null) {
    alert("No se pudo determinar el stock.");
    return;
  }

  if (stock === 0) {
    alert("Este talle con este color está agotado.");
    return;
  }

  if(stock>0){ 

    let productosAgotados=JSON.parse(localStorage.getItem("productosAgotados"))||[]

    let index=productosAgotados.findIndex(id=>id===producto_ID) 

    if(index > -1){ 
      productosAgotados.splice(index,1) 

      localStorage.setItem("productosAgotados",JSON.stringify(productosAgotados))

    }

  }

  // --- Finalmente agregamos o actualizamos el carrito ---
  if (!primerProductoCarrito) {
    carritoCompras.push({ ...objectoStorage });
  } else {
    if (primerProductoCarrito.cantidad < stock) {
      primerProductoCarrito.cantidad += 1;
    } else {
      alert("Ya has agregado el máximo disponible de este producto.");
    }
  }

  localStorage.setItem("productos", JSON.stringify(carritoCompras)); 


  // ✅ Guardar correctamente el stock después de haberlo encontrado
  let stockStorage = JSON.parse(localStorage.getItem('stocks')) || [];

  const stockItem = {
    producto_id: producto_ID.toString().trim(),
    talle: sizesTexto.toString().trim().toLowerCase(),
    color: colorTexto.toString().trim().toLowerCase(),
    stock: stock
  };

  const indexExistente = stockStorage.findIndex(s =>
    s.producto_id === stockItem.producto_id &&
    s.talle === stockItem.talle &&
    s.color === stockItem.color
  );

  if (indexExistente !== -1) {
    stockStorage[indexExistente] = stockItem;
  } else {
    stockStorage.push(stockItem);
  }

  localStorage.setItem('stocks', JSON.stringify(stockStorage));

  manejarCantidades(producto_ID, sizesTexto, colorTexto);
  actualizarCarrito();

});



  } 
 



  async function manejarCantidades(productoID, sizes, color) {

  
  let stock = null;

  console.log(productos);

  // Validar que productos esté definido y sea array
  if (!Array.isArray(productos)) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se encontraron productos disponibles.',
    });
    return;
  }

  // Buscar producto seleccionado, validar que exista
  const productoSeleccionado = productos.find(
    (producto) => producto?.producto_id?.toString().trim() === productoID.toString().trim()
  );

  if (!productoSeleccionado) {
    Swal.fire({
      icon: 'error',
      title: 'Producto no encontrado',
      text: 'El producto seleccionado no existe.',
    });
    return;
  }

  // Validar que productos_variantes exista y sea array
  if (!Array.isArray(productoSeleccionado.productos_variantes)) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El producto no tiene variantes disponibles.',
    });
    return;
  }

  // Buscar variante que coincida con talle y color
  for (const element of productoSeleccionado.productos_variantes) {
    if (
      element?.talles?.insertar_talle?.toString().trim() === sizes.toString().trim() &&
      element?.colores?.insertar_color?.toString().trim() === color.toString().trim()
    ) {
     
      stock = element?.stock ?? null;
      break;
    }
  }

 

  // Quitar modal anterior si existe
  const modalPrevio = document.getElementById("modal");
  if (modalPrevio) modalPrevio.remove();

  let carritoCompras = JSON.parse(localStorage.getItem('productos')) || [];

  // Buscar producto en carrito que coincida en id, talle y color
  const primerProducto = carritoCompras.find(p =>
    p?.producto_id?.toString().trim() === productoID.toString().trim() &&
    p?.color?.toString().trim() === color.toString().trim() &&
    p?.talle?.toString().trim() === sizes.toString().trim()
  );

  if (!primerProducto) {
    // Crear nuevo producto para carrito
    const nuevoProducto = {
      producto_id: productoID,
      talle: sizes,
      color: color,
      cantidad: 1,
      imagen: productoSeleccionado.imagen ?? '',
      nombre_producto: productoSeleccionado.nombre_producto ?? '',
      detalles: productoSeleccionado.detalles ?? '',
      precio_producto: productoSeleccionado.precio_producto ?? 0,
    };
    carritoCompras.push(nuevoProducto);
    localStorage.setItem('productos', JSON.stringify(carritoCompras));
    localStorage.setItem("carritoActivo", "true");
  } 
  // --- DESPUÉS guardamos el stock en localStorage ---
  let stockStorage = JSON.parse(localStorage.getItem('stocks')) || [];

  const stockItem = {
    producto_id: productoID.toString().trim(),
    talle: sizes.toString().trim().toLowerCase(),
    color: color.toString().trim().toLowerCase(),
    stock: stock
  };

  const indexExistente = stockStorage.findIndex(s =>
    s.producto_id === stockItem.producto_id &&
    s.talle === stockItem.talle &&
    s.color === stockItem.color
  );

  if (indexExistente !== -1) {
    stockStorage[indexExistente] = stockItem;
  } else {
    stockStorage.push(stockItem);
  }

  localStorage.setItem('stocks', JSON.stringify(stockStorage));

  // Quitar modal-2 anterior si existe
  document.querySelector('.modal-2')?.remove();

  // Crear el modal con los datos del producto agregado
  const div = document.createElement("div");
  div.innerHTML = `
  <div style="background: white; border-radius: 12px; width: 640px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);" class="modal-2">
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid #ddd;" class="modal-header">
      <h2 style="font-size: 18px; margin: 0; display: flex; align-items: center;">
        <span style="color: green; font-size: 24px; margin-right: 10px;" class="icon-check">✔</span>Producto agregado a tu Carro
      </h2>
      <button type="button" style="font-size: 24px; cursor: pointer; border: none;background: none;" id="close-x" class="modal_close">x</button>
    </div>
    <div style="display: flex; padding: 16px;" class="modal-content">
      <img style="width: 80px; height: auto; margin-right: 16px;" src="${primerProducto?.imagen ?? ''}" alt="Producto" />
      <div style="flex-grow: 1;" class="product-info">
        <h3 style="font-size: 14px; margin: 0; font-weight: normal;">${primerProducto?.nombre_producto ?? ''}</h3>
        <strong style="display: block; margin: 4px 0;">${primerProducto?.detalles ?? ''}</strong>
        <p style="color: red;">talle: ${sizes}</p>
        <p style="color: red;">color: ${color}</p>
        <p style="color: red;">el máximo permitido: ${stock ?? 0} unidades</p>
        <div style="font-size: 18px; font-weight: bold;" class="product-price">Precio: $${primerProducto?.precio_producto ?? 0}</div>
        <div style="display: flex; align-items: center; margin-top: 8px;" class="quantity-selector">
          <button class="boton-eliminar" id="btn-eliminar" style="width: 28px; height: 28px; font-size: 16px; border: 1px solid #ccc; background: white; cursor: pointer;">-</button>
          <span class="quantity-selector" style="width: 30px; text-align: center;">${primerProducto?.cantidad ?? 1}</span>
          <button class="boton-agregar" id="btn-agregar" style="width: 28px; height: 28px; font-size: 16px; border: 1px solid #ccc; background: white; cursor: pointer;">+</button>
        </div>
      </div>
    </div>
    <div style="padding: 16px; display: flex; justify-content: space-between; border-top: 1px solid #ddd;" class="modal-footer">
      <a style="font-weight: bold; color: #0046be;" class="seguir_comprando" href="#">Seguir comprando</a>
      <a id="carrito" href="./carrito.html" style="background: #3a3f4c; text-decoration:none; color: white; padding: 8px 24px; border: none; border-radius: 20px; font-size: 16px; cursor: pointer;" class="btn-carro">Ir al Carro</a>
    </div>
  </div>`;

 

  if (!document.body.contains(div)) {
    document.body.append(div);
  } 

     window.addEventListener("pageshow", function () {
       actualizarCarrito()
     document.querySelector(".modal-2")?.remove();
    
  });

  // Delegación de eventos dentro del modal
  div.addEventListener('click', (e) => {
    const cantidadSpan = div.querySelector(".quantity-selector span");

    // Cerrar el modal
    if (e.target.matches(".modal_close")) {
      const modal = div.querySelector(".modal-2");
      if (modal) modal.remove();
    }

    // Seguir comprando (recargar página)
    if (e.target.matches(".seguir_comprando")) {
      window.location.reload();
    }

    // Botón agregar cantidad
    if (e.target.matches(".boton-agregar")) {
      e.preventDefault();
      if (primerProducto.cantidad < (stock ?? 0)) { 


        primerProducto.cantidad++;
        if (cantidadSpan) cantidadSpan.textContent = primerProducto.cantidad;
        localStorage.setItem('productos', JSON.stringify(carritoCompras));
        localStorage.setItem("carritoActivo", "true");
      }
        actualizarCarrito(); 

         if (stock > 0) {
            let productosAgotados = JSON.parse(localStorage.getItem("productosAgotados")) || [];
          
            let index = productosAgotados.findIndex(id => id === productoID);
            if (index > -1) {
              productosAgotados.splice(index, 1);
              localStorage.setItem("productosAgotados", JSON.stringify(productosAgotados));
            }
          }
      }

      // Botón eliminar cantidad
      if (e.target.matches(".boton-eliminar")) {
        e.preventDefault();

        if (primerProducto.cantidad > 0 ) {
          primerProducto.cantidad--;
          if (cantidadSpan) cantidadSpan.textContent = primerProducto.cantidad || 0; 
         
 
        } 
            localStorage.setItem("productos", JSON.stringify(carritoCompras));
           if (primerProducto.cantidad === 0) { 
        
        localStorage.removeItem("carritoActivo"); // 🔴 El carrito quedó vacío
          const index = carritoCompras.findIndex(
            (producto) =>
              producto?.producto_id?.toString() === productoID.toString() &&
              producto?.color?.toString().trim() === color.toString().trim() &&
              producto?.talle?.toString().trim() === sizes.toString().trim()
          );
        
          if (index !== -1) {
            carritoCompras.splice(index, 1);
          
            // 🔍 Verificamos si ese talle y color ya no tiene stock
            const productoSeleccionado = productos.find(p => p.producto_id === productoID);
            const variante = productoSeleccionado?.productos_variantes?.find(variacion =>
              variacion?.talles?.insertar_talle?.toString().trim().toLowerCase() === sizes.toString().trim().toLowerCase() &&
              variacion?.colores?.insertar_color?.toString().trim().toLowerCase() === color.toString().trim().toLowerCase()
            );
          
            if (variante?.stock === 0) {
              alert("Este talle con este color está agotado y fue eliminado del carrito.");
            }
          }
        
          const modal = document.querySelector('.modal-2');
          if (modal) modal.remove();
        }


        actualizarCarrito();
      }
    }); 
  
  }

  // Función para actualizar carrito en el icono
  export async function actualizarCarrito() { 
      const iconCart = document.getElementById("cart-count");
   

  
     const carrito = JSON.parse(localStorage.getItem("productos")) || [];
    
  
    if (iconCart) {
      iconCart.innerHTML = carrito.reduce((acc, producto) => acc + (producto.cantidad ?? 0), 0) || 0;
    }
  }

  // Ejecutar al cargar la página normalmente
  actualizarCarrito();

  // Ejecutar cuando el usuario vuelve con el botón "Atrás"
  

  function restaurarCarrito() { 
      let iconCart = document.getElementById("cart-count");

       const carrito = JSON.parse(localStorage.getItem("productos")) || [];


    if (iconCart) {
      iconCart.innerHTML = carrito.reduce((acc, producto) => acc + (producto.cantidad ?? 0), 0);
    }
  }

  // Ejecutar la función al cargar la página
  restaurarCarrito();






































  