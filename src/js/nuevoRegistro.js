import {validacionNuevoFormulario} from "./validationNewForm.js"



const formulario=document?.getElementById("form-new-register") 



const apiUrl = import.meta.env.VITE_BACKEND_URL;






formulario.addEventListener('submit', async function(event){ 
    

    event.preventDefault() 

    const usuarioIngresado = document.getElementById("usuario-new-ingresado").value; 
    const passWordIngresado = document.getElementById("usuario-new-password").value; 
    console.log(usuarioIngresado,passWordIngresado)  
    console.log(passWordIngresado) 
 
 

     if(!validacionNuevoFormulario()){ 
        return

     } 

     try{ 

        const response= await fetch(`${apiUrl}/nuevo-registro`,{  
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            }, 
            credentials:"include",
            body:JSON.stringify({ 
                usuario:usuarioIngresado,
                password:passWordIngresado,
    
            })

        }) 

        if (!response.ok) {
            // Si hay un error, lanza un error con el mensaje del backend
            const errorData = await response.json();
            throw new Error(errorData.error);
        } 

        const data = await response.json()  
         // Paso 1: Recuperar lista actual
        let usuarios = JSON.parse(localStorage.getItem("usuario")) || [];

        // Paso 2: Eliminar al usuario si ya estaba
        usuarios = usuarios.filter(user => user !== usuarioIngresado);

        // Paso 3: Agregarlo al final
        usuarios.push(usuarioIngresado);

        // Paso 4: Guardar lista actualizada
        localStorage.setItem('usuario', JSON.stringify(usuarios));

        // Paso 5: Obtener el último usuario logueado
        const usuariosActualizados = JSON.parse(localStorage.getItem("usuario")) || [];
        const ultimoUsuario = usuariosActualizados[usuariosActualizados.length - 1]; // o .at(-1)

        console.log("Último usuario logueado:", ultimoUsuario);



        if(data.reedireccion){ 
            window.location.href = data.reedireccion

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
    


    this.reset()

})