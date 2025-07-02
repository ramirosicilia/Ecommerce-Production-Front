import axios from 'axios';


const apiUrl = import.meta.env.VITE_BACKEND_URL;
const apiUrlPayMent=import.meta.env.VITE_PAYMENT_URL


export const obtenerProductos=async()=>{ 

  try{ 

    const response= await fetch(`${apiUrl}/obtener-productos`) 
    console.log(response,"admin") 

    if(!response.ok){ 

      const dataErrror= await response.json() 
      throw new Error(dataErrror.error)

    } 

    else{
      const productosData= await response.json()  
      console.log(productosData)
      

      return productosData
    } 

  } 


  catch (err) {
    console.error("Error:", err);
    Swal.fire({
      title: "Error",
      text: err.message,
      icon: "error",
      confirmButtonText: "Intenta de nuevo",
    });
   
  }


} 


export async function obtenerCategorys() {
  try {
      const response = await fetch(`${apiUrl}/obtener-categorias`);

      if (!response.ok) {
          throw new Error("No se obtuvo la data");
      } else {
          const dataCategory = await response.json();
          return dataCategory;
      }
  } catch (err) {
      console.log(err.message);
  } 

  return []; // Retornar array vacío en caso de error
} 



export async function obtenerImagenes() { 

  
  try {
      const response = await fetch(`${apiUrl}/obtener-imagenes`);

      if (!response.ok) {
          throw new Error("No se obtuvo la data");
      } if(response) {
          const dataImagen = await response.json(); 

          console.log(dataImagen.data,"imagenes")
          return dataImagen.data;
      }
  } catch (err) {
      console.log(err.message);
  } 

  return []; // Retornar array vacío en caso de error
}  


export const obtenerUsuarios=async()=>{  
  const token = localStorage.getItem("token"); // O de las cookies si es necesario 
  console.log(token) 
  console.log( typeof token)

  try {
    const response = await fetch(`${apiUrl}/obtener-usuarios`, {
      method: 'GET',
      headers: {
         'Authorization': `Bearer ${token}`
      },
      credentials: 'include' // Esto debe ir dentro del objeto de configuración
    });
  
    console.log(response, "admin");
  
    if (!response.ok) {
      const dataErrror = await response.json();
      throw new Error(dataErrror.error);
    } else {
      const usuariosData = await response.json();
      console.log(usuariosData.user);
      return usuariosData;
    }
  
  } 

  catch (err) {
    console.error("Error:", err);
    Swal.fire({
      title: "Error",
      text: err.message,
      icon: "error",
      confirmButtonText: "Intenta de nuevo",
    });
   
  }


}  


export async function pedidos(){

  try { 

    const response= await fetch(`${apiUrlPayMent}/pedidos`) 

     if(response.status!=200){ 
       throw new Error("No llegaron los productos");

     }
    const data= await response.json()
     
    return data

    
  } catch (error) {
    console.log("no se obtuvieron los pedidos")
    return null
    
  }
} 


export async function detallesPedidos(){

  try { 

    const response=await fetch (`${apiUrlPayMent}/detalles-productos`) 

     
    const data=response.json()
     
    return data

    
  } catch (error) {
    console.log("no se obtuvieron los pedidos")
    return null
    
  }
} 

 export async function pagoMercadoPago(){

  try { 
     const response = await axios.get(`${apiUrlPayMent}/pagos-mercadopago`);
    const pagosData = response.data; 

    return pagosData
    
  } catch (error) { 
    console.timeLog('hubo un error alobtenerla data',error)
    
  }
   
}



