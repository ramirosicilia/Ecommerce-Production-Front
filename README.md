# 🛒 eCommerce Web App

Este es un proyecto completo de eCommerce que permite la gestión y compra de productos con funcionalidades diferenciadas según el rol del usuario: **administrador** o **cliente**.

---

## 📂 Estructura del Proyecto

mi-proyecto/
├── dist/ # Archivos para producción (minificados, optimizados)
├── src/ # Código fuente local
│ ├── js/ # Scripts JavaScript
│ └── styles/ # Estilos CSS
├── index.html # HTML principal
├── productosAdmin.html # Página para administración de productos
├── login.html # Login de usuarios
├── registro.html # Registro de usuarios
├── productosUsuarios.html # Página para usuarios (panel o catálogo)
├── LICENSE # Licencia MIT
└── README.md # Este archivo

markdown
Copiar
Editar

---

## 🧾 Características

### 🔐 Roles

- **Administrador**
  - Agrega, edita y elimina productos.
  - Define colores, talles y otras características personalizadas.
  - Visualiza todas las compras realizadas.

- **Usuario**
  - Se registra e inicia sesión.
  - Explora productos por categoría o búsqueda.
  - Elige variantes como color, talle u otra característica.
  - Agrega productos al carrito y finaliza la compra.

### 💳 Método de Pago

- Integración completa con [Mercado Pago](https://www.mercadopago.com/) para procesar pagos de forma segura.

---

## 🖥️ Tecnologías Usadas

- **HTML5** y **CSS3**
- **JavaScript (Vanilla)**
- **Mercado Pago SDK**
- **Responsive Design** con media queries
- **Gestión de vistas** usando archivos `.html` sueltos
- **Build para producción** en carpeta `dist/`

---

## 🚀 Cómo Ejecutar el Proyecto

1. **Cloná este repositorio**:
   ```bash
   git clone https://github.com/ramirosicilia/Ecommerce-Production-Front.git