import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './', // importante para rutas relativas en producción
  root: '.',  // raíz del proyecto
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {

      
      input: {
        index: resolve(__dirname, 'index.html'),
        carrito: resolve(__dirname, 'carrito.html'),
        categorias: resolve(__dirname, 'categorias.html'),
        pagos: resolve(__dirname, 'pagos.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        descripcion: resolve(__dirname, 'descripcionProducto.html'),
        envioRecuperacion: resolve(__dirname, 'envioRecuperacion.html'),
        login: resolve(__dirname, 'login.html'),
        nuevoRegistro: resolve(__dirname, 'nuevoRegistro.html'),
        productosAdmin: resolve(__dirname, 'productosAdmin.html'),
        productosUsuario: resolve(__dirname, 'productosUsuario.html'),
        registro: resolve(__dirname, 'registro.html'),
        registroProducto: resolve(__dirname, 'registroProductos.html'),
        ventas: resolve(__dirname, 'ventas.html'),
        compraRealizada:resolve(__dirname, 'compraRealizada.html'),
        ordenes: resolve(__dirname, 'ordenes.html'),
        // puedes agregar más si luego sumas páginas nuevas
      }
    }
  },
  server: {
    open: true,
    port: 5173
  }
})

