
import { validarFormularioIngreso } from "./validacionUsuario.js";

const apiUrl=import.meta.env.VITE_BACKEND_URL


const formularioIngreso = document.getElementById("formulario"); 
console.log(formularioIngreso) 



formularioIngreso.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  let nombre = document.querySelector(".nombre").value;
  let apellido = document.querySelector(".apellido").value;
  let email = document.querySelector(".email__empleado").value;
  let usuario= document.querySelector(".usuario__empleados").value; 
  let usuarioContraseña = document.querySelector(".usuario__contraseña").value; 
  let dni = document.querySelector(".dni").value;

  console.log(nombre,apellido,email,usuario,usuarioContraseña,dni)

  localStorage.setItem("email",JSON.stringify(email)) 

  // Llamar a la función de validación
  
   if (!validarFormularioIngreso()) {
    return; // Si hay errores, no continuar  

   }


  try {  


    
    const response = await fetch(`${apiUrl}/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Esto indica que el cuerpo está en formato JSON
        },
        body: JSON.stringify({
           nombre,
          apellido,
          email,
          usuario,
          contrasena:usuarioContraseña,
           dni
        }),
      }); 
      console.log(response);
      

    

    // Asegúrate de que la respuesta es correcta antes de procesar 
   
    if (!response.ok) {
      // Si hay un error, lanza un error con el mensaje del backend
      const errorData = await response.json();
      throw new Error(errorData.error);
  } 


    console.log(response)
    let data = await response.json(); 
    console.log(data) 

    if(data.message){
        Swal.fire({
            title: '¡Registrado exitosamente!',
            text: data.message,
            icon: 'success',
            confirmButtonText: '¡Genial!'
          });
    }  



    // Manejar la respuesta del servidor
   

    if(data.message){ 

      setTimeout(() => { 
            window.location.href="./login.html"
        
      }, 3000);
  
    }


      
    }
      
    

    
   catch (err) {
    // Captura el error y muestra una alerta al usuario
 
    Swal.fire({
        title: '¡Error!',
        text: err.message, // Muestra el mensaje del backend
        icon: 'error',
        confirmButtonText: 'Intenta de nuevo',
    });
}

  e.target.reset(); // Resetea el formulario después de enviar 
 

   setTimeout(() => { 
    window.location.reload(); // Recargar la página para mostrar los cambios
    
   }, 6000);
});
