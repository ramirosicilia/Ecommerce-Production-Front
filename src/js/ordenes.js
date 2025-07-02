import { pedidos,detallesPedidos,obtenerProductos } from "./api/productos" 


let ordenes=[]
let detalleOrdenes=[]
let productos=[] 




async function obtenerDatos(){  

    const Products= await obtenerProductos()

    const [order,detailsOrders]= await Promise.all([pedidos(),detallesPedidos()]) 
    ordenes=order 
    detalleOrdenes=detailsOrders
    productos=Products

} 


(async()=>{ 
  await  obtenerDatos() 
  obtenerDatosOrden()

})() 
 
function obtenerDatosOrden(){ 
    console.log(ordenes,"ordendes") 
    console.log(detalleOrdenes," detalle ordenes") 
    console.log(productos,"productos")


    const objectoStorage=JSON.parse(localStorage.getItem("pagos"))||{} 
    console.log(objectoStorage?.user+" "+"usuario" , objectoStorage?.pagoID+" "+"pago") 
     
     let variantes=productos.flatMap(productos=>productos.productos_variantes) 
     console.log(variantes) 


     const pedido=ordenes.find(id=>id.preference_id===objectoStorage?.pagoID) 
    
     
   
     

    const detallesPedido = detalleOrdenes.filter(id => id.pedido_id === pedido.pedido_id);

    const seleccion = detallesPedido.map(detalle => {
        const varianteSeleccionada = variantes.find(v => v.variante_id === detalle.variante_id);
        const productoSeleccionado = productos.find(p => p.producto_id === varianteSeleccionada.producto_id);

        return {
            pedido: pedido,
            detallePedido: detalle,
            varianteSeleccionada: varianteSeleccionada,
            productoSeleccionado: productoSeleccionado,
            usuario_id: objectoStorage?.user
        };
    });

  
    
   
   mostrarOrden(seleccion)
} 


function mostrarOrden(data){  

    data.forEach(element => { 
          console.log(element.pedido,"pedido")
           console.log(element.detallePedido,"detalle pedido")
          console.log(element.varianteSeleccionada,"variante seleccionada")
          console.log(element.productoSeleccionado,"productos seleccionados")
            console.log(element.usuario_id," usuario id ")
        
    }); 
  
 
 const contenedor = document.getElementById("container-orden");

const total = data.reduce((acc, prod) => acc + (prod.productoSeleccionado.precio * prod.detallePedido.cantidad), 0);

const usuariosUnicos = [...new Set(data.map(d => d.usuario_id))];
const preferenciasUnicas = [...new Set(data.map(d => d.pedido.preference_id))];
const fechasUnicas = [...new Set(data.map(d => d.pedido.fecha_creacion))];
const fechaCruda = fechasUnicas[0]; // ejemplo: "2025-06-25 14:23:05"
const fechaDate = new Date(fechaCruda); // convierte a objeto Date

// Extraer día, mes y año con padding
const dia = String(fechaDate.getDate()).padStart(2, '0');
const mes = String(fechaDate.getMonth() + 1).padStart(2, '0'); // +1 porque enero es 0
const anio = fechaDate.getFullYear();
const horas = String(fechaDate.getHours()).padStart(2, '0');
const minutos = String(fechaDate.getMinutes()).padStart(2, '0');
const segundos = String(fechaDate.getSeconds()).padStart(2, '0');

// Formato final "dd-mm-aaaa"

const fechaFormateada = `${dia}-${mes}-${anio} ${horas}:${minutos}:${segundos}`;


console.log(usuariosUnicos);
console.log(preferenciasUnicas);

contenedor.innerHTML = ` 
  <div class="card" role="region" aria-label="Detalle de la orden">

    <header class="card-header">
      <h2>Pedido <span id="pedido_id">${data[0].pedido.pedido_id}</span></h2>
      <div id="estado" class="status procesando" aria-live="polite">Procesando</div>
    </header>

    <!-- Detalle de Productos -->
    <section class="detalle-productos">
      <h3>Detalle de Productos</h3>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Talle</th>
            <th>Color</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody id="detalle-productos">
          ${data.map(d => `
            <tr>
              <td>${d.productoSeleccionado.nombre_producto}</td>
              <td>${d.varianteSeleccionada.talles.insertar_talle}</td>
              <td>${d.varianteSeleccionada.colores.insertar_color}</td>
              <td>${d.detallePedido.cantidad}</td>
              <td>$ ${d.productoSeleccionado.precio}</td>
              <td>$ ${d.productoSeleccionado.precio * d.detallePedido.cantidad}</td>
            </tr>
          `).join('')}
        </tbody>

        <tfoot>
          <tr>
            <td colspan="5" style="text-align: right;">Total:</td>
            <td>${total}</td>
          </tr>
        </tfoot>
      </table>
    </section>

    <!-- Info General -->
    <section class="info-grid">
      <article class="info-item">
        <div class="icon" aria-hidden="true">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="7" r="4"></circle>
            <path d="M5.5 21a6.5 6.5 0 0 1 13 0"></path>
          </svg>
        </div>
        <div class="info-text">
          <div class="info-label">Usuario ID</div>
          <div class="info-value" id="usuario_id">${usuariosUnicos[0]}</div>
        </div>
      </article>

      <article class="info-item">
        <div class="icon" aria-hidden="true">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <div class="info-text">
          <div class="info-label">Fecha de creación</div>
          <div class="info-value" id="fecha_creacion">${fechaFormateada}</div>
        </div>
      </article>

      <article class="info-item">
        <div class="icon" aria-hidden="true">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </div>
        <div class="info-text">
          <div class="info-label">Preference ID</div>
          <div class="info-value" id="preference_id">${preferenciasUnicas[0]}</div>
        </div>
      </article>
    </section>

    <footer class="card-footer">
      Detalle generado automáticamente por el sistema
    </footer>

  </div>`;

    } 







