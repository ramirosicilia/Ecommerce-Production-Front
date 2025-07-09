import { obtenerProductos,pedidos,detallesPedidos, pagoMercadoPago } from "./api/productos.js"; 



async function promesas() {
  const [productos, Pedidos, DetallesPedidos, pago] = await Promise.all([
    obtenerProductos(),
    pedidos(),
    detallesPedidos(),
    pagoMercadoPago()
  ]);

  console.log(productos, "productos");
  console.log(Pedidos, "pedidos");
  console.log(DetallesPedidos, "detalles pedidos");

  // Función adaptada para calcular ventas
  function calcularVentasPorMes(mes, año, Pedidos, DetallesPedidos, productos) {
    const pedidosFiltrados = Pedidos?.filter(pedido => {
      const fecha = new Date(pedido.fecha_creacion);
      return fecha.getMonth() === mes && fecha.getFullYear() === año;
    });

    const idsPedidos = pedidosFiltrados?.map(p => p.pedido_id);

    const detallesFiltrados = DetallesPedidos?.filter(d =>
      idsPedidos.includes(d.pedido_id)
    );

    const total = detallesFiltrados.reduce((acum, detalle) => {
      const producto = productos.find(p => p.producto_id === detalle.producto_id);
      const subtotal = detalle.cantidad * (producto?.precio || 0);
      return acum + subtotal;
    }, 0);

    return total;
  }

  // Función para obtener clientes activos
  function obtenerClientesActivos(Pedidos, Pagos) {
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const añoActual = hoy.getFullYear();

    const pagosAprobados = Pagos.filter(pago => (pago.status || '').toLowerCase() === 'approved');
    const preferenceIdsPagos = pagosAprobados.map(p => p.preference_id);

    const pedidosMesActual = Pedidos.filter(pedido => {
      const fechaPedido = new Date(pedido.fecha_creacion);
      return (
        fechaPedido.getMonth() === mesActual &&
        fechaPedido.getFullYear() === añoActual &&
        preferenceIdsPagos.includes(pedido.preference_id)
      );
    });

    const usuariosActivos = [...new Set(pedidosMesActual.map(p => p.usuario_id))];

    console.log("Pagos aprobados:", pagosAprobados);
    console.log("Preference IDs pagos aprobados:", preferenceIdsPagos);
    console.log("Pedidos mes actual con pagos aprobados:", pedidosMesActual);
    console.log("Usuarios activos:", usuariosActivos);

    return usuariosActivos.length;
  }

  // Fechas actuales
  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const añoActual = hoy.getFullYear();
  const mesPasado = mesActual === 0 ? 11 : mesActual - 1;
  const añoMesPasado = mesActual === 0 ? añoActual - 1 : añoActual;

  // Totales de ventas
  const totalActual = calcularVentasPorMes(mesActual, añoActual, Pedidos, DetallesPedidos, productos);
  const totalPasado = calcularVentasPorMes(mesPasado, añoMesPasado, Pedidos, DetallesPedidos, productos);
  const diferencia = totalActual - totalPasado;
  const porcentajeCambio = totalPasado !== 0 ? ((diferencia / totalPasado) * 100).toFixed(2) : "∞";

  document.getElementById("total-actual").innerHTML = `$${totalActual}`;

  const comparacionElem = document.getElementById("comparacion-mes-pasado");
  let mensajeComparacion = "";

  if (totalPasado === 0 && totalActual > 0) {
    mensajeComparacion = "Este mes hubo nuevas ventas (sin comparación)";
  } else if (totalPasado === 0 && totalActual === 0) {
    mensajeComparacion = "Sin ventas en ambos meses";
  } else {
    mensajeComparacion = `Comparado con el mes pasado: ${porcentajeCambio}%`;
  }

  if (comparacionElem) comparacionElem.textContent = mensajeComparacion;

  // Clientes activos
  const totalClientesActivos = obtenerClientesActivos(Pedidos, pago);
  const clientesActivosElem = document.getElementById("clientes-activos-numero");
  if (clientesActivosElem) clientesActivosElem.textContent = totalClientesActivos;

  // Cantidad de productos vendidos
  const pedidosFiltrados = Pedidos.filter(pedido => {
    const fecha = new Date(pedido.fecha_creacion);
    return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
  });

  const idsPedidosActuales = pedidosFiltrados.map(p => p.pedido_id);

  const detallesFiltrados = DetallesPedidos.filter(d =>
    idsPedidosActuales.includes(d.pedido_id)
  );

  const totalProductosVendidos = detallesFiltrados.reduce((acum, detalle) => {
    return acum + detalle.cantidad;
  }, 0);

  const productosVendidosElem = document.getElementById("productos-vendidos-numero");
  if (productosVendidosElem) productosVendidosElem.textContent = totalProductosVendidos;

  // 🔢 Ventas por mes desde enero hasta diciembre, meses futuros con 0
  const ventasMensuales = [];
  const etiquetasMensuales = [];
  const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  for (let mes = 0; mes < 12; mes++) {
    if (mes <= mesActual) {
      const total = calcularVentasPorMes(mes, añoActual, Pedidos, DetallesPedidos, productos);
      ventasMensuales.push(total);
    } else {
      ventasMensuales.push(0);
    }
    etiquetasMensuales.push(nombresMeses[mes]);
  }

  console.log("📈 Ventas reales por mes:", ventasMensuales);
  console.log("🗓️ Etiquetas del gráfico:", etiquetasMensuales);

  // 📊 Renderizar gráfico con datos reales
  renderizarGrafico(ventasMensuales, etiquetasMensuales);
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
        borderColor: '#6a11cb',
        backgroundColor: 'rgba(106, 17, 203, 0.1)',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
  });
}

promesas();
