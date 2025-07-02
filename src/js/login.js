
import { ValidacionformularioLogin } from "./validacionesLogin.js"; 
import { authenticatenUser } from "./Authenticated.js";
import { adminApi } from "./api/administradorApi.js";


const apiUrl=import.meta.env.VITE_BACKEND_URL
const formularioLogin = document.getElementById("login"); 
const containerCookies=document.getElementById('container-cookies') 
const botonAceptar=document.getElementById('boton-si') 
const botonRechazar=document.getElementById('boton-no') 
let enlace = document.querySelector('a'); 

enlace.style.pointerEvents = 'none';
enlace.style.opacity = '0.6';



// Muestra el enlace en la consola
console.log(enlace);



let cookiesDenegadas = true; 

setTimeout(() => { 

    containerCookies.classList.add('active-cookies') 
    botonAceptar.addEventListener('click',async(e)=>{  

        
        if(e.target.value==="si"){  
       
           cookiesDenegadas=false
           containerCookies.classList.remove('active-cookies') 
           enlace.style.pointerEvents = 'auto';
           enlace.style.opacity = '1';

           Swal.fire({
            title: "usted acepto las cookies ahora puede enviar el formulario de logueo",
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
        

    }) 

    botonRechazar.addEventListener('click',async(e)=>{  

        if(e.target.value==="no"){  
           
            cookiesDenegadas = true; 
            Swal.fire({
                title: "no va a poder ingresar tiene que aceptar las cookies",
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
            containerCookies.classList.remove('active-cookies') 
             
            setTimeout(() => {
                window.location.reload()
                
            }, 2000);
            
        }  
      

    }) 
  
}, 800);


 


formularioLogin.addEventListener("submit", async (e) => { 
    e.preventDefault(); 

    let administrador= await adminApi()
    
    if (cookiesDenegadas) {
        e.preventDefault();  // Esto evita que el formulario se envíe
        Swal.fire({
            title: "Debe de aceptar las cookies para continuar",
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

          setTimeout(() => {
            window.location.reload()
            
        }, 1000);
    }
   

    const usuarioIngresado = document.getElementById("usuario-ingresado").value; 
    const passWordIngresado = document.getElementById("usuario-password").value; 
    console.log(usuarioIngresado,passWordIngresado)  
    console.log(passWordIngresado)

    // Validación del formulario
    if (!ValidacionformularioLogin()) {   
        return;
    }

    try {
        // Solicitud al backend para iniciar sesión 
      
        const peticion = await fetch(`${apiUrl}/login-logeado`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", 
            body: JSON.stringify({
                userInto: usuarioIngresado,
                passwordInto: passWordIngresado,
            }),
        }); 
       
           console.log(peticion,'peticion') 
  

        // Manejo de errores de la petición
        if (!peticion.ok) { 
        
          
            const errorDatos = await peticion.json();
            Swal.fire({
              title: errorDatos.error,
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
            throw new Error(errorDatos.error);
        } 
        
        // Procesamiento de la respuesta del servidor
        let datos = await peticion.json();
   
       console.log(datos.userName) 

       const Users=JSON.parse(localStorage.getItem("usuario"))||[] 



      const userName = datos.userName ?? "null";  // Si viene null o undefined, lo convertimos a string "null"

      if (datos.token || datos.usuario || administrador) {
        // Elimina si ya existe (ya sea como string o null real)
        const index = Users.findIndex(user => String(user) === String(userName));
        if (index > -1) {
          Users.splice(index, 1);
        }
      
        // Evita duplicado antes de agregar
        const yaExiste = Users.some(user => String(user) === String(userName));
        if (!yaExiste) {
          Users.push(userName);
        }
        localStorage.removeItem("verificado")
        localStorage.setItem('usuario', JSON.stringify(Users));
        localStorage.setItem('token', datos.token);
      }
 

        if(datos){  
          await authenticatenUser()

          Swal.fire({
            title: `Fue autenticado el: ${datos.respuesta}`,
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

          setTimeout(() => { 
            window.location.href = datos.reedireccionar;
            
          }, 2500);

        
        } 

      
       
        


        else {
            alert("Token no recibido");
            return;
        }

    
      

       
         
    } catch (err) {
      // Captura el error y muestra una alerta al usuario
   
      Swal.fire({
          title: '¡Error!',
          text: err.message, // Muestra el mensaje del backend
          icon: 'error',
          confirmButtonText: 'Intenta de nuevo',
      });
  }
 

        e.target.reset
   
        
});  