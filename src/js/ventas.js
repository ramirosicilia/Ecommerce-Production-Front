import { obtenerProductos,pedidos,detallesPedidos, pagoMercadoPago } from "./api/productos.js"; 




async function obtenerDatos() { 


  
    const productos = await obtenerProductos();
    const Pedidos = await pedidos();
    const detalles_pedidos = await detallesPedidos();
    const pagos = await pagoMercadoPago();

    console.log(productos, "productos");
    console.log(Pedidos, "pedidos");
    console.log(detalles_pedidos, "detalle pedidos");
    console.log(pagos, "pagos mercado");

    // Nombres de los meses
    const nombresMeses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Filtramos los pagos aprobados
    const pagosAprobados = pagos.filter(pago => (pago.status || '').toLowerCase() === 'approved');
    const preferenceIdsAprobados = pagosAprobados.map(p => p.preference_id);

    // Filtramos los pedidos con pagos aprobados
    const pedidosPagados = Pedidos.filter(pedido => preferenceIdsAprobados.includes(pedido.preference_id));

    // Preparamos array de ventas por mes (enero a diciembre)
    const ventasMensuales = Array(12).fill(0); // Inicializamos todo en 0

    // Recorremos cada mes
    for (let mes = 0; mes < 12; mes++) {
      // Filtramos pedidos de ese mes
      const pedidosDelMes = pedidosPagados.filter(pedido => {
        const fecha = new Date(pedido.fecha_creacion);
        return fecha.getMonth() === mes;
      });

      // Obtenemos los IDs de pedidos del mes
      const idsPedidosMes = pedidosDelMes.map(p => p.pedido_id);

      // Filtramos detalles que correspondan a esos pedidos
      const detallesDelMes = detalles_pedidos.filter(detalle =>
        idsPedidosMes.some(id=>id===detalle.pedido_id)
      );

      // Sumamos ventas por cantidad * precio del producto
      const totalVentasMes = detallesDelMes.reduce((acum, detalle) => {
        const producto = productos.find(p => p.producto_id === detalle.producto_id);
        const precio = producto?.precio || 0;
        return acum + (detalle.cantidad * precio);
      }, 0);

      ventasMensuales[mes] = totalVentasMes;
    }
window.ventasMensuales = ventasMensuales; // Guardamos para poder usar en el modal

    console.log("📈 Ventas por mes:", ventasMensuales);

    // Renderizamos el gráfico
    renderizarGrafico(ventasMensuales, nombresMeses);
  }

  function renderizarGrafico(datosVentas, etiquetas) {
    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: etiquetas,
        datasets: [{
          label: 'Ventas Mensuales',
          data: datosVentas,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 5000
            }
          }
        }
      }
    });
  }

  obtenerDatos(); 

    const reportesID=document.getElementById("reportes") 

    reportesID.addEventListener("click",reendedizadoReporte)


  function reendedizadoReporte() {
  const modal = document.getElementById('modal-reporte');
  const contenido = document.getElementById('contenido-reporte');
  
  // Asegurate que ventasMensuales ya existe (si no, guardala globalmente)
  if (!window.ventasMensuales) {
    alert('Los datos aún no están listos');
    return;
  }

  // Generamos el contenido del modal (ej: lista de ventas por mes)
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
   const ventas = window.ventasMensuales;
  let html = '<ul>';
  for (let i = 0; i < 12; i++) {
    html += `<li><strong>${meses[i]}:</strong> $${ventas[i].toFixed(2)}</li>`;
  }
  html += '</ul>';

  contenido.innerHTML = html;

  // Mostrar el modal
  modal.classList.remove('hidden');
}
   document.querySelector('.close-button').addEventListener('click', () => {
  document.getElementById('modal-reporte').classList.add('hidden');
}); 

document.getElementById('modal-reporte').addEventListener('click', (e) => {
  if (e.target.id === 'modal-reporte') {
    document.getElementById('modal-reporte').classList.add('hidden');
  }
}); 


document.getElementById("btn-imprimir").addEventListener("click", () => {
  const contenido = document.getElementById("contenido-reporte").innerHTML;
  const ventana = window.open('', '', 'height=600,width=800');
  ventana.document.write('<html><head><title>Reporte Anual</title></head><body>');
  ventana.document.write('<h2>📊 Reporte Anual de Ventas</h2>');
  ventana.document.write(contenido);
  ventana.document.write('</body></html>');
  ventana.document.close();
  ventana.print();
});


document.getElementById("btn-pdf").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("📊 Reporte Anual de Ventas", 10, 20);

  const ventas = window.ventasMensuales || [];
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  let y = 30;
  ventas.forEach((venta, i) => {
    doc.text(`${meses[i]}: $${venta.toFixed(2)}`, 10, y);
    y += 10;
  });

  doc.save("reporte-ventas.pdf");
});




