import { obtenerCategorys, obtenerProductos, obtenerUsuarios } from "./api/productos.js";
import { actualizarCarrito } from "./paginaProductos.js";



  let categorias=[]
  let productos=[] 
  let usuarios

  const container=document.querySelector(".container")

 async function obtenerDatos(){  
   usuarios= await obtenerUsuarios()
    const [producto,categoria]= await Promise.all([obtenerProductos(),obtenerCategorys()])
    
     categorias=categoria
     productos= producto 

    
}

const imgID= JSON.parse(localStorage.getItem("id-imagen"));


async function reendedizarDetallesProductos() {
  
    await obtenerDatos();
  
    const productosActivos= productos.filter(producto => producto?.activacion === true);
    const categoriasFiltradas= categorias.filter(categoria => categoria?.activo === true);
    const productosActivosFiltrados= productosActivos.filter(producto =>
      categoriasFiltradas.some(categoria => categoria.categoria_id === producto.categoria_id)
    );
  
    let varianteSeleccionada;
    let imagenSeleccionada; // ✅ declarar variable para la imagen
    const productoSeleccionado= productosActivosFiltrados.find(producto => {
      const variante= producto.productos_variantes.find(v =>
        v.producto_id === imgID 
      
      );
  
      if (variante) {
        // ✅ Guardar la imagen relacionada
        imagenSeleccionada = producto.imagenes.find(img =>
          img.producto_id === imgID
        );
        varianteSeleccionada = variante;
        return true;
      }
     return false;
    }
  
  );
  

    if (!productoSeleccionado || !varianteSeleccionada) {
      console.error("Producto o variante no encontrados.");
      return;
    }
  
    // ✅ Usar la imagen seleccionada
    const imagenPrincipal = imagenSeleccionada?.urls?.[0] || './images/default.jpg';
    console.log(imagenPrincipal);
  
    // Miniaturas (excluye la primera imagen, que ya se usa como principal)
   // Miniaturas (excluye la imagen principal)
    const todasLasImagenes = imagenSeleccionada?.urls || [];
    const miniaturas = todasLasImagenes.slice(1).map(url => `
      <img src="${url}" class="url" style="width: 70px; height: 70px; border-radius: 5px; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);"
           onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 8px 20px rgba(0, 0, 0, 0.2)';"   
           onclick="document.querySelector('#imagen-principal').src='${url}'">
    `).join('');

    const nombre = productoSeleccionado?.nombre_producto || "Producto sin nombre";
    const descripcion = productoSeleccionado?.descripcion || "Sin descripción";
    const detalle= productoSeleccionado?.detalles || "Sin detalle";
  
    const precioBase = productoSeleccionado?.precio || 0;
    const precio = ((precioBase ?? 0) / 100).toFixed(2);
    const precioOriginal = ((precioBase ?? 0) * 1.3 / 100).toFixed(2);
    const descuento = Math.round(100 - ((precio ?? 0) / (precioOriginal ?? 1)) * 100);
    
    const talles = productoSeleccionado.productos_variantes.map(v => v.talles);
    const colores = productoSeleccionado.productos_variantes.map(v => v.colores);

// ✅ Filtrar los talles que NO sean undefined
const tallesHTML = talles
  .filter(talle => talle && talle?.insertar_talle) // filtra si talle es null o undefined o si insertar_talle es falsy
  .map(talle => `
    <button class="insertar_talle" style="padding: 10px; border: 1px solid gray; background: white; cursor: pointer; border-radius: 5px; margin: 5px;">
      ${talle?.insertar_talle}
    </button>
  `).join('');

const coloresHTML = colores
  .filter(color => color && color?.insertar_color)
  .map(color => `
    <button class="insertar_color" style="padding: 10px; border: 1px solid gray; background: white; cursor: pointer; border-radius: 5px; margin: 5px;">
      ${color?.insertar_color}
    </button>
  `).join('');

  
    container.innerHTML = `
      <div style="max-width: 1200px; width: 100%; display: flex; justify-content: center; align-items: center; gap: 50px; flex-wrap: wrap;">
        <div style="flex: 1; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 25px;">
          <img src="${imagenPrincipal}" id="imagen-principal" alt="${nombre}"
               style="width: 300px; height: auto; margin-bottom: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); animation: rotate 5s infinite linear; transition: transform 0.3s ease;">
          
          <div style="display: flex; justify-content: center; gap: 2rem;">
            ${miniaturas}
          </div>
        </div>
  
        <div style="flex: 1; max-width: 500px; padding-left: 20px;">
          <h1 style="font-size: 2rem; font-weight: bold; color: #333;">${nombre}</h1>
          <p>${detalle}</p>
          <p>
            <span style="color: red; font-size: 24px; font-weight: bold;">$/ ${precio}</span>
            <span style="text-decoration: line-through; color: gray; margin-left: 10px;">$/ ${precioOriginal}</span>
            <span style="background-color: red; color: white; padding: 2px 5px; border-radius: 3px; font-size: 14px;">-${descuento}%</span>
          </p>
  
          <h3>Talla:</h3>
          <div>${tallesHTML}</div>
  
          <h3>Colores:</h3>
          <div>${coloresHTML}</div>
          
          <div style="overflow-y: auto; height: 200px">
 
  
          <h3>Descripción del producto</h3>
          <p style="line-height: 25px">${descripcion}</p>

          </div>
  
          <h3>Opciones de entrega:</h3>
          <p>✔ Llega mañana | ✔ Retira mañana</p>
  
          <div>
            <button id=boton-descripcion style="padding: 12px 20px; border: none; font-size: 16px; border-radius: 5px; cursor: pointer; margin: 10px 0; background:rgb(255, 0, 179); color: white;">Elije tus opciones</button>
            <button id=boton-agregar-carrito style="padding: 12px 20px; display: none; border: none; font-size: 16px; border-radius: 5px; cursor: pointer; margin: 10px 0; background:rgb(255, 0, 179); color: white;">agregar al carrito</button>

          </div>
        </div>
      </div>
    `; 

      const coloresDescripcion=document.querySelectorAll(".insertar_color")
       const tallesDescripcion=document.querySelectorAll(".insertar_talle") 
       const botonDescripcion=document.getElementById("boton-descripcion") 
       const botoAgregarCarrito=document.getElementById("boton-agregar-carrito")
       console.log(coloresDescripcion,tallesDescripcion)  


       setTimeout(() => {
        const miniaturas = document.querySelectorAll('.url');
        const imagenPrincipal = document.querySelector('#imagen-principal');
      
        // Guardamos el src original de la imagen principal (para que siempre exista)
        let srcPrincipalActual = imagenPrincipal.src;
      
        miniaturas.forEach(miniatura => {
          miniatura.addEventListener('mouseenter', () => {
            // Guardamos el src actual de la miniatura
            const srcMini = miniatura.src;
      
            // Intercambiamos: la miniatura recibe el actual de la principal,
            // la principal recibe el de la miniatura
            miniatura.src = srcPrincipalActual;
            imagenPrincipal.src = srcMini;
      
            // Actualizamos el src actual de la principal para el próximo cambio
            srcPrincipalActual = srcMini;
          });
        });
      }, 50);
      


       let seleccion={
        color:null,
        talle:null
       }

    
       coloresDescripcion.forEach(color=>{

        color.addEventListener("click",async(e)=>{ 
    
             
          botonDescripcion.disabled=true
          
          coloresDescripcion.forEach(color=>color.classList.remove("seleccion_opciones_colores")) 
          e.target.classList.add("seleccion_opciones_colores") 

          if(e.target.classList.contains("seleccion_opciones_colores") && botonDescripcion.disabled===true){ 
            
           e.target.classList.add("seleccion_opciones_colores") 
           botonDescripcion.style.display="none"
           botoAgregarCarrito.style.display="block"
   
          seleccion.color=color.textContent

  
        
          }

        })
       })  




        tallesDescripcion.forEach(talle=>{

          talle?.addEventListener("click",async(e)=>{  
             

            botonDescripcion.disabled=true
          
        tallesDescripcion.forEach(talle=>talle.classList.remove("seleccion_opciones_talles")) 

            e.target.classList.add("seleccion_opciones_talles") 
  
            if(e.target.classList.contains("seleccion_opciones_talles")){ 
               
             e.target.classList.add("seleccion_opciones_talles") 
             botonDescripcion.disabled=false
             botonDescripcion.style.display="none"
             botoAgregarCarrito.style.display="block"
             seleccion.talle=talle.textContent 

           
            } 
              

          })
         }) 

         let producto_ID=imgID
         gestionarTallesYcolores(producto_ID,seleccion)

  }  

    




  async function activarDescripcion(){ 

    await reendedizarDetallesProductos();

    const btnDescripcion=document.getElementById("boton-descripcion") 

   btnDescripcion?.addEventListener("click",(e)=>{ 
    e.stopPropagation()

     let ingreso = localStorage.getItem('admin');
       let esAdmin = false;
       try {
         esAdmin = JSON.parse(ingreso);
       } catch {
         esAdmin = false;
       }
     
       if (esAdmin) {
         // Bloquear para admin 
         
        alert('no podes comprarte vos mismo')
         return;
       } 

    const producto_ID=imgID 

    recibirDescripcion(producto_ID)

   })


   } 
   

   activarDescripcion() 

   const modal=document.getElementById("modal") 

   const cerrarCruz=document.getElementById("close")
   const cerrarBoton=document.querySelector(".btn-cerrar")
   const name=document.querySelector('.nombre')
   const details=document.querySelector('.detalles')
   const price=document.querySelector('.precio')
   const imgModal=document.querySelector(".imagen_modal")
  
   const sizeContainer=document.querySelector("#sizes-box") 
   const colorContainer=document.querySelector(".colors-box")
   
   
   const btnOpciones=document.querySelector(".btn__opciones") 
   console.log(btnOpciones)

  
   //FUNCION******************************************************************************************************** 
   
   async function recibirDescripcion(producto_ID) { 
     console.log(productos)
    console.log(categorias)



    const usuarioActual=JSON.parse(localStorage.getItem('usuario'))||[]
  
    let sizesTexto = "";
    let colorTexto = "";
    let obtenerUSer
    let usuario=null 
    let usuario_id=null
  
    if(usuarioActual.length>0){
     obtenerUSer = usuarios.user?.find(user=>user.usuario===usuarioActual[usuarioActual.length-1].toString())
      let { Usuario, Usuario_id } = obtenerUSer;
      usuario=Usuario 
      usuario_id=Usuario_id
    }
  
  

  
    let imagenSeleccionada;
  
    let categoriasFiltrada = categorias.filter(category => category.activo === true);
    const productosFiltrados = productos.filter(p => p.activacion === true);
    let filtradoCategoryYProduct = productosFiltrados.filter(producto =>
      categoriasFiltrada.some(cat => cat.categoria_id === producto.categoria_id)
    );
  
    for (const producto of filtradoCategoryYProduct) {
      imagenSeleccionada = producto.imagenes.find(imagen => imagen.producto_id === producto_ID);
      if (imagenSeleccionada) break;
    }
  
    const productoSeleccionado = filtradoCategoryYProduct?.find(producto => producto.producto_id === producto_ID);
    if (!productoSeleccionado) return;
    const { nombre_producto, detalles, precio } = productoSeleccionado;
  
    const imagenOpciones = imagenSeleccionada?.urls[0]; 

    

  
    const varianteSeleccionada = filtradoCategoryYProduct?.find(variante => variante.producto_id === producto_ID); 
    console.log('la varianteee',varianteSeleccionada)

      
    const talles = varianteSeleccionada.productos_variantes
    .filter(item => item?.talles?.insertar_talle) // filtro solo los que tienen insertar_talle válido
    .map(item => `
      <button class="sizes" style="padding: 10px 14px; border: 1px solid #ccc; background: white; border-radius: 6px; cursor: pointer; min-width: 50px; text-align: center;">
        ${item?.talles?.insertar_talle}
      </button>
    `).join(" ");

  console.log(talles);

  const colores = varianteSeleccionada.productos_variantes
    .filter(item => item?.colores?.insertar_color) // filtro solo los que tienen insertar_color válido
    .map(item => `
      <button class="colors" style="padding: 10px 14px; border: 1px solid #ccc; background: white; border-radius: 6px; cursor: pointer; min-width: 50px; text-align: center;">
        ${item?.colores?.insertar_color}
      </button>
    `).join(" ");

   console.log(colores);

    
      const container = document.querySelector('.container');
      console.log(container);
      console.log(modal);
    console.log(sizeContainer);
  

  
    imgModal.src = imagenOpciones;
    name.innerHTML = "Nombre: " + nombre_producto;
    details.innerHTML = "Detalle: " + detalles;
    price.innerHTML = "precio: $" + precio.toFixed(2);
  
    sizeContainer.innerHTML = talles;
    colorContainer.innerHTML = colores;
  
    container.append(modal);
  
    const sizes = document.querySelectorAll('.sizes');
    const colors = document.querySelectorAll('.colors');
  // Escucha clics en talles
sizes.forEach(size => {
  size.addEventListener("click", () => {
    sizesTexto = size.textContent.trim();

    // Actualiza visual
    sizes.forEach(s => s.classList.remove("seleccion_opciones_talles"));
    size.classList.add("seleccion_opciones_talles");

    // Llama a la validación completa
    validacionInstantanea();
  });
});

// Escucha clics en colores
colors.forEach(color => {
  color.addEventListener("click", () => {
    colorTexto = color.textContent.trim();

    // Actualiza visual
    colors.forEach(c => c.classList.remove("seleccion_opciones_colores"));
    color.classList.add("seleccion_opciones_colores");

    // Llama a la validación completa
    validacionInstantanea();
  });
});

// 👇 Esta función se ejecuta solo cuando ambos estén seleccionados
function validacionInstantanea() {
  if (sizesTexto && colorTexto) {
    const combinacionExiste = validarCombinacion(sizesTexto, colorTexto);
    if (!combinacionExiste) {
      alert("Esta combinación de talle y color no está disponible.");
      // Podés resetear las clases visuales si querés:
      document.querySelectorAll('.sizes').forEach(s => s.classList.remove('seleccion_opciones_talles'));
      document.querySelectorAll('.colors').forEach(c => c.classList.remove('seleccion_opciones_colores'));
      sizesTexto = "";
      colorTexto = "";
      btnOpciones.disabled = true;
      btnOpciones.textContent = "Seleccione talla y color";
      return;
    }

    // ✅ Si es válida, se activa el botón
    activarBoton();
  }
}

// 👇 Valida si existe esa combinación en tu array
function validarCombinacion(talle, color) {
  return varianteSeleccionada.productos_variantes.some(variacion => {
    const talleVar = variacion?.talles?.insertar_talle?.trim().toLowerCase();
    const colorVar = variacion?.colores?.insertar_color?.trim().toLowerCase();
    return talleVar === talle.trim().toLowerCase() &&
           colorVar === color.trim().toLowerCase();
  });
}


          
     // 🔁 Reinicia las selecciones cada vez que abres el modal
    sizesTexto = "";
    colorTexto = "";
    btnOpciones.textContent = "Seleccione talla y color";
    btnOpciones.disabled = true;

    // Borra selecciones visuales previas
    document.querySelectorAll('.sizes').forEach(el => el.classList.remove('seleccion_opciones_talles'));
    document.querySelectorAll('.colors').forEach(el => el.classList.remove('seleccion_opciones_colores'));

 
    modal.style.display = "flex";
  
    function activarBoton() {
      btnOpciones.textContent = "Agregar al Carrito";
      btnOpciones.disabled = false;
    } 
    function validarCombinacion(talle, color) {
  return varianteSeleccionada.productos_variantes.some(variacion => {
    const t = variacion?.talles?.insertar_talle;
    const c = variacion?.colores?.insertar_color;
    if (!t || !c) return false;

    return (
      t.toString().trim().toLowerCase() === talle.toLowerCase() &&
      c.toString().trim().toLowerCase() === color.toLowerCase()
    );
  });
}

  
    console.log(btnOpciones);
  
    cerrarCruz.addEventListener("click", () => {
      modal.style.display = "none";
    });
  
    cerrarBoton.addEventListener("click", () => {
      modal.style.display = "none";
    });
    let carritoCompras = JSON.parse(localStorage.getItem('productos')) || [];

  
  btnOpciones.addEventListener("click", async () => {
  
  // Ahora buscamos el stock SÓLO SI la combinación es válida
  let stock = null;
 
  for (const element of varianteSeleccionada.productos_variantes) {
    if (
      element?.talles?.insertar_talle.toString().trim().toLowerCase() === sizesTexto.toString().trim().toLowerCase() &&
      element?.colores?.insertar_color.toString().trim().toLowerCase() === colorTexto.toString().trim().toLowerCase()
    ) {
      stock = element?.stock;
      break;
    }
  }


  const verificacion=JSON.parse(localStorage.getItem("verificado"))
   if(verificacion==="desactivado"){ 

    alert("por favor debes loguearte para poder agregar productos") 
    window.location.href="./login.html"
       return
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


      

  const colorNormalizado = colorTexto.trim().toLowerCase();
  const talleNormalizado = sizesTexto.trim().toLowerCase(); 
  let existeProducto = carritoCompras.find(producto =>
    producto.producto_id === producto_ID &&
    (producto.color || "").trim().toLowerCase() === colorNormalizado &&
    (producto.talle || "").trim().toLowerCase() === talleNormalizado &&
    producto.user_id === usuario_id
  );

  let objectoStorage = {
    user: usuario,
    user_id: usuario_id,
    producto_id: producto_ID,
    nombre_producto: nombre_producto,
    precio_producto: precio,
    cantidad: 1,
    detalles: detalles,
    imagen: imagenOpciones,
    color: colorTexto || "",
    talle: sizesTexto || "",
    
  };

  

  if (!existeProducto) {
    carritoCompras.push({ ...objectoStorage });
  } else {
    if (existeProducto.cantidad < stock) {
      existeProducto.cantidad += 1;
    } else {
      alert("Ya has agregado el máximo disponible de este producto.");
    }
  }

  localStorage.setItem("productos", JSON.stringify(carritoCompras));

  actualizarCarrito();

  

  manejarCantidadesDescripcion(producto_ID, sizesTexto, colorTexto);
});

  }
  



  
  async function gestionarTallesYcolores(producto_ID, seleccion) {
    let botonAgregarCarrito = document.querySelector("#boton-agregar-carrito");
  
    botonAgregarCarrito.addEventListener("click", async (e) => { 

      let ingreso=JSON.parse(localStorage.getItem("admin"))  

      let stock = null; 

      let varianteSeleccionada=productos.find(prod=>prod.producto_id===imgID)
    
  for (const element of varianteSeleccionada.productos_variantes) {
    if (
      element?.talles?.insertar_talle.toString().trim().toLowerCase() ===seleccion.talle.toString().trim().toLowerCase() &&
      element?.colores?.insertar_color.toString().trim().toLowerCase() === seleccion.color.toString().trim().toLowerCase()
    ) {
      stock = element?.stock;
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
      

      if(ingreso===true){ 
        alert('no podes comprarte vos mismo')

        return

      }


      if (seleccion.talle && seleccion.color && stock>0) {
        console.log(seleccion.talle, seleccion.color);

          manejarCantidadesCarrito(producto_ID, seleccion.talle, seleccion.color);
      }
    });
  }
  
    

  
  async  function manejarCantidadesDescripcion(productoID,sizes,color){  

      
        let stock=null
       
        
           console.log(productos) 
           if (!sizes || !color) {
            console.warn("Color o talle no definido.");
              return;
              }

    
      const productoSeleccionado = productos.find(producto => {
      
          return producto.producto_id === productoID &&
                 producto.productos_variantes.some(variacion =>
                   variacion.talles.insertar_talle.toString().trim() === sizes.toString().trim() &&
                   variacion.colores.insertar_color.toString().trim() === color.toString().trim()
                 );
        });

        if (!productoSeleccionado) {
          Swal.fire({
            title: 'No hay combinación válida de producto, talle y color.',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
          return;
        }

         for (const element of productoSeleccionado.productos_variantes) { 
    
          
          
           if(element.talles.insertar_talle.toString().trim()===sizes.toString().trim() && element.colores.insertar_color.toString().trim()===color.toString().trim()){ 
    
          
            stock=element?.stock
            break
    
           } 
    
         }  

      let stockStorage = JSON.parse(localStorage.getItem('stocks')) || [];

        const stockItem = {
          producto_id: productoID.toString().trim(),
          talle: sizes.toString().trim(),
          color: color.toString().trim(),
          stock: stock ?? 0
        };

        const indexExistente = stockStorage.findIndex(s =>
          s.producto_id === stockItem.producto_id &&
          s.talle.toLowerCase() === stockItem.talle.toLowerCase() &&
          s.color.toLowerCase() === stockItem.color.toLowerCase()
        );

        if (indexExistente !== -1) {
          stockStorage[indexExistente] = stockItem;
        } else {
          stockStorage.push(stockItem);
        }

        localStorage.setItem('stocks', JSON.stringify(stockStorage));



           if(modal){
            modal.style.display="none"

           }
      
         
    
        let carritoCompras=JSON.parse(localStorage.getItem("productos")) || [];

       

    
             const primerProducto=carritoCompras?.find(p=>p.producto_id===productoID&&
                                                      p?.color.toString().trim()===color.toString().trim() && p?.talle.toString().trim()===sizes.toString().trim()
             ) 
             if (!primerProducto) {
              console.warn("Producto no encontrado en carrito");
              return;
            }
            
             document.querySelector(".modal-2")?.remove();

             const div = document.createElement("div");
          
             
  
             div.innerHTML = `
               <div id="${productoID}-${color}-${sizes}" style="background: white; border-radius: 12px; width: 640px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);" class="modal-2">
                 <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid #ddd;" class="modal-header">
                   <h2 style="font-size: 18px; margin: 0; display: flex; align-items: center;">
                     <span style="color: green; font-size: 24px; margin-right: 10px;" class="icon-check">✔</span>Producto agregado a tu Carro
                   </h2>
                   <button type="button" style="font-size: 24px; cursor: pointer; border: none;background: none;" id="close-x" class="modal_close">x</button>
                 </div>
                 <div style="display: flex; padding: 16px;" class="modal-content">
                   <img style="width: 80px; height: auto; margin-right: 16px;" src="${primerProducto.imagen}" alt="Producto" />
                   <div style="flex-grow: 1;" class="product-info">
                     <h3 style="font-size: 14px; margin: 0; font-weight: normal;">${primerProducto.nombre_producto}</h3>
                     <strong style="display: block; margin: 4px 0;">${primerProducto.detalles}</strong>
                     <p style="color: red;">talle:${sizes}</p>
                     <p style="color: red;">color:${color}</p>
                     <p style="color: red;">el maximo permitido:${stock} unidades</p>
                     <div style="font-size: 18px; font-weight: bold;" class="product-price">Precio:$${primerProducto?.precio_producto.toFixed(2)}</div>
                     <div style="display: flex; align-items: center; margin-top: 8px;" class="quantity-selector-container">
                       <button class="boton-eliminar" id="btn-eliminar" style="width: 28px; height: 28px; font-size: 16px; border: 1px solid #ccc; background: white; cursor: pointer;">-</button>
                       <span class="quantity-selector" style="width: 30px; text-align: center;">${primerProducto.cantidad}</span>
                       <button class="boton-agregar" id="btn-agregar" style="width: 28px; height: 28px; font-size: 16px; border: 1px solid #ccc; background: white; cursor: pointer;">+</button>
                     </div>
                   </div>
                 </div>
                 <div style="padding: 16px; display: flex; justify-content: space-between; border-top: 1px solid #ddd;" class="modal-footer">
                   <a style="font-weight: bold; color: #0046be;" class="seguir_comprando" href="#">Seguir comprando</a>
                   <a id="carrito" href="./carrito.html" style="background: #3a3f4c; text-decoration:none; color: white; padding: 8px 24px; border: none; border-radius: 20px; font-size: 16px; cursor: pointer;" class="btn-carro">Ir al Carro</a>
                 </div>
               </div>
             `;

       
                 if (!container.classList.contains(div)) {
              container.append(div);
              } 



            window.addEventListener("pageshow",()=>{
               document.querySelector(".modal-2")?.remove();
            })
            
             
             container.addEventListener("click", (e) => {
               const target = e.target;
             
               // Botón "Seguir comprando"
               if (target.matches(".seguir_comprando")) {
                 window.location.reload();
               } 



             
               // Botón cerrar modal (x)
               if (target.classList.contains("modal_close")) {
                 const modal = target.closest(".modal-2");
                 if (modal) modal.remove();
               }
             
               // Botón agregar cantidad
          if (target.matches(".boton-agregar")) {
            e.preventDefault();
          
            if (primerProducto.cantidad < stock) {
              primerProducto.cantidad++;
            
              const cantidadSpan = target.closest(".quantity-selector-container").querySelector(".quantity-selector");
              cantidadSpan.textContent = primerProducto.cantidad;
            
              // ✅ Actualizar localStorage del carrito
              localStorage.setItem("productos", JSON.stringify(carritoCompras));
           
              actualizarCarrito();
            
              // ✅ Verificamos si estaba marcado como agotado y lo sacamos
              if (stock > 0) {
                let productosAgotados = JSON.parse(localStorage.getItem("productosAgotados")) || [];
                    
                let index = productosAgotados.findIndex(id => id === productoID);
                if (index > -1) {
                  productosAgotados.splice(index, 1);
                  localStorage.setItem("productosAgotados", JSON.stringify(productosAgotados));
                }
              }
            }
          }

             
               // Botón eliminar cantidad
               if (target.matches(".boton-eliminar")) {
                 e.preventDefault();
                 if (primerProducto.cantidad > 0) {
                   primerProducto.cantidad--;
                     const cantidadSpan = target.closest(".quantity-selector-container").querySelector(".quantity-selector");
                     cantidadSpan.textContent = primerProducto.cantidad || 0;
                   } 
                  localStorage.setItem("productos", JSON.stringify(carritoCompras));
               if (primerProducto.cantidad === 0) {
                const index = carritoCompras.findIndex( 

                  (producto) =>
                    producto.producto_id.toString() === productoID.toString() &&
                    producto.color.toString().trim().toLowerCase() === color.toString().trim().toLowerCase() &&
                    producto.talle.toString().trim().toLowerCase() === sizes.toString().trim().toLowerCase()
                );
              
                if (index !== -1) {
                  carritoCompras.splice(index, 1);
                
                  // Verificamos si el stock de esa combinación es 0
                  const productoSeleccionado = productos.find(p => p.producto_id === productoID);
                  const variante = productoSeleccionado?.productos_variantes?.find(v =>
                    v?.colores?.insertar_color?.toString().trim().toLowerCase() === color.toString().trim().toLowerCase() &&
                    v?.talles?.insertar_talle?.toString().trim().toLowerCase() === sizes.toString().trim().toLowerCase()
                  );
                
                  if (variante?.stock === 0) {
                    alert("Este talle con este color está agotado y fue eliminado del carrito.");
                  }
                }
              
                // Elimina el modal correspondiente al producto
                const modalId = `${productoID}-${color}-${sizes}`;
                const modal = document.getElementById(modalId);
                if (modal) modal.remove();
              }
            
             
              
               
                 actualizarCarrito()
               }
             });
             
             if (carritoCompras.length === 0) { 
            
                localStorage.removeItem("productos"); // 🔴 El carrito quedó vacío
              actualizarCarrito()
            } 

            
            
        
      } 



      async function manejarCantidadesCarrito(productoID,sizes,color){  


        const usuarioNombre=JSON.parse(localStorage.getItem('usuario'))||[]
     
      
        
         let stock=null 
         let colorNombre=null
         let talleNombre=null 
         let usuario 
         let usuario_id

         if(usuarioNombre.length>0){ 
          
         const obtenerUSer = usuarios.user?.find(user => usuarioNombre.includes(user.usuario));
       
         const {Usuario,Usuario_id}=obtenerUSer 
         usuario=Usuario
         usuario_id=Usuario_id

  
         }
  
  
           const verificacion=JSON.parse(localStorage.getItem("verificado"))
           if(verificacion==="desactivado"){ 
          
            alert("por favor debes loguearte para poder agregar productos") 
            window.location.href="./login.html" 
            return
          
           }
  
  
  let imagenSeleccionada; 
  
  let categoriasFiltrada = categorias.filter(category => category.activo === true);
  const productosFiltrados = productos.filter(p => p.activacion === true);
  let filtradoCategoryYProduct = productosFiltrados.filter(producto => 
  categoriasFiltrada.some(cat => cat.categoria_id === producto.categoria_id)
  );
  
  
  for (const producto of filtradoCategoryYProduct) { 
   imagenSeleccionada = producto.imagenes.find(imagen => imagen.producto_id === productoID);
   if (imagenSeleccionada) {
     break;  // Solo cuando ENCUENTRES la imagen cortas el bucle
   }
  } 
  
  // Buscar color en las variantes de productos
  
  
  
  
  const nombre=filtradoCategoryYProduct?.find(producto=>producto.producto_id===productoID)?.nombre_producto 
  const detalles=filtradoCategoryYProduct?.find(producto=>producto.producto_id===productoID)?.detalles
  const precio=filtradoCategoryYProduct?.find(producto=>producto.producto_id===productoID)?.precio 
  
  
  const imagenOpciones=imagenSeleccionada?.urls[0] 
  
  
    
     
         const productoSeleccionado=productos.find(producto=>producto.producto_id===productoID) 
     
  
         console.log(productoSeleccionado) 
  
       
          for (const element of productoSeleccionado?.productos_variantes) { 
          
     
           console.log(element) 
    
  
           
           if (String(element?.talles?.insertar_talle).trim().toLowerCase() === String(sizes).trim().toLowerCase()
           && 
            String(element?.colores?.insertar_color).trim().toLowerCase() === String(color).trim().toLowerCase()
          ) {
            console.log(sizes);
            console.log(color);
        
          
            colorNombre=element?.colores?.insertar_color ?? null;
            talleNombre=element?.talles?.insertar_talle ?? null;
            stock = element?.stock;
            
           
            break;
          }
     
          } 
  
          const objectoStorage={
            user:usuario,
            user_id:usuario_id,
            producto_id:productoID,
            nombre_producto:nombre,
            precio_producto:precio,
            cantidad:1,
            detalles:detalles,
            imagen:imagenOpciones,
            color:colorNombre || "",
            talle:talleNombre || "",
            
          } 

          console.log(colorNombre)
          console.log(talleNombre)
  
      
            let carritoCompras = JSON.parse(localStorage.getItem("productos")) || [];
        
            console.log(carritoCompras) 
      
           let primerProducto = carritoCompras?.find(producto => 
            producto.producto_id.toString().trim()===productoID.toString().trim()&&
            producto.color.toString().trim() === color.toString().trim()&&
            producto.talle.toString().trim() === sizes.toString().trim()
          );
                 console.log(primerProducto) 

                
                  if (stock === null) {
                    alert("No se pudo determinar el stock.");
                    return;
                                      }

                    if (!primerProducto) {
                      carritoCompras.push({ ...objectoStorage });
                    } else {
                      if (primerProducto.cantidad < stock) {
                       primerProducto.cantidad += 1;
                      } else {
                        alert("Ya has agregado el máximo disponible de este producto.");
                      }
                    }
                     actualizarCarrito()

  
       let stockStorage = JSON.parse(localStorage.getItem('stocks')) || [];

        const stockItem = {
          producto_id: productoID.toString().trim(),
          talle: sizes.toString().trim(),
          color: color.toString().trim(),
          stock: stock ?? 0
        };

        const indexExistente = stockStorage.findIndex(s =>
          s.producto_id === stockItem.producto_id &&
          s.talle.toLowerCase() === stockItem.talle.toLowerCase() &&
          s.color.toLowerCase() === stockItem.color.toLowerCase()
        );

        if (indexExistente !== -1) {
          stockStorage[indexExistente] = stockItem;
        } else {
          stockStorage.push(stockItem);
        }

        localStorage.setItem('stocks', JSON.stringify(stockStorage));

         localStorage.setItem('productos', JSON.stringify(carritoCompras));
         localStorage.setItem("carritoActivo", "true");
      
     
         document.querySelector('.nuevo-modal')?.remove()
     
         const section=document.createElement("section") 
  
         section.innerHTML = ` 
         <div style="background: white; border-radius: 12px; width: 640px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);" class="nuevo-modal">
           <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid #ddd;" class="modal-header">
             <h2 style="font-size: 18px; margin: 0; display: flex; align-items: center;">
               <span style="color: green; font-size: 24px; margin-right: 10px;" class="icon-check">✔</span>Producto agregado a tu Carro
             </h2>
             <button type="button" style="font-size: 24px; cursor: pointer; border: none;background: none;" id="close-x" class="modal_close">x</button>
           </div>
           <div style="display: flex; padding: 16px;" class="modal-content">
             <img style="width: 80px; height: auto; margin-right: 16px;" src="${imagenOpciones}" alt="Producto" />
             <div style="flex-grow: 1;" class="product-info">
               <h3 style="font-size: 14px; margin: 0; font-weight: normal;">${nombre}</h3>
               <strong style="display: block; margin: 4px 0;">${detalles}</strong>
               <p style="color: red;">talle:${sizes}</p>
               <p style="color: red;">color:${color}</p>
               <p style="color: red;">el maximo permitido:${stock} unidades</p>
               <div style="font-size: 18px; font-weight: bold;" class="product-price">Precio:$${precio}</div>
               <div style="display: flex; align-items: center; margin-top: 8px;" class="quantity-selector-container">
                 <button class="boton-eliminar" id="btn-eliminar" style="width: 28px; height: 28px; font-size: 16px; border: 1px solid #ccc; background: white; cursor: pointer;">-</button>
                 <span class="quantity-selector" style="width: 30px; text-align: center;">${primerProducto?.cantidad || objectoStorage.cantidad}</span>
                 <button class="boton-agregar" id="btn-agregar" style="width: 28px; height: 28px; font-size: 16px; border: 1px solid #ccc; background: white; cursor: pointer;">+</button>
               </div>
             </div>
           </div>
           <div style="padding: 16px; display: flex; justify-content: space-between; border-top: 1px solid #ddd;" class="modal-footer">
             <a style=" font-weight: bold; color: #0046be;" class="seguir_comprando" href="./productosUsuario.html">Seguir comprando</a>
             <a id="carrito" href="./carrito.html" style="background: #3a3f4c; text-decoration:none; color: white; padding: 8px 24px; border: none; border-radius: 20px; font-size: 16px; cursor: pointer;" class="btn-carro">Ir al Carro</a>
           </div>
         </div>
       `; 

       
       
       if (!container.classList.contains(section)) {
         container.append(section);
       } 

       
            window.addEventListener("pageshow",()=>{
               document.querySelector(".nuevo-modal")?.remove();
            })
            
             
       
  
       const cantidadSpan = section.querySelector(".quantity-selector"); // referencia al <span>
       
       section.addEventListener("click", (e) => {
         // SEGIR COMPRANDO
         if (e.target.matches(".seguir_comprando")) {
           window.location.reload();
         }
       
         // CERRAR MODAL
         if (e.target.matches(".modal_close")) {
           const modal = container.querySelector(".nuevo-modal");
           section.style.display = "none";
           if (modal) modal.remove();
         }
       
         if (e.target.matches(".boton-agregar")) {
          e.preventDefault();

          // Recalcular el producto actual desde el carrito
          let productoActual = carritoCompras.find(producto => 
            producto.producto_id.toString().trim() === productoID.toString().trim() &&
            producto.color.toString().trim() === color.toString().trim() &&
            producto.talle.toString().trim() === sizes.toString().trim()
          );
        
          if (productoActual) {
            if (productoActual.cantidad < stock) {
              productoActual.cantidad++;
              cantidadSpan.textContent = productoActual.cantidad;
              actualizarCarrito();
            }
          } else {
            if (objectoStorage.cantidad < stock) {
              carritoCompras.push({ ...objectoStorage });
              cantidadSpan.textContent = objectoStorage.cantidad;
              actualizarCarrito();
            }
          }
        
          localStorage.setItem("productos", JSON.stringify(carritoCompras));
         
        
          // ✅ Si hay stock, remover el producto de productosAgotados (si está)
          if (stock > 0) {
            let productosAgotados = JSON.parse(localStorage.getItem("productosAgotados")) || [];
          
            let index = productosAgotados.findIndex(id => id === productoID);
            if (index > -1) {
              productosAgotados.splice(index, 1);
              localStorage.setItem("productosAgotados", JSON.stringify(productosAgotados));
            }
          }
      }

        
       
         // BOTÓN ELIMINAR
    if (e.target.matches(".boton-eliminar")) {
      e.preventDefault();

  // ⛑️ Recalculá el producto actualizado en ese momento
      let productoActual = carritoCompras.find(producto => 
        producto.producto_id.toString().trim() === productoID.toString().trim() &&
        producto.color.toString().trim() === color.toString().trim() &&
        producto.talle.toString().trim() === sizes.toString().trim()
      );
    
      if (productoActual && productoActual.cantidad > 0) {
        productoActual.cantidad--;
        cantidadSpan.textContent = productoActual.cantidad || 0;
      }
         
      localStorage.setItem("productos", JSON.stringify(carritoCompras)); 

      if (productoActual && productoActual.cantidad === 0) {
        const index = carritoCompras.findIndex(
          (producto) =>
            producto.producto_id.toString() === productoID.toString() &&
            producto.color.toString().trim().toLowerCase() === color.toString().trim().toLowerCase() &&
            producto.talle.toString().trim().toLowerCase() === talleNombre.toString().trim().toLowerCase()
        );
      
        if (index !== -1) {
          carritoCompras.splice(index, 1);
        
          const productoSeleccionado = productos.find(p => p.producto_id === productoID);
          const varianteAgotada = productoSeleccionado?.productos_variantes?.find(v =>
            v?.colores?.insertar_color?.toString().trim().toLowerCase() === color.toString().trim().toLowerCase() &&
            v?.talles?.insertar_talle?.toString().trim().toLowerCase() === talleNombre.toString().trim().toLowerCase()
          );
        
          if (varianteAgotada?.stock === 0) {
            alert("Este talle con este color está agotado y fue eliminado del carrito.");
          }
        }
      
        const modal = document.querySelector('.nuevo-modal');
        if (modal) modal.remove();  
        
        if (carritoCompras.length === 0) {
            localStorage.removeItem("productos");
          }
       
      }

   
      actualizarCarrito();
   }



       });
       
       
        

      }
     
   
  

  